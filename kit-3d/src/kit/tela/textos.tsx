// Elementos 2D por cima do 3D: títulos, rótulos e números. Posições em px (vídeo 1080x1920).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useNaCapa, useNoCarrossel} from '../../video/contexto';
import {normalizarPalavra} from '../../video/palavras';
import {entrar, sair} from '../animacao';
import {FONTE} from '../fontes';
import {AREA_SEGURA, COR, ESTILO} from '../tema';
import {estiloTextoForte} from './Legenda';

type PropsTempo = {
  // Quadro (relativo à cena) em que aparece.
  entrada?: number;
  // Quadro em que começa a sumir.
  saida?: number;
};

const useVisibilidade = ({entrada = 0, saida}: PropsTempo) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {
    frame,
    fps,
    fator: entrar(frame, fps, entrada) * (saida === undefined ? 1 : sair(frame, saida, 8)),
  };
};

export type PropsTitulo = PropsTempo & {
  texto: string;
  // Palavras pintadas com a cor de destaque (ex.: "azul" ou "céu azul").
  destaque?: string;
  // Centro vertical em px. Padrão: logo abaixo da área segura do topo.
  y?: number;
  tamanho?: number;
  cor?: string;
  corDestaque?: string;
  largura?: number;
};

// Título grande; as palavras entram uma a uma. Some na capa (a capa tem título próprio) e no carrossel.
export const Titulo: React.FC<PropsTitulo> = ({
  texto,
  destaque,
  entrada = 0,
  saida,
  y = AREA_SEGURA.topo + 190,
  tamanho = 96,
  cor = COR.texto,
  corDestaque = COR.destaque,
  largura = 900,
}) => {
  const {frame, fps} = useVisibilidade({entrada, saida});
  const naCapa = useNaCapa();
  const noCarrossel = useNoCarrossel();
  const destaques = new Set((destaque ?? '').split(/\s+/).map(normalizarPalavra).filter(Boolean));
  const palavras = texto.split(/\s+/).filter(Boolean);
  const fatorSaida = saida === undefined ? 1 : sair(frame, saida, 8);
  if (naCapa || noCarrossel || frame < entrada || fatorSaida <= 0) {
    return null;
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: y,
          width: largura,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: tamanho * 0.28,
          textTransform: 'uppercase',
          textAlign: 'center',
          opacity: fatorSaida,
        }}
      >
        {palavras.map((palavra, i) => {
          const k = entrar(frame, fps, entrada + i * 2.5, {damping: 14, stiffness: 180});
          return (
            <span
              key={i}
              style={{
                ...estiloTextoForte(tamanho, destaques.has(normalizarPalavra(palavra)) ? corDestaque : cor, 16),
                display: 'inline-block',
                opacity: Math.min(1, k * 2),
                transform: `translateY(${(1 - k) * 50}px) scale(${0.7 + 0.3 * k})`,
              }}
            >
              {palavra}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export type PropsRotulo = PropsTempo & {
  texto: string;
  // Centro do rótulo, em px.
  x: number;
  y: number;
  cor?: string;
  corTexto?: string;
  tamanho?: number;
  // Tudo em maiúsculas (padrão). false para e-mails, @perfis e endereços ("fulano@email.com").
  maiusculas?: boolean;
};

// Etiqueta em formato de pílula ("ondas curtas", "5x mais"...). Some no carrossel (a lâmina tem texto próprio).
export const Rotulo: React.FC<PropsRotulo> = ({
  texto,
  x,
  y,
  entrada = 0,
  saida,
  cor = COR.destaque,
  corTexto = ESTILO.textoNoDestaque,
  tamanho = 46,
  maiusculas = true,
}) => {
  const {frame, fator} = useVisibilidade({entrada, saida});
  const noCarrossel = useNoCarrossel();
  if (noCarrossel || frame < entrada || fator <= 0.001) {
    return null;
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${fator})`,
        background: cor,
        color: corTexto,
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: tamanho,
        padding: `${tamanho * 0.28}px ${tamanho * 0.6}px`,
        borderRadius: tamanho,
        whiteSpace: 'nowrap',
        textTransform: maiusculas ? 'uppercase' : 'none',
        boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
        pointerEvents: 'none',
      }}
    >
      {texto}
    </div>
  );
};

export type PropsNumero = PropsTempo & {
  ate: number;
  de?: number;
  // Quadros que a contagem leva.
  duracao?: number;
  // Quadros que cada valor fica na tela enquanto conta (padrão 3). Número trocando a cada quadro pisca
  // (o detector de flicker acusa); o valor final é sempre `ate`, no quadro entrada + duracao.
  passo?: number;
  casas?: number;
  prefixo?: string;
  sufixo?: string;
  x?: number;
  y?: number;
  tamanho?: number;
  cor?: string;
};

// Número grande que conta até o valor (formato brasileiro: 1.000,5), em degraus de `passo` quadros. Some no carrossel.
//   <Numero ate={7200} entrada={quando('sete')} duracao={40} sufixo=" L" />
export const Numero: React.FC<PropsNumero> = ({
  ate,
  de = 0,
  entrada = 0,
  saida,
  duracao = 30,
  passo = 3,
  casas = 0,
  prefixo = '',
  sufixo = '',
  x = 540,
  y = 760,
  tamanho = 190,
  cor = COR.destaque,
}) => {
  const {frame, fator} = useVisibilidade({entrada, saida});
  const noCarrossel = useNoCarrossel();
  if (noCarrossel || frame < entrada || fator <= 0.001) {
    return null;
  }
  // Degraus: o valor só muda a cada `passo` quadros; no fim da contagem, o valor exato.
  const fim = entrada + Math.max(1, duracao);
  const degrau = Math.max(1, Math.round(passo));
  const quadro = frame >= fim ? fim : entrada + Math.floor((frame - entrada) / degrau) * degrau;
  const valor = interpolate(quadro, [entrada, fim], [de, ate], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const texto = valor.toLocaleString('pt-BR', {minimumFractionDigits: casas, maximumFractionDigits: casas});
  return (
    <div
      style={{
        ...estiloTextoForte(tamanho, cor, 18),
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${fator})`,
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
        pointerEvents: 'none',
      }}
    >
      {prefixo}
      {texto}
      {sufixo}
    </div>
  );
};
