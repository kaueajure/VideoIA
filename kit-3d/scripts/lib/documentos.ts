// Documentos legíveis que acompanham cada vídeo no arquivo do Drive.
import {FORMATO, MARCA} from '../../src/config';
import type {Narracao, Video} from '../../src/esquema';
import {formatarTempo} from '../../src/video/duracao';
import type {LinhaDoTempo} from '../../src/video/linhaDoTempo';

const tempo = (quadro: number) => formatarTempo(quadro / FORMATO.fps);

export const gerarRoteiroLegivel = (video: Video, linha: LinhaDoTempo): string => {
  const linhas = [
    `# ${video.titulo}`,
    '',
    `${MARCA.nome} · ${tempo(linha.duracao)} · ${video.cenas.length} cenas`,
    '',
    video.resumo ? `> ${video.resumo}\n` : '',
  ];
  video.cenas.forEach((cena, i) => {
    const noTempo = linha.cenas[i];
    linhas.push(`## ${i + 1}. ${cena.id} (${tempo(noTempo.inicio)})`, '');
    linhas.push(`**Narração:** ${cena.narracao || '(sem fala)'}`, '');
    if (cena.visual) {
      linhas.push(`**Visual:** ${cena.visual}`, '');
    }
  });
  linhas.push(
    '## Post',
    '',
    video.post.texto,
    '',
    video.post.chamada ? `**Chamada:** ${video.post.chamada}` : '',
    '',
    video.post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' '),
    '',
  );
  if (video.fontes.length) {
    linhas.push('## Fontes', '', ...video.fontes.map((f) => `- ${f.titulo}: ${f.url}`), '');
  }
  return `${linhas.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
};

export const gerarFichaTecnica = ({
  slug,
  video,
  linha,
  narracao,
  data,
  vozDescricao,
}: {
  slug: string;
  video: Video;
  linha: LinhaDoTempo;
  narracao: Narracao | null;
  data: string;
  vozDescricao: string;
}): string => {
  const caracteres = narracao?.cenas.reduce((s, c) => s + c.texto.length, 0) ?? 0;
  return `# ${video.titulo}

| | |
|---|---|
| Canal | ${MARCA.nome} |
| Identificador | ${slug} |
| Produzido em | ${data} |
| Duração | ${tempo(linha.duracao)} (${linha.duracao} quadros a ${FORMATO.fps} fps) |
| Formato | ${FORMATO.largura}×${FORMATO.altura} (vertical 9:16), H.264 + AAC |
| Cenas | ${video.cenas.length} |
| Voz | ${vozDescricao} |
| Narração | ${caracteres.toLocaleString('pt-BR')} caracteres |

${video.resumo}

## Fontes

${video.fontes.map((f) => `- ${f.titulo}: ${f.url}`).join('\n') || '- (nenhuma registrada)'}

## O que tem nesta pasta

- **01 Publicação**: o que vai para as redes (vídeo, capa, legenda .srt e texto do post).
- **02 Roteiro**: roteiro legível, cena por cena, com a direção visual.
- **03 Projeto**: arquivos para refazer ou editar o vídeo (roteiro, código das cenas e áudios).
- **04 Prévia**: folha de contato com um quadro por cena.

## Como refazer o vídeo

1. Copie o conteúdo de \`03 Projeto\` para \`videos/${slug}/\` no projeto ${MARCA.nome}.
2. Rode \`npm run render -- ${slug}\` (a narração já está pronta, não gasta créditos).
`;
};

const CABECALHO_INDICE = `# ${MARCA.nome} — índice de vídeos

| Data | Título | Duração | Pasta | Identificador |
|---|---|---|---|---|`;

// Mantém uma linha por vídeo (atualiza se o vídeo for arquivado de novo).
export const atualizarIndice = (
  atual: string | null,
  entrada: {data: string; titulo: string; duracao: string; pasta: string; slug: string},
): string => {
  const linhas = (atual ?? '')
    .split('\n')
    .filter((l) => l.startsWith('| ') && !l.startsWith('| Data') && !l.startsWith('|---'))
    .filter((l) => !l.trim().endsWith(`| ${entrada.slug} |`));
  linhas.push(`| ${entrada.data} | ${entrada.titulo} | ${entrada.duracao} | Vídeos/${entrada.pasta} | ${entrada.slug} |`);
  linhas.sort();
  return `${CABECALHO_INDICE}\n${linhas.join('\n')}\n`;
};
