import {loadFont} from '@remotion/google-fonts/Montserrat';

// loadFont segura o render até a fonte carregar (precisa de internet no render).
const {fontFamily} = loadFont('normal', {
  weights: ['600', '800', '900'],
  subsets: ['latin', 'latin-ext'],
});

export const FONTE = fontFamily;
