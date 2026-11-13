// Vitrine da Biblioteca 3D Pro: uma composição por categoria (pasta "pro" no Studio).
// Confira com: npm run previa -- pro-<categoria>
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONTE} from '../kit/fontes';
import {Palco} from '../kit/palco/Palco';
import {
  VITRINE_ANIMAIS,
  VITRINE_BRASIL,
  VITRINE_COMIDA,
  VITRINE_CORPO,
  VITRINE_HISTORIA,
  VITRINE_NATUREZA,
  VITRINE_OCEANO,
  VITRINE_TECNOLOGIA,
  type ItemVitrine,
} from '../kit/pro';
import {COR} from '../kit/tema';

export const CATEGORIAS_PRO: Record<string, ItemVitrine[]> = {
  animais: VITRINE_ANIMAIS,
  oceano: VITRINE_OCEANO,
  corpo: VITRINE_CORPO,
  natureza: VITRINE_NATUREZA,
  historia: VITRINE_HISTORIA,
  tecnologia: VITRINE_TECNOLOGIA,
  comida: VITRINE_COMIDA,
  brasil: VITRINE_BRASIL,
};

const LARGURA = 360;
const ALTURA = 480;

export const VitrinePro: React.FC<{categoria: string}> = ({categoria}) => {
  const itens = CATEGORIAS_PRO[categoria] ?? [];
  return (
    <AbsoluteFill style={{backgroundColor: COR.fundo, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start'}}>
      {itens.map(({nome, componente: Componente}) => (
        <div key={nome} style={{width: LARGURA, height: ALTURA, position: 'relative', overflow: 'hidden'}}>
          <Palco
            largura={LARGURA}
            altura={ALTURA}
            camera={{tipo: 'fixa', posicao: [0, 1.25, 6.4], alvo: [0, 1, 0], fov: 32, tremor: 0}}
            feixe={false}
            disco={false}
            nevoa={false}
          >
            <Componente />
          </Palco>
          <div style={{position: 'absolute', bottom: 14, width: '100%', textAlign: 'center', fontFamily: FONTE, fontWeight: 800, fontSize: 30, color: COR.texto}}>
            {nome}
          </div>
        </div>
      ))}
      {itens.length === 0 ? (
        <div style={{margin: 80, fontFamily: FONTE, fontSize: 44, color: COR.textoSuave}}>Biblioteca Pro: categoria “{categoria}” vazia.</div>
      ) : null}
    </AbsoluteFill>
  );
};
