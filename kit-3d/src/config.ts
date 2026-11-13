// Configuração do canal. Vale para todos os vídeos; um vídeo pode sobrescrever
// a voz no próprio `video.json`.
import type {NomeEstilo} from './kit/estilos';

export const FORMATO = {
  largura: 1080,
  altura: 1920,
  fps: 30,
} as const;

// Identidade do canal. No primeiro uso, o Claude monta isto com você (/estilo) e mostra
// prévias com `npm run estilo`.
export const MARCA: {
  nome: string;
  // Nome da série: aparece discretamente no topo do vídeo e no rodapé da capa.
  assinatura: string;
  // Visual base: 'noite' | 'papel' | 'oceano' | 'neon' (detalhes em src/kit/estilos.ts).
  estilo: NomeEstilo;
  // Cor de destaque própria (palavra acesa da legenda, títulos, barra), ex.: '#ff4d8d'.
  // null = a cor do estilo escolhido.
  destaque: string | null;
} = {
  nome: 'Pé de Trivela',
  assinatura: 'PÉ DE TRIVELA',
  estilo: 'noite',
  destaque: null,
};

// Duração obrigatória de todo vídeo (segundos): de 1min10s a 2min.
// `npm run voz` não gasta créditos se a estimativa ficar fora; `npm run render` bloqueia o final.
export const DURACAO = {
  minima: 70,
  maxima: 120,
} as const;

export const RITMO = {
  // Silêncio entre o fim da fala de uma cena e o início da próxima (segundos).
  // Curto de propósito: Reels pede ritmo.
  respiroEntreCenas: 0.12,
  // Quanto tempo a última cena segura depois da última palavra (segundos).
  seguraFinal: 0.8,
  // Caracteres falados por segundo na velocidade 1.0 (a estimativa multiplica pela
  // velocidade da voz). Calibrado com o ElevenLabs, voz Liam a 1.15: estima ~3% a mais que o real.
  caracteresPorSegundo: 17.5,
} as const;

export const VOZ = {
  // Voz do canal no ElevenLabs (o voice_id; `npm run vozes` lista as da sua conta).
  // Não é segredo: fica aqui. Se o .env tiver ELEVENLABS_VOICE_ID, ele vale no lugar desta.
  vozDoCanal: 'TX3LPaxmHKxFdv7VOQHJ',
  // Ordem de escolha do provedor: flag `--provedor` > `video.json` > ElevenLabs
  // se houver ELEVENLABS_API_KEY > Windows.
  // Perfil de voz do ElevenLabs para vídeos sem `voz.perfil` no video.json. Os vídeos novos
  // (modelos/video) já vêm com "expressiva"; "classica" mantém a voz dos vídeos antigos.
  perfilPadrao: 'expressiva' as 'classica' | 'expressiva',
  // Perfil "classica".
  elevenlabs: {
    modelo: 'eleven_multilingual_v2',
    formato: 'mp3_44100_128',
    // Código ISO 639-1. Só é enviado para modelos que aceitam (não o multilingual_v2).
    idioma: 'pt',
    configuracoes: {
      stability: 0.45,
      similarity_boost: 0.8,
      style: 0.15,
      use_speaker_boost: true,
      // 0.7 a 1.2. Reels pede fala rápida: 1.15 é rápido sem perder naturalidade.
      speed: 1.15,
    },
  },
  // Perfil "expressiva": o modelo eleven_v4, animado e com sotaque brasileiro (no v4, "pt" é o
  // português do Brasil; o eleven_v3 às vezes puxava para o de Portugal). Cada cena pode ter um tom
  // (`emocao` no video.json: excited, curious, whispers...), que vai para a voz e não para a legenda.
  // O v4 não tem controle de velocidade: cada cena sai acelerada (ffmpeg atempo, sem mudar o tom)
  // até `ritmo.palavrasPorSegundo`, e os tempos das palavras acompanham. 3,8 é o ritmo da voz
  // aprovada para o canal (a v3 acelerada 1,35x).
  elevenlabsExpressiva: {
    modelo: 'eleven_v4',
    formato: 'mp3_44100_128',
    idioma: 'pt',
    configuracoes: {
      stability: 0.5,
      similarity_boost: 0.8,
      use_speaker_boost: true,
      speed: 1.15,
    },
    ritmo: {palavrasPorSegundo: 3.8, aceleracaoMaxima: 1.6},
  },
  windows: {
    // Voz SAPI instalada no Windows (pt-BR). Serve como voz provisória gratuita.
    voz: 'Microsoft Maria Desktop',
    velocidade: 1.15,
  },
  // Margem depois da última palavra, antes de cortar o áudio da cena (segundos).
  margemFinal: 0.08,
} as const;

// Arquivo no Google Drive (via Google Drive para computador). `npm run arquivar -- <slug>`
// copia tudo para "<Meu Drive>/<pastaNoDrive>/Vídeos/<data> · <título>/" e libera o espaço local.
// A raiz do Drive é detectada sozinha (G:\Meu Drive...); para outra, defina DRIVE_RAIZ no .env.
export const ARQUIVO = {
  pastaNoDrive: 'Pé de Trivela',
} as const;

// Áudio. Só material feito por pessoas e com licença comercial (veja public/LICENCAS.md).
export const AUDIO = {
  // Música de fundo de todo vídeo (public/trilhas/). Um vídeo troca com "trilha" no video.json
  // ou desliga com "trilha": false.
  trilhaPadrao: 'holizna-blue-skies.mp3',
  // Volume da música entre as falas; durante a fala ela abaixa para `abafamento` × esse valor.
  volumeTrilha: 0.11,
  abafamento: 0.5,
  // Master: o render normaliza o vídeo inteiro (voz + música + efeitos) para o padrão das redes.
  loudnessAlvo: -14,
  picoMaximo: -1.5,
} as const;
