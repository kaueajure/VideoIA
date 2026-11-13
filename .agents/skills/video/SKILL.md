---
name: video
description: Produz o vídeo do Estudio de videos de ponta a ponta, sem paradas de aprovação, a partir de um roteiro.md. Use quando houver um roteiro e a pessoa quiser o MP4.
---



# Vídeo, do roteiro ao MP4

## Gate anti-genérico (obrigatório)
Produção nova só segue se:
1. Existe `storyboard.md` com abertura, mecanismo e virada (estado inicial → ação → estado final).
2. A voz só roda depois desse storyboard.
3. O `cena.json` entregue é **autoral**: sem `"automatica": true`; com `direcao.versao: 2`; beats decisivos com composição executável (não `elementos: []` no gancho, na virada e no fecho).
4. Rodou `node scripts/storyboard-lint.mjs <projeto> --estrito` e leu `saida/analise-direcao.json`.
5. A skill `critico` registrou `revisao-direcao.md` com evidência de movimento (não só a folha).

O plano automático que o CLI cria é rascunho interno. **Entregar automático, ou pular storyboard/cena/crítico, é falha de produção**, mesmo com QA técnico limpo.

## O fluxo
```
roteiro.md + storyboard.md + direcao-visual.json
-> narração e tempos
-> cena.json AUTORAL (substitui o automático)
-> QA + storyboard-lint
-> aprovação das fotos (pessoa)
-> crítico (folha + movimento)
-> render (ou o estúdio web, no pedido PEDIDO-DO-ESTUDIO)
-> QA do arquivo -> capa
```
O QA verifica defeitos técnicos e layout; a qualidade narrativa e o movimento exigem revisão visual. **Fotos e logos reais** são a exceção: a pessoa escolhe o que entra antes do render.

Antes da voz, siga `docs/producao-criativa.md` e `docs/direcao-do-agente.md`: confirme que a ideia permite uma sequência visual interessante e implemente as ações centrais, em vez de planejar apenas imagens de gráficos. Recursos de unidades, decomposição e campo tático estão em `docs/cena/recursos-visuais.md`. Antes da entrega, confira uma prévia curta das ações centrais e os diagnósticos `criatividade.montagem`; uma folha estática não aprova movimento. Nunca apresente um esquema ilustrativo como registro de um lance real.

## Passo a passo
0. **Storyboard e plano visual.** Se faltar `storyboard.md`, escreva agora. Cada ideia narrada: fala, objeto/pessoa, cenário, estado inicial, ação visível, estado final, texto na tela, câmera, continuidade. Se houver foto/logo, complete `direcao-visual.json` com `pesquisa-visual` antes da voz.
1. **Voz.** Veja `ilustrando.config.json` e confira a disponibilidade da voz com `npm run voz -- --situacao`. Sem chave, rode com `--voz=mock` para validar tudo e avise que a narração real ainda falta (isso é bloqueio de ativo, não de qualidade). Provedores: `elevenlabs` (tempos exatos por palavra), `fishaudio` (o motor alinha por Whisper se `faster-whisper` estiver instalado, senão pelas pausas), `arquivo` (sua própria gravação em `projetos/<nome>/narracao.mp3`). O relatório avisa se a voz leu diferente do roteiro ou falou rápido/lento demais. Prefira a direção de voz do objetivo (não só `[calm, clear]` em todo vídeo).
2. **Narração e tempos.** `node src/video/cli.mjs <projeto> --voz=<x> --sem-render` gera `narracao.mp3` e `palavras.json` e, se não houver `cena.json`, um plano automático. Trate esse plano só como base a reescrever.
3. **Cena autoral.** (Estilos letreiro, interface, colagem, cartões, tubo, impresso, ribalta e mundos: antes de tudo escreva o `pecas.js` do projeto; veja `docs/cena/kit-aberto.md`.) Use a skill `cena` para escrever `cena.json` de verdade: remova `automatica`, cubra `palavras.json` uma vez, `direcao.versao: 2`, `sujeito` e `direcao` por beat, protagonista com `id` estável. Se houver `assets/referencias/` ou `referencias.md`, encaixe cada foto **uma vez** no beat certo.
4. **QA da cena.** Rode de novo com `--sem-render`. O QA mede cada elemento em pixels e corrige sozinho títulos longos. Falhas que sobram: corrija no `cena.json`. Confira `saida/relevancia.json` (nota 0 = troque), `criatividade.montagem` / `ritmoVisual` e avisos de foto com `node scripts/resumir-relatorio.mjs <projeto> --campo=avisos --filtro=foto-nao-encontrada` quando houver relatório. Em seguida: `node scripts/storyboard-lint.mjs <projeto> --estrito` e leia `saida/analise-direcao.json`.
5. **Relação com o tema.** Siga `pesquisa-visual` para separar registro do acontecimento e imagem de contexto. Toda foto/logo precisa provar relação com o tema do vídeo e com o trecho da fala. Antes de aceitar qualquer candidato do Commons:
   1. Monte o termo com **nome + contexto do tema** (esporte, clube, seleção, cargo, ano). Nome sozinho é proibido.
   2. Rode `--listar` e leia título, descrição e página de cada candidato. Baixe pelo `--id` escolhido e fixe no beat o `arquivo` devolvido pelo comando.
   3. Descarte o que só bate o nome e muda de mundo (cantor no lugar de jogador, prédio no lugar de agência citada, mapa de outro continente).
   4. Abra o arquivo baixado (Read na imagem) e confira visualmente: a pessoa/lugar certos? Uniforme, estádio, época coerentes?
   5. Se nenhum candidato passa, não force foto: peça/logo/gráfico, ou peça arquivo à pessoa.
   Foto automática do plano (`busca` sem você filtrar) também passa por essa checagem. Relação duvidosa = remove de `assets/`, da cena e de `fontes.md`.
6. **Aprovação das imagens (obrigatória nesta página).** Depois da sua checagem, mostre só as que passaram (quem deveria ser × o que a foto mostra). **Pare e espere** a pessoa marcar entra / sai / trocar. Sem essa resposta, não renderize. **Exceção:** imagens em `assets/referencias/` (campo do estúdio ou anexadas no projeto) já foram escolhidas pela pessoa: use-as sem nova aprovação. Agência de notícia, placar ou conceito: prefira logo, peça ou gráfico, nunca prédio genérico.
7. **Crítico.** Siga a skill `critico` sobre `saida/qa/folha.jpg` e prévia curta dos trechos centrais (`--rapido` ou `--foto=`). Até 3 rodadas. Grave `revisao-direcao.md`. Se a folha mostrar pessoa ou lugar errado, trate como defeito grave.
8. **Render.** Fora do `PEDIDO-DO-ESTUDIO.md`, rode sem `--sem-render`. No pedido do estúdio web, **não** renderize o MP4 final: deixe o estúdio web fazer depois da cena autoral e do crítico. Use `--rapido` antes do final quando quiser conferir movimento.
9. **Entrega.** `saida/<nome>.mp4` (quando você renderizou), `saida/capa.jpg`, `saida/capa-grid.jpg` (no horizontal, `saida/miniatura.jpg`), `saida/relatorio.json` e `saida/entrega.json`. Confira `node scripts/resumir-relatorio.mjs <projeto>`. Depois, skill `publicar` (reaproveita ou chama `youtube`).

## Estilo e cor da marca (0.6.44)
- **O estilo pedido vale.** Ordem: o que a pessoa pediu neste vídeo (`--estilo`, `Estilo:` no STATUS) > o padrão escolhido no estúdio (`estiloPadrao`) > o que o objetivo sugere. A cena automática guardada é refeita sozinha quando o estilo muda (aviso `cena-refeita-estilo`). Se você escreveu o `cena.json` à mão, ponha nele `"estilo"` igual ao pedido; o aviso `cena-de-outro-estilo` no relatório quer dizer que a cena é de outro estilo: reescreva no estilo pedido antes de entregar. Nunca troque o estilo pedido por outro.
- **A cor da marca** vem só de `marca/tokens.json` (`npm run marca -- --ver` mostra a cor). Aviso `marca-fora-do-lugar`: a pessoa (ou um assistente) escreveu a cor em outro arquivo; conte a ela e, com o ok, rode a skill `marca`. Aviso `estilo-sem-cor-da-marca`: o estilo é preto e branco por desenho (pontilhismo, linhas, anatomia, fino, preto-branco, impresso); diga isso em uma frase neutra, sem tratar como erro ("este estilo é preto e branco; para usar a cor da marca, escolha outro estilo"). Não colorir esses estilos por conta própria. Cor só para um vídeo, a pedido: `"destaque": "#RRGGBB"` no `cena.json` (vence a marca e o estilo).

## Formato
O padrão é vertical. Para vídeo horizontal, conversão, alterações na legenda ou no @, consulte [Formato e conversão](formato.md). Considere o pedido, o STATUS e `formatoPadrao`.

## Quando parar e perguntar
Só quando falta chave de voz, falta um ativo real, **há foto/logo para a pessoa aprovar**, ou uma falha resiste a 3 rodadas.
Erro do estúdio com código (`ffmpeg-falhou`, `voz-eleven-cota`...): só a lista segura da skill `comece`, seção "Quando o estúdio devolver um erro" (2 tentativas, sem mexer em `src/` nem gastar crédito pago sem perguntar).


## Aviso de versão nova
Se a saída do estúdio trouxer uma linha que começa com `Aviso do estúdio: a versão`, repita para a pessoa na sua primeira resposta, em uma frase, com o passo de atualizar que a própria linha traz, e siga o trabalho normalmente. Não pare e não atualize sozinho: a atualização é sempre com o arquivo da compra, a pedido dela. Versões antigas ainda têm falhas já corrigidas nas novas.

## Direção e acabamento
Garanta que o primeiro elemento apareça em até 0,9 s em cada beat. Consulte [Acabamento](acabamento.md) na seção do estilo escolhido ou para ajustar som e trilha. Em vídeos com pontos ou estilos de motion, siga também a verificação de quadros do render indicada no guia.

## Navegador: nunca
Você NUNCA abre, controla nem tira print do navegador da pessoa (nem o Chrome, nem o Safari, nem o Edge, nem o controle de navegador do aplicativo), para "mostrar o roteiro no estúdio" ou para qualquer outra coisa. O estúdio web se atualiza sozinho: ele vigia a pasta e começa o vídeo quando o roteiro chega. Já aconteceu de o assistente tentar controlar o Chrome, a janela da frente ser outro site e as tentativas só se repetirem. Para saber o estado, rode comando, nunca olhe a tela: `npm run status` (projetos e o próximo passo) ou `npm run comece -- --situacao --json` (que também diz a pasta exata do estúdio em uso, para conferir que é a mesma aberta no aplicativo). Se o estúdio parecer parado, confira se o `roteiro.md` está em `<pasta do estúdio>/projetos/<nome>/` e peça à pessoa o botão "Não está andando? Copiar diagnóstico do primeiro vídeo". Pediu "tenta de novo" e nada mudou: não repita; rode o comando de estado.

## Liberação factual
Siga `docs/fontes-factuais.md`. Antes da voz final, confira o registro do roteiro; depois da cena, rode `npm run fontes -- <projeto> --video --exportar`. A prévia continua disponível com pendências. A entrega só é publicável com `fontes.json` completo e vinculado ao roteiro, à voz e às cenas atuais, além das condições existentes. Projetos antigos precisam migrar as fontes; não dispense o registro para publicar.


## Edição localizada e pesquisa assistida
Consulte `docs/edicao-e-direcao.md` ao corrigir uma cena: use o editor com a revisão atual, preserve voz e trechos válidos, confira também a vizinha se mover um corte e gere entrega nova após revisar a prévia. Para investigar fatos, siga `docs/pesquisa-assistida.md`: buscas por afirmação e evidência contrária, coleta textual, citações exatas e revisão vinculada à versão consultada. Não trate coleta ou registro estrutural como prova semântica.

## Mecanismos, narração e versões
Ao corrigir vídeos, consulte `docs/narracao-em-blocos.md` e `docs/comparacao-de-versoes.md`. Preserve blocos de voz válidos; não use refazer integral para uma correção local. Confira palavras.json e cortes após mudar a fala. Para mecanismos específicos, consulte `docs/cena/recursos-visuais.md`: os modelos da Lua são esquemas fora de escala, sem eclipses, e não substituem direção específica de outros assuntos. Compare a nova entrega com a anterior; menos avisos não comprova melhoria artística ou factual.
