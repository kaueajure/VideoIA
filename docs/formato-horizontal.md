

# Formato horizontal (YouTube, 1920 x 1080)

Todo vídeo tem um **formato**: `vertical` (1080 x 1920, o de sempre: Reels, TikTok, Shorts) ou `horizontal` (1920 x 1080, 30 quadros por segundo: YouTube, aula, apresentação). Este documento é para quem usa o formato (assistente e pessoa) e, na segunda parte, o MANUAL de quem migra um estilo para o horizontal.

## Para quem usa

### Como pedir
- "Faz na horizontal", "para o YouTube", "em 16:9", "paisagem": use o formato horizontal.
- "Converte esse vídeo para horizontal" (ou para vertical): use a conversão (abaixo). Um MP4 sem projeto não se converte: esticar ou cortar deixa faixa preta, corte no que importa ou imagem borrada. O caminho é refazer a partir do roteiro.
- Sem pedido nenhum, o vídeo é vertical, igual ao de sempre.

### Onde se escolhe (do mais fraco ao mais forte)
1. `formatoPadrao` em `ilustrando.config.json` (`"horizontal"`).
2. A linha STATUS do roteiro: `Orientação: horizontal.` (também vale `Formato: horizontal`, `Formato: 16:9`, `Tela: paisagem`, `Plataforma: YouTube`; `Formato: mito x fato` continua sendo o formato do roteiro e é ignorado aqui).
3. O comando: `--formato=horizontal`, `--horizontal` ou `--vertical`.
4. `"formato": "horizontal"` no `cena.json`: vence tudo (a cena escrita à mão fica no formato dela).
Nome que não existe (`--formato=quadrado`) para com a mensagem e a correção, em português.

### Estilos que já funcionam no horizontal
`padrao` (e `editorial`, `minimalista`, `papel`, que são a mesma base), `letreiro`, a família `smooth` (`smooth`, `smooth-estrategia`, `smooth-historia`, `smooth-produto`, `smooth-tipografia`, `smooth-vinheta`); do lote A, `paper-rocket`, `lighthouse-mouse`, `moon-path`, `prickles`, `little-light`, `quadro-antigo`, `antiguidade` e `teologia`; do lote A2, `bible`, `fatos`, `stop-motion` e `pontilhismo`; do lote B, `mindset`, `mindset2`, `mindset3`, `colagem`, `colagem3d`, `cartoes`, `ribalta`, `mundos`, `interface`, `preto-branco`, `pleno` e `impresso`; e, do lote C, `anatomia`, `fino`, `linhas`, `moderno`, `tubo` e `alternativo`; e o `novela` (09/11/2026, o 42º e último: todos os estilos funcionam no horizontal). Os dos lotes foram validados por teste geométrico a seco, sem revisão visual final. Pedir horizontal num estilo que ainda não foi migrado PARA ANTES da narração (nenhum crédito é gasto), em português, com a lista dos que funcionam: escolha um deles ou produza na vertical. Quem migra estilos usa `--forcar-horizontal` para testar. A lista está em `ESTILOS_HORIZONTAL` (`src/video/engine/geo.js`).

### O que muda no horizontal
- **Sem @ por padrão.** O @ do perfil é opcional e vem desligado. Para ligar: `@: sim.` na linha STATUS, `--handle`, `"handle": true` no `cena.json` ou a caixa "Mostrar @" no estúdio web. Ligado, fica no alto da área útil (x 217 a 1702, y 190 a 885), discreto, e o título e a cena descem para abrir espaço; o QA reprova se ele encostar em título, número, legenda, peça ou rótulo. No vertical, o @ também pode ser desligado com `@: não`, `--sem-handle` ou `handle: false` na cena. A opção global `exibirMarca: false` oculta a identificação da página nos vídeos de qualquer orientação.
- **Legenda opcional.** Vem ligada, em 1 linha, dentro da área útil. Para desligar: `Legenda: não.` no STATUS, `--sem-legenda`, `"legenda": false` no `cena.json` ou a caixa "Legenda" no estúdio web. Vale nos dois formatos.
- **Capa e miniatura.** `saida/capa.jpg` (1920 x 1080) e `saida/miniatura.jpg` (1280 x 720, até 2 MB, a medida do YouTube). Não há `capa-grid.jpg` (o recorte 3:4 é do perfil vertical).
- **Margens do YouTube** (guias do estúdio, 1280 x 720 multiplicadas por 1,5): ÁREA ÚTIL x 217 a 1702, y 190 a 885 (texto, título, número, rótulo e legenda); MARGEM DE SEGURANÇA x 108 a 1810, y 82 a 993 (nada importante fora); SANGRIA x 55 a 1864, y 27 a 1050 (fundo e cenário 3D vão até aqui e cobrem o quadro inteiro: nunca há faixa preta).
- Áudio, trilha, efeitos sonoros e voz: iguais ao vertical.

### Conversão entre formatos
```
node src/video/cli.mjs <projeto> --converter=horizontal   [--para=<novo-projeto>] [--handle] [--sem-legenda] [--produzir]
node src/video/cli.mjs <projeto> --converter=vertical
```
Cria o projeto irmão (`<projeto>-horizontal` ou `<projeto>-vertical`), sem tocar no original. Copia o roteiro, as fontes, a narração (mp3, `palavras.json`, o cache pago da ElevenLabs) e a trilha: **nenhum crédito de voz ou de música é gasto e a voz não muda**. Cena automática: as cenas são refeitas para a geometria nova na primeira produção (a mesma fala, o layout pensado para o formato). Cena escrita à mão: os beats e elementos ficam e só os tamanhos em px são reescalados. O irmão guarda `origem.json` com o nome do projeto original: a semente de som (clima da trilha e efeitos) é a do original, então a trilha em cache da ElevenLabs Music vale e o áudio sai igual. O @ desliga ao ir para o horizontal e liga ao voltar para o vertical. A saída lista o que mudou e os avisos. Depois, produza o irmão com a mesma voz: `node src/video/cli.mjs <projeto>-horizontal --voz=<a voz do original>`.

## Para quem migra um estilo (manual)

### Arquitetura em 6 linhas
1. `src/video/engine/geo.js` é a fonte única: `geoDe(formato, { handle })` devolve `{ W, H, util, seguranca, sangria, eixo, arrobaY, zona, fonte, escala, folgaFit, fatorPeca, qa, ... }`. O vertical devolve exatamente os números de antes.
2. O formato é lido **uma vez**, quando o processo ou a página carrega: na página do motor pela URL (`?f=h&hd=0|1`, que o `render.mjs` monta), no Node pelo `globalThis.__ILU_GEO` que o `cli.mjs` fixa antes de carregar o motor. Por isso `W`, `H`, `ZONA`, `GEO`, `AREA_SEGURA`, `ARROBA_Y`, `EIXO_TEXTO`, `LARGURA_TEXTO` continuam constantes para quem importa e valem o formato do vídeo.
3. Tudo que o estilo desenha em px passa a ler dessas constantes. A cena (`spec`) leva `formato`, `handle` e `legenda`; o QA chama `usarGeoQA(spec)` e lê `QG` (`qa.mjs`).
4. `marca.serie` (o @) chega vazio ao estilo no horizontal sem @: o estilo desenha `''` e nada aparece (confira que o ponto ou o ícone ao lado também some). O nome da página como CONTEÚDO (cartão de seguir, fecho) lê `marca.serieCta`.
5. `legenda: false` esvazia `S.legenda`: estilo que monta a própria legenda a partir das palavras precisa checar `S.spec.legenda === false`.
6. Estilo migrado entra em `ESTILOS_HORIZONTAL` (`geo.js`); a bateria `test/formato-horizontal-estilos.test.mjs` passa a exigir 0 falhas dele.

### Helpers
- `GEO.zona`: `titulo`, `cena`, `cenaLivre` (sem título), `legenda`, `lados`. `GEO.fonte`: `titulo`, `legenda`, `contador`, `rotulo`, `arroba`. `GEO.escala` (0,62): multiplica foto, cartão e número padrão. `GEO.altUtil`, `GEO.qa.*` (limites do QA).
- `area-segura.js`: `AREA_SEGURA`, `areaDe(geo)`, `ARROBA_Y`, `EIXO_TEXTO`, `LARGURA_TEXTO`, `esquerdaUtil()`, `direitaUtil()`, `topoUtil()`, `baseUtil()`, `yNaArea()`, `fonteQueCabe()` já devolvem os valores do formato.
- `estilos-kit.js`: `COLUNA`, `LEGENDA_MARCA_Y`, `legenda()`, `perfil()` já leem o formato (usados por letreiro, interface, colagem).
- No Node (verificadores e planejadores): `geoDaCena(spec)` / `geoNode()`; nunca importe `W`/`H` de `zona.js` para decidir algo do vídeo em análise sem conferir que o processo foi iniciado pelo `cli.mjs`.

### Checklist por estilo
1. Procure os números fixos do estilo (`node scripts/horizontal-plano.mjs --json` lista os arquivos e a contagem). Cada literal de 100 a 2100 é uma posição, tamanho ou limite pensado para 1080 x 1920.
2. Troque por valores do `GEO`/`ZONA`/`COLUNA`. Mantenha o vertical IDÊNTICO: escreva `HZ ? valor_horizontal : valor_vertical` (ou uma tabela `TL` no topo, como em `estilo-letreiro.js`).
3. Recomponha, não estique: título no alto à esquerda ou centrado, protagonista no meio, legenda embaixo; 55 a 70% da altura útil (695 px) para a peça 3D, fotos e cartões ×`GEO.escala`.
4. Fundos, cenários e grão cobrem o quadro inteiro (`W` x `H`, sangria), nunca só a área útil.
5. @ e legenda: respeite `m.serie` vazio e `S.legenda`; o @ ligado usa `ARROBA_Y` e `W / 2`.
6. O verificador do estilo (`estilo-<id>-verificar.mjs`) e o planejador (`autoplano-<id>.mjs`) usam `geoDaCena(spec)`.
7. Rode: vertical idêntico (renderize um vídeo vertical do estilo antes e depois e compare quadro a quadro: PSNR infinito), horizontal com `node src/video/cli.mjs <projeto> --formato=horizontal --voz=mock --rapido --sem-musica` (QA com 0 falhas), folha de contato a 5 quadros por segundo, depois `--handle` e `--sem-legenda`.
8. Acrescente o id em `ESTILOS_HORIZONTAL` e rode `node --test test/formato-horizontal-estilos.test.mjs`.

### Armadilhas
- Constante calculada no topo do módulo com `W`, `H` ou `ZONA`: vale, porque o formato é fixo na carga. Constante guardada em outro processo (cache em disco, JSON) não: inclua o formato na chave.
- Número em px de um comprimento no MUNDO (Smooth, 3D) não é de tela: confira se o teste compara com a tela ou com o mundo.
- `ctx.setTransform`/câmera 2D com pivô fixo (`540, 1000`): use `W / 2` e uma fração de `H`.
- `ffmpeg scale=54:96` e similares do QA: use `dimQA(w, h)` (troca largura e altura).
- Texto ou peça fora do `qa` por causa de órbita ou push-in da câmera: reduza `GEO.folgaFit` do formato, não a peça.
- O estilo de motion 2D tem a própria legenda: confira que ela cabe em 1 linha em `LARGURA_TEXTO` (1484 px no horizontal).

### Como testar
- **Seco (sem Chromium, FFmpeg nem quadros)**: `node scripts/horizontal-seco-lote-b.mjs <estilo> [--formato=horizontal|vertical] [--handle] [--sem-legenda] [--roteiro=<id>] [--emitir-cena] [--cena=<arquivo>]` planeja, valida, compila e roda os verificadores estáticos para 8 roteiros e imprime um JSON com os erros e o digest numérico do layout; `node --test test/formato-horizontal-lote-b-seco.test.mjs` faz isso para os 12 estilos do lote B, compara o vertical com `test/fixtures/horizontal-lote-b-vertical.json` (hash do layout de antes) e testa a conversão ida e volta pelo validador. Estilo novo: acrescente o id na lista do teste e, para o fixture do vertical, gere o digest do commit anterior.
- Vertical sem regressão: render antes e depois (mesmo `cena.json` e `palavras.json`), `ffmpeg -i antes.mp4 -i depois.mp4 -lavfi psnr -f null -`: tem que dar `inf` em todos os quadros.
- Bateria: `node --test test/formato-horizontal-estilos.test.mjs` (`ILU_HORIZONTAL_TODOS=1` roda também os pendentes e só relata).
- Unitários: `node --test test/formato-horizontal-geo.test.mjs test/formato-horizontal-conversao.test.mjs`.
- Plano: `node scripts/horizontal-plano.mjs` (tabela de estilos, números fixos, esforço, status).

### Mundo largo e teste seco (lote A, 0.6.43)
- **Mundo largo:** estilo de canvas 2D que desenha em unidades de projeto ganha no horizontal um mundo maior mostrado a uma escala (feltro: 0,62; ilustração: 0,5625 = 1080 / 1920, o quadro vertical alargado). Formas ficam com o tamanho certo, posições se espalham, faixas de fundo cobrem tudo. Exemplos: `cartoon-feltro-horizontal.js` e o topo de `cartoon-ilustracao.js` (`HZ_CI`, `KS_CI`, `WXC`, `noQuadroCI`). No vertical tudo é identidade.
- **Teste seco (sem render):** `node scripts/horizontal-seco.mjs <estilo> <vertical|horizontal> [--handle] [--sem-legenda]` imprime em JSON o plano, o layout e as caixas de câmera de uma bateria de 8 roteiros; `test/horizontal-lote-a-seco.test.mjs` confere área útil, @, legenda e falha nova, e compara o vertical com o fixture da base (`test/fixtures/seco-<estilo>-vertical.json`, gerado com `ILU_RAIZ=<cópia da base>/studio`). Um estilo novo precisa de `test/seco/<familia>.mjs` com `medir` e `conferir`.

### Estilos de canvas 2D: navegador falso e palco (lote A3, 0.6.43)
- **Navegador falso:** `test/seco/ctx-falso.mjs` instala um `document` cujo contexto 2D só grava (matriz, texto medido, imagens) e deixa o estilo rodar inteiro sem Chromium. O teste confere o texto realmente desenhado na área útil e o fundo na sangria; o hash de todos os comandos de desenho do vertical, gerado com o motor da base, prova que o vertical não mudou. Estilo novo: `test/seco/<estilo>.mjs` com `medir` e `conferir`, como `quadro-antigo.mjs`.
- **Desenho em px de tela** (quadro-antigo, antiguidade): cada número de posição vem de uma tabela `HZ ? horizontal : vertical`, a letra vale 0,84 (`kp`).
- **Palco** (teologia, 25 formas): a forma desenha no quadro nativo vertical e o estilo o leva à área útil com uma transformação; as caixas do QA voltam à tela por `paraTela`. Solução segura, mas deixa a forma numa coluna central: recomponha as formas que importam (lado a lado) e use o palco largo (`frase`) como modelo.
- Modo seco (`ILU_QA_SECO=1`): o QA da cena roda só os verificadores geométricos estáticos, sem navegador, sem render e sem cache. É o que `test/formato-horizontal-lote-c.test.mjs` usa (bateria de roteiros por estilo, `--handle`, `--sem-legenda`, vertical idêntico por fotografia numérica e conversão sem render).
- Smooth: o mundo horizontal vai de x -420 a 1500 (1920 de largura, centro 540) e o palco o mostra a 72%; cada forma é recomposta para a largura (`HZ` em `estilo-smooth-formas.js`); forma assimétrica de propósito (anel e número lado a lado) liga `k.semEixo`.

### Palco virtual do Novela (0.6.45)
- O Novela (cenários em camadas com paralaxe, elenco, câmera com planos, cartões e fecho) é todo calculado num palco de 1080 x 1920. No horizontal o palco é desenhado a **0,6** e centrado no quadro (o eixo 540, 960 vira 960, 540; `engine/estilo-novela-hz.js`): o enquadramento útil do vertical (y 250 a 1700) cai em y 114 a 984, dentro da margem de segurança. O vertical é o mesmo número por número (KH = 1, sem deslocamento): `estilo-novela.js` passa por `base(g)` e `camada()`, que no vertical valem `setTransform(k, 0, 0, k, 0, 0)` e a fórmula de antes.
- Como cobre a largura: o cenário é **espelhado** nas bordas do palco (x 0 e 1080) e os personagens são desenhados uma vez só; luz, névoa e partículas cobrem 3 palcos. O fecho (moldura com o busto) é desenhado num palco 1080 x 1920 à parte (`MP_IDENT`, canvas `-v`) e entra na moldura.
- Texto: legenda de 1 linha no mesmo ponto do vertical (70% da altura), 86 no palco no clássico (52 px na tela; a série fica em 88), largura até 1500 do palco (900 px); selo de lugar e hora e fecho descem para ficar abaixo do @ quando ele está ligado (`HANDLE`, `DY_FECHO`); cartões de texto nascem 1,3x maiores e crescem até 1500 do palco. As caixas para o QA saem em px do quadro (`caixaParaTela`).
- Verificação: `test/formato-horizontal-novela-seco.test.mjs` (8 roteiros, `--handle`, `--sem-legenda`, ida e volta pelo validador, vertical idêntico por hash do plano, da câmera, das caixas e da legenda a 5 qps contra a main). Os verificadores do estilo seguem em coordenadas do palco.
- Limite conhecido, sem revisão visual: o elenco fica na faixa central do quadro (cerca de 650 px de largura) e o cenário espelhado preenche as laterais. Uma composição horizontal de verdade (elenco aproveitando a largura, cenário próprio) é trabalho futuro e precisa de revisão a 5 qps.




