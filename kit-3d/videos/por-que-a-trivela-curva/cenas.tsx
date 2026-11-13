// Cenas de "Por que a trivela faz a bola curvar?".
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  Animado,
  BolaFutebol,
  Boneco,
  COR,
  Gol,
  Interrogacao,
  Numero,
  Palco,
  Particulas,
  Pedestal,
  PeChute,
  progresso,
  Rotulo,
  Seta,
  Som,
  suave,
  Titulo,
  useCena,
  useNaCapa,
  type Cenas,
} from '../../src/kit';

const GRAMA = '#163d28';

const CampoBase: React.FC<{
  children: React.ReactNode;
  camera?: React.ComponentProps<typeof Palco>['camera'];
  disco?: boolean;
}> = ({children, camera, disco = false}) => (
  <Palco
    chao={GRAMA}
    disco={disco}
    feixe={false}
    corDoAro="#3ecf6a"
    camera={camera ?? {tipo: 'mover', de: {posicao: [0, 1.7, 8.2], alvo: [0, 1.2, 0]}, para: {posicao: [0, 1.5, 7.0], alvo: [0, 1.3, 0]}}}
  >
    {children}
  </Palco>
);

const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tCurva = quando('curva');
  const x = suave(frame, [tCurva, tCurva + 28], [0.2, 1.0]);
  const y = suave(frame, [tCurva, tCurva + 28], [0.35, 1.8]);
  const z = suave(frame, [tCurva, tCurva + 28], [1.2, -1.4]);
  return (
    <>
      <CampoBase camera={{tipo: 'mover', de: {posicao: [0.4, 1.5, 8.4], alvo: [0, 1.2, 0]}, para: {posicao: [0.1, 1.4, 7.0], alvo: [0.2, 1.4, 0]}}}>
        <Boneco
          posicao={[-0.85, 0, 0.6]}
          giro={25}
          poses={[{quadro: 0, pose: 'apontando'}, {quadro: quando('fora'), pose: 'surpreso'}]}
          visual={1}
          cor="#1e6b3a"
        />
        <BolaFutebol posicao={[x, y, z]} girando={1.6} escala={1.15} />
        <Gol posicao={[0.2, 0, -2.6]} escala={0.85} />
        <Animado entrada={quando('fora')} posicao={[0.95, 2.4, -0.4]} girar={0.7} flutuar={0.05} escala={0.85}>
          <Interrogacao />
        </Animado>
      </CampoBase>
      <Titulo texto="Por que a trivela curva?" destaque="curva" entrada={quando('curva')} y={420} />
      <Som tipo="pergunta" em={quando('fora')} />
    </>
  );
};

const Nome: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <CampoBase>
        <Boneco posicao={[-0.7, 0, 0.4]} pose="explicando" visual={2} cor="#1e6b3a" falando />
        <Animado entrada={0} posicao={[0.55, 0.9, 0.2]} flutuar={0.04}>
          <BolaFutebol escala={1.4} girando={1.4} />
        </Animado>
        <Animado entrada={quando('trivela')} posicao={[0.55, 0.35, 0.55]} escala={1.1}>
          <PeChute lado="externo" />
        </Animado>
      </CampoBase>
      <Titulo texto="TRIVELA" entrada={quando('trivela')} y={400} tamanho={110} />
      <Rotulo texto="três dedos" x={540} y={560} entrada={quando('três')} cor={COR.destaque} />
      <Som tipo="surgir" em={quando('trivela')} />
    </>
  );
};

const Peito: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tGira = quando('gira');
  return (
    <>
      <CampoBase>
        <Boneco posicao={[-0.9, 0, 0.3]} giro={20} pose="apontando" visual={1} cor="#1e6b3a" />
        <PeChute lado="interno" posicao={[0.15, 0.2, 0.5]} escala={1.35} />
        <Animado entrada={quando('peito')} posicao={[0.7, 1.0, 0]}>
          <BolaFutebol escala={1.25} girando={-1.5} />
        </Animado>
        <Seta
          de={[0.7, 1.55, 0]}
          para={[0.15, 1.55, 0]}
          progresso={progresso(frame, tGira, tGira + 18)}
          cor={COR.destaque}
          espessura={0.045}
        />
      </CampoBase>
      <Rotulo texto="peito do pé" x={540} y={480} entrada={quando('peito')} cor={COR.destaque} />
      <Som tipo="texto" em={quando('peito')} />
    </>
  );
};

const Externa: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tContrario = quando('contrário');
  return (
    <>
      <CampoBase>
        <Boneco posicao={[-0.9, 0, 0.3]} giro={20} pose="apontando" visual={3} cor="#1e6b3a" />
        <PeChute lado="externo" posicao={[0.15, 0.2, 0.5]} escala={1.35} />
        <Animado entrada={0} posicao={[0.7, 1.0, 0]}>
          <BolaFutebol escala={1.25} girando={1.5} />
        </Animado>
        <Seta
          de={[0.7, 1.55, 0]}
          para={[1.25, 1.55, 0]}
          progresso={progresso(frame, tContrario, tContrario + 18)}
          cor="#38d9ff"
          espessura={0.045}
        />
      </CampoBase>
      <Rotulo texto="parte de fora" x={540} y={480} entrada={quando('fora')} cor="#38d9ff" />
      <Titulo texto="giro ao contrário" destaque="contrário" entrada={tContrario} y={560} tamanho={72} />
      <Som tipo="revelar" em={tContrario} />
    </>
  );
};

const Giro: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  return (
    <>
      <Palco
        chao={GRAMA}
        disco
        camera={{tipo: 'orbita', raio: 6.2, altura: 1.6, de: -35, ate: 35, alvo: [0, 1.1, 0]}}
      >
        <Animado posicao={[0, 1.1, 0]} flutuar={0.06}>
          <BolaFutebol escala={2.4} girando={1.2} />
        </Animado>
        <Seta de={[0.95, 1.7, 0]} para={[-0.95, 1.7, 0]} progresso={progresso(frame, 0, 20)} cor={COR.destaque} espessura={0.05} />
        <Seta de={[-0.95, 0.5, 0]} para={[0.95, 0.5, 0]} progresso={progresso(frame, 4, 24)} cor="#38d9ff" espessura={0.05} />
        <Animado entrada={quando('giro')} posicao={[0, 1.1, 0]}>
          <Particulas quantidade={40} area={[1.8, 1.8, 1.8]} tamanho={0.04} cores={['#9ad7ff', COR.destaque]} brilhar agitacao={0.2} semente="giro" />
        </Animado>
      </Palco>
      <Titulo texto="o giro no ar" destaque="giro" entrada={quando('giro')} y={420} />
      <Som tipo="brilho" em={quando('giro')} />
    </>
  );
};

const Ar: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tDif = quando('diferente');
  return (
    <>
      <Palco chao={GRAMA} disco camera={{tipo: 'fixa', posicao: [0, 1.5, 7.2], alvo: [0, 1.2, 0]}}>
        <BolaFutebol posicao={[0, 1.2, 0]} escala={2} girando={1.1} />
        <Seta de={[-1.35, 1.65, 0]} para={[-0.55, 1.65, 0]} progresso={progresso(frame, 0, 16)} cor="#38d9ff" espessura={0.055} />
        <Seta de={[-1.35, 1.35, 0]} para={[-0.55, 1.35, 0]} progresso={progresso(frame, 3, 18)} cor="#38d9ff" espessura={0.04} />
        <Seta de={[1.35, 0.9, 0]} para={[0.55, 0.9, 0]} progresso={progresso(frame, 6, 22)} cor="#ff6b6b" espessura={0.055} />
        <Animado entrada={tDif} posicao={[0, 1.2, 0]}>
          <Particulas quantidade={18} area={[2.2, 1.6, 0.8]} tamanho={0.035} cores={['#9ad7ff', '#ffb0b0']} brilhar agitacao={0.08} semente="ar" />
        </Animado>
      </Palco>
      <Rotulo texto="ar rápido" x={220} y={520} entrada={0} cor="#38d9ff" />
      <Rotulo texto="ar lento" x={860} y={720} entrada={tDif} cor="#ff6b6b" />
      <Som tipo="luz" em={tDif} />
    </>
  );
};

const Pressao: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tLento = quando('lento');
  return (
    <>
      <Palco chao={GRAMA} disco camera={{tipo: 'mover', de: {posicao: [0, 1.6, 7.6], alvo: [0, 1.2, 0]}, para: {posicao: [0, 1.5, 6.6], alvo: [0, 1.25, 0]}}}>
        <BolaFutebol posicao={[0, 1.15, 0]} escala={1.9} girando={1.1} />
        <Animado posicao={[-1.05, 1.5, 0]}>
          <Particulas quantidade={22} area={[0.7, 1.0, 0.5]} tamanho={0.04} cores={['#7ec8ff']} brilhar agitacao={0.12} semente="baixa" />
        </Animado>
        <Animado posicao={[1.05, 1.0, 0]}>
          <Particulas quantidade={14} area={[0.55, 0.7, 0.4]} tamanho={0.05} cores={['#ff8a8a']} agitacao={0.05} semente="alta" />
        </Animado>
        <Seta de={[-1.2, 1.55, 0]} para={[-0.5, 1.4, 0]} progresso={progresso(frame, 0, 14)} cor="#7ec8ff" espessura={0.04} />
        <Seta de={[1.2, 0.95, 0]} para={[0.5, 1.05, 0]} progresso={progresso(frame, 4, 18)} cor="#ff8a8a" espessura={0.04} />
        <Seta
          de={[0.2, 1.15, 0.1]}
          para={[-0.9, 1.15, 0.1]}
          progresso={progresso(frame, quando('pressão'), quando('pressão') + 16)}
          cor={COR.destaque}
          espessura={0.055}
        />
      </Palco>
      <Rotulo texto="pressão baixa" x={200} y={480} entrada={0} cor="#7ec8ff" />
      <Rotulo texto="pressão alta" x={880} y={700} entrada={tLento} cor="#ff8a8a" />
      <Som tipo="ideia" em={quando('pressão')} />
    </>
  );
};

const Magnus: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Palco camera={{tipo: 'mover', de: {posicao: [0, 1.7, 8], alvo: [0, 1.3, 0]}, para: {posicao: [0, 1.6, 7], alvo: [0, 1.35, 0]}}}>
        <Pedestal raio={0.55} altura={0.55} cor={COR.destaque}>
          <BolaFutebol posicao={[0, 0.35, 0]} escala={1.3} girando={1.0} />
        </Pedestal>
        <Animado entrada={quando('tênis')} posicao={[-1.05, 1.35, 0.2]} girar={0.6} flutuar={0.05} escala={0.55}>
          <mesh castShadow>
            <icosahedronGeometry args={[0.35, 1]} />
            <meshStandardMaterial color="#c8f06a" flatShading />
          </mesh>
        </Animado>
        <Animado entrada={quando('golfe')} posicao={[1.05, 1.2, 0.2]} girar={0.5} flutuar={0.04} escala={0.4}>
          <mesh castShadow>
            <icosahedronGeometry args={[0.28, 1]} />
            <meshStandardMaterial color="#f4f6fb" flatShading />
          </mesh>
        </Animado>
        <Boneco posicao={[0, 0, 1.1]} pose="explicando" visual={0} escala={0.85} falando />
      </Palco>
      <Titulo texto="efeito Magnus" destaque="Magnus" entrada={quando('Magnus')} y={400} />
      <Rotulo texto="tênis" x={220} y={620} entrada={quando('tênis')} />
      <Rotulo texto="golfe" x={860} y={620} entrada={quando('golfe')} />
      <Som tipo="revelar" em={quando('Magnus')} />
    </>
  );
};

const Curva: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const naCapa = useNaCapa();
  const tCaminho = quando('caminho');
  const p = progresso(frame, tCaminho, tCaminho + 36);
  const x = -0.9 + p * 1.9 + Math.sin(p * Math.PI) * 0.55;
  const y = 0.4 + Math.sin(p * Math.PI) * 1.1;
  const z = 1.4 - p * 3.2;
  return (
    <>
      <CampoBase camera={{tipo: 'mover', de: {posicao: [0.6, 1.6, 8.5], alvo: [0, 1.1, -0.5]}, para: {posicao: [0.2, 1.5, 7.2], alvo: [0.1, 1.2, -0.8]}}}>
        <Boneco posicao={[-1.0, 0, 1.5]} giro={40} pose="apontando" visual={1} cor="#1e6b3a" />
        <Gol posicao={[0.3, 0, -2.4]} escala={0.9} />
        <BolaFutebol posicao={[x, y, z]} escala={1.1} girando={1.4} />
      </CampoBase>
      {naCapa ? null : <Titulo texto="curva no ar" destaque="curva" entrada={tCaminho} y={420} />}
      <Som tipo="brilho" em={tCaminho} />
    </>
  );
};

const Desacelera: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tForte = quando('forte');
  const p = progresso(frame, 0, 50);
  const curva = suave(frame, [tForte, tForte + 30], [0.15, 0.95]);
  const x = -1.0 + p * 2.0 + curva * 0.7;
  const y = 0.5 + Math.sin(p * Math.PI) * 0.9;
  const z = 1.2 - p * 2.8;
  return (
    <>
      <CampoBase>
        <Boneco posicao={[0.85, 0, -1.6]} giro={-30} poses={[{quadro: 0, pose: 'parado'}, {quadro: tForte, pose: 'surpreso'}]} visual={4} />
        <Gol posicao={[0.2, 0, -2.5]} escala={0.85} />
        <BolaFutebol posicao={[x, y, z]} escala={1.15} girando={1.3} />
      </CampoBase>
      <Titulo texto="curva mais no fim" destaque="fim" entrada={tForte} y={430} tamanho={78} />
      <Som tipo="mergulho" em={tForte} />
    </>
  );
};

const Roberto: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <CampoBase camera={{tipo: 'mover', de: {posicao: [-0.4, 2.2, 9.5], alvo: [0, 1, -1]}, para: {posicao: [0, 1.8, 8.2], alvo: [0.2, 1.1, -1.2]}}}>
        <Boneco posicao={[-1.1, 0, 2.0]} giro={35} pose="apontando" visual={2} cor="#1e6b3a" />
        <BolaFutebol posicao={[-0.7, 0.35, 1.6]} escala={0.95} />
        {[0, 1, 2, 3].map((i) => (
          <Boneco
            key={i}
            posicao={[-0.6 + i * 0.45, 0, -0.4]}
            giro={180}
            pose="parado"
            visual={(i + 1) % 5}
            escala={0.85}
            cor="#2b3a6b"
          />
        ))}
        <Boneco posicao={[0.3, 0, -1.9]} giro={-20} pose="surpreso" visual={0} escala={0.9} />
        <Gol posicao={[0.25, 0, -2.7]} escala={0.9} />
      </CampoBase>
      <Titulo texto="Roberto Carlos · 1997" destaque="1997" entrada={quando('noventa')} y={400} tamanho={70} />
      <Som tipo="surgir" em={quando('Roberto')} />
    </>
  );
};

const TrintaSete: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <CampoBase camera={{tipo: 'fixa', posicao: [0, 1.8, 8.5], alvo: [0, 1.2, 0]}}>
        <Boneco posicao={[-1.0, 0, 1.8]} giro={30} pose="apontando" visual={2} cor="#1e6b3a" />
        <PeChute lado="externo" posicao={[-0.45, 0.15, 1.5]} escala={1.2} />
        <BolaFutebol posicao={[-0.15, 0.45, 1.25]} escala={1} girando={2} />
        <Gol posicao={[0.4, 0, -2.6]} escala={0.85} />
        <Seta de={[-0.9, 0.8, 1.6]} para={[0.3, 0.9, -2.2]} progresso={1} cor={COR.destaque} espessura={0.04} />
      </CampoBase>
      <Numero ate={37} sufixo=" m" entrada={quando('trinta')} y={460} />
      <Rotulo texto="pé esquerdo · externa" x={540} y={620} entrada={quando('esquerdo')} cor={COR.destaque} />
      <Som tipo="revelar" em={quando('trinta')} />
    </>
  );
};

const Parede: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tEmbora = quando('embora');
  const tCanto = quando('canto');
  const p = progresso(frame, tEmbora, tCanto + 10);
  // Vai para fora e depois curva para dentro
  const x = -0.4 + p * 0.2 + Math.sin(p * Math.PI) * 1.15;
  const y = 0.5 + Math.sin(p * Math.PI * 0.9) * 1.0;
  const z = 1.5 - p * 3.6;
  return (
    <>
      <CampoBase>
        {[0, 1, 2, 3].map((i) => (
          <Boneco key={i} posicao={[-0.55 + i * 0.4, 0, -0.2]} giro={180} pose="parado" visual={i % 5} escala={0.8} cor="#2b3a6b" />
        ))}
        <Boneco posicao={[0.35, 0, -1.85]} poses={[{quadro: 0, pose: 'parado'}, {quadro: tCanto, pose: 'surpreso'}]} visual={0} />
        <Gol posicao={[0.3, 0, -2.6]} escala={0.9} />
        <BolaFutebol posicao={[x, y, z]} escala={1.05} girando={1.4} />
      </CampoBase>
      <Titulo texto="puxou pro canto" destaque="canto" entrada={tCanto} y={420} />
      <Som tipo="revelar" em={tCanto} />
    </>
  );
};

const Dificil: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Palco chao={GRAMA} disco={false} camera={{tipo: 'fixa', posicao: [0, 1.5, 7.4], alvo: [0, 1.0, 0]}}>
        <PeChute lado="interno" posicao={[-0.85, 0.3, 0.3]} escala={1.5} />
        <BolaFutebol posicao={[-0.55, 0.85, 0.55]} escala={1.1} />
        <Animado entrada={quando('menor')} posicao={[0.75, 0.3, 0.3]} escala={1.5}>
          <PeChute lado="externo" />
        </Animado>
        <Animado entrada={quando('menor')} posicao={[0.45, 0.85, 0.55]}>
          <BolaFutebol escala={1.1} />
        </Animado>
      </Palco>
      <Rotulo texto="contato largo" x={260} y={500} entrada={0} cor={COR.destaque} />
      <Rotulo texto="contato estreito" x={820} y={500} entrada={quando('menor')} cor="#ff6b6b" />
      <Som tipo="texto" em={quando('menor')} />
    </>
  );
};

const Gramado: React.FC = () => {
  const {quando} = useCena();
  return (
    <>
      <Palco chao={GRAMA} disco camera={{tipo: 'fixa', posicao: [0, 1.5, 7.2], alvo: [0, 1.1, 0]}}>
        <Animado posicao={[-0.85, 1.1, 0]} flutuar={0.05}>
          <BolaFutebol escala={1.7} girando={1.3} />
        </Animado>
        <Seta de={[-1.4, 1.7, 0]} para={[-0.3, 1.7, 0]} progresso={1} cor={COR.destaque} espessura={0.045} />
        <Animado posicao={[0.85, 1.1, 0]} flutuar={0.03}>
          <BolaFutebol escala={1.7} girando={0.5} molhada />
        </Animado>
        <Animado entrada={quando('Chuva')} posicao={[0.85, 1.9, 0]}>
          <Particulas quantidade={12} area={[0.7, 0.9, 0.4]} tamanho={0.04} cores={['#8ec8ff', '#d4e8ff']} agitacao={0.06} semente="chuva" />
        </Animado>
      </Palco>
      <Rotulo texto="seco · mais giro" x={250} y={500} entrada={0} cor={COR.destaque} />
      <Rotulo texto="molhada · menos giro" x={830} y={500} entrada={quando('Chuva')} cor="#8ec8ff" />
      <Som tipo="surgir" em={quando('Chuva')} />
    </>
  );
};

const Volta: React.FC = () => {
  const frame = useCurrentFrame();
  const {quando} = useCena();
  const tAr = quando('ar');
  return (
    <>
      <Palco chao={GRAMA} disco camera={{tipo: 'orbita', raio: 6.5, altura: 1.7, de: -25, ate: 25, alvo: [0, 1.2, 0]}}>
        <BolaFutebol posicao={[0, 1.2, 0]} escala={2.1} girando={1.1} />
        <Seta
          de={[0.9, 1.2, 0]}
          para={[-0.9, 1.2, 0]}
          progresso={progresso(frame, tAr, tAr + 20)}
          cor={COR.destaque}
          espessura={0.06}
        />
        <Animado entrada={tAr} posicao={[0, 1.2, 0]}>
          <Particulas quantidade={24} area={[2, 1.6, 1.6]} tamanho={0.04} cores={['#9ad7ff', COR.destaque]} brilhar agitacao={0.1} semente="volta" />
        </Animado>
      </Palco>
      <Titulo texto="curva = física" destaque="física" entrada={quando('mágica')} y={420} />
      <Som tipo="ideia" em={tAr} />
    </>
  );
};

const Cta: React.FC = () => {
  const {quando, duracao} = useCena();
  const frame = useCurrentFrame();
  const mostra = frame > duracao - 50;
  return (
    <>
      <CampoBase camera={{tipo: 'mover', de: {posicao: [0, 1.6, 7.8], alvo: [0, 1.3, 0]}, para: {posicao: [0, 1.7, 8.6], alvo: [0, 1.4, 0]}}}>
        <Boneco
          poses={[{quadro: 0, pose: 'explicando'}, {quadro: quando('tentou'), pose: 'acenando'}]}
          visual={1}
          cor="#1e6b3a"
          falando
        />
        <Animado posicao={[0.95, 1.5, -0.3]} flutuar={0.08}>
          <BolaFutebol escala={1.2} girando={1.2} />
        </Animado>
      </CampoBase>
      <Titulo texto="já tentou a trivela?" destaque="trivela" entrada={quando('tentou')} y={400} tamanho={78} />
      {mostra ? (
        <Rotulo texto="COMENTA AÍ" x={540} y={560} entrada={duracao - 50} cor={COR.destaque} />
      ) : null}
      <Som tipo="pergunta" em={quando('tentou')} />
    </>
  );
};

export const cenas: Cenas = {
  gancho: Gancho,
  nome: Nome,
  peito: Peito,
  externa: Externa,
  giro: Giro,
  ar: Ar,
  pressao: Pressao,
  magnus: Magnus,
  curva: Curva,
  desacelera: Desacelera,
  roberto: Roberto,
  'trinta-sete': TrintaSete,
  parede: Parede,
  dificil: Dificil,
  gramado: Gramado,
  volta: Volta,
  cta: Cta,
};
