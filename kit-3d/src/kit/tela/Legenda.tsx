import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {PaginaLegenda} from '../../video/legendas';
import {entrar} from '../animacao';
import {FONTE} from '../fontes';
import {COR, ESTILO, LEGENDA} from '../tema';

export const estiloTextoForte = (
  tamanho: number,
  cor: string = COR.texto,
  contorno: number = LEGENDA.contorno,
): React.CSSProperties => ({
  fontFamily: FONTE,
  fontWeight: 900,
  fontSize: tamanho,
  lineHeight: 1.05,
  color: cor,
  letterSpacing: -1,
  WebkitTextStroke: `${contorno}px ${ESTILO.contornoTexto}`,
  paintOrder: 'stroke fill',
  textShadow: ESTILO.sombraTexto,
});

// Legenda que acende palavra por palavra, sincronizada com a narração.
export const Legenda: React.FC<{paginas: PaginaLegenda[]}> = ({paginas}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  let pagina: PaginaLegenda | null = null;
  for (const p of paginas) {
    if (p.inicio <= frame && frame < p.fim) {
      pagina = p;
    }
  }
  if (!pagina) {
    return null;
  }

  const entrada = entrar(frame, fps, pagina.inicio, {damping: 15, stiffness: 240, mass: 0.45});
  let ativa = -1;
  pagina.palavras.forEach((w, i) => {
    if (w.inicio <= frame) {
      ativa = i;
    }
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: LEGENDA.centroY,
          width: LEGENDA.larguraMaxima,
          transform: `translate(-50%, -50%) scale(${0.84 + 0.16 * entrada})`,
          opacity: Math.min(1, entrada * 2.5),
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: 34,
          textAlign: 'center',
          textTransform: LEGENDA.maiusculas ? 'uppercase' : 'none',
        }}
      >
        {pagina.palavras.map((w, i) => {
          const acesa = i === ativa;
          // Pulo vertical (e não escala) para a palavra acesa não invadir a vizinha.
          const pulo = acesa ? 1 - entrar(frame, fps, w.inicio, {damping: 12, stiffness: 260, mass: 0.4}) : 0;
          return (
            <span
              key={`${w.inicio}-${i}`}
              style={{
                ...estiloTextoForte(LEGENDA.tamanho, acesa ? LEGENDA.corAtiva : COR.texto),
                display: 'inline-block',
                transform: `translateY(${-14 * pulo}px)`,
              }}
            >
              {w.texto}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
