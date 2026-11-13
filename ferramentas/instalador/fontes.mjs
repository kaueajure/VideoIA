/*
 * 
 * 
 */
/**
 * De onde o instalador baixa cada programa, com a versão travada e a impressão digital (SHA-256) de cada arquivo.
 * Nada é instalado se o SHA-256 do arquivo baixado não for exatamente este. Conferidos em 18/10/2026.
 *
 * Node.js: nodejs.org/dist (hashes do SHASUMS256.txt oficial, assinado pela equipe do Node). Os mesmos valores
 *   estão em bootstrap-unix e instalar.ps1, que baixam o Node antes de existir Node para rodar este arquivo.
 * FFmpeg e ffprobe: github.com/eugeneware/ffmpeg-static, release b6.1.1 (o mesmo binário do pacote npm
 *   ffmpeg-static, usado por milhões de projetos; GPL, com libx264). Hashes conferidos em 27/10/2026 contra o digest
 *   SHA-256 publicado pelo GitHub e no download. 0.6.5: saiu do b6.0 porque o FFmpeg 6.0 cortava o fim do vídeo com o
 *   -shortest (o motor também deixou de depender disso). Versão real de cada build do b6.1.1: Windows 6.1.1 (gyan.dev),
 *   Mac Intel 6.1.1, Linux 7.0.2 e Mac Apple Silicon ainda 6.0 (o estúdio monta o vídeo sem depender da versão).
 * Alinhador de voz: pacote npm @huggingface/transformers 4.2.0, travado com package-lock.json (integridade
 *   sha512 de cada pacote) em ferramentas/alinhador/; modelo onnx-community/whisper-base_timestamped numa
 *   revisão fixa (ver ferramentas/alinhar-voz.mjs).
 */
export const NODE_VERSAO = 'v22.23.3';
export const NODE = {
  'darwin-arm64': { url: `https://nodejs.org/dist/${NODE_VERSAO}/node-${NODE_VERSAO}-darwin-arm64.tar.gz`, sha256: '23b25245dcfb9af7262f8ff142e9e2e0af025368117329e7a7458a51e5922f53' },
  'darwin-x64': { url: `https://nodejs.org/dist/${NODE_VERSAO}/node-${NODE_VERSAO}-darwin-x64.tar.gz`, sha256: '8a677b0219178efd6eb0e475457c4afb452b521a92f6e67845a73bd85727f2a8' },
  'win32-x64': { url: `https://nodejs.org/dist/${NODE_VERSAO}/node-${NODE_VERSAO}-win-x64.zip`, sha256: '2b0ff57b049cda1bbcea2240eec20467018713c1efe1f7360c2681859b90ed71' },
  'win32-arm64': { url: `https://nodejs.org/dist/${NODE_VERSAO}/node-${NODE_VERSAO}-win-arm64.zip`, sha256: '33dad22e4cef5ee8f9fbb1b0d037fdacd0e56d12a4580f0d63f68b894deab535' },
  'linux-x64': { url: `https://nodejs.org/dist/${NODE_VERSAO}/node-${NODE_VERSAO}-linux-x64.tar.gz`, sha256: '1084aa36196bba4c3a5e69a1ee388a6e4ff729dad09445fbcd434b28fe3c24af' },
  'linux-arm64': { url: `https://nodejs.org/dist/${NODE_VERSAO}/node-${NODE_VERSAO}-linux-arm64.tar.gz`, sha256: '5ced2d48d1d7198739b7f86804de0171aefb6823b684b12341d3321afc3cb0b2' },
};

const FF = 'https://github.com/eugeneware/ffmpeg-static/releases/download/b6.1.1';
export const FFMPEG_VERSAO = '6.1.1 (ffmpeg-static b6.1.1)';
export const FFMPEG = {
  'darwin-arm64': {
    ffmpeg: { url: `${FF}/ffmpeg-darwin-arm64.gz`, sha256: '8923876afa8db5585022d7860ec7e589af192f441c56793971276d450ed3bbfa', mb: 19 },
    ffprobe: { url: `${FF}/ffprobe-darwin-arm64.gz`, sha256: 'd986a8ec7b030899fe66a8a288ed809a3543338705a3ce178cfb85869c5d80be', mb: 19 },
  },
  'darwin-x64': {
    ffmpeg: { url: `${FF}/ffmpeg-darwin-x64.gz`, sha256: '929b375c1182d956c51f7ac25e0b2b0411fb01f6f407aa15c9758efeb4242106', mb: 25 },
    ffprobe: { url: `${FF}/ffprobe-darwin-x64.gz`, sha256: 'd4da574d6e2e197bd259b47d69cf262df9e312af24ad960444f6d806d3d4c186', mb: 25 },
  },
  'win32-x64': {
    ffmpeg: { url: `${FF}/ffmpeg-win32-x64.gz`, sha256: '8883a3dffbd0a16cf4ef95206ea05283f78908dbfb118f73c83f4951dcc06d77', mb: 29 },
    ffprobe: { url: `${FF}/ffprobe-win32-x64.gz`, sha256: 'f309e6223ad89d2fe54bccd420a7709b66fd27540674e92309578ed491a43c8d', mb: 29 },
  },
  'linux-x64': {
    ffmpeg: { url: `${FF}/ffmpeg-linux-x64.gz`, sha256: 'bfe8a8fc511530457b528c48d77b5737527b504a3797a9bc4866aeca69c2dffa', mb: 29 },
    ffprobe: { url: `${FF}/ffprobe-linux-x64.gz`, sha256: '25d9b6ccb05e3d9de9e04e31e2506d8dd7f9f0418981965ac6df12e8d3afd067', mb: 29 },
  },
};
// Windows em processador ARM roda os programas x64 por emulação (Windows 11)
FFMPEG['win32-arm64'] = FFMPEG['win32-x64'];

/** "darwin-arm64", "win32-x64"... do computador (ou do que for passado, para os testes). */
export const plataforma = (p = process.platform, a = process.arch) => `${p}-${a}`;
