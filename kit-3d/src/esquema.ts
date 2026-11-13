// Formato dos arquivos de cada vídeo:
//   videos/<slug>/video.json           -> esquemaVideo (escrito pelo Claude, aprovado por você)
//   videos/<slug>/audio/narracao.json  -> esquemaNarracao (gerado por `npm run voz`)
import {z} from 'zod';
import {NOMES_ESTILOS, type NomeEstilo} from './kit/estilos';

export const PADRAO_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const TRANSICOES = ['corte', 'flash', 'preto'] as const;

export const esquemaCena = z.object({
  id: z
    .string()
    .regex(PADRAO_SLUG, 'id da cena: só minúsculas, números e hífens (ex.: "gancho", "luz-branca")'),
  // Texto falado nesta cena. Pode ficar vazio numa cena só visual (use duracaoMinima).
  narracao: z.string(),
  // Nota de direção: o que aparece na tela. Guia quem escreve o código da cena.
  visual: z.string().default(''),
  // Duração mínima da cena em segundos (útil para cenas sem fala ou para segurar uma revelação).
  duracaoMinima: z.number().positive().optional(),
  // Silêncio depois da fala desta cena, em segundos (substitui o respiro padrão).
  pausaDepois: z.number().min(0).optional(),
  // Como esta cena entra.
  transicao: z.enum(TRANSICOES).default('corte'),
  // Tom da fala nesta cena, só no perfil de voz "expressiva" (eleven_v4), em inglês:
  // excited, curious, whispers, serious, surprised, laughs... Vai para a voz, não para a legenda.
  emocao: z.string().regex(/^[a-z][a-z ]{1,29}$/, 'emocao: palavras em inglês, minúsculas (ex.: "excited")').optional(),
});

export const esquemaVideo = z
  .object({
    titulo: z.string().min(1),
    // Só vira true depois que você aprova o roteiro. `npm run voz` exige isso.
    roteiroAprovado: z.boolean().default(false),
    resumo: z.string().default(''),
    fontes: z.array(z.object({titulo: z.string(), url: z.url()})).default([]),
    voz: z
      .object({
        provedor: z.enum(['elevenlabs', 'windows']).optional(),
        // Perfil do ElevenLabs (config.ts > VOZ): "expressiva" (eleven_v4, português do Brasil, acelerado) ou "classica".
        perfil: z.enum(['classica', 'expressiva']).optional(),
        // voice_id do ElevenLabs ou nome da voz do Windows.
        vozId: z.string().optional(),
        velocidade: z.number().min(0.7).max(1.2).optional(),
      })
      .default({}),
    // Faixa de duração só deste vídeo, em segundos (ex.: anúncio de story: {"minima": 30, "maxima": 60}).
    // Sem valor, vale DURACAO do config (1min10s a 2min).
    duracao: z.object({minima: z.number().positive(), maxima: z.number().positive()}).optional(),
    // Visual só deste vídeo (ex.: vídeo para um cliente). Sem valor, vale o estilo do canal (MARCA).
    estilo: z
      .object({
        base: z.enum(NOMES_ESTILOS as [NomeEstilo, ...NomeEstilo[]]),
        destaque: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
        assinatura: z.string().optional(),
      })
      .optional(),
    // Música de fundo: sem valor usa a trilha padrão do canal (config.ts); false desliga.
    trilha: z
      .union([
        z.object({
          arquivo: z.string(),
          volume: z.number().min(0).max(1).optional(),
        }),
        z.literal(false),
      ])
      .optional(),
    capa: z.object({
      cena: z.string(),
      // Ponto da cena (0 a 1) congelado como fundo da capa.
      momento: z.number().min(0).max(1).default(0.6),
      titulo: z.string(),
      // Palavra (ou trecho) do título pintada na cor de destaque.
      destaque: z.string().optional(),
    }),
    // Legenda do post. Sem fontes (elas ficam na ficha do arquivo). A chamada para ação convida a
    // compartilhar com um público ligado ao tema: "Mande para quem vive viajando".
    post: z
      .object({
        texto: z.string().default(''),
        chamada: z.string().default(''),
        hashtags: z.array(z.string()).default([]),
      })
      .default({texto: '', chamada: '', hashtags: []}),
    // Carrossel do Instagram (Estúdio Pro: `npm run carrossel`). Opcional: sem ele, as lâminas saem
    // das cenas e da narração. `laminas` são as do meio: a 1ª lâmina é a capa e a última, a chamada.
    carrossel: z
      .object({
        laminas: z
          .array(
            z.object({
              cena: z.string(),
              // Texto para LER (não a narração): até ~120 caracteres. *palavra* = cor de destaque.
              texto: z.string().min(1),
              // Ponto da cena (0 a 1) usado como imagem. Padrão: 1 (fim da cena, tudo em cena).
              momento: z.number().min(0).max(1).optional(),
            }),
          )
          .min(3)
          .max(8),
        // Frase principal da última lâmina. Padrão: post.chamada.
        chamada: z.string().optional(),
      })
      .optional(),
    cenas: z.array(esquemaCena).min(1),
  })
  .superRefine((video, ctx) => {
    const vistos = new Set<string>();
    video.cenas.forEach((cena, i) => {
      if (vistos.has(cena.id)) {
        ctx.addIssue({code: 'custom', path: ['cenas', i, 'id'], message: `id de cena repetido: "${cena.id}"`});
      }
      vistos.add(cena.id);
      if (cena.narracao.trim() === '' && cena.duracaoMinima === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['cenas', i, 'duracaoMinima'],
          message: `a cena "${cena.id}" não tem narração: defina duracaoMinima`,
        });
      }
    });
    if (!vistos.has(video.capa.cena)) {
      ctx.addIssue({code: 'custom', path: ['capa', 'cena'], message: `capa.cena "${video.capa.cena}" não existe em cenas`});
    }
    video.carrossel?.laminas.forEach((lamina, i) => {
      if (!vistos.has(lamina.cena)) {
        ctx.addIssue({code: 'custom', path: ['carrossel', 'laminas', i, 'cena'], message: `cena "${lamina.cena}" não existe em cenas`});
      }
    });
  });

export type Video = z.infer<typeof esquemaVideo>;
export type Cena = z.infer<typeof esquemaCena>;
export type Transicao = (typeof TRANSICOES)[number];

// Tempos em segundos, relativos ao início do áudio da cena.
export const esquemaPalavra = z.object({
  texto: z.string(),
  inicio: z.number().min(0),
  fim: z.number().min(0),
});

export const esquemaNarracaoCena = z.object({
  id: z.string(),
  arquivo: z.string(),
  provedor: z.enum(['elevenlabs', 'windows']),
  voz: z.string(),
  // Impressão digital de texto + voz + configurações: muda quando o áudio precisa ser refeito.
  hash: z.string(),
  texto: z.string(),
  // Duração útil (até a última palavra + margem). É o que a linha do tempo usa.
  duracao: z.number().positive(),
  duracaoArquivo: z.number().positive(),
  palavras: z.array(esquemaPalavra),
  // Ritmo natural da voz antes de acelerar (palavras/s com as pausas e só falando): serve para acelerar
  // o vídeo inteiro com o mesmo andamento em todas as cenas.
  taxaBruta: z.number().positive().optional(),
  taxaArticulacao: z.number().positive().optional(),
});

export const esquemaNarracao = z.object({
  versao: z.literal(1),
  atualizadoEm: z.string(),
  cenas: z.array(esquemaNarracaoCena),
});

export type Palavra = z.infer<typeof esquemaPalavra>;
export type NarracaoCena = z.infer<typeof esquemaNarracaoCena>;
export type Narracao = z.infer<typeof esquemaNarracao>;
