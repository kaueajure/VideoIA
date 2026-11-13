---
name: pauta
description: Escolhe o ângulo de um tema e confere os fatos antes de escrever qualquer roteiro ou slide. Use sempre que a pessoa pedir um vídeo ou carrossel novo.
---



# Pauta e fatos

## Skills sociais integradas
Se o pedido incluir calendário, formatos ou reaproveitamento, use `social-content` de Corey Haines conforme `docs/skills-sociais.md`. Use o material real da página e registre hipóteses sem inventar métricas. Em um pedido de vídeo único, siga diretamente a pauta; não imponha planejamento adicional.


Nada se escreve de cabeça. Um número errado circula em print por anos.

## 0. Estilo e objetivo
Cada vídeo tem um **objetivo** (o que ele quer ser: curiosidade, aula, notícia, venda, tutorial...; decide formato preferido, tamanho do roteiro, abertura, tom, voz, CTA e cuidados) e um **estilo** (a aparência: padrao, pontilhismo, teologia...). Combinam livremente. Rode `npm run objetivos -- --padrao` e `npm run estilos -- --padrao` para saber os da página e `npm run objetivos -- --ver <id>` para ler o objetivo antes de escolher o ângulo. O antigo "modelo" virou esses dois; `Modelo: <id>` em roteiro antigo continua valendo.
- **Pedido que aponta outro objetivo ou estilo** ("faz como aula", "para vender", "para a minha loja", "entenda o caso", "em pontilhismo"): use só neste vídeo (`npm run objetivos` e `npm run estilos` listam os ids e os apelidos). Na dúvida, fique com o padrão e anote no `formato.md` por que.
- Escreva a escolha na linha STATUS do roteiro quando for diferente do padrão: `STATUS: ... Estilo: pontilhismo. Objetivo: aula.` (a skill `roteiro` cria a linha). Só o estilo, sem objetivo, usa o jeito de roteiro próprio do estilo. O linter, o plano automático e o vídeo leem essa linha.
- Aplique já os **cuidados** do objetivo: `fontesMinimas`, `fonteOficial` (pelo menos uma fonte de órgão oficial ou artigo revisado), `atribuicao: sempre` (toda afirmação vinculada à fonte nos arquivos de pesquisa, sem citar a fonte na narração), `temasBloqueados` (recuse e explique) e `avisoFalado` (a frase entra no roteiro).

As fontes não entram na fala: registre links, autores, instituições e evidências em `fontes.md` e `fontes.json`. Escreva os fatos diretamente, preservando hipóteses, estimativas e a condição de investigação. Veja `docs/identidade-e-voz.md`, seção "Fontes fora da narração".

## 1. Entenda o tema
Se a pessoa deu só o assunto ("tampa de bueiro"), assuma o resto e diga em uma linha o que assumiu: objetivo e estilo, série (cotidiano, dinheiro, tecnologia ou caso; a página é uma só), formato (o `formato.padrao` do objetivo quando a árvore empata; nunca um dos `proibidos`), ângulo provável. Não faça formulário.

## 1b. Política: a linha editorial da página
Se o tema é político (governo, Congresso, eleição, partido, STF, político nomeado), rode `npm run linha -- --ver`.
- Se aparecer "ainda não foi escolhida", pergunte uma vez, com as opções prontas: "Em política, sua página tende a algum lado? neutra (padrão, sem lado), esquerda, centro ou direita? E com que força: leve (padrão) ou moderada?". Grave a resposta com `npm run linha -- <linha> <intensidade>` e siga. É decisão de marca: não escolha pela pessoa.
- Aplique a linha **na escolha do ângulo** (passo 3): entre recortes verdadeiros do mesmo fato, fique com o que conversa com a linha; o fato central do outro lado entra no `fontes.md` e no roteiro, atribuído. Regras completas e limites em `docs/identidade-e-voz.md`, seção "Linha editorial em política": nunca inventar ou distorcer fato ou número, tudo atribuído, sem ataque pessoal nem desinformação, regras das plataformas e da Justiça Eleitoral em período eleitoral.

## 2. Pesquise
Pesquise na web aberta, em **qualquer fonte acessível**, sem lista fixa de domínios. Varie buscadores, termos e idiomas; consulte a origem e avalie autoria, contexto, data e credibilidade. Cruze o assunto em pelo menos **duas fontes independentes**; duas são o mínimo, não o limite de pesquisa. Priorize evidência primária quando disponível, mas use também imprensa, sites especializados, livros, arquivos, artigos e publicações sociais para localizar e comparar evidências. Não aceite uma alegação só porque encontrou um link. Anote o número, o que cada fonte disse e o link em `projetos/<nome>/fontes.md`.
- Número que uma fonte confirma e outra contradiz: não entra, ou entra com a ressalva ("cerca de").
- Controvérsia real na ciência: diga que há debate. Nuance protege o perfil de comentário corretivo.
- Fonte que não abriu: escreva isso. Nunca finja ter conferido.
- Política: registre também o que o outro lado diz (nota oficial, defesa, dado contrário), com fonte. Ele entra no roteiro, nem que seja numa frase.
- Para fotos, siga `pesquisa-visual`: pesquise também fora de Commons/Wikipédia, compare candidatos em tamanho real e confira identidade, evento, data, local e qualidade. O comando aceita `--url` de outros sites com origem e condições de uso registradas. Não aceite automaticamente o primeiro resultado.
- Imagem real que o tema pede (rosto de quem está no centro do caso, prédio, logo de empresa ou órgão): busque com `node scripts/buscar-imagem.mjs <projeto> "<nome + contexto do tema>" --listar` (e `--logo`). Você filtra os candidatos pela relação com o tema (título/descrição e, se baixar, a própria imagem); só então mostre à pessoa e baixe com `--escolha=N`. Homônimo de outro domínio não entra. Registra em `fontes.md`. Se a tela vai pedir um objeto ou um lugar que o repertório não tem, anote: a skill `cena` cria em `projetos/<nome>/pecas.js`. Nunca troque o assunto por uma peça genérica só porque é o que existe.
- Se o projeto já tem `assets/referencias/` ou `referencias.md` (fotos que a pessoa anexou no estúdio), anote na pauta em qual trecho cada uma deve aparecer; a skill `cena` confirma olhando a imagem. Não peça foto de novo do que já foi anexado.

Quando a cena precisar de imagem de um acontecimento, registre em `fontes.md` os elementos que o identificam e use `pesquisa-visual` para orientar a seleção. Se a pesquisa visual estiver na etapa de roteiro, leve essa identificação para ela.

## 3. Ache a contradição
O bom conteúdo cabe em "todo mundo acha X, mas é Y". Se não completa a frase, o ângulo está fraco: proponha outro recorte em vez de escrever algo morno.
- Responda **"por que isso é curioso?"** em uma linha. Prefira o recorte que a mãe e a avó também achariam interessante (topo de funil), com nome que todo mundo conhece e palavras do povo (`docs/ganchos.md`, "O que a aula ensina").
- Esboce **3 ganchos possíveis** e confira se cada número e fato deles está no `fontes.md`. Gancho que só fica forte exagerando o fato está proibido: troque o ângulo, não o fato. Para vídeo, guarde os esboços em `projetos/<nome>/formato.md`, em `## Ganchos`, com uma opção por linha. Preserve as outras seções do arquivo. Inclua o gancho fornecido pela pessoa, se houver. A skill `roteiro` vai aproveitar esses esboços e registrar as três opções definitivas em `GANCHOS:`.

## 4. Escolha o esqueleto
- **Revelação**: crença comum, mecanismo, número que prova, virada. Serve para quase tudo.
- **Lista**: promessa numerada, um item por cena, itens independentes.
- **Antes e depois**: regra, preço ou lei que mudou.

## 5. Entregue (sem pedir aprovação)
Escreva `fontes.md` e siga direto para a skill `roteiro` (vídeo) ou `carrossel`. Se houver risco de erro factual que você não conseguiu resolver, pare e diga qual número está em dúvida.

## Navegador: nunca
Você NUNCA abre, controla nem tira print do navegador da pessoa (nem o Chrome, nem o Safari, nem o Edge, nem o controle de navegador do aplicativo), para "mostrar o roteiro no estúdio" ou para qualquer outra coisa. O estúdio web se atualiza sozinho: ele vigia a pasta e começa o vídeo quando o roteiro chega. Já aconteceu de o assistente tentar controlar o Chrome, a janela da frente ser outro site e as tentativas só se repetirem. Para saber o estado, rode comando, nunca olhe a tela: `npm run status` (projetos e o próximo passo) ou `npm run comece -- --situacao --json` (que também diz a pasta exata do estúdio em uso, para conferir que é a mesma aberta no aplicativo). Se o estúdio parecer parado, confira se o `roteiro.md` está em `<pasta do estúdio>/projetos/<nome>/` e peça à pessoa o botão "Não está andando? Copiar diagnóstico do primeiro vídeo". Pediu "tenta de novo" e nada mudou: não repita; rode o comando de estado.

## Registro factual do vídeo
Para vídeos, siga `docs/fontes-factuais.md`: a pesquisa alimenta `fontes.json`, com afirmações, evidências realmente consultadas, datas e ressalvas. Preserve `fontes.md` para notas e créditos. Depois do roteiro definitivo, vincule cada fala aos ids e rode `npm run fontes -- <projeto> --exportar`. Nunca marque como verificado só porque encontrou uma URL.


## Edição localizada e pesquisa assistida
Consulte `docs/edicao-e-direcao.md` ao corrigir uma cena: use o editor com a revisão atual, preserve voz e trechos válidos, confira também a vizinha se mover um corte e gere entrega nova após revisar a prévia. Para investigar fatos, siga `docs/pesquisa-assistida.md`: buscas por afirmação e evidência contrária, coleta textual, citações exatas e revisão vinculada à versão consultada. Não trate coleta ou registro estrutural como prova semântica.
