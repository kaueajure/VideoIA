// Amostra do estilo do canal: a mesma cena (palco, personagem, título, etiqueta, legenda,
// assinatura e barra) e a mesma capa, desenhadas com o estilo escolhido em src/config.ts.
// `npm run estilo` renderiza esta amostra; `-- --todos` compara os 4 estilos.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Boneco} from '../kit/bonecos/Boneco';
import {FONTE} from '../kit/fontes';
import {Globo, Sol} from '../kit/objetos/espaco';
import {Pedestal} from '../kit/objetos/simbolos';
import {Palco} from '../kit/palco/Palco';
import {COR, ESTILO} from '../kit/tema';
import {Legenda} from '../kit/tela/Legenda';
import {BarraProgresso, Marca, Vinheta} from '../kit/tela/moldura';
import {Rotulo, Titulo} from '../kit/tela/textos';
import {SobreposicaoCapa} from '../video/Capa';
import type {PaginaLegenda} from '../video/legendas';

export type PropsAmostra = {
  modo: 'cena' | 'capa';
  // Escreve o nome do estilo no rodapé (para as folhas de comparação).
  rotulo: boolean;
};

// Página de legenda fixa com a última palavra acesa.
const LEGENDA_AMOSTRA: PaginaLegenda[] = [
  {
    inicio: 0,
    fim: 100000,
    palavras: ['A', 'LUZ', 'DO', 'SOL'].map((texto) => ({texto, inicio: 0, fim: 100000})),
  },
];

const Cena3D: React.FC = () => (
  <Palco camera={{tipo: 'fixa', posicao: [0, 2.0, 10.5], alvo: [0, 0.75, 0], tremor: 0}} alvoDaLuz={[0, 0.6, 0]}>
    <Sol posicao={[1.3, 2.45, -2.6]} raio={0.42} />
    <Pedestal posicao={[0.75, 0, -0.1]} raio={0.62} altura={0.55} cor={COR.destaque}>
      <Globo posicao={[0, 0.72, 0]} raio={0.62} />
    </Pedestal>
    <Boneco posicao={[-0.95, 0, 0.55]} giro={28} pose="apontando" visual={0} />
  </Palco>
);

export const AmostraEstilo: React.FC<PropsAmostra> = ({modo, rotulo}) => (
  <AbsoluteFill style={{backgroundColor: COR.fundo}}>
    <Cena3D />
    {modo === 'capa' ? (
      <SobreposicaoCapa titulo="Por que o céu é azul?" destaque="azul" />
    ) : (
      <>
        <Vinheta />
        <Titulo texto="Por que o céu é azul?" destaque="azul" y={330} tamanho={92} />
        <Rotulo texto="luz do Sol" x={520} y={545} />
        <Legenda paginas={LEGENDA_AMOSTRA} />
        <Marca />
        <BarraProgresso />
      </>
    )}
    {rotulo ? (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 70,
          textAlign: 'center',
          fontFamily: FONTE,
          fontWeight: 900,
          fontSize: 54,
          letterSpacing: 6,
          color: COR.texto,
          textTransform: 'uppercase',
        }}
      >
        {ESTILO.nome}
      </div>
    ) : null}
  </AbsoluteFill>
);
