---
name: roteiro
description: Escreve o roteiro narrado de um vídeo curto do Estudio de videos. Use depois da pauta.
---



# Roteiro

## Skills sociais integradas
Antes de liberar o roteiro definitivo para a voz: use `viral-hooks` ao montar ou criticar as três opções de `GANCHOS:`; aplique `viral-short-form` para revisar gancho, desenvolvimento e conclusão; se o pedido citar TikTok, Reels ou Shorts, consulte só a skill da rede (`viral-tiktok-content`, `viral-instagram-reels`, `viral-youtube-shorts`). Consulte `docs/skills-sociais.md` e `docs/identidade-e-voz.md`, preserve as três opções no formato GANCHOS e registre o diagnóstico em `revisao-roteiro.md`, fora da fala. Fatos, ressalvas, frases fixadas e faixas do objetivo prevalecem sobre fórmulas de retenção.


Use a ficha do objetivo, a seção do formato escolhido em `docs/formatos.md` e a rubrica de `docs/ganchos.md`. Para `curiosidade`, o padrão é 150 a 230 palavras e cerca de 55 a 80 segundos. A faixa é uma sugestão. O linter exige nota mínima 70.

## 0. O objetivo manda nos números
O vídeo tem um estilo (a aparência) e um objetivo (o que ele quer ser). Valem nesta ordem: `Estilo: <id>. Objetivo: <id>.` na linha STATUS do roteiro (a `pauta` decide), senão `estiloPadrao` e `objetivoPadrao` de `ilustrando.config.json`, senão objetivo `curiosidade` com o estilo que ele sugere. Só o estilo, sem objetivo: vale o jeito de roteiro próprio do estilo. Roteiro antigo com `Modelo: <id>` continua valendo. Leia com `npm run objetivos -- --ver <id>` (ou `npm run estilos -- --ver <id>`) e siga o que diz, no lugar dos números padrão desta skill:
- `roteiro.palavras` e `alvoSegundos`: a faixa do texto (o linter mede contra ela).
- `formato.preferidos`, `padrao` e `proibidos`: entram na escolha do passo 1.
- `roteiro.estrutura`: os blocos, em ordem; os `obrigatorio` não podem faltar. `gatilhos`: escolha 1 ou 2 desta lista.
- `abertura3Tempos` e `loopAberto` orientam a abertura e a lacuna. Aplique os blocos obrigatórios da ficha conforme a seção Abertura e fecho.
- `tom`, `pessoa`, `vocabulario` e `alfinetadas`: o jeito de falar. `proibir`: expressões que o linter reprova.
- Use `voz.direcao` quando o provedor aceitar tags de tom. Para ElevenLabs v3 ou v4, consulte [Marcações de voz](voz.md).
- `cta`: o convite final. `comentar` usa o `cta.texto` do config (veja a estrutura abaixo); os outros tipos usam o `cta.texto` do objetivo (salvar, compartilhar, visitar, link) e a `perguntaFinal`. `CTA: simples` no STATUS continua dispensando.
- `cuidados.avisoFalado`: frase obrigatória no roteiro (o linter cobra).
Escreva na linha STATUS o estilo e o objetivo quando não forem os padrões da página: `STATUS: ... Estilo: papel. Objetivo: aula. Formato: passo a passo.` Se a pessoa pediu vídeo **horizontal** ("na horizontal", "para o YouTube", "16:9"), acrescente `Orientação: horizontal.` (o `Formato:` continua sendo o formato do roteiro); no horizontal o vídeo sai sem @ (para ligar: `@: sim.`) e a legenda é opcional (`Legenda: não.`). O roteiro para YouTube pode passar de 60 s e ter o gancho nos primeiros 15 s; veja `docs/formato-horizontal.md`.

Na direção visual dos vídeos novos, mantenha o mesmo objeto enquanto a fala explica a mesma coisa. Oriente a cena a repetir a peça com o mesmo `id` entre beats, usando `efeitos.continuidade: true`; uma mudança de frase não exige fazer o objeto sair e entrar.

## 1. Escolha o formato
Use a árvore de `docs/formatos.md` (revelação, mito x fato, comparativo, antes e depois, ranking, número impossível, passo a passo, causa e efeito). Registre em `projetos/<nome>/formato.md` o nome do formato e por que, preservando os esboços da pauta em `## Ganchos`.

## 2. Escolha o gatilho do gancho, de forma explícita (3 opções, obrigatório)
Um ou dois dos 9 (PD, PT, EE, CI, EN, UO, HE, EM, CC). Antes, responda em uma linha: **por que isso é curioso?** Se não houver um ponto de diferença, volte à `pauta`. Depois:
1. **Reaproveite os esboços da pauta** em `formato.md` e ajuste ou complete até ter três opções de gatilhos ou ângulos diferentes (ex.: um número que não bate, uma pergunta de mito, um nome conhecido com contraste). Use as técnicas de `docs/ganchos.md`, seção "O que a aula ensina": palavras do povo, nome conhecido, escada de surpresa, nome gigante + coisa banal + "por quê?", história com virada prometida.
2. **Teste cada um**: primeira frase de até 12 palavras; tensão nas 8 primeiras palavras (número, pergunta curta, contraste ou conflito); dois ingredientes; nada morno ("Você sabia", "Hoje vamos falar", "Neste vídeo", "Vou te contar"); fato direto, fontes fora da fala; nenhum adjetivo vazio ("incrível", "interessante").
3. **Escolha o mais provocativo que continue verdadeiro**: todo número e fato do gancho está no `fontes.md`, o vídeo entrega o que ele promete, sem promessa de renda, sem adjetivo sobre pessoa ("desesperado", "ladrão"), sem ataque pessoal, sem desinformação e dentro das regras da Justiça Eleitoral. Em política, linha direita leve: o ângulo provoca, o fato não muda. Entre dois igualmente fortes, fique com o mais específico. Se a pessoa fixou um gancho, use-o como primeira frase narrada e como a opção escolhida. Aponte qualquer conflito com as fontes.
4. **Registre os 3 no `roteiro.md`**, na segunda linha (depois do STATUS), numa linha só:
   `GANCHOS: A) <opção 1> | B) <opção 2> | C) <opção 3> | escolhido: B (por quê, em poucas palavras)`
   O motor não narra essa linha. O linter avisa se ela faltar, se tiver menos de 3 opções ou se a primeira frase do roteiro não for uma delas, e dá nota ao gancho escolhido.
Anote também o gatilho no `formato.md`. O gancho cabe em uma respiração (3 a 5 s) e começa pelo fato.

## 2a. Padrões de gancho para curiosidade (24/10/2026)

Em todo roteiro novo, acrescente `Gancho: curiosidade-v2.` à linha STATUS. Roteiros antigos não são remarcados. O linter versionado cobra assunto concreto e nota de atenção de pelo menos 6/10, além das regras editoriais existentes.

Varie entre lacuna aberta, número que não bate, detalhe que quase ninguém percebe, observação cotidiana ("Você já reparou que..." com objeto nomeado), provocação sobre o objeto e identificação com uma consequência. Escolha um mecanismo, não uma senha para o linter. "Você já reparou nisso?" e "O segredo que ninguém te conta" reprovam por falta de assunto. Use os exemplos e a rubrica de `docs/ganchos.md`; a nota não verifica fatos nem prevê alcance.

Quando houver referência de desempenho observável, leia a skill `referencia` e registre estrutura, ritmo e gancho antes de adaptar. Aplique o padrão ao refinar as três opções autorais do nosso tema; não copie falas, imagens, voz ou música. Sem referência assistida ou números disponíveis, declare essa limitação. Sem promessa para o final e sem adjetivo vazio.

## Abertura e fecho
- Comece pelo fato, com uma lacuna clara e o nome reconhecível quando ele for relevante. Depois do gancho, avance para o contexto ou o mecanismo. Evite “Eu te ilustro”, “E no final” e promessas genéricas. Se o objetivo exigir uma promessa concreta como parte da estrutura, siga a ficha dele.
- O gancho abre a pergunta que a virada responde. O vídeo precisa cumprir essa promessa.
- Feche com pergunta específica, escolha concreta ou envio adequado ao tema. Varie fórmulas como “o outro lado”, “ou seja” e “o detalhe”.
- Em política, notícia, checagem de boatos, economia ou abertura baseada em uma dor cotidiana, consulte a seção pertinente de [Casos editoriais](casos-editoriais.md).

## 3. Estrutura (anatomia: hook, envolvimento, chamada)
1. **Gancho** (atenção).
2. **Mecanismo (20 a 35 s)** em causa e efeito: contexto, ruptura, explicação, resultado. Um passo por frase curta.
3. **Gap de informação**: abra uma pergunta num ponto e só a feche no seguinte.
4. **Re-hook por volta de 55%**: um número novo, uma virada, uma mudança de objeto.
5. **Virada (5 a 10 s)**: o detalhe que recontextualiza. Sem virada, o tema é fraco: volte à `pauta`.
6. **Fecho com chamada (3 a 5 s)**: responde "o quê" e "por que agora". Pergunta de opinião, nunca sim ou não. **CTA em 3 variantes (teste A/B, aprovado em 23/10/2026):** `cta.variantes` e `cta.rodizio` em `ilustrando.config.json`. Escreva `CTA: pergunta`, `CTA: padrao` ou `CTA: metodo` na linha STATUS, seguindo o rodízio a partir do último projeto. `pergunta` = uma pergunta curta ou divisão clara + envio específico ("manda pra quem ainda acredita nisso"), sem pedir para seguir nem vender (padrão em política). `padrao` = o `cta.texto` fixo. `metodo` = só em tema de criar vídeo ou página, sem prometer número de seguidores. **Um pedido só por fim.** Só dispense com `CTA: simples` no STATUS.

## 3b. Tom: acidez leve e nome quente
- Notícia em alta: o nome que bombou abre o roteiro (primeiros 3 s) e vai para a capa.
- Uma ou duas alfinetadas no roteiro, em frase curta, apontando incoerência ou contraste dos fatos (nunca insulto, nunca adjetivo sobre pessoa). Em política, aplique [a linha editorial](casos-editoriais.md#linha-editorial).

## 3d. Pense na tela enquanto escreve
Se o roteiro pede um objeto, um lugar ou um mundo que o repertório não tem, ele vai existir: a skill `cena` cria em `projetos/<nome>/pecas.js` (checklist de `docs/repertorio-3d.md`), e foto ou logo real vem de `scripts/buscar-imagem.mjs`. Nunca troque o assunto por uma peça genérica só porque é o que existe.

**Foto pelo nome (0.6.12).** Escreva pelo nome o que precisa aparecer em foto: pessoa ("o presidente Lula"), lugar ("a Torre Eiffel"), obra, evento, marca ou produto ("o iPhone"). O estúdio acha sozinho a foto de licença livre (Wikipédia, Wikimedia Commons, Openverse) e o logo das marcas da biblioteca, e registra o crédito em `fontes.md`. Personagem de exemplo leva só o primeiro nome ("a Ana ganha R$ 3.000") e nunca vira foto de alguém real. Para o objeto 3D, nomeie a coisa concreta ("o cofre do banco", "o pão"), não só a ideia.

## Fontes fora da narração
A fala conta o fato e explica o mecanismo, sem anunciar de onde veio a informação. Não escreva chamadas como "segundo a fonte", "de acordo com o estudo", "conforme o relatório" nem leia links, referências bibliográficas ou listas de instituições. Registre a pesquisa em `fontes.md` e `fontes.json`; referências para o público vão na descrição ou legenda da publicação. Essa regra vale também quando o objetivo traz `cuidados.atribuicao: sempre`: a atribuição fica no registro de pesquisa, fora da voz.

Preserve o sentido e o grau de certeza: hipótese continua hipótese, estimativa continua estimativa e investigação não vira condenação. Em casos em andamento, prefira uma formulação direta como "A investigação apura uma suspeita de fraude". Se uma frase só faz sentido como uma acusação sem contexto, reescreva ou omita o trecho. Um órgão ou pesquisador pode aparecer quando for o próprio assunto ou autor da ação narrada; não o acrescente apenas como selo de autoridade. Não apague palavras automaticamente da fala pronta, pois isso pode mudar o sentido.

## 4. Como escrever
- Média de 8 a 10 palavras por frase, nenhuma acima de 22.
- Pelo menos 3 números concretos (mediana dos virais: 6 a 7) e uma virada interna a cada 80 palavras ("Mas", "Agora", "Aqui está o detalhe").
- Frases curtas, uma ideia cada. Conversa, não aula ("primeiro faça isso, segundo aquilo" cansa).
- Sustente toda afirmação nos registros de pesquisa. Na narração, explique a causa ou o mecanismo sem recitar fontes. Preserve a incerteza quando ela fizer parte do fato.
- Números: pode escrever como se lê na tela ("R$ 100", "40h", "71%", "6x1", "17/10/2026", "2 GB"); o estúdio converte para a fala ("cem reais", "quarenta horas", "setenta e um por cento") antes de ir para a voz, em ElevenLabs e Fish, e a legenda mostra o que você escreveu. Sigla que a voz leia errado: crie `pronuncia.json` na pasta do projeto ({ "CNI": "cê ene i" }). O linter avisa o que a voz não sabe ler.
- Sem gíria de internet, sem travessão longo com espaços, sem "você sabia que".
- Pontue para a voz: ponto entre ideias, vírgula onde respira.

## 5. Confira e salve
**Leia em voz alta antes de salvar (29/10/2026).** Marque 3 frases que ninguém diria numa conversa e reescreva com a palavra do dia a dia. O linter avisa os moldes mais repetidos ("o detalhe", "Ou seja", "Traduzindo", "Resumindo", "Confira agora", "muda tudo", contraste "não foi X, foi Y") e, olhando os 5 últimos roteiros, o molde que virou marca da página. É aviso, não reprova: reescreva só o que soar falso.
Contagem de palavras, fatos contra `fontes.md`, checklist de `docs/formatos.md`. Antes de liberar a fala final: aplique `viral-short-form` e grave `revisao-roteiro.md`; use `pesquisa-visual` e grave `direcao-visual.json` quando houver foto/logo ou movimento decisivo. **Antes da voz**, escreva `storyboard.md` (uma linha por ideia: fala, objeto, estado inicial, ação, estado final, ganho visual). Sem storyboard, não chame voz. Salve `projetos/<nome>/roteiro.md` (pode ter uma primeira linha `STATUS:` e a linha `GANCHOS:`, que o motor ignora). Se o linter apontar "gancho morno" ou avisos de gancho (primeira frase longa, sem tensão nos 3 primeiros segundos, um ingrediente só), ajuste o gancho conforme a mensagem do linter. Se a pessoa fixou a frase, preserve-a e informe o conflito que precisar de correção. **Não peça aprovação** e siga para a skill `video`.

**Pedido do estúdio web (`PEDIDO-DO-ESTUDIO.md`):** não pare no roteiro. O pedido exige direção completa: `storyboard.md` → voz com `--sem-render` → `cena.json` **autoral** (skill `cena`; remova `automatica`; `direcao.versao: 2`) → QA + `node scripts/storyboard-lint.mjs <projeto> --estrito` → skill `critico` + `revisao-direcao.md` → skill `youtube`. **Não renderize o MP4 final** (o estúdio web faz depois). Entregar só `roteiro.md`/`youtube.json`, ou deixar o plano automático no lugar da cena autoral, é defeito. Diga à pessoa para voltar ao estúdio no navegador.

## Navegador: nunca
Você NUNCA abre, controla nem tira print do navegador da pessoa (nem o Chrome, nem o Safari, nem o Edge, nem o controle de navegador do aplicativo), para "mostrar o roteiro no estúdio" ou para qualquer outra coisa. O estúdio web se atualiza sozinho: ele vigia a pasta e começa o vídeo quando o roteiro chega. Já aconteceu de o assistente tentar controlar o Chrome, a janela da frente ser outro site e as tentativas só se repetirem. Para saber o estado, rode comando, nunca olhe a tela: `npm run status` (projetos e o próximo passo) ou `npm run comece -- --situacao --json` (que também diz a pasta exata do estúdio em uso, para conferir que é a mesma aberta no aplicativo). Se o estúdio parecer parado, confira se o `roteiro.md` está em `<pasta do estúdio>/projetos/<nome>/` e peça à pessoa o botão "Não está andando? Copiar diagnóstico do primeiro vídeo". Pediu "tenta de novo" e nada mudou: não repita; rode o comando de estado.

## Cobertura factual
Depois de finalizar o texto, atualize os trechos de `fontes.json` conforme `docs/fontes-factuais.md`. Toda fala precisa de classificação factual com ids de afirmações, ou editorial com justificativa. Mudou uma negação, um número ou uma ressalva: reavalie a evidência. Rode `npm run fontes -- <projeto> --exportar`; não altere a classificação para contornar pendências.


## Edição localizada e pesquisa assistida
Consulte `docs/edicao-e-direcao.md` ao corrigir uma cena: use o editor com a revisão atual, preserve voz e trechos válidos, confira também a vizinha se mover um corte e gere entrega nova após revisar a prévia. Para investigar fatos, siga `docs/pesquisa-assistida.md`: buscas por afirmação e evidência contrária, coleta textual, citações exatas e revisão vinculada à versão consultada. Não trate coleta ou registro estrutural como prova semântica.
