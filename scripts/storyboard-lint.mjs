import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compilar } from '../src/video/plano.mjs';
import { validarSujeitosDaCena, avisosStoryboard } from '../src/video/sujeito.mjs';
import { conferirStoryboard } from '../src/video/protecao-storyboard.mjs';

// Esta análise confere o plano executável. A aparência exige revisão dos quadros.
export function analisarStoryboard(cena, falado, { estrito = false, spec: specFinal = null } = {}) {
  const falhas = [];
  const palavras = falado?.palavras;
  if (!Array.isArray(palavras) || !palavras.length || palavras.some(p =>
    typeof p?.w !== 'string' || !Number.isFinite(p.t) || !Number.isFinite(p.f) || p.f < p.t)) {
    return { aprovado: false, falhas: ['palavras.json sem narração alinhada válida.'], avisos: [], planos: [] };
  }
  const beats = cena?.beats;
  if (!Array.isArray(beats) || !beats.length) {
    return { aprovado: false, falhas: ['cena.json sem beats.'], avisos: [], planos: [] };
  }
  if (beats.some(beat => !beat || typeof beat !== 'object' || Array.isArray(beat))) {
    return { aprovado: false, falhas: ['Beat inválido.'], avisos: [], planos: [] };
  }
  if (estrito && cena.tempo === 'fixo') falhas.push('A direção detalhada exige sincronização por palavras, sem tempo fixo.');
  const validacao = validarSujeitosDaCena(cena);
  falhas.push(...validacao.erros);
  const avisos = [...validacao.avisos, ...avisosStoryboard(cena, palavras, { forcar: true })];
  const ids = new Set();
  let proxima = 0;
  for (const beat of beats) {
    if (!beat || typeof beat !== 'object') {
      falhas.push('Beat inválido.');
      continue;
    }
    if (!beat.id || ids.has(beat.id)) falhas.push('Cada beat precisa de id único.');
    ids.add(beat.id);
    const faixa = beat.palavras;
    if (!Array.isArray(faixa) || faixa.length !== 2 || !faixa.every(Number.isInteger)
        || faixa[0] < 0 || faixa[1] < faixa[0] || faixa[1] >= palavras.length) {
      falhas.push(`${beat.id}: use palavras [primeira, última] dentro da narração.`);
      continue;
    }
    if (faixa[0] !== proxima) falhas.push(`${beat.id}: lacuna ou sobreposição na palavra ${proxima}.`);
    proxima = faixa[1] + 1;
    if (!estrito) continue;
    for (const campo of ['conceito', 'acao', 'proposito', 'chave', 'angulo']) {
      if (typeof beat.sujeito?.[campo] !== 'string' || !beat.sujeito[campo].trim()) {
        falhas.push(`${beat.id}: falta sujeito.${campo}.`);
      }
    }
    if (!Array.isArray(beat.sujeito?.estado) || beat.sujeito.estado.length < 2
        || beat.sujeito.estado.some(e => typeof e !== 'string' || !e.trim())) {
      falhas.push(`${beat.id}: sujeito.estado precisa descrever início e fim.`);
    }
    if (!beat.modelo && !(Array.isArray(beat.elementos) && beat.elementos.length)) {
      falhas.push(`${beat.id}: falta composição executável em elementos ou modelo.`);
    }
  }
  if (proxima !== palavras.length) falhas.push('O storyboard não cobre o fim da narração.');
  if (estrito && cena.automatica) falhas.push('Substitua o plano automático por cenas autorais e remova automatica.');
  if (falhas.length) return { aprovado: false, falhas, avisos, planos: [] };
  let spec;
  try { spec = specFinal || compilar(structuredClone(cena), falado); }
  catch (erro) { return { aprovado: false, falhas: [erro.message], avisos, planos: [] }; }
  falhas.push(...conferirStoryboard(cena, spec, { compilado: true }));
  for (const beat of beats) {
    if (!spec.beats.some(b => b.id === beat.id)) falhas.push(`${beat.id}: beat autoral ausente no plano efetivo.`);
  }
  const planos = spec.beats.map((beat, i) => {
    if (!Number.isFinite(beat.de) || !Number.isFinite(beat.ate) || beat.ate <= beat.de) {
      falhas.push(`${beat.id}: intervalo de tempo inválido.`);
    }
    if (i && Math.abs(beat.de - spec.beats[i - 1].ate) > 0.001) {
      falhas.push(`${beat.id}: lacuna ou sobreposição no tempo compilado.`);
    }
    const original = beats.find(b => b.id === beat.id);
    if (!original) falhas.push(`${beat.id}: beat compilado sem direção autoral correspondente.`);
    return {
      id: beat.id, de: beat.de, ate: beat.ate,
      // Intervalos semiabertos: primeiro quadro incluído, limite final excluído.
      quadros30fps: [Math.ceil(beat.de * 30), Math.ceil(beat.ate * 30)],
      fala: original ? palavras.slice(original.palavras[0], original.palavras[1] + 1).map(p => p.w).join(' ') : '',
      intencao: original?.sujeito,
      camera: beat.camera,
      elementos: beat.elementos.map(el => ({
        id: el.id, essencial: el.essencial === true,
        tipo: el.tipo, forma: el.forma, arquivo: el.arquivo, entraEm: el.t0,
      })),
      conferirEm: [beat.de, (beat.de + beat.ate) / 2, Math.max(beat.de, beat.ate - 1 / 30)],
    };
  });
  return {
    aprovado: !falhas.length, falhas, avisos, duracao: spec.duracao, planos,
    origem: specFinal ? 'motor-apos-qa' : 'compilacao-preliminar',
    revisaoVisual: 'pendente: conferir início, meio, fim e transições nos quadros renderizados; esta análise não comprova aparência nem equivalência semântica.',
  };
}

export function conferirDirecaoDoAgente(pasta, cena, falado, spec) {
  let pedido = '';
  try { pedido = fs.readFileSync(path.join(pasta, 'PEDIDO-DO-ESTUDIO.md'), 'utf8'); } catch {}
  if (!pedido.includes('<!-- direcao-agente:v1 -->')) return null;
  const relatorio = analisarStoryboard(cena, falado, { estrito: true, spec });
  fs.mkdirSync(path.join(pasta, 'saida'), { recursive: true });
  fs.writeFileSync(path.join(pasta, 'saida', 'analise-direcao.json'), JSON.stringify(relatorio, null, 2) + '\n');
  return relatorio;
}

export function executar(args, raiz = fileURLToPath(new URL('..', import.meta.url))) {
  const [nome, ...opcoes] = args;
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(nome || '') || opcoes.some(o => !['--estrito', '--tudo'].includes(o))) {
    throw new Error('Uso: node scripts/storyboard-lint.mjs <projeto> [--estrito] [--tudo]');
  }
  const pasta = path.join(raiz, 'projetos', nome);
  const ler = arquivo => JSON.parse(fs.readFileSync(path.join(pasta, arquivo), 'utf8').replace(/^\uFEFF/, ''));
  const relatorio = analisarStoryboard(ler('cena.json'), ler('palavras.json'), { estrito: opcoes.includes('--estrito') });
  fs.mkdirSync(path.join(pasta, 'saida'), { recursive: true });
  fs.writeFileSync(path.join(pasta, 'saida', 'analise-storyboard.json'), JSON.stringify(relatorio, null, 2) + '\n');
  return relatorio;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const relatorio = executar(process.argv.slice(2));
    console.log(JSON.stringify(relatorio, null, 2));
    process.exitCode = relatorio.aprovado ? 0 : 1;
  } catch (erro) {
    console.error('Análise da direção: ' + erro.message);
    process.exitCode = 1;
  }
}
