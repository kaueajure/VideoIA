// Cenas de "{{TITULO}}". Uma entrada em `cenas` para cada id do video.json.
// Regras: anime só com o quadro (useCurrentFrame / useCena), 3D dentro do <Palco>,
// textos 2D (Titulo, Rotulo, Numero) fora dele. Veja o CLAUDE.md.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Animado, Boneco, Interrogacao, Palco, progresso, Seta, Titulo, useCena, type Cenas} from '../../src/kit';

const Gancho: React.FC = () => {
  const {duracao} = useCena();
  return (
    <>
      <Palco>
        <Boneco poses={[{quadro: 0, pose: 'olhandoCima'}, {quadro: Math.round(duracao * 0.5), pose: 'pensando'}]} />
        <Animado entrada={8} posicao={[-0.8, 2.3, -0.8]} girar={0.6} flutuar={0.05}>
          <Interrogacao escala={0.9} />
        </Animado>
      </Palco>
      <Titulo texto="{{TITULO}}" entrada={4} />
    </>
  );
};

const Explicacao: React.FC = () => {
  const frame = useCurrentFrame();
  // Sincronize com a fala: const t = useCena().quando('palavra');
  return (
    <Palco camera={{tipo: 'orbita', raio: 7, altura: 1.8, de: -20, ate: 20}}>
      <Boneco pose="explicando" posicao={[-0.7, 0, 0]} />
      <Seta de={[0.2, 1.4, 0]} para={[1.3, 2.2, 0]} progresso={progresso(frame, 10, 30)} />
    </Palco>
  );
};

const Fechamento: React.FC = () => (
  <Palco camera={{tipo: 'mover', de: {posicao: [0, 1.6, 6.5]}, para: {posicao: [0, 1.8, 8.5]}}}>
    <Boneco pose="comemorando" />
  </Palco>
);

export const cenas: Cenas = {
  gancho: Gancho,
  explicacao: Explicacao,
  fechamento: Fechamento,
};
