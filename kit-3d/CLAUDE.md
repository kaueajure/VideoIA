# Vídeos 3D gerados por código

Vídeos verticais de curiosidades do canal definido em `src/config.ts` > `MARCA` (Reels/Shorts/TikTok, 1080×1920, 30 fps) com cenas 3D low-poly programadas em React (Remotion + React Three Fiber), narração do ElevenLabs, legenda que acende palavra por palavra, trilha e efeitos sonoros. Você escreve roteiro e cenas; o usuário aprova. Tudo em português do Brasil. A skill `/video` tem o passo a passo com os pontos de parada.

## Regras que não se negociam

- **Duração entre 1min10s e 2min** (`DURACAO` em `src/config.ts`). Com a voz a 1.15: de ~240 a ~390 palavras faladas (≈1.250–2.000 caracteres); mire ~300 palavras (≈1min30s) em 14–20 cenas. `npm run voz` recusa roteiro claramente fora; `npm run render` recusa o vídeo final fora.
- **A voz só é gerada depois que o usuário aprova o roteiro** (`roteiroAprovado: true`). Voz custa créditos (plano gratuito: 10 mil caracteres/mês).
- **Fatos conferidos.** Pesquise antes de escrever e registre as fontes em `fontes`. Não invente números; arredonde com "cerca de".
- **Elementos com sentido.** Todo objeto em cena ilustra a narração ou o lugar. Proibido enfeite aleatório (formas soltas flutuando, partículas sem significado). E nunca tela vazia: assunto visível desde o quadro 0 e algo novo a cada ~1–1,5 s.
- **Som sem "AI slop".** Nada de áudio gerado por IA. Trilha baixa e efeitos raros, coerentes e no quadro do evento (veja "Som").
- **Post com chamada, sem referências.** `post.txt` = texto + chamada "Mande para quem [público ligado ao tema]" + hashtags.
- **Todo vídeo pronto vai para o Google Drive** (`npm run arquivar`), conferido na nuvem — quando o Drive para computador está instalado (o `status` mostra a linha `drive`; sem ele, o vídeo fica em `videos/<slug>/saida/`).
- **Sem flicker.** Nenhum elemento pode piscar: o `npm run render` confere o MP4 quadro a quadro e avisa `! FLICKER` com cena, segundos e região (à parte: `npm run flicker -- <slug>`). Vídeo com flicker não vai para o ar. Causas já vistas: duas superfícies no mesmo lugar (z-fighting; ex.: a neve das montanhas coincidia com a encosta: afaste uns 2–6% ou 0,01), valor que salta de quadro em quadro (boca falando), objeto que entra e sai no mesmo quadro, objeto de faces chapadas girando rápido (ex.: pião listrado: gire devagar ou use superfície lisa), câmera rápida sobre grade de janelas (prédios).
- **Animação só pelo quadro.** `useCurrentFrame()` / `useCena()`. Proibido: `useFrame` do R3F, `Math.random` (use `random('semente')`), `Date.now`, timers. O `npm run checar` acusa.

## Estilo do canal (`/estilo`)

O visual que é do canal (fundo, chão, luzes, legenda, assinatura, capa) vem de um dos estilos de `src/kit/estilos.ts` (**Noite, Papel, Oceano, Neon**), escolhido em `src/config.ts` > `MARCA` (`estilo`, `destaque`, `assinatura` = nome da série no topo do vídeo). `npm run estilo` mostra a prévia (cena + capa); `-- --todos` compara os 4; `-- --estilo neon --destaque "#ff4d8d"` testa sem salvar. **Se `MARCA.assinatura` ainda for `SEU CANAL`, rode a skill `/estilo` antes do primeiro vídeo.** Nas cenas, use `COR.destaque`/`COR.texto` (seguem o estilo) em vez de copiar cores do canal. **Vídeo de cliente** (ou com visual diferente do canal): `"estilo": {"base": "papel", "destaque": "#2b6cff", "assinatura": "NOME DO CLIENTE"}` no `video.json` — vale só para ele (prévia, render, capa e storyboard); `MARCA` não muda.

## Pipeline: um vídeo = uma pasta `videos/<slug>/`

1. **Pauta** → `npm run novo -- <slug> "Título"` (ou `--roteiro <n>` para partir de um roteiro do banco; `npm run roteiros` lista).
2. **Roteiro** → pesquise e escreva o `video.json`. Mostre o texto, a duração estimada (`npm run status -- <slug>`), a chamada do post e as fontes, e **pare para aprovação**.
3. **Voz** → `npm run voz -- <slug>`. Gera `audio/<cena>.mp3` + `audio/narracao.json` (tempo de cada palavra). Só refaz o que mudou (texto ou configuração de voz; o `status` avisa). `--provedor windows` = rascunho grátis (tempos aproximados).
4. **Cenas** → `videos/<slug>/cenas.tsx` com o kit, sincronizando via `quando('palavra')`, com `<Som>` nos eventos que merecem.
5. **Prévia** → `npm run previa -- <slug> --momentos 0.06` (começos), `0.5`, `0.94`; **leia `saida/previa/folha.png`** cada vez. O script avisa quadro quase vazio. Detalhe com `--cena <id>`.
6. **Render** → `npm run render -- <slug>` → `saida/`: MP4 (áudio masterizado em -14 LUFS), `capa.png`/`.jpg`, `storyboard.png`, `legenda.srt`, `post.txt`. Leia a capa e o post. `--sem-video` refaz só o resto.
7. **Arquivo** → `npm run arquivar -- <slug>`: copia tudo para `<Meu Drive>\<ARQUIVO.pastaNoDrive>\Vídeos\<data> · <título>\` e apaga `saida/` do computador. Se houver o conector do Drive na sessão, confirme na nuvem (`search_files` por `title = '<slug>.mp4'`, compare `fileSize` com `videos/<slug>/arquivo.json`).

`npm run status` diz a etapa de cada vídeo e o próximo passo. `npm run checar` antes de renderizar. Prévia para cliente (sem painel nem faixas): `npm run previa -- <slug> --limpa`.

**Séries:** a “bíblia” de cada série (estrutura do roteiro, trilha, frase final, regras da capa, temas) fica em `series/<nome-da-serie>.md`. Leia antes de cada episódio da série e siga. Séries prontas (índice em `series/LEIA-ME.md`): `mito-ou-verdade`, `e-se`, `por-dentro`, `numeros-absurdos`, `seu-corpo-agora`, `a-origem-de`, com 30 temas cada; o episódio 1 de cada uma começa com `npm run novo -- <slug> --roteiro series/<serie>/episodio-01.json`. “Episódio N da série X” = tema N da tabela da bíblia, pasta `videos/<prefixo>-NN-<tema>/`. Série **`e-se-pov`** (formato simulação: um lugar brasileiro em primeira pessoa, mundo contínuo com `useMundo()`, painel de números, saltos de tempo, sem música; vem do estudo `estudos/2026-10-14-concorrentes-what-if.md`): leia a bíblia antes e use as peças de simulação do Pro.

### Carrossel e capas (Estúdio Pro)

`npm run carrossel -- <slug>` (depois do render, quando o usuário quiser) → `saida/carrossel/`: `01.png…NN.png` (carrossel 1080×1350: capa, uma ideia por lâmina, chamada), `capa-youtube.png` (1920×1080), `story.png` (1080×1920) e `carrossel.txt` (legenda); para conferir, `saida/carrossel-folha.png`. As imagens são as próprias cenas congeladas (sem legenda), no estilo do vídeo; funciona sem voz. Conteúdo: campo `carrossel` do `video.json` — `{"laminas": [{"cena": "<id>", "texto": "...", "momento": 0.6}], "chamada": "Mande para quem ..."}`, com 3 a 8 lâminas do meio (a 1ª é a capa; a última, a chamada). `momento` é opcional (padrão 1 = fim da cena, com tudo o que entrou nas palavras). Texto para **ler**, não a narração: até ~120 caracteres, `*trecho*` na cor de destaque. Sem o campo, o texto sai da narração (o script avisa). Rótulos, pílulas, números e textos 2D da cena não entram nas imagens (`useNoCarrossel()` esconde 2D próprio; `--com-rotulos` mantém). `--automatico` ignora o campo; `--estilo`/`--destaque` testam outro visual. Escrever o carrossel depois do render não pede render novo; o `arquivar` leva a pasta para `01 Publicação/Carrossel/`. Código: `src/pro/carrossel/` e `scripts/carrossel.ts`.

## Escrevendo o roteiro (`video.json`)

- **Gancho na primeira frase** (pergunta ou contradição). **Fecho** que surpreende ou convida a rever.
- **Fecho variado** (pedido do dono do canal): antes de escrever o fim, rode `npm run fechos` (as últimas falas dos vídeos recentes) e escolha um tipo de fecho e uma abertura que não apareçam ali. Tipos: pergunta específica · número final de impacto · volta ao gancho · ironia ou virada seca · convite a testar · gancho para o próximo episódio · frase curta de efeito · fato bônus. "Da próxima vez que…, lembra" e "Hoje (à noite), quando…" estão desgastados: evite.
- **Ritmo da voz constante:** troque o `emocao` poucas vezes (3–4 trocas por vídeo, em blocos de cenas vizinhas), nunca alternando a cada cena; cada troca muda a energia e o passo da voz no corte. O `npm run voz` acelera o vídeo inteiro com o mesmo andamento.
- **Chamada para ação no fim de todo vídeo novo** (pedido do dono do canal): na última fala, uma frase curta pedindo uma ação ligada ao tema — comentar uma resposta específica ("comenta em que andar você mora"), mandar para alguém, curtir e seguir para o próximo episódio — e, na tela, `VinhetaFim` ("Siga") ou `VinhetaPergunta` (Pro) nos últimos segundos. Nas séries, a chamada vem depois da frase final fixa. Prefira a pergunta específica a um "curte aí" genérico.
- Uma ideia por cena, 1–2 frases (15–25 palavras, ~3–7 s). Texto para ser **falado**: frases curtas, números por extenso quando lidos, sem parênteses, siglas ou emoji.
- `visual` = direção do que aparece (com os elementos que ilustram a fala).
- `capa`: cena + `momento` (0–1) com o assunto completo em cena + título curto com `destaque`.
- `post`: `texto` (gancho do post), `chamada` ("Mande para quem vive viajando", "Mande para quem não perde um pôr do sol"), `hashtags`. As fontes NÃO vão no post (ficam na ficha do Drive).
- Cena sem fala: `narracao: ""` + `duracaoMinima`. Entrada: `transicao: "corte" | "flash" | "preto"`. Música: padrão do canal; outra com `"trilha": {"arquivo": "..."}`; sem música com `"trilha": false`.
- **Ritmo de Reels:** voz a 1.15 e 0,12 s entre cenas. Algo importante na ÚLTIMA palavra da cena (punchline, pergunta) → `pausaDepois: 0.3–0.8`.
- **Voz expressiva** (`"voz": {"perfil": "expressiva"}`, padrão dos vídeos novos): modelo `eleven_v4`, em que `pt` é o **português do Brasil** (o `eleven_v3` às vezes saía com sotaque de Portugal: não volte para ele), acelerado depois de gerado até o ritmo do canal (`VOZ.elevenlabsExpressiva.ritmo`, 3,8 palavras/s). Dê o tom de cada cena em `emocao`, em inglês: `excited` (fato forte), `curious` (pergunta), `thoughtful` (parte séria), `whispers` (**raro**: o dono do canal não quer o narrador baixando a voz em todo vídeo; no máximo uma cena, e só quando o texto pede segredo de verdade — a virada normal vai com `surprised` ou `thoughtful`), `surprised`. O tom vai para a voz e não aparece na legenda. `"perfil": "classica"` mantém a voz antiga (multilingual_v2). Anúncio ou story com outra duração: `"duracao": {"minima": 30, "maxima": 60}`.

## Programando as cenas (`videos/<slug>/cenas.tsx`)

```tsx
import {Boneco, Interrogacao, Animado, Palco, Som, Titulo, useCena, type Cenas} from '../../src/kit';

const Gancho: React.FC = () => {
  const {quando} = useCena();               // quadros relativos ao início da cena
  return (
    <>
      <Palco camera={{tipo: 'mover', de: {posicao: [0, 1.8, 8.6]}, para: {posicao: [0, 1.6, 7.4]}}}>
        <Boneco poses={[{quadro: 0, pose: 'olhandoCima'}, {quadro: quando('azul'), pose: 'surpreso'}]} />
        <Animado entrada={quando('azul')} posicao={[-0.8, 2.3, -0.8]} girar={0.7}>
          <Interrogacao />
        </Animado>
      </Palco>
      <Titulo texto="Por que o céu é azul?" destaque="azul" entrada={quando('céu')} />
      <Som tipo="pergunta" em={quando('azul')} />
    </>
  );
};

export const cenas: Cenas = {gancho: Gancho};   // chave = id da cena no video.json
```

- **3D dentro do `<Palco>`; 2D (`Titulo`, `Rotulo`, `Numero`) e `<Som>` fora dele.**
- `useCena()` → `{duracao, palavras, fimDaFala, quando(trecho, n?), quandoTermina(trecho, n?)}`. `quando` lança erro se o trecho não está na fala da cena. 2D próprio da cena: `useNaCapa()` (esconda títulos na capa) e `useNoCarrossel()` (esconda rótulos no carrossel), do kit.
- Mundo contínuo (o mesmo plano atravessando cortes): `useMundo()` → `{quadro, quando(idCena, trecho, n?), inicioDa(idCena)}`, em quadros do vídeo inteiro. Peças que animam sozinhas aceitam esse relógio em `tempo` (`Boneco` — aí os quadros das `poses` também ficam nele —, `Vulcao`, `Cerebro`, `CidadeVaranda`, `Multidao`...): `tempo={useMundo().quadro}`. O `npm run checar` confere `quando('trecho')` em alguma fala e `quando('cena', 'trecho')` na fala daquela cena.
- **Densidade com sentido:** desde o quadro 0 o assunto está em cena; a cada ~1–1,5 s entra algo novo preso a uma palavra. Camadas: assunto · objetos de apoio do tema (ex.: mesa e livro de Newton, moléculas N₂/O₂, olho, rover) · cenário quando ao ar livre (`ambiente={['nuvens','montanhas']}`, casas, árvores, `Passaro`). `ambiente` vem vazio por padrão; `'poeira'` só quando explica algo (ar denso, Marte).
- **Enquadramento vertical:** a ~7 unidades da câmera (fov 38) só se vê x de -1,3 a 1,3 e ~±2,4 em altura em torno do alvo. Assunto em |x| ≤ 1,0. Boneco em pé mede ~2 (cabeça em y≈1,95). Encostou na borda → mude o `alvo` da câmera.
- **Faixas da tela (px):** 0–220 interface do app · 250–1150 assunto principal · ~1220–1400 legenda · 1500+ interface. `Rotulo`/`Numero` usam px (x 540 = centro).

### Kit (`src/kit`, tudo exportado em `src/kit/index.ts`)

| Peça | Para quê / props principais |
|---|---|
| `Palco` | Canvas 3D nas cores do estilo: palco, holofote, contraluz, névoa, câmera. `camera`, `fundo` (azul = ao ar livre), `chao` (cor ou `false` no espaço), `disco`, `feixe`, `estrelas`, `nevoa`, `luz`, `ambiente`, `corDasMontanhas`, `hora` (luz do dia 0–24: sol, luar, fundo e névoa da hora; `azimuteDoSol`, `alcanceDaSombra`), `contraluz`/`preenchimento` (multiplicam as luzes do estilo; 0 desliga), `alcance` (até onde a câmera enxerga, padrão 400) |
| câmera | `{tipo:'fixa', posicao, alvo, fov}` · `{tipo:'mover', de, para, alvo?, inicio?, fim?, curva?}` · `{tipo:'orbita', alvo, raio, altura, de, ate (graus)}` · `{tipo:'chaves', chaves:[{quadro, posicao, alvo, fov}]}` · `tremor` |
| `Boneco` | `pose` ou `poses=[{quadro, pose}]`, `posicao`, `giro` (graus), `escala`, `visual` (0–4), `cor`, `pele`, `calca`, `cabelo` (`null` = careca), `falando`, `tempo` (relógio das poses; `useMundo().quadro`) |
| poses | `parado`, `acenando`, `apontando` (para a direita da tela), `pensando`, `surpreso`, `comemorando`, `andando`, `correndo`, `olhandoCima`, `explicando`, `deOmbros` |
| `Animado` | Envolve qualquer 3D: `entrada`/`saida` (quadro), `flutuar`, `girar`, `pulsar`, `posicao`, `escala` |
| espaço | `Globo`, `Sol` (`cor`, `corBrilho`, `raios`, `brilho`), `Planeta` (`estilo`, `anel`), `Foguete` (`motor`), `Rover` (`andando`) |
| lugares e natureza | `Casa` (`janelasAcesas`), `Predio` (`andares`), `Montanha` (`neve`), `Arvore`, `Nuvem`, `Pedra`, `Passaro` |
| casa por dentro | `Geladeira` (`porta`/`portaDeCima` 0–1, `corte` 0–1 = vista interna, `calor`, `gelo`, `vibrar`, `bolinhas` = gás nos canos, `fluxo`/`fluxoDoGas`, `partes`), `Compressor`, `pontoNaGeladeira` + `PECAS_GELADEIRA` (rótulos) |
| ciência | `Molecula` (`formula`: N2, O2, H2O, CO2), `Olho` (`corIris`, olhar), `Lampada` (`acesa` 0–1), `Lupa`, `Livro` (`aberto`), `ArcoIris` (`progresso`), `Prisma`, `Pedestal` |
| diagramas | `Seta` e `Feixe` (`de`, `para`, `progresso`, `pulsos`), `Onda` (`comprimentoDeOnda`, `amplitude`, `opacidade`), `Particulas` (`quantidade`, `area`, `cores`, `brilhar`, `opacidade`) |
| símbolos | `Interrogacao`, `Arroba` (`brilho`, `espessura`, `desenho` 0–1 = sendo escrita) |
| 2D | `Titulo` (`texto`, `destaque`, `entrada`, `saida`, `y`), `Rotulo` (`texto`, `x`, `y`, `cor`, `maiusculas={false}` para e-mail e @perfil), `Numero` (`ate`, `prefixo`, `sufixo`; conta em degraus de `passo` = 3 quadros, sem piscar) |
| som | `<Som tipo em intensidade?>`: `surgir`, `texto`, `luz`, `mergulho`, `revelar`, `pergunta`, `brilho`, `ideia` |
| animação | `progresso(frame, de, ate)`, `suave`, `entrar`, `sair`, `oscilar`, `misturarVec`; cores em `COR`, `CORES_ARCO_IRIS` |

**Biblioteca 3D Pro** (`src/kit/pro/`, vazia no kit inicial; completa no Estúdio Pro): animais (Gato, Cachorro, Abelha, Favo, Flamingo, Polvo, Zebra, Coruja, Peixe, Tardigrado), oceano (Baleia, Tubarao, AguaViva, Coral, Navio, Submarino, Concha, Mar, Farol), corpo (Cerebro (`trocas=[{em, area}]` troca de área com fusão), CoracaoHumano, Pulmoes, Diafragma, Orelha, Mao, Dente, Coluna, Neuronio, Celula), natureza (Vulcao, Raio, FlocoDeNeve, Granizo, Folha, Tornado, Gota, Lua, Cristal), história (Piramide, ColunaGrega, TorrePisa, Muralha, CapaceteViking, BarcoViking, Pergaminho, Prensa, TelefoneAntigo, RelogioDeSol), tecnologia (Satelite, Aviao, Chip, Antena, Bateria (abaixo de ~20% pulsa devagar), FoneDeOuvido, CameraFotografica, MicroOndas, PanelaDePressao, Ima, Bussola), comida (Pao, Pipoca, Pimenta, GarrafaRefrigerante, Maca, XicaraCafe, PoteMel, Chocolate, Cebola, CopoLeite, Saleiro), brasil e simulação (CidadeVaranda em metros: `hora`, `luzes` (o apagão anda janela por janela), `vegetacao`, `agua` (m, carros boiam), `neve` + `corDaNeve` (ex.: cinza vulcânica), `danos`/`ocultar`, `telas` (3 nos prédios da frente, ou `{texto, predio, fachada}` em qualquer um), `alturaDosOlhos`/`andar` (com `palcoDaVaranda(altura)`), `cidadeInteira` (quarteirões em volta, para câmera que recua ou sobe), `transito`, `tempo`; CeuDoDia `hora`, `faseDaLua`; Multidao `eventos` em cadeia (+ `caido`), `fugirPara`; PredioEmBlocos `em`, `direcao`, `forca`; PaoDeAcucar `bondinho`; CristoRedentor `morro`; CalcadaoCopacabana; Congresso; MASP). Cada um tem props de **estado** para contar a história (ex.: `Maca escurecida`, `Coral branqueado`, `Lua fase`, `TorrePisa inclinacao`): leia o comentário acima do objeto em `src/kit/pro/<categoria>.tsx` antes de usar. Vitrine: `npm run previa -- pro-<categoria>`. Antes de criar um objeto do zero, confira se ele já existe aqui.
Mundo do POV (`src/kit/pro/brasil.tsx`): `<Palco {...PALCO_VARANDA} hora={h}>` + `<CeuDoDia hora={h} />` + `<CidadeVaranda hora={h} ... tempo={quadro} />` (+ `Multidao` em `PRACA_VARANDA`; `predioDaCidade(i)` + `ocultar={[i]}` troca um prédio por um `PredioEmBlocos`), tudo animado por `useMundo().quadro` para o mesmo plano atravessar as cenas. Exemplos animados: `npm run previa -- pro-mundo --momentos 0.15,0.85`.

#### Cenas prontas (Estúdio Pro)

`src/kit/pro/cenas.tsx` monta uma cena inteira (Palco + 3D + textos, nas cores do estilo e nas faixas seguras) a partir de conteúdo e de tempo (`em`, `revelar`... = `quando('palavra')`; item sem tempo se espalha pela cena). Leia o comentário-exemplo acima de cada uma. `objeto` = qualquer 3D com base em y = 0 e ~1 de altura; `children` = 3D extra no Palco; `palco` = troca props do Palco; `som={false}` tira o efeito da cena.
`CenaComparacao` (A × B, vencedor) · `CenaEscala` (níveis de tamanho) · `CenaLinhaDoTempo` (marcos) · `CenaRanking` (`modo` barras/pódio) · `CenaMitoVerdade` (carimbo) · `CenaMergulho` (macro → micro) · `CenaQuiz` (alternativas + contagem) · `CenaCorte` (`forma` esfera/cilindro/camadas) · `CenaAntesDepois` (cortina) · `CenaNumeroGigante` (+ referência, já em cena antes da contagem) · `CenaGrafico` (`tipo` barras/linha) · `CenaPassoAPasso` · `CenaBalanca` · `CenaMapa` (globo com continentes reais, lat/lon e arcos) · `CenaVistaExplodida` · `CenaDialogo` (balões) · `CenaCronometro` (relógio/calendário; muito tempo em 2 s vira borrão nos ponteiros, sem piscar) · `CenaLugar` (`lugar` laboratorio/espaco/fundoDoMar/cidade/floresta/sala) · `CenaLupa` · `CenaCiclo`.
Vinhetas 2D (`src/kit/pro/vinhetas.tsx`, por cima da cena): `VinhetaSerie` (série + episódio, começo) · `VinhetaFim` (“Siga @canal”, últimos ~2 s) · `VinhetaParte2` (`variante` parte2/continua) · `VinhetaPergunta` (“Comenta aí”). Vitrines: `npm run previa -- pro-cenas --momentos 0.3,0.9` e `pro-vinhetas` (`--cena <id>`, `--estilo papel`). Vídeo de exemplo: `videos/modelo-cenas-prontas/`.
Simulação (Estúdio Pro, `src/kit/pro/simulacao.tsx`, 2D por cima da cena, formato “E se…” em POV): `Medidor` (HUD: `rotulo`, `valor` fixo/texto/`(quadro) => número`, ou `de`/`ate`/`em`/`ateQuadro`; `unidade`, `casas`, `prefixo`, `abreviar`, `nota` = comparação humana, `ponto` = destaque/tensão, `fases=[{em, ...}]` troca com fusão, `lado`, `y` ≈ 260; `quadro={useMundo().quadro}` conta atravessando cenas) · `PainelSimulacao` (`capitulo`, `escalaDoTempo`, até 2 `medidores` + `direita`) · `CarimboTempo` (`texto` "+1", `unidade` "DIA", `em`, `duracao`; combine com `transicao: "flash"`) · `ContagemRegressiva` (`de`, `em`/`quadros`, `final`, `rotulo`, `som`) · `EfeitoLente` (`tipo` agua/geada/vidro, `em`, `duracao`, `ponto`; fica até o fim da cena) · `CartaoFiccao` (“ISTO É FICÇÃO” + `fato` real das fontes + `pergunta` de escolha, `*trecho*` em destaque; última cena ou últimos ~3,5 s). Valores no HUD = número + comparação, nunca a frase falada. Vitrine: `npm run previa -- pro-simulacao --momentos 0.2,0.6,0.95`.

```tsx
const Pontas: React.FC = () => {
  const {quando} = useCena();
  return (
    <CenaBalanca
      esquerda={{rotulo: 'Órgãos vitais', peso: 3, objeto: <CoracaoHumano escala={0.3} posicao={[0, 0.3, 0]} />}}
      direita={{rotulo: 'Mãos e pés', peso: 1, objeto: <Mao escala={0.34} />, em: quando('pés')}}
      pesarEm={quando('proteger')}
    />
  );
};
```

Também vale Three.js direto (`<mesh>`, `flatShading` para o visual low-poly). **Objeto novo reaproveitável → `src/kit/objetos/`, exportado no `index.ts` e mostrado na vitrine.** Veja o kit com `npm run previa -- kit-bonecos` / `kit-objetos` / `kit-objetos-2`.

## Som

- **Só áudio feito por pessoas, com licença comercial** — nada de IA (efeitos do ElevenLabs, Suno, Udio). Registre tudo em `public/LICENCAS.md`. Hoje: efeitos Kenney (CC0) em `public/sons/`, trilhas HoliznaCC0 (CC0) em `public/trilhas/`.
- **Trilha:** automática (`AUDIO.trilhaPadrao`), ~18 dB abaixo da voz, abafa durante a fala, fade no fim. Catálogo por clima em `public/trilhas/trilhas.json`.
- **Efeitos extras e ambiências** (Pacote de som): catálogo em `public/sons/sons.json`, usados com `<Som arquivo="..." em={q} />` (ambiência: `duracao` = cena inteira, `intensidade` ~0.6).
- **Efeitos:** no máximo 1–2 por cena, só em eventos com significado (revelação, pergunta, luz viajando, mergulho, ideia), no mesmo quadro do evento visual. Cenas calmas ficam só com música. Proibido: whoosh em todo corte, clique em todo texto, sons de meme, efeitos empilhados.
- **Master** automática no render: -14 LUFS, pico -1,5 dBTP (a narração do ElevenLabs sai em ~-23 LUFS).

## Conferindo antes de entregar

Na folha de contato: assunto cortado, legenda sobre o assunto, textos sobrepostos, cena magra ou com enfeite sem sentido, `CENA SEM CÓDIGO`, painel com `SEM VOZ`/`VOZ DESATUALIZADA`. Depois do render: capa (`saida/capa.png`) e `post.txt`. Depois do arquivo: tamanhos na nuvem iguais aos do `arquivo.json`.

## Onde fica cada coisa

- `src/config.ts` — identidade (`MARCA`: nome, série, estilo, destaque), formato, duração, ritmo, voz, áudio (`AUDIO`), arquivo no Drive (`ARQUIVO`).
- `src/kit/estilos.ts` — os estilos visuais; `src/kit/tema.ts` — cores derivadas do estilo, área segura, legenda.
- `src/esquema.ts` — formato do `video.json` e do `narracao.json`.
- `src/video/` — linha do tempo, `useCena`, legendas, `VideoCuriosidade`, `Capa`, descoberta dos vídeos (`indice.ts`).
- `scripts/` — `npm run` novo, roteiros, voz, vozes, estilo, previa, render, arquivar, status, checar.
- `videos/<slug>/arquivo.json` — onde e quando o vídeo foi arquivado no Drive (e o tamanho de cada arquivo).
- `.env` — `ELEVENLABS_API_KEY` (secreta) e, opcionais, `ELEVENLABS_VOICE_ID` e `DRIVE_RAIZ`. **Nunca abra, mostre ou edite o `.env`** (o `.claude/settings.json` bloqueia): para criar, copie o `.env.example` e peça ao usuário para colar a chave no editor, nunca no chat. A voz do canal fica em `src/config.ts` > `VOZ.vozDoCanal`.

## Problemas comuns

- `Trecho "x" não aparece na narração da cena "y"`: o `quando('x')` cita algo fora da fala daquela cena.
- Render recusado (voz faltando/desatualizada ou duração): `npm run voz -- <slug>` ou ajuste o texto.
- ElevenLabs 401: chave inválida, sem permissão ou sem créditos. O plano gratuito não dá licença comercial.
- `npm run arquivar` não acha o Drive: abra o Google Drive para computador ou defina `DRIVE_RAIZ` no `.env`.
- Mudou capa/post depois de arquivar: `npm run render -- <slug> --sem-video` e `npm run arquivar -- <slug>` (o MP4 do Drive é mantido).
- Capa: é uma composição de `quadro + 1` quadros com `<Freeze>` — um `<Still>` de 1 quadro mostraria sempre o quadro 0.
- Render lento: `--concorrencia 4`. A GPU é usada via ANGLE (`gl: 'angle'`).
- 3D preto/sem aparecer ou erro de WebGL: atualizar o driver de vídeo; enquanto isso, rode com a variável `RENDER_GL=swangle` (por software, mais lento). Ex.: PowerShell `$env:RENDER_GL='swangle'; npm run render -- <slug>` · bash `RENDER_GL=swangle npm run render -- <slug>`.
- PowerShell recusando `npm` ("execução de scripts foi desabilitada"): use `npm.cmd`, ou, com permissão do usuário, `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
