// Efeitos sonoros do canal: uma paleta pequena e coerente (Kenney, CC0, feita por pessoas).
// Regras anti "AI slop": poucos efeitos (1–2 por cena), só em eventos visuais com significado,
// no quadro exato do evento, baixos sob a voz. Nada de whoosh em todo corte, nada de meme.
import {Audio} from '@remotion/media';
import React, {useContext} from 'react';
import {getStaticFiles, random, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ContextoCena, ContextoLinha} from '../video/contexto';

// Cada tipo tem variações (escolhidas de forma determinística para não repetir sempre o mesmo som).
export const SONS = {
  // Objeto 3D importante aparece (bloop suave, tom médio).
  surgir: ['drop_002.wav', 'drop_003.wav', 'drop_004.wav'],
  // Rótulo/texto entra (clique mínimo). Use com parcimônia.
  texto: ['select_002.wav', 'select_007.wav'],
  // Luz/feixe viajando, algo subindo (varredura ascendente).
  luz: ['maximize_004.wav', 'maximize_005.wav'],
  // Câmera mergulhando, algo descendo ou sumindo (varredura descendente).
  mergulho: ['minimize_004.wav', 'minimize_005.wav'],
  // Revelação, resposta, número importante (carrilhão claro).
  revelar: ['confirmation_002.wav', 'confirmation_003.wav'],
  // Pergunta/dúvida na tela.
  pergunta: ['question_001.wav', 'question_003.wav'],
  // Brilho, dispersão de cores, "mágica" da física.
  brilho: ['glass_004.wav'],
  // Ideia/descoberta (lâmpada acendendo).
  ideia: ['confirmation_004.wav'],
} as const;

export type TipoSom = keyof typeof SONS;

// Volumes relativos à narração (que fica bem acima). A master normaliza o conjunto depois.
const VOLUME: Record<TipoSom, number> = {
  surgir: 0.12,
  texto: 0.08,
  luz: 0.1,
  mergulho: 0.12,
  revelar: 0.14,
  pergunta: 0.14,
  brilho: 0.1,
  ideia: 0.12,
};

export type PropsSom = (
  | {
      // Um tipo da paleta acima (o jeito normal).
      tipo: TipoSom;
      arquivo?: never;
    }
  | {
      // Ou um arquivo específico de public/sons/ (ex.: do pacote de som extra, listado em
      // public/sons/sons.json). Mesmas regras: só em evento com significado.
      arquivo: string;
      tipo?: never;
    }
) & {
  // Quadro (relativo à cena) em que o som toca: o mesmo do evento visual.
  em: number;
  // Multiplica o volume padrão (0.5 = metade).
  intensidade?: number;
  // Quadros que o som pode durar (ambiências longas, como vento ou mar). Padrão: 45.
  duracao?: number;
  // Quadros do ARQUIVO pulados no começo: o som começa do meio (uma ambiência que continua de onde
  // estava na cena anterior). Padrão: 0, do começo.
  inicioNoArquivo?: number;
  // Multiplica o volume quadro a quadro (o quadro é contado a partir de `em`): fade, silêncio no clímax.
  envelope?: (quadro: number) => number;
};

// Volume de um arquivo avulso: igual ao dos efeitos médios da paleta.
const VOLUME_ARQUIVO = 0.12;

// Arquivos que existem em public/ (os do Pacote de som só existem para quem tem o pacote).
let arquivosPublicos: Set<string> | null = null;
const existeEmPublic = (caminho: string) => {
  if (!arquivosPublicos) {
    arquivosPublicos = new Set(getStaticFiles().map((f) => f.name.replace(/\\/g, '/')));
  }
  // Sem a lista (ambiente que não a fornece), não bloqueia nada.
  return arquivosPublicos.size === 0 || arquivosPublicos.has(caminho);
};

// Efeito sonoro. Fica FORA do <Palco> (é áudio, não 3D). Um `arquivo` que não existe em public/sons/
// (ex.: ambiência do Pacote de som num kit sem o pacote) é pulado em silêncio, sem quebrar o render.
export const Som: React.FC<PropsSom> = ({tipo, arquivo, em, intensidade = 1, duracao = 45, inicioNoArquivo = 0, envelope}) => {
  const frame = useCurrentFrame();
  if (arquivo && !existeEmPublic(`sons/${arquivo}`)) {
    return null;
  }
  const nome = arquivo ?? (() => {
    const opcoes = SONS[tipo as TipoSom];
    return opcoes[Math.floor(random(`som-${tipo}-${em}`) * opcoes.length) % opcoes.length];
  })();
  const inicio = Math.max(0, Math.round(em));
  const fator = envelope ? Math.max(0, envelope(frame - inicio)) : 1;
  const volume = (arquivo ? VOLUME_ARQUIVO : VOLUME[tipo as TipoSom]) * intensidade * fator;
  const pular = Math.max(0, Math.round(inicioNoArquivo));
  return (
    <Sequence from={inicio} durationInFrames={Math.max(1, Math.round(duracao))} layout="none" name={`som: ${tipo ?? nome}`}>
      <Audio src={staticFile(`sons/${nome}`)} volume={volume} trimBefore={pular > 0 ? pular : undefined} />
    </Sequence>
  );
};

export type PropsAmbienciaContinua = {
  // Arquivo de public/sons/ (ambiência do catálogo public/sons/sons.json).
  arquivo: string;
  // Duração do arquivo em segundos (para repetir sem buraco nem sobreposição).
  duracaoDoArquivo: number;
  // Trecho do VÍDEO (quadros do vídeo inteiro, como useMundo().quadro) em que a ambiência toca.
  // Padrão: o vídeo todo.
  de?: number;
  ate?: number;
  intensidade?: number;
  // Volume quadro a quadro, recebendo o quadro DO VÍDEO (fades, silêncio no clímax, troca de época).
  envelope?: (quadroDoVideo: number) => number;
  // Para sons de "evento" (onda quebrando, trovão): repete com intervalo sorteado [mín, máx] em segundos
  // (pode sobrepor) e volume sorteado [mín, máx]. Sem isto, o arquivo repete emendado.
  variar?: {intervalo: [number, number]; volume?: [number, number]};
  semente?: string;
};

// Ambiência que atravessa as cenas sem recomeçar a cada corte: as repetições ficam presas ao relógio do
// VÍDEO, e cada cena toca só o pedaço que cai dentro dela (começando do ponto certo do arquivo). Ponha a
// MESMA <AmbienciaContinua> em todas as cenas do trecho (fora do <Palco>):
//   <AmbienciaContinua arquivo="ambiencia-ondas-praia.mp3" duracaoDoArquivo={4} intensidade={0.6}
//     variar={{intervalo: [2.9, 4.3], volume: [0.75, 1]}} />
//   <AmbienciaContinua arquivo="ambiencia-vento.mp3" duracaoDoArquivo={60} de={mundo.inicioDa('noite')} intensidade={0.4} />
// Fora de um vídeo (vitrine), o relógio é o da própria cena.
export const AmbienciaContinua: React.FC<PropsAmbienciaContinua> = ({
  arquivo,
  duracaoDoArquivo,
  de = 0,
  ate,
  intensidade = 1,
  envelope,
  variar,
  semente = arquivo,
}) => {
  const cena = useContext(ContextoCena);
  const linha = useContext(ContextoLinha);
  const {fps, durationInFrames} = useVideoConfig();
  const inicioDaCena = cena?.inicio ?? 0;
  const fimDaCena = inicioDaCena + (cena?.duracao ?? durationInFrames);
  const fimDoTrecho = Math.min(ate ?? linha?.duracao ?? fimDaCena, linha?.duracao ?? Infinity);
  const tamanho = Math.max(1, Math.round(duracaoDoArquivo * fps));
  const pedacos: Array<{inicio: number; volume: number; chave: number}> = [];
  // Repetições no relógio do vídeo (determinísticas: a mesma em todas as cenas).
  let t = Math.round(de);
  for (let k = 0; t < fimDoTrecho && k < 10000; k++) {
    const volume = variar?.volume ? variar.volume[0] + (variar.volume[1] - variar.volume[0]) * random(`${semente}-v-${k}`) : 1;
    if (t < fimDaCena && t + tamanho > inicioDaCena) {
      pedacos.push({inicio: t, volume, chave: k});
    }
    const passo = variar ? Math.round(fps * (variar.intervalo[0] + (variar.intervalo[1] - variar.intervalo[0]) * random(`${semente}-i-${k}`))) : tamanho;
    t += Math.max(1, passo);
  }
  return (
    <>
      {pedacos.map(({inicio, volume, chave}) => {
        const comeco = Math.max(inicio, inicioDaCena, Math.round(de));
        const fim = Math.min(inicio + tamanho, fimDaCena, fimDoTrecho);
        if (fim <= comeco) {
          return null;
        }
        const em = comeco - inicioDaCena;
        return (
          <Som
            key={chave}
            arquivo={arquivo}
            em={em}
            duracao={fim - comeco}
            inicioNoArquivo={comeco - inicio}
            intensidade={intensidade * volume}
            envelope={envelope ? (q) => envelope(comeco + q) : undefined}
          />
        );
      })}
    </>
  );
};
