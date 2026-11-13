// Vitrine das Cenas Prontas e das Vinhetas do Estúdio Pro (pasta "pro" no Studio): cada exemplo
// roda pelos quadros dele, um depois do outro, como se fossem as cenas de um vídeo.
//   npm run previa -- pro-cenas --momentos 0.3,0.9        (um quadro de cada cena em cada momento)
//   npm run previa -- pro-cenas --cena comparacao --estilo papel
//   npm run previa -- pro-vinhetas --momentos 0.5
//   npm run previa -- pro-simulacao --momentos 0.2,0.6,0.95   (HUD, salto de tempo, contagem, lente, cartão final)
//   npm run previa -- pro-mundo --momentos 0.1,0.9   (cidade da varanda, céu com hora, multidão, cartões-postais)
// No kit inicial as listas vêm vazias e a vitrine só mostra um aviso.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {FONTE} from '../kit/fontes';
import {VITRINE_CENAS, VITRINE_MUNDO, VITRINE_SIMULACAO, VITRINE_VINHETAS, type ItemVitrine} from '../kit/pro';
import {COR} from '../kit/tema';
import {ProvedorCena} from '../video/contexto';
import type {CenaNoTempo} from '../video/linhaDoTempo';

export type ListaDeCenas = 'cenas' | 'vinhetas' | 'simulacao' | 'mundo';

// Trecho da composição ocupado por um exemplo (o `npm run previa` usa para achar os quadros).
export type TrechoVitrine = {nome: string; inicio: number; duracao: number};

export const LISTAS_DE_CENAS: Record<ListaDeCenas, ItemVitrine[]> = {
  cenas: VITRINE_CENAS,
  vinhetas: VITRINE_VINHETAS,
  simulacao: VITRINE_SIMULACAO,
  mundo: VITRINE_MUNDO,
};

const DURACAO_PADRAO = 150;

// "CenaComparacao" -> "comparacao"; "VinhetaFim" -> "fim" (o id usado em --cena).
export const idDoExemplo = (nome: string) =>
  nome
    .replace(/^(Cena|Vinheta)/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

export const trechosDaVitrine = (itens: ItemVitrine[]): TrechoVitrine[] => {
  let inicio = 0;
  return itens.map((item) => {
    const duracao = Math.max(1, Math.round(item.duracao ?? DURACAO_PADRAO));
    const trecho = {nome: idDoExemplo(item.nome), inicio, duracao};
    inicio += duracao;
    return trecho;
  });
};

// Cena "de mentira" para o exemplo: dá a duração ao Palco (câmera) e ao useCena().
const cenaDoExemplo = (trecho: TrechoVitrine, indice: number): CenaNoTempo => ({
  id: trecho.nome,
  indice,
  inicio: trecho.inicio,
  duracao: trecho.duracao,
  fimDaFala: 0,
  audio: null,
  palavras: [],
  narracao: 'sem-fala',
  transicao: 'corte',
  visual: '',
});

export const VitrineCenas: React.FC<{lista: ListaDeCenas; trechos: TrechoVitrine[]}> = ({lista, trechos}) => {
  const itens = LISTAS_DE_CENAS[lista] ?? [];
  if (itens.length === 0) {
    return (
      <AbsoluteFill style={{backgroundColor: COR.fundo, justifyContent: 'center', alignItems: 'center', padding: 80}}>
        <div style={{fontFamily: FONTE, fontWeight: 800, fontSize: 48, color: COR.textoSuave, textAlign: 'center'}}>
          {lista === 'cenas' ? 'Cenas prontas' : lista === 'simulacao' ? 'Peças de simulação' : lista === 'mundo' ? 'Mundo do POV' : 'Vinhetas'}: vêm no Estúdio Pro.
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{backgroundColor: COR.fundo}}>
      {itens.map(({nome, componente: Componente}, i) => {
        const trecho = trechos[i] ?? trechosDaVitrine(itens)[i];
        return (
          <Sequence key={nome} name={nome} from={trecho.inicio} durationInFrames={trecho.duracao} premountFor={10}>
            <ProvedorCena cena={cenaDoExemplo(trecho, i)}>
              <Componente />
            </ProvedorCena>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
