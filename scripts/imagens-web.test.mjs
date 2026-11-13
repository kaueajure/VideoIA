import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { buscarImagem, conferirImagem, clienteEducado } from './buscar-imagem.mjs';
import { montarPrompt } from '../src/estudio/assistentes.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'metodo-imagens-web-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
let sequencia = 0;
function projeto() {
  const nome = `teste-${++sequencia}`, pasta = path.join(tmp, 'projetos', nome);
  fs.mkdirSync(pasta, { recursive: true });
  return { projeto: nome, raiz: tmp, pasta };
}
function pagina(id, largura = 1600, altura = 1000) {
  return { pageid: id, title: `File:Foto-${id}.jpg`, index: id, imageinfo: [{
    url: `https://upload.example/original-${id}.jpg`, thumburl: `https://upload.example/preview-${id}.jpg`,
    width: largura, height: altura, thumbwidth: 1280, thumbheight: 800,
    mime: 'image/jpeg', thumbmime: 'image/jpeg', descriptionurl: `https://commons.wikimedia.org/wiki/File:Foto-${id}.jpg`,
    extmetadata: { License: { value: 'cc-by-4.0' }, LicenseShortName: { value: 'CC BY 4.0' }, Artist: { value: 'Fotógrafa' } },
  }] };
}
const json = j => new Response(JSON.stringify(j), { headers: { 'content-type': 'application/json' } });
const temMidia = ['ffmpeg', 'ffprobe'].every(cmd => spawnSync(cmd, ['-version'], { stdio: 'ignore' }).status === 0);
function foto(tamanho) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', `color=c=blue:s=${tamanho}`, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'mjpeg', 'pipe:1'], { maxBuffer: 2 * 1024 * 1024, timeout: 15000 });
  assert.equal(r.status, 0, r.stderr?.toString());
  return r.stdout;
}
const origem = { termo: 'Pessoa no evento correto', url: 'https://fotos.exemplo.org/original.jpg', pagina: 'https://museu.exemplo.org/evento',
  autor: 'Fotógrafa do evento', licenca: 'CC BY 4.0', licencaUrl: 'https://museu.exemplo.org/condicoes' };

test('busca sem seleção lista candidatos e não baixa o primeiro; descarta baixa resolução', async () => {
  const p = projeto(), chamadas = [];
  const r = await buscarImagem({ ...p, termo: 'Pessoa evento', fetch: async url => {
    chamadas.push(url); return json({ query: { pages: [pagina(1, 320, 240), pagina(2)] } });
  } });
  assert.equal(chamadas.length, 1);
  assert.deepEqual(r.candidatos.map(c => c.id), [2]);
  assert.equal(r.descartados, 1);
  assert.equal(fs.existsSync(path.join(p.pasta, 'assets')), false);
});

test('seleção inválida não é trocada silenciosamente pelo último candidato', async () => {
  const p = projeto();
  await assert.rejects(buscarImagem({ ...p, termo: 'Pessoa evento', escolha: 99, fetch: async () => json({ query: { pages: [pagina(1)] } }) }), /não corresponde/);
  await assert.rejects(buscarImagem({ ...p, termo: 'Pessoa evento', escolha: 1.5 }), /número de um candidato/);
  assert.equal(fs.existsSync(path.join(p.pasta, 'assets')), false);
});

test('importa original de outro domínio e registra origem real, autor e condições', { skip: !temMidia }, async () => {
  const p = projeto(), bin = foto('1280x900');
  const r = await buscarImagem({ ...p, ...origem, fetch: async url => {
    assert.equal(url, origem.url); return new Response(bin);
  } });
  assert.equal(r.registro.largura, 1280); assert.equal(r.registro.altura, 900);
  assert.ok(fs.readFileSync(path.join(p.pasta, r.arquivo)).equals(bin));
  const fontes = fs.readFileSync(path.join(p.pasta, 'fontes.md'), 'utf8');
  assert.ok(fontes.includes(origem.pagina)); assert.ok(fontes.includes(origem.autor)); assert.ok(fontes.includes(origem.licencaUrl));
  assert.ok(!fontes.includes('via Wikimedia Commons'));
});

test('download selecionado do Commons prefere original à miniatura', { skip: !temMidia }, async () => {
  const p = projeto(), bin = foto('1280x900'), chamadas = [];
  const r = await buscarImagem({ ...p, termo: 'Pessoa evento', id: 1, fetch: async url => {
    chamadas.push(url);
    return url.includes('w/api.php') ? json({ query: { pages: [pagina(1)] } }) : new Response(bin);
  } });
  assert.equal(chamadas[1], 'https://upload.example/original-1.jpg');
  assert.equal(r.registro.largura, 1280);
});

test('foto externa exige origem e crédito antes de fazer download', async () => {
  const p = projeto(); let baixou = false;
  const fetch = async () => { baixou = true; throw new Error('não deveria baixar'); };
  await assert.rejects(buscarImagem({ ...p, termo: 'Foto', url: origem.url, fetch }), /autor e --licenca/);
  await assert.rejects(buscarImagem({ ...p, ...origem, pagina: null, fetch }), /--pagina/);
  await assert.rejects(buscarImagem({ ...p, ...origem, url: 'file:///etc/passwd', fetch }), /HTTP ou HTTPS/);
  assert.equal(baixou, false);
});

test('HTML com extensão de foto não entra no projeto', async () => {
  const p = projeto();
  await assert.rejects(buscarImagem({ ...p, ...origem, fetch: async () => new Response('<html>Não é uma foto</html>', { headers: { 'content-type': 'image/jpeg' } }) }), /não devolveu uma foto/);
  assert.equal(fs.existsSync(path.join(p.pasta, 'assets')), false);
  assert.equal(fs.existsSync(path.join(p.pasta, 'fontes.md')), false);
});

test('recusa foto pequena por padrão, sem ampliá-la artificialmente', { skip: !temMidia }, () => {
  const bin = foto('360x240');
  assert.throws(() => conferirImagem(bin), /Foto pequena \(360x240\)/);
  assert.deepEqual(conferirImagem(bin, { minLado: 200 }), { mime: 'image/jpeg', largura: 360, altura: 240 });
});

test('limite de bytes também interrompe imagem sem Content-Length', async () => {
  let cancelou = false;
  const stream = new ReadableStream({ pull(c) { c.enqueue(new Uint8Array(4)); }, cancel() { cancelou = true; } });
  const pedir = clienteEducado({ fetch: async () => new Response(stream) });
  await assert.rejects(pedir(origem.url, { binario: true, limiteBytes: 3 }), /limite de download/);
  assert.equal(cancelou, true);
});

test('prompt permite pesquisa aberta e exige conferir o conteúdo das fotos', () => {
  const p = montarPrompt('Escolha fotos para o vídeo.', process.cwd());
  assert.match(p, /qualquer fonte acessível, sem lista fixa/);
  assert.match(p, /fora de Commons\/Wikipédia/);
  assert.match(p, /confirme identidade, evento e nitidez/);
});

test('render não baixa foto às cegas; arquivo previamente selecionado é preservado', async () => {
  const { resolverFotos, avisoFotoDeNome } = await import('../src/video/fotos-auto.mjs');
  const p = projeto(); let pediuRede = false;
  const selecionada = { tipo: 'imagem', arquivo: 'assets/conferida.jpg', credito: 'Autora' };
  const cena = { beats: [{ id: 'a', elementos: [selecionada] }, { id: 'b', elementos: [
    { tipo: 'imagem', busca: 'Pessoa homônima', contexto: 'evento correto', reserva: 'globo' },
  ] }] };
  const r = await resolverFotos(cena, p.pasta, { raiz: tmp, fetch: async () => { pediuRede = true; throw new Error('sem escolha automática'); } });
  assert.equal(pediuRede, false);
  assert.equal(cena.beats[0].elementos[0], selecionada);
  assert.equal(r.falhas[0].motivo, 'nao-curada');
  assert.match(avisoFotoDeNome(r.falhas), /falta selecionar e conferir/);
  assert.doesNotMatch(avisoFotoDeNome(r.falhas), /não achei foto com licença livre/);
  assert.equal(cena.beats[1].elementos[0].tipo, 'peca');
});

test('planejamento oferece consultas abertas; coleta aceita mais de 12 fontes sem aprovar fatos', async () => {
  const { planejarPesquisa, coletarPesquisa } = await import('../src/video/pesquisa-assistida.mjs');
  const p = projeto();
  const fontes = Array.from({ length: 13 }, (_, i) => ({ id: `s-${i}`, url: `https://fonte-${i}.example.org/artigo` }));
  const registro = { versao: 1, fontes, afirmacoes: [{ id: 'a', texto: 'Alegação sintética para testar a pesquisa.', estado: 'pendente',
    evidencias: fontes.map(f => ({ fonte: f.id, trecho: 'Trecho de teste.' })), ressalvas: [] }] };
  fs.writeFileSync(path.join(p.pasta, 'fontes.json'), JSON.stringify(registro));
  const plano = planejarPesquisa(registro);
  assert.equal(plano.tarefas[0].buscas[0], registro.afirmacoes[0].texto);
  assert.ok(plano.tarefas[0].buscas.length >= 4);
  let coletadas = 0;
  const r = await coletarPesquisa(p.pasta, { baixar: async url => {
    coletadas++; return { url, html: '<article>' + 'Página sintética de teste, sem afirmação factual pesquisada. '.repeat(4) + '</article>' };
  } });
  assert.equal(coletadas, 13);
  assert.equal(r.aprovado, false);
  assert.equal(JSON.parse(fs.readFileSync(path.join(p.pasta, 'saida/pesquisa-fontes.json'), 'utf8')).fontes.length, 13);
});
