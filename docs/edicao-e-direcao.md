# Corrigir cenas e dirigir a explicação

Em **Meus vídeos**, clique em **Corrigir cenas**. A mesma aba também está disponível ao abrir um projeto na área avançada. Escolha a cena pela fala e pelo intervalo de tempo. Você pode ajustar o título, o texto de uma composição, seus rótulos, o tempo da animação e a organização de uma sequência. Composições específicas de outros estilos continuam sob direção do assistente pelo botão **Pedir ajuste desta cena**.

**Terminar esta cena após a palavra** move o corte entre duas cenas vizinhas. O áudio permanece intacto: a palavra continua no mesmo instante e o vídeo mantém a duração total. O editor impede cortes que deixem uma cena vazia ou separem uma animação da palavra que a dispara. A duração da animação é um controle diferente da duração da cena.

A edição direta trabalha no texto visual; reescrever a narração é uma tarefa do assistente e exige voz e alinhamento compatíveis com o texto novo. Não reutilize áudio antigo quando a fala mudou. Não há promessa de síntese por trecho com os provedores atuais, cuja API do método produz a narração completa.

## Salvar, conferir e desfazer

- **Salvar cena** modifica somente os campos solicitados em `cena.json`. Voz, palavras, roteiro, fontes e ativos não são regravados. Cada gravação guarda antes/depois e cenas afetadas em `edicoes/<id>.json`.
- A revisão enviada pelo formulário protege contra sobrescrever mudanças de outra janela ou agente. Em conflito, o formulário mantém o texto. Reabra a aba para carregar a versão atual; rascunhos dos campos permanecem na sessão da página.
- **Desfazer última edição** restaura o estado anterior apenas se não houver uma edição posterior. A pesquisa e a narração não são revertidas.
- **Conferir prévia** abre a cena salva e pausa no seu corte. A prévia completa continua acessível pelo botão do projeto.
- Uma alteração invalida a assinatura da entrega. Depois de conferir o resultado, produza uma entrega nova. O cache mantém as chaves dos quadros não afetados; transições próximas ao corte e dependências globais podem exigir novos quadros. Não se reaproveita um quadro somente por pertencer à mesma cena.

## Ritmo sugerido

**Aplicar ritmo sugerido** distribui as entradas dos textos ou passos existentes durante a fala e reserva pelo menos o trecho final para leitura. Entradas já vinculadas a palavras e revelações por linha já escritas são preservadas. Não adiciona dados, rótulos, relações causais, imagens ou títulos. Cenas curtas podem não comportar uma animação longa; nesse caso, o QA continua sendo necessário.

Os recursos `causa-efeito` e `linha-do-tempo` aceitam `layout: "horizontal"` ou `"vertical"`. Documentos textuais aceitam `revelarLinhas: [0, "palavra", 2.4]`, com uma entrada por linha, em segundos a partir da cena ou por palavra da narração. Palavra inexistente e entrada depois do corte são erros, antes de salvar. O desenho e as medições permanecem funções do tempo; executar os quadros fora de ordem produz o mesmo estado.

A escolha do recurso continua dependendo da explicação: uma comparação precisa de valores e escala honestos; uma seta causal precisa de evidência; um documento precisa identificar a síntese ou a transcrição. O planejamento de ritmo não atribui uma nota semântica falsa à imagem. Para peças, fotos, câmera 3D ou uma nova composição, o assistente mantém o briefing `sujeito` e usa os módulos de direção já existentes.

## Comandos para o agente

```sh
npm run cena -- meu-video
npm run cena -- meu-video --direcao
npm run cena -- meu-video id-da-cena /caminho/pedido.json
```

O primeiro comando informa cenas, fala, intervalos e `revisao`. O terceiro recebe:

```json
{"revisao":"assinatura retornada pelo comando","mudancas":{"titulo":"Luz refletida","recurso":{"dur":0.7,"revelarLinhas":[0,1.5]}}}
```

Campos aceitos: `titulo`, `recurso`, `camera` e `corteApos`. O editor não aceita trocar arquivos, tipos de elementos ou caminhos por essa API. Para pesquisa, consulte [pesquisa-assistida.md](pesquisa-assistida.md).

## Contrato da interface

A identidade continua em `docs/design-system.md`, `marca/tokens.json` e nas variáveis da página existente; nenhum token de marca foi substituído. A edição usa os mesmos botões `.btn`, formulários nativos, abas e `post()` com token do estúdio. O chat continua sendo o único executor de IA. A ação permanece na cena atual após salvar, devolve o foco ao campo e apresenta o resultado numa região `role="status"`. Controles ficam desabilitados durante a gravação. Erros de validação ou rede preservam os valores; respostas tardias não substituem outro painel. A coleta não inicia ao abrir uma aba.

## Mecanismos, voz e comparação

O editor também oferece dois diagramas explicativos específicos da Lua. Escolhê-los substitui a composição daquela cena, com histórico para desfazer; use apenas se representar a fala. Veja `docs/cena/recursos-visuais.md` e o exemplo `docs/exemplos/fases-da-lua-mecanismo/`.

Correções no roteiro usam cache de narração por frases nos provedores pagos; não é necessário refazer a voz inteira para corrigir uma frase. Confira `docs/narracao-em-blocos.md`, inclusive a escuta das junções e a diferença entre montagem PCM e tempos finais. Mudança no número de palavras ainda exige conferir os intervalos e cortes das cenas.

Depois de gerar novas entregas, **Comparar versões** mostra os vídeos e as diferenças de cenas e QA. Instruções e limites de armazenamento: `docs/comparacao-de-versoes.md`.
