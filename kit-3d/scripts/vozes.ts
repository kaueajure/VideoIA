// npm run vozes [-- --todas]
// Lista as vozes da sua conta ElevenLabs (para escolher a voz do canal: VOZ.vozDoCanal).
import {parseArgs} from 'node:util';
import {VOZ} from '../src/config';
import {carregarEnv, rodar} from './lib/projeto';
import {pedirElevenLabs} from './voz/elevenlabs';

type Voz = {
  voice_id: string;
  name: string;
  category?: string;
  labels?: Record<string, string>;
  verified_languages?: Array<{language?: string; locale?: string | null; accent?: string | null}>;
};

rodar(async () => {
  const {values} = parseArgs({options: {todas: {type: 'boolean', default: false}}});
  carregarEnv();
  const {voices} = await pedirElevenLabs<{voices: Voz[]}>('/v1/voices');
  const falaPortugues = (v: Voz) =>
    (v.verified_languages ?? []).some((l) => l.language === 'pt') || /portug|brazil/i.test(JSON.stringify(v.labels ?? {}));
  const lista = values.todas ? voices : voices.filter(falaPortugues);
  const atual = process.env.ELEVENLABS_VOICE_ID?.trim() || VOZ.vozDoCanal;

  console.log(
    values.todas
      ? `${voices.length} vozes na conta:\n`
      : `${lista.length} de ${voices.length} vozes com português verificado (use --todas para ver todas):\n`,
  );
  for (const v of lista) {
    const rotulos = Object.values(v.labels ?? {}).filter(Boolean).join(', ');
    const pt = (v.verified_languages ?? []).filter((l) => l.language === 'pt').map((l) => l.locale ?? l.accent ?? 'pt');
    console.log(
      `${v.voice_id === atual ? '★' : ' '} ${v.voice_id}  ${v.name.padEnd(28).slice(0, 28)}  ${(v.category ?? '').padEnd(12)} ${rotulos}${pt.length ? `  [pt: ${pt.join(', ')}]` : ''}`,
    );
  }
  console.log('\nPara usar uma delas, coloque o voice_id em src/config.ts > VOZ.vozDoCanal (★ = voz atual).');
  console.log('Vozes brasileiras da biblioteca: https://elevenlabs.io/app/voice-library (adicione à conta e rode de novo).');
});
