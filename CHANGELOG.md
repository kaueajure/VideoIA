

# Histórico de versões

O número segue o padrão MAIOR.MENOR.CORREÇÃO: CORREÇÃO conserta sem mudar o jeito de usar; MENOR acrescenta recursos sem quebrar projetos existentes; MAIOR pode exigir ajuste nos projetos (sempre explicado aqui). Para instalar uma versão nova: no estúdio web, aba **Atualizar** (ou peça ao assistente). Seus projetos, carrosséis, marca e chaves não mudam.

## 0.6.45 (09/11/2026)

- **Novela também na horizontal.** O estilo Novela agora funciona no formato do YouTube (1920 x 1080), e com ele todos os estilos do estúdio têm versão horizontal. A cena fica no centro do quadro com o cenário continuando para os lados, a legenda em 1 linha, o @ opcional (desligado por padrão) e a legenda também opcional. O vertical continua exatamente igual. Ainda sem revisão visual final.
- **Cena desatualizada se resolve sozinha.** Se você mudou o roteiro ou a voz depois de o assistente escrever as cenas, o estúdio mantém a cena que ainda combina com a fala e refaz o resto, guardando a antiga ao lado. Não pede mais para apagar arquivo.
- **Estilo Pleno mais firme.** Uma lista escrita fora do formato numa cena do Pleno não para mais o vídeo: o estúdio diz o campo e o formato certo, ignora só aquele item e segue.
- **Menos vídeo parado por um erro de cor.** Uma peça sem névoa ou sem material definido, que parava o quadro com a mensagem "reading 'color'", agora é aceita.
- **Instalação com o cache do npm estragado.** Se o cache do npm estiver corrompido, preso pelo antivírus ou sem internet, o instalador apaga e tenta de novo, usa uma pasta nova se precisar e, por último, usa as peças que vêm junto no pacote, com um passo simples na tela.
- **Erros do motor com o nome certo.** Quando algo para dentro do desenho do vídeo, o relatório anônimo agora traz o nome da função, e a equipe acha a causa mais rápido.

## 0.6.44 (09/11/2026)

- **O estilo que você escolhe vale.** Se você troca o estilo depois de já ter feito o vídeo, o estúdio refaz as cenas no estilo novo (antes reaproveitava as cenas do estilo antigo e o vídeo parecia não mudar). Cena escrita à mão nunca é apagada: o relatório avisa que ela é de outro estilo.
- **A cor da sua marca chega ao vídeo.** Cor escrita no lugar errado (no arquivo de configuração ou num bloco renomeado da marca) agora aparece como aviso, com a cor que vale hoje e o passo exato para trocar. Cor escrita sem # ou com espaço passa a valer.
- **Estilos em preto e branco avisam.** Pontilhismo, Linhas, Anatomia, Fino, Preto e branco e Impresso são preto e branco por desenho, e agora o estúdio diz isso com uma linha simples. Para usar a cor da marca, escolha outro estilo.
- **Botão "Testar minha chave".** Em Começar > Voz, uma linha diz se a chave da ElevenLabs está ativa, errada, sem permissão, sem crédito ou bloqueada pela própria ElevenLabs, com o que fazer. Pelo assistente: "testa a minha chave".
- **Conta da ElevenLabs bloqueada, explicada.** A trava da conta grátis da ElevenLabs ("atividade incomum") não aparece mais como chave recusada. A mensagem explica que é uma trava dela, pede para desligar a VPN e testar mais tarde ou em outra internet, e oferece seguir com a voz de teste enquanto isso.
- **Atualizou com o estúdio aberto?** O estúdio percebe, pede para fechar e abrir de novo, e o "Abrir Estúdio" já fecha a janela antiga sozinho.
- **Arquivo que some no meio do vídeo** (pasta renomeada, OneDrive, antivírus) agora tem explicação e passo, em vez de uma mensagem técnica.
- **Peças 3D com cor própria voltaram a funcionar.** Uma peça com cor escolhida na cena (por exemplo, uma moeda laranja) parava o vídeo em qualquer estilo. Corrigido.
- **Menos vídeo parado por detalhe da cena.** Uma posição ou um giro de peça escrito fora do formato, um rótulo comprido no Mindset 3 ou um vídeo de apoio sem crédito não param mais o vídeo: o estúdio ajusta, avisa e segue. O crédito que falta vira um lembrete para conferir a fonte antes de postar.
- **Mensagens certas para o seu computador.** No Mac, quando o navegador que desenha o vídeo não abre, a mensagem fala do Mac e manda dar dois cliques em Instalar (Mac), sem citar o Windows. Disco cheio aparece como disco cheio, com o passo para liberar espaço. Quando o Windows ou o antivírus fecha o programa que monta o vídeo, a mensagem diz o passo certo. E a dica da voz sem internet aponta para a Voz de teste de hoje.
- **Instalação no Windows mais firme.** A conferência do arquivo baixado deixou de depender de uma parte do PowerShell que alguns computadores bloqueiam. Se outra parte faltar, a mensagem diz o que fazer.
- **Quando algo para, a equipe acha a causa mais rápido.** O relatório anônimo agora diz em que parte do vídeo o estúdio tropeçou (estilo, trecho e tipo de elemento), sem nada do seu roteiro.
- **Pacote mais leve.** O zip leva só os testes que a conferência usa (de 13 MB para 2,7 MB).
- **Guia da cena por estilo.** O assistente lê só a parte do estilo do vídeo, e não o guia inteiro: menos espera antes de começar.
- **Textos do pacote revisados.** Avisos e guias falam do autor do estúdio, sem caminhos internos.
- **Por dentro (nada muda no jeito de usar).** Rotas do estúdio web, etapas do vídeo, validação da cena e verificadores dos estilos foram reorganizados em partes menores; a validação continua com a mesma saída, conferida em 1.667 casos.

## 0.6.43 (08/11/2026)

- **Vídeo horizontal em 41 estilos.** O formato do YouTube (1920 x 1080) agora funciona em quase todos os estilos do estúdio, não só no padrão, no Letreiro e no Smooth. Peça "faz na horizontal" ou "para o YouTube" e o vídeo sai em 16:9, dentro das margens do YouTube, com a miniatura de 1280 x 720. O @ da página vem desligado no horizontal (ligue em "Mostrar @" se quiser) e a legenda vem ligada. O vertical continua igual.
- **Sem limite de tempo também no horizontal.** O vídeo pode ter o tamanho que você quiser, nos dois formatos.
- **Converter entre vertical e horizontal em qualquer um desses estilos**, com a mesma narração e a mesma trilha (nenhum crédito gasto).
- **Menos vídeo parado por detalhe do assistente.** Quando o assistente escreve um traço sem o ícone, o estúdio escolhe o ícone mais parecido e segue; se precisar avisar, a mensagem diz qual campo faltou (antes aparecia "undefined").
- **Estilo Interface mais firme.** Um painel com itens faltando mostra o erro certo em vez de parar com uma mensagem técnica.
- **Windows: o Node instala mesmo quando o antivírus segura o arquivo.** Se o primeiro jeito de abrir o arquivo do Node falhar, o instalador tenta um segundo jeito antes de parar.
- **Guias e aulas mais fáceis.** O guia de instalação e o resumo de 1 página ganharam "Deu certo se" depois de cada passo, o porquê de cada cuidado e uma tabela "Se algo der errado". As aulas de instalação ganharam imagens dentro do passo certo.
- **Pacote mais limpo.** Saíram do pacote textos internos que não servem para você.

## 0.6.42 (08/11/2026)

- **A licença não prende mais você.** Se o estúdio mostrar "a chave não confere", basta digitar o e-mail da compra: o campo da chave é opcional e, se vier algo errado ou antigo, o estúdio ignora e reativa pelo e-mail. Se a licença mudar no servidor, o estúdio se corrige sozinho e avisa "atualizei a sua licença, pode continuar". Uma falha momentânea do servidor nunca derruba o seu estúdio.
- **Música de fundo com várias fontes.** A trilha pode vir da ElevenLabs Music, da Stability, do Google Lyria (com a sua chave, se quiser) ou de uma biblioteca livre de 85 faixas sem direitos autorais. Se uma fonte falhar, o estúdio passa para a próxima e, no fim, usa a trilha do próprio estúdio: o vídeo sempre sai com música. Liga e desliga em Começar > Voz e trilha, ou com `npm run trilhas-fontes`. O pacote de fábrica continua só com a trilha do estúdio; nada é baixado sem você ligar.

- **Vídeo do tamanho que você quiser.** Nenhum estilo, objetivo ou linha editorial reprova, corta ou bloqueia um vídeo por ser longo: 2, 5, 10 minutos ou mais. O estúdio só dá uma nota curta quando ajuda (por exemplo, "este vídeo tem 4 min 50 s; confira o limite de tempo da rede antes de postar"). Em política, o antigo limite de 60 s e 75 s virou nota.
- **Narração longa sem escorregar.** Textos grandes são enviados em partes e emendados sem estalo, e a legenda acompanha a fala do começo ao fim. A voz Fish Audio também aceita texto longo.
- **Música longa sem buraco.** A trilha de vídeos de mais de 5 minutos é feita em partes do mesmo tamanho, emendadas suavemente, e cobre o vídeo inteiro. Se cair a internet, as partes prontas são aproveitadas.
- **Render longo mais claro.** A barra de progresso e o "faltam cerca de" passam a contar o vídeo inteiro (antes zeravam a cada parte). Se o disco estiver apertado, o estúdio avisa e renderiza sem guardar os quadros, em vez de parar.
- **Arquivo grande não é defeito.** Vídeo longo passa de 100 MB sem reprovar; o estúdio só avisa que a rede pode recomprimir.
- **Vídeos horizontais para o YouTube (1920 x 1080).** Peça "faz na horizontal" ou "para o YouTube" e o vídeo sai em 16:9, dentro das margens do YouTube, sem faixa preta. No horizontal o @ da página vem desligado (dá para ligar) e a legenda vem ligada (dá para desligar). Junto vem a miniatura de 1280 x 720. Já funcionam o estilo padrão (e suas variações editorial, minimalista e papel), o Letreiro e o Smooth; os outros estilos chegam em lotes.
- **Converter de vertical para horizontal, e de horizontal para vertical.** O estúdio cria uma cópia no outro formato com a mesma narração e a mesma trilha (nenhum crédito de voz ou música é gasto) e refaz o layout para o formato novo. O vídeo original não muda.

## 0.6.41 (08/11/2026)

- **Estilo novo: Bible (a Bíblia em dados e luz).** Histórias bíblicas em cenas de luz e silhueta, com a referência do versículo na tela e a narração sem lê-la, bichos desenhados com anatomia, arca, dilúvio, calendário e arco-íris.
- **O estúdio entende o estilo e o objetivo escritos do seu jeito.** Escreveu "educação financeira", "dinheiro", "vendas" ou "tv de tubo" no pedido, na linha STATUS do roteiro ou na configuração? O estúdio escolhe o item mais parecido da lista, avisa ("usei o objetivo financas para educação financeira") e faz o vídeo. Acentos, maiúsculas e plural não atrapalham. Se nada se parecer, ele usa o padrão e avisa, sem parar.
- **Mensagens de erro mais claras.** Quando o pedido tem um nome que não existe, a tela agora explica o que fazer, em vez de "erro que o estúdio não reconheceu". O mesmo vale para toda mensagem que o estúdio escreve em português para você.
- **Smooth sem tropeços em roteiros de venda.** O plano do estilo Smooth segue em frente mesmo quando uma frase não cabe numa forma só, e o símbolo "R$" deixou de ser tratado como nome de pessoa (que buscava uma foto à toa).
- **O 3D funciona em computadores mais antigos.** Placas de vídeo antigas (Intel HD 2000 e 3000) que não conseguem o 3D de nova geração agora passam sozinhas para o 3D pelo processador, sem parar o vídeo. Se o 3D ainda falhar, a mensagem diz como atualizar o driver de vídeo.
- **Windows: o FFmpeg que não abre ganha um caminho claro.** Quando o Windows ou o antivírus impede o FFmpeg de abrir, o estúdio usa o FFmpeg da própria pasta e explica, em três passos, como liberar. O instalador também mostra o motivo.
- **Firewall e antivírus explicados.** Quando eles barram o navegador interno do estúdio, a mensagem diz o que liberar (Node.js e Chromium ou Chrome).
- **Painel do estúdio mais firme.** Trocar de tela enquanto a marca ou a voz está sendo aplicada não gera mais erro na página.
- **Estilo Cartões** pula um cartão com medida inválida em vez de parar o vídeo.
- **O estilo que você escolheu nunca é trocado.** Antes, quando uma cena não passava na conferência ou faltava a peça de um estilo, o vídeo podia sair no estilo padrão. Agora o estúdio conserta dentro do mesmo estilo: ajusta o layout, troca por outra forma do estilo e, se for preciso, usa uma versão mais simples do trecho (a frase em destaque, só o número). Estilos que dependem de uma peça desenhada para o assunto (Letreiro, Colagem, Ribalta, Mundos, Interface, Cartões, Tubo, Impresso, Fino e Anatomia) montam sozinhos uma versão simplificada. Se um trecho ainda ficar imperfeito, o vídeo sai no estilo certo com um aviso claro dizendo qual trecho e por quê.
- **Smooth com duas ou três barras** deixou de reprovar na conferência ("fora do eixo"): a coluna das barras agora é medida inteira. As linhas de fala em negrito do Smooth também ganharam folga para a câmera não cortar nas bordas.

## 0.6.40 (08/11/2026)

- **A instalação não fica mais parada em "baixando as peças".** Se a internet travar, o instalador percebe sozinho em até 2 minutos, tenta de novo (até 3 vezes) e, enquanto baixa, mostra o nome de cada peça e um "ainda baixando…" a cada 20 segundos.
- **Funciona mesmo sem conseguir baixar as peças.** As peças principais do estúdio agora vêm dentro do próprio arquivo. Se a internet ou a rede (de empresa, escola, com proxy) não deixarem baixar, o instalador usa as que vêm junto e avisa: "a internet não deixou baixar; usei as peças que vêm junto do estúdio". O zip ficou cerca de 6 MB maior.
- **Configurações antigas do computador não atrapalham mais.** Quem já usou programação no computador às vezes tem ajustes que mandavam baixar de outro lugar ou não baixar nada. O estúdio agora usa uma configuração só dele, sem mexer na sua.
- **Quando a instalação para, a mensagem diz o porquê** (internet, rede da empresa, certificado, permissão da pasta ou disco cheio) e o que fazer, em uma frase. A equipe recebe o aviso anônimo com o motivo, sem nenhum dado seu.
- **O alinhador de voz nunca impede o estúdio de abrir.** Se ele não instalar, o estúdio funciona do mesmo jeito e a legenda usa o tempo estimado pelas pausas da fala, com um aviso.
- **O estúdio no Windows não cai mais ao copiar ou abrir projetos.** A cópia de pastas agora usa um caminho mais firme, e se algo falhar o estúdio continua aberto e explica o que fazer.
- **O estilo Colagem aguenta títulos longos.** Os títulos grandes se ajustam sozinhos ao espaço, sem parar o vídeo.
- **Cenas com erro se reparam sozinhas.** Quando o assistente escreve uma cena com um detalhe fora do formato, o estúdio corrige o que dá e segue, em vez de parar o vídeo.

## 0.6.39 (07/11/2026)

- **O plano das cenas do Smooth não derruba mais o vídeo.** Se um trecho da fala não se encaixar numa forma do estilo por qualquer motivo, só aquele trecho ganha a frase em destaque, no mesmo estilo, e o vídeo segue até o fim. O motivo vai para o registro para a equipe corrigir na raiz.
- **Avisos de erro sem pedir para trocar de estilo.** Quando algo do estúdio falha, a mensagem agora diz para tentar de novo (a narração pronta é reaproveitada) e que a correção sai na próxima atualização.

## 0.6.38 (07/11/2026)

- **Estilos Smooth (estratégia, produto e os irmãos) não param mais no meio do vídeo.** Em certos roteiros de tutorial, o plano automático das cenas quebrava com um erro técnico ("join is not a function") e o vídeo parava antes do fim, mesmo com a narração pronta. Corrigido, com teste de 400 roteiros.
- **Erro no plano das cenas agora tem explicação.** Se algo parecido acontecer, o estúdio diz o que fazer (tentar de novo ou trocar de estilo, aproveitando a narração já pronta) em vez de "erro não reconhecido".

## 0.6.37 (07/11/2026)

- **Uma mensagem só para começar: o Método é uma pasta que o seu assistente usa.** O `COMECE-AQUI`, o `LEIA-ME`, o guia rápido e a primeira tela do estúdio agora começam por 3 passos: abra a pasta no Claude Code (aba Code, modo Local) ou no Codex, escreva "Comece pelos primeiros passos." e peça o seu vídeo. O estúdio visual segue disponível e opcional: é só escrever "abrir estúdio" ao assistente.
- **Quem ainda não tem o assistente** continua com os dois cliques em Instalar, que abrem o estúdio com a demonstração e o vídeo de teste. O texto agora diz claramente que o vídeo do seu tema precisa do assistente.
- **O assistente entende "abrir estúdio"** e abre o estúdio visual no navegador.

## 0.6.36 (07/11/2026)

- **Menos vídeos parados por cena com item repetido.** Quando o assistente repete o nome de um item numa cena (tela de aplicativo, cena vetorial, palco), o estúdio renomeia o repetido, avisa e segue em vez de parar o vídeo.
- **Gravação do áudio mais firme no Windows.** Se o antivírus ou o OneDrive segurarem por instantes o arquivo de som que o estúdio acabou de criar, ele tenta de novo, por alguns segundos, antes de desistir.
- **Mensagens de erro mais certeiras.** Firewall ou antivírus barrando a internet do estúdio agora aponta o passo certo (liberar o Node.js no firewall, ou usar a voz de teste) em vez de mandar mover a pasta. FFmpeg barrado pelo antivírus e navegador que fechou no meio da foto também deixam de aparecer como problema de montagem ou de 3D.

## 0.6.35 (06/11/2026)

- **Estilo Novela mais bonito e mais legível.** A câmera nunca cobre o rosto de quem fala: o rosto fica sempre acima da legenda, e o grupo de pessoas fica no meio da área segura, longe do @ e da legenda. Os personagens ganharam rosto com volume, olhos mais expressivos, mãos com dedos legíveis de longe, dobras de roupa e sombra de contato; quem tem nome mantém sempre o mesmo rosto no vídeo inteiro.
- **A fala aparece na imagem.** Anos riscados, mão no ombro, olhar para as mãos, mão na boca e multidão mais viva no Novela, com efeitos de luz e toque que acompanham a ação e nunca passam da voz.
- **Duas conferências novas no Novela:** o estúdio reprova o vídeo se um rosto ficar embaixo da legenda ou se o grupo ficar baixo demais na tela.
- **Erro de rotação no pecas.js agora é explicado.** Quando uma peça escrita pelo assistente tenta trocar a rotação, a posição ou a escala de um objeto 3D de um jeito que o three.js não aceita, o estúdio diz o passo exato para o assistente corrigir, em vez da mensagem genérica de "cena que tropeçou".
- A prévia do estilo Novela, na aba Estilos, foi refeita com a versão nova.

## 0.6.34 (05/11/2026)

- **Treze estilos novos de Reels.** A família **Smooth** (seis estilos de motion no jeito do After Effects: vidro, número que conta, câmera com motivo; fundo claro, escuro ou alternando), e mais sete: **Novela** (história encenada por personagens ilustrados em cenários pintados, com câmera que anda pelo quadro); **Mindset 3** (ilustração em giz com número no anel, figuras de ação e cartões); três desenhos animados de **feltro e papel** (`paper-rocket`, `lighthouse-mouse` e `moon-path`: bichos de feltro, palavras que pipocam na fala); e dois de **ilustração pintada** (`prickles`, bichos de livro em lápis e aquarela, e `little-light`, o fundo do mar que brilha à noite). Todos têm guia, prévia em movimento na aba Estilos e frase pronta para pedir ao assistente.
- **O desenho segue a fala em todos os estilos.** Em cada trecho do vídeo, o que aparece vem da ação e do objeto que a narração diz ("acordou" mostra o despertador, "dormiu" mostra a cama). Quando nada na frase tem desenho, entra a figura neutra do estilo com o texto da fala, nunca um desenho qualquer.
- Pessoa citada pelo nome nos estilos Novela, Mindset 3 e nos desenhos animados vira personagem ilustrado no mesmo traço do estilo; a foto real entra quando você pedir.
- **Texto sempre longe da interface das redes.** Em todos os estilos, o @ da página, os títulos, os números, os rótulos, os botões e a legenda ficam dentro da área que o Instagram, o TikTok, o YouTube e o Facebook não cobrem com botões e nomes. Frase longa demais quebra em mais uma linha ou, só quando precisa, fica um pouco menor.
- Efeitos de brilho mais espaçados e sempre abaixo da voz nos desenhos animados.
- **Estilo novo: Pleno.** Textos que entram e saem do jeito da referência, fecho com botão e mixagem própria: nenhum efeito passa da voz no próprio trecho, e a música sobe quando a fala termina.
- **Efeitos sempre 10 LU abaixo da voz em todos os estilos.** Antes, num trecho curto, um efeito podia chegar perto da voz (no Teologia chegava a 7 LU). Agora a regra vale para qualquer estilo.
- **Acabamento dos estilos.** Teologia, Colagem 3D, Mindset 3 e Pontilhismo ficaram mais fiéis às referências. No Novela, o fecho cabe na área segura, os personagens bíblicos aparecem e o cenário da vila da Galileia foi incluído.

## 0.6.33 (04/11/2026)

- **Uma cor errada não derruba mais o vídeo.** Se um estilo recebe uma cor inválida (vazia ou fora de formato), o estúdio usa a cor da sua marca, avisa uma vez e segue desenhando, em vez de parar na cena.
- **Escolher o estilo Fino ou Anatomia no primeiro vídeo não trava mais.** Esses dois estilos desenham um objeto feito para o assunto. Quando o vídeo não tem esse objeto, o estúdio faz sozinho no estilo Padrão, com o mesmo roteiro e a mesma narração, e avisa em uma frase. Uma cena automática antiga nesses estilos também é refeita.
- **Imagem danificada na pasta do projeto agora é explicada** (arquivo vazio ou que não terminou de baixar), com o nome do arquivo e o que fazer.
- **Peça simples demais no pecas.js** (só um círculo ou quadrado) diz qual peça e o passo exato.
- **O vídeo não para mais quando o assistente bloqueia a leitura do tempo ligado do computador** (aparecia como "o computador não deixou gravar na pasta").
- Mensagem de falha do FFmpeg agora traz o código de saída, para o suporte achar a causa mais rápido.

## 0.6.32 (03/11/2026)

- **Nova aba "Como funciona".** Explica em poucos minutos o que é o método e quem faz o quê: o trabalho acontece no seu assistente (Claude Code ou Codex), na pasta que você escolher, e o estúdio serve para ver, organizar e tirar dúvidas. Traz o caminho de um vídeo em 4 passos, para que serve cada aba e as dúvidas mais comuns.
- **Estilos com prévia em movimento na hora de escolher.** Em Começar, cada estilo mostra o vídeo em loop, inteiro, na proporção original. Na aba Estilos, o botão **Usar como padrão** deixa o estilo como padrão em um clique.
- **Objetivos com ícone** e uma barra de Salvar nova, que mostra o que você escolheu (objetivo, estilo e linha editorial) e avisa "Alterações não salvas" ou "Tudo salvo".
- **Ícones em todo o estúdio:** abas, passos, botões de copiar, baixar e abrir a pasta, e selos dos vídeos.
- **Layout melhor em qualquer tela.** Todas as telas usam a mesma largura, que cresce em monitores grandes; os passos de Começar viraram uma faixa; no celular os estilos aparecem em duas colunas e nenhuma tela rola para o lado.
- **A tela Atualizar não oferece mais versão antiga como se fosse nova.** Arquivos mais antigos ganham um selo e pedem confirmação antes de voltar.
- **O assistente agora vem sempre explicado:** "assistente (Claude Code ou Codex)" em todos os textos do estúdio.
- Meus vídeos com botões alinhados; a lista de Projetos explica o número (nota do roteiro); a prévia do estilo Tubo foi criada.
- Inclui a 0.6.31 (estilo Fatos refeito), que não chegou a ser publicada.

## 0.6.31 (03/11/2026)

- **O estilo Fatos não traz mais o boneco.** O palco virou só luz, cone e névoa (com uma poça de luz no piso), a abertura nunca é o palco e o plano nunca escolhe o personagem Curioso. Quem quiser o personagem escreve `"cenario": "palco-curioso"` no beat.
- **O texto pequeno não cola mais no número.** A linha pequena de cima ("A campanha Be Ready saiu em", "A Newsweek juntou") ganhou o respiro medido nas referências em relação ao número grande, para qualquer tamanho de número.
- **O mapa cobre a tela inteira em todo quadro.** Antes, com a câmera perto do Alasca, da Noruega ou da Rússia, aparecia uma faixa clara à esquerda e em cima e a borda do painel do mapa. Agora o mar escuro está por baixo, a volta ao mundo se repete nas laterais e, além dos polos, o mapa continua em espelho e apaga para o mar.
- **Texto que não vaza nem é cortado.** Título, itens e valores da lista, etiquetas, rótulo do mapa e carimbo encolhem, quebram em 2 linhas e nunca cortam letra ("REMÉDIO DE USO CONTÍNUO" saía "CONTÍNU", "PENTÁGONO, SEGUNDO REPORTAGENS" passava do cartão). O rótulo do lugar no mapa fica fora do contorno, com fundo quase opaco e linha de chamada. O QA do estúdio ganhou um verificador que reprova texto fora do cartão, fora da tela, cortado ou rótulo ilegível.
- **A unidade não se repete.** "90 dias" no número e "dias sozinhas" no texto viraram só "90 dias". Vale também para out/outubro, bi/bilhões e "22 de outubro".
- **Mais visual e menos número solto.** O plano automático põe o objeto 3D do repertório que a fala cita, ou um ícone de linha (20 pictogramas próprios), embaixo de frases e números sem mapa; a frase de relatório, proposta ou campanha vira um cartão de documento com carimbo; os itens da lista ganham ícone. Nada é inventado: só aparece o que a fala diz.
- Guia: `docs/estilo-fatos.md`; campos novos em `docs/cena-schema.md` (`objeto`, `icone`, `forma: documento`); testes: `test/estilo-fatos-0631.test.mjs`.

## 0.6.30 (03/11/2026)

- **O vídeo não para mais quando o estilo pede um desenho que o projeto não tem.** Colagem, Letreiro, Interface, Ribalta, Mundos, Cartões, Tubo e Impresso desenham o assunto a partir de uma peça feita para ele. Antes, sem essa peça, o vídeo parava e pedia para você mandar o assistente "escrever a peça". Agora o estúdio faz o vídeo sozinho num estilo parecido (a Colagem vira Colagem 3D, o Impresso vira Papel, os outros vão para o Padrão), com o mesmo roteiro e a mesma narração, e diz em uma frase o que fez. Se quiser o estilo original, o aviso traz o pedido pronto para o assistente.
- **Cena do assistente com "entrada" diferente não reprova mais.** Quando o assistente escrevia um efeito de entrada que o estúdio não conhece (por exemplo "stop-motion" ou "cai"), o vídeo parava com "efeitos.entrada: use queda ou legado". Agora o estúdio troca pelo valor certo e segue. O diagnóstico enviado também deixou de trocar a instrução do estúdio por "[texto do roteiro]": a frase do que pedir ao assistente chega inteira.
- **Fotos no Windows: mais paciência com internet lenta.** Cada busca de foto espera mais (12 segundos no Windows, 9 nos outros) e o vídeo inteiro pode esperar até 90 segundos pelas fotos no Windows (60 nos outros). Quando a Wikipédia, o Commons ou o Openverse demoram de verdade, o estúdio tenta mais uma vez, com mais tempo.
- **Aviso claro quando falta a foto de quem foi citado pelo nome.** Em vez de uma linha técnica por trecho, aparece um aviso só: de quem faltou a foto, o que entrou no lugar e o único passo para resolver. Na página do estúdio ele aparece em destaque, na aba de qualidade do vídeo.
- **Windows: copiar o estúdio para C:\ilustrando nunca recusa por pasta ocupada.** Se a pasta já tem outras coisas, a cópia vai sozinha para C:\ilustrando-2 (ou a próxima livre) e diz isso em uma frase. Se já existe um estúdio lá, ele é reaproveitado. Nada é apagado.

## 0.6.29 (03/11/2026)

- **Todo estilo colorido agora usa a cor da sua marca.** Antes, alguns estilos traziam uma cor própria e ignoravam a que você escolheu em Marca: o Cartões saía roxo, o Tubo vermelho e rosa, o Mindset e o Mindset 2 dourados e o 3D Alternativo verde-limão. Agora a palavra em destaque, a etiqueta, o brilho, o botão, o número e a barra saem na sua cor, nesses e em mais sete estilos: Fatos, Mundos, Moderno, Stop Motion, Teologia, Quadro Antigo e Antiguidade.
- **Os tons mais claros e mais escuros vêm da sua cor.** O estúdio clareia ou escurece a sua cor sozinho e escolhe branco ou preto para o texto por cima dela, para continuar legível.
- **Troque a cor uma vez e vale para tudo.** Mudou a cor da página em Marca? O próximo vídeo, em qualquer estilo, já sai com ela.
- **O 3D Alternativo ficou certo:** a cor da marca é o padrão, sem precisar pedir. As paletas lime, ciano e laranja continuam para quem escolhe pelo nome.
- **O personagem do Fatos (o Curioso)** também usa a sua cor.
- **As prévias da aba Estilos** dos estilos que mudaram foram refeitas na cor de destaque.
- **O que não muda:** os estilos em preto, branco e cinza (Impresso, Anatomia, Fino, Linhas, Preto e Branco e Pontilhismo) continuam sem cor, porque o desenho deles é assim. Se um vídeo seu antigo saiu com a cor errada, atualize o estúdio e faça de novo.

## 0.6.28 (03/11/2026)

- **O estúdio sempre diz qual é o próximo passo.** Em Começar aparece um cartão com o que fazer agora ("Próximo passo, 3 de 6"), uma frase curta e um botão Continuar. Quando tudo está pronto, o cartão leva direto para fazer o seu vídeo.
- **Nova aba Estilos.** Veja os estilos de vídeo e de carrossel em movimento, leia para que serve cada um e clique em **Copiar pedido** para colar no Claude ou no Codex. Dá para buscar por assunto. A frase segue o jeito que o estúdio já entende: "Faça um vídeo sobre o assunto. Estilo: pontilhismo. Objetivo: ciencia."
- **Nova aba Carrosséis.** Explica o que é um carrossel, tem pedidos prontos para copiar, mostra como trocar o estilo e como usar a sua marca, e lista os seus carrosséis com **Ver e baixar** (cada slide em PNG) e **Mostrar na pasta**. O guia dizia que o carrossel aparecia em Projetos; agora diz o lugar certo.
- **Melhor no celular.** Menu que desliza com a aba atual sempre visível, botões e campos maiores para o toque, campos que não dão zoom no iPhone, caixa de andamento na largura da tela e nada de rolagem para o lado.
- **Mais fácil de ler.** Textos secundários com mais contraste, fonte que aparece mais rápido, setas do teclado nas abas e link para pular direto ao conteúdo. A página usa a cor da sua marca nos botões e destaques.
- **Telas vazias que ajudam.** Meus vídeos, Projetos, Carrosséis e Estilos explicam o que fazer quando ainda não há nada, com um botão para o próximo passo. Em Atualizar, os 3 passos ficam sempre à vista.
- **Novo estilo Colagem 3D** (0.6.27) agora aparece no catálogo da aba Estilos, com a cor da sua marca.
- **Windows: copiar o estúdio para C:\ilustrando não trava mais quando a pasta já existe.** Se já há um estúdio lá, ele é o que se abre (nada é sobrescrito; para a versão nova, use Atualizar na página). Se a pasta tem outras coisas, o estúdio usa a próxima livre (C:\ilustrando-2) e diz qual. Se a cópia falhar por falta de espaço ou no meio do caminho, a mensagem diz a causa e o passo exato.
- **Uma foto que o navegador do estúdio não consegue tirar não derruba mais o vídeo.** O estúdio tenta de novo e, na conferência de qualidade, segue sem aquela medida em vez de parar com "o navegador fechou".
- **Instalar no Windows ficou mais simples** nos guias: Extrair tudo, Procurar, Disco Local (C:), Selecionar pasta e Extrair. No App do Claude a pasta se abre em **Open folder…**.

## 0.6.27 (03/11/2026)

- **Estilo novo: Colagem 3D (`colagem3d`).** Cada frase vira um plano de colagem em papel: a foto real recortada, o objeto 3D saindo do papel, o jornal, o documento ou o ano, sobre papéis com textura (creme, jornal, madeira, xadrez, mural escuro e outros) e uma câmera que anda em profundidade. Funciona para histórias reais, biografias, origem de marcas e invenções, casos do passado e do noticiário. Para pedir, diga ao assistente "faça em Colagem 3D" ou escolha o estilo em Começar > Estilo no estúdio web. O corte é rápido, a legenda fica em uma linha, o grão de filme é leve e o vídeo abre com uma capa própria do estilo.
- **Segue a cor da sua marca.** Realces, etiquetas, fitas, marca-texto e o fecho usam a cor de destaque da sua página (no caso da Ilustrando, o laranja), nunca outra cor. Se você trocar a marca, o estilo troca junto.
- **O texto de um plano não atropela o seguinte:** o estilo dá tempo de leitura a cada trecho, junta planos curtos e deixa a câmera mais lenta quando há muito para ler. Guia: `docs/estilo-colagem3d.md`.

## 0.6.26 (03/11/2026)

- **Windows: o instalador e o atualizador não falham mais por causa do Node 24.** Se o estúdio estava aberto no Node 24 do computador (atalho antigo, ou uma versão antiga ainda aberta durante a atualização), a última conferência recusava o Node e a atualização parava. Agora o instalador percebe sozinho e continua no Node 22 da pasta do estúdio (ou baixa esse Node), sem você fazer nada.
- **Windows: o estúdio não abre mais direto numa pasta que o Windows trava.** Logo depois do "Instalar (Windows)", o estúdio abria na pasta de Downloads ou do OneDrive sem passar pela cópia para C:\ilustrando, e caía uns segundos depois (erro 0xC0000409). Agora o Instalar abre pelo "Abrir Estúdio", que faz a cópia antes.
- **Fechar a janela preta do estúdio não vira mais "o estúdio caiu".** O código que o Windows dá quando você fecha a janela (ou aperta Ctrl+C) não abre página de ajuda nem manda aviso de falha.
- **O vídeo de exemplo do kit não sai mais com aviso de "peça sem relação".** O despertador da jornada, a cédula do salário e a calculadora da divisão agora combinam com a fala, e o mesmo vale para os seus vídeos que usam essas peças.
- **Estilo que precisa de uma peça escrita para o vídeo:** a mensagem agora diz o caminho de quem usa só o estúdio (escolher outro estilo em Começar > Estilo e clicar em "Tentar de novo", sem gastar a narração de novo) e o de quem usa o assistente. Antes o mesmo erro aparecia com o texto de "pecas.js com erro".
- **`sujeito.json` com um tipo que não existe não derruba mais o vídeo.** "metafora" vira "abstrato", "coisa" vira "objeto" e assim por diante; tipo desconhecido vira "abstrato", com um aviso no relatório. Vale também para o `cena.json` escrito pelo assistente.
- **Voz de teste num vídeo que já tem a narração paga:** se a narração pronta ainda vale para o roteiro, o estúdio usa ela no lugar da voz de teste (nenhum crédito gasto, nada sobrescrito). Se o roteiro mudou, o pedido continua parado com a explicação, para não gastar crédito sem querer.
- **Chave da ElevenLabs que é o "ID da chave":** a mensagem agora diz exatamente isso (a chave de verdade começa com `sk_` e só aparece uma vez, na hora de criar) e o estúdio avisa na hora de salvar, antes do primeiro vídeo.

## 0.6.25 (02/11/2026)

- **Instalar no Windows ficou mais simples.** O passo agora é só clicar com o botão direito no zip, "Extrair tudo", "Procurar...", escolher "Disco Local (C:)", "Selecionar pasta" e "Extrair". Sem digitar nada e sem criar pasta. O kit fica em C:\ilustrando-metodo-v... e abre o estúdio sem aviso de pasta. Guias, COMECE-AQUI, as mensagens dos instaladores do Windows e as skills passaram a dizer isso.

## 0.6.24 (02/11/2026)

- **Efeitos sonoros muito melhores.** Banco único de sons com amostras reais (clique, estalo, passagem, impacto, papel e muitos outros) escolhidas por estilo, mais um banco aberto de uso livre buscado quando falta um som. Continuam discretos, abaixo da voz.
- **Foto ou peça que não vem não derruba mais o vídeo.** Quando não há foto livre ou a rede está lenta, o vídeo sai com a peça do assunto (ou só com o nome como título) e a tela mostra um aviso âmbar em vez de erro vermelho. Nenhuma cena fica vazia. Dois pedidos sem resposta seguidos encerram a busca de fotos.
- **cena.json que o assistente escreveu com deslize é consertada sozinha:** BOM, cerca de código, comentário e vírgula sobrando (o original fica ao lado), título vazio, travessão longo, `efeitos.entrada` inválido, beat sobreposto e elemento nulo. Quando não dá, a mensagem diz o arquivo, a linha, a coluna e a causa provável, e a lista de problemas da cena sai inteira.
- **Navegador que não abre:** o estúdio tenta o Edge e o Chrome em 3 modos (padrão, enxuto e mínimo) antes de desistir, e a mensagem final leva o motivo real.
- **Windows: instalar e atualizar não falham mais por causa do Node 24.** Os programas que o estúdio lança passam a usar o Node 22 da pasta (ou o instalador baixa esse Node sozinho).
- **Atualizar nunca deixa a instalação pela metade:** se a conferência falha depois da troca, a atualização é desfeita e a tela diz a causa e como tentar de novo. Pacote igual ao instalado não é mais erro: aparece "O estúdio já está na versão X".
- **Vídeo em uso (Windows):** o selo e a montagem final trocam o arquivo com tentativas e, se o antivírus ou o player segurar, copiam por cima. A página solta o vídeo que está tocando antes de uma tarefa nova.
- **Mensagens com causa e passo exato** para: chave da ElevenLabs sem a permissão "Text to Speech" (os 2 passos), voz já gravada com outra voz, `pecas.js` com erro, imagem que falta, estilo sem a peça do projeto, falha ao desenhar uma cena, disco quase cheio e Node novo demais para o Windows. Erro desconhecido diz que o direct responde em até 24 horas.
- **Voz antiga (Piper) migra sozinha** para a voz que a pessoa tem ou para a voz de teste, sem erro e sem mexer no `.env`.
- **Página do estúdio:** depois de uma espera (fim da tarefa, ativação da licença, salvar a voz) o botão que sumiu não gera mais erro, e ruído de extensão do navegador não vira alerta.

## 0.6.23 (01/11/2026)

- **Windows: o estúdio não cai mais por estar numa pasta do OneDrive.** Telemetria: as quedas do estúdio ao abrir (erro 0xC0000409) aconteciam em pastas sincronizadas com o OneDrive no Windows 11 novo, com qualquer versão do Node. O "Abrir Estúdio" agora percebe a pasta, pede só um Enter, copia o estúdio para C:\ilustrando (vídeos, marca e chave vão junto; a pasta antiga não é tocada) e abre de lá, com atalho "Estudio de videos" na área de trabalho.
- **O aviso de pasta ruim agora funciona de verdade:** o script de cópia (`copiar-estudio.mjs`) não ia no pacote e passa a ir, junto com o novo `mover-estudio.mjs`.
- **A página não acusa mais a pessoa** quando o estúdio para de responder: diz que ele pode ter fechado sozinho, que os vídeos continuam salvos e o que fazer.

## 0.6.22 (01/11/2026)

- **Teologia: a obra muda com o assunto de cada beat.** O plano automático escolhia sempre o passe-partout para todas as fotos. Agora pessoa (profeta, apóstolo, santo, papa, filósofo) vira medalhão; sofrimento, morte ou juízo, a obra escurecida cobrindo a tela; igreja ou catedral, janela gótica; céu, anjo ou glória, nicho em arco dourado; pintura citada, moldura de ouro; carta, livro ou evangelho, recorte rasgado em sépia; deserto, monte ou cidade, a obra que sangra pelo topo. Nunca a mesma obra em dois beats seguidos.
- **Peça larga se dimensiona pela proporção.** Peça com largura de 1,6 vez a altura ou mais (ônibus, carro, carrinho) ocupa a largura útil inteira e a câmera do beat fica quase parada: antes o push-in fazia o encaixe encolher a peça (o carrinho do Maps ficou com 24 a 38% da altura). Ela continua sem sair da tela, e o QA avisa quando ela fica minúscula (`peca-larga-pequena`).
- **Aviso de resolução no QA.** Foto, logo ou obra usada grande com arquivo pequeno (ampliada mais de 1,5 vez) gera o aviso `resolucao-baixa`, com o tamanho do arquivo e o da tela; acima de 2 vezes o aviso é grave e o vídeo não sai como publicável. Era o caso do medalhão de Lactâncio no Jó, ampliado 2,27 vezes, que passou com nota 100.
- **Entrada do logo e da bandeira.** O logo e a bandeira passam a ter o papel de peça no repertório de entradas (`gira`, `cresce`, `desliza`): o plano automático agora inclui o logo no rodízio (antes o logo nunca recebia entrada e todo beat de logo saía igual). A `entrada` escrita à mão no `cena.json` já chegava ao motor; um teste no navegador agora prova isso.
- **Seis estilos desenham o assunto da frase (kit aberto, F4).** Linhas, pontilhismo, preto-branco, moderno, quadro-antigo e antiguidade aceitam o desenho do objeto da frase em `pecas.js` (export com o nome do estilo; os nomes com hífen no `export default`), apontado em `sujeito.json`. Com ele, o plano automático usa o planejador por intenção e verbo (o desenho muda de fase quando o verbo é dito), a validação confere a peça e o QA da cena roda os verificadores do estilo. O kit é opcional: sem ele, esses estilos saem exatamente como antes.
- **Linhas: a câmera não leva mais a forma larga para a borda.** O travelling que segue o ponto encostava o desenho de 820 px na lateral; agora o deslocamento cabe na margem, e o QA mede a forma com a câmera (antes não via o vazamento).
- **Pontilhismo com desenho do projeto: o quadro 0 já mostra o desenho** (os pontos nasciam do escuro e os 3 primeiros quadros saíam quase pretos).
- **Preto-branco com desenho do projeto:** o tom só inverte quando o desenho muda de fase, sem o mergulho cinza entre beats do mesmo desenho (a tela piscava claro e escuro a cada beat); título com até 2 palavras (3 palavras longas passavam da faixa de baixo); desenho um pouco menor, longe dos botões do Reels.
- **Moderno com desenho do projeto:** o traço fica claro sobre a janela escura (o corpo do bicho quase sumia).
- **Antiguidade com desenho do projeto:** a obra emoldurada fica dentro da margem mesmo no fim do push-in (encostava nas bordas) e o QA mede a moldura.
- `sujeito.json` com `dados.objeto` não gera mais o aviso falso de "objeto sem partes, cai no genérico" (a peça do projeto já tem as partes).
- **Estilo novo: Fatos (`fatos`).** Dado de satélite sobre carvão, portado de 4 Reels de referência analisados quadro a quadro: o texto da fala se monta no alto palavra a palavra (Inter Tight) com a virada em Playfair Display itálica no acento, número grande que conta, mapa de satélite escuro em tela cheia com o lugar aceso em cor natural, contorno no acento, linhas de fluxo e alvo com o nome, globo que gira, câmera que viaja de um lugar ao outro sem corte, lista, barras, gráfico de linha, busca digitando, grade de pessoas, linha do tempo, foto da pessoa citada com cantos de mira, barra de progresso no topo e fecho com as opções em pílula. Seis cenários medidos nas referências (satélite, satélite em alerta, globo, palco em 3D com o Curioso, personagem próprio da página e trocável como dado, papel antigo com mapa a tinta e painel) e sete movimentos de câmera nomeados (empurrão, recuo, deriva, órbita, mergulho, fixa e tremor), escolhidos por beat (`cenario`, `camera`) ou pelo plano automático conforme o assunto e o momento da frase. Plano automático pela fala (número no começo da frase, lugar vira mapa, pessoa vira foto, a frase cortada na vírgula volta a ser uma só), som discreto, QA e teste. Guia em `docs/estilo-fatos.md`.
- **Estilo novo: Mindset 2 (`mindset2`), o 24º.** Traço fino luminoso (ouro, turquesa e cobre) com brilho em retícula sobre carvão com grão, poeira e cone de luz; uma ilustração por ideia (pessoa, relação, corpo que sente, mente, coração, relógio, semente, escada, porta, alvo, sol, lua, órbita, constelação, numeral) que se desenha no centro enquanto a anterior desliza e apaga, sem corte seco; rótulo de HUD em mono com o número do item dito ("02 · TEMPO") e pontos de progresso; legenda de uma linha em Poppins (Regular, com a palavra-chave em Bold amarela e sombra escura) que acende palavra a palavra; etiqueta do HUD em Space Mono Bold (OFL); seis ambientes das referências (carvão, palco com cone, palco com disco, cosmos, horizonte com lua, interior) e sete câmeras nomeadas (empurra, recua, desce, travelling, órbita, aproxima, fixa), escolhidos por beat no cena.json (`cenario`, `camera.mov`) ou pelo plano conforme o assunto, num mecanismo comum de cenários de estilo em que o projeto cria o seu cenário em `pecas.js`; retícula, hachura, grão que ferve devagar, poeira, cone e franja medidos pixel a pixel nas referências; fecho com a constelação do vídeo e o botão "COMENTE ILUSTRANDO". O plano automático escolhe a ilustração pelo que a fala diz, numera os itens ("Um:", "Dois:") e mantém o mesmo desenho quando a frase do item continua no beat seguinte. Guia: `docs/estilo-mindset2.md`.
- **Estilo novo: Mindset (`mindset`), o 25º: bonecos no palco.** Um palco grafite com chão que reflete os bonecos; o boneco dourado (quem age) contra o cinza (o outro), com volume, sombra de contato e luz de recorte; uma cena-metáfora por ideia (comparação, escada, alvo, muro que sobe tijolo por tijolo, multidão, sol que nasce, jardim que brota, zonas de conforto, dois círculos, barra do ano que enche, numeral, frase de impacto, foto da pessoa citada e fecho com o boneco que acena), que muda sem corte seco; etiquetas da comparação em Montserrat que acendem quando o dourado age; legenda Montserrat de uma linha em que cada palavra entra quando é dita (chave em dourado); frase de impacto em Poppins ExtraBold Italic com a esfera dourada no lugar do "o". O palco é 3D de verdade (three.js): bonecos com material, sombra, olhos, luz de recorte e reflexo no chão, e 12 cenários das referências (palco, sem chão, cidade, quarto, escritório, chuva, seca, cais, debaixo da água, penhasco, estádio e fogo), declarativos e registrados no mecanismo comum de cenários dos estilos, com 11 movimentos de câmera nomeados (fixa, push-in, pull-out, órbita, travelling, parallax, grua, tilt, segue, close e tremor) escolhidos pelo momento da frase; o projeto pode trazer cenário próprio em pecas.js e o QA confere câmera e cenário sem render. O plano automático escolhe a cena pelo que a fala diz, tira as etiquetas do "X ou Y" dito e põe as frases paralelas ("Quem pensa... / Quem faz...") na mesma cena. Fontes novas de licença livre: Montserrat Regular e SemiBold, Poppins ExtraBold Italic. Guia: `docs/estilo-mindset.md`.
- **Windows: o Node 24 do computador não é mais usado.** Telemetria: o Node v24 foi derrubado pelo Windows (0xC0000409) uns 70 s depois de abrir. O "Abrir Estúdio" e o instalador só usam o Node do computador abaixo da série 24 e, fora isso, o Node 22 LTS portátil da pasta; o diagnóstico (`doctor`) avisa quando o Node em uso é novo demais no Windows. O aviso `DEP0190` (`shell: true` com argumentos) saiu: o `claude` e o `codex` (.cmd) rodam por `cmd.exe /d /s /c`, sem a opção shell (`src/video/node-versao.mjs`). Quando o estúdio fecha com 0xC0000409 ou com 4294967295, a mensagem manda copiar a pasta para `C:\ilustrando` e abrir de novo.
- **Chave de API colada incompleta não é mais falha do estúdio.** Erro de validação do que a pessoa digitou (chave incompleta, com espaço ou formato errado) vira resposta 400 com a mensagem amigável e não vai para a telemetria; só erro inesperado continua indo (`ErroEntrada` em `configlocal.mjs`).
- **Relevância: peça escrita à mão não é mais trocada.** O reparo automático só mexe no plano automático (cérebro virava moeda por "dinheiro", astronauta por "espaço"). Em cena escrita à mão, `peca-sem-relacao` é aviso normal e não derruba o `publicavel`; no plano automático segue grave. Novo campo `"fixa": true` (ou `"relevancia": false`) no elemento trava a peça (docs/cena-schema.md e skill `cena`). Casamento ajustado: cérebro evoca burro, cabeça, mente, pensamento; barras evocam igual, pior, melhor, maior; prancheta e matriz evocam teste e raciocínio.
- **Busca de foto confere o contexto antes de aceitar.** "revista Science" não traz mais banda, "Agostinho" não traz "Agostinho Neto", sigla sem contexto da fala (Cofins) não busca foto e palavra solta (Salmo) só vale com artigo exato de enciclopédia; na dúvida vale "nada achado" (o plano cai no ícone ou na forma procedural). `buscar-imagem --listar` mostra o tamanho real do arquivo, e o validador avisa medalhão escrito com `itens` (desenhava o ícone de reserva sem dizer).

## 0.6.21 (31/10/2026)

- **O estúdio avisa sozinho quando a janela preta é fechada:** a página confere a cada poucos segundos e, se o estúdio parou de responder, mostra o que fazer (abrir de novo e, para o diagnóstico, os dois cliques em "Diagnóstico"), sem esperar o primeiro clique que falha.

## 0.6.20 (31/10/2026)

- **Primeiro vídeo que não anda:** a tela "falta o roteiro" agora mostra a pasta e o projeto que o estúdio vigia, a nota do roteiro e o motivo se foi reprovado, e avisa se o assistente gravou em outra cópia da pasta. Há um botão para copiar o diagnóstico do primeiro vídeo.
- **O assistente não mexe no seu navegador:** as skills e o pedido do estúdio passam a dizer que ninguém precisa abrir nem controlar o navegador; o estúdio se atualiza sozinho.

Dois caminhos para começar: o estúdio no navegador (clicar) ou o kit inteiro pelo Claude Code ou pelo Codex, sem abrir o estúdio.

- **Novo: ligar a voz pela conversa, sem o estúdio.** `npm run voz` cria o arquivo `.env`, abre no TextEdit ou no Bloco de Notas, e você cola a chave lá. A chave nunca passa pelo chat. `--conferir` diz só `ok` ou o motivo (vazia, formato, recusada, sem a permissão de fala, plano grátis, créditos, sem internet). `--voz-padrao` escolhe uma das 10 vozes.
- **A chave também vale como variável de ambiente** (`ELEVENLABS_API_KEY`) quando a linha do `.env` está vazia.
- **Ativar a licença pela conversa:** `npm run ativar -- seu@email.com --aceito`. Mensagens prontas para e-mail que não confere (sem dizer se ele existe), limite de 2 computadores e falta de internet.
- **Novo: `npm run comece -- --situacao`** mostra numa tela o que falta para o primeiro vídeo e qual é o próximo passo.
- **`--ajuda` funciona** (antes era tratado como nome de projeto), e `--json` em `status`, `doctor`, `voz` e `ativar` para o assistente ler com segurança.
- **O diagnóstico mostra a linha da voz** (chave presente, formato e última conferência), sem mostrar a chave.
- **Skill `comece` com modo assistente:** conduz em português simples, um passo por vez, no Mac e no Windows, com texto pronto para cada erro e para quando o limite do plano acabar.
- **Mais proteção da chave:** o Claude Code do estúdio não lê o `.env`, o Codex não roda `cat` nele, e o pacote e o git barram `.env` e `.env.*`.
- **Novo arquivo `COMECE-AQUI-DUAS-PORTAS.md`** na raiz do pacote, de uma tela, com as duas portas.

## 0.6.19 (31/10/2026)

Correções dos erros que chegaram de compradores, mais melhorias nos vídeos e nos estilos Pontilhismo e Teologia. Nada foi lançado: `VERSAO` continua em 0.6.18.

**Voz, instalação e diagnóstico**

- **Chave da voz aceita do jeito que foi copiada:** com aspas (inclusive as curvas), com o nome da variável na frente (`ELEVENLABS_API_KEY=...`), com `xi-api-key:` ou `Bearer`, com ponto final ou espaço sobrando.
- **Chave restrita (só Text to Speech) não é mais recusada.** Sem a permissão de música, o estúdio diz isso no log da trilha e segue com a voz.
- **Windows: a página de ajuda mostra o erro de verdade,** em vez do texto genérico "A instalação ou a abertura do estúdio parou".
- **Instalador e estúdio gravam um registro local** (`.estudio\instalacao.log` e `.estudio\estudio.log`), e o "Copiar diagnóstico" inclui o fim dos dois, mesmo se o estúdio nunca abriu.
- **Novo: dois cliques em "Diagnóstico (Windows)" ou "Diagnóstico (Mac)"** monta o diagnóstico completo (versão, sistema, conferência do computador, registros) sem abrir o estúdio e já copia para você mandar ao suporte.
- **Instalador no Windows com mensagem específica** para caminho comprido demais, disco cheio, antivírus ou permissão e falha de rede. A oferta de copiar a pasta para `C:\ilustrando` passa a valer a partir de 110 caracteres de caminho (era 180).
- **Node quebrado é refeito sozinho:** se o Node do estúdio não abre (antivírus em quarentena, arquivo corrompido), o instalador apaga só essa parte e baixa de novo.
- **Estúdio que fecha sozinho no Windows** agora aparece com causa e ação (antivírus ou Node corrompido), em vez de um código numérico sem explicação.
- **Erros que antes vinham "sem tradução"** (`cena.json` inválida, arquivo do próprio estúdio faltando) agora dizem o que fazer.
- **`cena.json` mais tolerante:** plano de câmera `perto`/`longe`/`close`/`wide` vira o plano certo, plano ou movimento que não existe usa o padrão e `id` repetido ganha sufixo, tudo só com aviso.

**Vídeos (estilo padrão)**

- **Peça que "entrava duas vezes" some:** a mesma peça (mesmo `id`) em beats seguidos fica na tela e só se transforma. Novo aviso `peca-reentra` no QA quando ela some e volta, muda de lugar ou de tamanho sem motivo.
- **Sem quadro-fantasma no corte seco:** o beat novo não aparece mais 1 quadro antes do corte.
- **Entradas mais variadas** (modelos curiosidades e noticia): nenhuma entrada passa de 40% dos beats, a cena escrita à mão também passa pelo rodízio, e a entrada "cresce" ficou mais suave.
- **Texto principal na palavra que o motiva** (estilo teologia) e **viradas com a duração real** (íris e folha).
- **Capa nítida:** `capa.jpg` é o quadro do vídeo com o título, sem camada escura nem gancho gigante por cima da peça. Desligar: `efeitos.capaNitida: false`.
- **Peças novas no repertório de tecnologia** (`mapa-transito`, `celular-mapa`).
- **QA mais exigente:** zoom rápido de câmera (limite de 8%/s), altura real do protagonista, salto de luminância e contraste entre beats, texto nos 250 px do topo. O `entrega.json` marca `publicavel: false` se houver aviso grave aberto.

**Áudio**

- **Trilha sobe nas pausas** (3 dB acima do nível cheio, soltura de 0,2 s) e os efeitos têm piso (voz menos 14 LU), então o Maps sai com -30 LUFS sem remix à mão. `efeitos.pausaDb` (0 a 8, padrão 3) ajusta a subida.
- **Respiros naturais:** a compactação da narração deixa 3 a 5 pausas reais da própria voz (0,55 s) em vez de cortar tudo para 0,2 s. `scripts/respiros.mjs --naturais` faz isso em projeto antigo sem gastar voz; `--trilha --em=palavra.,outra?` escolhe as frases dos respiros.
- **Proteção de voz:** projeto que já tem narração de ElevenLabs, Fish Audio ou gravação própria não troca de provedor sem `--trocar-voz`.

**Estilo Pontilhismo**

- **Astros e elementos no lugar de número** (`engine/pontos-astros.js`): `sol` em esfera de pontos 3D com granulação e halo, `globo` com a Terra inclinada (continentes, luz do Sol, eixo, arco do ângulo), `sistema` (linha e órbita do periélio ao afélio), `barras`, e `floco`, `ampulheta`, `termometro`, `diferente`, `seguir`. Regra "elemento antes de número" em `docs/pontilhismo.md` e no plano automático.
- **Correções na raiz:** a chuva de pontos do ≠ e o pó de fundo herdavam raio e opacidade errados; limite de largura e altura por forma; continentes da Terra entram assim que o morph acaba; cauda padrão de 1,2 s; foto (obra) abre e fecha mais rápido. Mapa de continentes padrão em `biblioteca/astros/terra-mapa.jpg`.

**Estilo Teologia**

- **Arte com apresentação variada por beat** (`apresentacao`: `moldura`, `tela`, `dividida`); sem escolha, o estilo gira. Nunca amplia a imagem mais de 1,8x (cai para a moldura e avisa).
- **Texto em bloco único** abaixo da arte, kicker colado na primeira linha (34 px) e entrando junto com o texto que rotula; quebra de linha equilibrada, sem terminar em "de", "a", "que".
- **Contraste de pelo menos 5:1 em todas as paletas;** crédito fora da zona de 340 px do rodapé; plano automático de tons sem salto de luminância.
- **Fecho com celular 3D** (`estilo-teologia-celular.js`): botão Seguir tocado (vira Seguindo) e comentário digitado. O sol com @ só com `visual: "sol"`.
- **Capa do estilo:** título no alto em fundo limpo, a cena desce e encolhe.
- **Fica para o próximo ciclo:** o autoplano ainda não escolhe obra por beat; aviso de QA para imagem de baixa resolução antes do render; o retrato de Lactâncio do Jó v4 continua sendo um afresco anônimo.

**Testes novos:** `diagnostico-0619`, `variedade-0619`, `viradas-0619`, `texto-na-fala-0619`, `qa-visual-0619`, `protecao-voz-0619`, `trilha-0619`, `sincronia-0619`, `reentrada-0619`, `raiz-0619`, `pontos-astros`, `teologia-0620`, além de casos em `camera` e `qa-gravidade`.

## 0.6.18 (31/10/2026)

- **Erros de JavaScript da página com detalhe:** o aviso anônimo de `erro-js` e `promessa-rejeitada` passa a levar a mensagem do erro e as 2 primeiras linhas da pilha, saneadas (sem caminho de usuário `/Users/x` ou `C:\Users\x`, e-mail, chave ou token longo, endereço local nem query string; mensagem cortada em 300 caracteres e cada linha da pilha em 160). Vai no campo `diagnostico` do aviso (o servidor de licenças já aceita até 8 KB e sanea de novo), então `node scripts/falhas.mjs --detalhe erro-js` mostra o texto. Nenhuma mudança no servidor de licenças.
- **Pasta em Downloads, OneDrive, Mesa ou Documentos sincronizados (Windows):** o estúdio detecta ao abrir e no doctor, mostra um aviso com o passo a passo exato (na página, no terminal e no item `lugar` do doctor) e **oferece** copiar o estúdio para `C:\ilustrando`: botão "Copiar" na página (com confirmação) ou `node scripts/copiar-estudio.mjs` (pergunta "sim"). Nunca copia sozinho, nunca apaga nem muda a pasta atual, recusa destino ocupado, aninhado ou sem espaço, e desfaz o que copiou se parar no meio. No Mac a pasta ruim recebe só o aviso.
- **Código de falha pela mensagem, não pelo doctor:** a classificação (`traduzirErro` e `codigoComDetalhe`) ignora as linhas do doctor ("ok / aviso / ERRO", dicas `->` e o bloco "Instalação (doctor)" do diagnóstico copiado). Antes um doctor que listava o FFmpeg podia dar `sem-traducao-c1-ffmpeg` a um erro da ElevenLabs. Erro de etapa interna (`fn`) agora entra na saída da etapa que falhou. Teste de regressão: `invalid_api_key` da ElevenLabs com doctor citando o FFmpeg vira `voz-chave-recusada`.
- **Aviso `peca-sem-relacao` (o mais frequente da telemetria, 86 casos):** a nota "fala x imagem" dava 0 a peça que o autor da cena escolheu de propósito (calendário para meses, balança para "os dois estão certos"), ao nome de peça do projeto que a fala cita ("garrafa-pet"), ao fecho padrão ("Segue aqui", "Siga a página", "manda pra um amigo") e a beat com número ou foto certos mais uma peça de enfeite. Agora esses casos valem apoio (1) ou casam (2), o léxico entende o fecho e a ideia acesa conta como apoio neutro declarado. Antes do QA, a peça do catálogo sem relação com a fala é trocada por uma que a fala sustenta (cena escrita à mão só troca por peça citada na fala; peça do projeto e peça com `dados` nunca mudam). O aviso que sobra diz a frase exata para pedir ao assistente. Medido nos 330 projetos do repositório: beats sem relação de 3091 para 1069 (cenas à mão); no plano automático, 0 em 3627 beats de 22 estilos x 28 roteiros.
- **Aviso `foto-nao-encontrada-sem-licenca` (39 casos):** (1) arquivo achado cujo download falhava (429, tempo) saía como "sem licença livre"; agora mostra o motivo verdadeiro, e a miniatura que não baixa tenta o arquivo original; (2) nova fonte, imagem principal do item na Wikidata (`P18`), para o que a Wikipédia deixa de fora; (3) nome com cargo ("presidente Lula") tenta também só o nome; (4) foto que falha em cena sem peça de reserva não esvazia mais o beat: a peça vem da fala do trecho; (5) mensagem em duas frases, o que houve e o que fazer.
- **Telemetria com rótulo fechado (sem texto do roteiro):** `peca-sem-relacao-<foto|peca|modelo|outro>` e `foto-nao-encontrada-<motivo>-<nada-achado|achou-mas-nao-baixou|fonte-falhou>`, além dos códigos de sempre.

## 0.6.17 (31/10/2026)

- **Chave da ElevenLabs conferida na hora de salvar:** o estúdio pergunta à ElevenLabs se a chave vale (sem gastar crédito). Chave recusada mostra "A ElevenLabs não reconheceu essa chave", explica como criar outra e não salva. Sem internet ou resposta inesperada não bloqueia. Chave sem a permissão de ler o usuário conta como válida.
- **Chave recusada na narração (`invalid_api_key`, `authentication_error`, HTTP 400):** vira `voz-chave-recusada`, com o passo de criar uma chave nova, em vez de "erro que o estúdio não reconheceu" (antes saía até com o código `sem-traducao-c1-ffmpeg`, que confundia o diagnóstico).
- **`cena.json` mais tolerante:** `"true"`, `"false"`, `1` e `0` nos efeitos viram booleano com aviso, e uma `entrada` que não existe para a peça é ignorada com aviso (usa a padrão), em vez de parar o vídeo com "cena.json inválida".

## 0.6.16 (30/10/2026)

- **Voz: a ElevenLabs passa a ser a voz padrão e o Piper foi removido.** O Piper dependia de Python portátil e do onnxruntime e falhava no Windows (antivírus, Visual C++, queda do programa). O instalador não baixa mais Python nem voz nenhuma. Começar > Voz ganhou um guia de 5 passos (criar a conta grátis, gerar a API key, colar a chave no estúdio, ouvir as 10 vozes padrão e escolher, e o que fazer quando a cota do mês acabar: assinar um plano ou criar outra conta grátis com outro e-mail). Sem chave, "Fazer meu primeiro vídeo" e o vídeo de teste explicam e levam ao guia, sem criar pasta nem instalar nada. Sem voz de reserva: se a voz paga falhar, o vídeo para com a mensagem explicada. Quem já tem o Piper em `.programas/python` não quebra (a pasta é ignorada). A Fish Audio segue como alternativa.
- **Oito estilos agora de kit aberto (Onda 4):** letreiro, interface, colagem, cartões, tubo, impresso, ribalta e mundos desenham a ideia de cada frase no `pecas.js` do projeto, com planejador por intenção e verbo, verificador estático e guia em `docs/estilo-<id>.md`. Sem a peça declarada o plano para com um erro em português que diz o que escrever (nunca recua para peça genérica nem para outro estilo). A skill `cena` ensina o fluxo. Conformidade aberta de 30 casos por estilo: letreiro, interface, colagem, ribalta e mundos 30 de 30; cartões, tubo e impresso 29 de 30 (o caso da Ada Lovelace fica sem foto de propósito). O exemplo `ceu-azul` do primeiro vídeo deixou de pedir o ribalta e usa o plano automático.
- **Projetor removido** (estilo, modelo, guia e casos): agora são 23 estilos.
- **Capa em encaixe por silhueta, opcional (desligada por padrão):** o gancho curto (2 a 10 palavras) ganha uma palavra principal grande e as outras nos vãos reais das letras. Vídeo: `"capaEncaixe": true` em `ilustrando.config.json` (vale para todos) ou em `efeitos` do `cena.json` (só naquele vídeo), nos modelos curiosidades e noticia. Carrossel: `"capaEncaixe": true` no `carrossel.json` ou `"encaixe": true/false` no slide de capa. Gancho que não serve (curto, longo, sem palavra de 4+ letras) cai na capa de sempre, e o QA avisa (`capa-encaixe-indisponivel`, `capa-encaixe-solto`). O QA do carrossel não marca as caixas encaixadas como sobrepostas. Módulo: `engine/capa-lockup.js` (a cópia `src/carrossel/capa-encaixe.js` é conferida por teste).
- **Capas sociais:** `node scripts/gerar-capas-sociais.mjs` gera a capa do YouTube (2560x1440, texto dentro da área segura de 1546x423) e a do Facebook (1640x924, texto dentro de 1280x624, canto da foto de perfil livre): a assinatura da página no centro e, nas laterais, celulares com quadros reais dos Reels. O @ vem de `marca/tokens.json` e o script para se ele não for @kaueajure.
- **Instalador e erros:** quando o teste de abrir uma voz fecha sem mensagem, o relatório traz o código de saída (tipo `queda`); a voz `arquivo` sem gravação virou uma mensagem em português (`voz-arquivo-sem-gravacao`).
- **Aviso de legenda curta no QA:** página de legenda que fica menos de 0,30 s na tela vira aviso `pagina-curta` (nos vídeos de 30/10 eram 0,7% das páginas, quase todas na borda de frase ou de corte). O motor expõe `window.ilu.paginas()` para o QA.

## 0.6.15 (30/10/2026)

- **Retrato real em anatomia e fino:** o sujeito pode declarar `dados.retrato = { arquivo, nome, beats?, foco? }` e o estilo mostra um cartão com a foto (papel claro com borda cinza na anatomia, fundo escuro com borda fina no fino), com o nome numa linha fora da foto, nos beats que citam a pessoa. Fecha os casos 11 (14-bis, Santos Dumont) e 12 (máquina analítica, Ada Lovelace): **conformidade autorada 30 de 30 nos dois estilos**.
- **Aviso de versão nova dentro do Claude Code e do Codex:** o CLI do vídeo escreve no começo da saída "Aviso do estúdio: a versão X já saiu (você está na Y)..." (uma consulta por dia, sem dado pessoal, silêncio sem internet), e as skills `video` e `comece` mandam o assistente repetir a frase para a pessoa na primeira resposta e seguir o trabalho. O estúdio web já tinha o banner. O servidor do estúdio passa a publicar só a versão, sem e-mail, para o aviso aparecer sem depender do e-mail.
- **Falhas reais da 0.6.14 (auditoria de 30/10):** o vídeo pronto que não podia substituir o anterior (aberto no player, na prévia do Explorer ou preso pelo antivírus) falhava com `EPERM` e era contado como problema de pasta; agora o estúdio tenta por até ~15 s no Windows e, se ainda estiver preso, diz que o vídeo está em uso e pede para fechá-lo e tentar de novo (`video-em-uso`). "Esta versão já está instalada" deixou de contar como falha na telemetria.
- **Onda 3b, anatomia e fino com pose:** o kernel de objeto declarado agora entende, por estado, `escalas`, `rotacoes`, `surge` (parte que surge ou some), `cores` (só anatomia) e `fluxo` (pontos correndo por um tubo), com transição suave de 0,6 s entre os beats e uma órbita lenta de câmera. Conformidade autorada: **30 de 30 em anatomia e em fino** (28 com o kernel e os 2 casos de pessoa nomeada fechados com o retrato real). `scripts/conformidade-autorada.mjs`, `test/estilos-autorados/`.
- **Onda 5, tela assentada:** a medida usava o hash do quadro e dava 0% em todos os vídeos; agora compara a composição (grade de 24 px). Metas de preto-branco, stop-motion e letreiro subidas para 70%.
- **Onda 3, anatomia e fino generativos:** kit axonométrico MIT com `Path2D`; objeto autoral de `sujeito.json`/`pecas.js` e estados por beat, sem peças genéricas quando há declaração. Verificadores estruturais sem render e guias incluídos. Conformidade aberta: 0/30 em cada estilo, pois os casos não declaram objeto; o kernel falha com orientação em vez de substituí-lo. Matriz curta: 29/29 modelos idênticos à linha de base; Pontilhismo não está representado por modelo de fábrica na matriz.

## 0.6.14 (30/10/2026)

- **Correções das falhas reais da 0.6.13 (telemetria de 29 e 30/10):**
  - número só um pouco fora da faixa no `cena.json` (ex.: `tamanho` 2.6 onde o limite é 2.5) vira aviso e é ajustado; antes travava o vídeo com "cena.json inválida" (até 25% além do limite; mais longe continua erro);
  - `marca/tokens.json` gravado com BOM no Windows (`Unexpected token` no plano e no carrossel) agora é lido normalmente;
  - vídeo acima de 100 MB (ex.: 88 s em 112 MB) deixou de reprovar como "defeito": o estúdio recodifica uma vez com teto de bitrate calculado e entrega, sem gastar crédito;
  - trava de "vídeo ocupado" ganhou sinal de vida a cada 20 s; processo travado com o pid ainda existindo deixa de bloquear o projeto depois de 10 min;
  - instalação da voz grátis no Windows: usa o `tar` do próprio Windows (o `tar` do Git lia `C:\` como computador remoto e a extração do Python portátil falhava) e o erro do tar entra no relatório.
- **Roteiros longos:** a faixa de palavras pode vir de `duracao.alvo` no Objetivo; o linter passa a sugerir o ritmo e os capítulos conforme a duração.
- **Narração longa:** textos extensos são divididos em blocos de até 3.500 caracteres, guardados para retomada e enviados com contexto anterior e seguinte.
- **Trilha longa:** acima de 5 minutos, a música é gerada em partes de até 5 minutos, reaproveitadas após interrupção e unidas com crossfade.
- **Render longo:** vídeos a partir de 4 minutos são montados em partes de até 2 minutos; a linha do tempo é preservada e os quadros continuam no cache. O teto padrão do cache cresce com a duração, até 7 GB em 10 minutos.
- **QA de ritmo:** beats acima de 12 s não reprovam pelo tamanho. O relatório agora mede mudança no conteúdo e posição dos elementos a cada 0,5 s; avisa sobre permanências acima de 2 s e reprova só quando a tela medida fica sem mudança por mais de 12 s. Vídeos acima de 4 min recebem aviso de ganchos e viradas entre capítulos.
- **Sujeito e biblioteca (Onda 2):** campo opcional `sujeito` no `cena.json`, lint de storyboard (só avisos), `scripts/biblioteca.mjs` e `scripts/storyboard-lint.mjs`. Sem `sujeito` nada muda.
- **Calibração da Onda 5:** metas dos verificadores ajustadas em 232 vídeos reais (densidade do padrão 9 por 10 s, palavra-gatilho até 3,5 s antes, salto de emenda desligado nos estilos que alternam fundo claro e escuro, mínimo de parado do cartoes removido). Só avisos; nada que reprovava mudou.
- **Conformidade (Onda 7, só do mantenedor):** 30 casos abertos por estilo e `scripts/porteiro-estilo.mjs`.
- **Verificadores comuns (Onda 5):** `qa-verificadores.mjs` e `qa-movimento.mjs`. Avisos novos para todos os estilos: densidade de eventos por 10 s, tela assentada, palavra-gatilho fora de hora, fluxo óptico contra a meta de movimento do estilo, salto de fundo nas emendas (t±0,05 s) e texto da tela pouco ligado à fala. Só reprova o texto da tela sem nenhuma palavra da fala (3 ou mais palavras de conteúdo); a tela imóvel continua sendo a do QA por novidade (12 s). O crítico visual ganhou perguntas por estilo.

## 0.6.13 (29/10/2026)

O vídeo combina duas escolhas: **Estilo** (a aparência) e **Objetivo** (o que ele quer ser). Dá para pedir, por exemplo, "Estilo: pontilhismo, Objetivo: venda".

- **Estilo:** o jeito que o vídeo parece. São 24 (padrão, editorial, papel, pontilhismo, teologia, anatomia, colagem e os outros). Lista: `npm run estilos`.
- **Objetivo:** o que o vídeo quer ser. Decide o tamanho do roteiro, o jeito de abrir, a voz, o convite final e a legenda. São 14: os 12 de sempre (curiosidade, aula, notícia, finanças, fé, negócio, receita, esporte, saúde, tecnologia, história, ciência) e dois novos, **venda** e **tutorial**. Lista: `npm run objetivos`.
- **Qualquer estilo com qualquer objetivo.** Sem escolher estilo, o objetivo usa o estilo que combina com ele. Escolhendo só o estilo, ele vem com o jeito de roteiro que sempre teve.
- **No estúdio web,** o passo "Tipo de página" agora se chama "Estilo e objetivo": você escolhe o objetivo e, se quiser, o estilo.
- **Nada do que você já tinha muda.** As escolhas antigas continuam aceitas por compatibilidade, e o vídeo sai igual. O estúdio mostra uma dica com os nomes novos.
- **A atualização troca os nomes sozinha:** o padrão da página passa a ser gravado como Estilo e Objetivo, e as fichas pessoais ganham cópias nas pastas novas (`estilos/meus/` e `objetivos/meus/`), sem apagar os originais. Antes de mudar, guarda uma cópia de segurança; se algo falhar, desfaz sozinha, e `npm run atualizar -- --desfazer` volta tudo. Quem já tinha escolhido o tipo de página não é perguntado de novo.
- **Mensagens mais claras:** se você escrever um estilo no lugar do objetivo (ou o contrário), o estúdio explica qual é qual e sugere o nome certo.

Correções dos estilos achadas na auditoria de 29/10 (nada muda no jeito de usar):

- **Foto da pessoa citada em letreiro, interface e moderno:** a foto sumia da tela nesses três estilos. Agora ela aparece com o acabamento de cada um: cartão editorial no letreiro, painel com barra de título na interface e janela de vidro no moderno.
- **Foto que cabe nos estilos de painel:** em interface, moderno, projetor e mundos a foto do plano automático ganha altura de retrato (mesma largura de antes). Antes o vídeo com pessoa citada costumava voltar sozinho para o estilo padrão.
- **Número do roteiro de volta em projetor, mundos e interface:** o número era apagado e virava uma peça qualquer. Agora ele conta até o valor da fala, centralizado: projetado no slide (projetor), dentro da janela do mundo (mundos) e num painel que conta (interface). Ano sai sem ponto ("1921").
- **Convite final no mundos:** o título do convite ("Segue a página e comenta...") voltou, grande e no centro.
- **Marca citada no alternativo e no quadro-antigo:** o logo sumia. Agora ele aparece inteiro, com as cores e o desenho originais: num cartão da interface de dados (alternativo) e impresso num cartão de papel com a frase batida à máquina (quadro-antigo).
- **Estilo fino não vira mais anatomia:** em qualquer assunto o fino desenha o objeto em camadas no próprio traço fino (só a silhueta, um traço aceso por vez, nomes só no canto). A conferência avisa que ainda é o objeto genérico em camadas (o objeto do assunto vem numa versão futura).
- **Trilha em todos os estilos:** os 15 estilos que saíam sem música (pontilhismo, impresso, cartões, tubo, linhas, anatomia, fino, letreiro, interface, colagem, ribalta, projetor, mundos, moderno e alternativo) agora têm trilha com o clima do estilo, na mesma mixagem dos outros (cerca de 8 pontos abaixo da voz). Para tirar a música de um vídeo: `"efeitos": { "musica": false }` na cena, ou `--sem-musica`.
- **Créditos do estilo tubo:** o arquivo de origem (motion_tv.py) foi achado no pacote motion-expert de 08/10 e as linhas citadas no código foram conferidas; `AVISOS-TERCEIROS.md` e o guia do tubo dizem agora exatamente de qual versão do pacote o estilo veio.

## 0.6.12 (29/10/2026)

Quando algo falha, o aviso automático passa a levar o relatório de erro, para a equipe corrigir sem você precisar colar nada no direct.

- **Relatório de erro junto do aviso de falha:** além do código da falha, vai o mesmo texto do botão "Copiar diagnóstico" (versão, sistema, o que o estúdio disse, o fim do registro e a conferência dos programas). Antes de sair do computador ele é limpo: sem chaves, e-mail, roteiro, nomes de projeto, nome de usuário nem pastas pessoais, e com no máximo 8 KB. O servidor limpa de novo e guarda em área privada por 180 dias.
- **Continua dando para desligar:** Configurações, na aba Começar. Desligado, nada é mandado.
- **Música mais presente:** a trilha fica uns 8 pontos abaixo da voz enquanto alguém fala (antes ficava tão baixa que quase não se ouvia no celular), abaixa menos quando a voz entra e volta mais cheia nas pausas, e continua tocando por mais um segundo depois da última palavra, com o fim suave só no último instante. Nenhum trecho de 3 segundos com fala deixa a música chegar perto demais da voz nem sumir (entre 5 e 12 pontos abaixo dela), e o vídeo pronto sai com o volume perto do que o Instagram usa. Nos modelos Curiosidades e Notícia o estúdio deixa 3 a 5 respiros curtos na voz para a música aparecer. A conferência aceita a música de 5 a 12 pontos abaixo da voz e avisa fora disso; a voz continua sempre na frente.
- **Fotos no tamanho certo:** a foto de uma pessoa sozinha fica entre 560 e 620 pixels (menor com título e em dupla) e o cartão de documento não passa de 780 x 700. Nos modelos Curiosidades e Notícia o estúdio já reduz sozinho; nos outros, a conferência avisa.
- **Sem número repetido na legenda:** quando o número grande fala sozinho (fala curta), a legenda some naquele trecho, como já acontecia com o título. A legenda também não atravessa mais a troca de cena, e o número grande tem o mesmo tamanho no vídeo inteiro.
- **Entradas variadas:** fotos entram com íris, deslize, aro ou aproximação; números disparam, rolam ou aparecem dígito a dígito; peças caem, giram, crescem ou deslizam. O plano automático reveza (nunca a mesma em duas cenas seguidas) e varia a troca de cena.
- **Mais cenários 3D, pelo tema:** cada cena ganha o ambiente do assunto da frase (seção eleitoral, tribunal, banco, cozinha, laboratório...), inclusive as de número.
- **Elemento sempre no centro:** com foto e número na mesma cena, o primeiro entra centralizado e só vai para o lugar dele quando o segundo chega. O número começa a contar um pouco antes da palavra e chega ao valor junto com a fala.
- **Abertura mais forte:** a frase do gancho já está inteira na tela no primeiro quadro, a imagem se mexe e o número dispara de zero. Títulos curtos (até 4 palavras) entram inteiros, em vez de palavra por palavra.
- **Gancho longo inteiro:** a pergunta do começo aparece inteira no primeiro quadro mesmo quando é longa (até uns 75 caracteres), em até 3 linhas, usando a largura toda e com a letra no tamanho mínimo da marca ou maior. O estúdio não corta nem divide mais o gancho; se a frase for longa demais até para 3 linhas, a conferência avisa qual é o limite.
- **Título encurtado com sentido:** quando um título não cabe, o estúdio tira primeiro o que não faz falta (como "o" e "a" no meio) ou fica com uma parte inteira da frase. Nunca mais deixa o título terminando em "de", "o" ou "e", nem corta um nome no meio ("Fundo Garantidor de"). Se não houver corte bom, a cena vira duas, cada uma com metade do título.
- **Número sozinho no meio da tela:** a cena só com o número ("R$ 250 mil / garantidos") e a cena só com um título ficam no centro de verdade da tela, e não mais um pouco acima dele.
- **Cada peça termina de entrar antes da troca de cena:** a peça que entra no fim de uma cena (o segundo banco caindo, por exemplo) agora já está assentada no lugar, parada e com a sombra, um pouco antes da cena trocar. Para isso o estúdio segura a cena um instante a mais quando a próxima fala deixa, faz a peça entrar um pouco antes da palavra ou faz a entrada mais rápida. A fala nunca atrasa. A conferência avisa quando alguma peça ainda está entrando no corte.
- **Peça que passava da borda encolhe só o necessário:** antes ela ficava bem menor de uma vez; agora o estúdio mede quanto ela saiu e reduz só esse tanto, conferindo de novo depois.
- **Fecho novo:** "segue a página" vira um celular aberto no perfil, com o botão Seguir (ícone de pessoa com +) apertado por uma mão de verdade, e o fecho dura no máximo 4 segundos. Quando a fala pede comentário ("comenta ILUSTRANDO"), um balão de comentário digitando sai do celular. A câmera fica parada no fecho, para o celular ocupar mais da tela.
- **Peças de redes sociais refeitas:** o botão de seguir (avatar redondo com anel e botão com pessoa e +), o avião de compartilhar (dobrado de verdade, visto de cima, com o rastro curvo), o balão de comentário (balão e ponta numa peça só), o marcador de salvar (a fita que se preenche), o sino e a notificação (com o selo do contador) e o ponteiro do mouse (contorno escuro em volta, como na tela) ficaram mais reconhecíveis no celular, com material brilhante, volume e sombra. Os nomes são os mesmos: cenas antigas continuam funcionando.
- **Botão de seguir em pé:** o avatar fica em cima e o botão embaixo, como no topo de um perfil. Deitado (avatar ao lado do botão), ele era largo demais: nos estilos Mundos e Projetor batia nas laterais antes de ficar grande o bastante, e o vídeo saía no modelo Curiosidades em vez do modelo escolhido. Agora esses dois estilos fecham com o próprio visual. Quem preferir o botão deitado escreve `"lado": true` nos dados da peça.
- **Teologia fecha sem carimbo à toa:** o carimbo "ILUSTRANDO" só aparece quando a fala pede o comentário, e ficou um pouco menor para nunca passar da margem na hora da batida. Antes ele saía até no "segue a página" e encostava na borda, e o vídeo também caía no modelo Curiosidades.
- **Pedido de compartilhar mais claro:** nos modelos Curiosidades e Notícia, "manda pra um amigo" ou "compartilha" no fim do vídeo mostra o avião saindo do celular e chegando ao avatar de um amigo, numa peça só.
- **Avisos novos na conferência:** foto grande demais, número repetido na legenda, abertura fraca, trecho longo sem cenário, entradas repetidas, a mesma peça muitas vezes seguidas e dupla com uma foto em preto e branco e outra colorida. São só avisos: o vídeo continua saindo.
- **Política dentro do tempo:** roteiro de política acima de 60 segundos recebe aviso, e acima de 75 segundos é reprovado no roteiro.
- As melhorias de imagem acima (do tamanho das fotos ao pedido de compartilhar) valem nos modelos Curiosidades e Notícia. O que vem abaixo vale em todos os modelos, a não ser quando o item diz outra coisa.
- **Windows sem placa de vídeo cerca de 3 vezes mais rápido:** o 3D passa a ser desenhado pelo WARP, o desenho por software do próprio Windows (mais que o dobro da velocidade do caminho antigo), e a conferência da cena deixou de desenhar o 3D a cada instante medido (as medidas são as mesmas). Medido num Windows de 2 núcleos sem placa de vídeo: o desenho ficou 2 vezes mais rápido e a conferência da cena caiu de quase 5 minutos para alguns segundos; o vídeo curto de teste sai em cerca de 5 minutos (antes, de 12 a 15).
- **Usa a placa de vídeo também no Windows:** antes só o Mac usava a placa; no Windows o 3D era sempre feito pelo processador, mesmo em computador com placa. Agora o estúdio testa a placa (inclusive a integrada dos notebooks) com um quadro de teste e, se ela falhar ou perder a imagem no meio do vídeo, continua sozinho pelo processador, sem parar.
- **Sem placa de vídeo, perfil leve:** o estilo editorial deixa de desenhar o 3D três vezes por quadro (sem o rastro de movimento), e os efeitos 3D são preparados antes do primeiro quadro. O texto, a legenda e o resto da imagem não mudam. Para desligar: `"perfilLeve": false` no `ilustrando.config.json`.
- **Estimativa de tempo:** nos primeiros quadros o estúdio mede este computador e diz quanto falta ("cerca de 20 minutos para terminar"), e o diagnóstico do computador mostra se o 3D vai pela placa ou pelo processador.
- **Continua de onde parou:** se o computador desligar ou a janela fechar no meio do vídeo, os quadros prontos e a conferência da cena ficam guardados, e o próximo pedido do mesmo vídeo continua dali.
- **Roteiro mais natural:** o estúdio avisa quando o roteiro repete expressões de molde ("o detalhe", "Ou seja", "Traduzindo", "Resumindo", "Confira agora") ou frases que ninguém diz no dia a dia, e a skill de roteiro passa a sugerir uma frase curta sobre o que você já vive no tema logo depois da abertura. São só avisos: nenhum roteiro deixa de passar por causa disso.
- **Fotos que vêm sozinhas:** quando a fala cita pelo nome uma pessoa, um lugar, uma obra, um evento ou um produto ("o presidente Lula", "a Torre Eiffel", "o iPhone"), o estúdio busca sozinho uma foto de licença livre (Wikipédia, Wikimedia Commons e Openverse, sem chave), põe no vídeo e anota o crédito em `fontes.md`. Antes, no vídeo feito pelo estúdio a partir do roteiro, a foto nunca era buscada. Marca conhecida (Apple, Nubank e as outras da biblioteca) entra com o logo, mesmo sem internet. A foto fica guardada e não é baixada de novo.
- **Quando a foto não vem, você fica sabendo:** sem internet, com antivírus ou rede da empresa bloqueando, ou sem foto livre do assunto, o vídeo sai com um objeto do assunto no lugar e o aviso diz, em palavras simples, o que aconteceu e o que fazer (tentar de novo com internet ou usar uma foto sua). Personagem de exemplo ("a Ana ganha R$ 3.000") nunca vira foto de alguém real.
- **Objeto de acordo com a fala:** o plano automático deixou de escolher objeto sem relação. Antes, um pedaço de palavra bastava ("passou" virava escada, "celular" virava célula, "conta corrente" virava corrente, "a fila" virava urna de votação) e, sem nada reconhecido, entrava um cubo, uma esfera ou um anel. Agora cada objeto precisa casar com a fala daquele trecho; sem isso, entra o objeto do assunto do vídeo (finanças: moedas e cofre; Bíblia: livro sagrado; padaria: pão), nunca uma forma sorteada. Medido em 8 roteiros x 3 modelos: trechos sem relação caíram de 55 em 154 (36%) para 0.
- **Fotos em todos os estilos, com a cara de cada um:** a foto do nome citado agora entra nos 31 modelos, não só em quatro estilos. Na Antiguidade ela vira a obra que cobre a tela com o nome em letra grande; no Quadro antigo, a pintura em sépia com o texto datilografado; na Teologia, a arte recortada com o nome em ouro (duas pessoas viram dois medalhões); no 3D Alternativo, a foto vira nuvem de pontos com o nome numa etiqueta; no Preto e branco, foto em P&B de alto contraste no alto da cena; em Linhas, foto em cinza com moldura fina; nos outros, o cartão de foto do próprio estilo. País citado vira a bandeira. Se a foto não vier, entra o desenho do próprio estilo (nunca um objeto 3D solto por cima). Na Anatomia e no Traço fino, que abrem com o objeto montado, o nome citado no começo vira o título do objeto e as fotos aparecem nos trechos do meio.
- **Duas pessoas, duas fotos do mesmo tamanho:** "Lula e Bolsonaro" na mesma frase mostra as duas fotos lado a lado, iguais. Se uma das duas não vier, nenhuma entra (os dois lados sempre com o mesmo tratamento).
- **Nome antes ou depois do número:** "Santos Dumont voou em 1906" mostra a foto dele e depois o ano, em vez de só o número. "Pelé é o único..." (nome sozinho no começo da frase) também é reconhecido, e "Comenta EU QUERO" deixou de ser tratado como nome de alguém.
- **Foto certa da pessoa certa:** a busca deixa de pegar a foto de um artigo sobre um evento da pessoa (uma multidão no lugar do retrato) e entende nomes como "mar Vermelho" e "rio Amazonas" (antes "Vermelho" sozinho trazia a foto de uma fruta vermelha).
- **3D Alternativo, Anatomia e Traço fino sem peças sobrepostas:** o Alternativo monta cada trecho com as formas da nuvem de pontos (o objeto citado, o número que conta, o mapa) em vez de pôr a peça 3D comum por cima dela. Na Anatomia e no Traço fino com roteiro curto, uma peça por trecho, no centro.
- **Objeto certo nos estilos de janela (Mundos, Ribalta, Projetor):** o objeto citado na fala vence o objeto de apoio que só tinha o formato mais cômodo ("carro" em vez de celular). "Embaixo dos bancos" do carro não vira agência bancária, e o trecho sem objeto próprio mostra o assunto do vídeo, não a lupa ou o cronômetro do modelo. Medido em 20 roteiros variados distribuídos pelos 31 modelos: trechos sem relação 12 de 530 para 0 de 561, fotos obtidas 22 para 63, nomes citados sem foto 77 para 15.
- **Fala x imagem no estúdio:** na aba de conferência do vídeo aparece cada trecho da fala, o que está na tela e uma nota de relação (0 a 3), e a foto que não veio fica em destaque.
- **Número que conta sem tropeço:** o número que aparece dígito a dígito não mostra mais pedaços como "8." ou "8.0"; ele já nasce no formato certo e os dígitos se acendem até o valor exato.
- **Peça nunca dentro do chão na troca de cena:** quando duas cenas seguidas usam o mesmo cenário, o chão não passa mais por dentro da peça nova (acontecia no modelo Negócio e no Stop-motion, que caíam no modelo Curiosidades por isso).
- **Objeto principal maior:** nos modelos Curiosidades e Notícia, bichos e objetos compridos (leão, pão, fila) ficam maiores na tela, perto de 55% da altura, sem passar da borda; a conferência avisa quando ainda ficam pequenos.
- **Ano por extenso certo:** "mil oitocentos e oitenta e nove" virava 889 na tela; agora é 1889 ("dois mil e vinte", 2020).
- **Cenário de reserva com o assunto:** o modelo Notícia não põe mais o cenário de seção eleitoral ou do Congresso num vídeo que não fala de política.
- **Pergunta no começo não vira nome:** em "Quantas Copas o Pelé ganhou?", o estúdio deixou de buscar foto de "Quantas Copas" (ou de "Copas", que trazia a foto de um cantor) e mostra a foto do Pelé.
- **Sombra da peça que cai sem aviso à toa:** quando a peça nova cai do alto logo depois da troca de cena, a sombra dela chega primeiro pelo lado direito do chão. A conferência deixou de chamar isso de "sombra sem peça" (sombra solta do lado esquerdo continua sendo acusada).
- **Preto e branco com foto sem aviso à toa:** a foto sobre o cenário desenhado deixou de ser acusada como "imagem por cima de outro elemento".
- **Ainda não faz:** alguns nomes continuam sem foto (o nome do começo na Anatomia e no Traço fino vira o título do objeto; um país ao lado de outro nome no mesmo trecho; lugar sem foto livre, como a Suécia em alguns estilos). Quando o assunto é um evento sem foto livre (como a Copa do Mundo), a busca pode trazer a foto de outro evento com o mesmo nome. Confira as fotos antes de publicar e, se precisar, use uma foto sua.

## 0.6.11 (28/10/2026)

O vídeo passa a sair mesmo quando a conferência de qualidade só tem uma observação de aparência.

- **Observação não trava mais o vídeo:** se a conferência achar um detalhe de aparência (um texto encostado numa peça, um volume um pouco fora, uma borda), o vídeo sai pronto, com uma linha de ressalva no fim da execução e no relatório, para você assistir antes de publicar. Só arquivo quebrado de verdade (sem imagem, sem som, trecho preto, vídeo cortado) segura o vídeo, e nesse caso o estúdio refaz o vídeo do zero uma vez, sozinho, antes de avisar.
- **Dois alarmes falsos corrigidos:** a conferência reprovava, sem defeito, os cartões do estilo `cartoes` (a borda do cartão somada à grade do fundo) e as tramas do estilo `preto-branco` que sangram pela borda da tela.
- **Todos os 31 modelos testados com quatro tipos de conteúdo** (curiosidade, negócio, produto e serviço para um cliente): 124 vídeos conferidos, todos aprovados.

## 0.6.10 (28/10/2026)

- **Vídeos no estilo minimalista não reprovam mais por "imagem congelada":** esse estilo não tem grão e deixa a tela parada de propósito quando o contador termina ou a peça pousa, mas a conferência da 0.6.5 lia isso como travamento (em até 9 trocas de tela por vídeo, como no Forex e no CRT). Agora ela só cobra imagem em movimento nos estilos com câmera e grão; quadro repetido por remendo continua reprovando neles. Quem ficou preso nisso pode gerar o vídeo de novo depois de atualizar, sem mudar a cena (o grão que alguém tenha acrescentado pode ser retirado).

## 0.6.9 (28/10/2026)

A voz da ElevenLabs passa a funcionar também na conta grátis, e dá para ouvir cada voz antes de escolher.

- **10 vozes que funcionam em qualquer conta da ElevenLabs, inclusive a grátis:** George, Brian, Daniel, Eric, Liam, River, Alice, Matilda, Sarah e Bill. Testadas numa conta grátis nova com o modelo que o estúdio usa. No passo da voz, clique em **Ouvir** para escutar uma amostra de cada uma (já vêm dentro do estúdio, sem gastar crédito) e em **Usar esta** na que preferir.
- **Acabou o erro de "plano pago" para quem escolhe uma dessas vozes:** as vozes da biblioteca que o estúdio sugeria antes exigiam plano pago na ElevenLabs.
- Quando o vídeo falha por plano pago, o erro agora aponta para essas 10 vozes e traz o botão da voz grátis (Piper).

## 0.6.8 (28/10/2026)

Correções do que os estúdios dos compradores avisaram em 27 e 28/10 (anonimamente: só etapa, código, versão e sistema).

- **Falha de pasta ("sem permissão") mais clara e mais rara:** o estúdio agora tenta de novo, por alguns segundos, quando o Windows ou o antivírus seguram um arquivo ao apagar, copiar ou renomear (antes só renomear tinha essa paciência). E, quando a pasta do estúdio está num lugar problemático (OneDrive, dentro de um .zip, Arquivos de Programas, Downloads, Mesa ou pasta sincronizada), a mensagem diz exatamente isso e para onde mover. O "Conferir o computador" passou a testar se dá para gravar na pasta e onde ela está.
- **Antivírus bloqueando um programa do estúdio e porta local recusada têm explicação própria:** antes viravam "sem permissão para gravar na pasta" e mandavam a pessoa mudar a pasta à toa. Se o antivírus impede o FFmpeg de abrir, o conferir do computador agora diz isso, em vez de "FFmpeg não encontrado".
- **Controle de qualidade diz o que reprovou:** em vez de "não conseguiu ajustar uma das cenas", a mensagem mostra o motivo em português (por exemplo, "a legenda ficou em mais de uma linha").
- **Roteiro mudou depois das cenas automáticas:** o estúdio refaz as cenas sozinho, sem pedir para apagar arquivo. Cena escrita pelo assistente continua protegida.
- **Voz da ElevenLabs:** a tela da voz avisa antes da lista que as vozes do Brasil só funcionam com plano pago, com um botão para escolher a voz grátis (Piper). Quando o vídeo falha por plano, cota ou chave, o erro traz o botão "Usar a voz grátis (Piper)".
- **Computador lento:** o navegador do vídeo espera até 120 s por etapa (eram 30 s), o que evita o erro de "computador lento" em Macs e PCs mais antigos.
- **Trava "este vídeo já está sendo produzido":** depois de um desligamento ou queda de energia, a trava velha é liberada sozinha (antes podia ficar presa por horas).
- **Parada sem mensagem no Windows:** o código de saída (programa encerrado à força ou travamento interno) ganha uma explicação e o que fazer, em vez de "a tarefa parou antes do fim".
- **Mais detalhe no aviso anônimo** (sem nome, e-mail, caminho nem texto seu): a regra do controle de qualidade que reprovou, a operação e o tipo de lugar nas falhas de pasta, qual programa foi bloqueado e de qual servidor o download falhou. Assim a próxima correção dispensa palpite.

## 0.6.7 (27/10/2026)

O estúdio passa a explicar melhor quando o vídeo para de repente no Windows, e o "Copiar diagnóstico" agora chega inteiro no direct.

- **Paradas que o Windows causa sem avisar ganham explicação:** quando o FFmpeg ou o navegador interno fecham no meio do vídeo (quase sempre o antivírus), quando falta memória, quando um arquivo está em uso (OneDrive ou antivírus) ou quando o caminho da pasta é comprido demais, o estúdio diz o que aconteceu e o que fazer (liberar a pasta no antivírus, mover para `C:\ilustrando`, fechar outros programas). Antes aparecia só "A tarefa parou antes do fim".
- **Quando um programa para sem dizer nada**, o estúdio anota o código de saída dele no log. Isso ajuda a achar a causa.
- **"Copiar diagnóstico" mais curto na frente:** a etapa que falhou, o que o estúdio disse e o fim do log vêm logo no começo. Antes, no direct do Instagram o texto era cortado e o erro ficava de fora.
- O aviso anônimo de falha ganha o código de saída quando o erro não tem tradução (sem nome, e-mail nem arquivo seu).

## 0.6.6 (27/10/2026)

## 0.6.5 (27/10/2026)

O estúdio passa a se corrigir sozinho nas falhas do computador, e refazer um vídeo não gasta mais crédito da ElevenLabs.

**Correção urgente: vídeo reprovado por "quadros a menos"**
- **O que acontecia:** no Windows, alguns vídeos paravam no fim com "A tarefa parou antes do fim", e o assistente dizia que o vídeo tinha saído com quadros a menos. A causa era o jeito de juntar a imagem com o som: o tamanho final do vídeo dependia da versão do FFmpeg (o programa que monta o vídeo). Medimos com as versões 6.0, 6.1, 7.1, 8.1 e 9.0: o FFmpeg 6.0, o que o instalador trazia, cortava cerca de 2 segundos do fim; as outras cortavam de 1 a 4 quadros. A conferência do arquivo reprovava o vídeo.
- **O que mudou:** o vídeo agora sai com exatamente os quadros que o estúdio desenhou, em qualquer versão do FFmpeg, e o som sai com a mesma duração. Se mesmo assim a contagem não bater, o estúdio conserta a duração sozinho, sem desenhar de novo e sem gastar nada. Diferença de quadros nunca mais reprova um vídeo: a conferência só reprova defeito de conteúdo.
- O instalador passa a trazer o FFmpeg 6.1.1 (no Windows e no Mac com Intel). Quem já instalou não precisa fazer nada: o vídeo sai certo com o FFmpeg que já está na pasta.

**Refazer não gasta crédito**
- A narração da ElevenLabs (e da Fish Audio) fica guardada pelo texto e pela voz. Tentar de novo, refazer as cenas, apagar arquivos do projeto ou fazer outro vídeo com o mesmo roteiro reaproveita a narração já paga. A trilha da ElevenLabs Music já era reaproveitada e continua assim.
- Pedir para refazer a voz paga (`--refazer-voz`) não paga de novo sem querer: só com `--pagar-de-novo`, e o assistente pergunta antes.
- Voz paga sem crédito, sem chave ou com a chave recusada: o vídeo sai com a voz grátis (Piper), com um aviso claro, em vez de parar. Resolva a voz em Começar > Voz e faça de novo se quiser a voz de sempre.

**O estúdio se corrige sozinho**
- Antes de começar, o estúdio mostra numa linha qual FFmpeg está usando (versão e se é o do estúdio ou o do computador), o Node e se a pasta tem um caminho comprido. Se a versão do FFmpeg tem problema conhecido e há outro FFmpeg bom no computador, ele troca sozinho.
- Quando algo do computador falha, o estúdio tenta a alternativa seguinte e continua, mostrando só uma linha ("ajustei ... e continuei"): duração do vídeo, outro codificador de vídeo, outro FFmpeg, FFmpeg que não abre (antivírus), pasta com caminho muito comprido no Windows (monta o vídeo numa pasta curta), disco quase cheio (apaga quadros antigos guardados de outros vídeos), arquivo segurado pelo OneDrive ou pelo antivírus (espera e tenta de novo). Continuam valendo o navegador de reserva (Chrome ou Edge), o 3D sem placa de vídeo e a outra porta quando a do estúdio está ocupada. Cada degrau tem limite de tentativas e nunca gasta crédito.
- Os ajustes recentes entram no "Copiar diagnóstico".
- **Correções remotas assinadas:** a equipe pode mandar ao estúdio pequenas correções de configuração (por exemplo, "esta versão do FFmpeg tem problema"), assinadas digitalmente. O estúdio confere a assinatura, aceita só tipos de ajuste de uma lista fechada (nunca programa, comando ou arquivo) e, sem internet, segue com o que já tem.
- **Assistente com regras:** quando o estúdio devolve um erro com código, o Claude Code e o Codex seguem uma lista segura (repetir o passo, reinstalar um componente pelo instalador, trocar uma configuração, usar uma pasta curta, rodar a verificação). Nunca mexem no motor, nunca gastam crédito pago sem perguntar e, se não resolver em 2 tentativas, pedem para você clicar em "Copiar diagnóstico" e "Abrir o direct".

**Mensagens**
- O doctor mostra a versão e a origem do FFmpeg. O aviso "nenhum assistente encontrado no Terminal" agora diz que não é erro: quem usa o app do Claude ou do ChatGPT não precisa dele.
- Encode que não deu para consertar tem mensagem própria, com a causa e o que fazer (antes aparecia "o estúdio não reconheceu o erro").

## 0.6.4 (27/10/2026)

Primeiro uso mais simples e mais bonito, ativação só com o e-mail da compra e ajuda sempre à mão quando algo dá errado.

**Novidades**
- **Vídeo de demonstração primeiro:** o estúdio abre mostrando um vídeo pronto de 25 segundos ("Sua hora vai valer 10% a mais"), feito por nós com roteiro conferido, narração, objetos 3D e cenário. Não gasta nada: ele já vem no pacote. Depois vêm a voz e o vídeo de teste.
- **Vídeo de teste novo:** saiu o exemplo de formas soltas (o bueiro). Agora o teste faz, no seu computador, o mesmo tema da demonstração, com objetos de verdade e cenário 3D. A tela mostra o tempo estimado (cerca de 1 a 3 minutos num computador comum) e, enquanto desenha, quanto falta.
- **Licença só com o e-mail da compra:** em Começar > Licença, basta digitar o e-mail usado na Kiwify. A chave ILU1- continua valendo, em "Tenho uma chave (opcional)". Continua valendo em até 2 computadores, e reembolso ou chargeback cancelam a licença.
- **Temas prontos** no "Fazer meu primeiro vídeo": 12 temas com gancho, virada, o que mostrar e os fatos já conferidos em duas fontes ou mais. Escolha um, e o assistente escreve o roteiro.
- **Primeiro carrossel em segundos:** abaixo do primeiro vídeo, "Prefere começar por um carrossel?" faz os slides de um tema de exemplo com a sua marca, sem voz e sem desenhar vídeo.
- **Voz grátis como padrão:** a Piper passa a ser a voz principal do estúdio. O vídeo de teste e o primeiro vídeo já saem com ela, sem pedir conta nem chave: se nenhuma voz foi escolhida, o estúdio instala e salva a voz grátis sozinho. Ela aparece em primeiro no passo Voz, com o selo "Comece por aqui".
- **ElevenLabs, recomendada para qualidade:** a melhor voz, a mais natural. No passo Voz, um passo a passo em 4 passos curtos, com os links certos: criar a conta, criar a chave com a permissão Text to Speech, escolher a voz (três vozes do Brasil prontas, com o botão "Usar esta") e colar no estúdio. Aviso honesto: algumas vozes da biblioteca, como essas do Brasil, exigem plano pago, e a conta grátis tem limites. Dá para começar com a Piper e trocar depois.
- **Guia rápido** (instalar e fazer o primeiro vídeo, em 12 páginas com figuras) e guias mais curtos, com "o que você não precisa", o tempo de cada passo e caixas "vai aparecer isto e é normal". No Guia 06, exemplos de como pedir mudanças ao assistente.

**Ajuda quando algo falha**
- **Copiar diagnóstico e Abrir o direct em todo erro:** antes, alguns erros (licença, voz, marca, atualização) apareciam sem a opção de mandar ao suporte. Agora toda mensagem de erro do estúdio mostra a causa, o que fazer, "Copiar diagnóstico" e "Abrir o direct".
- **Aviso anônimo de falha:** quando uma etapa falha, o estúdio manda à equipe só o código da falha, a etapa, a versão e o sistema (por exemplo, "Windows 11"), com um número aleatório da instalação. Nunca vai nome, e-mail, chave, roteiro, pasta nem arquivo seu. Sem internet, o aviso espera e vai depois; nunca atrapalha o estúdio. A tela diz quando o aviso foi enviado, e dá para desligar em Configurações, na aba Começar.
- **Modo de segurança:** se a página do estúdio não carregar, aparece uma tela simples com a causa e os mesmos botões. Se o estúdio nem abrir, ou se a instalação parar, abre no navegador uma página de ajuda com "Copiar diagnóstico" e "Abrir o direct".

**Correção**
- A música da ElevenLabs agora toca até o último quadro. Ela costuma compor um final próprio, com queda e silêncio, alguns segundos antes do tamanho pedido, e por isso a trilha sumia antes do fim do vídeo. O estúdio passou a medir esse final e, quando ele chega cedo demais, repete compassos inteiros da própria música antes dele, com uma emenda suave, para que o final composto caia depois do último quadro. Quando não há trecho bom para repetir, a música desce aos poucos e termina junto com o vídeo, sem silêncio antes. As trilhas que já cobriam o vídeo continuam exatamente iguais. O controle de qualidade agora reprova o vídeo cuja música da ElevenLabs acaba antes do fim (na trilha sintetizada, só avisa). Vale para os vídeos feitos a partir desta versão: os que você já tem não mudam e não são reprovados; se renderizar um deles de novo, a trilha guardada é corrigida sem gastar crédito.
- Mensagens novas: e-mail que não é de uma compra (sem dizer se o e-mail existe), muitas tentativas de ativação, voz da ElevenLabs que pede plano pago (também o aviso free_users_not_allowed).

## 0.6.3 (27/10/2026)

Vídeo de teste sem erro: as causas mais comuns de "deu erro no vídeo de teste" foram encontradas e corrigidas, principalmente no Windows e com a voz grátis. Suporte agora pelo direct do Instagram.

**Correção (vídeo de teste e primeiro vídeo)**
- **Voz grátis (Piper) no Windows falando errado:** o Windows entregava o roteiro à voz grátis numa codificação antiga, e todo acento virava símbolo ("não" virava "nÃ£o"). A voz lia os símbolos, a fala saía estranha e a legenda saía fora do tempo; palavras como "Água" e "Índia" travavam a narração. Agora o texto vai num arquivo em UTF-8 e a voz lê certinho em qualquer computador.
- **Vídeo de teste que reprovava com a voz grátis e não saía nem com "Tentar de novo":** a voz grátis muda um pouco a cada tomada e, de vez em quando (cerca de 1 em cada 6), o alinhador não reconhecia o suficiente da fala; aí uma cena ficava longa demais e o controle de qualidade reprovava. Como a narração ficava guardada, "Tentar de novo" repetia a mesma falha para sempre. Agora o estúdio faz até 3 tomadas da voz grátis (é de graça e leva segundos) e fica com a mais bem sincronizada, aproveita melhor um alinhamento parcial e refaz sozinho uma narração antiga que tinha ficado fora de sincronia.
- **Número que abre a cena:** na troca de cena, um número sozinho aparecia só pela metade no primeiro quadro e o controle de qualidade contava o quadro como vazio (o vídeo de teste reprovava por isso). Agora ele já chega visível no corte.
- **Voz grátis em pasta com acento** ("C:\Users\João", "OneDrive\Área de Trabalho") ou com caminho comprido: o estúdio usa um atalho curto e sem acento sozinho.
- **Voz grátis que dizia "pronta" mas não abria** (pasta do estúdio movida depois de instalar, ou falta de um componente do Windows): o instalador agora confere se ela abre de verdade, refaz o que for preciso e, se faltar o Visual C++ da Microsoft, diz exatamente o que baixar.
- **Sem o FFmpeg** (apagado pelo antivírus, instalação pela metade), o vídeo parava sem nenhuma mensagem. Agora o estúdio confere antes de começar e diz o que fazer.
- **Mensagens novas, em português simples:** voz da ElevenLabs que não funciona na conta grátis (vozes da biblioteca), créditos do mês acabados, conta grátis travada pela ElevenLabs, chave sem a permissão de voz, antivírus que bloqueia conexões seguras, voz grátis sem internet na primeira vez. Antes quase tudo isso aparecia como "a chave foi recusada" ou "a tarefa parou".
- **Windows:** o render não cai mais quando o OneDrive ou o antivírus seguram um arquivo por um instante; porta do estúdio reservada pelo Windows (Hyper-V, WSL, Docker) não derruba mais o estúdio; tema que vira um nome proibido no Windows ("con", "nul") ganha um nome válido; a trava de um vídeo interrompido (janela fechada no meio) não bloqueia mais o primeiro vídeo para sempre.
- O vídeo de teste não termina mais com o aviso "1 pendência de fonte" (era uma anotação interna do exemplo).
- Na aba Voz, o passo a passo da ElevenLabs avisa que, na conta grátis, as vozes da biblioteca podem não funcionar fora do site e indica as vozes padrão.

**Suporte**
- O canal de ajuda passa a ser o **direct do Instagram @kaueajure** (ig.me/m/kaueajure), em todas as mensagens do estúdio, do instalador, dos guias e dos e-mails. Ao lado de "Copiar diagnóstico" há o botão **Abrir o direct**. O e-mail continua valendo como alternativa.

**Correção**
- **Carrossel com número grande alinhado:** no visual `grao`, o número grande do slide de bloco com foto (`fotobloco`) e o texto embaixo dele ficavam à esquerda enquanto o título ficava no centro, e a lista com selos ficava à esquerda do título. Agora número, título, texto e lista seguem o mesmo eixo, no centro, e o bloco de texto fica centrado no espaço acima da foto. A conferência do carrossel também passou a reprovar qualquer slide com número, título e texto em alinhamentos diferentes, para isso não voltar.
- **Objeto 3D no eixo do texto, no vídeo:** em cenas com um objeto sob um título ou uma legenda centralizados, o objeto podia aparecer de 15 a 55 px para um dos lados (e até uns 100 px nos movimentos de câmera para o lado). Três causas: o balanço lateral da câmera e o deslize das trocas de cena levavam o objeto junto, mas não o texto; a caixa invisível que dá tamanho a alguns objetos entrava na conta do centro (por isso o lugar mudava quando só o tamanho dela mudava); e o objeto era centralizado parado, mas aparecia girando. Agora o desenho do objeto fica no eixo do texto, em qualquer tamanho, e o fundo continua com o movimento de câmera. Um objeto que anda na própria animação, como a lupa que varre, fica com o meio do caminho no centro. A conferência automática do vídeo avisa quando o objeto único de uma cena fica mais de 12 px fora do eixo e reprova acima de 24 px. Vídeos feitos antes mudam um pouco se forem renderizados de novo: os objetos voltam para o centro e deixam de deslizar para os lados junto com a câmera.
- **Troca de cena sem tela vazia e sem travada, no vídeo:** na passagem de uma cena para a outra, o objeto da cena que terminava encolhia e sumia um pouco antes da troca, e o da cena nova só aparecia depois dela, caindo do alto. Ficavam de 1 a 9 quadros só com o fundo em quase toda troca, o que parecia um pisca ou uma travada. Agora o objeto fica inteiro até a troca e o objeto da cena nova já está na tela no primeiro quadro dela (os outros objetos da cena continuam entrando na palavra certa). Foto, número e gráfico de barras que abrem a cena também já chegam aparecendo. O desfoque da troca ficou mais curto e leve.
- **Fim do vídeo sem segundo vazio:** nos estilos com objeto 3D, a última cena acabava junto com a narração e sobrava quase 1 segundo só com o fundo. Agora a última cena vai até o último quadro.
- **Objeto apoiado no chão do cenário:** num cenário com piso (quarto, sala, escritório, estádio), um objeto podia aparecer com a base enterrada no chão (por exemplo, o celular no quarto, quando a cena tinha dois objetos e o primeiro entrava sozinho) ou flutuando um pouco acima dele (como o dado). Agora o chão acompanha a posição dos objetos durante a cena, fica na altura real do piso de cada cenário e o objeto encosta no piso pela parte desenhada dele.
- **Conferência automática mais rígida:** o vídeo não sai se houver um quadro sem objeto na troca de cena ou no último segundo, um objeto enterrado no chão, ou imagem congelada perto de uma troca ou no fim. Quem revisa um vídeo pronto pode conferir as trocas com `node scripts/conferir-viradas.mjs <projeto> [arquivo.mp4]`.
- Vídeos feitos antes mudam nas trocas de cena se forem renderizados de novo: o objeto da cena nova aparece já no corte (alguns que entravam junto com uma palavra passam a entrar no começo da cena), os objetos param de encolher antes da troca, o vídeo termina com a última cena na tela e alguns objetos ficam um pouco mais baixos, encostados no chão. Para voltar ao jeito antigo numa cena: `"efeitos": { "viradaLimpa": false }`.

## 0.6.2 (26/10/2026)

Primeiro vídeo à prova de falhas: um botão faz tudo, o erro vem explicado com um diagnóstico para o suporte, e dá para instalar sem os dois cliques, direto no assistente.

**Novo**
- **Fazer meu primeiro vídeo**, no topo da aba Começar: digite o tema (ou escolha um dos exemplos prontos, já com os fatos conferidos) e clique. O estúdio confere o computador, a licença e a voz, instala sozinho o que faltar (inclusive a voz grátis e o alinhador de voz), mostra cada etapa em português simples e toca o vídeo na própria página, com Baixar e Mostrar na pasta. Com o seu tema, ele copia um pedido para colar no assistente, que escreve o roteiro e confere os fatos; quando o roteiro chega, o estúdio faz o vídeo sozinho. O vídeo de teste e o cartão "Fazer um vídeo novo" continuam onde estavam.
- **Copiar diagnóstico:** quando qualquer etapa para, a tela diz a causa, o que fazer e tem um botão que copia um texto curto para colar no suporte (versão, sistema, o que faltou na instalação, a voz escolhida e as últimas linhas do erro). Ele nunca leva chave, e-mail, chave de licença nem o nome do seu computador.
- **Instalar direto no Claude Code ou no Codex:** pode abrir a pasta direto no assistente e escrever "Comece pelos primeiros passos.": ele instala tudo sozinho, inclusive o Node, no primeiro uso, com o mesmo instalador dos dois cliques. Os dois cliques em Instalar continuam sendo o jeito mais fácil.
- **Voz:** a ElevenLabs aparece primeiro, como a recomendada, com um passo a passo na própria tela (criar a conta, criar a chave com a permissão "Text to Speech", escolher uma voz em português, copiar o Voice ID e onde colar). A conta grátis tem uma cota todo mês que, dependendo do uso, pode bastar.

- **Navegador de reserva:** se o navegador interno que desenha os quadros não baixar ou não abrir (antivírus, internet que cai, rede de empresa), o estúdio usa sozinho o Google Chrome ou o Microsoft Edge do computador, e o vídeo sai igual. O Edge vem em todo Windows 10 e 11, então quase ninguém fica sem. O instalador tenta baixar o navegador interno até 3 vezes, mostra o progresso e, se não der, explica a causa provável (internet, antivírus ou disco) e o que fazer, em vez de pedir para repetir o mesmo passo. O vídeo de teste e o primeiro vídeo conferem e consertam isso antes de começar.

**Correção**
- **Texto da licença na ativação** mais simples: uso pessoal, em até 2 computadores, e os vídeos que você fizer são seus.
- **Erro explicado pela etapa certa:** quando uma tarefa parava, o estúdio às vezes mostrava a causa de uma etapa que tinha dado certo (por exemplo, "o navegador não conseguiu desenhar o 3D" quando o problema era outro). Agora a explicação vem da etapa que falhou, com novas explicações para a voz grátis que não fala e para cena que o controle de qualidade não conseguiu ajustar.
- **Aviso de marca d'água sem comando de Terminal:** o aviso agora orienta a ativar a licença no estúdio, em Começar > Licença.
- **Alinhador de voz no computador sem Node:** com o Node que o instalador traz para dentro da pasta, o alinhador de voz não instalava (a legenda com a voz grátis caía para as pausas da fala). Agora instala.
- **Assistente aberto pelo app no Mac:** quando o Node do computador estava fora do caminho do terminal do app, o atalho de comandos do estúdio não achava o Node. Agora acha.
- Os carrosséis não marcam mais como problema textos que falam de seguidores, visualizações ou vendas. A conferência de números e fontes continua.

## 0.6.1 (26/10/2026)

Todos os modelos funcionam com qualquer tema, também em inglês e espanhol, e o estúdio passa a lidar com os problemas típicos do Windows.

**Novo**
- **`anatomia` e `fino` com qualquer assunto:** o plano automático monta um objeto em camadas a partir do próprio roteiro (cada camada é uma ideia do vídeo, com o texto vindo da fala), abre montado, explode, foca uma camada por cena e fecha montado. O `fino` usa o mesmo desenho em tema escuro. Antes, esses dois modelos só desenhavam um objeto fixo e caíam no modelo padrão com tema livre.
- **Voz grátis melhor:** a Piper agora usa por padrão a voz `cadu`, com mais variação de entonação e ritmo e um tratamento de áudio (equalização, compressão leve e volume uniforme), em vez da `faber`, que soava monótona. Quem já escolheu outra voz continua com a sua.
- **Peças certas em inglês e espanhol:** o plano automático reconhece as palavras dos dois idiomas (742 peças e as 36 genéricas), em vez de usar só cubos e esferas.

**Correção**
- **Sem quique ao cair:** a peça cai e para, sem rebote nem esmagar.
- **Texto que tremia no estilo `interface`:** o texto digitado no campo pulava de linha a cada letra; agora a quebra de linha é decidida no texto inteiro e só as letras aparecem.
- **Título cortado no meio da frase** ("ser o", "abre o"): o título agora termina numa ideia completa e cabe em 2 linhas.
- **Peças sem relação com a fala:** palavras ambíguas ("massa", "calor", "quarto", "teste", "bolhas") não puxam mais ventilador, cama ou laboratório, raízes curtas só casam a palavra inteira, e a cena sem peça própria volta ao objeto do tema em vez de um cubo solto.
- **Cartões, janelas e legendas dos modelos de página:** texto dentro das formas, centralizado e longe da borda e da legenda; o número grande do `projetor` virou peça; sombras mais suaves e ovo sem os espinhos.
- **Windows:** roteiro salvo com BOM (o Bloco de Notas faz isso) perdia a linha STATUS, então o idioma, o modelo e o CTA eram ignorados; o BOM agora é tirado dos arquivos do projeto. Fim de linha CRLF e pasta com espaços, acentos e caminho comprido (OneDrive) testados, com a voz grátis, o alinhador e os três idiomas.
- A atualização do atalho curto da voz grátis no Windows (junção) ficou mais segura: nunca apaga o destino e compara o caminho sem confundir maiúsculas e barras.

## 0.6.0 (26/10/2026)

Vídeos em inglês e espanhol, estilos de motion que funcionam com qualquer tema, objetos que continuam entre cenas, queda e física das peças, luz de estúdio e o fim do aro claro nos cortes.

**Novo**
- **Inglês e espanhol:** o roteiro, a voz, a legenda e a sincronia no idioma pedido ("quero um vídeo em inglês sobre..."). ElevenLabs e Fish Audio falam os três idiomas; a Piper (grátis) usa uma voz própria de cada idioma, baixada na primeira vez. Em **Meus vídeos**, o cartão "Fazer um vídeo novo" ganhou o seletor de idioma. Detalhes e limites em `docs/idiomas.md`.
- **Qualquer tema nos estilos de motion:** `interface`, `ribalta`, `projetor`, `mundos`, `cartoes`, `tubo`, `colagem`, `antiguidade` e `impresso` agora montam a cena do próprio estilo a partir do roteiro (telas, cartões, etapas, chat, contador), em vez de uma peça 3D genérica que reprovava no controle de qualidade. Auditados nos 25 modelos com quatro temas diferentes.
- **Anatomia com qualquer assunto:** o objeto declarado em `dados` (peças reais em mm) agora está documentado em `docs/estilo-anatomia.md`, e o validador deixa os elementos seguintes herdarem o objeto do primeiro.
- **Objetos que continuam entre cenas:** a peça que se repete em cenas seguidas não sai e entra de novo; segue na tela, com o giro e a animação contínuos.
- **Queda e física:** as peças caem e pousam com quique curto, sem flutuar sobre o chão. A queda nunca passa por cima do @ do topo nem do título.
- **Luz de estúdio:** luz de céu e chão, chave quente e recorte frio, e sombra de contato mais fiel.
- **Ganchos de curiosidade:** seis padrões novos (lacuna aberta, número que não bate, pergunta que incomoda e outros) no linter e nas skills; saiu a exigência do "E no final...".

**Correção**
- **Aro claro nos cortes:** o desfoque da transição clareava as bordas do quadro por uns 10 quadros em cada corte nos estilos papel, minimalista e editorial (de 1% a 13% dos quadros). O quadro agora amplia o suficiente para o aro sair da tela, e o controle de qualidade só reprova linha fina de verdade, não degradê de janela clara do cenário.
- **Quadro 0:** os primeiros quadros repetem o instante 0,25 s, então o quadro 0 e a capa são a mesma composição do quadro 3 (antes, `tubo` e `projetor` reprovavam).
- **Peça que vazava na transição:** a câmera "baixo" jogava a peça para fora do quadro; o corretor automático troca por "normal".
- **Legenda de número:** a legenda do contador tem no máximo 3 palavras e nunca termina em palavra solta; o número entra no começo do beat em todos os estilos.
- **Pedaços do pacote:** a documentação de ganchos não leva mais o nome do material de origem.

## 0.5.3 (26/10/2026)

Voz grátis em pastas fundas, vídeos que não falham mais por causa do modelo escolhido e um atalho para pedir qualquer tema.

**Correção**
- **Voz grátis (Piper) em pasta funda:** quando o estúdio ficava numa pasta de caminho longo (OneDrive, Documentos com nome comprido), a Piper falhava ("phontab") e o vídeo saía sem voz ou com erro. Agora o estúdio usa um atalho curto sozinho (Mac, Linux e Windows, sem administrador).
- **Vídeo de teste com a voz grátis:** o estúdio instala o alinhador de voz (Whisper) junto, se faltar. Sem ele, a legenda e as cenas seguiam só as pausas da fala e podiam sair fora de sincronia.
- **Vídeo que não falhava mais por causa do modelo:** com os modelos de página ribalta, projetor, mundos, interface, anatomia ou fino, o plano automático podia reprovar no controle de qualidade e o vídeo não saía ("Falhas que não consegui corrigir sozinho"). Agora, quando a cena é automática e o modelo não cabe no tema, o estúdio refaz no modelo padrão "curiosidades" e avisa na tela, com o mesmo roteiro.

**Novo**
- Em **Meus vídeos**, o cartão **Fazer um vídeo novo, de qualquer tema**: digite o assunto, clique em **Copiar o pedido** e cole na conversa com o assistente. Deixa claro que os vídeos de exemplo são só amostra e que o tema é livre.

## 0.5.2 (24/10/2026)

Corrige o vídeo de teste do estúdio, que reprovava para quem escolheu certos modelos de página.

**Correção**
- O vídeo de teste agora sai sempre no modelo "curiosidades", seja qual for o modelo escolhido na página. Antes, quem escolheu ribalta, projetor, mundos, interface ou letreiro via "A tarefa parou antes do fim" ("protagonista pequeno" e "fora do centro vertical"), porque a cena do exemplo é escrita para o estilo padrão. Os vídeos que você produz não mudam.
- Quem já tem a 0.5.1 não precisa fazer nada além de atualizar (aba **Atualizar** do estúdio). Se o vídeo de teste já deu erro, rode de novo depois de atualizar.

## 0.5.1 (22/10/2026)

Bonecos novos, 48 cenários 3D, render até 35% mais rápido, legenda mais limpa, trilha profissional opcional e uma licença que não se perde quando o computador muda de nome.

**Vídeo**
- A legenda agora fica sempre em 1 linha. Quando a frase não cabe, ela vira duas páginas de 1 linha, quebradas no ponto que equilibra as duas, e nunca termina em palavra solta como "de" ou "que".
- Enquadramento: número ou foto que entra junto com peças fica centralizado sozinho e só depois abre espaço para o resto. Nos beats sem legenda, título e peças descem juntos para o meio da tela, sem metade de baixo vazia. O "Comenta..." e as setas descem junto.
- Peças 3D não crescem mais até vazar da tela e cobrir o @.
- **48 cenários 3D** por beat: o ambiente atrás das peças, com luz e atmosfera próprias. Entre os novos: plenário, STF, Planalto, Congresso por fora, debate, estúdio de TV, sala de imprensa, seção eleitoral, gabinete, delegacia, presídio, agência bancária, mercado financeiro, sala de reunião, aeroporto, porto, agro, posto, supermercado, favela, praia, estádio, igreja, hospital, sala de aula, laboratório, data center, cozinha, quarto, ônibus e rua de dia ou à noite com chuva. Os antigos foram revistos: nada claro atrás do título ou da legenda e o chão sempre cobre a tela.
- **Bonecos refeitos**: proporção de adulto, pescoço, ombros e mãos, rosto discreto e variação por roupa (camisa, terno, blazer, jaleco, uniforme), tom de pele, idade, cabelo, barba e óculos. Projetos antigos continuam funcionando. O controle de qualidade avisa quando menos de 1 em cada 4 beats tem cenário e quando um adereço invade a faixa da legenda.
- O controle de qualidade avisa quando uma pessoa citada pelo nome aparece como boneco genérico, sem foto: use a foto real e recente da pessoa. Ele também reprova título sobre foto, elemento que vaza da tela na transição, legenda em 2 linhas e espaço antes da pontuação.
- Traços (seta, X, círculo) mais grossos e destaque colado na pontuação sem espaço sobrando ("recado?", não "recado ?").

**Velocidade e robustez**
- Render até 35% mais rápido: o estúdio usa o codificador de vídeo do próprio computador (Mac; no Windows, placas NVIDIA, Intel ou AMD), com qualidade igual ou melhor e arquivo menor. Se ele falhar, o vídeo sai sozinho pelo codificador de sempre. O estilo antiguidade continua no codificador de sempre por causa do grão.
- Conferência do vídeo pronto mais rápida, e quadros já desenhados são reaproveitados sem erro mesmo depois de queda de energia.
- Dois renders no mesmo projeto ao mesmo tempo não se atropelam mais, e a voz paga não é gerada de novo sem necessidade.
- A fonte da marca carrega antes de o estúdio medir os textos: título e peças ficam no lugar certo.

**Música**
- Trilha profissional opcional, gerada pela ElevenLabs Music (a mesma conta da voz), uma por vídeo, no clima do assunto e sempre instrumental. Para ligar: `"trilhaFonte": "elevenlabs"` no `ilustrando.config.json` (ou peça ao assistente). Sem chave, sem crédito ou sem internet, o vídeo sai com a trilha de sempre.
- A trilha de fundo ficou um pouco mais alta nos trechos sem fala; sob a narração continua abaixada.

**Licença**
- O computador agora é reconhecido pelo identificador do próprio aparelho, e não mais pelo nome dele. No Mac, o nome muda sozinho ao trocar de Wi-Fi, e o estúdio passava a achar que era outro computador (o vídeo saía com marca d'água).
- Quem já ativou não precisa fazer nada: na primeira conferência online depois da atualização, a ativação passa para o identificador novo sem gastar uma das 2 vagas nem uma troca do mês. Sem internet, a ativação antiga continua valendo pelos prazos de sempre.
- Servidor de licenças no endereço novo (licencas.ilustrandocuriosidades.com), com o endereço antigo de reserva: se um não responder, o estúdio tenta o outro sozinho.

**Biblioteca de logos**
- Saíram dois logos errados que tinham vindo trocados da fonte pública: "pf" (era a polícia alemã) e "congresso" (era de outro país). Para esses assuntos, use os cenários delegacia, plenário ou congresso-exterior.

## 0.5.0 (21/10/2026)

Estilo novo de vídeo: **História e antiguidades** (`antiguidade`), com cara de documentário de museu. Agora são 18 estilos e 25 modelos.

- Pintura clássica, busto de mármore, mosaico, manuscrito e mapa antigo, tratados como peças de acervo: sépia contrastado, textura de impressão, grão de filme e uma camada leve de papel por cima.
- Três tons: **ouro** (sépia e dourado), **vinho** (pergaminho e vinho) e **escuro** (cartões de pintura sobre o preto).
- Nove tipos de cena: imagem em tela cheia, nome gigante (com o busto na frente do nome), data que se decodifica com régua de anos, número com barra, mapa, pilha de cartões em profundidade, capítulo, citação em pergaminho que desenrola e rótulo com o nome e as datas.
- Mapa de verdade: contornos do Natural Earth, a rota que se desenha cidade por cidade, o território que se preenche atrás dela e a câmera que segue o caminho sem trancos.
- Passagens próprias: tinta que se espalha, papel rasgado, varredura de luz, desfoque e corte seco no fim de frase.
- Câmera viva e suave, com profundidade, e efeitos sonoros próprios (whoosh no nome, máquina na data, papel no rasgo, tambor no capítulo, pulso no mapa), sempre abaixo da voz.
- O modelo `historia` passou a usar este estilo. Exemplo pronto em `projetos/exemplo-estilo-antiguidade`. Guia em `docs/estilo-antiguidade.md`.
- Controle de qualidade novo para todos os vídeos do estilo: reprova linha clara na borda da tela, faixa sem cobertura, fundo que pisca e câmera que tranca.

## 0.4.4 (21/10/2026)

Correção no assistente de primeira vez: a voz grátis (Piper) fica salva e o vídeo de teste sai narrado.

- Escolher a Piper agora fica salvo. Antes, quem instalava a voz grátis com o estúdio aberto via a escolha voltar para a voz anterior e a etapa Voz não ficava marcada: o estúdio só achava a Piper depois de ser fechado e aberto de novo. Agora ele acha na hora e, quando a instalação termina, já salva a Piper como a sua voz.
- Marcar uma voz e clicar em "Próximo passo" também salva a escolha (antes só salvava pelo botão "Usar esta voz").
- Se o programa da Piper estiver instalado mas a voz em português não tiver sido baixada, o estúdio diz isso e baixa ao clicar em "Instalar a voz grátis", em vez de marcar a etapa pela metade.
- O vídeo de teste sai com a voz que você salvou. Antes ele usava sempre a voz de teste, que é muda. Se a voz grátis ainda não estiver no computador, o estúdio instala antes de fazer o vídeo. Com uma voz paga sem chave, ele avisa em vez de começar.
- Nenhum vídeo com fala sai mudo sem aviso: se a narração de uma voz de verdade sair sem som, o estúdio para antes de desenhar os quadros e explica o que fazer, e o controle de qualidade do arquivo final reprova vídeo sem narração. Com a voz de teste, o vídeo continua mudo de propósito, e a tela avisa antes.

## 0.4.3 (21/10/2026)

Correção nos efeitos sonoros da 0.4.2: todos os efeitos de cada estilo voltam, só que mais baixos.

- A 0.4.2 deixou os efeitos mais baixos e também mais raros. Agora eles voltam todos, como antes: só o volume ficou menor (cerca de 9 dB) e eles abaixam um pouco mais enquanto a narração fala.
- Quer menos efeitos? Peça ao assistente efeitos "espaçado" (no máximo um a cada um segundo e meio). As opções agora são "suave" (o padrão), "normal", "espaçado" e "nenhum".
- A música que muda a cada vídeo, os 3 estilos novos e a biblioteca de logos da 0.4.2 continuam iguais.

## 0.4.2 (21/10/2026)

Áudio mais limpo: música de fundo que muda a cada vídeo e efeitos sonoros discretos, que não disputam com a narração.

**Música de fundo**
- Cada vídeo ganha a própria trilha. Sem você pedir nada, o estúdio escolhe o clima pelo assunto (política e polêmica puxam para tensão ou mistério; dinheiro e notícia, para um pulso mais moderno; ciência e curiosidade, para algo leve ou ambiente; história, para épico; fé e saúde, para leve ou inspirador).
- Agora são 10 climas: curiosidade, tensão, leve, épico, notícia e os novos mistério, ambiente (minimalista, quase só textura), inspirador, groove (no jeito lofi) e pulso.
- Dois vídeos do mesmo clima não soam iguais: muda o tom, o andamento, a sequência de acordes, os instrumentos, o ritmo e o timbre. O mesmo vídeo renderizado de novo continua igual.
- A música não fica repetindo o mesmo trecho: a cada poucos segundos entra ou sai um instrumento e o ritmo varia.
- Quando alguém fala, a música abaixa mais do que antes, e volta nas pausas.
- Quer um clima específico? Peça ao assistente ("use o clima mistério neste vídeo"). Os vídeos em que você já tinha escolhido um clima continuam com ele. O som de fundo antigo segue disponível, com o nome "pad".

**Efeitos sonoros**
- Bem mais baixos (cerca de 9 dB). (Na 0.4.2 também ficaram mais raros; a 0.4.3 trouxe todos de volta.)
- Enquanto a narração fala, os efeitos abaixam mais um pouco. Só um impacto de destaque de vez em quando passa por cima.
- Agudos mais suaves, sem chiado brigando com a voz.
- Vale para os 14 estilos de vídeo.
- Prefere mais efeitos, ou nenhum? Peça ao assistente: efeitos "suave" (o novo padrão), "normal" ou "nenhum".

**Conferência automática**
- Todo vídeo passa por uma checagem de som: a narração sai sempre no mesmo volume, e o vídeo é reprovado se a música ou os efeitos ficarem altos perto da voz.
- O relatório mostra qual clima foi escolhido e avisa se a música ficou igual à de um vídeo recente.

**3 estilos de vídeo novos (agora são 17)**
- `ribalta`: palco claro, um objeto grande por frase, que desenha literalmente o que a narração diz. Bom para "por que", "como funciona" e passo a passo.
- `projetor`: uma sala escura em 3D onde a ideia é projetada na parede, com a cor da luz mudando a cada virada. Bom para som, luz, cinema e bastidores.
- `mundos`: para listas e rankings de 3 a 5 itens; cada item tem o próprio mundo de cor, e a troca acontece por uma íris.
Cada um tem um modelo de vídeo com o mesmo nome (agora são 24 modelos). Guia em `docs/estilo-<nome>.md`.

**Biblioteca de logos e bandeiras**
- 676 logos e bandeiras prontos em `marcas/`: as marcas mais conhecidas no Brasil (tecnologia, IA, redes sociais e apps, mídia, política e instituições, bancos, varejo, esporte) e as bandeiras de todos os países, dos 27 estados e das capitais. Basta citar a marca no roteiro ("o logo do Telegram").
- Uso editorial, sem alterar o logo e sem sugerir parceria; licença e crédito de cada um vão sozinhos para o `fontes.md`. Regras em `docs/marcas.md`.

**Não mudou**
- Seus projetos, carrosséis, marca e chaves. A narração já gravada não é refeita. Para ouvir a música nova num vídeo pronto, é só renderizar de novo.

## 0.4.1 (20/10/2026)

Câmera mais presente em todos os estilos e trocas de cena sem tremor.

**Câmera**
- Mais movimento, sempre guiado pela narração: aproxima mais na palavra em destaque e no número (de 14% a 20%, conforme o estilo), começa a cena de revelação um pouco mais perto e se afasta para mostrar tudo, e segue derivando de leve o tempo todo, sem salto nos cortes.
- Nos estilos 3D, a câmera gira um pouco em volta do objeto ao longo da cena, o que dá profundidade.
- As passagens de uma cena para outra variam dentro de cada estilo (deslizar, atravessar com zoom, chicote, continuar o movimento), em vez de repetir sempre a mesma.
- O objeto principal e os textos continuam inteiros na tela mesmo no auge da aproximação.

**Correções**
- `interface`: as janelas não "tremem" mais na troca de uma cena para outra. Elas ficam paradas até o corte e a próxima entra com um movimento só.
- `letreiro` e `colagem`: corte mais limpo entre cenas, sem a peça encolher e voltar.
- `cartoes`, `fino` e `interface`: o deslize entre cenas segue numa direção só, sem ir e voltar.
- `tubo`: o objeto fica maior e centrado na cena inteira (o zoom brusco agora é de 15%, com o mesmo chicote), entra já dentro da tela e não deixa a tela vazia.

**Não mudou**
- Seus projetos, carrosséis, marca e chaves. O cache de quadros é refeito no primeiro render depois da atualização.

## 0.4.0 (20/10/2026)

A maior versão até aqui: o estúdio passa de 5 para **14 estilos de vídeo**, o carrossel ganha **29 tipos de slide novos** e a conferência de qualidade passa a olhar o vídeo como quem assiste no celular.

**9 estilos de vídeo novos**

Basta pedir ("faça no estilo cartões"). Cada um tem fundo, letras, legenda, passagem de uma cena para outra e efeitos sonoros próprios, e um modelo de vídeo com o mesmo nome, já pronto para usar. Guia de cada um em `docs/estilo-<nome>.md`.
- `impresso`: parece página impressa, com tudo em pontinhos de tinta sobre papel envelhecido.
- `cartoes`: cartões e janelas escuras sobre uma grade creme, com a palavra principal em destaque.
- `tubo`: TV de tubo antiga, palavra gigante em contorno e frases em vermelho e rosa.
- `linhas`: fundo preto, traço branco fino e um ponto que atravessa o vídeo inteiro.
- `anatomia`: o objeto real desmontado, como na figura de um manual técnico, com cada parte numerada.
- `fino`: o objeto real em traço finíssimo sobre o escuro, sem nenhuma palavra dentro da figura.
- `letreiro`: cada frase vira um título grande nas cores da sua página, com o objeto do assunto embaixo.
- `interface`: telas de aplicativo (sem marca de ninguém) que fazem o que a narração diz, na hora em que diz: digitar, clicar, escolher, receber.
- `colagem`: a foto real do assunto vira recorte de papel preso com fita, tremendo de leve como animação feita à mão.

Os seis primeiros têm cores próprias; `letreiro`, `interface` e `colagem` usam as cores da sua marca. Dá para usar um estilo no vídeo inteiro ou só em um trecho. Agora são 21 modelos de vídeo: 12 por tipo de página e 9 por estilo.

**Carrossel**
- 29 tipos de slide novos, que se misturam aos 10 de antes (39 no total). Alguns: post no formato de rede de texto curto com o nome, o @ e a foto da sua página, fio de posts, capa de jornal, plantão, conversa, nota do celular, pódio, mito ou verdade com carimbo, gráficos (barras, colunas, linha e pizza), citação com foto, tabela com visto e xis, quiz, receita, placar, versículo, linha do tempo e foto com marcações à mão. Lista completa em `docs/carrossel-templates.md`.
- Três visuais para o carrossel inteiro (escuro, claro e papel), 28 ícones, 9 rostos de reação e marcações feitas à mão, todos desenhados pelo estúdio.
- 28 carrosséis de exemplo na pasta `carrosseis/`, um para cada tipo, com os fatos conferidos em 2 fontes. Para começar, peça um parecido e troque o assunto.
- Cada slide é medido antes de sair: texto sobreposto, encostado na borda, cortado, letra pequena demais ou foto que não carregou. O estúdio corrige sozinho e mostra uma folha com todos os slides no tamanho do celular.

**Mais recursos nos vídeos**
- Composição que se arruma sozinha: quando a cena tem título e não tem legenda, o título e o objeto descem juntos para o meio da tela, sem deixar a metade de baixo vazia; e quando dois ou três objetos entram em momentos diferentes, o primeiro aparece no centro e só vai para o lado quando o próximo está chegando, sem nunca sobrar um lado vazio.
- Trechos de vídeo de verdade (b-roll) com licença livre: o estúdio procura, baixa e registra a licença no `fontes.md` do projeto.
- 168 peças 3D novas, agora 797 no total: bichos, dinossauros, cozinha, corpo humano, escola, esporte, história, ciência, dinheiro (Pix, cupom fiscal, cesta básica) e tecnologia.
- 34 efeitos sonoros novos, um para cada tipo de acontecimento na tela (entrada, contador, acerto, erro, moedas, teclado, papel), sempre na medida para não brigar com a voz.
- Câmera nova, que se move pelo que a narração diz: aproxima devagar na palavra em destaque e no número, se afasta para mostrar uma comparação, inclina de leve nos momentos de tensão e passa de uma cena para a outra sem salto. Cada estilo tem o seu jeito (o `tubo` dá zoom brusco e chicote, o `cartoes` desliza, o `linhas` segue o ponto). O texto nunca é cortado pelo movimento e o objeto principal continua inteiro na tela.
- 5 trilhas de fundo próprias, feitas pelo estúdio (sem direito autoral de terceiros), que abaixam o volume sozinhas enquanto a voz fala.

**Conferência de qualidade mais exigente**

Antes de entregar, o estúdio confere o vídeo a cada décimo de segundo e refaz o que não passar:
- todo texto fica na tela pelo menos o tempo de ser lido;
- nenhum texto encosta no topo (onde fica o nome do perfil) nem na faixa de baixo (legenda e botões do app);
- o vídeo já começa em movimento, sem um quadro parado no início;
- nunca fica mais de meio segundo de tela vazia;
- o protagonista não pode ficar pequeno demais nem só na metade de cima da tela.

**Correções**
- Instalação no Windows: abrir o instalador de dentro do `.zip` agora explica que é preciso **Extrair tudo** (antes a janela piscava e fechava), e qualquer erro aparece em português, com o que fazer, esperando você ler.
- Instalação no Mac: o aviso "Abrir Mesmo Assim" não volta se a instalação parar no meio, e uma instalação interrompida é refeita do ponto certo.
- Mensagens mais simples: nenhum aviso manda abrir o Terminal; todos dizem onde clicar no estúdio web.
- O contador mostra decimais certos: "2,2 milhões" não vira mais "2 milhões".
- A conferência de qualidade deixou de acusar sombra onde não havia, quando uma peça clara sai de cena.
- Vídeos antigos com peças em escala muito pequena são ajustados sozinhos para o tamanho mínimo, com aviso.
- O vídeo de teste (`npm run prova`) e os testes do estúdio passam no pacote como saem da fábrica.
- O estúdio web não cai mais ao assistir a um vídeo que acabou de ser refeito, e só atende pedidos do seu próprio computador.
- As instruções do assistente usam sempre o convite final (CTA) e o @ da **sua** página, nunca os da página de demonstração.
- Salvar a voz sem a chave não troca mais a voz que já funcionava, e um `ilustrando.config.json` salvo pelo Bloco de Notas não quebra mais o estúdio.
- Atualizar: o `.zip` escolhido não some depois de conferir, e o botão "Desfazer" só aparece quando há o que desfazer.

**Não mudou**
- Nos estilos padrão, editorial, minimalista, papel e pontilhismo, o visual é o mesmo; só a câmera ganhou os movimentos novos (aproximar na palavra em destaque, afastar na comparação), e o encaixe das peças deixa uma folga para eles. O cache de quadros é refeito no primeiro render depois da atualização.
- Os carrosséis que você já fez continuam valendo com os 10 tipos de antes.

## 0.3.0 (20/10/2026)

**Novo**
- Estilo `pontilhismo` (5º estilo): o vídeo inteiro em pontos, em preto e branco. Um único sistema de partículas se transforma a cada frase, com câmera viva, legenda palavra por palavra e final mergulhando no preto, só com a narração.
- Retrato em meio-tom: grade regular, tamanho e brilho do ponto pelo tom, curva de tom medida no rosto, recorte do fundo (no Mac pelo próprio sistema, fora dele por cor ou por uma máscara sua), respiração e entrada vindo do escuro. Modo `pontilhado` opcional, com 15 a 40 mil pontos.
- Objetos por partes, com estados (`explode`, `monta`, `liga`, `gira`, `altera`, `cresce`) numa linha do tempo, e `compor` para juntar formas, como a cabeça com o motor dentro. Formas novas: motor de indução, `cabeca`, `engrenagem`, `bobina`, olho com íris e piscada, ampulheta, IMAGINAR × EXECUTAR, cartão de prompt digitando, ano em anéis de pontos, Terra com continentes (26 mil pontos) e galáxia (60 mil pontos).
- Qualquer objeto vira pontos: peças do repertório e modelos GLB (com arestas e silhueta realçadas), `caminho` e `svg` para desenhar em vetor, imagens e `export const pontos` no `pecas.js` do projeto.
- Obra com moldura de partículas e crédito em serifada itálica e monoespaçada; rótulos 3D com linha-guia que seguem a câmera; câmera por elemento e por estado, com alvo.
- Elemento `pontos` para pôr alguns momentos em pontos em qualquer estilo, na cor da marca.
- Scripts novos: `imagem-para-pontos.mjs` (foto em pontos, com prévia), `folha-pontos.mjs` (folha de contato das formas) e `respiros.mjs` (pausas naturais na narração, cortando só em silêncio). Guia em `docs/pontilhismo.md`.
- Fontes Instrument Serif e JetBrains Mono (licença OFL) para o crédito das obras e os rótulos.

**Mais rápido**
- No Mac, o render usa a placa de vídeo (Metal): o mesmo quadro sai cerca de 4 vezes mais rápido, com a mesma imagem. Se a placa não estiver disponível, volta sozinho para o modo antigo. `ILU_GPU=0` força o modo antigo.
- O número de navegadores do render agora considera a memória realmente disponível no Mac (antes caía para 1). `ILU_WORKERS` fixa o número.

**Não mudou**
- Vídeos nos estilos padrão, editorial, minimalista e papel saem iguais. Só o cache de quadros é refeito no primeiro render depois da atualização.

## 0.2.0 (18/10/2026)

**Novo**
- Sem Terminal para quem comprou: **Instalar (Mac)** e **Instalar (Windows)** na raiz do pacote instalam tudo com dois cliques, dentro da pasta (`.programas/`), sem senha de administrador: Node portátil (nodejs.org, versão travada, SHA-256 conferido), peças do estúdio (`npm ci`), navegador interno, FFmpeg estático (ffmpeg-static b6.0, SHA-256 conferido) e o alinhador de voz. Mensagens em português simples, barra de progresso em texto, e no fim o atalho "Abrir Estudio de videos" na Mesa e o estúdio aberto no navegador. `--simular` mostra tudo sem baixar nada.
- **Abrir Estúdio (Mac)** e **Abrir Estúdio (Windows)**: sobem o estúdio web local e abrem o navegador (se já estiver aberto, só abre a página).
- Estúdio web como painel: aba **Começar** (instalação, licença com e-mail e chave, voz grátis ou paga com links e campo para colar a chave, que vai direto para o `.env` e nunca volta para a tela, marca com prévia ao vivo, tipo de página e linha editorial, vídeo de teste), **Meus vídeos** (assistir, baixar, mostrar na pasta, copiar legenda), **Projetos** (o painel de antes) e **Atualizar** (acha o .zip em Downloads, confere, atualiza, desfaz). Só atende no endereço local (confere o Host) e exige token em todo pedido que muda algo.
- Alinhador de voz sem Python: Whisper rodando no próprio Node (`ferramentas/alinhar-voz.mjs`, transformers.js 4.2.0 travado por package-lock, modelo whisper-base com tempo por palavra). O `faster-whisper` em Python continua valendo para quem já tem.
- Voz grátis (Piper) instalada com um botão, num Python portátil próprio dentro da pasta (python-build-standalone, SHA-256 conferido); funciona com o Piper em Python e com o Piper portátil.
- Erros em português simples com o que fazer (`src/video/erros.mjs`), sem mandar ninguém abrir o Terminal; usados no comando de vídeo e em cada tarefa do estúdio web.
- `ferramentas/rodar` (Mac, Linux, Git Bash) e `ferramentas\rodar.ps1` (PowerShell): o assistente roda os comandos do estúdio com o Node portátil quando o computador não tem Node. Liberados nas regras do Codex.
- O zip do pacote agora é feito pelo próprio estúdio: nomes em UTF-8 marcados (o Windows mostra "Abrir Estúdio" certo) e permissão de execução dos `.command` guardada; a atualização preserva essa permissão.
- O diagnóstico mede o espaço livre também no Windows e nunca dispara a janela "instalar ferramentas de linha de comando" do Mac.

- Modelos de vídeo por tipo de página (`modelos/<id>.json`): `curiosidades` (o padrão de sempre), `aula`, `noticia`, `financas`, `fe`, `negocio`, `receita`, `esporte`, `saude`, `tecnologia`, `historia` e `ciencia`. Cada um traz formatos, faixa de palavras, estrutura do roteiro, abertura, tom e marcação de voz, estilo, cenários e peças sugeridas, ritmo, CTA, carrossel, legenda e cuidados.
- O modelo da página fica em `ilustrando.config.json` (`modeloPadrao`); um vídeo troca com `Modelo: <id>` na linha STATUS do roteiro, ou `--modelo=<id>` no comando. O linter mede o roteiro pela faixa, pela abertura, pelas expressões proibidas e pelo CTA do modelo; o plano automático usa estilo, cenário, peças, títulos, câmera e ritmo. O `cena.json` escrito continua valendo sobre o modelo.
- `npm run modelos`: lista, mostra (`--ver`), grava o padrão (`--padrao`), cria o seu modelo em `modelos/meus/` a partir de outro (`--novo <id> --base <id>`) e confere todos (`--validar`).
- A skill `comece` pergunta o tipo da página e grava o modelo; `pauta` e `roteiro` leem o modelo antes de escrever; `cena`, `carrossel` e `publicar` usam o visual, a sequência de slides e a legenda dele.
- `entrega.json` diz o modelo usado; modelo com revisão humana (`saude`) sai com `publicavel: false` até a pessoa revisar.

- Modelos 3D GLB como peças (`glb-*`): biblioteca de 80 modelos CC0 (animais, veículos, comida, casa e escritório, natureza, pessoas e prédios; Kenney, Quaternius e OpenGameArt, licenças em `src/video/engine/assets3d/LICENCAS.md`) e modelos do projeto em `projetos/<nome>/assets/*.glb`. O motor harmoniza com a casa (material `suave` ou `clay` na paleta da marca, escala e centro normalizados, sombra e entrada iguais às outras peças), toca a animação embutida em função do tempo e funciona sem rede. Galeria: `--galeria glb`; o plano automático escolhe pelo léxico `lexico/glb.json`.

- Atualizações: a compra inclui 12 meses de versões novas; com as Atualizações vitalícias, todas. `npm run atualizar` confere a data de publicação da versão nova e, fora do prazo, explica e não muda nada. `npm run licenca` e o doctor mostram até quando vão. O uso do estúdio nunca expira.

**Não mudou**
- Sem modelo, ou com `curiosidades`, o estúdio se comporta exatamente como antes: os projetos existentes validam com a mesma nota e a mesma cena.

## 0.2.0 (outubro de 2026)

**Novo**
- Peças e cenários por projeto: `projetos/<nome>/pecas.js` cria a peça 3D ou o mundo que o vídeo pede quando o repertório não tem (mesmos helpers e mesmo checklist de qualidade), validados, conferidos pelo QA e vistos com `--galeria --projeto=<nome>`.
- `node scripts/buscar-imagem.mjs <projeto> "<termo>"`: foto (Wikimedia Commons, agências públicas) ou logo (Wikidata) de licença livre, baixada para `assets/` e registrada em `fontes.md`.
- Linha editorial em política (`linhaEditorial` em `ilustrando.config.json`, `npm run linha`): neutra de fábrica; esquerda, centro ou direita mudam só o ângulo e o tom, nunca os fatos. O linter avisa roteiro político sem atribuição.
- `MAPA.md`: o que é cada pasta e cada arquivo, o que é seu e o que é do kit.
- `npm run verificar`: confere cada arquivo do estúdio com a lista de fábrica assinada (`MANIFESTO.json`) e diz, em português, o que mudou, o que falta e o que você criou.
- `npm run atualizar`: instala uma versão nova a partir do zip, sem tocar em `projetos/`, `carrosseis/`, `marca/`, `.env` e no que você criou; guarda cópia de segurança, desfaz sozinho se algo falhar e tem `--desfazer`.
- Licença por comprador: `npm run ativar` (até 2 computadores), `npm run licenca` para ver a situação ou liberar um computador. Funciona sem internet por até 21 dias depois da última conferência. Sem licença, nada para: as prévias com a voz de teste funcionam e o vídeo final sai com a marca d'água "versão não ativada".
- Vídeos (MP4), capas e imagens (PNG) gerados levam nos metadados o identificador da licença e do pacote (não aparece na imagem).
- `npm run doctor` mostra também a licença e a integridade do motor.
- Termo de licença (`LICENCA.md`) reescrito em linguagem clara.

**Mudou**
- O motor (`src/`) vai protegido no pacote e é conferido no começo de cada render. O vídeo gerado é idêntico ao da versão sem proteção.
- Ferramentas de montagem do pacote não vão mais no `package.json` da pessoa.

## 0.1.0 (outubro de 2026)

Primeira versão: estúdio de vídeo e carrossel para o Claude Code e o Codex, 10 skills, 6 guias, identidades prontas e o projeto de exemplo (`npm run prova`).




