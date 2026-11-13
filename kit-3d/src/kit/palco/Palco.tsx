import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import React, {useContext, useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import {AbsoluteFill, random, useVideoConfig} from 'remotion';
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  CustomBlending,
  type DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Object3D,
  OneFactor,
  OneMinusSrcAlphaFactor,
  Quaternion,
  ShaderMaterial,
  SrcAlphaFactor,
  Vector3,
} from 'three';
import {ContextoCapa, ContextoCarrossel, ContextoCena, ContextoLinha} from '../../video/contexto';
import {COR, ESTILO, type Vec3} from '../tema';
import {Ambiente, type TipoAmbiente} from './Ambiente';
import {ALCANCE_PADRAO, CAMERA_PADRAO, Camera, type MovimentoCamera} from './Camera';
import {luzDaHora, type LuzDaHora} from './hora';

export type PropsPalco = {
  children?: React.ReactNode;
  // Movimento de câmera da cena. Padrão: empurrão lento para frente.
  camera?: MovimentoCamera;
  // Cor do fundo (e da névoa). Troque por um azul para cenas "ao ar livre".
  fundo?: string;
  // Cor do chão, ou false para cenas no espaço.
  chao?: string | false;
  // Disco do palco com aro iluminado.
  disco?: boolean;
  corDoAro?: string;
  // Multiplicador da luz principal (holofote).
  luz?: number;
  corDaContraluz?: string;
  // Multiplicador da contraluz do estilo (a luz de trás que recorta o contorno). Padrão 1; 0 desliga
  // (ex.: cena noturna ou ao ar livre em que o contorno colorido não faz sentido).
  contraluz?: number;
  // Multiplicador das duas luzes de preenchimento do estilo (lateral quente e frontal). Padrão 1; 0 desliga.
  preenchimento?: number;
  // Para onde o holofote aponta.
  alvoDaLuz?: Vec3;
  posicaoDaLuz?: Vec3;
  // Cone de luz visível saindo do holofote.
  feixe?: boolean;
  // [início, fim] da névoa em unidades 3D, ou false.
  nevoa?: [number, number] | false;
  sombras?: boolean;
  estrelas?: boolean;
  // Cenário de fundo AO AR LIVRE: 'nuvens', 'montanhas', 'poeira'. Padrão: nenhum.
  // Nada de enfeite aleatório: todo elemento da cena precisa ter a ver com a narração ou o lugar.
  ambiente?: TipoAmbiente[];
  corDasMontanhas?: string;
  // Fundo transparente (sem céu, chão, névoa nem cone de luz): para recortes e ilustrações.
  transparente?: boolean;
  // Tamanho do canvas. Padrão: o vídeo inteiro.
  largura?: number;
  altura?: number;
  // Luz do dia (0–24, animável): troca o holofote por sol e lua e pinta o fundo, a névoa e a luz ambiente
  // com as cores da hora (src/kit/palco/hora.ts). Para ver o céu, junte o CeuDoDia (Estúdio Pro) com a
  // mesma hora. Sem valor: o palco de sempre.
  hora?: number;
  // Só com `hora`: gira o caminho do sol (graus). 0 = nasce atrás da câmera e se põe de frente para ela.
  azimuteDoSol?: number;
  // Só com `hora`: meia largura (unidades 3D) da área com sombra do sol, em volta de `alvoDaLuz`. Padrão 12.
  alcanceDaSombra?: number;
  // Até onde a câmera enxerga (unidades 3D). Padrão 400: além disso o cenário some. Cidade inteira vista
  // do alto, cordilheira, planeta inteiro: suba (ex.: 1200). O "perto" sobe na mesma proporção para a
  // profundidade não perder precisão (nada de z-fighting longe): com 1200, objetos a menos de 0,3 da
  // câmera somem.
  alcance?: number;
};

// Palco com holofote, contraluz e câmera cinematográfica, nas cores do estilo do canal
// (src/kit/estilos.ts). Tudo dentro dele é 3D (Three.js / React Three Fiber).
export const Palco: React.FC<PropsPalco> = ({
  children,
  camera = CAMERA_PADRAO,
  fundo,
  chao = COR.chao,
  disco = true,
  corDoAro = ESTILO.aro,
  luz = 1,
  corDaContraluz = ESTILO.contraluz,
  contraluz = 1,
  preenchimento = 1,
  alvoDaLuz = [0, 0, 0],
  posicaoDaLuz = [2, 8, 6],
  feixe,
  nevoa = [14, 38],
  sombras = true,
  estrelas = false,
  ambiente = [],
  corDasMontanhas,
  transparente = false,
  largura,
  altura,
  hora,
  azimuteDoSol = 0,
  alcanceDaSombra = 12,
  alcance = ALCANCE_PADRAO,
}) => {
  const video = useVideoConfig();
  const cena = useContext(ContextoCena);
  const naCapa = useContext(ContextoCapa);
  const noCarrossel = useContext(ContextoCarrossel);
  const linha = useContext(ContextoLinha);
  const alvo = useMemo(() => new Object3D(), []);
  const w = largura ?? video.width;
  const h = altura ?? video.height;
  const ceu = hora === undefined ? null : luzDaHora(hora, azimuteDoSol);
  const corDoFundo = fundo ?? ceu?.horizonte ?? COR.fundo;
  // Com luz do dia, o cone do holofote de teatro só aparece se for pedido.
  const comFeixe = feixe ?? (ceu ? false : ESTILO.feixeIntensidade > 0);

  return (
    <AbsoluteFill style={{width: w, height: h}}>
      <ThreeCanvas
        width={w}
        height={h}
        shadows={sombras ? 'percentage' : false}
        gl={{antialias: true, alpha: true, powerPreference: 'high-performance'}}
        camera={{fov: 38, near: 0.1, far: ALCANCE_PADRAO, position: [0, 1.6, 8]}}
      >
        {/* Repassa a cena para dentro do canvas (o 3D roda em outro renderizador React). */}
        <ContextoLinha.Provider value={linha}>
        <ContextoCena.Provider value={cena}>
         <ContextoCapa.Provider value={naCapa}>
         <ContextoCarrossel.Provider value={noCarrossel}>
          {transparente ? null : <color attach="background" args={[corDoFundo]} />}
          {nevoa && !transparente ? <fog attach="fog" args={[corDoFundo, nevoa[0], nevoa[1]]} /> : null}
          <Camera movimento={camera} alcance={alcance} />

          {ceu ? (
            <LuzesDaHora
              ceu={ceu}
              alvoDaLuz={alvoDaLuz}
              alcance={alcanceDaSombra}
              luz={luz}
              sombras={sombras}
              corDaContraluz={corDaContraluz}
              contraluz={contraluz}
              preenchimento={preenchimento}
            />
          ) : (
            <>
              <hemisphereLight args={[ESTILO.luzDoCeu, ESTILO.luzDoChao, ESTILO.luzAmbiente]} />
              <primitive object={alvo} position={alvoDaLuz} />
              <spotLight
                position={posicaoDaLuz}
                target={alvo}
                angle={0.42}
                penumbra={0.75}
                intensity={4.2 * luz * ESTILO.holofote}
                decay={0}
                castShadow={sombras}
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0004}
                shadow-normalBias={0.02}
              />
              {/* contraluz e preenchimentos ficam montados mesmo em 0 (animar não troca o número de luzes) */}
              <directionalLight position={[-5, 4, -6]} intensity={2.2 * contraluz} color={corDaContraluz} />
              {/* preenchimento quente pela lateral e luz frontal suave para os rostos não ficarem escuros */}
              <directionalLight position={[6, 3, 5]} intensity={0.45 * preenchimento} color="#ffe2c4" />
              <directionalLight position={[0, 2.5, 9]} intensity={0.6 * preenchimento} color="#ffffff" />
            </>
          )}

          {chao && !transparente ? <Chao cor={chao} disco={disco} corDoAro={corDoAro} /> : null}
          {comFeixe && !transparente ? (
            <FeixeDoHolofote de={posicaoDaLuz} para={alvoDaLuz} cor={ESTILO.feixe} intensidade={Math.max(0.06, ESTILO.feixeIntensidade)} />
          ) : null}
          {estrelas ? <Estrelas /> : null}
          <Ambiente tipos={ambiente} corDasMontanhas={corDasMontanhas} />

          {children}
         </ContextoCarrossel.Provider>
         </ContextoCapa.Provider>
        </ContextoCena.Provider>
        </ContextoLinha.Provider>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

const Chao: React.FC<{cor: string; disco: boolean; corDoAro: string}> = ({cor, disco, corDoAro}) => (
  <group>
    <mesh rotation-x={-Math.PI / 2} position-y={-0.06} receiveShadow>
      <circleGeometry args={[80, 64]} />
      <meshStandardMaterial color={cor} roughness={0.95} metalness={0} />
    </mesh>
    {ESTILO.grade ? (
      <gridHelper args={[60, 60, ESTILO.grade, ESTILO.grade]} position-y={-0.045} material-transparent material-opacity={0.32} />
    ) : null}
    {disco ? (
      <group>
        <mesh position-y={-0.03} receiveShadow>
          <cylinderGeometry args={[2.6, 2.7, 0.06, 48]} />
          <meshStandardMaterial color={COR.discoPalco} roughness={0.8} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={0.002}>
          <ringGeometry args={[2.52, 2.6, 96]} />
          <meshBasicMaterial color={corDoAro} toneMapped={false} transparent opacity={0.75} />
        </mesh>
      </group>
    ) : null}
  </group>
);

// Luzes ao ar livre (Palco com `hora`): sol com sombra, luar azulado, céu/chão da hora e os preenchimentos
// do palco reduzidos à noite. Intensidades e cores saem de luzDaHora (mudam suaves com a hora).
const LuzesDaHora: React.FC<{
  ceu: LuzDaHora;
  alvoDaLuz: Vec3;
  alcance: number;
  luz: number;
  sombras: boolean;
  corDaContraluz: string;
  contraluz: number;
  preenchimento: number;
}> = ({ceu, alvoDaLuz, alcance, luz, sombras, corDaContraluz, contraluz, preenchimento}) => {
  const sol = useRef<DirectionalLight>(null);
  const alvo = useMemo(() => new Object3D(), []);
  const distancia = alcance * 3 + 20;
  useLayoutEffect(() => {
    const luzDoSol = sol.current;
    if (!luzDoSol) {
      return;
    }
    const cam = luzDoSol.shadow.camera;
    cam.left = -alcance;
    cam.right = alcance;
    cam.top = alcance;
    cam.bottom = -alcance;
    cam.near = 0.5;
    cam.far = distancia * 2;
    cam.updateProjectionMatrix();
  }, [alcance, distancia]);
  const longe = (d: Vec3): Vec3 => [alvoDaLuz[0] + d[0] * distancia, alvoDaLuz[1] + d[1] * distancia, alvoDaLuz[2] + d[2] * distancia];
  const p = ceu.preenchimento;
  return (
    <>
      <hemisphereLight color={ceu.ambienteCeu} groundColor={ceu.ambienteChao} intensity={ceu.intensidadeAmbiente} />
      <primitive object={alvo} position={alvoDaLuz} />
      <directionalLight
        ref={sol}
        position={longe(ceu.dirSol)}
        target={alvo}
        color={ceu.corSol}
        intensity={ceu.intensidadeSol * luz}
        castShadow={sombras && ceu.intensidadeSol > 0.02}
        shadow-mapSize={alcance > 40 ? [4096, 4096] : [2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={Math.max(0.02, alcance * 0.0025)}
      />
      <directionalLight position={longe(ceu.dirLua)} target={alvo} color={ceu.corLua} intensity={ceu.intensidadeLua * luz} />
      <directionalLight position={[-5, 4, -6]} intensity={1.1 * p * contraluz} color={corDaContraluz} />
      <directionalLight position={[6, 3, 5]} intensity={0.3 * p * preenchimento} color="#ffe2c4" />
      <directionalLight position={[0, 2.5, 9]} intensity={0.45 * p * preenchimento} color="#ffffff" />
    </>
  );
};

const SHADER_FEIXE = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying float vFrente;
    void main() {
      vUv = uv;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vec3 n = normalize(normalMatrix * normal);
      vFrente = abs(dot(n, normalize(-mv.xyz)));
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 cor;
    uniform float intensidade;
    varying vec2 vUv;
    varying float vFrente;
    void main() {
      float a = intensidade * pow(vUv.y, 1.4) * pow(vFrente, 2.5);
      gl_FragColor = vec4(cor, a);
    }
  `,
};

// Cone de luz "volumétrico" falso: mais forte perto do holofote, some no chão.
export const FeixeDoHolofote: React.FC<{de: Vec3; para: Vec3; abertura?: number; cor?: string; intensidade?: number}> = ({
  de,
  para,
  abertura = 0.42,
  cor = '#cfe0ff',
  intensidade = 0.16,
}) => {
  const {posicao, quaternion, comprimento} = useMemo(() => {
    const a = new Vector3(...de);
    const b = new Vector3(...para);
    const direcao = a.clone().sub(b);
    return {
      posicao: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direcao.clone().normalize()),
      comprimento: direcao.length(),
    };
  }, [de, para]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...SHADER_FEIXE,
        uniforms: {cor: {value: new Color(cor)}, intensidade: {value: intensidade}},
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
      }),
    [cor, intensidade],
  );
  return (
    <mesh position={posicao} quaternion={quaternion} material={material}>
      <coneGeometry args={[comprimento * Math.tan(abertura) * 0.95, comprimento, 48, 1, true]} />
    </mesh>
  );
};

// Estrelas = pontos redondos e macios. O ponto quadrado padrão (2–5 px) salta de um pixel para o outro
// quando a câmera anda e as estrelas cintilam; com a borda suave e um tamanho mínimo, o brilho de cada
// estrela fica igual em todo quadro.
// São o FUNDO do céu: desenhadas logo depois do fundo (e da cúpula do CeuDoDia), sem gravar profundidade,
// antes de qualquer objeto. Assim nada as tapa por engano e elas nunca aparecem na frente de um objeto,
// por mais longe que ele esteja (a esfera delas tem só 90–150 de raio). A mistura é a mesma de antes
// (alfa normal), feita à mão porque o material vai na fila dos opacos.
const SHADER_ESTRELA = {
  vertexShader: /* glsl */ `
    uniform float tamanho;
    uniform float escala;
    uniform float minimo;
    varying float vForca;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float px = tamanho * escala / max(-mv.z, 0.001);
      float d = max(px, minimo);
      // Abaixo do mínimo o ponto cresce, mas apaga na mesma proporção (a mesma "quantidade de luz").
      vForca = (px * px) / (d * d);
      gl_PointSize = d;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 cor;
    uniform float opacidade;
    varying float vForca;
    void main() {
      float r = length(gl_PointCoord - 0.5) * 2.0;
      float a = 1.0 - smoothstep(0.2, 1.0, r);
      gl_FragColor = vec4(cor, a * a * opacidade * vForca);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
};

// Depois da cúpula do CeuDoDia (-10) e da Lua dele (-6), antes de todo o resto (0).
const ORDEM_ESTRELAS = -5;

const Estrelas: React.FC<{quantidade?: number}> = ({quantidade = 700}) => {
  // Altura do desenho em pixels: o tamanho do ponto é em pixels, como no PointsMaterial.
  const alturaPx = useThree((estado) => estado.size.height * estado.viewport.dpr);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...SHADER_ESTRELA,
        // Ponto macio é maior que o quadrado antigo (0,6) para o miolo ter o mesmo tamanho.
        uniforms: {
          cor: {value: new Color('#dfe8ff')},
          opacidade: {value: 0.85},
          tamanho: {value: 1.1},
          escala: {value: 1},
          minimo: {value: 4},
        },
        transparent: false,
        blending: CustomBlending,
        blendSrc: SrcAlphaFactor,
        blendDst: OneMinusSrcAlphaFactor,
        blendSrcAlpha: OneFactor,
        blendDstAlpha: OneMinusSrcAlphaFactor,
        depthWrite: false,
      }),
    [],
  );
  material.uniforms.escala.value = alturaPx / 2;
  useEffect(() => () => material.dispose(), [material]);
  const geometria = useMemo(() => {
    const posicoes: number[] = [];
    for (let i = 0; i < quantidade; i++) {
      const u = random(`estrela-u-${i}`) * 2 - 1;
      const theta = random(`estrela-t-${i}`) * Math.PI * 2;
      const raio = 90 + random(`estrela-r-${i}`) * 60;
      const s = Math.sqrt(1 - u * u);
      posicoes.push(raio * s * Math.cos(theta), raio * Math.abs(u) * 0.9 + 2, raio * s * Math.sin(theta));
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(posicoes, 3));
    return g;
  }, [quantidade]);
  useEffect(() => () => geometria.dispose(), [geometria]);
  return <points geometry={geometria} material={material} frustumCulled={false} renderOrder={ORDEM_ESTRELAS} />;
};
