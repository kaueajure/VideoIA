# Recursos visuais executáveis

Composições do motor Three/DOM/Canvas, sem instalar React, Remotion ou serviços externos. Use um `tipo: "recurso"` por beat, sem `modelo` nem outros elementos. Um título curto no beat é opcional. Estilos suportados: `padrao`, `editorial`, `minimalista` e `papel`, tanto vertical quanto horizontal. A composição ocupa a faixa da cena e deixa a legenda livre. Cores vêm da marca do vídeo.

`entra` aceita segundos a partir do beat ou uma palavra da fala, inclusive `"palavra#2"` para a segunda ocorrência. Os itens também aceitam `entra`. Palavra ausente interrompe a preparação, em vez de animar no instante errado. `dur` é a duração da animação em segundos, com até 30 s. Nada depende da ordem de renderização.

Os exemplos abaixo são **elementos** para colocar em `beat.elementos`. Escolha o recurso pela explicação necessária, sem forçar um recurso em todas as cenas. Dados de exemplo não são evidência factual.

## Comparação proporcional

```json
{"id":"comparacao","essencial":true,"tipo":"recurso","forma":"comparacao","entra":0,"foco":1,"unidade":" kg","itens":[
  {"rotulo":"Exemplo A","valor":10,"entra":0},
  {"rotulo":"Exemplo B","valor":20,"entra":"dobro"}
]}
```

De 2 a 3 itens. Barras partem de zero e têm largura proporcional ao maior valor. Zero não vira uma barra fictícia; diferenças muito grandes podem ficar imperceptíveis. Nesse caso, escolha outra explicação visual. O número apresentado é o valor final; a animação revela a barra, sem fabricar contagens intermediárias. `foco` é o índice do único destaque, começando em zero. Rótulos: até 32 caracteres. Valores não negativos até 1 trilhão; unidade de até 12 caracteres. O QA também mede o texto real e pede encurtá-lo se não couber.

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
