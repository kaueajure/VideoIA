// Tudo que uma cena (videos/<slug>/cenas.tsx) precisa importar vem daqui:
//   import {Palco, Boneco, Globo, Titulo, useCena, ...} from '../../src/kit';

// Sincronia com a narração
export {useCena, useMundo, type InfoCena} from '../video/contexto';
// true quando a cena vira fundo da capa (esconda títulos 2D próprios) ou imagem do carrossel (esconda rótulos 2D).
export {useNaCapa, useNoCarrossel, useSem2D} from '../video/contexto';
export type {Cenas} from '../video/indice';

// Palco 3D e câmera
export {Palco, FeixeDoHolofote, type PropsPalco} from './palco/Palco';
export {Ambiente, type TipoAmbiente} from './palco/Ambiente';
export {luzDaHora, type LuzDaHora} from './palco/hora';
export {
  ALVO_PADRAO,
  CAMERA_PADRAO,
  FOV_PADRAO,
  pontoDaCamera,
  type MovimentoCamera,
  type PontoDeCamera,
} from './palco/Camera';

// Bonecos
export {Boneco, type PropsBoneco} from './bonecos/Boneco';
export {NOMES_POSES, POSES, type NomePose, type Pose} from './bonecos/poses';

// Objetos 3D
export {Animado, type PropsAnimado, type PropsTransformacao} from './objetos/Animado';
export {Globo, Planeta, Sol} from './objetos/espaco';
export {Arvore, Nuvem, Passaro, Pedra} from './objetos/natureza';
export {Feixe, Onda, Particulas, Seta} from './objetos/diagramas';
export {Arroba, Interrogacao, Pedestal, Prisma} from './objetos/simbolos';
export {ArcoIris, CORES_ARCO_IRIS, Livro, Lampada, Lupa, Molecula, Olho} from './objetos/ciencia';
export {Casa, Montanha, Predio} from './objetos/lugares';
export {Foguete, Rover} from './objetos/veiculos';
export {Celular, Claquete, Computador, Coracao, Engrenagem, Microfone, Moeda, Relogio} from './objetos/cotidiano';
export {BolaFutebol, FaixaCampo, Gol, PeChute} from './objetos/futebol';
export {
  Compressor,
  fluxoDoGas,
  Geladeira,
  MEDIDAS_GELADEIRA,
  PECAS_GELADEIRA,
  pontoNaGeladeira,
  type PartesGeladeira,
  type PropsGeladeira,
} from './objetos/Geladeira';
// Biblioteca 3D Pro (vazia no kit inicial)
export * from './pro';

// Elementos 2D (por cima do 3D)
export {Numero, Rotulo, Titulo} from './tela/textos';
export {Legenda, estiloTextoForte} from './tela/Legenda';
export {AreaSegura, BarraProgresso, EntradaCena, Marca, Vinheta} from './tela/moldura';

// Animação, cores e fontes
export {entrar, misturar, misturarVec, oscilar, progresso, sair, suave} from './animacao';
export {AREA_SEGURA, COR, LEGENDA, PELE, ROUPA, type Vec3} from './tema';
export {FONTE} from './fontes';
export {AmbienciaContinua, Som, SONS, type TipoSom} from './sons';
export {texturaBrilho} from './texturas';
