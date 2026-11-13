// Cenas de "Raphinha passou do ponto ao falar dos minutos na Seleção".
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  Animado,
  BolaFutebol,
  Boneco,
  Interrogacao,
  Microfone,
  Numero,
  Palco,
  Pedestal,
  progresso,
  Relogio,
  Rotulo,
  Seta,
  Som,
  Titulo,
  useCena,
  useNaCapa,
  type Cenas,
  type PropsBoneco,
} from '../../src/kit';

const GRAMA = '#1a4a2e';
const AMARELO = '#f0d24b';
const VERDE = '#1b6b3c';
const BARCA = '#a50044';
const BARCA_AZUL = '#004d98';
const TERNO = '#2a2d36';
const VERMELHO = '#ff5a5a';
const BRANCO = '#f4f6fb';
const ESTUDIO = '#1a1f2e';

type Camera = React.ComponentProps<typeof Palco>['camera'];

const Sala: React.FC<{children: React.ReactNode; camera?: Camera; chao?: string}> = ({
  children,
  camera,
  chao = ESTUDIO,
}) => (
  <Palco
    chao={chao}
    disco={false}
    feixe={false}
    camera={camera ?? {tipo: 'mover', de: {posicao: [0, 1.8, 8.8], alvo: [0, 0.9, 0]}, para: {posicao: [0, 1.7, 8.0], alvo: [0, 0.9, 0]}}}
  >
    {children}
  </Palco>
);

const Campo: React.FC<{children: React.ReactNode; camera?: Camera}> = ({children, camera}) => (
  <Sala chao={GRAMA} camera={camera}>
    {children}
  </Sala>
);

const Raphinha: React.FC<PropsBoneco & {barca?: boolean}> = ({barca, ...props}) => (
  <Boneco
    visual={2}
    cor={barca ? BARCA : AMARELO}
    calca={barca ? BARCA_AZUL : VERDE}
    cabelo="#1c140e"
    escala={1}
    {...props}
  />
);

const Tecnico: React.FC<PropsBoneco> = (props) => (
  <Boneco visual={4} cor={TERNO} calca="#1a1a1a" cabelo="#b8b8b8" escala={0.98} {...props} />
);

const Comentarista: React.FC<PropsBoneco> = (props) => (
  <Boneco visual={1} cor="#2b4c7e" calca="#1a2552" cabelo="#2a1d14" escala={0.96} {...props} />
);

const MesaColetiva: React.FC = () => (
  <group>
    <mesh position={[0, 0.45, 0.15]} castShadow receiveShadow>
      <boxGeometry args={[2.4, 0.12, 0.7]} />
      <meshStandardMaterial color="#2a3344" flatShading />
    </mesh>
    <mesh position={[-0.9, 0.22, 0.15]} castShadow>
      <boxGeometry args={[0.1, 0.44, 0.1]} />
      <meshStandardMaterial color="#1a2030" flatShading />
    </mesh>
    <mesh position={[0.9, 0.22, 0.15]} castShadow>
      <boxGeometry args={[0.1, 0.44, 0.1]} />
      <meshStandardMaterial color="#1a2030" flatShading />
    </mesh>
  </group>
);

const Medidor: React.FC<{valor: number; cor?: string}> = ({valor, cor = VERMELHO}) => {
  const h = Math.max(0.08, valor * 1.4);
  return (
    <group>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.36, 1.55, 0.18]} />
        <meshStandardMaterial color="#2a3140" flatShading />
      </mesh>
      <mesh position={[0, h / 2 + 0.05, 0.02]} castShadow>
        <boxGeometry args={[0.26, h, 0.12]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.35} flatShading />
      </mesh>
    </group>
  );
};

const MarcaX: React.FC = () => (
  <group>
    <mesh rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.55, 0.1, 0.1]} />
      <meshStandardMaterial color={VERMELHO} emissive={VERMELHO} emissiveIntensity={0.45} flatShading />
    </mesh>
    <mesh rotation={[0, 0, -Math.PI / 4]}>
      <boxGeometry args={[0.55, 0.1, 0.1]} />
      <meshStandardMaterial color={VERMELHO} emissive={VERMELHO} emissiveIntensity={0.45} flatShading />
    </mesh>
  </group>
);

const MarcaVisto: React.FC = () => (
  <group rotation={[0, 0, -0.15]}>
    <mesh position={[-0.12, -0.04, 0]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.28, 0.1, 0.1]} />
      <meshStandardMaterial color="#3ecf6a" emissive="#3ecf6a" emissiveIntensity={0.4} flatShading />
    </mesh>
    <mesh position={[0.1, 0.08, 0]} rotation={[0, 0, -Math.PI / 3.2]}>
      <boxGeometry args={[0.5, 0.1, 0.1]} />
      <meshStandardMaterial color="#3ecf6a" emissive="#3ecf6a" emissiveIntensity={0.4} flatShading />
    </mesh>
  </group>
);

const FundoBandeira: React.FC = () => (
  <group position={[0, 1.6, -2.2]}>
    <mesh>
      <boxGeometry args={[3.2, 2.2, 0.08]} />
      <meshStandardMaterial color="#149c3a" flatShading />
    </mesh>
    <mesh position={[0, 0, 0.05]}>
      <boxGeometry args={[2.2, 1.3, 0.04]} />
      <meshStandardMaterial color="#f0d24b" flatShading />
    </mesh>
    <mesh position={[0, 0, 0.08]}>
      <sphereGeometry args={[0.28, 16, 12]} />
      <meshStandardMaterial color="#1a3d8f" flatShading />
    </mesh>
  </group>
);

// 1. Gancho
const Gancho: React.FC = () => {
  const {quando} = useCena();
  const naCapa = useNaCapa();
  return (
    <>
      <Sala camera={{tipo: 'mover', de: {posicao: [0, 1.9, 9.2], alvo: [0, 1.0, 0]}, para: {posicao: [0, 1.75, 8.2], alvo: [0, 1.0, 0]}}}>
        <Microfone posicao={[0.55, 0, 0.4]} escala={0.85} />
        <Raphinha posicao={[-0.35, 0, 0.2]} giro={20} poses={[{quadro: 0, pose: 'explicando'}, {quadro: quando('passou'), pose: 'surpreso'}]} falando />
        <Animado entrada={quando('Ancelotti')} posicao={[1.0, 0, -0.6]}>
          <Tecnico pose="pensando" giro={-25} />
        </Animado>
        <Animado entrada={quando('realmente')} posicao={[-0.9, 2.1, -0.3]} girar={0.5}>
          <Interrogacao escala={0.85} />
        </Animado>
      </Sala>
      {!naCapa && (
        <Titulo texto="passou do ponto?" destaque="passou do ponto" entrada={quando('passou')} y={360} tamanho={88} />
      )}
      <Som tipo="pergunta" em={quando('realmente')} />
    </>
  );
};

// 2. Renovação em Barcelona
const Renovacao: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <Pedestal posicao={[0, 0, -0.2]} />
        <Raphinha barca posicao={[0, 0.55, -0.2]} poses={[{quadro: 0, pose: 'acenando'}, {quadro: quando('minutos'), pose: 'explicando'}]} falando />
        <Animado entrada={quando('Barcelona')} posicao={[-0.9, 0, 0.5]}>
          <Microfone escala={0.7} />
        </Animado>
        <Animado entrada={quando('perguntaram')} posicao={[0.95, 0, 0.45]}>
          <Microfone escala={0.7} />
        </Animado>
      </Sala>
      <Rotulo texto="RENOVAÇÃO" x={540} y={320} entrada={quando('renovar')} cor={BARCA} corTexto={BRANCO} tamanho={48} />
      <Som tipo="surgir" em={quando('Barcelona')} />
    </>
  );
};

// 3. A fala
const Fala: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tGerir = quando('gerir');
  const p = progresso(frame, tGerir, tGerir + 18);
  return (
    <>
      <Sala>
        <Microfone posicao={[0.5, 0, 0.35]} escala={0.8} />
        <Raphinha barca posicao={[-0.4, 0, 0.15]} giro={15} pose="explicando" falando />
        <Animado entrada={quando('técnico')} posicao={[1.05, 0, -0.4]}>
          <Tecnico pose="parado" giro={-30} />
        </Animado>
        <Seta de={[-0.1, 1.4, 0.2]} para={[0.75, 1.5, -0.2]} progresso={p} cor={VERMELHO} />
      </Sala>
      <Titulo texto="gerir os minutos" destaque="minutos" entrada={tGerir} y={360} tamanho={84} />
      <Som tipo="revelar" em={tGerir} />
    </>
  );
};

// 4. Não cem por cento
const Porcento: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tCem = quando('cem');
  const valor = 0.35 + progresso(frame, 0, tCem || 30) * 0.35;
  return (
    <>
      <Sala>
        <Raphinha posicao={[-0.7, 0, 0.2]} pose="deOmbros" giro={15} />
        <Animado entrada={0} posicao={[0.55, 0, 0]}>
          <Medidor valor={valor} cor={valor < 0.75 ? VERMELHO : '#3ecf6a'} />
        </Animado>
      </Sala>
      <Rotulo texto="NÃO CEM POR CENTO" x={540} y={340} entrada={tCem} cor={VERMELHO} corTexto={BRANCO} tamanho={46} />
      <Som tipo="ideia" em={quando('lesão')} />
    </>
  );
};

// 5. Austrália
const Australia: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Campo camera={{tipo: 'mover', de: {posicao: [0, 1.9, 9.0], alvo: [0, 0.7, 0]}, para: {posicao: [0, 1.7, 8.2], alvo: [0, 0.7, 0]}}}>
        <Raphinha
          posicao={[0, 0, 0.3]}
          poses={[{quadro: 0, pose: 'correndo'}, {quadro: quando('machucou'), pose: 'deOmbros'}]}
        />
        <Animado entrada={quando('machucou')} posicao={[0.35, 0.55, 0.45]} escala={0.7}>
          <MarcaX />
        </Animado>
        <Animado entrada={quando('desfalque')} posicao={[-1.0, 0, -0.8]}>
          <Boneco visual={3} cor={BARCA} calca={BARCA_AZUL} pose="parado" escala={0.7} />
        </Animado>
        <BolaFutebol posicao={[0.9, 0.22, 0.8]} escala={0.75} />
      </Campo>
      <Rotulo texto="AUSTRÁLIA" x={540} y={320} entrada={quando('Austrália')} cor="#1a3d8f" corTexto={BRANCO} tamanho={48} />
      <Som tipo="mergulho" em={quando('machucou')} />
    </>
  );
};

// 6. Três lesões
const TresLesoes: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <Raphinha posicao={[0, 0, 0.2]} pose="parado" />
        <Animado entrada={0} posicao={[-0.35, 0.55, 0.45]} escala={0.45}>
          <MarcaX />
        </Animado>
        <Animado entrada={quando('três')} posicao={[0.05, 0.7, 0.45]} escala={0.45}>
          <MarcaX />
        </Animado>
        <Animado entrada={quando('lesões')} posicao={[0.4, 0.85, 0.45]} escala={0.45}>
          <MarcaX />
        </Animado>
      </Sala>
      <Numero ate={3} entrada={quando('três')} y={300} tamanho={160} />
      <Rotulo texto="MESMA REGIÃO" x={540} y={460} entrada={quando('região')} cor={VERMELHO} corTexto={BRANCO} tamanho={44} />
      <Som tipo="revelar" em={quando('três')} />
    </>
  );
};

// 7. Reação
const Reacao: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tDitando = quando('ditando');
  const p = progresso(frame, tDitando, tDitando + 16);
  return (
    <>
      <Sala>
        <Raphinha posicao={[-0.85, 0, 0.3]} giro={25} pose="apontando" />
        <Tecnico posicao={[0.9, 0, 0.1]} giro={-25} poses={[{quadro: 0, pose: 'parado'}, {quadro: tDitando, pose: 'surpreso'}]} />
        <Seta de={[-0.5, 1.5, 0.3]} para={[0.55, 1.55, 0.15]} progresso={p} cor={VERMELHO} />
        <Animado entrada={quando('frase')} posicao={[0, 0, 0.9]} escala={0.55}>
          <Microfone />
        </Animado>
      </Sala>
      <Titulo texto="passou do ponto" destaque="passou" entrada={quando('carga')} y={360} tamanho={86} />
      <Som tipo="pergunta" em={quando('frase')} />
    </>
  );
};

// 8. Roger Flores
const Roger: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <mesh position={[0, 0.42, 0.35]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.1, 0.55]} />
          <meshStandardMaterial color="#2a3344" flatShading />
        </mesh>
        <Microfone posicao={[0.55, 0.48, 0.4]} escala={0.45} />
        <Comentarista posicao={[-0.15, 0, 0.55]} poses={[{quadro: 0, pose: 'explicando'}, {quadro: quando('dá'), pose: 'apontando'}]} falando />
        <Animado entrada={quando('seco')} posicao={[0.95, 1.5, -0.1]} escala={0.85}>
          <MarcaX />
        </Animado>
      </Sala>
      <Titulo texto="não dá" destaque="não dá" entrada={quando('dá')} y={380} tamanho={110} />
      <Som tipo="revelar" em={quando('dá')} />
    </>
  );
};

// 9. Singapura
const Singapura: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <FundoBandeira />
        <MesaColetiva />
        <Raphinha posicao={[0, 0, 0.55]} pose="pensando" />
        <Animado entrada={quando('cobrança')} posicao={[-0.7, 0.52, 0.55]} escala={0.45}>
          <Microfone />
        </Animado>
        <Animado entrada={quando('coletiva')} posicao={[0.7, 0.52, 0.55]} escala={0.45}>
          <Microfone />
        </Animado>
      </Sala>
      <Rotulo texto="SINGAPURA" x={540} y={300} entrada={quando('Singapura')} cor="#149c3a" corTexto={BRANCO} tamanho={52} />
      <Som tipo="surgir" em={quando('Singapura')} />
    </>
  );
};

// 10. Pane 24 segundos
const Pane: React.FC = () => {
  const {quando} = useCena();
  const naCapa = useNaCapa();
  return (
    <>
      <Sala camera={{tipo: 'mover', de: {posicao: [0, 1.7, 8.4], alvo: [0, 1.0, 0.2]}, para: {posicao: [0, 1.65, 7.6], alvo: [0, 1.0, 0.2]}}}>
        <FundoBandeira />
        <MesaColetiva />
        <Raphinha
          posicao={[0, 0, 0.55]}
          poses={[{quadro: 0, pose: 'explicando'}, {quadro: quando('travou'), pose: 'pensando'}]}
        />
        <Animado entrada={quando('silêncio')} posicao={[0.95, 1.35, 0.2]} escala={0.85}>
          <Relogio />
        </Animado>
        <Microfone posicao={[-0.55, 0.52, 0.6]} escala={0.4} />
      </Sala>
      {!naCapa && <Numero ate={24} entrada={quando('vinte')} y={300} tamanho={150} />}
      {!naCapa && (
        <Rotulo texto="SEGUNDOS DE SILÊNCIO" x={540} y={460} entrada={quando('silêncio')} cor={VERMELHO} corTexto={BRANCO} tamanho={42} />
      )}
      <Som tipo="mergulho" em={quando('travou')} />
    </>
  );
};

// 11. Honra
const Honra: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <Pedestal posicao={[0, 0, -0.15]} />
        <Raphinha
          posicao={[0, 0.55, -0.15]}
          poses={[{quadro: 0, pose: 'pensando'}, {quadro: quando('primeira'), pose: 'olhandoCima'}, {quadro: quando('mão'), pose: 'comemorando'}]}
        />
        <Animado entrada={quando('honra')} posicao={[-0.95, 1.8, -0.4]} escala={0.55} flutuar={0.08}>
          <mesh>
            <icosahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial color={AMARELO} emissive={AMARELO} emissiveIntensity={0.4} flatShading />
          </mesh>
        </Animado>
        <Animado entrada={quando('privilégio')} posicao={[0.95, 1.8, -0.4]} escala={0.45}>
          <MarcaVisto />
        </Animado>
      </Sala>
      <Titulo texto="nunca abri mão" destaque="nunca" entrada={quando('mão')} y={360} tamanho={88} />
      <Som tipo="brilho" em={quando('honra')} />
    </>
  );
};

// 12. Intenção
const Intencao: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <mesh position={[-0.75, 0.08, 0]} receiveShadow>
          <boxGeometry args={[1.1, 0.12, 0.7]} />
          <meshStandardMaterial color="#2a3140" flatShading />
        </mesh>
        <mesh position={[0.75, 0.08, 0]} receiveShadow>
          <boxGeometry args={[1.1, 0.12, 0.7]} />
          <meshStandardMaterial color="#2a3140" flatShading />
        </mesh>
        <Animado entrada={0} posicao={[-0.75, 0.7, 0]} escala={0.7}>
          <MarcaX />
        </Animado>
        <Animado entrada={quando('cuidar')} posicao={[0.75, 0.7, 0]} escala={0.7}>
          <MarcaVisto />
        </Animado>
        <Raphinha posicao={[0, 0, 1.0]} pose="pensando" escala={0.85} />
      </Sala>
      <Rotulo texto="ESCOLHER JOGO" x={270} y={320} entrada={0} cor={VERMELHO} corTexto={BRANCO} tamanho={36} />
      <Rotulo texto="CUIDAR DO CORPO" x={810} y={320} entrada={quando('cuidar')} cor="#1b6b3c" corTexto={BRANCO} tamanho={36} />
      <Som tipo="ideia" em={quando('cuidar')} />
    </>
  );
};

// 13. Disponível
const Disponivel: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Campo>
        <Raphinha
          posicao={[0, 0, 0.3]}
          poses={[{quadro: 0, pose: 'parado'}, {quadro: quando('disponível'), pose: 'comemorando'}]}
        />
        <BolaFutebol posicao={[0.55, 0.22, 0.6]} escala={0.8} />
        <Animado entrada={quando('Brasil')} posicao={[-0.9, 0, -0.5]}>
          <Boneco visual={1} cor={AMARELO} calca={VERDE} pose="acenando" escala={0.75} />
        </Animado>
      </Campo>
      <Titulo texto="disponível" destaque="disponível" entrada={quando('disponível')} y={360} tamanho={100} />
      <Som tipo="surgir" em={quando('disponível')} />
    </>
  );
};

// 14. Quer jogar
const QuerJogar: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Campo>
        <Raphinha
          posicao={[0, 0, 0.2]}
          poses={[{quadro: 0, pose: 'correndo'}, {quadro: quando('minutos'), pose: 'apontando'}]}
        />
        <BolaFutebol posicao={[-0.7, 0.22, 0.5]} escala={0.75} />
      </Campo>
      <Titulo texto="todos os jogos" destaque="todos" entrada={quando('todos')} y={340} tamanho={92} />
      <Numero ate={90} sufixo=" min" entrada={quando('minutos')} y={480} tamanho={100} />
      <Som tipo="brilho" em={quando('todos')} />
    </>
  );
};

// 15. Ancelotti
const AncelottiCena: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <Tecnico
          posicao={[-0.45, 0, 0.25]}
          poses={[{quadro: 0, pose: 'explicando'}, {quadro: quando('saúde'), pose: 'apontando'}]}
          falando
        />
        <Raphinha posicao={[0.75, 0, 0.15]} giro={-20} poses={[{quadro: 0, pose: 'parado'}, {quadro: quando('cem'), pose: 'olhandoCima'}]} />
        <Animado entrada={quando('saúde')} posicao={[-0.95, 1.6, -0.3]} escala={0.5}>
          <MarcaVisto />
        </Animado>
      </Sala>
      <Titulo texto="prioridade: saúde" destaque="saúde" entrada={quando('saúde')} y={360} tamanho={84} />
      <Som tipo="ideia" em={quando('saúde')} />
    </>
  );
};

// 16. Clubes tranquilos
const Clubes: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <Relogio posicao={[0, 1.55, -0.5]} escala={1.05} />
        <Raphinha posicao={[-0.85, 0, 0.3]} pose="parado" escala={0.9} />
        <Raphinha barca posicao={[0.85, 0, 0.3]} pose="parado" escala={0.9} />
        <Animado entrada={quando('tranquilos')} posicao={[0, 0.9, 0.5]} escala={0.55}>
          <MarcaVisto />
        </Animado>
      </Sala>
      <Rotulo texto="CLUBES TRANQUILOS" x={540} y={340} entrada={quando('tranquilos')} cor="#1b6b3c" corTexto={BRANCO} tamanho={46} />
      <Som tipo="surgir" em={quando('tranquilos')} />
    </>
  );
};

// 17. O ponto
const Ponto: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <Raphinha posicao={[-0.5, 0, 0.2]} giro={15} pose="surpreso" />
        <Tecnico posicao={[0.75, 0, -0.1]} giro={-20} pose="pensando" />
        <Animado entrada={quando('realmente')} posicao={[0, 2.0, -0.4]} escala={0.9}>
          <Interrogacao />
        </Animado>
      </Sala>
      <Titulo texto={"\"se realmente conta comigo\""} destaque="realmente" entrada={quando('realmente')} y={340} tamanho={64} />
      <Rotulo texto="AÍ PASSOU DO PONTO" x={540} y={460} entrada={quando('passou')} cor={VERMELHO} corTexto={BRANCO} tamanho={44} />
      <Som tipo="revelar" em={quando('passou')} />
    </>
  );
};

// 18. CTA
const Cta: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Sala>
        <Raphinha posicao={[0, 0, 0.25]} poses={[{quadro: 0, pose: 'pensando'}, {quadro: quando('Comenta'), pose: 'explicando'}]} />
        <Animado entrada={quando('passou')} posicao={[-0.95, 1.5, -0.2]} escala={0.55}>
          <MarcaX />
        </Animado>
        <Animado entrada={quando('torta')} posicao={[0.95, 1.5, -0.2]} escala={0.55}>
          <MarcaVisto />
        </Animado>
      </Sala>
      <Rotulo texto="PASSOU" x={270} y={340} entrada={quando('passou')} cor={VERMELHO} corTexto={BRANCO} tamanho={44} />
      <Rotulo texto="SAIU TORTA" x={810} y={340} entrada={quando('torta')} cor="#1b6b3c" corTexto={BRANCO} tamanho={44} />
      <Titulo texto="comenta aí" destaque="comenta" entrada={quando('Comenta')} y={480} tamanho={90} />
      <Som tipo="pergunta" em={quando('Comenta')} />
    </>
  );
};

export const cenas: Cenas = {
  gancho: Gancho,
  renovacao: Renovacao,
  fala: Fala,
  porcento: Porcento,
  australia: Australia,
  'tres-lesoes': TresLesoes,
  reacao: Reacao,
  roger: Roger,
  singapura: Singapura,
  pane: Pane,
  honra: Honra,
  intencao: Intencao,
  disponivel: Disponivel,
  'quer-jogar': QuerJogar,
  ancelotti: AncelottiCena,
  clubes: Clubes,
  ponto: Ponto,
  cta: Cta,
};
