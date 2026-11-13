// ElevenLabs Text-to-Speech com tempos por caractere:
// POST /v1/text-to-speech/{voice_id}/with-timestamps
import {renameSync, writeFileSync} from 'node:fs';
import {VOZ} from '../../src/config';
import type {Palavra} from '../../src/esquema';
import {palavrasDoAlinhamento, type AlinhamentoElevenLabs} from '../lib/alinhamento';
import {ffmpeg} from '../lib/ffmpeg';
import {ErroDeUso} from '../lib/projeto';
import type {ConfigElevenLabs} from '../lib/vozConfig';

const API = 'https://api.elevenlabs.io';

type Resposta = {
  audio_base64: string;
  alignment: AlinhamentoElevenLabs | null;
  normalized_alignment: AlinhamentoElevenLabs | null;
};

const chave = (): string => {
  const valor = process.env.ELEVENLABS_API_KEY?.trim();
  if (!valor) {
    throw new ErroDeUso('ELEVENLABS_API_KEY não está definida no .env.');
  }
  return valor;
};

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

const explicarErro = (status: number, corpo: string): string => {
  let detalhe = corpo;
  try {
    const json = JSON.parse(corpo) as {detail?: {status?: string; message?: string} | unknown};
    const d = json.detail as {status?: string; message?: string} | undefined;
    if (d && typeof d === 'object' && 'message' in d) {
      detalhe = `${d.status ?? ''} ${d.message ?? ''}`.trim();
    } else if (json.detail) {
      detalhe = JSON.stringify(json.detail);
    }
  } catch {
    // corpo não é JSON: mostra como veio
  }
  const dicas: Record<number, string> = {
    401: 'Chave inválida, sem permissão para Text to Speech, ou créditos esgotados.',
    402: 'Plano sem créditos suficientes.',
    404: 'voice_id não encontrado. Rode `npm run vozes` para ver as vozes da sua conta.',
    422: 'Parâmetros recusados pela API.',
    429: 'Muitas requisições ao mesmo tempo. Tente de novo em instantes.',
  };
  return `ElevenLabs respondeu ${status}. ${dicas[status] ?? ''}\n${detalhe}`.trim();
};

export const pedirElevenLabs = async <T>(caminho: string, init: RequestInit = {}): Promise<T> => {
  for (let tentativa = 1; ; tentativa++) {
    const resposta = await fetch(`${API}${caminho}`, {
      ...init,
      headers: {'xi-api-key': chave(), Accept: 'application/json', ...init.headers},
    });
    if (resposta.ok) {
      return (await resposta.json()) as T;
    }
    const corpo = await resposta.text();
    if ((resposta.status === 429 || resposta.status >= 500) && tentativa < 4) {
      await esperar(1500 * tentativa);
      continue;
    }
    throw new ErroDeUso(explicarErro(resposta.status, corpo));
  }
};

// Quanto acelerar a cena: até o ritmo alvo (palavras por segundo, do começo da 1ª ao fim da última
// palavra), sem desacelerar e sem passar do máximo; sem `ritmo`, a aceleração fixa.
export const fatorDeAceleracao = (cfg: ConfigElevenLabs, palavras: Palavra[]): number => {
  if (!cfg.ritmo || palavras.length < 2) {
    return cfg.aceleracao ?? 1;
  }
  const fala = palavras[palavras.length - 1].fim - palavras[0].inicio;
  if (fala <= 0) {
    return 1;
  }
  return Math.min(cfg.ritmo.aceleracaoMaxima, Math.max(1, cfg.ritmo.palavrasPorSegundo / (palavras.length / fala)));
};

export type RitmoDaFala = {
  // Palavras/s do começo da 1ª ao fim da última palavra (com as pausas).
  geral: number;
  // Palavras/s só falando: pausas entre palavras contam no máximo 0,15 s. É o "andamento" que o
  // ouvido percebe; uma frase com pausa no meio não pode parecer lenta por causa da pausa.
  articulacao: number;
};

export const ritmoDaFala = (palavras: Palavra[]): RitmoDaFala | null => {
  if (palavras.length < 3) {
    return null;
  }
  const fala = palavras[palavras.length - 1].fim - palavras[0].inicio;
  let falando = 0;
  palavras.forEach((p, i) => {
    falando += Math.max(0, p.fim - p.inicio);
    if (i > 0) {
      falando += Math.min(0.15, Math.max(0, p.inicio - palavras[i - 1].fim));
    }
  });
  return fala > 0 && falando > 0 ? {geral: palavras.length / fala, articulacao: palavras.length / falando} : null;
};

const mediana = (valores: number[]) => {
  const v = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(v.length / 2);
  return v.length % 2 ? v[meio] : (v[meio - 1] + v[meio]) / 2;
};

// Aceleração do VÍDEO inteiro. O fator do vídeo leva a mediana do ritmo geral até o alvo do canal; cada
// cena ajusta só o bastante para todas terem o MESMO andamento de fala (articulação), no máximo ±15%
// em volta do fator do vídeo. Antes cada cena ia sozinha até o alvo medindo as pausas junto: uma frase
// com pausa no meio levava aceleração máxima e saía corrida, e o ritmo mudava de cena para cena.
export const fatoresDoVideo = (cfg: ConfigElevenLabs, ritmos: RitmoDaFala[]) => {
  const ritmo = cfg.ritmo;
  if (!ritmo || ritmos.length === 0) {
    return () => cfg.aceleracao ?? 1;
  }
  const limitar = (f: number) => Math.min(ritmo.aceleracaoMaxima, Math.max(1, f));
  const doVideo = limitar(ritmo.palavrasPorSegundo / mediana(ritmos.map((r) => r.geral)));
  const articulacaoAlvo = mediana(ritmos.map((r) => r.articulacao));
  return (r: RitmoDaFala | null) => {
    const proprio = r ? doVideo * (articulacaoAlvo / r.articulacao) : doVideo;
    return Math.round(limitar(Math.min(doVideo * 1.15, Math.max(doVideo * 0.85, proprio))) * 1000) / 1000;
  };
};

// Acelera o arquivo (atempo mantém o tom) e encolhe os tempos das palavras na mesma proporção.
export const acelerarAudio = async (arquivo: string, palavras: Palavra[], fator: number): Promise<void> => {
  if (fator === 1) {
    return;
  }
  const temporario = `${arquivo}.acelerando.mp3`;
  await ffmpeg(['-y', '-i', arquivo, '-filter:a', `atempo=${fator}`, '-c:a', 'libmp3lame', '-b:a', '128k', temporario]);
  renameSync(temporario, arquivo);
  for (const palavra of palavras) {
    palavra.inicio = Math.round((palavra.inicio / fator) * 1000) / 1000;
    palavra.fim = Math.round((palavra.fim / fator) * 1000) / 1000;
  }
};

export const gerarComElevenLabs = async ({
  texto,
  anterior,
  proximo,
  vozId,
  velocidade,
  cfg = VOZ.elevenlabs,
  arquivo,
  acelerar = true,
}: {
  // Texto para a voz (no perfil expressivo pode começar com o tom da cena, como "[excited] ...").
  texto: string;
  anterior: string | null;
  proximo: string | null;
  vozId: string;
  velocidade: number;
  cfg?: ConfigElevenLabs;
  arquivo: string;
  // false: devolve o áudio no ritmo natural (o `npm run voz` acelera o vídeo inteiro de uma vez).
  acelerar?: boolean;
}): Promise<{palavras: Palavra[]}> => {
  const v3 = cfg.modelo === 'eleven_v3';
  const corpo: Record<string, unknown> = {
    text: texto,
    model_id: cfg.modelo,
    voice_settings: {...cfg.configuracoes, speed: velocidade},
  };
  // Contexto das cenas vizinhas: mantém a entonação contínua entre os áudios separados.
  // O eleven_v3 recusa esse contexto (400): nele, o tom de cada cena vem da `emocao`.
  if (anterior && !v3) {
    corpo.previous_text = anterior;
  }
  if (proximo && !v3) {
    corpo.next_text = proximo;
  }
  if (cfg.modelo !== 'eleven_multilingual_v2') {
    corpo.language_code = cfg.idioma;
  }

  const resposta = await pedirElevenLabs<Resposta>(
    `/v1/text-to-speech/${encodeURIComponent(vozId)}/with-timestamps?output_format=${cfg.formato}`,
    {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(corpo)},
  );
  const alinhamento = resposta.alignment ?? resposta.normalized_alignment;
  if (!alinhamento) {
    throw new Error('ElevenLabs não devolveu o alinhamento por caractere.');
  }
  writeFileSync(arquivo, Buffer.from(resposta.audio_base64, 'base64'));
  const palavras = palavrasDoAlinhamento(alinhamento);

  // Aceleração depois de gerar (o v3 ignora `speed` e o v4 não tem): atempo mantém o tom.
  if (acelerar) {
    await acelerarAudio(arquivo, palavras, Math.round(fatorDeAceleracao(cfg, palavras) * 1000) / 1000);
  }
  return {palavras};
};
