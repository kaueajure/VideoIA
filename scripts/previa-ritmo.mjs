// Dados sintéticos para verificar ritmo geral, sem voz ou chamadas pagas.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepararSpec } from '../src/video/preparar-spec.mjs';
import { renderizar, abrir, foto } from '../src/video/render.mjs';
import { analisarRitmoVisual } from '../src/video/ritmo-visual.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pasta = path.join(raiz, '.cache', 'ritmo-producao');
fs.mkdirSync(pasta, { recursive: true });
const recursos = [
  { forma: 'comparacao', unidade: ' reais', itens: [
    { rotulo: 'Projeto A', valor: 10, entra: 0, dur: 2.4 },
    { rotulo: 'Projeto B', valor: 20, entra: 3.2, dur: 2.4 },
  ] },
  { forma: 'comparacao', unidade: ' caixas', visual: 'unidades', simbolo: 'caixa', itens: [
    { rotulo: 'Entrega A', valor: 4, entra: 0, dur: 2.4 },
    { rotulo: 'Entrega B', valor: 8, entra: 3.2, dur: 2.4 },
  ] },
  { forma: 'causa-efeito', itens: [
    { rotulo: 'Pedido recebido', entra: 0, dur: 1.6 },
    { rotulo: 'Pedido conferido', entra: 2, dur: 1.6 },
    { rotulo: 'Serviço liberado', entra: 4.1, dur: 1.6 },
  ] },
];
const palavras = recursos.map((_, i) => ({ w: 'Demonstração', t: i * 7, f: i * 7 + 6.8 }));
const cena = { tema: 'Exemplos sintéticos de ritmo; dados ilustrativos', estilo: 'editorial',
  efeitos: { abertura: false, cauda: false, grao: 0 },
  beats: recursos.map((r, i) => ({ id: `exemplo${i}`, palavras: [i, i],
    titulo: { texto: 'Dados *ilustrativos*', entra: 0 },
    elementos: [{ id: `acao${i}`, tipo: 'recurso', entra: 0, ...r }],
  })) };
const spec = prepararSpec(cena, { palavras, duracao: 21 }, { pasta });
fs.writeFileSync(path.join(pasta, 'ritmo.json'), JSON.stringify(analisarRitmoVisual(cena, spec), null, 2));
const antes = structuredClone(cena);
antes.beats.forEach(b => b.elementos[0].itens.forEach(i => { i.dur = .4; }));
const specAntes = prepararSpec(antes, { palavras, duracao: 21 }, { pasta });
fs.writeFileSync(path.join(pasta, 'ritmo-entrada-breve.json'), JSON.stringify(analisarRitmoVisual(antes, specAntes), null, 2));
const saida = path.join(pasta, 'previa.mp4');
await renderizar(spec, { saida, fps: 24, escala: .5, workers: 2 });
const motor = await abrir(spec, { escala: .5 });
try {
  for (const [i, t] of [.4, 1.2, 2.6, 3.6, 4.5, 6, 7.4, 8.2, 9.6, 10.6, 11.5, 13,
    14.4, 15.2, 16.6, 17.6, 18.5, 20].entries()) {
    await foto(motor.paginas[0], t, path.join(pasta, `quadro-${String(i).padStart(2, '0')}.jpg`));
  }
} finally { await motor.fechar(); }
console.log(`Prévia geral, sem áudio: ${saida}`);
