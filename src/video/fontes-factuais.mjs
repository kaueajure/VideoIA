import { analisarPesquisa } from './pesquisa-assistida.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { lerRoteiro } from './narracao/texto.mjs';
import { compilar } from './plano.mjs';
import { gravarJson } from './arquivo.mjs';

const ID = /^[a-z][a-z0-9-]{0,63}$/;
const objeto = v => v && typeof v === 'object' && !Array.isArray(v);
const texto = v => typeof v === 'string' && !!v.trim();
const normalizar = v => String(v ?? '').normalize('NFC').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
const hash = v => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const dataValida = (v, hoje) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)
  && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v && v <= hoje;
function urlValida(v) {
  try { const u = new URL(v); return ['http:', 'https:'].includes(u.protocol) && !!u.hostname && !u.username && !u.password; }
  catch { return false; }
}

// Valida registros e vínculos declarados. Não busca páginas nem atribui verdade
// a uma frase por haver uma URL; a conferência semântica pertence à pesquisa.
export function analisarFontes({ registro, roteiro = '', falado, cena, exigirVideo = false,
  hoje = new Date().toISOString().slice(0, 10) } = {}) {
  const pendencias = [], avisos = [], trechos = [], afirmacoes = [];
  const fontePorId = new Map(), fatoPorId = new Map();
  const adicionar = (codigo, msg, contexto = {}) => pendencias.push({ codigo, msg, ...contexto });
  const resultado = () => ({ versao: 1, escopo: exigirVideo ? 'video' : 'roteiro',
    aprovado: !pendencias.length, pendencias, avisos, trechos, afirmacoes,
    limite: 'Esta checagem registra cobertura e evidências declaradas; não comprova verdade, independência das fontes ou equivalência semântica.' });
  const narrado = normalizar(roteiro);
  if (!narrado) adicionar('roteiro-ausente', 'Roteiro narrado ausente ou vazio.');
  if (!objeto(registro) || registro.versao !== 1 || !['fontes', 'afirmacoes', 'trechos'].every(k => Array.isArray(registro[k]))) {
    adicionar('registro-ausente', 'Crie fontes.json versão 1 com fontes, afirmacoes e trechos; fontes.md sozinho não vincula evidências às falas.');
    return resultado();
  }
  for (const [tipo, lista, mapa] of [['fonte', registro.fontes, fontePorId], ['afirmacao', registro.afirmacoes, fatoPorId]]) {
    for (const item of lista) {
      if (!objeto(item) || typeof item.id !== 'string' || !ID.test(item.id)) {
        adicionar('registro-invalido', `${tipo}: use um objeto com id estável, em letras minúsculas, números e hífen.`);
        continue;
      }
      if (mapa.has(item.id)) adicionar('id-duplicado', `${tipo} ${item.id}: id duplicado.`);
      mapa.set(item.id, item);
    }
  }
  const palavras = [...narrado.matchAll(/\S+/g)].map(m => ({ w: m[0], inicio: m.index, fim: m.index + m[0].length }));
  const idsTrechos = new Set();
  for (const item of registro.trechos) {
    if (!objeto(item) || !ID.test(item.id || '') || idsTrechos.has(item.id)) {
      adicionar('trecho-invalido', 'Cada trecho precisa de objeto e id único.'); continue;
    }
    idsTrechos.add(item.id);
    const trecho = { id: item.id, texto: normalizar(item.texto), tipo: item.tipo,
      afirmacoes: Array.isArray(item.afirmacoes) ? [...item.afirmacoes] : [], beats: [] };
    trechos.push(trecho);
    if (!texto(item.texto) || !trecho.texto || !['factual', 'editorial'].includes(item.tipo)) {
      adicionar('trecho-invalido', `${item.id}: informe texto e tipo factual ou editorial.`, { trecho: item.id }); continue;
    }
    if (item.tipo === 'factual' && (!trecho.afirmacoes.length || trecho.afirmacoes.some(id => typeof id !== 'string' || !ID.test(id)))) {
      adicionar('trecho-sem-afirmacao', `${item.id}: vincule os ids das afirmações desta fala.`, { trecho: item.id });
    }
    if (item.tipo === 'editorial' && (!texto(item.justificativa) || trecho.afirmacoes.length)) {
      adicionar('editorial-sem-justificativa', `${item.id}: justifique o texto editorial; falas com afirmações devem usar tipo factual.`, { trecho: item.id });
    }
    const posicoes = [];
    for (let de = narrado.indexOf(trecho.texto); de >= 0; de = narrado.indexOf(trecho.texto, de + 1)) posicoes.push(de);
    const ocorrencia = item.ocorrencia ?? 1;
    if (!posicoes.length || !Number.isInteger(ocorrencia) || ocorrencia < 1
      || posicoes[ocorrencia - 1] === undefined || (posicoes.length > 1 && item.ocorrencia == null)) {
      adicionar('trecho-nao-localizado', `${item.id}: transcreva a fala atual; se ela se repete, informe ocorrencia começando em 1.`, { trecho: item.id }); continue;
    }
    const inicio = posicoes[ocorrencia - 1], fim = inicio + trecho.texto.length;
    const primeira = palavras.findIndex(p => p.inicio === inicio), ultima = palavras.findIndex(p => p.fim === fim);
    if (primeira < 0 || ultima < primeira) {
      adicionar('trecho-parcial', `${item.id}: use palavras completas, incluindo a pontuação ligada a elas.`, { trecho: item.id }); continue;
    }
    trecho.intervalo = [inicio, fim]; trecho.palavras = [primeira, ultima];
  }
  let cursor = 0;
  for (const trecho of trechos.filter(t => t.intervalo).sort((a, b) => a.intervalo[0] - b.intervalo[0])) {
    const [inicio, fim] = trecho.intervalo;
    if (inicio < cursor) adicionar('trechos-sobrepostos', `${trecho.id}: esta fala já pertence a outro trecho.`, { trecho: trecho.id });
    if (narrado.slice(cursor, inicio).trim()) adicionar('fala-sem-classificacao', 'Fala sem classificação factual ou editorial: ' + narrado.slice(cursor, inicio).trim().slice(0, 180));
    cursor = Math.max(cursor, fim);
  }
  if (narrado.slice(cursor).trim()) adicionar('fala-sem-classificacao', 'Fala sem classificação factual ou editorial: ' + narrado.slice(cursor).trim().slice(0, 180));

  const beats = Array.isArray(cena?.beats) ? cena.beats : [];
  if (exigirVideo) {
    if (!Array.isArray(falado?.palavras) || !falado.palavras.length || falado.palavras.some(p =>
      !objeto(p) || !texto(p.w) || !Number.isFinite(p.t) || !Number.isFinite(p.f) || p.t < 0 || p.f < p.t)) {
      adicionar('narracao-ausente', 'Gere palavras.json com a narração alinhada antes de liberar o vídeo.');
    } else if (normalizar(falado.palavras.map(p => p.w).join(' ')).toLocaleLowerCase() !== narrado.toLocaleLowerCase()) {
      adicionar('narracao-divergente', 'A narração alinhada diverge do roteiro atual; gere ou alinhe a voz novamente.');
    }
    if (!beats.length) adicionar('cena-ausente', 'Prepare cena.json antes de liberar o vídeo.');
  }
  const usados = new Set(trechos.flatMap(t => t.afirmacoes));
  const idsBeats = new Set();
  for (const beat of beats) {
    if (!objeto(beat) || (typeof beat.id !== 'string' || !beat.id.trim()) || idsBeats.has(beat.id)) {
      adicionar('beat-invalido', 'Cenas precisam de beats com ids únicos.'); continue;
    }
    idsBeats.add(beat.id);
    const faixa = beat.palavras;
    if (!Array.isArray(faixa) || faixa.length !== 2 || !faixa.every(Number.isInteger) || faixa[0] < 0 || faixa[1] < faixa[0] || faixa[1] >= palavras.length) {
      if (exigirVideo) adicionar('beat-sem-intervalo', `${beat.id}: intervalo de palavras inválido.`, { beat: beat.id }); continue;
    }
    for (const trecho of trechos.filter(t => t.palavras)) {
      if (faixa[0] <= trecho.palavras[1] && faixa[1] >= trecho.palavras[0]) trecho.beats.push(beat.id);
    }
    if (beat.elementos != null && !Array.isArray(beat.elementos)) adicionar('elementos-invalidos', `${beat.id}: elementos precisa ser uma lista.`, { beat: beat.id });
    const explicitas = [beat.afirmacoes, ...(Array.isArray(beat.elementos) ? beat.elementos : []).map(el => el?.afirmacoes)].filter(v => v !== undefined);
    for (const refs of explicitas) {
      if (!Array.isArray(refs) || refs.some(id => typeof id !== 'string' || !ID.test(id))) {
        adicionar('vinculo-de-cena-invalido', `${beat.id}: afirmacoes precisa ser uma lista de ids.`, { beat: beat.id }); continue;
      }
      for (const id of refs) usados.add(id);
    }
  }
  for (const trecho of trechos.filter(t => t.palavras)) {
    const [a, b] = trecho.palavras;
    if (exigirVideo && Array.from({ length: b - a + 1 }, (_, i) => a + i).some(i =>
      !beats.some(beat => Array.isArray(beat?.palavras) && beat.palavras[0] <= i && beat.palavras[1] >= i))) {
      adicionar('trecho-sem-cena', `${trecho.id}: parte desta fala não tem beat correspondente.`, { trecho: trecho.id });
    }
    if (falado?.palavras?.[a] && falado?.palavras?.[b]) trecho.tempo = [falado.palavras[a].t, falado.palavras[b].f];
  }
  for (const id of usados) {
    const fato = fatoPorId.get(id);
    const ligados = trechos.filter(t => t.afirmacoes.includes(id));
    const visuais = beats.filter(b => [b?.afirmacoes, ...(Array.isArray(b?.elementos) ? b.elementos : []).map(e => e?.afirmacoes)].some(refs => Array.isArray(refs) && refs.includes(id))).map(b => b.id);
    const contexto = { afirmacao: id, trechos: ligados.map(t => t.id), beats: [...new Set([...ligados.flatMap(t => t.beats), ...visuais])] };
    const problema = (codigo, msg) => adicionar(codigo, `${id}: ${msg}`, contexto);
    if (!fato) { problema('afirmacao-desconhecida', 'afirmação não existe no registro.'); continue; }
    afirmacoes.push({ id, texto: fato.texto, estado: fato.estado, ...contexto, fontes: [],
      ressalvas: Array.isArray(fato.ressalvas) ? fato.ressalvas.filter(texto) : [] });
    const resumo = afirmacoes.at(-1);
    if (!texto(fato.texto)) problema('afirmacao-sem-texto', 'descreva a afirmação conferida.');
    if (fato.estado !== 'verificada') problema('afirmacao-pendente', 'estado precisa ser verificada; resolva pendência ou controvérsia antes da publicação.');
    if (!dataValida(fato.verificadaEm, hoje)) problema('data-de-verificacao-invalida', 'verificadaEm precisa ser uma data real, sem estar no futuro.');
    if (fato.validadeAte != null && (!dataValida(fato.validadeAte, '9999-12-31') || fato.validadeAte < hoje)) problema('afirmacao-expirada', 'a validade da conferência expirou ou está inválida.');
    if (fato.ressalvas != null && (!Array.isArray(fato.ressalvas) || fato.ressalvas.some(r => !texto(r)))) problema('ressalvas-invalidas', 'ressalvas deve ser uma lista de textos.');
    if (!Array.isArray(fato.evidencias) || !fato.evidencias.length) {
      problema('afirmacao-sem-evidencia', 'adicione evidência com fonte e trecho conferido.'); continue;
    }
    const URLs = new Set(), publicadores = new Set();
    for (const evidencia of fato.evidencias) {
      const fonte = fontePorId.get(evidencia?.fonte);
      if (!fonte) { problema('fonte-desconhecida', `a fonte ${String(evidencia?.fonte || '(ausente)').slice(0, 64)} foi removida ou não existe.`); continue; }
      if (!texto(evidencia.trecho) || !texto(evidencia.localizacao)) problema('evidencia-incompleta', `registre trecho e localização na fonte ${fonte.id}.`);
      if (!texto(fonte.titulo) || !texto(fonte.publicador) || !urlValida(fonte.url) || !dataValida(fonte.consultadaEm, hoje)) {
        problema('fonte-incompleta', `${fonte.id}: informe título, publicador, URL http(s) e data real de consulta, sem estar no futuro.`); continue;
      }
      URLs.add(new URL(fonte.url).href); publicadores.add(normalizar(fonte.publicador).toLocaleLowerCase());
      resumo.fontes.push({ id: fonte.id, titulo: fonte.titulo, url: fonte.url, publicador: fonte.publicador, consultadaEm: fonte.consultadaEm });
    }
    const minimo = Math.max(/\p{N}/u.test(fato.texto || '') || fato.tipo === 'numero' ? 2 : 1, Number.isInteger(fato.fontesMinimas) ? fato.fontesMinimas : 1);
    if (URLs.size < minimo || publicadores.size < minimo) problema('fontes-insuficientes', `registre ao menos ${minimo} URL(s) e publicador(es) distintos; os registros não provam independência editorial.`);
  }
  for (const id of fatoPorId.keys()) if (!usados.has(id)) avisos.push({ codigo: 'afirmacao-sem-uso', msg: `${id}: registro de pesquisa ainda sem uso na fala ou nas cenas.` });
  return resultado();
}

// Nunca inclua o conteúdo de um JSON inválido na mensagem de erro: ele pode
// conter dados que não deveriam aparecer em logs. Arquivos ficam no projeto.
function lerEntrada(pasta, nome, json = true) {
  try {
    const raiz = fs.realpathSync(pasta), arquivo = fs.realpathSync(path.join(pasta, nome));
    const relativo = path.relative(raiz, arquivo);
    if (relativo.startsWith('..') || path.isAbsolute(relativo) || path.basename(arquivo) === '.env') return { valor: null, erro: `${nome}: arquivo precisa estar dentro do projeto.` };
    if (fs.statSync(arquivo).size > 5 * 1024 * 1024) return { valor: null, erro: `${nome}: arquivo excede 5 MB.` };
    const conteudo = fs.readFileSync(arquivo, 'utf8').replace(/^\uFEFF/, '');
    return { valor: json ? JSON.parse(conteudo) : conteudo };
  } catch (e) { return { valor: null, erro: `${nome}: ${e.code === 'ENOENT' ? 'arquivo ausente' : 'arquivo inválido ou inacessível'}.` }; }
}

export function analisarFontesProjeto(pasta, { spec, falado: voz, exigirVideo = false, hoje } = {}) {
  const entradas = Object.fromEntries(['fontes.json', 'roteiro.md', 'cena.json', 'palavras.json']
    .map(nome => [nome, lerEntrada(pasta, nome, nome.endsWith('.json'))]));
  let roteiro = '';
  if (entradas['roteiro.md'].valor != null) roteiro = lerRoteiro(path.join(pasta, 'roteiro.md'));
  const falado = voz || entradas['palavras.json'].valor;
  let cena = spec || entradas['cena.json'].valor;
  let erroCena;
  if (exigirVideo && !spec && cena && falado?.palavras?.length) {
    try { cena = compilar(structuredClone(cena), falado); }
    catch { erroCena = 'Não foi possível compilar as cenas atuais para vincular as afirmações.'; cena = null; }
  }
  const r = analisarFontes({ registro: entradas['fontes.json'].valor, roteiro, falado, cena, exigirVideo, hoje });
  for (const nome of ['fontes.json', 'roteiro.md', ...(exigirVideo ? ['cena.json', 'palavras.json'] : [])]) {
    if (entradas[nome].erro) r.pendencias.push({ codigo: 'entrada-invalida', msg: entradas[nome].erro });
  }
  if (erroCena) r.pendencias.push({ codigo: 'cena-invalida', msg: erroCena });
  const nomesPesquisa = ['saida/pesquisa-fontes.json', 'pesquisa-revisao.json'];
  if (nomesPesquisa.some(nome => fs.existsSync(path.join(pasta, nome)))) {
    for (const nome of nomesPesquisa) entradas[nome] = lerEntrada(pasta, nome);
    r.pesquisa = analisarPesquisa(entradas['fontes.json'].valor, entradas[nomesPesquisa[0]].valor,
      entradas[nomesPesquisa[1]].valor, { hoje, usadas: r.afirmacoes.map(a => a.id) });
    for (const p of r.pesquisa.pendencias) {
      const fato = r.afirmacoes.find(a => a.id === p.afirmacao);
      r.pendencias.push({ ...p, beats: fato?.beats || [], trechos: fato?.trechos || [] });
    }
    for (const nome of nomesPesquisa) if (entradas[nome].erro) r.pendencias.push({ codigo: 'pesquisa-invalida', msg: entradas[nome].erro });
  }
  r.assinatura = hash(Object.fromEntries(Object.entries(entradas).map(([nome, dado]) => [nome, dado.valor])));
  r.aprovado = !r.pendencias.length;
  return r;
}

export function registrarFontesProjeto(pasta, opcoes = {}) {
  const r = analisarFontesProjeto(pasta, opcoes);
  const saida = path.join(pasta, 'saida'); fs.mkdirSync(saida, { recursive: true });
  gravarJson(path.join(saida, 'fatos-check.json'), r);
  return r;
}

export function conferirFontesDaEntrega(pasta, entrega, { hoje } = {}) {
  const r = analisarFontesProjeto(pasta, { exigirVideo: true, hoje });
  if (entrega?.factual?.aprovado !== true || entrega?.factual?.escopo !== 'video' || entrega?.factual?.assinatura !== r.assinatura) {
    r.pendencias.push({ codigo: 'entrega-factual-desatualizada', msg: 'A entrega não corresponde à checagem factual atual. Resolva as fontes e gere a entrega novamente.' });
  }
  r.aprovado = !r.pendencias.length;
  return r;
}
