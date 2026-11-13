---
name: video
description: Produz um vídeo completo do canal a partir de um tema — pesquisa, roteiro com aprovação do usuário, voz no ElevenLabs, cenas 3D com elementos que fazem sentido, trilha e efeitos sonoros sem "AI slop", prévia conferida, render masterizado e arquivo organizado no Google Drive. Use quando o usuário pedir um vídeo novo ("faz um vídeo sobre..."), um roteiro de curiosidade, ou para continuar um vídeo em andamento em videos/.
---

# /video <tema>

Siga o pipeline do `CLAUDE.md`. Fale com o usuário em português. As regras abaixo vieram de pedidos e correções do usuário: trate-as como requisitos, não sugestões.

## 0. Situação
- `MARCA.assinatura` em `src/config.ts` ainda é `SEU CANAL`? Primeiro uso: rode a skill `/estilo` com o usuário antes de tudo.
- `npm run status` — se já existe um vídeo sobre o tema, continue de onde parou.

## 1. Pesquisa e roteiro
- **Roteiro pronto do banco** (bônus, pasta `banco-de-roteiros/`; `npm run roteiros` lista): se o usuário citar um número ou um tema que está no banco, crie com `npm run novo -- <slug> --roteiro <n>`, mostre o roteiro e adapte ao público dele se pedir (o banco já tem fontes conferidas; confira de novo só o que mudar). Depois siga o resto deste passo a partir do **PARE**.
- Pesquise (WebSearch/WebFetch), junte 2–4 fontes confiáveis e confira cada número. Fontes vão em `fontes` (ficha do arquivo), **nunca no post**.
- `npm run novo -- <slug> "<Título>"` e escreva `videos/<slug>/video.json`: gancho forte na 1ª frase, 14–20 cenas, uma ideia por cena, texto para ser **falado**, `visual` de cada cena, `capa`, `post`.
- **Duração obrigatória: 1min10s a 2min.** Mire ~300 palavras (≈1min30s com a voz a 1.15). Confira com `npm run status -- <slug>`.
- **Post** (`post.txt`): `post.texto` (gancho do post) + `post.chamada` + `post.hashtags`. A chamada convida a compartilhar com um público ligado ao tema: "Mande para quem vive viajando", "Mande para quem não perde um pôr do sol". Sem fontes, sem links.
- Punchline/pergunta na última palavra de uma cena → `pausaDepois: 0.3–0.8` (o ritmo é rápido e corta logo depois da fala).
- **Fecho variado (pedido do usuário):** rode `npm run fechos` antes de escrever o fim e não repita tipo nem abertura dos últimos vídeos ("Da próxima vez que…, lembra" e "Hoje, quando…" estão desgastados). **Ritmo constante:** `emocao` em blocos de cenas vizinhas, 3–4 trocas por vídeo, nunca alternando cena a cena.
- **Chamada para ação no fim (pedido do usuário, vale para todo vídeo novo):** a última fala termina pedindo uma ação ligada ao tema — comentar uma resposta específica, mandar para alguém, curtir e seguir para o próximo — e a tela mostra `VinhetaFim`/`VinhetaPergunta` nos últimos segundos. Nas séries, depois da frase final fixa.
- Voz expressiva (padrão dos vídeos novos): ponha `emocao` em cada cena, em inglês (`excited`, `curious`, `thoughtful`, `whispers`, `surprised`), variando com o sentido da fala; o usuário pediu voz com entusiasmo, não robótica. **`whispers` é raro** (pedido do usuário): a maioria dos vídeos não tem nenhuma cena com o narrador baixando a voz; use no máximo uma, e só quando o texto pede segredo de verdade.
- **PARE.** Mostre o roteiro (cena por cena, só o texto falado), a duração estimada, a chamada do post e as fontes. Espere o "aprovado".

## 2. Voz (só depois do "aprovado")
- `roteiroAprovado: true` → `npm run voz -- <slug>`. Informe caracteres gastos e duração real. Fora da faixa: ajuste o texto com o usuário (só cenas alteradas são refeitas).
- Ritmo de Reels: voz a 1.15 e 0,12 s entre cenas (config). O usuário achou 1.05 lento. Não "acelere o vídeo" depois: a voz já sai rápida e as cenas se reajustam sozinhas.

## 3. Cenas 3D — densidade COM SENTIDO
- Antes de montar do zero, veja se uma cena pronta serve (`CenaComparacao`, `CenaQuiz`, `CenaMapa`... e as vinhetas; lista no `CLAUDE.md`, "Cenas prontas", vitrine `npm run previa -- pro-cenas`).
- **Todo elemento precisa ilustrar a narração ou o lugar.** Proibido enfeite aleatório: formas geométricas soltas flutuando, partículas sem significado, objetos genéricos para "encher". (O usuário reprovou isso.)
- **Nunca tela vazia:** o assunto aparece desde o quadro 0 da cena; algo novo entra a cada ~1–1,5 s, preso a uma palavra (`quando('palavra')`). O começo da cena é onde o vazio se esconde.
- Camadas, todas com significado: assunto (frente) · apoio (objetos do tema, ex.: livro e mesa de Newton, moléculas N₂/O₂) · cenário (ao ar livre: `ambiente={['nuvens','montanhas']}`, casas, árvores, passarinhos; poeira só onde explica algo, como ar denso ou Marte).
- Partículas só quando representam algo (moléculas do ar, luz espalhada, faíscas de cor).
- Enquadramento vertical: assunto em |x| ≤ 1,0 a ~7 de distância; nada importante na faixa da legenda (y ~1220–1400 px). Personagem encostado na borda = reenquadrar a câmera (alvo).
- Objeto novo reaproveitável → `src/kit/objetos/` + `src/kit/index.ts` + vitrine (`kit-objetos-2`).
- `npm run checar` até passar.

## 4. Som — sem "AI slop"
- **Nada gerado por IA** (nem efeitos do ElevenLabs, nem Suno/Udio). Só material feito por pessoas e com licença comercial; registre origem e licença em `public/LICENCAS.md`.
- Trilha: entra sozinha (padrão do canal em `config.ts > AUDIO`), baixa (~18 dB sob a voz), abafa durante a fala, fade no fim. Outra trilha: `"trilha": {"arquivo": "..."}`.
- **Catálogo de trilhas** `public/trilhas/trilhas.json` (com o Pacote de som, 26 trilhas por `clima`: curioso, alegre, calmo, misterioso, espacial, epico, tenso, lofi): se o assunto pede um clima diferente do padrão do canal, escolha pelo `clima` e diga ao usuário qual trilha escolheu e por quê. Trilha curta (`repete: true`) repete sozinha.
- Efeitos: `<Som tipo="..." em={quadro} />` fora do `<Palco>`, no MESMO quadro do evento visual. Paleta: `surgir`, `texto`, `luz`, `mergulho`, `revelar`, `pergunta`, `brilho`, `ideia`.
- **Catálogo extra** `public/sons/sons.json` (Pacote de som): efeitos por `momento` (impacto, revelar, contagem, ligar, tecnologia, espaco, subir, descer, alerta, erro, objeto, misterio, passo, vinheta) → `<Som arquivo="revelar-sino-1.wav" em={q} />`; ambiências (chuva, vento, mar, pássaros, caverna, grilos) só em cena ao ar livre/lugar, baixinho e por toda a cena: `<Som arquivo="ambiencia-chuva.mp3" em={0} duracao={duracao} intensidade={0.6} />`. Mesmas regras: com sentido e no máximo 1–2 efeitos por cena (ambiência não conta).
- **No máximo 1–2 por cena e só em eventos com significado** (revelação, pergunta, luz viajando, mergulho de câmera, lâmpada acendendo). Cenas calmas ficam só com a música. Proibido: whoosh em todo corte, "ding" em todo texto, sons de meme (vine boom, buzina, risada), efeitos empilhados.
- A master (-14 LUFS, pico -1,5 dBTP) é automática no render.

## 5. Prévia (obrigatória)
- `npm run previa -- <slug> --momentos 0.06` (começos), depois `0.5` e `0.94`; leia `saida/previa/folha.png` a cada vez.
- O script avisa "quadro quase vazio"; mas o critério é o seu olhar: assunto cortado, legenda sobre o assunto, textos sobrepostos, cena magra, enfeite sem sentido.
- Detalhe uma cena com `--cena <id>`. Repita até ficar bom.

## 6. Render, capa e arquivo
- `npm run render -- <slug>` → MP4 masterizado, capa, storyboard, `legenda.srt`, `post.txt`. Leia `saida/capa.png` (escolha `capa.momento` com o assunto completo em cena) e confira o `post.txt`.
- **Flicker (pedido do usuário: nada pode piscar).** O render termina com `✔ Sem flicker` ou `! FLICKER` (cena, segundos, região em px). Com aviso, NÃO arquive: veja os quadros (`npm run previa -- <slug> --quadros N-1,N,N+1 --limpa` e compare), ache a causa (superfícies coincidentes = z-fighting, valor saltando de quadro em quadro, objeto que aparece/some num quadro só), corrija e renderize de novo até sair limpo.
- **Carrossel, capa do YouTube e story (Estúdio Pro)** — depois do render, se o usuário quiser: escreva `carrossel` no `video.json` com textos próprios para **ler** (não copie a narração): 3 a 8 lâminas do meio (`cena`, `texto`, `momento` opcional), uma ideia por lâmina, até ~120 caracteres, números em algarismos, `*trecho*` na palavra-chave; a sequência conta a história sozinha para quem não viu o vídeo e termina numa revelação. Escolha cenas cujo quadro mostra aquela ideia (o padrão é o fim da cena; use `momento` quando o melhor quadro vem antes ou quando um rótulo baixo da cena fica atrás do texto). `chamada` é opcional (padrão: `post.chamada`). Rode `npm run carrossel -- <slug>` e **leia** `saida/carrossel-folha.png`, `saida/carrossel/capa-youtube.png` e `saida/carrossel/story.png`: texto legível no celular, nada cortado, imagem que combina com o texto, rótulo da cena sem brigar com o texto. Ajuste `momento`/texto e rode de novo até ficar bom. Escrever o carrossel não pede render novo; o `arquivar` leva a pasta junto.
- **Ao final de todo vídeo, se o Google Drive para computador estiver instalado (o `npm run status` mostra a linha `drive`): `npm run arquivar -- <slug>`.** Copia tudo para `<Meu Drive>\<ARQUIVO.pastaNoDrive>\Vídeos\<data> · <título>\` (01 Publicação · 02 Roteiro · 03 Projeto · 04 Prévia · Ficha técnica), atualiza o índice e a cópia do sistema, e apaga `saida/` do computador. O script confere o tamanho de cada cópia.
- Se houver o conector do Google Drive nesta sessão, confirme também na nuvem: `search_files` com `title = '<slug>.mp4'` e compare `fileSize` com `videos/<slug>/arquivo.json`. Só então diga que está salvo na nuvem.
- Mudou só capa/post/documentos depois de arquivar? `npm run render -- <slug> --sem-video` e `npm run arquivar -- <slug>` de novo (o MP4 do Drive é mantido).
- Sem Drive: os arquivos ficam em `videos/<slug>/saida/`; diga onde e como levar ao celular sem perder qualidade (Drive, cabo, WhatsApp como documento).
- Entregue: onde está o vídeo (link da pasta no Drive ou caminho local, como link clicável), duração, capa e o texto do post.

## Lições técnicas (não repita os erros)
- `<Still>` de 1 quadro + `<Freeze>` sempre mostra o quadro 0 (o Remotion limita o quadro à duração). A capa é uma composição de `quadro + 1` quadros.
- Voz do Windows (SAPI): os eventos de palavra vêm com tempo errado; o alinhamento é feito pelas pausas do áudio (só rascunho).
- O ffmpeg do Remotion é mínimo (sem `tile`/`drawtext`): folhas de contato são montadas com `pngjs`.
- Ao editar arquivos com scripts no terminal, `\\n` vira `\n`: prefira a ferramenta de edição para trechos com barra invertida.
- Python no Windows grava CRLF em modo texto (`open(..., 'w')`): use `newline='\n'` ou edite com Node/ferramenta de edição. CRLF quebra blocos `:::` dos guias e suja os diffs.
