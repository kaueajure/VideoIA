---
name: publicar
description: Escreve a legenda, os marcadores e a descrição por plataforma para um vídeo ou carrossel do Estudio de videos já gerado.
---



# Legenda e publicação

## Skills sociais integradas
Use `social-captions` para redigir as plataformas pedidas e `viral-captions-and-ctas` para revisar CTA, hashtags e comentário sugerido. Se a entrega incluir TikTok, Instagram/Reels ou Shorts, refine com `viral-tiktok-content`, `viral-instagram-reels` ou `viral-youtube-shorts` só nessas redes. Leia `docs/skills-sociais.md`; idioma do roteiro e regras locais prevalecem. Para YouTube, mantenha `youtube.json` como fonte única com títulos, descrições, tags e hashtags. Preserve as checagens abaixo; preparar textos não executa publicação.


**Antes de tudo:** leia `projetos/<nome>/saida/entrega.json`. Se estiver ausente, confira o estado do projeto com `npm run status`. Só publique quando `publicavel` for `true`: voz real, QA aprovado e nenhuma linha `PENDENTE` em `fontes.md`. Se houver pendência, identifique-a nos textos como rascunho. Para liberar a publicação, será preciso resolver a fonte ou a afirmação e gerar uma entrega nova. Um pedido só de textos não autoriza alterar roteiro, sintetizar voz ou renderizar: nessa tarefa, preserve o vídeo e relate o que impede a liberação.

**Objetivo do vídeo** (`objetivo` em `entrega.json`; em vídeo antigo, `modelo`; detalhes em `npm run objetivos -- --ver <id>`, ou `npm run estilos -- --ver <id>` quando só houver estilo): siga `publicar.legenda` (o jeito da legenda), use `publicar.hashtags` como base, ponha as fontes na legenda quando `fontesNaLegenda` for true e inclua o `cuidados.avisoLegenda` (ou `publicar.aviso`) quando houver. Com `cuidados.revisaoHumana`, o `entrega.json` sai com `publicavel: false` até a pessoa revisar: diga isso e não publique.

Siga as orientações das plataformas pedidas. Se a entrega for só para YouTube, use a seção de YouTube e os créditos aplicáveis.

## Antes de escrever: palavra-chave (SEO da busca do Instagram)
A busca do Instagram cruza o que a pessoa digita com legenda, nome, bio, hashtags, texto na tela e áudio falado. Guia completo em `docs/seo-legendas.md`. Para cada post, defina e anote no topo do `post.md`:
- **1 palavra-chave principal**: como uma pessoa curiosa pesquisaria o assunto, de preferência uma frase de cauda longa ("por que a tampa de bueiro é redonda", "o que muda se o Lula perder"). Prefira o termo que já aparece no roteiro falado e no título da capa.
- **3 a 4 secundárias**: sinônimos e termos próximos (nomes próprios, instituição, número central do vídeo).

## Legenda (Instagram e Facebook), estrutura de 4 partes
- **1. Gancho com a palavra-chave principal**, nos primeiros 125 caracteres (a única parte visível antes do "mais"). Repete a promessa com outras palavras, nunca o texto da capa. Escreva essa linha por último.
- **2. Contexto, 1 a 3 frases curtas** com as secundárias espalhadas de forma natural: o que não coube no vídeo (a fonte, o número que sobrou, a nuance).
- **3. Valor ou prova**: o dado ou a fonte, atribuído.
- **4. Fecho**: pergunta de opinião (nunca sim ou não), a mesma do último slide ou da cena final, seguida dos marcadores.
- A principal aparece **1 ou 2 vezes**, nunca mais (repetir é keyword stuffing e derruba alcance). Linguagem natural; parágrafos curtos, uma ideia por parágrafo.
- Palavra-chave e marcadores **sempre na legenda**, nunca só no primeiro comentário. Esqueceu algo: edite a legenda.
- Sem pedir curtir ou seguir. Sem "link na bio" se não houver link. Sem emoji no lugar de palavra nem no meio da frase. Sem travessão longo com espaços.
- **Texto alternativo** (Configurações avançadas > Escrever texto alternativo): uma frase simples descrevendo a capa, com a principal só se for honesto. Entregue no `post.md`.
- **Conferência cruzada**: a principal precisa estar também dita no áudio e escrita na tela (título ou capa). Se não estiver, avise para o próximo roteiro.

## Chamada para ação
Responda **o quê** e **por que agora** e use um destes, nesta ordem de preferência: comentário com opinião, compartilhar com alguém específico, salvar (se for conteúdo de consulta). Veja `docs/ganchos.md`.

## Marcadores
3 a 5 (o limite do Instagram é 5), no fim da legenda, específicos do assunto: um do tema, um do nicho (curiosidades) e, quando fizer sentido, um da página. Nada de genéricos como #reels, #explore ou #viral.

## Por plataforma
- **Instagram Reels / Facebook Reels**: legenda completa + marcadores no fim.
- **TikTok**: legenda curta (até ~100 caracteres úteis) + 3 marcadores. Pode usar o carrossel no modo foto.
- **Para YouTube**, antes de escrever a seção, use o pacote `projetos/<nome>/youtube.json`. Siga `youtube` para conferir e reaproveitar o pacote, ou para criá-lo se estiver ausente. Copie para `post.md` o título e a descrição que a pessoa escolheu. Sem escolha, preserve a opção anterior se ela ainda existir no pacote, ou use a primeira de cada lista. Acrescente as hashtags do pacote que ainda não estiverem na descrição.

## Vídeo horizontal (YouTube)
Vídeo feito com `--formato=horizontal` (confira com `node scripts/resumir-relatorio.mjs <nome> --campo=formato`): é para o **YouTube** (não é Reels nem Shorts). Use a opção horizontal do pacote conforme a regra acima. A imagem do post é `saida/miniatura.jpg` (1280 x 720, até 2 MB), não `capa.jpg`. Não há `capa-grid.jpg`. Não escreva "@" nem peça de seguir "no topo" da tela: o horizontal sai sem @ por padrão.

## Entregue
Salve em `projetos/<nome>/post.md` (ou `carrosseis/<nome>/legenda.txt`): palavra-chave principal e secundárias, legenda, marcadores, texto alternativo, seção YouTube com a opção do pacote quando aplicável e o caminho do arquivo. Antes de salvar, passe o checklist da seção 7 de `docs/seo-legendas.md`. Confira que a legenda não afirma nada que `fontes.md` não sustente.

As três opções e as tags do Studio ficam em `youtube.json`. Para um pedido exclusivo de metadados YouTube, use `youtube` diretamente.

## Crédito de fotos
Se o vídeo ou carrossel usa elemento `imagem` com foto de terceiro, a legenda termina com uma linha "Fotos: <autor/agência> (<licença>)", tirada de `fontes.md`. Se usa elemento `video` (b-roll), acrescente "Vídeos: <crédito>" com o texto de "Crédito para a legenda do post" da seção Vídeos de `fontes.md` (Pexels e Pixabay pedem o nome do autor e da plataforma; NASA, "NASA"). O crédito não aparece na tela.

## Revalidar evidências
Antes de preparar uma publicação, rode `npm run fontes -- <projeto> --video --exportar` e confira `saida/entrega.json`. Qualquer mudança em roteiro, fontes, palavras ou cenas invalida o vínculo com a entrega antiga: gere a entrega novamente. Não confunda registros completos com verdade factual; confira se a fala e suas ressalvas são sustentadas pela pesquisa.
