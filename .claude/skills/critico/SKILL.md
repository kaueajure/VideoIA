---
name: critico
description: Julga a folha de contato do vídeo e corrige os 3 maiores defeitos, sem pedir aprovação humana. Use depois que o QA automático passar.
---



# Crítico visual

**Movimento exige inspeção temporal.** Além da folha, confira antes, durante e depois de cada ação central e o corte vizinho; use prévia curta quando disponível. Compare a mudança real de objetos e relações, não apenas o texto e a entrada. Em `criatividade.montagem`, confira imagens congeladas e séries de SVGs. Cartões estáticos repetidos, bandeiras pequenas e vazio sem função narrativa exigem correção de direção. Não aprove animação por ler no briefing que ela existe. Se não houver reprodução com som, registre sincronismo audiovisual como pendente.

O QA automático mede margens e sobreposição. Você olha o que ele não vê: composição, clareza, ritmo.

Em produções novas, siga `docs/producao-criativa.md`. Consulte `criatividade` no relatório de direção após QA: confira os trechos decisivos e os alertas de repetição ou texto isolado. Em `revisao-direcao.md`, registre beat, instantes vistos, ação observada e informação que a imagem acrescenta à fala. Uma cena legível pode continuar sem valor explicativo. Inspecione início, meio e fim para julgar mudança de estado; não aprove ação ou ritmo pela intenção escrita ou por uma única miniatura. Se não houver reprodução com som, deixe a revisão audiovisual pendente. As notas abaixo não substituem essa evidência.

## Como
0. Se `cena.json` ainda tem `"automatica": true`, ou faltam `storyboard.md` / `direcao.versao: 2` em produção nova, **reprove antes de pontuar** e devolva à skill `cena`. Plano automático não passa no crítico.
1. Abra `projetos/<nome>/saida/qa/folha.jpg` (um quadro por beat, mais o primeiro e o último). Julgue **só o que está nos quadros**, nunca a intenção do `cena.json`.
2. Nos 3 trechos decisivos (gancho, explicação/virada, fecho), inspecione movimento: prévia `--rapido` ou `node src/video/cli.mjs <projeto> --foto=<segundos>` no antes, durante e depois da ação. Sem isso, marque sincronismo/movimento como pendente em `revisao-direcao.md` e não declare aprovação criativa.
3. Pontue de 0 a 10, com uma linha de evidência cada: **gancho**, **legibilidade**, **uma ideia por cena**, **hierarquia**, **continuidade**, **ganho visual** (a imagem acrescenta algo que a fala sozinha não dá?).
4. Liste os **3 maiores defeitos**, cada um com: beat, evidência (o que se vê), correção local (a edição no `cena.json`).
5. Corrija só esses 3, rode `--sem-render` de novo e olhe outra vez. **No máximo 3 rodadas.**
6. Passa quando nenhuma nota fica abaixo de 7, o QA automático não tem falhas, e `revisao-direcao.md` registra os instantes vistos.

7. **Fala x imagem** (0.6.12): para cada beat, o que aparece mostra o que a voz diz naquele trecho? Use `saida/relevancia.json` como ponto de partida e confira nos quadros. Objeto sem relação (uma escada quando a fala é sobre dinossauro) é defeito grave. Desde 05/11/2026, palavra a palavra: a forma tem que mostrar a AÇÃO e o OBJETO daquele beat ("dorme" pede cama, não o despertador do gancho); peça repetida só porque é do assunto do vídeo, ou forma trocada por rodízio, é defeito. Sem nada que represente a frase, o certo é a figura neutra do estilo + o texto da fala. Ferramenta: `auditarFalaForma(cena, palavras)` em `src/video/fala-forma.mjs` (falhas `fala-desenho`); corrija na raiz (`docs/planejador-fala-forma.md`).

Quando houver `direcao-visual.json`, compare a folha com o trecho narrado e o campo `pesquisaVisual` do relatório. Confirme que o arquivo escolhido chegou ao plano e aparece no beat certo. Confira a função da imagem (registro ou contexto), a legibilidade e se o movimento ajuda a revelar ou explicar a informação. Use `pesquisa-visual` para rever uma imagem ou um movimento duvidoso.

## O que reprova
- Cena automática entregue como final, ou beats decisivos vazios.
- Objeto, cenário ou foto sem relação com a fala do beat.
- Foto cujo nome bate, mas o assunto não (homônimo: sertanejo no lugar de jogador, prédio no lugar da agência citada). Confira o arquivo em `assets/` e a linha em `fontes.md` (título da foto no Commons).
- Pessoa, lugar, obra ou produto citado pelo nome sem a foto (ou sem o logo da marca).
- Peça cortada ou encostada em outra de forma feia.
- Dois destaques na mesma cena.
- Cena vazia durante explicação.
- Título que cobre o objeto.
- Mais de uma ideia na mesma cena.
- Imagem que só ilustra a palavra sem mudar de estado (foto parada enquanto a fala explica um mecanismo).

Registre as rodadas em `projetos/<nome>/revisoes.md` (uma linha por defeito corrigido). Isso alimenta o método: defeito que se repete em vários vídeos vira regra.

## Perguntas por estilo (Onda 5)
Leia o estilo do vídeo em `cena.json` (`estilo`; beats com `estilo` próprio valem para o beat) e responda **sim ou não, com o quadro como evidência**, só às perguntas dele e às comuns. Um "não" vira defeito candidato aos 3 maiores. As regras completas de cada estilo estão em `docs/estilo-<id>.md`.

**Comuns a todos (Clube do Motion):** (a) onde virou teleprompter (texto na tela repete a fala palavra por palavra)? (b) onde a tela ficou cheia (mais de 2 níveis de texto ou mais de 1 destaque)? (c) onde algo parou morto (mais de 2 s sem mudança sem motivo)? Confira também os avisos novos do QA (`densidade`, `tela-assentada`, `palavra-gatilho`, `movimento-*`, `emenda-fundo`, `texto-pouco-fala`): eles apontam o beat e o instante.

**padrao, editorial, minimalista, papel:** o objeto 3D mostra o que a frase diz, com material e sombra de contato (nada chapado)? O protagonista ocupa 55 a 70% da altura útil e o grupo título + peças está centralizado? Há cenário 3D em pelo menos 1 de cada 4 beats? Pessoa citada pelo nome tem foto real, e dupla tem fotos do mesmo tamanho e tratamento?

**pontilhismo:** a forma de pontos lê a 240 px (dá para dizer o que é)? A forma nova nasce dos pontos da anterior? O texto não entra na nuvem de pontos?

**impresso:** o texto fica na coluna fixa, fora do pan e do zoom do corte? A retícula e a página ainda leem como papel impresso, sem faixa escura no corte? A palavra-chave é a da fala?

**cartoes:** o lettering sai sempre na mesma coluna (margem esquerda, topo fixo), com no máximo 4 linhas? Os cartões e janelas têm profundidade (sombra e espessura), não são retângulos chapados? O movimento tem pausas (11 a 26% do tempo parado) em vez de correr o tempo todo?

**tubo:** a palavra gigante tem 4 a 6 letras e cabe inteira? A textura de TV está no quadro inteiro, inclusive no 3D? Cada palavra entra inteira, nunca letra por letra?

**linhas:** o ponto branco protagonista está na tela o vídeo todo? Cada forma tem camadas (guia, rastro, glow), nunca uma forma sozinha? A forma muda a cada frase e não repete?

**anatomia:** o objeto do assunto é reconhecível pelas muitas peças pequenas e verdadeiras (parafuso, ranhura, placa)? Nada flutua (toda peça se apoia em outra)? A explosão mostra a ordem de profundidade correta? O foco é por tom, não por cor? Nenhuma caixa ou seta genérica no lugar do objeto?

**fino:** a figura lê a 240 px e o repouso já é uma composição? Há um destaque só e nada de texto dentro da figura? Nada vaza do quadro e as arestas verticais não aparecem?

**letreiro:** o título sintetiza a fala em até ~40 caracteres, sem repetir a legenda? Sempre há o objeto real embaixo (peça, GLB, foto, contador)? O texto está na coluna fixa, em até 2 linhas, sem encolher para caber?

**ribalta:** o elemento domina o centro (placa de ~800 px, 66 a 70% da faixa)? A cor segue o sentido fixo (a = destaque, b = apoio, c = cinza)? A legenda tem no máximo 6 palavras em 2 linhas?


**mundos:** cada item tem o próprio mundo de cor, com a íris saindo do emblema do próximo? O objeto de cada item é real, não ícone chapado? A passagem entre protagonistas chega parada num cartão e o novo nasce dele?

**interface:** a tela executa o verbo da fala (clicar, digitar, enviar)? O estado final fica legível por 0,3 a 0,6 s? Nenhum logo nem nome de produto desenhado?

**colagem:** há uma foto real por ideia, a do assunto no primeiro segundo? Carimbos e notas ficam no canto da foto, nunca sobre texto? Não há faixa escura no corte (a foto anterior fica por baixo até a nova cobrir)?

**moderno:** a janela de vidro tem profundidade e inclinação alternada, com o topo livre para o nome da página? A câmera segue o ponto da ação? O título da janela é genérico?

**alternativo:** a nuvem de pontos forma o objeto, mapa ou dado da fala (reconhecível a 240 px)? O número e as fontes estão nas zonas do estilo? O assunto não ficou preso a um modelo pronto?

**preto-branco:** cada ideia é uma cena desenhada que mostra a frase (não um ícone)? A câmera quase nunca para (dolly, pan, tilt)? Dupla de fotos com o mesmo tratamento P&B?

**stop-motion:** a massinha tem textura de massa e foco raso, e os personagens atuam? O corte interno mostra o órgão ou mecanismo da fala? Os efeitos sonoros ficam abaixo da voz?

**teologia:** o tom é respeitoso e cada dado tem duas fontes? Texto e arte ficam centrados em y ~800 a 900, e nada abaixo de y 1650? Figura sem retrato livre usa o ícone de reserva, nunca um rosto inventado? (0.6.19) A arte muda de apresentação de um beat para outro (moldura, tela, dividida), sem moldura dourada repetida? O kicker está colado ao texto que rotula (nunca uma frase pequena perdida no alto)? Texto sobre a obra só com scrim (tela cheia)? Nenhum medalhão ampliado a ponto de mostrar blocos de JPEG? Crédito acima de y 1580? Tons sem salto escuro-claro em mais de 30% das trocas? O fecho é o celular com o botão tocado e o comentário digitado, e a capa tem o título em fundo limpo sem cruzar a arte?

**quadro-antigo:** cada beat mostra uma obra real de domínio público que ilustra a frase? A obra cobre o quadro (sangria) com vinheta mais escura que o miolo? Não há cintilação de exposição, e o fecho escuro entra nos últimos 0,45 s?

**fatos:** o texto do beat se monta no alto palavra a palavra, sem dois textos na tela ao mesmo tempo, e sai antes do visual seguinte? A virada fica na itálica no acento? O lugar citado está aceso no mapa (e a pessoa citada com foto real)? O número conta até o valor de `fontes.md`? A anotação do mapa (alvo, nome) não troca de lado nem fica por cima da foto? Barra de progresso no topo, nada abaixo de y 1500?

**paper-rocket, lighthouse-mouse e moon-path:** cada frase tem cena com o bicho de feltro e a ação na palavra dita? As palavras pipocam na hora certa, numa linha no alto, sempre acima dos bichos, sem placa atrás? Feltro e papel com fibra, costura e sombra (nada chapado)? A troca de cena é corte, fusão ou o painel de papel, sem clarão branco, e a câmera nunca dá tranco? Os pés ficam acima da faixa dos botões? O destaque (palavra-chave, número, letras do fecho) está na cor da marca?

**smooth (e irmãos):** a fala entra palavra por palavra no tempo da voz e o número chega junto com ela? Cada cena tem o gráfico além do texto (vidro, número, código, botão com a mão)? Fala, número e peça dentro da área segura (x 72 a 1008), a fala em UMA linha, centrada, logo abaixo do desenho? A mesma composição mais de 2 vezes ou em cenas seguidas? Algo vaza da tela? O desenho representa a frase? A câmera anda sem tranco nem salto e a troca de beat nunca clareia em branco? No modo alterna, gelo e breu trocam pelo menos 3 vezes?

**colagem3d:** cada plano mostra o que a frase diz (a pessoa citada com foto real e etiqueta, o objeto 3D com sombra no papel, o jornal ou o documento com a própria fala)? O recorte tem borda de papel, sombra macia e nunca passa por cima da legenda? A legenda fica em uma linha sobre o papel limpo, com a chave no realce? O marca-texto abraça o detalhe certo? O papel cobre o quadro inteiro (nenhuma faixa vazia na borda) e o corte entre planos é seco, sem quadro vazio?

**novela:** cada cena mostra o que a frase diz, com quem age gesticulando na palavra-chave? A pessoa citada pelo nome aparece ilustrada no estilo, reconhecível pelo traje, com o nome (foto só se o usuário pediu)? O rosto de quem age fica inteiro na área, nunca sob a legenda? A legenda fica numa linha e legível na altura do peito, sem elipse atrás (tinta escura com contorno claro no fundo claro, letra clara com contorno escuro no resto)? A câmera nunca para e nunca dá salto nem tranco (o golpe de zoom é só zoom, sem arrastar o quadro)? Nenhuma transição brilha em branco entre as cenas (clarão só se pedido)? O protagonista (personagem, cartão, número, objeto) fica no eixo em todo quadro (o fundo anda em paralaxe, ele não)? O fecho tem a moldura abaixo do @, o busto inteiro e no eixo, o título com margem, o ano entre fios e o CTA na cor da página, acima da faixa do app? Personagens que repetem o papel não são clones, e nenhum objeto é chapado?

**prickles e little-light:** cada cena mostra o que a frase diz e o bicho (ou a baleia) age na palavra-chave? As palavras pipocam numa linha no alto, sem cobrir orelha, cabeça ou água-viva? O traço tem lápis e aquarela, com pelos e borda de pigmento (nunca chapado)? Nenhum personagem sai da tela nem entra na faixa de baixo? O brilho (vaga-lumes, águas-vivas, plâncton) é macio, sem mancha branca? A troca de cena é suave, sem quadro vazio?

**mindset3:** cada desenho mostra o que a frase diz (órgão, objeto, número com fonte, comparação)? O traço se desenha (com a ponta acesa) e a troca nunca clareia o quadro? A etiqueta mono fica fora do traço e inteira? O protagonista fica centrado (a dupla como conjunto)? A legenda fica em uma linha a 75% da altura, cinza que acende, com a chave em negrito? A pessoa citada aparece ilustrada, com o nome? O número fica inteiro dentro do anel, no eixo dele, com o rótulo colado embaixo e nenhum outro anel atrás (zoom a 5 qps em toda forma com número)? O fecho volta à figura do começo, com a pílula a ~85% da altura sem encostar na legenda e nada sobre o @?

**pleno:** o quadrado entra girado e assenta, com brilho e degradê? A grade cresce em disco em volta do "você" e a câmera recua sem tranco? Cada texto do topo entra na palavra dita, inteiro, em uma ou duas linhas, centrado, dentro da área segura? O número chega no valor junto com a fala? Os grupos pintam do canto, com as cores do estilo, e a mancha tem foco? A etiqueta "você" some antes da borda da área segura? O fecho volta ao quadrado do começo?

**mindset2:** cada glifo mostra o que a frase diz (pessoa, tempo, mente, coração) e age na palavra-chave? O traço se desenha sem corte seco e o anterior desliza e apaga? A legenda fica em uma linha, com a chave em amarelo, e o rótulo do HUD acima do desenho sem encostar nele? Nada abaixo de y 1650?
**mindset:** cada cena mostra o que a frase diz e o boneco dourado age na palavra-chave? As etiquetas ficam no mesmo lugar entre comparações e a dourada acende? A frase de impacto nunca passa por cima de boneco? Boneco com volume, sombra de contato e reflexo (nunca chapado)? Legenda em uma linha, nada abaixo de y 1650 nem além de x 960?

**antiguidade:** a peça (pintura, busto, mosaico, mapa) é de acervo e relevante para a frase? A câmera nunca fica parada e as transições variam? O texto nunca fica atrás da imagem, exceto no nome-atrás legível?




