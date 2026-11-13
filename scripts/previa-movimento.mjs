// Demonstração sintética do motor, sem voz, pesquisa, chamadas pagas ou projetos reais.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepararSpec } from '../src/video/preparar-spec.mjs';
import { renderizar } from '../src/video/render.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pasta = path.join(raiz, '.cache', 'producao-movimento');
const frases = ['Comparar quantidades com objetos em movimento',
  'O todo se divide preservando cada objeto', 'Um esquema mostra deslocamento e passe'];
let i = 0;
const palavras = frases.flatMap((f, b) => f.split(' ').map((w, j) => ({ w, t: b * 4 + j * .45, f: b * 4 + j * .45 + .4 })));
const elementos = [
  { forma: 'comparacao', visual: 'unidades', simbolo: 'bola', unidade: ' gols',
    itens: [{ rotulo: 'Exemplo A', valor: 8, entra: .1 }, { rotulo: 'Exemplo B', valor: 5, entra: 1.3 }] },
  { forma: 'decomposicao', simbolo: 'bola', total: 8, rotuloTotal: 'Total ilustrativo', separarEm: 'divide', dur: 1.1,
    itens: [{ rotulo: 'Parte A', valor: 7 }, { rotulo: 'Parte B', valor: 1 }] },
  { forma: 'campo-tatico', jogadores: [
    { id: 'a', rotulo: 'Apoio', time: 'a', pos: [.2, .7] },
    { id: 'b', rotulo: 'Ponta', time: 'a', pos: [.7, .6], destino: [.7, .2], moverEm: .3, dur: .8 },
    { id: 'c', rotulo: 'Defesa', time: 'b', pos: [.4, .3] }],
    passes: [{ de: 'a', para: 'b', em: .6, dur: .8 }, { de: 'b', para: 'a', em: 2.3, dur: .7 }] },
];
const cena = { estilo: 'editorial', tema: 'Demonstração de movimento; dados fictícios',
  efeitos: { abertura: false, cauda: false, grao: 0 },
  beats: elementos.map((el, b) => {
    const primeira = i; i += frases[b].split(' ').length;
    return { id: `demo${b}`, palavras: [primeira, i - 1],
      elementos: [{ ...el, id: `recurso${b}`, tipo: 'recurso', entra: 0 }] };
  }) };
fs.mkdirSync(pasta, { recursive: true });
const spec = prepararSpec(cena, { palavras, duracao: 12 }, { pasta });
const saida = path.join(pasta, 'previa.mp4');
await renderizar(spec, { saida, fps: 24, escala: .5, workers: 2 });
console.log(`Prévia sintética, sem áudio: ${saida}`);
