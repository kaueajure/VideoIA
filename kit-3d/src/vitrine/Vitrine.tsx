// Mostruário do kit (pasta "kit" no Studio). Serve para conferir bonecos e objetos
// sem precisar de um vídeo: `npm run previa -- kit-bonecos`.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Boneco} from '../kit/bonecos/Boneco';
import {NOMES_POSES} from '../kit/bonecos/poses';
import {FONTE} from '../kit/fontes';
import {Animado} from '../kit/objetos/Animado';
import {Feixe, Onda, Particulas, Seta} from '../kit/objetos/diagramas';
import {Globo, Planeta, Sol} from '../kit/objetos/espaco';
import {ArcoIris, Livro, Lampada, Lupa, Molecula, Olho} from '../kit/objetos/ciencia';
import {Casa, Montanha, Predio} from '../kit/objetos/lugares';
import {Arvore, Nuvem} from '../kit/objetos/natureza';
import {Foguete, Rover} from '../kit/objetos/veiculos';
import {Arroba, Interrogacao, Pedestal, Prisma} from '../kit/objetos/simbolos';
import {Geladeira} from '../kit/objetos/Geladeira';
import {BolaFutebol, Gol} from '../kit/objetos/futebol';
import {Palco} from '../kit/palco/Palco';
import {COR} from '../kit/tema';

const LARGURA = 360;

const Celula: React.FC<{nome: string; altura: number; children: React.ReactNode}> = ({nome, altura, children}) => (
  <div style={{width: LARGURA, height: altura, position: 'relative', overflow: 'hidden'}}>
    <Palco
      largura={LARGURA}
      altura={altura}
      camera={{tipo: 'fixa', posicao: [0, 1.25, 6.4], alvo: [0, 1, 0], fov: 32}}
      feixe={false}
      disco={false}
      nevoa={false}
      ambiente={[]}
    >
      {children}
    </Palco>
    <div
      style={{
        position: 'absolute',
        bottom: 14,
        width: '100%',
        textAlign: 'center',
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: 30,
        color: COR.texto,
      }}
    >
      {nome}
    </div>
  </div>
);

const Grade: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: COR.fundo, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start'}}>
    {children}
  </AbsoluteFill>
);

export const VitrineBonecos: React.FC = () => (
  <Grade>
    {NOMES_POSES.map((pose, i) => (
      <Celula key={pose} nome={pose} altura={480}>
        <Boneco pose={pose} visual={i} semente={pose} />
      </Celula>
    ))}
  </Grade>
);

export const VitrineObjetos: React.FC = () => (
  <Grade>
    <Celula nome="Globo" altura={480}>
      <Globo posicao={[0, 1, 0]} raio={0.85} />
    </Celula>
    <Celula nome="Sol" altura={480}>
      <Sol posicao={[0, 1, 0]} raio={0.55} />
    </Celula>
    <Celula nome="Planeta" altura={480}>
      <Planeta posicao={[0, 1, 0]} raio={0.6} anel="#d9c19a" />
    </Celula>
    <Celula nome="Planeta manchas" altura={480}>
      <Planeta posicao={[0, 1, 0]} raio={0.75} estilo="manchas" cor="#9aa0ad" corSecundaria="#cfd3dc" />
    </Celula>
    <Celula nome="Nuvem" altura={480}>
      <Nuvem posicao={[0, 1.1, 0]} escala={0.9} />
    </Celula>
    <Celula nome="Arvore" altura={480}>
      <Arvore posicao={[-0.5, 0, 0]} />
      <Arvore posicao={[0.55, 0, -0.3]} tipo="redonda" />
    </Celula>
    <Celula nome="Seta" altura={480}>
      <Seta de={[-0.9, 0.4, 0]} para={[0.9, 1.6, 0]} />
    </Celula>
    <Celula nome="Feixe" altura={480}>
      <Feixe de={[-1, 1.6, 0]} para={[1, 0.4, 0]} pulsos={3} />
    </Celula>
    <Celula nome="Onda" altura={480}>
      <Onda posicao={[-1.1, 1, 0]} comprimento={2.2} comprimentoDeOnda={0.55} />
    </Celula>
    <Celula nome="Particulas" altura={480}>
      <Particulas posicao={[0, 1, 0]} area={[2, 1.6, 1]} cores={[COR.ciano, COR.rosa, COR.branco]} brilhar />
    </Celula>
    <Celula nome="Pedestal + ?" altura={480}>
      <Pedestal raio={0.6}>
        <Animado girar={0.8}>
          <Interrogacao escala={0.85} />
        </Animado>
      </Pedestal>
    </Celula>
    <Celula nome="Prisma" altura={480}>
      <Prisma posicao={[0, 1, 0]} />
    </Celula>
  </Grade>
);

// kit-objetos-2 tem 15 células: 5 fileiras de 384 px.
const ALTURA_2 = 384;

// Arroba sendo escrita (desenho 0 → 1 no primeiro segundo) e depois inteira, acendendo.
const ArrobaDaVitrine: React.FC = () => {
  const frame = useCurrentFrame();
  const t = Math.min(1, frame / 30);
  return (
    <Animado posicao={[0, 1.05, 0]} girar={0.35}>
      <Arroba desenho={t * t * (3 - 2 * t)} brilho={0.2 + 0.4 * Math.min(1, Math.max(0, (frame - 30) / 20))} espessura={0.09} escala={1.15} />
    </Animado>
  );
};

export const VitrineObjetos2: React.FC = () => (
  <Grade>
    <Celula nome="Molecula N2" altura={ALTURA_2}>
      <Animado posicao={[0, 1, 0]} girar={0.8} escala={2.2}>
        <Molecula formula="N2" />
      </Animado>
    </Celula>
    <Celula nome="Molecula H2O" altura={ALTURA_2}>
      <Animado posicao={[0, 1, 0]} girar={0.8} escala={2.2}>
        <Molecula formula="H2O" />
      </Animado>
    </Celula>
    <Celula nome="Olho" altura={ALTURA_2}>
      <Olho posicao={[0, 1.05, 0]} escala={1.3} />
    </Celula>
    <Celula nome="Lampada" altura={ALTURA_2}>
      <Lampada posicao={[0, 0.4, 0]} escala={1.1} />
    </Celula>
    <Celula nome="Lupa" altura={ALTURA_2}>
      <Lupa posicao={[-0.1, 1.15, 0]} escala={1.2} />
    </Celula>
    <Celula nome="Livro" altura={ALTURA_2}>
      <Livro posicao={[-0.45, 0, 0.3]} rotacao={[0, 0.5, 0]} />
      <Livro posicao={[0.5, 0.4, 0]} rotacao={[0.5, 0, 0]} aberto cor="#3b82ff" />
    </Celula>
    <Celula nome="ArcoIris" altura={ALTURA_2}>
      <ArcoIris posicao={[0, 0.2, 0]} raio={1.1} espessura={0.08} />
    </Celula>
    <Celula nome="Montanha" altura={ALTURA_2}>
      <Montanha posicao={[0, 0, -0.5]} />
    </Celula>
    <Celula nome="Casa" altura={ALTURA_2}>
      <Casa posicao={[0, 0, 0]} rotacao={[0, -0.5, 0]} />
    </Celula>
    <Celula nome="Predio" altura={ALTURA_2}>
      <Predio posicao={[-0.5, 0, -0.4]} andares={7} />
      <Predio posicao={[0.5, 0, 0]} andares={4} cor="#3a3150" semente="b" />
    </Celula>
    <Celula nome="Foguete" altura={ALTURA_2}>
      <Foguete posicao={[0, 0.5, 0]} />
    </Celula>
    <Celula nome="Rover" altura={ALTURA_2}>
      <Rover posicao={[0, 0, 0]} rotacao={[0, -0.6, 0]} escala={1.3} andando />
    </Celula>
    <Celula nome="Arroba" altura={ALTURA_2}>
      <ArrobaDaVitrine />
    </Celula>
    <Celula nome="Geladeira" altura={ALTURA_2}>
      <Geladeira posicao={[0, 0.05, 0]} rotacao={[0, -0.45, 0]} escala={0.95} />
    </Celula>
    <Celula nome="BolaFutebol" altura={ALTURA_2}>
      <BolaFutebol posicao={[0, 0.9, 0]} escala={2.2} girando={2.2} />
      <Gol posicao={[0, 0, -1.2]} escala={0.55} />
    </Celula>
  </Grade>
);
