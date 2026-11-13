# Recursos visuais executáveis

Composições do motor Three/DOM/Canvas, sem instalar React, Remotion ou serviços externos. Use um `tipo: "recurso"` por beat, sem `modelo` nem outros elementos. Um título curto no beat é opcional nos estilos base. Estilos suportados: `padrao`, `editorial`, `minimalista`, `papel` e toda a família `smooth`, tanto vertical quanto horizontal. No smooth, a explicação usa a paleta do fundo atual e reserva espaço para a fala do estilo; não acrescente um elemento smooth decorativo junto. Cores vêm da marca do vídeo.

`entra` aceita segundos a partir do beat ou uma palavra da fala, inclusive `"palavra#2"` para a segunda ocorrência. Os itens também aceitam `entra`. Palavra ausente interrompe a preparação, em vez de animar no instante errado. `dur` é a duração da animação em segundos, com até 30 s. Nada depende da ordem de renderização.

Os exemplos abaixo são **elementos** para colocar em `beat.elementos`. Escolha o recurso pela explicação necessária, sem forçar um recurso em todas as cenas. Dados de exemplo não são evidência factual.

## Integração com a criação

### Duração de cada ação

Em comparação, cronologia e causa e efeito, cada item pode definir `dur` em segundos. Sem ela, vale a `dur` do recurso; sem duração explícita, permanece a entrada breve padrão. Exemplo: `{"rotulo":"Alternativa B","valor":20,"entra":"segunda","dur":1.8}`. A ação deve terminar com pelo menos 0,3 s de leitura antes do corte. A preparação recusa uma duração dirigida que corte a comparação antes de mostrar sua proporção final.

Em objetos contáveis, a revelação é distribuída pela duração do item; não existe um limite oculto de menos de um segundo. Em `decomposicao`, use somente a `dur` do recurso para separar o todo; não defina durações nas partes. Em documentos, `dur` também governa a revelação do destaque e das linhas. A duração deve acompanhar a explicação e permitir leitura, sem esticar uma entrada para esconder falta de conteúdo.

O autoplano de novas cenas em português reconhece um subconjunto explícito de comparações, cronologias e consequências. Confira os limites e o planejamento de recursos antes da voz em [Integração das explicações](../integracao-explicacoes.md). O agente pode especificar qualquer um dos seis recursos em `direcao-visual.json`, usando `plano.recurso`, ou diretamente em `cena.json`. A aplicação de curadoria do pipeline só modifica cenas automáticas; cenas autorais continuam sendo editadas explicitamente pelo agente ou pelo editor.

## Comparação proporcional

```json
{"id":"comparacao","essencial":true,"tipo":"recurso","forma":"comparacao","entra":0,"foco":1,"unidade":" kg","itens":[
  {"rotulo":"Exemplo A","valor":10,"entra":0},
  {"rotulo":"Exemplo B","valor":20,"entra":"dobro"}
]}
```

De 2 a 3 itens. Barras partem de zero e têm largura proporcional ao maior valor. Zero não vira uma barra fictícia; diferenças muito grandes podem ficar imperceptíveis. Nesse caso, escolha outra explicação visual. O número apresentado é o valor final; a animação revela a barra, sem fabricar contagens intermediárias. `foco` é o índice do único destaque, começando em zero. Rótulos: até 32 caracteres. Valores não negativos até 1 trilhão; unidade de até 12 caracteres. O QA também mede o texto real e pede encurtá-lo se não couber.

### Quantidades com objetos

Na comparação, acrescente `"visual":"unidades","simbolo":"bola"` para mostrar uma bola por gol. Símbolos: `bola`, `moeda`, `pessoa` (pessoa anônima esquemática) e `caixa`. Use somente quantidades inteiras de 0 a 24 por item. O motor não arredonda valores nem inventa uma escala. Zero não desenha objeto. Para números maiores, use comparação proporcional ou outra representação apropriada. No autoplano, comparações explícitas de até 24 gols já recebem bolas; a direção autoral escolhe a representação de cada trecho.

## Decomposição de um todo

```json
{"id":"origem","tipo":"recurso","forma":"decomposicao","simbolo":"bola",
 "entra":0,"total":8,"rotuloTotal":"Total ilustrativo","unidade":" gols",
 "separarEm":"divide","dur":1.1,"itens":[
   {"rotulo":"Parte A","valor":7},{"rotulo":"Parte B","valor":1}
 ]}
```

Oito objetos já visíveis se deslocam e formam dois grupos, preservando sua identidade e quantidade. `total` deve ser igual à soma das 2 ou 3 partes e estar entre 1 e 24. `separarEm` é a palavra da fala ou o segundo a partir do beat que inicia a separação; não defina `entra` nas partes, pois os objetos já pertencem ao todo inicial. A ação precisa terminar pelo menos 0,3 s antes do corte. As posições são ilustrativas; as quantidades exigem evidências. Não substitua este movimento por dois gráficos estáticos. O autoplano não infere partes de um todo; a direção declara a relação sustentada pelas fontes.

## Campo tático com passes e deslocamentos

```json
{"id":"campo","tipo":"recurso","forma":"campo-tatico","entra":0,
 "jogadores":[
   {"id":"apoio","rotulo":"Apoio","time":"a","pos":[0.2,0.7]},
   {"id":"ponta","rotulo":"Ponta","time":"a","pos":[0.7,0.65],
    "destino":[0.7,0.2],"moverEm":0.2,"dur":0.7},
   {"id":"defesa","rotulo":"Defesa","time":"b","pos":[0.4,0.3]}
 ],"passes":[{"de":"apoio","para":"ponta","em":0.5,"dur":0.7}]}
```

De 2 a 8 jogadores esquemáticos; `pos` e `destino` usam coordenadas normalizadas de 0 a 1. O jogador pode correr enquanto a bola se desloca até sua posição de recepção. De 1 a 6 passes, com `em` em segundos a partir do beat e `dur` entre 0,3 e 5 s. Passes não se sobrepõem e cada passe seguinte parte de quem recebeu o anterior. O resultado precisa ter 0,3 s de leitura antes do corte. Ações e tempos devem acompanhar a fala; não use um campo por mera decoração.

O motor escreve **ESQUEMA ILUSTRATIVO** no campo. Este recurso explica conceitos, sem reconstituir posições, táticas ou lances de uma partida específica. Para atribuir uma jogada real a alguém, pesquise e use registro verificável. Não invente movimento para ilustrar um placar, uma notícia ou uma estatística sem relação tática.

## Linha do tempo

```json
{"tipo":"recurso","forma":"linha-do-tempo","entra":0,"itens":[
  {"data":"ETAPA 1","rotulo":"Preparar","entra":0},
  {"data":"ETAPA 2","rotulo":"Concluir","entra":"depois"}
]}
```

De 2 a 3 marcos, com `data` de até 18 caracteres e `rotulo` de até 32. Esta é uma sequência editorial com espaçamento uniforme: não representa distâncias proporcionais entre datas. Use ordem cronológica e registre datas factuais em `fontes.md`.

## Causa e efeito

```json
{"tipo":"recurso","forma":"causa-efeito","entra":0,"itens":[
  {"rotulo":"A água recebe calor","entra":0},
  {"rotulo":"A temperatura aumenta","entra":"temperatura"}
]}
```

Cadeia de 2 a 3 nós com setas. Cada passo entra com a fala; o último recebe o destaque por padrão. A seta representa uma relação causal afirmada pelo roteiro, que precisa de evidência. Não transforme correlação em causalidade para preencher o desenho.

## Destaque em documento

Para trecho transcrito:

```json
{"tipo":"recurso","forma":"documento","entra":"trecho","dur":0.8,
 "fonte":"Identificação curta da fonte",
 "linhas":["Uma ideia por cena.","O destaque revela o trecho."],"marcar":[1]}
```

De 1 a 4 linhas, com até 42 caracteres cada; `marcar` usa índices a partir de zero. Transcreva fielmente. Este recurso exibe um trecho editorial, sem simular uma captura original. Para destacar o documento real, use uma imagem local:

```json
{"tipo":"recurso","forma":"documento","entra":0,"arquivo":"assets/documento.png",
 "area":[0.1,0.35,0.8,0.12],"fonte":"Documento original, página 2"}
```

`area` é `[x, y, largura, altura]`, de 0 a 1, relativa à imagem inteira. A imagem mantém a proporção. Prefira recortar a região pertinente antes, sem omitir ressalvas importantes. `fonte` identifica a origem na tela, mas a URL, a transcrição conferida e a licença precisam estar em `fontes.md`. O motor não verifica se a alegação é verdadeira.

## Câmera acompanhando uma imagem

```json
{"tipo":"recurso","forma":"seguir-objeto","entra":0,"dur":3,
 "arquivo":"assets/objeto.png","trajeto":[[-2,0],[0,-1],[2,0]],"zoom":1.2,"atrasoCamera":0.12}
```

Travelling 2D: a imagem percorre uma trajetória e o enquadramento a acompanha, com referências de mundo ao fundo. Não é uma câmera anexada a uma peça 3D existente. Use uma imagem pertinente, com transparência quando houver recorte. `trajeto` tem de 2 a 12 posições normalizadas `[x,y]`, de -3 a 3; `zoom` vai de 1 a 1,6 e `atrasoCamera`, de 0 a 0,5 segundo. Mesmo com atraso, posição e câmera são funções do tempo, sem acumular estado entre quadros.

## Proteção de autoria e prévia

Uma cena autoral (sem `automatica: true`) não pode perder imagem, texto, dado, intenção ou beat durante reparos do QA. `beat.protegido: true` protege um beat inteiro mesmo num plano automático. `elemento.essencial: true` protege um elemento, inclusive na compilação. O encaixe pode ajustar posição e tamanho; alterações de conteúdo são bloqueadas com diagnóstico. Isso protege o plano, mas não comprova equivalência visual ou verdade factual.

O QA trabalha numa cópia e salva o encaixe aceito em `saida/cena-ajustada.json`, quando há correção. `saida/ajustes-storyboard.json` lista tentativas e bloqueios. `cena.json` não é sobrescrito por esse reparo. As etapas anteriores de planejamento e atualização de narração continuam seguindo suas regras existentes.

`saida/preparacao-previa.json` guarda a cena e o plano usados no último QA concluído. A prévia usa esse encaixe somente quando as assinaturas de `cena.json` e `palavras.json` ainda correspondem; caso contrário, prepara a autoria atual. Imagens, b-roll, pontos, peças locais, GLBs e marcas passam pela mesma preparação da produção. A preparação de b-roll pode extrair quadros para o cache local.

## Referências e verificação

Implementação nova para este motor, inspirada nas ideias de barras proporcionais, sequências e câmera determinística do `shorts-kit`. Nenhum TSX ou runtime de outro repositório foi incorporado. A preservação da autoria adapta o princípio de separar mudanças humanas dos reparos automáticos observado no `openfilm`.

Exemplo completo e reproduzível: `test/fixtures/recursos-visuais.json`, com imagem demonstrativa própria em `test/fixtures/recursos-objeto.svg`. Testes: `test/recursos-visuais.test.mjs`, `test/preparacao-video.test.mjs`, `test/protecao-storyboard.test.mjs` e `test/cache-legenda-render.test.mjs`.

## Entradas por linha e organização de sequências

Documentos textuais aceitam `revelarLinhas`, uma lista de segundos ou palavras, com a mesma quantidade de itens que `linhas`. Sequências causais e linhas do tempo aceitam `layout: "horizontal"` para mostrar os passos lado a lado. As entradas são validadas antes de salvar e medidas no QA. Consulte [edição e direção](../edicao-e-direcao.md) para correções por cena e propostas de ritmo que preservam o conteúdo.

## Mecanismos explicativos

```json
{"tipo":"recurso","forma":"mecanismo","mecanismo":"fases-lua","entra":0,
 "anguloInicial":15,"anguloFinal":345}
```

Dois modelos implementados: `fases-lua` (órbita e aparência vista da Terra) e `reflexao-luz` (percurso da luz solar refletida). Diagramas Canvas, sem API ou ativos externos. `anguloInicial` e `anguloFinal`: graus de -720 a 720. `periodo`: 1 a 60 s, opcional; sem ele, percorre o movimento durante a cena. `rotulo`: até 70 caracteres, opcional. Não use `dur` como período orbital: ele controla a entrada do recurso.

A Lua vista da Terra usa iluminação de superfície orientada ao Sol; cheia em 0°, quarto em 90°, nova em 180°. A órbita e os corpos estão fora de escala, o movimento é acelerado e eclipses não são simulados. Exemplo completo: `docs/exemplos/fases-da-lua-mecanismo/`. Para outro assunto, crie uma direção específica em vez de selecionar um modelo sem relação.

Em **Projetos > Corrigir cenas > Diagrama explicativo**, escolher um modelo substitui os elementos daquela cena. A ação exige a revisão atual, preserva a voz e registra histórico para desfazer. O título continua independente. A associação factual deve continuar em `afirmacoes` no beat ou elemento; a semelhança do desenho com a fala não é validada semanticamente pelo QA.
