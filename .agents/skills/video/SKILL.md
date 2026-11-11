---
name: video
description: Produz o vídeo do Estudio de videos de ponta a ponta, sem paradas de aprovação, a partir de um roteiro.md. Use quando houver um roteiro e a pessoa quiser o MP4.
---



# Vídeo, do roteiro ao MP4

## O fluxo
```
roteiro.md -> narração -> tempos por palavra -> cena.json (você escreve) -> QA automático
-> aprovação das fotos (pessoa) -> crítico visual (você olha a folha de contato) -> render -> QA do arquivo -> capa
```
O QA decide qualidade e layout. **Fotos e logos reais** são a exceção: a pessoa escolhe o que entra antes do render.

## Passo a passo
1. **Voz.** Veja `ilustrando.config.json` e confira a disponibilidade da voz com `npm run voz -- --situacao`. Sem chave, rode com `--voz=mock` para validar tudo e avise que a narração real ainda falta (isso é bloqueio de ativo, não de qualidade). Provedores: `elevenlabs` (tempos exatos por palavra), `fishaudio` (o motor alinha por Whisper se `faster-whisper` estiver instalado, senão pelas pausas), `arquivo` (sua própria gravação em `projetos/<nome>/narracao.mp3`). O relatório avisa se a voz leu diferente do roteiro ou falou rápido/lento demais.
2. **Narração e tempos.** `node src/video/cli.mjs <projeto> --voz=<x> --sem-render` gera `narracao.mp3` e `palavras.json` e, se não houver `cena.json`, um plano automático.
3. **Cena.** (Estilos letreiro, interface, colagem, cartões, tubo, impresso, ribalta e mundos: antes de tudo escreva o `pecas.js` do projeto; veja `docs/cena/kit-aberto.md`.) A skill `cena` indica quais trechos de `palavras.json` e da documentação consultar. Se houver `assets/referencias/` ou `referencias.md`, a skill `cena` lê as fotos e encaixa cada uma **uma vez** no beat certo (já aprovadas pela pessoa). Use a skill `cena` para escrever `cena.json` de verdade, no lugar do plano automático.
4. **QA da cena.** Rode de novo com `--sem-render`. O QA mede cada elemento em pixels e corrige sozinho títulos longos. Falhas que sobram: corrija no `cena.json`. Confira também `saida/relevancia.json` (fala x imagem, nota de 0 a 3 por beat; nota 0 = objeto sem relação, troque) e procure avisos de foto com `node scripts/resumir-relatorio.mjs <projeto> --campo=avisos --filtro=foto-nao-encontrada` se houver relatório da execução atual. Se o relatório ainda não foi gravado, use a saída do QA.
5. **Relação com o tema.** Siga `pesquisa-visual` para separar registro do acontecimento e imagem de contexto. Toda foto/logo precisa provar relação com o tema do vídeo e com o trecho da fala. Antes de aceitar qualquer candidato do Commons:
   1. Monte o termo com **nome + contexto do tema** (esporte, clube, seleção, cargo, ano). Nome sozinho é proibido.
   2. Rode `--listar` e leia título, descrição e página de cada candidato. Baixe pelo `--id` escolhido e fixe no beat o `arquivo` devolvido pelo comando.
   3. Descarte o que só bate o nome e muda de mundo (cantor no lugar de jogador, prédio no lugar de agência citada, mapa de outro continente).
   4. Abra o arquivo baixado (Read na imagem) e confira visualmente: a pessoa/lugar certos? Uniforme, estádio, época coerentes?
   5. Se nenhum candidato passa, não force foto: peça/logo/gráfico, ou peça arquivo à pessoa.
   Foto automática do plano (`busca` sem você filtrar) também passa por essa checagem. Relação duvidosa = remove de `assets/`, da cena e de `fontes.md`.
6. **Aprovação das imagens (obrigatória nesta página).** Depois da sua checagem, mostre só as que passaram (quem deveria ser × o que a foto mostra). **Pare e espere** a pessoa marcar entra / sai / trocar. Sem essa resposta, não renderize. **Exceção:** imagens em `assets/referencias/` (campo do estúdio ou anexadas no projeto) já foram escolhidas pela pessoa: use-as sem nova aprovação. Agência de notícia, placar ou conceito: prefira logo, peça ou gráfico, nunca prédio genérico.
7. **Crítico.** Siga a skill `critico` sobre `saida/qa/folha.jpg`. Até 3 rodadas. Se a folha mostrar pessoa ou lugar errado, trate como defeito grave: troque a foto e refaça, não ignore.
8. **Render.** Rode sem `--sem-render`. Use `--rapido` para uma prévia de baixa resolução se quiser conferir o movimento antes do render final.
9. **Entrega.** `saida/<nome>.mp4`, `saida/capa.jpg` (gancho em letras grandes) e `saida/capa-grid.jpg` (recorte 3:4 do grid; no horizontal, `saida/miniatura.jpg` de 1280 x 720), `saida/relatorio.json` e `saida/entrega.json` (manifesto: `publicavel` só é `true` com voz real, QA aprovado e sem `PENDENTE` em fontes.md). Confira `node scripts/resumir-relatorio.mjs <projeto>`. Se houver falhas, leia `--campo=falhas` e corrija antes de entregar. Depois, siga a skill `publicar`. Ela reaproveita o pacote `youtube.json` ou chama `youtube` quando precisar dele.

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
