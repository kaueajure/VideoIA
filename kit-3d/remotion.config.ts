// Configuração do Remotion Studio e do CLI (`npx remotion ...`).
// Os scripts de `npm run render` / `npm run previa` usam a API Node e leem
// as mesmas opções de `scripts/lib/render.ts` — mantenha as duas em sincronia.
import {Config} from '@remotion/cli/config';

Config.setEntryPoint('src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
// WebGL acelerado pela GPU (no Windows o ANGLE usa Direct3D). RENDER_GL=swangle = por software.
Config.setChromiumOpenGlRenderer(process.env.RENDER_GL === 'swangle' ? 'swangle' : 'angle');
Config.setOverwriteOutput(true);
