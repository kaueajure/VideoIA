// Cenas de "Por que o céu é azul?". Uma entrada em `cenas` para cada id do video.json.
// Regra de densidade: algo visível desde o quadro 0 e um elemento novo a cada ~1–1,5 s.
import React from 'react';
import {interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  Animado,
  ArcoIris,
  Arvore,
  Boneco,
  Casa,
  COR,
  CORES_ARCO_IRIS,
  Feixe,
  Foguete,
  Globo,
  Interrogacao,
  Lampada,
  Livro,
  misturarVec,
  Molecula,
  Nuvem,
  Numero,
  Olho,
  Onda,
  Palco,
  Particulas,
  Passaro,
  Pedestal,
  Pedra,
  Planeta,
  Prisma,
  progresso,
  Rotulo,
  Rover,
  Seta,
  Sol,
  Som,
  suave,
  Titulo,
  useCena,
  type Cenas,
  type TipoAmbiente,
  type Vec3,
} from '../../src/kit';

const AZUL_CEU = '#3f8fe6';
const AZUL_LUZ = '#4d9bff';
const VERMELHO = '#ff4a4a';
const VIOLETA = '#8b4dff';
const POR_DO_SOL = '#d8612b';
const AO_AR_LIVRE: TipoAmbiente[] = ['nuvens', 'montanhas'];

// Passarinhos atravessando o céu (para cenas ao ar livre).
const Revoada: React.FC<{y?: number; z?: number; cor?: string}> = ({y = 4.2, z = -4, cor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Passaro
          key={i}
          semente={`p${i}`}
          cor={cor}
          posicao={[-2.6 + t * 0.55 + i * 0.35, y + Math.sin(t * 2 + i) * 0.08 - i * 0.18, z - i * 0.4]}
          escala={0.9 - i * 0.12}
        />
      ))}
    </>
  );
};

const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tSol = quando('Sol');
  const tTarde = quando('tarde');
  const sol: Vec3 = [0.95, 3.9, -3];
  return (
    <>
    <Palco camera={{tipo: 'mover', de: {posicao: [0, 0.7, 8], alvo: [0, 1.6, 0]}, para: {posicao: [0, 1.0, 6.3], alvo: [0, 1.9, 0]}}}>
      <Boneco poses={[{quadro: 0, pose: 'olhandoCima'}, {quadro: quando('laranja'), pose: 'deOmbros'}]} />
      <Animado entrada={0} posicao={sol} flutuar={0.05} pulsar={0.03}>
        <Sol raio={0.42} cor={interpolateColors(frame, [tTarde, tTarde + 20], ['#ffc23a', '#ff8a3d'])} />
      </Animado>
      <Feixe
        de={[sol[0] - 0.25, sol[1] - 0.35, sol[2] + 0.4]}
        para={[0.05, 2.25, 0.1]}
        progresso={progresso(frame, tSol, tSol + 16)}
        cor="#ffffff"
        espessura={0.03}
        pulsos={2}
      />
      <Animado entrada={quando('branca')} posicao={[0.4, 2.9, -1]}>
        <Particulas quantidade={30} area={[1.4, 1.2, 0.8]} tamanho={0.03} cores={['#ffffff', '#fff3c4']} brilhar agitacao={0.12} semente="branca" />
      </Animado>
      <Animado entrada={quando('azul')} posicao={[-0.85, 2.3, -0.8]} girar={0.7} flutuar={0.06} escala={0.95}>
        <Interrogacao />
      </Animado>
      <Animado entrada={quando('azul') + 4} posicao={[0, 2.6, -0.5]}>
        <Particulas quantidade={50} area={[2.4, 1.6, 1.2]} tamanho={0.035} cores={[AZUL_LUZ, '#9fd8ff']} brilhar agitacao={0.2} semente="ceu" />
      </Animado>
      <Animado entrada={quando('laranja')} posicao={[0.75, 1.2, -0.4]} girar={-0.8} flutuar={0.05} escala={0.6}>
        <Interrogacao cor={COR.laranja} />
      </Animado>
    </Palco>
    <Som tipo="pergunta" em={quando('azul')} />
    </>
  );
};

const LuzBranca: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tMistura = quando('mistura');
  const tCores = quando('cores');
  const centro: Vec3 = [0.1, 2.0, 0];
  return (
    <>
      <Palco
        disco={false}
        feixe={false}
        camera={{tipo: 'mover', de: {posicao: [0, 2.0, 7.2], alvo: [0, 2.0, 0]}, para: {posicao: [0.2, 2.1, 6.4], alvo: [0.2, 2.0, 0]}}}
      >
        <Animado posicao={[-0.7, 3.35, -0.6]} pulsar={0.03}>
          <Sol raio={0.34} />
        </Animado>
        <Feixe de={[-0.55, 3.12, -0.5]} para={centro} progresso={progresso(frame, 3, 18)} cor="#ffffff" espessura={0.05} pulsos={3} />
        <Animado entrada={8} posicao={centro} pulsar={0.06}>
          <mesh>
            <icosahedronGeometry args={[0.13, 1]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </Animado>
        {CORES_ARCO_IRIS.map((cor, i) => (
          <Feixe
            key={cor}
            de={centro}
            para={[1.0, 2.5 - i * 0.2, 0]}
            progresso={progresso(frame, tMistura + i * 3, tMistura + i * 3 + 16)}
            cor={cor}
            espessura={0.04}
          />
        ))}
        <Animado entrada={tMistura + 10} posicao={[0.65, 2.0, 0.1]}>
          <Particulas quantidade={40} area={[0.9, 1.3, 0.4]} tamanho={0.025} cores={CORES_ARCO_IRIS} brilhar agitacao={0.08} semente="faiscas" />
        </Animado>
        <ArcoIris posicao={[0.1, 0.35, -2.2]} raio={1.5} espessura={0.11} progresso={progresso(frame, tCores, tCores + 22)} opacidade={0.75} />
      </Palco>
      <Rotulo texto="luz branca" x={430} y={700} entrada={quando('branca')} cor="#ffffff" />
      <Som tipo="brilho" em={tMistura} />
    </>
  );
};

const PrismaDeNewton: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const prisma: Vec3 = [0.55, 1.33, 0];
  const tRaio = quando('raio de sol');
  const tPrisma = quando('prisma de vidro');
  return (
    <>
      <Palco feixe={false} camera={{tipo: 'orbita', alvo: [0, 1.5, 0], raio: 7.2, altura: 2.0, de: -12, ate: 8}}>
        <Boneco posicao={[-0.65, 0, 0.5]} giro={30} pose="apontando" visual={4} cabelo="#e6e6e6" falando />
        {/* mesa de estudo com livro aberto e lâmpada */}
        <Pedestal posicao={[-0.95, 0, -1.3]} raio={0.55} altura={0.85} cor={COR.destaque}>
          <Livro aberto rotacao={[0, 0.4, 0]} escala={0.8} cor="#8a4b2f" />
        </Pedestal>
        <Lampada posicao={[-1.25, 0.9, -1.6]} escala={0.45} acesa={0.8} />
        {/* prisma num pedestal, visível desde o início */}
        <Pedestal posicao={[0.55, 0, 0]} raio={0.36} altura={1.0} cor={COR.ciano}>
          <Animado posicao={[0, 0.33, 0]} pulsar={frame > tPrisma ? 0.04 : 0}>
            <Prisma tamanho={0.42} profundidade={0.5} />
          </Animado>
        </Pedestal>
        <Animado posicao={[-1.15, 3.7, -1.2]} pulsar={0.03}>
          <Sol raio={0.3} />
        </Animado>
        <Feixe
          de={[-1.0, 3.45, -1.0]}
          para={[prisma[0] - 0.12, prisma[1] + 0.08, 0]}
          progresso={progresso(frame, tRaio, tRaio + 14)}
          cor="#ffffff"
          espessura={0.035}
          pulsos={2}
        />
        {CORES_ARCO_IRIS.map((cor, i) => (
          <Feixe
            key={cor}
            de={[prisma[0] + 0.12, prisma[1] - 0.02, 0]}
            para={[1.3, 1.15 - i * 0.12, 0.3]}
            progresso={progresso(frame, tPrisma + 4 + i * 2, tPrisma + 18 + i * 2)}
            cor={cor}
            espessura={0.03}
          />
        ))}
      </Palco>
      <Rotulo texto="Isaac Newton" x={290} y={720} entrada={quando('Newton')} cor="#ffffff" />
      <Rotulo texto="há +300 anos" x={760} y={470} entrada={quando('trezentos')} cor={COR.destaque} />
      <Som tipo="luz" em={tRaio} />
      <Som tipo="brilho" em={tPrisma + 4} />
    </>
  );
};

const Ondas: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tVermelho = quando('vermelho');
  const tAzul = quando('azul');
  // Destaque: depois de "vermelho" só o vermelho brilha; depois de "azul", só o azul.
  const opacidade = (i: number) => {
    if (frame < tVermelho) {
      return 1;
    }
    if (frame < tAzul) {
      return i === 0 ? 1 : suave(frame, [tVermelho, tVermelho + 8], [1, 0.22]);
    }
    return i === 4 ? 1 : suave(frame, [tAzul, tAzul + 8], [i === 0 ? 1 : 0.22, 0.22]);
  };
  return (
    <>
      <Palco
        disco={false}
        feixe={false}
        camera={{tipo: 'mover', de: {posicao: [0.1, 2.5, 6.8], alvo: [0.1, 2.5, 0]}, para: {posicao: [0.1, 2.5, 6.2], alvo: [0.1, 2.5, 0]}, tremor: 0.015}}
      >
        <Animado posicao={[-0.8, 2.6, 0]}>
          <Prisma tamanho={0.32} profundidade={0.4} />
        </Animado>
        <Feixe de={[-1.3, 3.5, 0]} para={[-0.86, 2.66, 0]} progresso={progresso(frame, 0, 10)} cor="#ffffff" espessura={0.03} pulsos={1} />
        {CORES_ARCO_IRIS.map((cor, i) => (
          <Onda
            key={cor}
            posicao={[-0.62, 3.3 - i * 0.24, 0]}
            comprimento={1.9}
            amplitude={0.09}
            comprimentoDeOnda={0.95 - i * 0.13}
            velocidade={0.6 + i * 0.22}
            cor={cor}
            espessura={i === 0 || i === 4 ? 0.03 : 0.022}
            progresso={progresso(frame, i * 3, i * 3 + 24)}
            opacidade={opacidade(i)}
          />
        ))}
      </Palco>
      <Rotulo texto="ondas longas" x={540} y={460} entrada={quando('longas')} saida={tAzul - 6} cor={VERMELHO} corTexto="#ffffff" />
      <Rotulo texto="ondas curtas" x={540} y={460} entrada={quando('curtas')} cor={AZUL_LUZ} corTexto="#ffffff" />
    </>
  );
};

const Atmosfera: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando, duracao} = useCena();
  const tEntra = quando('entra na atmosfera');
  const tMoleculas = quando('moléculas');
  const impacto: Vec3 = [-0.83, 2.5, 0.4];
  const moleculas: Vec3 = [-0.91, 2.59, 0.44];
  return (
    <>
      <Palco
        chao={false}
        feixe={false}
        estrelas
        nevoa={false}
        camera={{
          tipo: 'chaves',
          chaves: [
            {quadro: 0, posicao: [0, 1.7, 8.2], alvo: [0, 1.7, 0]},
            {quadro: tEntra, posicao: [-0.2, 1.8, 6.6], alvo: [-0.2, 1.8, 0]},
            {quadro: tMoleculas + 8, posicao: [-1.75, 3.15, 4.4], alvo: moleculas},
            {quadro: duracao, posicao: [-1.7, 3.1, 4.0], alvo: moleculas},
          ],
        }}
      >
        <Animado posicao={[-1.1, 4.3, -4]} pulsar={0.03}>
          <Sol raio={0.45} />
        </Animado>
        <Globo posicao={[0, 1.7, 0]} raio={1.15} girar={0.15} />
        <Animado posicao={[1.25, 2.9, -1]} girar={0.4}>
          <Planeta raio={0.2} estilo="manchas" cor="#9aa0ad" corSecundaria="#cfd3dc" />
        </Animado>
        <Feixe de={[-1.0, 4.0, -3.6]} para={impacto} progresso={progresso(frame, 4, quando('luz'))} cor="#ffffff" espessura={0.04} pulsos={3} />
        <Animado entrada={tMoleculas} posicao={moleculas}>
          <Particulas quantidade={70} area={[0.9, 0.7, 0.5]} tamanho={0.016} cores={['#9fd8ff', '#ffffff', '#c9b8ff']} brilhar agitacao={0.04} />
        </Animado>
        <Animado
          entrada={quando('nitrogênio')}
          posicao={[moleculas[0] - 0.22, moleculas[1] + 0.12, moleculas[2] + 0.3]}
          girar={1.2}
          escala={0.55}
        >
          <Molecula formula="N2" />
        </Animado>
        <Animado
          entrada={quando('oxigênio')}
          posicao={[moleculas[0] + 0.22, moleculas[1] - 0.08, moleculas[2] + 0.25]}
          girar={-1.1}
          escala={0.55}
        >
          <Molecula formula="O2" />
        </Animado>
      </Palco>
      <Rotulo texto="150 milhões de km" x={540} y={420} entrada={quando('milhões')} saida={tEntra + 10} cor="#ffffff" />
      <Rotulo texto="nitrogênio + oxigênio" x={540} y={420} entrada={quando('nitrogênio')} cor={COR.ciano} />
      <Som tipo="mergulho" em={tEntra} />
    </>
  );
};

const DIRECOES_RICOCHETE: Vec3[] = [
  [1.3, 1.1, 0.2],
  [0.2, 1.6, -0.3],
  [-1.1, 1.2, 0.3],
  [-1.5, -0.2, 0.4],
  [-0.9, -1.0, -0.2],
  [0.3, -1.2, 0.3],
  [1.4, -0.6, -0.3],
  [0.9, 0.4, 1.2],
  [-0.4, 0.6, -1.4],
];

const MOLECULAS_AO_REDOR: Array<{pos: Vec3; formula: 'N2' | 'O2'}> = [
  {pos: [-1.0, 3.2, -0.6], formula: 'N2'},
  {pos: [1.05, 2.9, -0.4], formula: 'O2'},
  {pos: [-0.9, 1.15, -0.3], formula: 'O2'},
  {pos: [0.95, 1.3, -0.8], formula: 'N2'},
  {pos: [0.2, 3.6, -1.2], formula: 'N2'},
];

const Espalhamento: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const centro: Vec3 = [0, 2.15, 0];
  const tRicochete = quando('ricocheteiam');
  const tVermelho = quando('vermelho');
  const tCinco = quando('cinco');
  return (
    <>
      <Palco
        chao={false}
        feixe={false}
        nevoa={false}
        fundo="#04060c"
        camera={{tipo: 'mover', de: {posicao: [0, 2.15, 7.2], alvo: centro}, para: {posicao: [0.3, 2.2, 6.2], alvo: centro}}}
      >
        <Particulas posicao={centro} quantidade={90} area={[3.2, 2.6, 1.6]} tamanho={0.028} cores={['#9fd8ff', '#ffffff']} brilhar agitacao={0.08} />
        <Animado posicao={centro} girar={0.9} escala={1.1}>
          <Molecula formula="N2" />
        </Animado>
        {MOLECULAS_AO_REDOR.map((m, i) => (
          <Animado key={i} posicao={m.pos} entrada={quando('moléculas') + i * 3} girar={0.6 + i * 0.15} flutuar={0.05} escala={0.7}>
            <Molecula formula={m.formula} />
          </Animado>
        ))}
        <Feixe de={[-2.6, 2.15, 0]} para={centro} progresso={progresso(frame, 2, 16)} cor="#ffffff" espessura={0.04} pulsos={2} />
        {DIRECOES_RICOCHETE.map((d, i) => (
          <Feixe
            key={i}
            de={centro}
            para={[centro[0] + d[0], centro[1] + d[1], centro[2] + d[2]]}
            progresso={progresso(frame, tRicochete + i * 2, tRicochete + i * 2 + 12)}
            cor={AZUL_LUZ}
            espessura={0.026}
            pulsos={1}
            velocidade={0.9}
          />
        ))}
        <Feixe de={centro} para={[2.7, 2.0, 0]} progresso={progresso(frame, tVermelho - 4, tVermelho + 12)} cor={VERMELHO} espessura={0.034} />
      </Palco>
      <Numero ate={5} sufixo="x" entrada={tCinco} duracao={18} y={360} cor={AZUL_LUZ} />
      <Rotulo texto="mais espalhado" x={540} y={520} entrada={tCinco + 12} cor={AZUL_LUZ} corTexto="#ffffff" />
      <Som tipo="revelar" em={tCinco} />
    </>
  );
};

const Rayleigh: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {quando} = useCena();
  const tFisico = quando('físico');
  return (
    <>
      <Palco camera={{tipo: 'orbita', alvo: [0, 1.2, 0], raio: 6.4, altura: 2.0, de: 25, ate: -15}}>
        <Pedestal posicao={[0.35, 0, 0]} raio={0.7} altura={0.45} cor={AZUL_LUZ}>
          <Animado posicao={[0, 0.95, 0]} entrada={4} girar={0.5}>
            <Particulas quantidade={40} area={[0.9, 0.9, 0.9]} tamanho={0.05} cores={[AZUL_LUZ, '#ffffff', '#9fd8ff']} brilhar agitacao={0.1} />
          </Animado>
          {[0, 1, 2].map((i) => {
            const a = (frame / fps) * 0.8 + (i * Math.PI * 2) / 3;
            return (
              <group key={i} position={[Math.cos(a) * 0.95, 0.95 + Math.sin(a * 2) * 0.15, Math.sin(a) * 0.95]}>
                <Molecula formula={i === 1 ? 'O2' : 'N2'} escala={0.6} />
              </group>
            );
          })}
        </Pedestal>
        <Boneco posicao={[-0.8, 0, 0.7]} giro={35} pose="explicando" visual={2} falando />
        <Animado entrada={quando('homenagem')} posicao={[-1.25, 0, -0.7]}>
          <Pedestal raio={0.35} altura={0.6} cor={COR.destaque}>
            <Livro aberto escala={0.6} cor="#5a3c8a" />
          </Pedestal>
        </Animado>
        <Animado entrada={tFisico} posicao={[-0.8, 2.35, 0.7]} flutuar={0.04}>
          <Lampada escala={0.45} acesa={suave(frame, [tFisico + 6, tFisico + 22], [0, 1])} />
        </Animado>
      </Palco>
      <Titulo texto="espalhamento de Rayleigh" destaque="Rayleigh" entrada={quando('espalhamento')} y={430} tamanho={84} />
      <Rotulo texto="século XIX" x={540} y={600} entrada={quando('dezenove')} cor={COR.destaque} />
      <Som tipo="ideia" em={tFisico + 6} />
    </>
  );
};

const CABECA: Vec3 = [0, 1.95, 0];
const ORIGENS_DA_LUZ: Vec3[] = [
  [-2.1, 4.4, -1.2],
  [-0.6, 5.0, -2.0],
  [1.0, 4.9, -1.6],
  [2.3, 4.1, -0.6],
  [-2.6, 2.9, 0.6],
  [2.7, 3.1, 0.8],
  [0.1, 4.6, 1.4],
];
const pertoDaCabeca = (origem: Vec3): Vec3 => {
  const d: Vec3 = [origem[0] - CABECA[0], origem[1] - CABECA[1], origem[2] - CABECA[2]];
  const n = Math.hypot(...d);
  return [CABECA[0] + (d[0] / n) * 0.45, CABECA[1] + (d[1] / n) * 0.45, CABECA[2] + (d[2] / n) * 0.45];
};

const CeuAzul: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tLuz = quando('luz azul');
  return (
    <>
    <Palco
      fundo={interpolateColors(frame, [0, 24], [COR.fundo, AZUL_CEU])}
      chao="#2c4a3a"
      disco={false}
      feixe={false}
      nevoa={[9, 30]}
      ambiente={AO_AR_LIVRE}
      camera={{tipo: 'mover', de: {posicao: [0, 1.2, 7.8], alvo: [0, 2.1, 0]}, para: {posicao: [0, 1.15, 6.6], alvo: [0, 2.3, 0]}}}
    >
      <Boneco poses={[{quadro: 0, pose: 'olhandoCima'}, {quadro: quando('todas as direções'), pose: 'comemorando'}]} />
      <Nuvem posicao={[-1.5, 4.3, -4]} escala={0.75} />
      <Nuvem posicao={[1.7, 4.9, -6]} />
      <Arvore posicao={[-1.9, 0, -2.2]} />
      <Arvore posicao={[2.0, 0, -2.8]} tipo="redonda" />
      <Casa posicao={[-1.3, 0, -4.2]} rotacao={[0, 0.5, 0]} escala={0.9} />
      <Arvore posicao={[1.1, 0, -5]} escala={1.2} />
      <Revoada y={4.0} z={-3} />
      <Animado entrada={quando('olhe')} posicao={[0, 3.6, -1]}>
        <Particulas quantidade={70} area={[4, 2.4, 2]} tamanho={0.035} cores={[AZUL_LUZ, '#bfe3ff']} brilhar agitacao={0.25} semente="luz-azul" />
      </Animado>
      {ORIGENS_DA_LUZ.map((origem, i) => (
        <Seta
          key={i}
          de={origem}
          para={pertoDaCabeca(origem)}
          progresso={progresso(frame, tLuz + i * 3, tLuz + i * 3 + 14)}
          cor={AZUL_LUZ}
          espessura={0.04}
        />
      ))}
    </Palco>
    <Som tipo="luz" em={tLuz} intensidade={0.8} />
    </>
  );
};

const Violeta: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tVioleta = quando('violeta');
  return (
    <>
    <Palco
      corDoAro={VIOLETA}
      corDaContraluz="#a57bff"
      camera={{tipo: 'mover', de: {posicao: [0.3, 1.8, 7.4], alvo: [0.2, 1.8, 0]}, para: {posicao: [0.1, 1.7, 6.4], alvo: [0.1, 1.9, 0]}}}
    >
      <Boneco posicao={[-0.55, 0, 0]} poses={[{quadro: 0, pose: 'parado'}, {quadro: quando('por que'), pose: 'pensando'}]} visual={4} />
      {CORES_ARCO_IRIS.slice(0, 5).map((cor, i) => (
        <Onda
          key={cor}
          posicao={[-0.35, 3.75 - i * 0.16, -0.6]}
          comprimento={1.3}
          amplitude={0.05}
          comprimentoDeOnda={0.9 - i * 0.13}
          velocidade={0.8 + i * 0.2}
          cor={cor}
          espessura={0.015}
          opacidade={0.35}
        />
      ))}
      <Onda
        posicao={[-0.35, 2.85, -0.3]}
        comprimento={1.3}
        amplitude={0.17}
        comprimentoDeOnda={0.24}
        velocidade={2}
        cor={VIOLETA}
        progresso={progresso(frame, tVioleta - 4, tVioleta + 16)}
        espessura={0.032}
      />
      <Animado entrada={quando('por que')} posicao={[0.95, 2.0, -0.6]} girar={-0.6} flutuar={0.05} escala={0.55}>
        <Interrogacao cor="#7a5cff" />
      </Animado>
      <Animado entrada={quando('roxo')} posicao={[0.6, 1.2, -0.2]} girar={0.8} flutuar={0.05} escala={0.8}>
        <Interrogacao cor="#a56bff" />
      </Animado>
    </Palco>
    <Som tipo="pergunta" em={quando('roxo')} />
    </>
  );
};

const Olhos: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tEmite = quando('emite');
  const tAbsorvida = quando('absorvida');
  const tOlhos = quando('olhos');
  const sol: Vec3 = [0.85, 3.75, -3];
  const olho: Vec3 = [0.75, 1.75, 0.4];
  return (
    <>
      <Palco
        camera={{tipo: 'mover', de: {posicao: [0.4, 1.8, 7.2], alvo: [0.2, 1.8, 0]}, para: {posicao: [0.2, 1.75, 6.4], alvo: [0.1, 1.85, 0]}}}
      >
        <Boneco posicao={[-0.6, 0, 0]} giro={15} pose="explicando" visual={1} falando />
        <Animado posicao={sol} pulsar={0.03}>
          <Sol raio={0.36} />
        </Animado>
        {/* o Sol emite todas as cores; o violeta sai mais fraco */}
        {CORES_ARCO_IRIS.map((cor, i) => (
          <Feixe
            key={cor}
            de={[sol[0] - 0.15, sol[1] - 0.25, sol[2] + 0.3]}
            para={[sol[0] - 1.35 + i * 0.18, sol[1] - 1.2, sol[2] + 1.1]}
            progresso={progresso(frame, i * 2, i * 2 + 14)}
            cor={cor}
            espessura={cor === VIOLETA ? 0.008 : 0.016}
          />
        ))}
        {/* camada alta da atmosfera que segura parte do violeta */}
        <Animado entrada={tAbsorvida - 4} posicao={[0.2, 3.05, -2.2]}>
          <mesh>
            <cylinderGeometry args={[2.6, 2.6, 0.12, 32]} />
            <meshStandardMaterial color={VIOLETA} emissive={VIOLETA} emissiveIntensity={0.4} transparent opacity={0.35} />
          </mesh>
        </Animado>
        {[-0.35, 0, 0.35].map((dx, i) => (
          <Feixe
            key={`v${i}`}
            de={[sol[0] + dx * 0.4, sol[1] - 0.3, sol[2] + 0.3]}
            para={[sol[0] - 0.6 + dx, 3.1, -2.2]}
            progresso={progresso(frame, tEmite + i * 4, tEmite + i * 4 + 14)}
            cor={VIOLETA}
            espessura={0.02}
            pulsos={1}
          />
        ))}
        {[-0.2, 0.15].map((dx, i) => (
          <Feixe
            key={`a${i}`}
            de={[sol[0] + dx, sol[1] - 0.3, sol[2] + 0.3]}
            para={[olho[0] + dx * 0.3, olho[1] + 0.2, olho[2]]}
            progresso={progresso(frame, tOlhos + i * 4, tOlhos + i * 4 + 16)}
            cor={AZUL_LUZ}
            espessura={0.024}
            pulsos={2}
          />
        ))}
        <Animado entrada={tOlhos} posicao={olho} escala={0.7} flutuar={0.04}>
          <Olho corIris={AZUL_LUZ} />
        </Animado>
      </Palco>
      <Rotulo texto="Sol: menos violeta" x={380} y={330} entrada={tEmite} cor={VIOLETA} corTexto="#ffffff" tamanho={40} />
      <Rotulo texto="absorvido lá no alto" x={380} y={440} entrada={tAbsorvida} cor="#5b6cff" corTexto="#ffffff" tamanho={40} />
      <Rotulo texto="olhos preferem azul" x={380} y={550} entrada={tOlhos} cor={AZUL_LUZ} corTexto="#ffffff" tamanho={40} />
      <Som tipo="surgir" em={tOlhos} />
    </>
  );
};

// Caminho do raio de sol no fim da tarde: do Sol baixo até o boneco.
const RAIO_TARDE: [Vec3, Vec3] = [
  [1.75, 1.1, -6.2],
  [-0.4, 1.95, 0.3],
];

const PaisagemDoPorDoSol: React.FC = () => (
  <>
    <Animado posicao={[2.0, 1.0, -7]}>
      <Sol raio={0.9} cor="#ffb04a" corBrilho="#ff7a1a" raios={false} brilho={1.7} />
    </Animado>
    <Boneco posicao={[-0.45, 0, 0.3]} giro={150} escala={0.85} pose="parado" cor="#1c1622" calca="#120e16" pele="#2a2026" cabelo="#0c0a0e" />
    <Arvore posicao={[-2.1, 0, -1.6]} cor="#22161f" corTronco="#170f15" />
    <Arvore posicao={[-1.4, 0, -3.4]} cor="#22161f" corTronco="#170f15" escala={1.3} />
    <Casa posicao={[0.9, 0, -3.6]} rotacao={[0, -0.4, 0]} corParede="#2b1c26" corTelhado="#1e141b" janelasAcesas />
    <Arvore posicao={[2.1, 0, -2.4]} tipo="redonda" cor="#22161f" corTronco="#170f15" />
    <Revoada y={3.1} z={-4} cor="#1a1016" />
  </>
);

const PorDoSol: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tLuz = quando('luz');
  const tAr = quando('muito mais ar');
  return (
    <Palco
      fundo={interpolateColors(frame, [0, 45], [AZUL_CEU, POR_DO_SOL])}
      chao="#2a1a24"
      disco={false}
      feixe={false}
      nevoa={[8, 26]}
      luz={0.75}
      corDaContraluz="#ff9a5a"
      ambiente={['poeira', 'montanhas']}
      corDasMontanhas="#3a2333"
      camera={{tipo: 'mover', de: {posicao: [-0.1, 1.0, 7.8], alvo: [0.1, 1.5, 0]}, para: {posicao: [0, 0.95, 6.9], alvo: [0.15, 1.5, 0]}}}
    >
      <PaisagemDoPorDoSol />
      <Feixe de={RAIO_TARDE[0]} para={RAIO_TARDE[1]} progresso={progresso(frame, tLuz, tLuz + 30)} cor="#ffe3b0" espessura={0.035} pulsos={3} />
      <Animado entrada={tAr} posicao={[0.6, 1.5, -3]}>
        <Particulas quantidade={120} area={[3.4, 1.8, 6]} tamanho={0.025} cores={['#ffd9b0', '#ffffff']} brilhar agitacao={0.06} />
      </Animado>
    </Palco>
  );
};

const Laranja: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tAzul = quando('azul');
  const tSobram = quando('sobram');
  const chegam: Array<[string, number]> = [
    ['#ffe12e', quando('amarelo')],
    ['#ff8a1f', quando('laranja')],
    [VERMELHO, quando('vermelho')],
  ];
  return (
    <>
      <Palco
        fundo={interpolateColors(frame, [0, 60], [POR_DO_SOL, '#b8401c'])}
        chao="#2a1a24"
        disco={false}
        feixe={false}
        nevoa={[8, 26]}
        luz={0.7}
        corDaContraluz="#ff9a5a"
        ambiente={['poeira', 'montanhas']}
        corDasMontanhas="#3a2333"
        camera={{tipo: 'mover', de: {posicao: [0, 0.95, 6.9], alvo: [0.15, 1.5, 0]}, para: {posicao: [0.25, 1.1, 6.3], alvo: [0.25, 1.5, -1]}}}
      >
        <PaisagemDoPorDoSol />
        <Feixe
          de={RAIO_TARDE[0]}
          para={RAIO_TARDE[1]}
          cor={interpolateColors(frame, [tAzul, tSobram + 10], ['#ffe3b0', '#ff7a2a'])}
          espessura={0.04}
          pulsos={3}
        />
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((k, i) => {
          const ponto = misturarVec(RAIO_TARDE[0], RAIO_TARDE[1], k);
          return (
            <Seta
              key={k}
              de={ponto}
              para={[ponto[0] + (i % 2 ? 0.5 : -0.4), ponto[1] + 0.9, ponto[2] + 0.3]}
              progresso={progresso(frame, tAzul + i * 4, tAzul + i * 4 + 12)}
              cor={AZUL_LUZ}
              espessura={0.03}
            />
          );
        })}
        {chegam.map(([cor, t], i) => (
          <Feixe
            key={cor}
            de={[RAIO_TARDE[0][0], RAIO_TARDE[0][1] + 0.15 * (i + 1), RAIO_TARDE[0][2]]}
            para={[RAIO_TARDE[1][0], RAIO_TARDE[1][1] + 0.12 * (i + 1), RAIO_TARDE[1][2]]}
            progresso={progresso(frame, t - 4, t + 14)}
            cor={cor}
            espessura={0.022}
            pulsos={1}
          />
        ))}
      </Palco>
      <Rotulo texto="sobra o laranja" x={540} y={420} entrada={tSobram} cor="#ff8a3d" corTexto="#ffffff" />
    </>
  );
};

const Espaco: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {quando, duracao} = useCena();
  const tSol = quando('Sol');
  const t = frame / fps;
  const voo = progresso(frame, 0, duracao, (x) => x);
  return (
    <>
      <Palco
        chao={false}
        feixe={false}
        nevoa={false}
        estrelas
        fundo="#000000"
        camera={{tipo: 'orbita', alvo: [0, 1.6, 0], raio: 7, altura: 1.9, de: -12, ate: 12}}
      >
        <Animado posicao={[0.55, 3.15, -3]} pulsar={0.03} escala={1 + suave(frame, [tSol, tSol + 12], [0, 0.25])}>
          <Sol raio={0.5} />
        </Animado>
        <Globo posicao={[-0.5, 1.0, -1.5]} raio={0.9} girar={0.2} />
        <group position={[-0.5 + Math.cos(t * 0.9) * 1.45, 1.0 + Math.sin(t * 0.9) * 0.35, -1.5 + Math.sin(t * 0.9) * 1.2]}>
          <Planeta raio={0.18} estilo="manchas" cor="#9aa0ad" corSecundaria="#cfd3dc" />
        </group>
        <Foguete posicao={[-1.4 + voo * 2.8, 0.2 + voo * 3.4, 0.6]} rotacao={[0, 0, -0.55]} escala={0.45} />
      </Palco>
      <Rotulo texto="sem ar = céu preto" x={540} y={400} entrada={quando('preto')} cor="#ffffff" />
    </>
  );
};

const Marte: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando, duracao} = useCena();
  const tAzul = quando('azul');
  return (
    <>
      <Palco
        fundo={interpolateColors(frame, [0, 20, tAzul - 10, tAzul + 20], ['#000000', '#c88a55', '#c88a55', '#8a5a48'])}
        chao="#7a3518"
        disco={false}
        feixe={false}
        nevoa={[7, 26]}
        corDaContraluz="#ffb38a"
        ambiente={['poeira', 'montanhas']}
        corDasMontanhas="#8a3a1c"
        camera={{tipo: 'mover', de: {posicao: [0, 1.1, 7.6], alvo: [0, 1.6, 0]}, para: {posicao: [0, 1.25, 6.2], alvo: [0, 1.85, 0]}}}
      >
        <Animado posicao={[1.1, 2.3, -6]} entrada={tAzul - 4}>
          <Sol raio={0.6} cor="#e8f6ff" corBrilho="#4da6ff" raios={false} brilho={2.6} />
        </Animado>
        <Boneco posicao={[-0.45, 0, 0]} poses={[{quadro: 0, pose: 'parado'}, {quadro: tAzul, pose: 'surpreso'}]} visual={3} />
        <Rover posicao={[-1.8 + progresso(frame, 0, duracao, (x) => x) * 1.4, 0, -1.6]} rotacao={[0, 0.2, 0]} escala={0.9} andando />
        <Pedra posicao={[-1.3, 0, 0.6]} cor="#8a3b1c" semente="p1" />
        <Pedra posicao={[1.0, 0, 1.0]} cor="#7a3418" semente="p2" escala={0.7} />
        <Pedra posicao={[-0.6, 0, -1.8]} cor="#93441f" semente="p3" escala={1.4} />
        <Pedra posicao={[1.7, 0, -1.2]} cor="#82391b" semente="p4" escala={1.1} />
        <Pedra posicao={[0.7, 0, -3.2]} cor="#8a3b1c" semente="p5" escala={1.8} />
        <Animado entrada={tAzul} posicao={[1.0, 2.2, -4]}>
          <Particulas quantidade={40} area={[2, 1.2, 1]} tamanho={0.03} cores={['#7fc4ff', '#cfeaff']} brilhar agitacao={0.2} semente="azul-marte" />
        </Animado>
      </Palco>
      <Rotulo texto="Marte" x={540} y={380} entrada={quando('Marte')} cor="#ff7a45" corTexto="#ffffff" />
      <Som tipo="revelar" em={tAzul} />
    </>
  );
};

const Fechamento: React.FC = () => {
  const {quando} = useCena();
  return (
    <Palco
      fundo={AZUL_CEU}
      chao="#2c4a3a"
      disco={false}
      feixe={false}
      nevoa={[9, 30]}
      ambiente={AO_AR_LIVRE}
      camera={{tipo: 'mover', de: {posicao: [0, 1.5, 6.2], alvo: [0, 1.8, 0]}, para: {posicao: [0, 2.2, 9.0], alvo: [0, 2.0, 0]}}}
    >
      <Boneco poses={[{quadro: 0, pose: 'olhandoCima'}, {quadro: quando('lembra'), pose: 'acenando'}]} />
      <Animado entrada={quando('Sol')} posicao={[1.3, 4.4, -3.5]} pulsar={0.03}>
        <Sol raio={0.45} />
      </Animado>
      <Animado posicao={[0, 3.3, -1]} entrada={quando('ricocheteando')}>
        <Particulas quantidade={80} area={[4, 2.2, 2]} tamanho={0.04} cores={[AZUL_LUZ, '#ffffff', '#9fd8ff']} brilhar />
      </Animado>
      <Nuvem posicao={[-1.6, 4.4, -4]} escala={0.8} />
      <Nuvem posicao={[1.5, 5.0, -5]} />
      <Arvore posicao={[-1.9, 0, -2.2]} />
      <Arvore posicao={[2.0, 0, -2.8]} tipo="redonda" />
      <Casa posicao={[-0.9, 0, -4.5]} rotacao={[0, 0.4, 0]} />
      <Arvore posicao={[0.9, 0, -5.2]} escala={1.3} />
      <Revoada y={3.7} z={-2.5} />
    </Palco>
  );
};

export const cenas: Cenas = {
  gancho: Gancho,
  'luz-branca': LuzBranca,
  prisma: PrismaDeNewton,
  ondas: Ondas,
  atmosfera: Atmosfera,
  espalhamento: Espalhamento,
  rayleigh: Rayleigh,
  'ceu-azul': CeuAzul,
  violeta: Violeta,
  olhos: Olhos,
  'por-do-sol': PorDoSol,
  laranja: Laranja,
  espaco: Espaco,
  marte: Marte,
  fechamento: Fechamento,
};
