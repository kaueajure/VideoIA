/*
 * 
 * 
 */
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, lerEstilos, lerObjetivos, carregarEstilo, carregarObjetivo, lerConfig, linhaDaFicha, OBJETIVO_PADRAO, lerModelosLegado, padroes, resolverLivre } from '../src/estilo-objetivo/carregar.mjs';
export { padroes };
import { migrarConfig, desfazerMigracao } from '../src/estilo-objetivo/migrar.mjs';
import { validarModelo } from '../src/modelos/validar.mjs';

/**
 * O que os comandos npm run estilos e npm run objetivos fazem (e o antigo npm run modelos, que continua valendo).
 *   npm run estilos                               # lista os estilos (aparência)
 *   npm run objetivos                             # lista os objetivos (o que o vídeo quer ser)
 *   npm run estilos -- --ver <id>                 # mostra um em português (o mesmo com objetivos)
 *   npm run estilos -- --padrao <id>              # grava o estilo padrão da página (estiloPadrao no config)
 *   npm run objetivos -- --padrao <id>            # grava o objetivo padrão da página (objetivoPadrao no config)
 *   npm run objetivos -- --novo <id> --base <id>  # copia para objetivos/meus/<id>.json, para você ajustar (estilos: estilos/meus/)
 *   npm run objetivos -- --validar                # confere todas as fichas (estilos e objetivos)
 *   npm run objetivos -- --desfazer-migracao      # volta o config de antes da troca de nomes (0.6.13)
 * Por vídeo: "Estilo: <id>. Objetivo: <id>." na linha STATUS do roteiro.md, ou --estilo=<id> --objetivo=<id> no comando.
 */
const lista = (x) => (x?.length ? x.join(', ') : '-');
const LEITORES = { estilo: lerEstilos, objetivo: lerObjetivos };
const CARREGAR = { estilo: carregarEstilo, objetivo: carregarObjetivo };

export function listar(tipo, raiz = RAIZ) {
  const todos = Object.values(LEITORES[tipo](raiz)), p = padroes(raiz)[tipo];
  const linhas = todos.map((m) => `${m.id === p ? '*' : ' '} ${linhaDaFicha(m)}`);
  const titulo = tipo === 'estilo' ? `Estilos (${linhas.length}): a aparência do vídeo.` : `Objetivos (${linhas.length}): o que o vídeo quer ser (ritmo, voz, abertura, convite final).`;
  const dica = tipo === 'estilo'
    ? 'Ver um: npm run estilos -- --ver <id>. Usar num vídeo: "Estilo: <id>." na linha STATUS do roteiro.md (junto com "Objetivo: <id>." se quiser outro objetivo).'
    : 'Ver um: npm run objetivos -- --ver <id>. Usar num vídeo: "Objetivo: <id>." na linha STATUS do roteiro.md. Combina com qualquer estilo.';
  return [`${titulo}${p ? ` * = padrão da página (${p}).` : ''}`, ...linhas, '', dica].join('\n');
}

export function descrever(m, tipo = 'objetivo') {
  const r = m.roteiro || {}, v = m.visual || {}, c = m.cta || {}, cu = m.cuidados || {};
  const blocos = (r.estrutura || []).map((b) => `${b.bloco}${b.obrigatorio ? ' (obrigatório)' : ''}`).join(' -> ');
  const cta = c.tipo === 'comentar' ? `comentar${c.palavra ? ` ${c.palavra}` : ' (texto e palavra do ilustrando.config.json)'}` : `${c.tipo || 'comentar'}${c.texto ? `: "${c.texto}"` : ''}`;
  const seu = m._origem === 'meu' ? (tipo === 'estilo' ? ' [seu estilo]' : ' [seu objetivo]') : '';
  const visual = `${tipo === 'estilo' ? 'Aparência' : 'Estilo sugerido'}: ${v.estilo || 'padrao'}; cenários ${lista(v.cenarios)}${v.cenas?.length ? `; cenas ${v.cenas.join(', ')}` : ''}; títulos ${v.titulos || 'gancho'}; transição ${v.transicao || 'do estilo'}; imagens reais ${v.imagens || 'opcional'}`;
  if (tipo === 'estilo' && !m.roteiro) return [`${m.nome} (${m.id})${seu}`, m.paraQuem && `Para quem: ${m.paraQuem}`, visual, 'Combina com qualquer objetivo: "Estilo: ' + m.id + '. Objetivo: <id>."'].filter(Boolean).join('\n');
  return [
    `${m.nome} (${m.id}${m.versao ? `, versão ${m.versao}` : ''})${seu}`,
    m.paraQuem && `Para quem: ${m.paraQuem}`,
    m.apelidos?.length && `Também atende por: ${m.apelidos.join(', ')}`,
    m.exemplosDePedido?.length && `Exemplos: ${m.exemplosDePedido.map((x) => `"${x}"`).join('; ')}`,
    tipo === 'estilo' && 'Sozinho, este estilo usa o jeito de roteiro próprio dele (abaixo). Com "Objetivo: <id>" junto, o objetivo decide o roteiro, a voz e o convite final.',
    m.formato && `Formatos: ${lista(m.formato.preferidos)} (padrão ${m.formato.padrao || '-'}${m.formato.proibidos?.length ? `; nunca ${m.formato.proibidos.join(', ')}` : ''})`,
    r.palavras && `Roteiro: ${r.palavras[0]} a ${r.palavras[1]} palavras${r.alvoSegundos ? ` (${r.alvoSegundos[0]} a ${r.alvoSegundos[1]} s)` : ''}; abertura em 3 tempos: ${r.abertura3Tempos === false ? 'não' : 'sim'}; loop aberto: ${r.loopAberto === false ? 'não' : 'sim'}; promessa: ${r.promessaMarca ? `"${r.promessaMarca}"` : 'nenhuma'}`,
    blocos && `Estrutura: ${blocos}`,
    r.gatilhos && `Gatilhos: ${r.gatilhos.join(', ')}. Alfinetadas: ${r.alfinetadas ? r.alfinetadas.join(' a ') : '-'}`,
    r.tom && `Tom: ${r.tom}${r.vocabulario ? ` (vocabulário ${r.vocabulario})` : ''}`,
    r.proibir?.length && `O linter reprova: ${r.proibir.map((x) => `"${x}"`).join(', ')}`,
    m.voz && `Voz: velocidade ${m.voz.velocidade ?? 1}${m.voz.direcao ? `, marcação ${m.voz.direcao}` : ''}`,
    visual,
    v.pecasBase?.length && `Peças sugeridas: ${v.pecasBase.join(', ')}`,
    m.ritmo && `Ritmo: beats de ${(m.ritmo.beatSeg || [3, 9]).join(' a ')} s${m.ritmo.beatsMax ? `, até ${m.ritmo.beatsMax} beats` : ''}`,
    m.cta && `Convite final: ${cta}${c.perguntaFinal ? `. Pergunta final: "${c.perguntaFinal}"` : ''}`,
    m.carrossel && `Carrossel: ${lista(m.carrossel.sequencia)}`,
    m.publicar && `Legenda: ${m.publicar.legenda || '-'}; ${lista(m.publicar.hashtags)}${m.publicar.aviso ? `; aviso "${m.publicar.aviso}"` : ''}`,
    m.cuidados && `Cuidados: ${cu.fontesMinimas ?? 2} fonte${(cu.fontesMinimas ?? 2) > 1 ? 's' : ''}${cu.fonteOficial ? ' (uma oficial)' : ''}; atribuição ${cu.atribuicao || 'normal'} nos registros de pesquisa, fora da narração${cu.avisoFalado ? `; aviso falado "${cu.avisoFalado}"` : ''}${cu.temasBloqueados?.length ? `; recusa ${cu.temasBloqueados.join(', ')}` : ''}${cu.revisaoHumana ? '; revisão humana antes de publicar' : ''}`,
    `Arquivo: ${m._arquivo}`,
  ].filter(Boolean).join('\n');
}

const arqConfig = (raiz) => path.join(raiz, 'ilustrando.config.json');
const lerConfigBruto = (raiz) => (fs.existsSync(arqConfig(raiz)) ? JSON.parse(fs.readFileSync(arqConfig(raiz), 'utf8').replace(/^﻿/, '')) : {});

/** Grava o estilo ou o objetivo padrão da página. Um config antigo (modeloPadrao) é convertido antes, sem perder a escolha. */
export function gravarPadrao(tipo, nome, raiz = RAIZ) {
  let m;
  try { m = CARREGAR[tipo](nome, raiz); } catch (erro) {
    // 0.6.41: nome livre ("educação financeira") grava o mais parecido, se houver um só
    const r = resolverLivre(tipo, nome, raiz);
    if (!r.id) throw erro;
    m = LEITORES[tipo](raiz)[r.id];
  }
  const { config: c } = migrarConfig(lerConfigBruto(raiz), raiz);
  if (tipo === 'estilo') c.estiloPadrao = m.id; else c.objetivoPadrao = m.id;
  delete c.perguntarObjetivo; delete c.perguntarModelo;
  fs.writeFileSync(arqConfig(raiz), JSON.stringify(c, null, 2) + '\n');
  return m;
}

/** Copia uma ficha para estilos/meus/<id>.json ou objetivos/meus/<id>.json, para a pessoa ajustar. */
export function novo(tipo, id, base, raiz = RAIZ) {
  if (!/^[a-z0-9-]{2,40}$/.test(id || '')) throw new Error(`Nome do ${tipo} novo: só letras minúsculas, números e hífen (ex.: clinica).`);
  const todos = LEITORES[tipo](raiz);
  if (todos[id]) throw new Error(`Já existe um ${tipo} "${id}" (${todos[id]._arquivo}).`);
  const b = CARREGAR[tipo](base || (tipo === 'estilo' ? 'padrao' : OBJETIVO_PADRAO), raiz);
  const copia = Object.fromEntries(Object.entries(b).filter(([k]) => !k.startsWith('_') && k !== 'apelidos'));
  const m = { ...copia, id, nome: `${b.nome} (cópia)`, versao: 1 };
  const dir = path.join(raiz, tipo === 'estilo' ? 'estilos' : 'objetivos', 'meus');
  fs.mkdirSync(dir, { recursive: true });
  const arq = path.join(dir, `${id}.json`);
  fs.writeFileSync(arq, JSON.stringify(m, null, 2) + '\n');
  return path.relative(raiz, arq);
}

/** Confere todas as fichas: as antigas (modelos/), os objetivos novos e os da pessoa (estilos simples, sem ficha, não entram). */
export function validarTodos(raiz = RAIZ) {
  const out = [], vistos = new Set();
  const conferir = (id, m) => {
    if (!m._arquivo || vistos.has(m._arquivo) || m._arquivo.startsWith('src/')) return;
    vistos.add(m._arquivo);
    const nomeArquivo = path.basename(m._arquivo) === 'estilo.json' ? path.basename(path.dirname(m._arquivo)) : path.basename(m._arquivo, '.json');
    const ficha = Object.fromEntries(Object.entries(m).filter(([k]) => !k.startsWith('_')));
    // no objetivo derivado de um modelo antigo, o id e os apelidos são os do arquivo
    const doArquivo = m._modelo && m._modelo !== id ? { ...ficha, id: m._modelo, apelidos: (ficha.apelidos || []).filter((a) => a !== m._modelo) } : ficha;
    out.push({ id, arquivo: m._arquivo, ...validarModelo(doArquivo, { nomeArquivo }) });
  };
  for (const [id, m] of Object.entries(lerModelosLegado(raiz))) conferir(id, m);
  for (const [id, m] of Object.entries(lerObjetivos(raiz))) conferir(id, m);
  for (const [id, m] of Object.entries(lerEstilos(raiz))) if (m.roteiro || m._origem === 'meu') conferir(id, m);
  return out;
}

const args = process.argv.slice(2);
const val = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : null; };

/** O comando (npm run estilos / objetivos). tipo: "estilo" | "objetivo" */
export function rodar(tipo) {
  const plural = tipo === 'estilo' ? 'estilos' : 'objetivos';
  try {
    if (args.includes('--ver')) {
      const id = val('ver');
      if (!id) throw new Error(`Diga qual: npm run ${plural} -- --ver <id>`);
      const m = CARREGAR[tipo](id);
      console.log(descrever(m, tipo));
    } else if (args.includes('--padrao')) {
      const id = val('padrao');
      if (!id) { const p = padroes(); console.log(`${tipo} padrão da página: ${p[tipo] || (tipo === 'estilo' ? 'o sugerido pelo objetivo' : 'o jeito próprio do estilo')}`); }
      else { const m = gravarPadrao(tipo, id); console.log(`• ${tipo} padrão da página: ${m.id} (${m.nome}), gravado em ilustrando.config.json. Um vídeo pode trocar com "${tipo === 'estilo' ? 'Estilo' : 'Objetivo'}: <id>" no STATUS.`); }
    } else if (args.includes('--novo')) {
      const arq = novo(tipo, val('novo'), val('base'));
      console.log(`• ${tipo} criado em ${arq}. Ajuste os campos e confira com npm run ${plural} -- --validar.`);
    } else if (args.includes('--validar')) {
      const rs = validarTodos();
      for (const r of rs) {
        console.log(`${r.erros.length ? 'ERRO ' : 'ok   '} ${r.id.padEnd(13)} ${r.arquivo}`);
        for (const x of r.erros) console.log('       ' + x);
        for (const x of r.avisos) console.log('       aviso: ' + x);
      }
      if (rs.some((r) => r.erros.length)) process.exit(1);
    } else if (args.includes('--desfazer-migracao')) {
      const r = desfazerMigracao(RAIZ);
      console.log(r.desfeito ? `• voltou o config de antes da troca de nomes${r.arquivos ? ` e tirou ${r.arquivos} cópia(s) de modelos/meus` : ''}.` : 'Não há troca de nomes para desfazer.');
    } else console.log(listar(tipo));
  } catch (e) { console.error(e.message); process.exit(1); }
}
