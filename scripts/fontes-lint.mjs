import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pastaProjetos } from '../src/programas.mjs';
import { lerRoteiro } from '../src/video/narracao/texto.mjs';
import { registrarFontesProjeto } from '../src/video/fontes-factuais.mjs';
import { gravarJson } from '../src/video/arquivo.mjs';

export function markdownFactual(r) {
  const linhas = ['# Evidências factuais', '', r.aprovado
    ? 'Registros e vínculos completos. Isso não comprova verdade factual.'
    : 'PENDENTE: resolva os itens abaixo antes de publicar.', '', '## Pendências', ''];
  linhas.push(...r.pendencias.map(p => `- ${p.msg}${p.beats?.length ? ` (beats: ${p.beats.join(', ')})` : ''}`));
  for (const fato of r.afirmacoes) {
    linhas.push('', `## ${fato.id}`, '', fato.texto || '', '', `Estado declarado: ${fato.estado}.`,
      `Falas: ${fato.trechos.join(', ') || 'somente na cena'}. Beats: ${fato.beats.join(', ') || 'ainda sem cena'}.`);
    for (const fonte of fato.fontes) linhas.push(`- ${fonte.publicador}: ${fonte.titulo}. ${fonte.url} (consulta: ${fonte.consultadaEm}).`);
    if (fato.ressalvas?.length) linhas.push('', 'Ressalvas:', ...fato.ressalvas.map(s => `- ${s}`));
  }
  return linhas.join('\n') + '\n';
}

export function executar(args, { projetosDir = pastaProjetos() } = {}) {
  const [nome, ...opcoes] = args;
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(nome || '') || opcoes.some(o => !['--video', '--iniciar', '--exportar'].includes(o))) {
    throw new Error('Uso: npm run fontes -- <projeto> [--iniciar] [--video] [--exportar]');
  }
  const pasta = path.join(projetosDir, nome);
  const base = fs.realpathSync(projetosDir), real = fs.realpathSync(pasta);
  if (path.dirname(real) !== base || fs.lstatSync(pasta).isSymbolicLink()) throw new Error('Projeto precisa estar dentro da pasta de projetos.');
  if (opcoes.includes('--iniciar')) {
    const destino = path.join(pasta, 'fontes.json');
    if (fs.existsSync(destino)) throw new Error('fontes.json já existe; preserve a pesquisa existente e edite os registros.');
    const roteiro = path.join(pasta, 'roteiro.md');
    if (fs.realpathSync(roteiro) !== path.join(real, 'roteiro.md')) throw new Error('roteiro.md precisa estar dentro do projeto, sem link simbólico.');
    const paragrafos = lerRoteiro(roteiro).split(/\n\s*\n/).map(s => s.replace(/\*/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    if (!paragrafos.length) throw new Error('Escreva o roteiro antes de iniciar o registro factual.');
    gravarJson(destino, { versao: 1, fontes: [],
      afirmacoes: paragrafos.map((s, i) => ({ id: `f-${i + 1}`, texto: s, estado: 'pendente', evidencias: [], ressalvas: [] })),
      trechos: paragrafos.map((s, i) => ({ id: `t-${i + 1}`, texto: s, tipo: 'factual', afirmacoes: [`f-${i + 1}`] })),
    });
  }
  const r = registrarFontesProjeto(pasta, { exigirVideo: opcoes.includes('--video') });
  if (opcoes.includes('--exportar')) fs.writeFileSync(path.join(pasta, 'saida', 'fontes-factuais.md'), markdownFactual(r));
  return r;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const r = executar(process.argv.slice(2));
    console.log(JSON.stringify(r, null, 2));
    process.exitCode = r.aprovado ? 0 : 1;
  } catch (erro) { console.error('Fontes: ' + erro.message); process.exitCode = 1; }
}
