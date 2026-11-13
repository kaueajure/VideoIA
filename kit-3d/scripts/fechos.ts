// npm run fechos [-- 10]
// Mostra como terminaram os últimos vídeos (as duas últimas falas de cada um, do mais novo para o mais
// antigo) e avisa as aberturas de fecho que já se repetiram. Rode ANTES de escrever o fecho de um vídeo
// novo: o fim tem de ser diferente dos últimos, ou o canal fica previsível.
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {RAIZ, rodar} from './lib/projeto';

// Aberturas de fecho que cansam quando se repetem (comparadas sem acento e sem caixa).
const DESGASTADAS: Array<[RegExp, string]> = [
  [/\bda proxima vez que\b/, '"Da próxima vez que…"'],
  [/\bhoje( a noite)?,? quando\b/, '"Hoje (à noite), quando…"'],
  [/\bquando (voce )?olhar\b/, '"Quando olhar…"'],
  [/\blembra:/, '"…lembra:"'],
];

const semAcento = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

rodar(async () => {
  const quantos = Number(process.argv[2]) || 10;
  const pasta = path.join(RAIZ, 'videos');
  const videos = readdirSync(pasta)
    .filter((d) => !d.startsWith('modelo-') && existsSync(path.join(pasta, d, 'video.json')))
    .map((d) => ({slug: d, quando: statSync(path.join(pasta, d, 'video.json')).mtimeMs}))
    .sort((a, b) => b.quando - a.quando)
    .slice(0, quantos);

  const contagem = new Map<string, string[]>();
  console.log(`Como terminaram os últimos ${videos.length} vídeos (do mais novo para o mais antigo):\n`);
  for (const {slug} of videos) {
    const video = JSON.parse(readFileSync(path.join(pasta, slug, 'video.json'), 'utf8')) as {cenas: Array<{narracao: string}>};
    const falas = video.cenas.map((c) => c.narracao.trim()).filter(Boolean).slice(-2);
    console.log(`  ${slug}\n    ${falas.join('\n    ')}\n`);
    const fim = semAcento(falas.join(' '));
    for (const [padrao, nome] of DESGASTADAS) {
      if (padrao.test(fim)) {
        contagem.set(nome, [...(contagem.get(nome) ?? []), slug]);
      }
    }
  }
  const repetidas = [...contagem].filter(([, slugs]) => slugs.length > 0);
  if (repetidas.length) {
    console.log('Aberturas já usadas nesses vídeos (NÃO repita no próximo):');
    for (const [nome, slugs] of repetidas) {
      console.log(`  ${nome}: ${slugs.length}× (${slugs.join(', ')})`);
    }
  }
  console.log('\nTipos de fecho para variar (escolha um que não apareça acima): pergunta específica · número final de impacto ·');
  console.log('volta ao gancho (fecha o círculo) · ironia ou virada seca · convite a testar · gancho para o próximo episódio ·');
  console.log('frase curta de efeito · fato bônus inesperado. Depois do fecho, a chamada para ação.');
});
