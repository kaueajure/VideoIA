import React, {createContext, useContext, useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import type {CenaNoTempo, LinhaDoTempo} from './linhaDoTempo';
import {acharTrecho} from './palavras';

export const ContextoCena = createContext<CenaNoTempo | null>(null);
// A linha do tempo do vídeo inteiro (para o "mundo contínuo" atravessar cenas).
export const ContextoLinha = createContext<LinhaDoTempo | null>(null);

// true quando a cena está sendo desenhada como fundo da capa (o <Titulo> da cena se esconde).
export const ContextoCapa = createContext(false);
export const useNaCapa = () => useContext(ContextoCapa);

// true quando a cena vira imagem do carrossel, da capa do YouTube ou do story (Estúdio Pro, `npm run carrossel`):
// rótulos, pílulas, números, títulos e textos 2D da cena somem — a peça tem o texto dela e, atrás do degradê,
// eles ficavam apagados. As peças 2D do kit já respeitam; 2D próprio da cena pode fazer o mesmo:
//   const noCarrossel = useNoCarrossel();  ...  {noCarrossel ? null : <MeuRotulo />}
export const ContextoCarrossel = createContext(false);
export const useNoCarrossel = () => useContext(ContextoCarrossel);

// true na capa ou no carrossel: o que é só 2D por cima da cena (vinhetas, HUD, cartões) some nos dois.
export const useSem2D = () => {
  const naCapa = useContext(ContextoCapa);
  const noCarrossel = useContext(ContextoCarrossel);
  return naCapa || noCarrossel;
};

// `linha` = o vídeo inteiro (para o useMundo). Sem ela (vitrines), o "mundo" é só esta cena.
export const ProvedorCena: React.FC<{cena: CenaNoTempo; linha?: LinhaDoTempo; children: React.ReactNode}> = ({cena, linha, children}) => {
  const doMundo = useMemo<LinhaDoTempo>(
    () => linha ?? {cenas: [cena], duracao: cena.inicio + cena.duracao, narracaoCompleta: true},
    [cena, linha],
  );
  return (
    <ContextoLinha.Provider value={doMundo}>
      <ContextoCena.Provider value={cena}>{children}</ContextoCena.Provider>
    </ContextoLinha.Provider>
  );
};

export type InfoCena = CenaNoTempo & {
  // Quadro (relativo à cena) em que o narrador COMEÇA a dizer o trecho.
  quando: (trecho: string, ocorrencia?: number) => number;
  // Quadro (relativo à cena) em que o narrador TERMINA de dizer o trecho.
  quandoTermina: (trecho: string, ocorrencia?: number) => number;
};

const erroTrecho = (cena: CenaNoTempo, trecho: string, ocorrencia: number) =>
  new Error(
    `Trecho "${trecho}" (ocorrência ${ocorrencia}) não aparece na narração da cena "${cena.id}". ` +
      `Palavras da cena: ${cena.palavras.map((p) => p.texto).join(' ') || '(nenhuma)'}`,
  );

// Mundo contínuo: o mesmo cenário em várias cenas seguidas, sem reiniciar a cada corte (céu que
// anoitece, água que sobe, câmera que segue andando). Tudo em quadros do VÍDEO INTEIRO:
//   const {quadro, quando} = useMundo();
//   const nivel = interpolate(quadro, [quando('chuva', 'começa'), quando('fim', 'cobre')], [0, 3]);
// Funciona dentro e fora do <Palco>.
export const useMundo = () => {
  const cena = useContext(ContextoCena);
  const linha = useContext(ContextoLinha);
  const frame = useCurrentFrame();
  if (!cena || !linha) {
    throw new Error('useMundo() só funciona dentro de uma cena de vídeo (videos/<slug>/cenas.tsx).');
  }
  const acharCena = (id: string) => {
    const achada = linha.cenas.find((c) => c.id === id);
    if (!achada) {
      throw new Error(`useMundo: não existe a cena "${id}". Cenas: ${linha.cenas.map((c) => c.id).join(', ')}`);
    }
    return achada;
  };
  return {
    // Quadro atual contado do começo do vídeo.
    quadro: cena.inicio + frame,
    duracaoDoVideo: linha.duracao,
    // Quadro (do vídeo) em que a cena começa.
    inicioDa: (idCena: string) => acharCena(idCena).inicio,
    // Quadro (do vídeo) em que o narrador começa a dizer o trecho na cena indicada.
    quando: (idCena: string, trecho: string, ocorrencia = 1) => {
      const alvo = acharCena(idCena);
      const achado = acharTrecho(alvo.palavras, trecho, ocorrencia);
      if (!achado) {
        throw erroTrecho(alvo, trecho, ocorrencia);
      }
      return alvo.inicio + achado.primeira.inicio;
    },
  };
};

// Dados da cena atual: duração, palavras e sincronia com a fala.
// Funciona dentro e fora do <Palco> (o Palco repassa o contexto para o 3D).
export const useCena = (): InfoCena => {
  const cena = useContext(ContextoCena);
  if (!cena) {
    throw new Error('useCena() só funciona dentro de uma cena de vídeo (videos/<slug>/cenas.tsx).');
  }
  return useMemo(
    () => ({
      ...cena,
      quando: (trecho, ocorrencia = 1) => {
        const achado = acharTrecho(cena.palavras, trecho, ocorrencia);
        if (!achado) {
          throw erroTrecho(cena, trecho, ocorrencia);
        }
        return achado.primeira.inicio;
      },
      quandoTermina: (trecho, ocorrencia = 1) => {
        const achado = acharTrecho(cena.palavras, trecho, ocorrencia);
        if (!achado) {
          throw erroTrecho(cena, trecho, ocorrencia);
        }
        return achado.ultima.fim;
      },
    }),
    [cena],
  );
};
