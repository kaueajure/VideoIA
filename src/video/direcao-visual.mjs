import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const ARQUIVO = 'direcao-visual.json';
export const MARCA_PESQUISA_VISUAL = '<!-- pesquisa-visual:v1 -->';
const PLANOS = new Set(['normal', 'aberto', 'fechado', 'topo', 'baixo', 'lateral', 'lateralEsq']);
const MOVIMENTOS = new Set(['deriva', 'avanca', 'recua', 'orbita', 'sobe', 'desce', 'panEsq', 'panDir', 'nenhum']);
const TRANSICOES = new Set(['desfoque', 'corte', 'varredura']);
const ESTILOS_COM_IMAGEM = new Set(['padrao', 'editorial', 'minimalista', 'papel', 'tifo-football']);
const CLASSES = new Set(['registro', 'contexto']);
const fotoPendente = el => typeof el?.busca === 'string' && el.busca.trim() && !el.arquivo;

function tokens(texto) {
  return String(texto ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').match(/[\p{L}\p{N}]+/gu) || [];
}

function fotoLocal(pasta, imagem, fontes) {
  const arquivo = imagem?.arquivo;
  if (typeof arquivo !== 'string' || !/^assets\/(?:referencias\/)?[^/\\]+\.(?:jpe?g|png|webp|svg)$/i.test(arquivo)
      || !CLASSES.has(imagem.classe) || typeof imagem.entidade !== 'string' || !tokens(imagem.entidade).length) return null;
  const fonte = fontes.get(arquivo);
  if (!fonte && !arquivo.startsWith('assets/referencias/')) return null;
  try {
    const real = fs.realpathSync(path.join(pasta, arquivo));
    const esperado = path.join(fs.realpathSync(pasta), arquivo);
    if (path.relative(esperado, real)) return null;
    const stat = fs.statSync(real);
    if (!stat.isFile() || !stat.size) return null;
    const credito = fonte?.match(/Crédito para a legenda do post: "([^"]+)"/)?.[1];
    return { arquivo, entidade: imagem.entidade, classe: imagem.classe, credito, assinatura: [stat.size, stat.mtimeMs, fonte] };
  } catch {
    return null;
  }
}

function pedidoComCuradoria(pasta) {
  try {
    const pedido = fs.readFileSync(path.join(pasta, 'PEDIDO-DO-ESTUDIO.md'), 'utf8');
    return pedido.includes(MARCA_PESQUISA_VISUAL)
      || (pedido.includes('Antes de gravar o roteiro definitivo, siga pesquisa-visual')
        && pedido.includes('/direcao-visual.json'));
  } catch {
    return false;
  }
}

function direcaoVazia(motivo, msg) {
  return { hash: 'reserva:' + motivo, planos: [], avisos: [msg] };
}

export function lerDirecaoVisual(pasta) {
  let texto;
  try {
    texto = fs.readFileSync(path.join(pasta, ARQUIVO), 'utf8');
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      if (!pedidoComCuradoria(pasta)) return null;
      return direcaoVazia('sem-arquivo', 'O pedido previa direcao-visual.json. O render usou as reservas de cena. Para inserir as imagens conferidas, grave o plano visual e refaça o vídeo.');
    }
    return direcaoVazia('arquivo-ilegivel', 'Não foi possível ler direcao-visual.json. Confira se é um arquivo acessível e refaça o vídeo com o plano visual.');
  }

  const avisos = [];
  let planos = [];
  try {
    const dados = JSON.parse(texto.replace(/^\uFEFF/, ''));
    if (dados?.versao !== 1 || !Array.isArray(dados.planos)) throw new Error('formato');
    planos = dados.planos;
  } catch {
    avisos.push('direcao-visual.json inválido. Use versao 1 e uma lista planos.');
  }

  const fontes = new Map();
  if (planos.some(plano => plano?.imagem)) {
    try {
      const textoFontes = fs.readFileSync(path.join(pasta, 'fontes.md'), 'utf8');
      for (const linha of textoFontes.split(/\r?\n/)) {
        const caminho = linha.match(/^- (assets\/[^:]+):/)?.[1];
        if (caminho) fontes.set(caminho, linha);
      }
    } catch (erro) {
      if (erro.code !== 'ENOENT') avisos.push('Não foi possível ler fontes.md. Confira os créditos das imagens do plano visual.');
    }
  }
  const preparados = planos.map(plano => ({ plano, foto: plano?.imagem ? fotoLocal(pasta, plano.imagem, fontes) : null }));
  const hash = createHash('sha256').update(texto).update(JSON.stringify(preparados.map(p => p.foto?.assinatura))).digest('hex');
  return { hash, planos: preparados, avisos };
}

function acharBeat(beats, fala, trecho) {
  if (typeof trecho !== 'string') return null;
  const alvo = tokens(trecho);
  if (!alvo.length) return null;
  const indices = [];
  for (let i = 0; i <= fala.length - alvo.length; i++) {
    if (alvo.every((token, j) => token === fala[i + j].token)) indices.push(i);
    if (indices.length > 1) return null;
  }
  if (!indices.length) return null;
  const inicio = fala[indices[0]].i;
  const fim = fala[indices[0] + alvo.length - 1].i;
  return beats.find(beat => beat.palavras?.[0] <= inicio && beat.palavras?.[1] >= fim) || null;
}

function aplicarCamera(beat, plano) {
  const camera = plano.camera;
  if (camera) {
    const { plano: quadro, mov, forca } = camera;
    if (!PLANOS.has(quadro) || !MOVIMENTOS.has(mov) || (forca != null && (!Number.isFinite(forca) || forca < 0 || forca > 2))) {
      return false;
    }
    beat.camera = { plano: quadro, mov, ...(forca == null ? {} : { forca }) };
  }
  if (plano.transicao == null) return true;
  if (!TRANSICOES.has(plano.transicao)) return false;
  beat.transicao = plano.transicao;
  return true;
}

function aplicarImagem(beat, foto, estilo) {
  const elementos = beat.elementos || (beat.elementos = []);
  const entidade = tokens(foto.entidade).join(' ');
  const corresponde = el => tokens(el?.busca || el?._foto || el?.nome).join(' ') === entidade;
  const svg = /\.svg$/i.test(foto.arquivo);
  const possiveis = elementos.flatMap(el => [el, ...(Array.isArray(el?.itens) ? el.itens : [])])
    .filter(el => el && (!svg || el.tipo === 'imagem'));
  let alvo = possiveis.find(el => el.arquivo === foto.arquivo);
  alvo ??= possiveis.find(el => fotoPendente(el) && corresponde(el));
  if (!alvo && ESTILOS_COM_IMAGEM.has(estilo)) {
    alvo = { tipo: 'imagem', forma: 'card', largura: 560, entra: 0 };
    const indice = elementos.findIndex(el => el?.tipo === 'peca' || fotoPendente(el));
    if (indice >= 0) elementos.splice(indice, 1, alvo);
    else elementos.unshift(alvo);
  }
  if (!alvo) return false;

  Object.assign(alvo, { arquivo: foto.arquivo, _foto: foto.entidade, _classeVisual: foto.classe });
  if (foto.credito) alvo.credito = foto.credito;
  for (const chave of ['busca', 'contexto', 'reserva', 'reservaBeat', 'dupla', '_pessoa']) delete alvo[chave];

  beat.elementos = elementos.filter(el => {
    if (fotoPendente(el)) return false;
    if (Array.isArray(el?.itens) && el.itens.some(fotoPendente)) {
      el.itens = el.itens.filter(item => !fotoPendente(item));
      if (!el.itens.length) return false;
    }
    return true;
  });
  return true;
}

export function aplicarDirecaoVisual(cena, direcao, palavras) {
  const fala = (palavras || []).flatMap((p, i) => tokens(typeof p === 'string' ? p : p?.w).map(token => ({ token, i })));
  const avisos = [...direcao.avisos];
  const imagens = [];
  const tratados = new Set();
  for (const { plano, foto } of direcao.planos) {
    const beat = acharBeat(cena.beats || [], fala, plano?.trecho);
    if (!beat || tratados.has(beat)) {
      avisos.push('Use um trecho único por plano, contido em um beat: ' + String(plano?.trecho || '').slice(0, 100));
      continue;
    }
    tratados.add(beat);
    if (!aplicarCamera(beat, plano)) avisos.push('Câmera ou transição inválida no beat ' + beat.id + '.');
    if (!plano.imagem) continue;
    if (!foto) {
      avisos.push('Imagem ausente, sem registro de fonte ou inválida no beat ' + beat.id + ': ' + String(plano.imagem.arquivo || '').slice(0, 140));
      continue;
    }
    if (!aplicarImagem(beat, foto, beat.estilo || cena.estilo || 'padrao')) {
      avisos.push('O estilo não tem espaço compatível para ' + foto.arquivo + ' no beat ' + beat.id + '.');
      continue;
    }
    imagens.push({ beat: beat.id, arquivo: foto.arquivo, classe: foto.classe });
  }
  return { imagens, avisos };
}

export function imagensNoPlano(spec, imagens) {
  const arquivos = new Map();
  for (const beat of spec.beats || []) {
    const registrar = arquivo => {
      if (!arquivo) return;
      if (!arquivos.has(arquivo)) arquivos.set(arquivo, new Set());
      arquivos.get(arquivo).add(beat.id);
    };
    for (const el of beat.elementos || []) {
      registrar(el?.arquivo);
      if (Array.isArray(el?.itens)) {
        for (const item of el.itens) registrar(item?.arquivo);
      }
    }
  }
  return imagens.map(imagem => {
    const beatsNoPlano = [...(arquivos.get(imagem.arquivo) || [])];
    return { ...imagem, presenteNoPlano: beatsNoPlano.length > 0, noBeatPrevisto: beatsNoPlano.includes(imagem.beat), beatsNoPlano };
  });
}

import { compilar } from './plano.mjs';

// Propostas limitadas à organização e ao tempo dos conteúdos já escritos.
// Não inventa números, relações causais, títulos, imagens ou evidências.
export function planejarDirecao(cena, falado) {
  const spec = compilar(structuredClone(cena), falado);
  return { versao: 1, limite: 'Sugestões de ritmo e composição; a equivalência entre fala, imagem e evidência exige revisão.',
    cenas: cena.beats.map(b => {
      const s = spec.beats.find(p => p.id === b.id), el = b.elementos?.find(e => e.tipo === 'recurso');
      const proposta = {}, motivos = [];
      if (!s || !el) return { id: b.id, proposta: null, motivos: ['Composição autoral preservada; revisar câmera, estados e relação com a fala.'] };
      const duracao = s.ate - s.de;
      if (el.forma === 'documento' && !el.arquivo && el.linhas?.length > 1) {
        proposta.revelarLinhas = el.revelarLinhas || el.linhas.map((_, i) => +(i * Math.max(0, duracao - 1.2) / (el.linhas.length - 1)).toFixed(3));
        proposta.dur = .65;
        motivos.push('Revelar cada linha durante a explicação, deixando tempo para ler o último estado.');
      }
      if (['causa-efeito', 'linha-do-tempo', 'comparacao'].includes(el.forma) && el.itens?.length >= 2) {
        proposta.itens = el.itens.map((item, i) => ({ ...item,
          entra: typeof item.entra === 'string' ? item.entra : +(i * Math.max(0, duracao - 1.2) / (el.itens.length - 1)).toFixed(3) }));
        if (['causa-efeito','linha-do-tempo'].includes(el.forma)) proposta.layout = 'horizontal';
        motivos.push('Distribuir os passos ao longo da fala, mantendo rótulos, valores e relações.');
      }
      const eventos = el.revelarLinhas || el.itens?.map(i => i.entra) || [el.entra ?? 0];
      const numericos = eventos.filter(Number.isFinite).sort((a,b) => a-b);
      const maiorEspera = numericos.length === eventos.length ? Math.max(...numericos.slice(1).map((t,i) => t-numericos[i]), duracao - (numericos.at(-1) || 0)) : null;
      return { id: b.id, duracao, maiorEspera, proposta: Object.keys(proposta).length ? { recurso: proposta } : null, motivos };
    }) };
}
