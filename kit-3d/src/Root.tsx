import React from 'react';
import {Composition, Folder} from 'remotion';
import {FORMATO} from './config';
import {ComposicoesCarrossel} from './pro/carrossel';
import {Capa, momentoDaCapa} from './video/Capa';
import {VIDEOS} from './video/indice';
import {linhaDoRegistro, VideoCuriosidade} from './video/VideoCuriosidade';
import {AmostraEstilo} from './vitrine/AmostraEstilo';
import {CATEGORIAS_PRO, VitrinePro} from './vitrine/VitrinePro';
import {LISTAS_DE_CENAS, trechosDaVitrine, VitrineCenas, type ListaDeCenas} from './vitrine/VitrineCenas';
import {VitrineBonecos, VitrineObjetos, VitrineObjetos2} from './vitrine/Vitrine';

// Cada pasta em videos/<slug>/ vira duas composições: "<slug>" (o vídeo) e "<slug>-capa".
export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((registro) => {
      const linha = linhaDoRegistro(registro, FORMATO.fps);
      // A capa precisa durar até o quadro congelado (ver Capa.tsx); todo quadro mostra a mesma imagem.
      const quadroCapa = registro.video && linha ? momentoDaCapa(registro.video, linha).quadro : 0;
      return (
        <Folder key={registro.slug} name={registro.slug}>
          <Composition
            id={registro.slug}
            component={VideoCuriosidade}
            durationInFrames={linha?.duracao ?? FORMATO.fps * 3}
            fps={FORMATO.fps}
            width={FORMATO.largura}
            height={FORMATO.altura}
            defaultProps={{slug: registro.slug, previa: false, areaSegura: false}}
          />
          <Composition
            id={`${registro.slug}-capa`}
            component={Capa}
            durationInFrames={quadroCapa + 1}
            fps={FORMATO.fps}
            width={FORMATO.largura}
            height={FORMATO.altura}
            defaultProps={{slug: registro.slug}}
          />
        </Folder>
      );
    })}
    <ComposicoesCarrossel />
    <Folder name="estilo">
      <Composition
        id="estilo-amostra"
        component={AmostraEstilo}
        durationInFrames={60}
        fps={FORMATO.fps}
        width={FORMATO.largura}
        height={FORMATO.altura}
        defaultProps={{modo: 'cena' as const, rotulo: false}}
      />
      <Composition
        id="estilo-capa"
        component={AmostraEstilo}
        durationInFrames={60}
        fps={FORMATO.fps}
        width={FORMATO.largura}
        height={FORMATO.altura}
        defaultProps={{modo: 'capa' as const, rotulo: false}}
      />
    </Folder>
    <Folder name="pro">
      {Object.keys(CATEGORIAS_PRO).map((categoria) => (
        <Composition
          key={categoria}
          id={`pro-${categoria}`}
          component={VitrinePro}
          durationInFrames={FORMATO.fps * 4}
          fps={FORMATO.fps}
          width={FORMATO.largura}
          height={FORMATO.altura}
          defaultProps={{categoria}}
        />
      ))}
      {/* Cenas prontas e vinhetas: os exemplos em sequência (npm run previa -- pro-cenas --momentos 0.5). */}
      {(Object.keys(LISTAS_DE_CENAS) as ListaDeCenas[]).map((lista) => {
        const trechos = trechosDaVitrine(LISTAS_DE_CENAS[lista]);
        const total = trechos.reduce((soma, t) => soma + t.duracao, 0);
        return (
          <Composition
            key={lista}
            id={`pro-${lista}`}
            component={VitrineCenas}
            durationInFrames={Math.max(FORMATO.fps * 4, total)}
            fps={FORMATO.fps}
            width={FORMATO.largura}
            height={FORMATO.altura}
            defaultProps={{lista, trechos}}
          />
        );
      })}
    </Folder>
    <Folder name="kit">
      <Composition
        id="kit-bonecos"
        component={VitrineBonecos}
        durationInFrames={FORMATO.fps * 4}
        fps={FORMATO.fps}
        width={FORMATO.largura}
        height={FORMATO.altura}
      />
      <Composition
        id="kit-objetos"
        component={VitrineObjetos}
        durationInFrames={FORMATO.fps * 4}
        fps={FORMATO.fps}
        width={FORMATO.largura}
        height={FORMATO.altura}
      />
      <Composition
        id="kit-objetos-2"
        component={VitrineObjetos2}
        durationInFrames={FORMATO.fps * 4}
        fps={FORMATO.fps}
        width={FORMATO.largura}
        height={FORMATO.altura}
      />
    </Folder>
  </>
);
