# Produção criativa dos próximos vídeos

Use em vídeos novos. Edições de projetos existentes preservam o contrato e os trechos válidos, salvo pedido de reformulação. O objetivo é que a imagem acrescente entendimento: um componente do assunto não é necessariamente uma cena que explica a fala.

## Planejar antes da voz

Em `storyboard.md`, comece com a pergunta central e a resposta sustentada pelas fontes. Organize a progressão de informação: apresentação do problema, explicação ou evidência e consequência. Entregue informação cedo; retire promessas repetidas de uma revelação futura. Preserve textos fixados pela pessoa.

Escolha a linguagem pelo conteúdo e pelo estilo solicitado: imagens e documentos para acontecimentos; comparação proporcional para diferenças; estados sucessivos para mecanismos; linha do tempo para ordem de eventos. Não escolha primeiro uma sequência de ícones para depois encaixar as frases. Modelos prontos são ferramentas quando executam a ideia; não são o ponto de partida obrigatório.

### Produzir uma sequência visual, além de cartões

O primeiro plano precisa mostrar o conflito ou o objeto da curiosidade em tamanho legível no celular. Título longo, bandeiras pequenas e um grande fundo vazio não sustentam a abertura. Escreva uma pergunta curta na tela e revele o detalhe que a torna interessante. Se a única imagem possível é uma tabela, reavalie o recorte da pauta antes da voz.

Para cada informação, escolha uma ação com consequência visível: separar um todo em partes, percorrer uma trajetória, aproximar o detalhe de uma prova, remover uma camada ou confrontar estados no mesmo enquadramento. Escreva no storyboard o instante de início, o estado que muda e o resultado. Uma entrada, um zoom ou a legenda mudando não animam o conteúdo de um gráfico exportado como SVG.

Em futebol: para explicar quantidades pequenas, use comparação com `visual: unidades` e bolas contáveis; para explicar a origem de um total, use `decomposicao`; para conceitos de passe e movimentação, use `campo-tatico` com esquema identificado. Em acontecimentos e personagens, procure registros reais relevantes, recortes e documentos. Não cubra a falta de material com um campo fictício, bolas ou bandeiras em todos os planos. Um lance real exige registro verificável, não uma simulação apresentada como fato.

Combine planos abertos de contexto, aproximações de detalhes e transformações dentro da cena conforme a história exigir. Evite manter a mesma informação visual enquanto a voz repete ressalvas: junte ou encurte esses trechos antes de gerar a narração. Gráficos ajudam uma pergunta específica; um vídeo inteiro de gráficos demanda outra direção. Não troque barras por ícones repetidos e considere o trabalho resolvido.

Os recursos já estão integrados ao autoplano e ao `direcao-visual.json`, inclusive no smooth. Consulte `docs/integracao-explicacoes.md`: o agente pode planejar `recurso` antes da voz e depois conferir seus tempos, dados e elementos no plano efetivo. Use diretamente no `cena.json` autoral quando a curadoria automática não se aplicar.

Desenhe primeiro os trechos decisivos: abertura, explicação central e conclusão. Para cada um, descreva o que se vê antes, a ação implementável e o que se entende depois. Confirme que os ativos e os recursos do motor permitem essa ação antes de fechar o roteiro e gerar voz. Se faltar recurso, crie a peça ou escolha outra demonstração; não preencha com um botão, sino ou escudo sem função na explicação.

Depois, complete o storyboard. Por trecho, registre função narrativa, ganho da imagem sobre a fala, elementos concretos, ação, estados, palavra de entrada e relação com o trecho anterior. Uma declaração pode aparecer como texto quando o próprio texto é a evidência. Não invente precisão: “não estava 100%” não autoriza um medidor de condição física com valores intermediários apresentados como dados.

## Contrato executável no cena.json

Novos pedidos do estúdio incluem `<!-- direcao-criativa:v2 -->`. Neles, o CLI e a produção após QA exigem este planejamento. Criações novas pelo chat também usam a versão 2. Os demais campos de cena, sujeito, tempos e fontes continuam obrigatórios conforme seus guias.

Na raiz:

```json
"direcao": {
  "versao": 2,
  "pergunta": "Qual relação este vídeo vai explicar?",
  "resposta": "A conclusão específica que a pesquisa sustenta."
}
```

Em cada beat:

```json
"direcao": {
  "funcao": "mecanismo",
  "ganhoVisual": "O percurso da moeda mostra onde ela termina após a queda.",
  "elementosChave": ["moeda"],
  "continuaDe": "apresentacao"
}
```

`funcao`: `gancho`, `contexto`, `evidencia`, `comparacao`, `mecanismo`, `consequencia`, `sintese` ou `cta`. Não há cota de funções ou obrigação de usar todas.

`elementosChave` aponta para ids de elementos do beat no plano efetivo. Dê ids estáveis aos protagonistas. Quando usar modelo, confira os ids expandidos no relatório antes de vinculá-los. A validação recusa referências ausentes após compilação ou QA. Os campos descrevem a intenção; a animação continua sendo implementada em elementos, recursos ou peças, nunca nesse texto.

`continuaDe` é o id do beat imediatamente anterior quando há continuidade do protagonista. Pelo menos um elemento-chave deve existir nos dois beats com o mesmo id. Use `null` no primeiro beat ou quando houver corte para uma composição independente. Repetir o id não comprova transição suave; confira os quadros. Não mantenha um objeto decorativo apenas para satisfazer a continuidade.

## Montagem e revisão

### Distribuir a explicação pelo tempo, em qualquer assunto

Planeje **quando a informação muda**, antes de gerar a voz. No storyboard, indique início da ação, intervalo de desenvolvimento e tempo para ler o resultado. “Entra o objeto e a legenda continua” não descreve a progressão do plano. Uma ação de meio segundo no começo de uma fala de oito segundos deixa o restante sem direção.

Escolha os estados pelo que a fala explica: numa comparação de custos, revelar cada alternativa no trecho correspondente e conservar a escala; numa cronologia, percorrer acontecimentos na ordem; num mecanismo, mostrar qual parte age e qual estado resulta; numa notícia, apresentar o registro, examinar o detalhe verificável e contextualizar sua consequência. Em retratos, planeje o que vem depois da identificação. Use evidência ou ação pertinente em vez de manter a foto como preenchimento. A regra vale para todos os temas e estilos; nenhum assunto exige bolas, campo, barras ou ícones por padrão.

Recursos com itens aceitam `itens[].dur` em segundos, além de `entra`. Essa é a duração da ação daquele item; a `dur` do recurso é a alternativa quando o item não a define. Contagens também distribuem a revelação pelo intervalo dirigido, conservando quantidade e identidade. Reserve pelo menos 0,3 s para o resultado antes do corte. Não prolongue uma revelação trivial apenas para satisfazer uma métrica: se a explicação terminou, avance para uma evidência nova ou encurte a fala antes de contratar voz.

Depois da preparação, confira `criatividade.montagem.ritmo`: ele amostra os estados executáveis, encontra o repouso **depois** da animação e lista o que não consegue avaliar. Há alerta a partir de três segundos sem progressão conhecida; quatro ou mais geram aviso alto e impedem a publicação automática até a composição ser corrigida. A prévia continua disponível. Leitura documental é indicada para revisão, sem obrigar animação decorativa. Peças, contadores, vídeo e estilos não avaliados exigem inspeção temporal; sua ausência no diagnóstico não comprova qualidade. Legenda, grão e câmera não contam como progresso do conteúdo nesse diagnóstico.

Confira a duração inteira do plano, principalmente sua segunda metade. Antes/meio/fim da entrada isolada não bastam. Na prévia curta, inclua a ação e a espera posterior. Registre tanto a transformação observada quanto os intervalos de repouso e sua função. Aprovação estrutural e presença de uma animação não aprovam o ritmo do vídeo.

Monte unidades por ideia, com duração suficiente para perceber a ação e ler o resultado. A mudança pode ocorrer dentro da mesma cena; cortar a cada frase e variar a entrada sem motivo não cria progressão. Reutilize um protagonista quando seus estados explicarem a relação entre os trechos. Câmera acompanha o detalhe revelado; zoom constante não substitui ação.

Use efeitos sonoros quando marcam uma ação visível e deixe a voz inteligível. Quando houver material para reprodução, confira com som se o corte, o destaque e o resultado chegam na frase certa. Sem reprodução, registre ritmo e sincronismo audiovisual como pendentes; uma folha estática não os comprova.

Para cada animação central, examine pelo menos três instantes: antes da ação, durante e depois, além do corte vizinho. O objeto precisa mudar de estado ou posição, e o resultado deve permanecer tempo suficiente para compreensão. Gere uma prévia curta dos trechos centrais antes do render final. A folha de contato é insuficiente para aprovar movimento. Na revisão registre também o que permaneceu estático e por quê.

O relatório `criatividade.montagem` mede duração de imagens e identifica congelamentos entre beats. Com `direcao.versao: 2`, uma sequência de pelo menos três beats de SVGs estáticos por 10 s ou mais reprova a direção. O mesmo arquivo por pelo menos dois beats e 6 s gera alerta mesmo com mudança de título ou câmera. Esses limites são uma proteção contra apresentações de slides, não uma fórmula de retenção. Fotos documentais e pausas podem ter função narrativa; a revisão continua necessária. Mudar extensão, intercalar um ícone ou cortar artificialmente não corrige o problema.

Após `--sem-render` e `node scripts/storyboard-lint.mjs <nome> --estrito`, consulte `criatividade` em `saida/analise-storyboard.json` e, principalmente, em `saida/analise-direcao.json` após QA:

- `falhas`: planejamento incompleto, referência ausente ou continuidade inconsistente. Corrija antes da entrega.
- `alertas`: composições da mesma família por três ou mais beats, cenas só textuais e interfaces usadas para representar evidência, mecanismo ou consequência. São candidatos à revisão, não ordem de trocar formas. Uma explicação contínua pode justificar a repetição; uma interface pode ser o próprio assunto da fala.
- `cenas`: função, ganho pretendido, elementos e instantes para conferir.
- `revisao: pendente`: o relatório automático nunca aprova qualidade artística.

Em `revisao-direcao.md`, registre para os trechos decisivos: beat e instantes inspecionados, o que efetivamente aparece, que informação a imagem acrescenta, se a ação prevista acontece e o que ficou limitado. Responda aos alertas com evidência ou correção. Notas altas sem evidência não bastam. Texto sobreposto a um ícone relacionado ao tema não comprova que uma relação ou mecanismo foi explicado.

Corrija localmente os maiores defeitos e confira as cenas vizinhas se mudar um corte. Preserve voz, blocos, ativos confirmados e cache válidos. Compare antes e depois pelo ganho explicativo, além do QA técnico. Não gere novamente a narração para experimentar outra composição visual.
