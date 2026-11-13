/*
 * 
 * 
 */
import '../src/programas.mjs'; // antes do playwright: PATH dos programas e a pasta do navegador (.programas)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { abrirNavegador } from '../src/navegador.mjs'; // 0.6.2: Chromium do estúdio ou, sem ele, o Chrome ou o Edge do computador
import { RAIZ, TOKENS, lerTokens, paletaDe, medirMonograma, gerarIdentidade, fmtContraste, contraste } from '../src/identidade.mjs';
import { gravarAtomicoAsync } from '../src/video/arquivo.mjs';

/**
 * Troca a marca da página do estúdio em 1 comando.
 *
 *   npm run marca -- --nome "Pílula Curiosa" --handle "@pilulacuriosa" --cor "#FFC83D"
 *   npm run marca -- --preset curiosidades --nome "Pílula Curiosa" --handle "@pilulacuriosa"
 *   npm run marca -- --listar                 # as 8 identidades prontas
 *   npm run marca -- --ver                    # mostra a marca atual
 *   npm run marca -- --testar --nome ... --handle ... --cor ...   # gera a prévia em marca/teste sem trocar nada
 *   npm run marca -- --ilustrando             # volta para a marca de demonstração
 *   npm run marca -- --presets                # (mantenedor) regenera templates/identidades/<preset>/
 *
 * Opcionais: --curto "Nome curto" (cabeçalho do carrossel), --letra X (letra do símbolo),
 * --assinatura "frase do rodapé", --bio "bio do perfil".
 *
 * O que muda: marca/tokens.json (paginas.curiosidades), marca/logo/simbolo*.svg e marca/saida/*.png.
 * Vídeos e carrosséis leem tokens.json a cada geração, então tudo que for gerado depois já sai com a marca nova.
 * A marca anterior fica guardada em marca/historico/.
 */

const PRESETS = JSON.parse(fs.readFileSync(path.join(RAIZ, 'templates/identidades/presets.json'), 'utf8')).presets;
const ILUSTRANDO = {
  handle: '@exemplo',
  nome: 'Ilustrando Curiosidades',
  destaque: '#FF7A2F',
  apoio: '#FFC9A3',
  tinta: '#1A0D05',
  assinatura: 'uma página exclusiva para pessoas inteligentes e curiosas',
};

/* ---------------- argumentos ---------------- */
const args = {};
const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) {
  const a = av[i];
  if (!a.startsWith('--')) continue;
  const [k, v] = a.slice(2).split(/=(.*)/s);
  if (v !== undefined) args[k] = v;
  else if (av[i + 1] !== undefined && !av[i + 1].startsWith('--')) args[k] = av[++i];
  else args[k] = true;
}
const sair = (msg) => { console.error('\n' + msg + '\n'); process.exit(1); };
const semAcento = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/* ---------------- regras de @ (conferidas em 18/10/2026) ---------------- */
// Instagram: letras, números, ponto e sublinhado, até 30; ponto não pode abrir, fechar nem repetir.
// TikTok: 2 a 24 caracteres; letras, números, sublinhado e ponto; não termina em ponto.
// YouTube: 3 a 30; letras, números, sublinhado, hífen e ponto; pontuação não abre nem fecha (support.google.com/youtube/answer/11585688).
// Facebook (nome de usuário da Página): no mínimo 5; só letras, números e ponto (facebook.com/help/105399436216001).
export const checarHandle = (h) => {
  const u = h.replace(/^@/, '');
  const probs = [];
  const r = (plataforma, ok, motivo) => { if (!ok) probs.push(`${plataforma}: ${motivo}`); };
  r('Instagram', /^[a-z0-9._]{1,30}$/.test(u), 'só letras, números, ponto e sublinhado, até 30');
  r('Instagram', !/^\.|\.$|\.\./.test(u), 'ponto não pode abrir, fechar nem vir repetido');
  r('TikTok', u.length >= 2 && u.length <= 24, `precisa ter de 2 a 24 caracteres (o seu tem ${u.length})`);
  r('TikTok', /^[a-z0-9._]+$/.test(u) && !/\.$/.test(u), 'só letras, números, ponto e sublinhado, sem ponto no fim');
  r('YouTube', u.length >= 3 && u.length <= 30 && !/^[._-]|[._-]$/.test(u), 'de 3 a 30 caracteres, sem pontuação no começo ou no fim');
  r('Facebook', u.length >= 5 && /^[a-z0-9.]+$/.test(u), 'no mínimo 5 caracteres, só letras, números e ponto (sublinhado não vale)');
  return probs;
};

const normalizarHandle = (h) => {
  const avisos = [];
  let u = String(h).trim().replace(/^@+/, '');
  const limpo = semAcento(u).toLowerCase().replace(/\s+/g, '');
  if (limpo !== u) avisos.push(`ajustei o @ de "${u}" para "${limpo}" (as redes não aceitam acento, espaço nem maiúscula no @).`);
  return { handle: '@' + limpo, avisos };
};

/* ---------------- montar a página ---------------- */
const montarPagina = async (nav, { nome, handle, cor, assinatura, curto, letra, bio, bioCurta, preset }, tokens) => {
  const avisos = [];
  if (!nome || nome === true) sair('Falta o nome da página. Ex.: npm run marca -- --nome "Pílula Curiosa" --handle "@pilulacuriosa" --cor "#FFC83D"');
  if (!handle || handle === true) sair('Falta o @ da página. Ex.: --handle "@pilulacuriosa"');
  if (!cor || cor === true) sair('Falta a cor de destaque. Ex.: --cor "#FFC83D" (ou use --preset, veja npm run marca -- --listar)');
  nome = String(nome).trim();
  if (nome.length > 30) avisos.push(`o nome tem ${nome.length} caracteres; o Instagram aceita até 30 no campo Nome.`);
  const hh = normalizarHandle(handle); avisos.push(...hh.avisos);
  checarHandle(hh.handle).forEach((p) => avisos.push('@ ' + p));
  let pal;
  try { pal = paletaDe(cor, tokens.base.fundo); } catch (e) { sair(e.message); }
  avisos.push(...pal.avisos);
  curto = curto && curto !== true ? String(curto).trim() : nome;
  if (curto.length > 22) avisos.push(`o nome tem ${curto.length} caracteres e pode apertar o cabeçalho do carrossel; se quiser, passe --curto "Nome menor".`);
  letra = (letra && letra !== true ? String(letra) : semAcento(nome).replace(/[^A-Za-z0-9]/g, '')[0] || 'A').slice(0, 2).toUpperCase();
  const simbolo = await medirMonograma(nav, letra);
  const pagina = {
    handle: hh.handle,
    nome,
    destaque: pal.destaque,
    apoio: pal.apoio,
    tinta: pal.tinta,
    assinatura: (assinatura && assinatura !== true ? String(assinatura) : 'uma página para quem gosta de entender as coisas').trim(),
    curto,
    simbolo,
  };
  if (preset) pagina.preset = preset;
  if (bio && bio !== true) pagina.bio = String(bio);
  if (bioCurta) pagina.bioCurta = String(bioCurta);
  return { pagina, avisos, pal };
};

const textoPerfil = (p, nicho) => `PERFIL DA PÁGINA ${nicho ? `(${nicho})` : ''}
Gerado por npm run marca. Use o mesmo nome, @ e foto nas 4 redes.

Nome: ${p.nome}
@: ${p.handle}

Bio (Instagram e Facebook, até 150 caracteres):
${p.bio || p.assinatura[0].toUpperCase() + p.assinatura.slice(1) + '.'}

Bio curta (TikTok, até 80 caracteres):
${p.bioCurta || p.assinatura[0].toUpperCase() + p.assinatura.slice(1) + '.'}

Onde vai cada arquivo (pasta marca/saida):
- avatar.png: foto de perfil no Instagram, TikTok, YouTube e Facebook (as redes cortam em círculo; veja avatar-previa-circulo.png).
- banner-youtube.png: imagem do banner do canal do YouTube (2560x1440).
- banner-facebook.png: foto de capa da Página do Facebook.
- destaque-instagram.png: capa dos destaques do Instagram.
- logotipo.png: nome da página com fundo transparente (para assinar materiais).
- icone-app.png: ícone quadrado arredondado.
- design-system.png: folha com tudo junto, para conferir.

Cores: destaque ${p.destaque}, apoio ${p.apoio}, texto sobre o destaque ${p.tinta}.
`;

const backup = () => {
  if (!fs.existsSync(TOKENS)) return null;
  const dir = path.join(RAIZ, 'marca/historico');
  fs.mkdirSync(dir, { recursive: true });
  const d = new Date(); const z = (n) => String(n).padStart(2, '0');
  const arq = path.join(dir, `tokens-${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}.json`);
  fs.copyFileSync(TOKENS, arq);
  return path.relative(RAIZ, arq);
};
// troca só o bloco "paginas" no texto do arquivo: o JavaScript reordena chaves numéricas (como as de "neutros")
// e regravar o JSON inteiro mudaria o resto do arquivo sem motivo
const gravarTokens = (tokens) => {
  const txt = fs.existsSync(TOKENS) ? fs.readFileSync(TOKENS, 'utf8') : '';
  fs.mkdirSync(path.dirname(TOKENS), { recursive: true });
  const ini = txt.indexOf('"paginas"');
  const abre = txt.indexOf('{', ini);
  let nivel = 0, fim = -1, str = false;
  for (let i = abre; i < txt.length; i++) {
    const c = txt[i];
    if (str) { if (c === '\\') i++; else if (c === '"') str = false; continue; }
    if (c === '"') str = true; else if (c === '{') nivel++; else if (c === '}' && --nivel === 0) { fim = i; break; }
  }
  if (ini < 0 || fim < 0) return gravarAtomicoAsync(TOKENS, JSON.stringify(tokens, null, 2) + '\n');
  const bloco = JSON.stringify(tokens.paginas, null, 2).replace(/\n/g, '\n  ');
  return gravarAtomicoAsync(TOKENS, txt.slice(0, abre) + bloco + txt.slice(fim + 1));
};

/* ---------------- comandos ---------------- */
if (args.listar) {
  console.log('\nIdentidades prontas (use com --preset <nome>):\n');
  for (const [id, p] of Object.entries(PRESETS)) {
    console.log(`  ${id.padEnd(24)} ${p.nicho.padEnd(24)} cor ${p.cor} (${p.corNome})   ex.: ${p.nomes[0][0]} ${p.nomes[0][1]}`);
  }
  console.log('\nVeja a folha de cada uma em templates/identidades/<nome>/folha.png e os 10 nomes sugeridos em nomes.md.\n');
  process.exit(0);
}

if (args.ver) {
  const p = lerTokens().paginas.curiosidades || {};
  if (!p.handle || p.handle === '@suapagina') console.log('\nNenhuma marca configurada. O estúdio usa a paleta padrão.\n');
  else console.log(`\nMarca atual: ${p.nome} ${p.handle}\nDestaque ${p.destaque}  apoio ${p.apoio}  tinta ${p.tinta}\nAssinatura: ${p.assinatura}\n`);
  process.exit(0);
}

const nav = (await abrirNavegador(chromium)).nav;
try {
  if (args.ilustrando) {
    const tokens = lerTokens();
    tokens.paginas.curiosidades = { ...ILUSTRANDO };
    await gerarIdentidade({ tokens, pagina: tokens.paginas.curiosidades, saida: path.join(RAIZ, 'marca/saida'), logo: path.join(RAIZ, 'marca/logo'), nav });
    const antes = backup();
    await gravarTokens(tokens);
    console.log(`\nMarca de demonstração restaurada (${ILUSTRANDO.handle}).${antes ? ` A anterior ficou em ${antes}.` : ''}\n`);
  } else if (args.presets) {
    const tokens = lerTokens();
    const linhas = [];
    for (const [id, pr] of Object.entries(PRESETS)) {
      const [nome, handle] = pr.nomes[pr.exemplo || 0];
      const { pagina, avisos } = await montarPagina(nav, { nome, handle, cor: pr.cor, assinatura: pr.assinatura, bio: pr.bio, bioCurta: pr.bioCurta, preset: id }, tokens);
      const dir = path.join(RAIZ, 'templates/identidades', id);
      const pal = paletaDe(pr.cor, tokens.base.fundo);
      if (pal.destaque !== pr.cor.toUpperCase()) throw new Error(`preset ${id}: a cor ${pr.cor} não passa no contraste AA`);
      await gerarIdentidade({ tokens, pagina, saida: dir, logo: dir, folha: 'folha.png', extra: { nicho: pr.nicho, nomes: pr.nomes, bio: pr.bio }, nav });
      fs.writeFileSync(path.join(dir, 'perfil.txt'), textoPerfil(pagina, pr.nicho).replaceAll('pasta marca/saida', 'esta pasta'));
      fs.writeFileSync(path.join(dir, 'nomes.md'), `# ${pr.nicho}: 10 ideias de nome\n\nIdeias, não reservas. Antes de usar: confira se o @ está livre no Instagram, TikTok, YouTube e Facebook e se o nome não é marca registrada de alguém (guia 03, seção "Checar se está livre").\n\n| Nome | @ sugerido | Tamanho do @ |\n|---|---|---|\n${pr.nomes.map(([n, h]) => `| ${n} | ${h} | ${h.length - 1} |`).join('\n')}\n\nBio pronta (Instagram e Facebook):\n\n\`\`\`\n${pr.bio}\n\`\`\`\n\nBio curta (TikTok, até 80 caracteres):\n\n\`\`\`\n${pr.bioCurta}\n\`\`\`\n\nAplicar no estúdio:\n\n\`\`\`bash\nnpm run marca -- --preset ${id} --nome "${nome}" --handle "${handle}"\n\`\`\`\n`);
      linhas.push(`| ${pr.nicho} | \`${id}\` | ${pagina.destaque} (${pr.corNome}) | ${fmtContraste(contraste(pagina.destaque, tokens.base.fundo))} | ${fmtContraste(contraste(pagina.tinta, pagina.destaque))} |`);
      console.log(`${id}: ok${avisos.length ? ' (' + avisos.join('; ') + ')' : ''}`);
    }
    fs.writeFileSync(path.join(RAIZ, 'templates/identidades/contraste.md'), `# Contraste das identidades prontas\n\nCalculado pela fórmula da WCAG 2.x por \`npm run marca -- --presets\`. Fundo ${tokens.base.fundo}. O mínimo AA para texto é 4,5:1.\n\n| Nicho | Preset | Destaque | Destaque sobre o fundo | Texto sobre o destaque |\n|---|---|---|---|---|\n${linhas.join('\n')}\n`);
  } else {
    const tokens = lerTokens();
    const pr = args.preset && args.preset !== true ? PRESETS[args.preset] : null;
    if (args.preset && !pr) sair(`Não existe a identidade "${args.preset}". Opções: ${Object.keys(PRESETS).join(', ')}`);
    const entrada = {
      nome: args.nome, handle: args.handle, cor: args.cor || pr?.cor, curto: args.curto, letra: args.letra,
      assinatura: args.assinatura || pr?.assinatura, bio: args.bio || pr?.bio, bioCurta: pr?.bioCurta, preset: args.preset && args.preset !== true ? args.preset : undefined,
    };
    if (pr && !entrada.nome) { [entrada.nome, entrada.handle] = [pr.nomes[0][0], entrada.handle || pr.nomes[0][1]]; console.log(`Sem --nome: usei o exemplo do preset, ${entrada.nome}.`); }
    const { pagina, avisos, pal } = await montarPagina(nav, entrada, tokens);
    const teste = !!args.testar;
    const saida = path.join(RAIZ, teste ? 'marca/teste' : 'marca/saida');
    let antes = null;
    const t2 = structuredClone(tokens);
    t2.paginas.curiosidades = pagina;
    const arq = await gerarIdentidade({ tokens: t2, pagina, saida, logo: teste ? saida : path.join(RAIZ, 'marca/logo'), nav });
    fs.writeFileSync(path.join(saida, 'perfil.txt'), textoPerfil(pagina, pr?.nicho));
    if (!teste) { antes = backup(); await gravarTokens(t2); }
    console.log(`\n${teste ? 'PRÉVIA (nada foi trocado)' : 'Marca trocada'}: ${pagina.nome} ${pagina.handle}`);
    console.log(`Destaque ${pagina.destaque} (${fmtContraste(pal.contrastes.destaqueFundo)} sobre o fundo), apoio ${pagina.apoio}, texto sobre o destaque ${pagina.tinta} (${fmtContraste(pal.contrastes.tintaDestaque)}). Símbolo: letra ${pagina.simbolo.letra}.`);
    console.log(`Arquivos em ${path.relative(RAIZ, saida)}: ${arq.join(', ')}, perfil.txt`);
    if (antes) console.log(`A marca anterior ficou guardada em ${antes}. Para voltar à marca de demonstração: npm run marca -- --ilustrando`);
    if (avisos.length) console.log('\nAtenção:\n' + avisos.map((a) => '  - ' + a).join('\n'));
    console.log(teste ? '\nGostou? Rode o mesmo comando sem --testar para aplicar.\n' : '\nOs próximos vídeos e carrosséis já saem com esta marca. Os que já foram gerados não mudam: gere de novo se quiser.\n');
  }
} finally {
  await nav.close();
}
