// Cenas de "um Esposito perdeu o pênalti. O outro decidiu contra a França".
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  Animado,
  BolaFutebol,
  Boneco,
  Gol,
  Numero,
  Palco,
  Pedestal,
  progresso,
  Rotulo,
  Som,
  suave,
  Titulo,
  useCena,
  useNaCapa,
  type Cenas,
  type PropsBoneco,
  type Vec3,
} from '../../src/kit';

const GRAMA = '#1a4a2e';
const AZUL = '#2f6fd6';
const MARINHO = '#1a2552';
const CALCAO_IT = '#eef2f8';
const GOLEIRO_FR = '#e2b93b';
const GOLEIRO_IT = '#2fa36b';
const TERNO = '#2a2d36';
const VERMELHO = '#ff5a5a';
const VERDE = '#3ecf6a';
const BOLA = 0.22;

type Camera = React.ComponentProps<typeof Palco>['camera'];

const Campo: React.FC<{children: React.ReactNode; camera?: Camera; hora?: number}> = ({children, camera, hora}) => (
  <Palco
    chao={GRAMA}
    disco={false}
    feixe={false}
    hora={hora}
    camera={camera ?? {tipo: 'mover', de: {posicao: [0, 1.8, 9.2], alvo: [0, 0.75, 0]}, para: {posicao: [0, 1.7, 8.4], alvo: [0, 0.75, 0]}}}
  >
    {children}
  </Palco>
);

// Sebastiano é o mais velho; Pio, o mais alto.
const Sebastiano: React.FC<PropsBoneco> = (props) => (
  <Boneco visual={1} cor={AZUL} calca={CALCAO_IT} cabelo="#2a1d14" escala={0.96} {...props} />
);
const Pio: React.FC<PropsBoneco> = (props) => (
  <Boneco visual={3} cor={AZUL} calca={CALCAO_IT} cabelo="#1c140e" escala={1.06} {...props} />
);
const Frances: React.FC<PropsBoneco> = (props) => <Boneco visual={2} cor={MARINHO} calca={MARINHO} {...props} />;
const Maignan: React.FC<PropsBoneco> = (props) => <Boneco visual={4} cor={GOLEIRO_FR} calca="#2b2b2b" {...props} />;

const MarcaPenal: React.FC<{z?: number}> = ({z = 0.4}) => (
  <mesh position={[0, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
    <circleGeometry args={[0.09, 20]} />
    <meshBasicMaterial color="#eef2ff" toneMapped={false} />
  </mesh>
);

// Linha da grande área atrás da marca do pênalti.
const LinhaDaArea: React.FC<{z: number; largura?: number}> = ({z, largura = 4.2}) => (
  <mesh position={[0, 0.011, z]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[largura, 0.05]} />
    <meshBasicMaterial color="#eef2ff" toneMapped={false} />
  </mesh>
);

// Torcida de San Siro: degraus com cabeças coloridas, em arco atrás do gol.
const CORES_TORCIDA = ['#2f6fd6', '#eef2f8', '#2f6fd6', '#1e3d8f', '#d9dde6', '#2f6fd6', '#16a34a', '#2f6fd6'];
const Arquibancada: React.FC<{z?: number; fileiras?: number; colunas?: number; largura?: number}> = ({
  z = -6,
  fileiras = 5,
  colunas = 26,
  largura = 9,
}) => (
  <group position={[0, 0, z]}>
    {Array.from({length: fileiras}).map((_, f) => (
      <group key={f} position={[0, 0.35 + f * 0.42, -f * 0.5]}>
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[largura, 0.4, 0.5]} />
          <meshStandardMaterial color="#2a3040" flatShading />
        </mesh>
        {Array.from({length: colunas}).map((__, c) => (
          <mesh key={c} position={[-largura / 2 + 0.2 + c * ((largura - 0.4) / (colunas - 1)), 0.12, 0]}>
            <boxGeometry args={[0.2, 0.26, 0.2]} />
            <meshStandardMaterial color={CORES_TORCIDA[(c * 3 + f * 5) % CORES_TORCIDA.length]} flatShading />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

// Taça low-poly (troféu da Copa) para as Copas perdidas. `apagada` = cinza.
const Taca: React.FC<{apagada?: number}> = ({apagada = 0}) => {
  const cor = apagada > 0.5 ? '#6b6f7a' : '#e8b93a';
  return (
    <group>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.16, 8]} />
        <meshStandardMaterial color="#1e7a46" flatShading />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.17, 0.6, 8]} />
        <meshStandardMaterial color={cor} flatShading metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.88, 0]} castShadow>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={cor} flatShading metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
};

// X e visto em 3D (erro × erro apagado).
const MarcaX: React.FC = () => (
  <group>
    <mesh rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.7, 0.13, 0.13]} />
      <meshStandardMaterial color={VERMELHO} emissive={VERMELHO} emissiveIntensity={0.5} flatShading />
    </mesh>
    <mesh rotation={[0, 0, -Math.PI / 4]}>
      <boxGeometry args={[0.7, 0.13, 0.13]} />
      <meshStandardMaterial color={VERMELHO} emissive={VERMELHO} emissiveIntensity={0.5} flatShading />
    </mesh>
  </group>
);
const MarcaVisto: React.FC = () => (
  <group rotation={[0, 0, -0.15]}>
    <mesh position={[-0.17, -0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.34, 0.13, 0.13]} />
      <meshStandardMaterial color={VERDE} emissive={VERDE} emissiveIntensity={0.5} flatShading />
    </mesh>
    <mesh position={[0.12, 0.1, 0]} rotation={[0, 0, -Math.PI / 3.2]}>
      <boxGeometry args={[0.62, 0.13, 0.13]} />
      <meshStandardMaterial color={VERDE} emissive={VERDE} emissiveIntensity={0.5} flatShading />
    </mesh>
  </group>
);

// Placa de substituição do quarto árbitro.
const PlacaSubstituicao: React.FC = () => (
  <group>
    <mesh position={[0, -0.55, 0]}>
      <boxGeometry args={[0.06, 0.6, 0.06]} />
      <meshStandardMaterial color="#222" flatShading />
    </mesh>
    <mesh position={[0, 0, 0]} castShadow>
      <boxGeometry args={[0.7, 0.5, 0.06]} />
      <meshStandardMaterial color="#111318" flatShading />
    </mesh>
    <mesh position={[0, 0.11, 0.035]}>
      <planeGeometry args={[0.6, 0.18]} />
      <meshBasicMaterial color={VERDE} toneMapped={false} />
    </mesh>
    <mesh position={[0, -0.11, 0.035]}>
      <planeGeometry args={[0.6, 0.18]} />
      <meshBasicMaterial color={VERMELHO} toneMapped={false} />
    </mesh>
  </group>
);

const lerp = (a: Vec3, b: Vec3, p: number): Vec3 => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];

// Bola em arco de `de` até `para`, com altura extra no meio.
const arco = (de: Vec3, para: Vec3, p: number, altura = 0): Vec3 => {
  const b = lerp(de, para, p);
  return [b[0], b[1] + Math.sin(p * Math.PI) * altura, b[2]];
};

const Placar: React.FC<{it: number; fr: number; entrada?: number; saida?: number; y?: number}> = ({it, fr, entrada = 0, saida, y = 300}) => (
  <Rotulo texto={`ITA ${it} × ${fr} FRA`} x={540} y={y} entrada={entrada} saida={saida} cor="#f4f6fb" corTexto="#11182d" tamanho={52} />
);

const CAMERA_PENAL: Camera = {
  tipo: 'mover',
  de: {posicao: [0.9, 2.6, 10.2], alvo: [-0.1, 0.55, -1.6]},
  para: {posicao: [0.8, 2.5, 9.4], alvo: [-0.1, 0.55, -1.6]},
};

// 1. Um irmão perdeu. O outro decidiu.
const Gancho: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 1.9, 9.6], alvo: [0, 0.7, -0.5]}, para: {posicao: [0, 1.8, 8.6], alvo: [0, 0.7, -0.5]}}}>
        <Gol posicao={[0, 0, -2.8]} escala={0.9} />
        <Arquibancada z={-5} />
        <MarcaPenal z={0.5} />
        <BolaFutebol posicao={[0, BOLA, 0.5]} escala={0.8} />
        <Sebastiano posicao={[-0.75, 0, 0.7]} giro={15} poses={[{quadro: 0, pose: 'parado'}, {quadro: quando('perdeu'), pose: 'deOmbros'}]} />
        <Pio posicao={[0.75, 0, 0.7]} giro={-15} poses={[{quadro: 0, pose: 'parado'}, {quadro: quando('decidiu'), pose: 'comemorando'}]} />
        <Animado entrada={quando('França')} posicao={[0, 0, -2.5]}>
          <Maignan pose="parado" escala={0.85} />
        </Animado>
      </Campo>
      <Rotulo texto="perdeu" x={250} y={560} entrada={quando('perdeu')} cor={VERMELHO} />
      <Rotulo texto="decidiu" x={830} y={560} entrada={quando('decidiu')} />
      <Titulo texto="contra a França" destaque="França" entrada={quando('França')} y={380} tamanho={84} />
      <Som tipo="revelar" em={quando('decidiu')} />
    </>
  );
};

// 2. Os irmãos Esposito.
const Irmaos: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 1.7, 8.8], alvo: [0, 0.75, 0]}, para: {posicao: [0, 1.6, 8.0], alvo: [0, 0.75, 0]}}}>
        <Arquibancada z={-4.5} />
        <Sebastiano posicao={[-0.6, 0, 0.3]} giro={10} poses={[{quadro: 0, pose: 'parado'}, {quadro: quando('Sebastiano'), pose: 'acenando'}]} />
        <Pio posicao={[0.6, 0, 0.3]} giro={-10} poses={[{quadro: 0, pose: 'parado'}, {quadro: quando('Pio'), pose: 'acenando'}]} />
      </Campo>
      <Titulo texto="os Esposito" destaque="Esposito" entrada={quando('Esposito')} y={360} />
      <Rotulo texto="Sebastiano" x={300} y={1060} entrada={quando('Sebastiano')} tamanho={40} />
      <Rotulo texto="Sassuolo" x={300} y={1135} entrada={quando('Sassuolo')} cor="#2d9c5a" corTexto="#ffffff" tamanho={34} />
      <Rotulo texto="Pio · 21" x={790} y={1060} entrada={quando('Pio')} tamanho={40} />
      <Rotulo texto="Inter" x={790} y={1135} entrada={quando('Inter')} cor="#1f4fd0" corTexto="#ffffff" tamanho={34} />
      <Som tipo="surgir" em={quando('Esposito')} />
    </>
  );
};

// 3. San Siro, Itália x França, 70 mil pessoas.
const SanSiro: React.FC = () => {
  const {quando} = useCena();
  const italia = [-0.9, -0.55, -0.2];
  const franca = [0.2, 0.55, 0.9];
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 4.2, 9.5], alvo: [0, 0.8, -2]}, para: {posicao: [0, 3.4, 8.2], alvo: [0, 0.9, -2]}}}>
        <Arquibancada z={-4.5} fileiras={6} colunas={30} largura={10} />
        <Gol posicao={[0, 0, -3.2]} escala={0.9} />
        <LinhaDaArea z={-1.2} />
        {italia.map((x, i) => (
          <Animado key={`i${i}`} entrada={quando('Itália') + i * 3} posicao={[x, 0, 0.6]}>
            <Boneco visual={i} cor={AZUL} calca={CALCAO_IT} escala={0.8} pose="acenando" />
          </Animado>
        ))}
        {franca.map((x, i) => (
          <Animado key={`f${i}`} entrada={quando('França') + i * 3} posicao={[x, 0, 0.6]}>
            <Frances visual={(i + 2) % 5} escala={0.8} pose="parado" />
          </Animado>
        ))}
      </Campo>
      <Rotulo texto="12 nov · San Siro" x={540} y={300} entrada={0} saida={quando('Liga')} />
      <Rotulo texto="Liga das Nações" x={540} y={300} entrada={quando('Liga')} />
      <Numero ate={70} sufixo=" mil" entrada={quando('setenta')} y={470} tamanho={140} />
      <Som tipo="surgir" em={quando('setenta')} />
    </>
  );
};

// 4. Erro do Donnarumma, gol do Olise.
const Olise: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tErra = quando('erra');
  const tOlise = quando('Olise');
  const pPasse = progresso(frame, tErra, tErra + 12);
  const pChute = progresso(frame, tOlise + 4, tOlise + 16);
  const bola: Vec3 =
    pChute > 0
      ? arco([0.35, BOLA, -0.6], [-0.75, 0.45, -2.95], pChute, 0.3)
      : arco([-0.1, BOLA, -1.75], [0.35, BOLA, -0.6], pPasse, 0.15);
  return (
    <>
      <Campo camera={CAMERA_PENAL}>
        <Gol posicao={[0, 0, -3.1]} />
        <Arquibancada z={-6} />
        <LinhaDaArea z={-1.0} />
        <Boneco
          posicao={[-0.1, 0, -2.2]}
          visual={0}
          cor={GOLEIRO_IT}
          calca="#1d2a22"
          poses={[{quadro: 0, pose: 'parado'}, {quadro: tErra + 6, pose: 'surpreso'}]}
        />
        <Frances
          posicao={[0.55, 0, -0.3]}
          giro={200}
          poses={[{quadro: 0, pose: 'correndo'}, {quadro: tOlise + 18, pose: 'comemorando'}]}
        />
        <BolaFutebol posicao={bola} escala={0.8} girando={pPasse > 0 ? 3 : 0} />
      </Campo>
      <Rotulo texto="erro na saída" x={540} y={430} entrada={tErra} cor={VERMELHO} />
      <Placar it={0} fr={1} entrada={quando('placar')} />
      <Som tipo="revelar" em={quando('placar')} />
    </>
  );
};

// 5. Pio empata.
const Empate: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tPio = quando('Pio');
  const tEmpata = quando('empata');
  const pCruza = progresso(frame, 0, tPio + 6);
  const pGol = progresso(frame, tEmpata - 4, tEmpata + 8);
  const bola: Vec3 = pGol > 0 ? lerp([0.05, BOLA, -1.0], [0.6, 0.35, -3.0], pGol) : lerp([1.5, BOLA, -0.9], [0.05, BOLA, -1.0], pCruza);
  return (
    <>
      <Campo camera={CAMERA_PENAL}>
        <Gol posicao={[0, 0, -3.1]} />
        <Arquibancada z={-6} />
        <LinhaDaArea z={-1.0} />
        <Maignan posicao={[-0.3, 0, -2.6]} poses={[{quadro: 0, pose: 'parado'}, {quadro: tEmpata, pose: 'surpreso'}]} />
        <Frances posicao={[0.5, 0, -0.75]} giro={150} poses={[{quadro: 0, pose: 'correndo'}, {quadro: tEmpata, pose: 'deOmbros'}]} />
        <Pio posicao={[-0.15, 0, -0.55]} giro={190} poses={[{quadro: 0, pose: 'correndo'}, {quadro: tEmpata + 10, pose: 'comemorando'}]} />
        <BolaFutebol posicao={bola} escala={0.8} girando={3} />
      </Campo>
      <Rotulo texto="Pio" x={420} y={460} entrada={tPio} tamanho={40} />
      <Placar it={1} fr={1} entrada={tEmpata} />
      <Som tipo="revelar" em={tEmpata} />
    </>
  );
};

// 6. Pênalti para a Itália.
const Penalti: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tPenalti = quando('pênalti');
  const queda = suave(frame, [6, 20], [0, 1]);
  const pBola = progresso(frame, tPenalti, tPenalti + 14);
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0.5, 2.1, 8.6], alvo: [0, 0.5, -0.5]}, para: {posicao: [0.3, 1.9, 7.8], alvo: [0, 0.5, -0.5]}}}>
        <Gol posicao={[0, 0, -3.0]} />
        <Arquibancada z={-6} />
        <LinhaDaArea z={1.4} />
        <MarcaPenal z={0.2} />
        <group position={[0.6, 0, 0.9]} rotation={[-queda * 1.4, 0, 0]}>
          <Boneco visual={2} cor={AZUL} calca={CALCAO_IT} pose="surpreso" />
        </group>
        <Frances posicao={[-0.65, 0, 0.5]} giro={30} poses={[{quadro: 0, pose: 'correndo'}, {quadro: 18, pose: 'deOmbros'}]} />
        <BolaFutebol posicao={arco([-1.0, BOLA, 1.2], [0, BOLA, 0.2], pBola, 0.5)} escala={0.8} />
      </Campo>
      <Titulo texto="Pênalti!" destaque="Pênalti!" entrada={tPenalti} y={380} tamanho={110} />
      <Placar it={1} fr={1} entrada={quando('empatado')} y={520} />
      <Som tipo="pergunta" em={tPenalti} />
    </>
  );
};

// 7. O batedor era o Pio, mas ele entrega a bola ao irmão.
const Troca: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tEntrega = quando('entrega');
  const p = progresso(frame, tEntrega, tEntrega + 16);
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 1.8, 9.0], alvo: [0, 0.75, -0.4]}, para: {posicao: [0, 1.7, 8.2], alvo: [0, 0.75, -0.4]}}}>
        <Gol posicao={[0, 0, -3.2]} escala={0.9} />
        <Arquibancada z={-6} />
        <MarcaPenal z={0.4} />
        <Sebastiano posicao={[-0.55, 0, 0.3]} giro={30} poses={[{quadro: 0, pose: 'parado'}, {quadro: tEntrega + 12, pose: 'explicando'}]} />
        <Pio posicao={[0.55, 0, 0.3]} giro={-30} poses={[{quadro: 0, pose: 'parado'}, {quadro: tEntrega, pose: 'explicando'}]} />
        <BolaFutebol posicao={arco([0.4, 1.05, 0.55], [-0.4, 1.0, 0.55], p, 0.15)} escala={0.75} />
        <Animado entrada={quando('Mancini')} posicao={[1.05, 0, -1.4]}>
          <Boneco
            cor={TERNO}
            calca={TERNO}
            cabelo="#b8b8b8"
            escala={0.9}
            giro={-20}
            poses={[{quadro: 0, pose: 'pensando'}, {quadro: quando('nada'), pose: 'surpreso'}]}
          />
        </Animado>
      </Campo>
      <Rotulo texto="batedor: Pio" x={540} y={330} entrada={quando('batedor')} />
      <Rotulo texto="Mancini" x={880} y={520} entrada={quando('Mancini')} cor="#f4f6fb" corTexto="#11182d" tamanho={36} />
      <Som tipo="pergunta" em={tEntrega} />
    </>
  );
};

// 8. Sebastiano bate forte e manda para fora.
const Erro: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tBate = quando('bate');
  const tManda = quando('manda');
  const corrida = suave(frame, [tBate, tManda], [1.5, 0.75]);
  const pChute = progresso(frame, tManda, tManda + 14);
  // Para fora da trave, bem à direita, sem cruzar poste nem rede (evita flicker).
  const bola: Vec3 = arco([0, BOLA, 0.4], [2.1, 1.15, -0.8], pChute, 0.6);
  return (
    <>
      <Campo camera={CAMERA_PENAL}>
        <Gol posicao={[0, 0, -3.1]} />
        <Arquibancada z={-6} />
        <LinhaDaArea z={-1.0} />
        <MarcaPenal z={0.4} />
        <Maignan posicao={[0, 0, -2.8]} pose="parado" />
        <Sebastiano posicao={[-0.6, 0, corrida]} giro={165} poses={[{quadro: 0, pose: 'parado'}, {quadro: tBate, pose: 'andando'}]} />
        <BolaFutebol posicao={bola} escala={0.8} />
      </Campo>
      <Rotulo texto="parte de fora do pé" x={540} y={330} entrada={quando('parte')} tamanho={40} />
      <Rotulo texto="pra fora" x={540} y={460} entrada={quando('fora', 2)} cor={VERMELHO} tamanho={58} />
      <Som tipo="mergulho" em={quando('fora', 2)} />
    </>
  );
};

// 9. Sebastiano substituído.
const Substituido: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const x = suave(frame, [0, 90], [-0.6, 0.15]);
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 1.7, 8.8], alvo: [0, 0.75, 0]}, para: {posicao: [0, 1.6, 8.1], alvo: [0.1, 0.75, 0]}}}>
        <Arquibancada z={-4.5} />
        <Sebastiano posicao={[x, 0, 0.2]} giro={60} pose="andando" />
        <Animado entrada={quando('substituído')} posicao={[0.8, 0, -0.4]}>
          <Boneco cor="#16181d" calca="#16181d" visual={0} escala={0.9} giro={-20} pose="olhandoCima" />
          <group position={[0.05, 2.15, 0.2]}>
            <PlacaSubstituicao />
          </group>
        </Animado>
      </Campo>
      <Rotulo texto="substituído" x={540} y={360} entrada={quando('substituído')} cor={VERMELHO} />
      <Rotulo texto="o peso do erro" x={540} y={460} entrada={quando('peso')} cor="#f4f6fb" corTexto="#11182d" tamanho={40} />
      <Som tipo="texto" em={quando('substituído')} />
    </>
  );
};

// 10. Frattesi vira: 2 a 1.
const Frattesi: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tFrattesi = quando('Frattesi');
  const tVira = quando('vira');
  const pCruza = progresso(frame, tFrattesi - 14, tFrattesi + 4);
  const pGol = progresso(frame, tVira, tVira + 10);
  const bola: Vec3 = pGol > 0 ? lerp([-0.05, BOLA, -0.9], [-0.7, 0.4, -3.0], pGol) : arco([-1.6, BOLA, -0.6], [-0.05, BOLA, -0.9], pCruza, 0.4);
  return (
    <>
      <Campo camera={CAMERA_PENAL}>
        <Gol posicao={[0, 0, -3.1]} />
        <Arquibancada z={-6} />
        <LinhaDaArea z={-1.0} />
        <Maignan posicao={[0.25, 0, -2.6]} poses={[{quadro: 0, pose: 'parado'}, {quadro: tVira + 4, pose: 'surpreso'}]} />
        <Frances posicao={[-0.6, 0, -1.4]} giro={160} pose="correndo" escala={0.95} />
        <Boneco
          posicao={[-0.3, 0, -0.35]}
          giro={185}
          visual={4}
          cor={AZUL}
          calca={CALCAO_IT}
          poses={[{quadro: 0, pose: 'correndo'}, {quadro: tVira + 10, pose: 'comemorando'}]}
        />
        <BolaFutebol posicao={bola} escala={0.8} girando={3} />
      </Campo>
      <Rotulo texto="não desmonta" x={540} y={430} entrada={quando('desmonta')} saida={tFrattesi} tamanho={40} />
      <Rotulo texto="Frattesi" x={540} y={430} entrada={tFrattesi} tamanho={40} />
      <Placar it={2} fr={1} entrada={quando('Dois')} />
      <Som tipo="revelar" em={quando('Dois')} />
    </>
  );
};

// 11. Outro pênalti: agora é o Pio.
const OutroPenalti: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tPio = quando('Pio');
  const desce = suave(frame, [tPio, tPio + 14], [1.0, BOLA]);
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0.9, 2.1, 8.6], alvo: [0, 0.55, -1]}, para: {posicao: [0.6, 2.0, 7.8], alvo: [0, 0.55, -1]}}}>
        <Gol posicao={[0, 0, -3.1]} />
        <Arquibancada z={-6} />
        <MarcaPenal z={0.4} />
        <Maignan posicao={[0, 0, -2.8]} pose="parado" />
        <Pio posicao={[0.1, 0, 0.95]} giro={200} poses={[{quadro: 0, pose: 'parado'}, {quadro: tPio + 14, pose: 'pensando'}]} />
        <BolaFutebol posicao={[0, desce, 0.4]} escala={0.8} />
        <Animado entrada={quando('Dessa')} posicao={[-1.05, 0, 0.9]}>
          <Sebastiano giro={40} pose="pensando" escala={0.85} />
        </Animado>
      </Campo>
      <Rotulo texto="75'" x={540} y={300} entrada={quando('setenta')} cor="#f4f6fb" corTexto="#11182d" tamanho={52} />
      <Titulo texto="agora é o Pio" destaque="Pio" entrada={tPio} y={430} tamanho={84} />
      <Som tipo="pergunta" em={tPio} />
    </>
  );
};

// 12. Lembrança: o pênalti perdido contra a Bósnia, em março.
const Bosnia: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tErrou = quando('errou');
  const pChute = progresso(frame, tErrou, tErrou + 16);
  return (
    <>
      <Campo camera={{tipo: 'fixa', posicao: [0.8, 2.4, 9.0], alvo: [-0.1, 0.7, -1.2]}}>
        <Gol posicao={[0, 0, -3.1]} />
        <Boneco posicao={[0.1, 0, -2.8]} visual={0} cor="#8a8f99" calca="#3a3f4a" pose="parado" />
        <Pio posicao={[-0.55, 0, 0.85]} giro={165} pose="parado" />
        <mesh position={arco([0, BOLA, 0.4], [0.05, 3.2, -0.6], pChute, 0.05)} castShadow>
          <icosahedronGeometry args={[0.22, 1]} />
          <meshStandardMaterial color="#f4f6fb" flatShading roughness={0.55} />
        </mesh>
      </Campo>
      <Rotulo texto="março · Bósnia" x={540} y={300} entrada={quando('março')} cor="#f4f6fb" corTexto="#11182d" />
      <Rotulo texto="por cima do gol" x={540} y={430} entrada={tErrou + 12} cor={VERMELHO} tamanho={44} />
      <Som tipo="mergulho" em={tErrou + 12} />
    </>
  );
};

// 13. Fora da Copa pela terceira vez seguida.
const Copa: React.FC = () => {
  const {quando} = useCena();
  const anos = [
    {ano: '2018', x: -0.85, em: 0},
    {ano: '2022', x: 0, em: quando('Copa')},
    {ano: '2026', x: 0.85, em: quando('terceira')},
  ];
  const px = (x: number) => 540 + (x / 1.3) * 470;
  return (
    <>
      <Palco camera={{tipo: 'mover', de: {posicao: [0, 1.6, 7.6], alvo: [0, 0.75, 0]}, para: {posicao: [0, 1.5, 6.9], alvo: [0, 0.75, 0]}}}>
        {anos.map((a) => (
          <Animado key={a.ano} entrada={a.em} posicao={[a.x, 0, 0]}>
            <Pedestal raio={0.32} altura={0.5} cor={VERMELHO}>
              <Taca apagada={1} />
            </Pedestal>
          </Animado>
        ))}
      </Palco>
      {anos.map((a) => (
        <Rotulo key={a.ano} texto={a.ano} x={px(a.x)} y={1080} entrada={a.em} cor="#f4f6fb" corTexto="#11182d" tamanho={40} />
      ))}
      <Titulo texto="fora de 3 Copas seguidas" destaque="3" entrada={quando('terceira')} y={400} tamanho={80} />
      <Som tipo="revelar" em={quando('terceira')} />
    </>
  );
};

// 14. Pio bate no canto: 3 a 1.
const GolDecisivo: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tBate = quando('bate');
  const tGoleiro = quando('goleiro');
  const pChute = progresso(frame, tBate + 4, tBate + 14);
  const pulo = suave(frame, [tGoleiro, tGoleiro + 12], [0, 1]);
  return (
    <>
      <Campo camera={CAMERA_PENAL}>
        <Gol posicao={[0, 0, -3.1]} />
        <Arquibancada z={-6} />
        <MarcaPenal z={0.4} />
        <LinhaDaArea z={-1.0} />
        <group position={[-pulo * 0.4, pulo * 0.2, -2.8]} rotation={[0, 0, pulo * 0.9]}>
          <Maignan pose="surpreso" />
        </group>
        <Pio posicao={[-0.6, 0, 0.85]} giro={160} poses={[{quadro: 0, pose: 'correndo'}, {quadro: quando('Três'), pose: 'comemorando'}]} />
        <BolaFutebol posicao={arco([0, BOLA, 0.4], [0.85, 0.3, -3.0], pChute, 0.1)} escala={0.8} girando={pChute > 0 ? 0.8 : 0} />
      </Campo>
      <Rotulo texto="no canto" x={540} y={430} entrada={tBate + 10} tamanho={44} />
      <Placar it={3} fr={1} entrada={quando('Três')} />
      <Som tipo="revelar" em={quando('Três')} />
    </>
  );
};

// 15. O abraço e o muque juntos.
const Abraco: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const naCapa = useNaCapa();
  const tAbracar = quando('abraçar');
  const tMuque = quando('muque');
  const xPio = suave(frame, [0, tAbracar + 10], [1.05, 0.5]);
  const giroSeba = suave(frame, [tMuque, tMuque + 12], [40, 15]);
  const giroPio = suave(frame, [0, tAbracar + 10], [-50, -20]);
  const giroPioFinal = suave(frame, [tMuque, tMuque + 12], [giroPio, -15]);
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 1.7, 9.0], alvo: [0, 0.75, 0]}, para: {posicao: [0, 1.6, 8.0], alvo: [0, 0.8, 0]}}}>
        <Arquibancada z={-4.5} />
        <Sebastiano
          posicao={[-0.5, 0, 0.3]}
          giro={giroSeba}
          poses={[{quadro: 0, pose: 'parado'}, {quadro: tAbracar, pose: 'acenando'}, {quadro: tMuque, pose: 'comemorando'}]}
        />
        <Pio
          posicao={[xPio, 0, 0.3]}
          giro={giroPioFinal}
          poses={[{quadro: 0, pose: 'andando'}, {quadro: tAbracar + 10, pose: 'acenando'}, {quadro: tMuque, pose: 'comemorando'}]}
        />
      </Campo>
      {naCapa ? null : (
        <>
          <Rotulo texto="abraço no irmão" x={540} y={360} entrada={tAbracar} />
          <Rotulo texto="o muque juntos" x={540} y={460} entrada={tMuque} cor="#f4f6fb" corTexto="#11182d" tamanho={40} />
        </>
      )}
      <Som tipo="brilho" em={tAbracar} />
    </>
  );
};

// 16. Bateu para apagar o erro do irmão.
const Apagar: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tApagar = quando('apagar');
  const some = 1 - suave(frame, [tApagar, tApagar + 10], [0, 1]);
  return (
    <>
      <Campo camera={{tipo: 'fixa', posicao: [0, 1.6, 8.2], alvo: [0, 0.95, 0]}}>
        <Arquibancada z={-4.5} />
        <Sebastiano posicao={[-0.6, 0, 0.3]} giro={15} pose="parado" />
        <Pio posicao={[0.6, 0, 0.3]} giro={-15} pose="explicando" falando />
        {some > 0.01 ? (
          <group position={[-0.6, 2.55, 0.3]} scale={some * 0.8}>
            <MarcaX />
          </group>
        ) : null}
        <Animado entrada={quando('Sebastiano')} posicao={[-0.6, 2.55, 0.3]} escala={0.8}>
          <MarcaVisto />
        </Animado>
      </Campo>
      <Titulo texto="apagar o erro" destaque="apagar" entrada={tApagar} y={360} tamanho={84} />
      <Som tipo="ideia" em={quando('Sebastiano')} />
    </>
  );
};

// 17. 64 anos e a primeira derrota do Zidane.
const Historia: React.FC = () => {
  const {quando} = useCena();
  const tZidane = quando('Zidane');
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 1.8, 9.0], alvo: [0, 0.7, -0.5]}, para: {posicao: [0, 1.7, 8.2], alvo: [0, 0.7, -0.5]}}}>
        <Arquibancada z={-4.5} />
        <Sebastiano posicao={[-0.7, 0, -0.6]} pose="comemorando" escala={0.85} />
        <Pio posicao={[-0.05, 0, -0.8]} pose="comemorando" escala={0.95} />
        <Animado entrada={tZidane} posicao={[0.75, 0, 0.6]}>
          <Boneco cor={MARINHO} calca={MARINHO} cabelo={null} giro={-20} pose="pensando" escala={0.95} />
        </Animado>
      </Campo>
      <Placar it={3} fr={1} entrada={0} />
      <Numero ate={64} sufixo=" anos" entrada={quando('sessenta')} saida={tZidane} y={480} tamanho={130} />
      <Rotulo texto="1ª derrota do Zidane" x={540} y={460} entrada={tZidane} cor="#f4f6fb" corTexto="#11182d" tamanho={44} />
      <Som tipo="revelar" em={quando('sessenta')} />
    </>
  );
};

// 18. Mancini: da próxima vez, não se confundem mais.
const Mancini: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 1.8, 9.0], alvo: [0, 0.75, -0.4]}, para: {posicao: [0, 1.7, 8.2], alvo: [0, 0.75, -0.4]}}}>
        <Arquibancada z={-5} />
        <Animado entrada={quando('irmãos')} posicao={[-0.85, 0, -1.0]}>
          <Sebastiano pose="deOmbros" escala={0.85} />
        </Animado>
        <Animado entrada={quando('irmãos') + 4} posicao={[0.85, 0, -1.0]}>
          <Pio pose="deOmbros" escala={0.9} />
        </Animado>
        <BolaFutebol posicao={[0, BOLA, -0.9]} escala={0.8} />
        <Boneco posicao={[0, 0, 0.6]} cor={TERNO} calca={TERNO} cabelo="#b8b8b8" pose="explicando" falando />
      </Campo>
      <Titulo texto="não se confundem mais" destaque="mais" entrada={quando('confundem')} y={380} tamanho={80} />
      <Som tipo="ideia" em={quando('confundem')} />
    </>
  );
};

// 19. Chamada: manda pro seu irmão.
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tPassa = quando('passa');
  const p = progresso(frame, tPassa, tPassa + 16);
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 1.6, 8.0], alvo: [0, 0.75, 0]}, para: {posicao: [0, 1.7, 8.8], alvo: [0, 0.8, 0]}}}>
        <Arquibancada z={-4.5} />
        <Sebastiano posicao={[-0.6, 0, 0.3]} giro={30} poses={[{quadro: 0, pose: 'parado'}, {quadro: tPassa + 14, pose: 'comemorando'}]} />
        <Pio posicao={[0.6, 0, 0.3]} giro={-30} poses={[{quadro: 0, pose: 'parado'}, {quadro: tPassa, pose: 'apontando'}]} />
        <BolaFutebol posicao={[0.3 - p * 0.6, BOLA, 0.55]} escala={0.8} girando={p > 0 && p < 1 ? 4 : 0} />
      </Campo>
      <Titulo texto="manda pro seu irmão" destaque="irmão" entrada={quando('irmão')} y={380} tamanho={84} />
      <Som tipo="pergunta" em={quando('irmão')} />
    </>
  );
};

export const cenas: Cenas = {
  gancho: Gancho,
  irmaos: Irmaos,
  'san-siro': SanSiro,
  olise: Olise,
  empate: Empate,
  penalti: Penalti,
  troca: Troca,
  erro: Erro,
  substituido: Substituido,
  frattesi: Frattesi,
  'outro-penalti': OutroPenalti,
  bosnia: Bosnia,
  copa: Copa,
  gol: GolDecisivo,
  abraco: Abraco,
  apagar: Apagar,
  historia: Historia,
  mancini: Mancini,
  cta: Cta,
};
