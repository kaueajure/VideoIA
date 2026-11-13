// Telas auxiliares: cena ainda não programada, erros e o painel de prévia.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONTE} from '../kit/fontes';
import {COR} from '../kit/tema';
import type {CenaNoTempo, LinhaDoTempo} from './linhaDoTempo';

const caixa: React.CSSProperties = {
  fontFamily: FONTE,
  // Painéis de trabalho: sempre claros sobre escuro, qualquer que seja o estilo do canal.
  color: '#ffffff',
  background: 'rgba(10, 14, 26, 0.88)',
  border: '2px solid rgba(255,255,255,0.15)',
  borderRadius: 24,
  padding: '36px 44px',
};

// Aparece quando video.json tem uma cena que cenas.tsx ainda não implementou.
export const CenaFaltando: React.FC<{cena: CenaNoTempo}> = ({cena}) => (
  <AbsoluteFill style={{backgroundColor: '#1a0f14', justifyContent: 'center', alignItems: 'center', padding: 80}}>
    <div style={{...caixa, borderColor: COR.rosa, maxWidth: 900}}>
      <div style={{fontSize: 34, fontWeight: 800, color: COR.rosa, letterSpacing: 4}}>CENA SEM CÓDIGO</div>
      <div style={{fontSize: 64, fontWeight: 900, margin: '12px 0 24px'}}>{cena.id}</div>
      <div style={{fontSize: 34, fontWeight: 600, color: '#c9d1e6', lineHeight: 1.35}}>
        {cena.visual || 'Adicione esta cena em cenas.tsx.'}
      </div>
    </div>
  </AbsoluteFill>
);

export const TelaDeErro: React.FC<{titulo: string; erros: string[]}> = ({titulo, erros}) => (
  <AbsoluteFill style={{backgroundColor: '#14080c', padding: 70, justifyContent: 'center'}}>
    <div style={{...caixa, borderColor: COR.vermelho}}>
      <div style={{fontSize: 40, fontWeight: 900, color: COR.vermelho, marginBottom: 24}}>{titulo}</div>
      {erros.map((e, i) => (
        <div key={i} style={{fontSize: 30, fontWeight: 600, lineHeight: 1.4, marginBottom: 12, wordBreak: 'break-word'}}>
          {e}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

const ROTULO_NARRACAO: Record<CenaNoTempo['narracao'], string> = {
  gerada: 'voz ok',
  estimada: 'SEM VOZ (tempos estimados)',
  desatualizada: 'VOZ DESATUALIZADA',
  'sem-fala': 'sem fala',
};

// Faixa de informações nas prévias (npm run previa): cena, quadro, tempo e estado da voz.
export const PainelPrevia: React.FC<{linha: LinhaDoTempo}> = ({linha}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cena = linha.cenas.find((c) => frame >= c.inicio && frame < c.inicio + c.duracao) ?? linha.cenas[linha.cenas.length - 1];
  const local = frame - cena.inicio;
  const alerta = cena.narracao === 'estimada' || cena.narracao === 'desatualizada';
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 24,
          ...caixa,
          padding: '18px 26px',
          fontSize: 38,
          fontWeight: 800,
          lineHeight: 1.3,
        }}
      >
        <div>
          {cena.indice + 1}/{linha.cenas.length} · {cena.id}
        </div>
        <div style={{fontWeight: 600, fontSize: 32, color: '#c9d1e6'}}>
          {(frame / fps).toFixed(2)}s · quadro {local}/{cena.duracao} ·{' '}
          <span style={{color: alerta ? COR.rosa : COR.verde}}>{ROTULO_NARRACAO[cena.narracao]}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
