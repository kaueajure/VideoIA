// npm run roteiros                    → lista o banco de roteiros prontos (banco-de-roteiros/)
// npm run roteiros -- --validar [pasta] → confere as regras do método em todos os roteiros
// Para usar um: npm run novo -- <slug> --roteiro <número>
import path from 'node:path';
import {formatarTempo} from '../src/video/duracao';
import {ErroDeUso, RAIZ, rodar} from './lib/projeto';
import {lerDoBanco, listarBanco, PASTA_BANCO} from './lib/roteiros';

rodar(async () => {
  const validar = process.argv.includes('--validar');
  const pedida = process.argv.slice(2).find((a) => !a.startsWith('--'));
  const pasta = pedida ? path.resolve(RAIZ, pedida) : PASTA_BANCO;
  const itens = listarBanco(pasta);
  if (itens.length === 0) {
    throw new ErroDeUso(
      `Nenhum roteiro em ${path.relative(RAIZ, pasta) || pasta}. O banco de 100 roteiros prontos é um bônus: copie a pasta banco-de-roteiros/ para a raiz do kit.`,
    );
  }

  let comErro = 0;
  let categoria = '';
  const titulos = new Map<string, number>();
  for (const item of itens) {
    const {video, erros, avisos, segundos, palavras} = lerDoBanco(item);
    if (video) {
      const chave = video.titulo.toLowerCase();
      if (titulos.has(chave)) {
        erros.push(`título repetido (igual ao ${titulos.get(chave)})`);
      }
      titulos.set(chave, item.numero);
    }
    if (item.categoria !== categoria) {
      categoria = item.categoria;
      console.log(`\n${categoria.toUpperCase()}`);
    }
    const num = String(item.numero).padStart(3, '0');
    const marca = erros.length ? '✖' : avisos.length && validar ? '·' : ' ';
    console.log(`${marca} ${num}  ${(video?.titulo ?? item.slug).padEnd(58).slice(0, 58)} ${segundos ? formatarTempo(segundos) : '--'}${validar ? `  ${palavras} palavras` : ''}`);
    if (validar) {
      for (const e of erros) {
        console.log(`      ✖ ${e}`);
      }
      for (const a of avisos) {
        console.log(`      · ${a}`);
      }
    }
    if (erros.length) {
      comErro++;
    }
  }
  console.log(`\n${itens.length} roteiros${validar ? ` · ${comErro} com erro` : ''}. Para usar um: npm run novo -- <slug> --roteiro <número>`);
  if (validar && comErro) {
    process.exitCode = 1;
  }
});
