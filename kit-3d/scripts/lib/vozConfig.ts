// Qual voz um vídeo usa e a "impressão digital" de cada cena narrada.
// Compartilhado por `npm run voz` (decide o que refazer) e `npm run status` (avisa o que está velho).
import {VOZ} from '../../src/config';
import type {Cena, Video} from '../../src/esquema';
import {impressaoDigital} from './projeto';

export type Provedor = 'elevenlabs' | 'windows';
export type PerfilVoz = 'classica' | 'expressiva';

export type ConfigElevenLabs = {
  modelo: string;
  formato: string;
  idioma: string;
  configuracoes: Record<string, unknown>;
  // Aceleração fixa depois de gerar (atempo)...
  aceleracao?: number;
  // ...ou até um ritmo de fala, cena a cena (não desacelera; no máximo `aceleracaoMaxima`).
  ritmo?: {palavrasPorSegundo: number; aceleracaoMaxima: number};
};

export type VozResolvida = {
  provedor: Provedor;
  vozId: string;
  velocidade: number;
  perfil: PerfilVoz;
  configuracao: unknown;
};

export const configDoPerfil = (perfil: PerfilVoz): ConfigElevenLabs =>
  perfil === 'expressiva' ? VOZ.elevenlabsExpressiva : VOZ.elevenlabs;

// Ordem: flag --provedor > video.json > ElevenLabs se houver chave > Windows.
export const resolverVoz = (video: Video, provedorPedido?: string): VozResolvida => {
  const provedor = (provedorPedido ?? video.voz.provedor ?? (process.env.ELEVENLABS_API_KEY ? 'elevenlabs' : 'windows')) as Provedor;
  const perfil: PerfilVoz = video.voz.perfil ?? VOZ.perfilPadrao;
  const cfg = configDoPerfil(perfil);
  const vozId =
    provedor === 'elevenlabs'
      ? (video.voz.vozId ?? (process.env.ELEVENLABS_VOICE_ID?.trim() || VOZ.vozDoCanal))
      : (video.voz.vozId ?? VOZ.windows.voz);
  const velocidade = video.voz.velocidade ?? (provedor === 'elevenlabs' ? (cfg.configuracoes.speed as number) : VOZ.windows.velocidade);
  const configuracao = provedor === 'elevenlabs' ? {...cfg, configuracoes: {...cfg.configuracoes, speed: velocidade}} : {velocidade};
  return {provedor, vozId, velocidade, perfil, configuracao};
};

// O texto que de fato vai para a voz: no perfil expressivo, o tom da cena entra como [tag].
export const textoParaVoz = (cena: Pick<Cena, 'narracao' | 'emocao'>, voz: VozResolvida): string => {
  const texto = cena.narracao.trim();
  return voz.provedor === 'elevenlabs' && voz.perfil === 'expressiva' && cena.emocao ? `[${cena.emocao}] ${texto}` : texto;
};

export const hashDaCena = (texto: string, voz: VozResolvida): string =>
  impressaoDigital({texto, provedor: voz.provedor, vozId: voz.vozId, configuracao: voz.configuracao});
