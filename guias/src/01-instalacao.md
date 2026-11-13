---
titulo: Instalação e *primeiro vídeo*
tituloCurto: Guia 01 · Instalação e primeiro vídeo
numero: 01
rotulo: Guia 01 de 06 · referência
sub: A referência completa da instalação, no Mac ou no Windows, com o Claude Code ou com o Codex. Para o caminho mais curto, use o Guia rápido.
versao: 0.6.4
data: 08/11/2026
sumarioIntro: Primeira vez? Comece pelo Guia rápido (guias/00-guia-rapido.pdf), que leva do download ao vídeo de teste. Este guia é a consulta: cada seção resolve uma coisa.
---



# Antes de começar {o que é o estúdio e como ler este guia}

:::lead
O Estudio de videos é um estúdio que mora numa pasta do seu computador. Você conversa em português com um assistente de IA, e ele produz vídeos verticais com animação 3D, narração e legenda, e carrosséis prontos para postar.
:::

:::atencao Primeira vez? Use o Guia rápido
O **Guia rápido** (`guias/00-guia-rapido.pdf`) leva do download ao vídeo de teste em uns 30 minutos. Este guia é a referência detalhada: volte a ele quando precisar.
:::

:::atencao Palavras que vão aparecer
Estas palavras surgem nas aulas, nos guias e nas telas. Cada uma tem uma frase só.
:::

:::glossario
Pasta :: uma gaveta do computador onde ficam arquivos. O estúdio inteiro mora numa pasta.
Arquivo .zip :: uma caixa fechada com vários arquivos dentro. Precisa abrir a caixa antes de usar.
Extrair (ou descompactar) :: abrir a caixa .zip e tirar os arquivos de dentro.
Assistente (Claude Code ou Codex) :: o programa de conversa que mexe nos arquivos do seu computador e faz o vídeo por você.
Mensagem :: o texto que você escreve, ou cola, para o assistente.
Permissão :: quando o assistente pergunta "posso fazer isso?" antes de mexer no computador. Leia e aprove: é normal.
Open-source :: o estúdio é livre (MIT): quem baixa usa em produção, sem ativação nem marca d'água.
:::

:::dois
:::cartao Faz por você
- Escolhe o ângulo e confere os fatos em mais de uma fonte.
- Escreve e corrige o roteiro.
- Narra, monta as cenas em 3D e renderiza.
- Faz a capa, o carrossel e a legenda do post.
:::
+++
:::cartao Fica com você
- Assistir ao vídeo inteiro, com som, antes de postar.
- Conferir os números no arquivo de fontes.
- Publicar nas redes (o estúdio não posta sozinho).
- Pagar o assistente e a voz paga, se quiser uma.
:::
:::

### O que você NÃO precisa

- Instalar Python, Node ou qualquer programa à mão.
- Abrir o Terminal ou digitar comando.
- Saber programar ou editar vídeo.
- Pagar nada para ver a demonstração e fazer o vídeo de teste.

### Os blocos deste guia

O bloco laranja é uma frase para **escrever ao assistente**. O escuro é um comando que **o assistente roda por você**. A caixa verde é um aviso que vai aparecer e é normal; a preta diz o que fazer quando algo dá errado.

### O caminho inteiro, com tempo

| Etapa | Seção | Tempo |
|---|---|---|
| Baixar e descompactar | 04 | 5 min |
| Dois cliques em Instalar | 04 | 5 a 15 min, sozinho |
| Demonstração, licença e voz | 07, 08 e 09 | 10 min |
| Vídeo de teste | 09 | 1 a 3 min (mais em computador lento) |
| Assinar e abrir o assistente | 03, 05 ou 06 | 15 min |
| Primeiro vídeo do seu tema | 10 | 10 a 30 min |

**Não feche a janela enquanto instala.** O Instalar leva de 5 a 15 minutos, porque baixa cerca de 500 MB na primeira vez. Se a janela parecer parada, aperte [[Esc]] e espere. Na primeira vez, o assistente leva de 10 a 20 minutos para instalar o que falta.

**Quanto custa o primeiro vídeo:** o Método você já tem. O vídeo usa uma parte do limite de uso do plano do assistente, que você já paga, e uma parte da cota de voz da ElevenLabs, que na conta grátis dá, por uma conta aproximada, para uns 6 a 10 vídeos curtos por mês.

Instalar e testar não precisam do assistente: dá para confirmar que o seu computador dá conta antes de assinar qualquer coisa. Pode abrir a pasta direto no Claude Code ou no Codex: ele instala tudo sozinho, inclusive o Node, no primeiro uso.

# O que você precisa e quanto custa {computador, assistente e voz, com preços conferidos}

| Computador | Mínimo | Recomendado |
|---|---|---|
| Sistema | macOS 13 ou mais; Windows 10 ou 11 de 64 bits | macOS 14 ou mais; Windows 11 |
| Memória | 4 GB | 8 GB ou mais |
| Espaço livre | 2 GB | 10 GB |

Não roda em celular nem tablet. Linux funciona, mas este guia não cobre.

| O quê | Para quê | Quanto custa |
|---|---|---|
| Estudio de videos | o estúdio, os guias e as aulas | pagamento único |
| **Um** assistente: Claude Code **ou** Codex | escreve roteiros e conduz o estúdio | assinatura mensal (tabela abaixo) |
| Voz | a narração | ElevenLabs (conta grátis ou plano) |
| Node, FFmpeg, navegador interno, alinhador de voz | o motor por baixo; o **Instalar** baixa tudo | grátis |

### O assistente (escolha um)

| Plano | Preço | Serve? |
|---|---|---|
| Claude Free | US$ 0 | **Não.** Não inclui o Claude Code. |
| Claude Pro | US$ 20 por mês (US$ 17 no anual) | Sim. É o mínimo. |
| Claude Max | a partir de US$ 100 por mês | Sim, com limites maiores. |
| ChatGPT Free e Go | US$ 0 e US$ 8 por mês | Têm o Codex, mas o limite acaba no meio de um vídeo. Não recomendamos. |
| ChatGPT Plus | US$ 20 por mês | Sim. É o recomendado para o Codex. |

Fontes: claude.com/pricing, code.claude.com/docs/en/setup e learn.chatgpt.com/docs/pricing, conferidos em 18/10/2026. Preços em dólar, sem impostos: o banco converte e soma o IOF.

### A voz

| Opção | Custo | Para quem |
|---|---|---|
| **ElevenLabs grátis** | zero, cerca de 10.000 créditos por mês (uns 10 minutos de fala), só vozes padrão | **a voz padrão do estúdio** |
| **ElevenLabs Starter** | cerca de US$ 6 por mês, 30 mil créditos (20 a 30 vídeos), todas as vozes da biblioteca | quando a cota grátis acabar |
| ElevenLabs Creator | cerca de US$ 22 por mês, 121 mil créditos | quem posta muito |
| Fish Audio (API) | cerca de 2 a 3 centavos de dólar por vídeo, crédito pré-pago | quem quer pagar por uso |

:::atencao Cota e vozes da conta grátis
Na conta grátis, só as 10 vozes padrão funcionam pela chave (as da biblioteca pedem plano pago). Quando a cota do mês acabar: assine um plano na ElevenLabs, ou crie outra conta grátis com outro e-mail e troque a chave no estúdio.
:::

Fontes: elevenlabs.io/pricing, a ajuda da ElevenLabs ("Why can't I use some voices from the Voice Library?"), docs.fish.audio (preços da API) conferidos em 18/10/2026. A conta por vídeo é estimativa nossa.

:::resumo O custo mínimo realista
O método, uma vez. A assinatura do assistente (cerca de US$ 20 por mês). A voz: zero na conta grátis da ElevenLabs (uns 10 minutos de fala por mês), ou cerca de US$ 6 por mês com o Starter. Dá para cancelar as assinaturas quando quiser, direto com cada empresa.
:::

# Escolha o assistente: Claude Code ou Codex {as duas opções e como decidir}

O estúdio é o mesmo nos dois, com as mesmas regras e as mesmas habilidades (as **skills**). Muda só quem conversa com você.

| | Claude Code | Codex |
|---|---|---|
| Empresa | Anthropic | OpenAI |
| Plano mínimo | Claude Pro | ChatGPT Plus (recomendado) |
| Jeito mais fácil | app Claude, aba **Code** | app ChatGPT, opção **Codex** |
| Regras que lê | `CLAUDE.md` | `AGENTS.md` |
| Chamar uma skill | `/video` | `$video` |

- **Já paga um dos dois?** Use esse.
- **Não paga nenhum?** Comece pelo Claude Code: o método nasceu nele.
- **Quer os dois?** Pode, na mesma pasta, mas nunca os dois ao mesmo tempo.


# Baixe e instale {descompactar e dois cliques em Instalar}

:::passo Baixe o zip
Na página de releases do projeto, baixe o arquivo do estúdio (cerca de 88 MB). Não há licença para ativar nem e-mail de compra. Nos passos de 3 a 8, **Mac** pula os marcados Windows e **Windows** pula os marcados Mac.

**Deu certo se:** o arquivo `.zip` aparece na pasta Downloads.
:::

:::passo (Mac) Dois cliques no zip
**Deu certo se:** aparece uma pasta ao lado do zip.
:::

:::passo (Mac) Renomeie e mova a pasta
Renomeie para `ilustrando` (minúsculo, sem espaço e sem acento) e arraste para a sua pasta pessoal, a que tem o seu nome na barra lateral do Finder. Fora do iCloud Drive.

**Deu certo se:** a pasta `ilustrando`, com o **Instalar (Mac)** dentro, aparece na sua pasta pessoal.
:::

:::passo (Windows) Botão direito no zip e Extrair tudo
Se a aba **Propriedades** mostrar a caixa **Desbloquear**, marque-a antes e clique em **OK**.

**Deu certo se:** abre a janelinha "Extrair Pastas Compactadas".
:::

:::passo (Windows) Clique em Procurar...
**Não clique em Extrair ainda.**

**Deu certo se:** abre uma janela para escolher a pasta de destino.
:::

:::passo (Windows) Escolha o Disco Local (C:)
Na lista da esquerda, clique em **Disco Local (C:)** e depois em **Selecionar pasta**, no canto de baixo.

**Deu certo se:** o endereço da janelinha começa com `C:\`.
:::

:::passo (Windows) Clique em Extrair
Não digite nada e não crie pasta.

**Deu certo se:** abre no disco C uma pasta que começa com `ilustrando-metodo`, com o **Instalar (Windows)** dentro.
:::

:::atencao Por que no disco C, com nome simples, e não em Downloads, Área de Trabalho ou OneDrive?
O Windows protege e muitas vezes sincroniza essas pastas (o OneDrive copia tudo para a internet). Para fazer um vídeo, o estúdio cria e apaga milhares de arquivos pequenos, e a proteção ou a sincronização pode travar o trabalho ou derrubar o estúdio no meio. O disco C não tem isso. O nome curto evita o limite de tamanho do endereço e programas que se perdem com espaço e acento. Por que não clicar direto em Extrair? Sem o **Procurar...**, o Windows extrai ao lado do zip e ainda pode criar uma pasta dentro de outra com o mesmo nome: o assistente precisa da pasta certa, a que tem o **Instalar** e o arquivo `CLAUDE.md`. No Mac, vale o mesmo para o iCloud Drive, o Google Drive e o Dropbox.
:::

:::erro Já extraí no lugar errado, ou ficou uma pasta dentro da outra
Sem problema. Extraia de novo no disco C (passos 5 a 8) e abra a pasta nova. A pasta antiga pode ser apagada; se você já tinha feito vídeos nela, copie a pasta `projetos` para a nova. Se ficou uma pasta dentro de outra, use a de dentro, a que tem o **Instalar**.
:::

:::passo Dois cliques em Instalar
**Instalar (Mac)** ou **Instalar (Windows)**. Ele baixa o Node, o FFmpeg, o navegador interno e o alinhador de voz para dentro da pasta (`.programas`), confere a impressão digital de cada arquivo e não mexe no resto do computador. Não pede senha nem precisa de administrador.

**Deu certo se:** abre uma janela preta com "Passo 1 de 8". Se antes aparecer um aviso do Mac ou do Windows, é normal: veja o quadro logo abaixo.
:::

:::passo Espere a janela terminar
A janela preta é o estúdio funcionando. Vai de `Passo 1 de 8` até `Passo 8 de 8`, com barras de progresso. **Tempo:** 5 a 15 min (cerca de 500 MB na primeira vez). **Não feche a janela.**

**Deu certo se:** a janela termina com **Pronto!**, o estúdio abre no navegador e aparece o atalho **Abrir Estudio de videos** na Mesa ou na área de trabalho. Da próxima vez: **Abrir Estudio de videos**, ou **Abrir Estúdio (Mac)** / **Abrir Estúdio (Windows)** na pasta. Para fechar o estúdio, feche a janela.
:::

### Vai aparecer isto e é normal

:::normal Mac: "Não é possível abrir" ou "não é possível verificar o desenvolvedor"
Clique em **Concluído** (nunca em Mover para o Lixo). Depois: botão direito (ou [[Ctrl]] + clique) em **Instalar (Mac)** > **Abrir** > **Abrir**. No macOS 15 ou mais novo: menu Apple > **Ajustes do Sistema** > **Privacidade e Segurança**, role até o fim, **Abrir Mesmo Assim**, senha do Mac e **Abrir**. Só na primeira vez: o instalador libera o resto da pasta.
:::

:::normal Windows: "O Windows protegeu o computador"
**Mais informações** > **Executar assim mesmo**. Se vier "O editor não pôde ser verificado", **Executar**. O **Desbloquear** do passo 2 evita esse aviso.
:::

:::normal A janela preta
Não feche e não clique dentro dela: no Windows, um clique pode pausar a janela. Parece parada? Aperte [[Esc]]. Um download grande em internet lenta pode levar 10 minutos num passo.
:::

:::normal Outros avisos da primeira vez
- **Firewall do Windows pergunta sobre o Node.js:** deixe só **Redes privadas** e clique em **Permitir**. O estúdio só conversa com o próprio computador.
- **Mac: "Terminal gostaria de acessar arquivos":** **Permitir**. Melhor ainda: deixe a pasta na sua pasta pessoal.
- **Antivírus pergunta ou bloqueia:** permita, marque como confiável só a pasta `ilustrando` e dê dois cliques em **Instalar** de novo.
:::

:::erro A janela diz "A instalação parou"
Ela mostra **O que houve** e **O que fazer**. Quase sempre é a internet: confira e dê dois cliques em **Instalar** de novo. Ele aproveita o que já baixou e não apaga nada seu. Wi-Fi de empresa ou escola às vezes bloqueia downloads: tente outra rede (até a do celular serve). Se repetir, mande uma foto da janela no direct, dizendo a versão do sistema.
:::

:::erro Mac: dois cliques não fizeram nada, ou abriu um editor de texto
Botão direito em **Instalar (Mac)** > **Abrir com** > **Terminal**. Se persistir, descompacte o `.zip` de novo com dois cliques (outros programas de descompactar estragam a permissão do arquivo).
:::

### Ou instale pelo assistente

Também dá para abrir a pasta direto no Claude Code ou no Codex e escrever "Comece pelos primeiros passos." O assistente roda o mesmo instalador (inclusive o Node) e avisa antes de cada pedido de aprovação. As duas formas deixam tudo dentro da pasta.

:::dica Arquivos que começam com ponto
`.env`, `.claude`, `.agents` e `.programas` ficam escondidos. É normal: você não precisa abrir nenhum.
:::

# Usar com o Claude Code {instalar, entrar e abrir a pasta}

Precisa do plano **Pro** ou superior.

:::passo Baixe o app
Em **claude.com/download**, baixe a versão do seu sistema, instale e entre na sua conta. **Tempo:** 5 min.

**Deu certo se:** o app do Claude abre com a sua conta e mostra a aba **Code**.
:::

:::passo Abra a pasta
No app, aba **Code** > **Local** > **Open folder…** > pasta `ilustrando` (no Windows, a pasta `ilustrando-metodo...` do disco C). Se o Claude perguntar se você confia na pasta, confira o nome e confirme.

**Deu certo se:** o nome da pasta aparece perto da caixa de mensagem.
:::

:::passo Escolha o modo de permissão
Ao lado do botão de enviar. Comece em **Manual**: ele pede aprovação antes de mudar arquivos ou rodar comandos. Depois, se quiser, **Auto**, que só pergunta no que parecer arriscado.

**Deu certo se:** o modo **Manual** aparece marcado.
:::

Já usa o Terminal? `curl -fsSL https://claude.ai/install.sh | bash` (Mac) ou `irm https://claude.ai/install.ps1 | iex` (Windows), e depois `claude` dentro da pasta. Se aparecer `claude: command not found`, feche e abra o Terminal, ou use o app.

```diga
Comece pelos primeiros passos.
```

A skill **comece** confere a instalação, resolve o que faltar e leva você ao estúdio. Pode aprovar os comandos do estúdio. Fonte: code.claude.com/docs (setup e desktop-quickstart), conferido em 18/10/2026.

# Usar com o Codex {instalar, confiar na pasta e permissões}

Recomendamos o ChatGPT **Plus** ou superior.

:::passo Baixe o app
**Mac:** app ChatGPT em chatgpt.com. **Windows:** app **ChatGPT** na **Microsoft Store**. Entre na sua conta. **Tempo:** 5 min.

**Deu certo se:** o app do ChatGPT abre com a sua conta e mostra o **Codex**.
:::

:::passo Abra a pasta e confie nela
Escolha **Codex**, abra a pasta `ilustrando` e, quando ele perguntar, **confie na pasta**. Sem isso, ele abre em somente leitura e não consegue gravar o vídeo.

**Deu certo se:** o nome da pasta aparece como projeto.
:::

:::passo Escolha Ask for approval
No seletor abaixo da caixa de mensagem. Nunca **Full access**: o estúdio não precisa dele.

**Deu certo se:** **Ask for approval** aparece marcado.
:::

Já usa o Terminal? `npm install -g @openai/codex` (Mac, com Node no computador) ou `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"` (Windows), e depois `codex` na pasta, com **Sign in with ChatGPT**.

```diga
Comece pelos primeiros passos.
```

| No dia a dia com o Codex | O que fazer |
|---|---|
| Pedido de aprovação de `node src/`, `npm run`, `ferramentas/rodar` ou `ferramentas\rodar.ps1` | Pode aprovar: são os comandos do estúdio. |
| A narração falha por falta de internet | Aprove o comando quando ele pedir. Não troque para Full access. |
| Mudou uma skill ou o `AGENTS.md` | Feche e abra o Codex. |
| Quer ver quanto do limite usou | Escreva `/status`. |

Skills com cifrão: `$comece`, `$video`, `$carrossel` (só `$` mostra a lista). A OpenAI muda nomes de botões com frequência: se algum estiver diferente, procure o equivalente. Fontes: learn.chatgpt.com/docs (quickstart, codex/cli, permission-modes, agents-md, build-skills), conferidas em 18/10/2026.

# Sem licença de ativação {open-source}

O estúdio é **open-source** (MIT): quem baixa recebe o mesmo modo de produção, sem ativação, sem e-mail de compra e sem marca d'água. Pode instalar em quantos computadores quiser. O próximo passo é só a voz.

# Voz {a ElevenLabs, com conta grátis}

### ElevenLabs, a voz padrão do estúdio

É a voz que narra os seus vídeos: natural e com a legenda exata palavra por palavra. A conta é grátis. O estúdio tem o mesmo passo a passo na tela **Começar > Voz** (e o botão "Fazer meu primeiro vídeo" leva você até lá se a voz ainda não estiver ligada). São 5 passos, uns 5 minutos, uma vez só:

1. **Crie a conta grátis** em elevenlabs.io/app/sign-up, com o seu e-mail e uma senha (ou entre com o Google). **Deu certo se:** você entra e vê a opção **Text to Speech**.
2. **Gere a chave (API key).** Clique no seu perfil e abra **API Keys** (elevenlabs.io/app/settings/api-keys). Clique em **Create API Key**, dê o nome `ilustrando` e deixe liberadas as permissões **Text to Speech** (texto para fala) e a de ler as vozes (**Voices**, só leitura). Copie a chave: ela aparece uma vez só. **Deu certo se:** você copiou uma linha longa de letras e números.
3. **Cole a chave no estúdio**, em **Começar > Voz**, no campo da chave. Ela fica só neste computador e nunca vai para o chat com o assistente. **Deu certo se:** o campo mostra que a chave foi recebida.
4. **Escolha e ouça uma das 10 vozes padrão.** Clique em **Ouvir** em cada uma e, na que gostar, em **Usar esta**. Só as vozes padrão funcionam na conta grátis. **Deu certo se:** a voz escolhida aparece como a usada.
5. **Clique em Salvar a voz.** O campo da chave fica vazio de novo: é de propósito. **Deu certo se:** a tela mostra a chave e a voz como salvas.

**Quanto dá de graça:** cerca de 10.000 créditos por mês, o que rende uns 10 minutos de fala. Quando acabar, o estúdio avisa e você tem duas saídas: assinar um plano na ElevenLabs, ou criar outra conta grátis com outro e-mail, gerar a chave nova e trocar a chave em **Começar > Voz**.

### Fish Audio (opcional)

Crie a conta em **fish.audio**, coloque crédito na API (ou marque, no estúdio, **Usar o modelo grátis**, só para uso pessoal), crie uma chave em **API Keys**, escolha uma voz em português (o código depois de `fish.audio/m/` é o ID) e salve em **Começar > Voz > Fish Audio**.

:::atencao A chave é uma senha
Cole a chave **só no estúdio**. Nunca na conversa com o assistente, em print, e-mail ou grupo: quem tem a chave gasta o seu crédito. Se vazar, apague no site da voz, crie outra e cole a nova. O estúdio guarda a chave no arquivo `.env`, que nunca vai junto quando você compartilha a pasta.
:::

:::atencao Uma voz só por página
Escolha a voz da sua página e não troque. O público reconhece a página pela voz.
:::

# Demonstração e vídeo de teste {ver pronto e depois fazer no seu computador}

:::passo Assista à demonstração
O estúdio abre mostrando um vídeo pronto de uns 25 segundos: "Sua hora vai valer 10% a mais". Não gasta nada.

**Deu certo se:** o vídeo toca na tela.
:::

:::passo Faça o vídeo de teste
**Começar > Vídeo de teste > Fazer o vídeo de teste**. É o mesmo tema, feito no seu computador com a sua voz. Uma caixa mostra cada etapa e o **tempo estimado**. **Tempo:** 1 a 3 min num computador comum; mais em computador lento.

**Deu certo se:** a caixa mostra as etapas, uma a uma, e termina com o vídeo.
:::

:::passo Assista
O vídeo toca na tela e vai para **Meus vídeos**. **Deu certo se:** o vídeo toca com som e aparece em Meus vídeos. Se tocou, o estúdio funciona no seu computador. Se a narração sair muda com uma voz de verdade, o estúdio não entrega o vídeo e explica o que fazer.
:::

:::dica Banco de temas e carrossel
O botão **Fazer meu primeiro vídeo** tem um banco de temas prontos, com os fatos já conferidos: o estúdio faz tudo sozinho. E **Prefere começar por um carrossel?** faz um carrossel em segundos, sem voz.
:::

:::erro A caixa mostra "Não deu certo"
Ela traz a causa, o que fazer, **Copiar diagnóstico** e **Abrir o direct**. Faltando programa: dois cliques em **Instalar**.
:::

# Primeiro vídeo do seu tema {do pedido ao arquivo pronto}

Com a voz salva, abra a pasta no assistente e peça em português:

```diga
Quero um vídeo sobre por que o teclado tem um risquinho no F e no J.
```

Ou digite o tema em **Fazer meu primeiro vídeo**: o estúdio copia um pedido para você colar no assistente, que escreve o roteiro; o estúdio faz o resto.

### Dois jeitos de pedir o vídeo

:::dois
:::cartao Jeito rápido (3 mensagens)
1. `Quero um vídeo sobre` o seu assunto.
2. Leia o roteiro e escreva `Aprovado. Faça o vídeo.`
3. Quando ele avisar, assista com som.

O assistente faz várias etapas numa conversa só, então usa mais do limite do plano de uma vez. **Deu certo se:** ele diz onde salvou o vídeo.
:::
+++
:::cartao Passo a passo (uma etapa por vez)
Você confere cada parte antes de seguir e o gasto do limite fica espalhado. Veja a tabela logo abaixo. Vale quando você quer controlar o resultado ou o limite do plano está curto.
:::
:::

| Etapa | O que você faz | O que dizer ao assistente |
|---|---|---|
| 1. Pauta | Confere o ângulo e as fontes. | "Escolha o ângulo e confira os fatos sobre `assunto`." |
| 2. Roteiro | Lê, pede ajuste e aprova. | "Escreva o roteiro e me mostre." |
| 3. Vídeo | Espera de 10 a 30 min. | "Aprovado. Faça o vídeo." |
| 4. Conferir | Assiste com som e diz o que sentiu. | "Está parado." · "Não entendi a parte do número." |
| 5. Legenda | Copia o texto de cada rede. | "Prepare a legenda desse vídeo para Instagram e TikTok." |

| Etapa | Skill | O que sai |
|---|---|---|
| Ângulo e fatos conferidos | `pauta` | `fontes.md` |
| Roteiro (150 a 230 palavras) | `roteiro` | `roteiro.md` |
| Narração, cenas e controle de qualidade | `video`, `cena` e `critico` | `cena.json` |
| Render | `video` | `saida/<nome>.mp4` e as capas |
| Legenda do post | `publicar` | o texto de cada rede |

O assistente só para e pergunta em três casos: falta algo que não dá para inventar (como a chave da voz), uma falha que ele não corrigiu em três tentativas, ou uma decisão de marca sem volta. **Tempo:** 10 a 30 min. Pode usar o computador enquanto isso.

O vídeo aparece em **Meus vídeos**, com **Baixar**, **Mostrar na pasta** e **Copiar legenda**. Na pasta: `projetos/<nome>/saida/` (o `.mp4` de 1080 x 1920, `capa.jpg` e `capa-grid.jpg`) e `projetos/<nome>/fontes.md`.

### Antes de postar

- [ ] Assisti ao vídeo inteiro, com som.
- [ ] Os números batem com o `fontes.md`.
- [ ] O nome e o @ no topo são os da minha página.
- [ ] A capa está legível no recorte da grade.

### Pedir ajustes

```diga
O vídeo ficou longo. Corte para uns 50 segundos, sem perder o número principal.
```

Mais exemplos no Guia 06, seção "Como pedir mudanças". São 18 estilos de vídeo: `padrao`, `editorial`, `minimalista`, `papel`, `pontilhismo`, `impresso`, `cartoes`, `tubo`, `linhas`, `anatomia`, `fino`, `letreiro`, `interface`, `colagem`, `ribalta`, `mundos` e `antiguidade`. Cada um tem um exemplo em `projetos/exemplo-estilo-<nome>`: peça "faça parecido com o exemplo do estilo colagem, sobre <tema>".

# Carrossel {do pedido aos slides em PNG}

```diga
Quero um carrossel sobre por que o céu é azul.
```

O assistente usa `pauta` e `carrossel`: de 6 a 10 slides, 1080 x 1350, em `carrosseis/<nome>/slides/`, com o nome, o @ e a cor da sua marca. Eles aparecem no estúdio, na aba **Carrosséis** (**Meus carrosséis**): **Ver e baixar** pega cada slide em PNG e **Mostrar na pasta** abre a pasta com todos. Para postar, suba as imagens na ordem (01, 02, 03...).

Na aba **Carrosséis** também há pedidos prontos para copiar (mito ou verdade, passo a passo, ranking, notícia) e o botão **Fazer um carrossel de exemplo**, que fica pronto em segundos, sem voz.

Para **trocar o estilo**, diga no pedido (nomes e prévias na aba **Estilos**, em **Carrosséis**):

```diga
Faça um carrossel sobre o céu azul no estilo Jornal.
```

Para mudar um que já existe: "Refaça o carrossel ceu-azul no estilo Jornal." Para o estúdio usar a marca nova num carrossel antigo: "Gere de novo o carrossel ceu-azul."

São 39 tipos de slide (capa, número grande, lista, comparação, post de rede de texto, fio, conversa, gráfico, quiz e outros), com 28 exemplos prontos na pasta `carrosseis`. Para a legenda: "Prepare a legenda desse carrossel para Instagram e TikTok."

# Sua marca {nome, @, cor e símbolo}

O estúdio vem com a marca neutra **Sua Página** (@suapagina). Troque antes do primeiro post: o @ aparece no topo de todo vídeo e no rodapé de todo carrossel.

Em **Começar > Sua marca**: escreva o nome e o @, clique numa cor e veja como fica no celular. **Ver as imagens antes** mostra a prévia sem trocar nada; **Aplicar na minha página** troca a marca e gera foto de perfil, capa de destaque e banners. **Abrir a pasta com as imagens** mostra os arquivos.

Ou peça: "Troque a marca para Curioso Diário, @curiosodiario, cor verde." O assistente confirma antes de aplicar. Nunca troque editando arquivos à mão. O Guia 03 ensina a escolher o nome.

# Onde ficam os arquivos {o mapa da pasta}

```texto Pasta ilustrando
ilustrando/
  Instalar / Abrir Estúdio   (Mac e Windows) dois cliques
  COMECE-AQUI.pdf e guias/   os guias
  .env                       suas chaves (só no seu computador)
  .programas/                Node, FFmpeg e alinhador, do Instalar
  marca/saida/               avatar, banners e capas de destaque
  projetos/<seu-video>/      roteiro.md, fontes.md, cena.json, saida/, cache/
  carrosseis/<nome>/         carrossel.json e slides/
```

A pasta `cache` de cada vídeo guarda os quadros para retomar um render interrompido. Depois de postar, pode apagar: "Apague o cache dos vídeos prontos para liberar espaço."

# Comandos {opcional, para quem quer ver por baixo}

Você não precisa de nenhum. É o que o assistente roda.

| Comando | O que faz |
|---|---|
| `npm run estudio -- --abrir` | abre o estúdio |
| `npm run doctor` | confere a instalação e se a chave da voz existe (sem mostrar) |
| `npm run prova` | vídeo de exemplo com voz de teste |
| `npm run status` | estado de cada projeto |
| `npm run video -- <projeto>` | vídeo completo (`--rapido` prévia; `--refazer-voz` nova narração; `--foto=12.5` um quadro) |
| `npm run carrossel -- <nome>` | gera os PNGs do carrossel |
| `npm run identidade` | avatar, banners e capas da marca |
| `bash ferramentas/instalador/bootstrap-unix --assistente` | o Instalar, sem janela (Windows: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File ferramentas/instalador/instalar.ps1 -Assistente`) |

Sem Node no computador, ponha `ferramentas/rodar` (Mac) ou `ferramentas\rodar.ps1` (Windows) na frente.

# Atualizações {versões novas sem perder nada}

:::passo Baixe o .zip novo
Na página de releases do projeto. Não precisa descompactar.
:::

:::passo Abra a aba Atualizar
No estúdio. Ele procura o arquivo em Downloads, na Mesa e ao lado da pasta. Não achou? **Escolher o arquivo .zip**.
:::

:::passo Confira e atualize
**Conferir** mostra o que muda. **Atualizar agora** troca só os arquivos do kit: vídeos, carrosséis, marca e chaves ficam, e o que mudou fica numa cópia de segurança.
:::

:::passo Feche e abra o estúdio
Se algo não ficar bom: **Atualizar > Desfazer a última atualização**.
:::

Atualizações são livres no open-source: sem prazo nem ativação. Os apps do Claude e do ChatGPT se atualizam sozinhos.

<!-- quebra -->

# Se algo der errado {a tela de erro, o relatório de erro e o direct}

:::atencao A regra que resolve quase tudo
**Copie o erro, cole no assistente e escreva:** "Deu esse erro. Me ajude a resolver." Se o vídeo saiu mas você não gostou, diga o que sentiu assistindo ("está parado", "não entendi", "ficou longo"): o assistente transforma isso em ajuste. Para pedir ajuda a gente, diga a seção e o passo ("travei na seção 04, passo 7"). Nunca cole a chave da voz.
:::

Toda tela de erro mostra **a causa**, **o que fazer**, o botão **Copiar diagnóstico** (versão, sistema e o que faltou, sem chave, e-mail nem nome do computador) e o botão **Abrir o direct** (ig.me/m/kaueajure). Se a página do estúdio não abrir, aparece uma tela simples de ajuda com os mesmos botões.


| O que aparece | O que fazer |
|---|---|
| Mac: "Não é possível abrir" | Seção 04, "Vai aparecer isto e é normal". |
| Windows: "O Windows protegeu o computador" | **Mais informações** > **Executar assim mesmo**. |
| "A instalação parou" | Siga o **O que fazer**. Quase sempre: internet e dois cliques em **Instalar** de novo. |
| "O estúdio ainda não foi instalado" | Dois cliques em **Instalar** primeiro. |
| O navegador não abriu | Copie o endereço `http://127.0.0.1:...` da janela preta no navegador. |
| **Começar > Instalação** com linha vermelha | Dois cliques em **Instalar**: ele instala só o que falta. |
| "Esta voz exige plano pago" | Troque para uma das 10 vozes padrão (Começar > Voz > ElevenLabs), ou assine um plano. |
| "O site da voz recusou a chave" | Crie outra chave e cole em **Começar > Voz**. |
| "A chave foi criada sem a permissão Text to Speech" | No site da voz, crie outra chave com **Text to Speech** ligado. |
| "Acabaram os créditos deste mês" | Assine um plano ou crie outra conta grátis com outro e-mail e troque a chave. |
| Pedido de licença ou chave `ILU1-` | Ignore: o estúdio open-source não ativa licença. |
| "O caminho da pasta é comprido demais" ou "não deixou gravar na pasta" | Mova a pasta para `C:\ilustrando` (Windows) ou para a pasta pessoal (Mac), fora de Downloads, OneDrive e iCloud. |
| "Um arquivo da pasta está em uso" | Pause o OneDrive, libere a pasta no antivírus e clique em **Tentar de novo**. |
| "Outro programa está usando o vídeo" | Feche o player e a prévia, espere uns segundos e clique em **Tentar de novo**. |
| "O FFmpeg fechou no meio do trabalho" | Quase sempre o antivírus: adicione a pasta `ilustrando` às exclusões e clique em **Tentar de novo**. |
| O estúdio fechou sozinho no Windows | Abra de novo com **Abrir Estúdio (Windows)**; seus vídeos ficam salvos. Se repetir, **Copiar diagnóstico**. |
| "A cena que o assistente escreveu tem itens que o estúdio não aceita" | Peça: "Apague a cena.json deste vídeo e refaça." |
| Aviso no vídeo ("pessoa sem foto livre", "peça sem relação com a fala") | É aviso, o vídeo sai. Peça ao assistente para trocar a imagem ou a peça. |

:::dica Relatório de erro automático
Quando algo falha, o estúdio manda sozinho um **relatório de erro**: o código da falha e o mesmo texto do **Copiar diagnóstico** (versão, sistema, o que o estúdio disse e o fim do registro), sem chaves, e-mail, roteiro nem dados pessoais. Fica guardado em área privada por 180 dias. Serve para a gente corrigir mais rápido. Para desligar: **Configurações**, na aba **Começar**.
:::

Mais de 30 mensagens, com a solução, no **Guia 06**.

:::resumo Quando nada resolver
Peça ao assistente: "Rode o diagnóstico, leia o erro e me explique em português o que fazer". Nunca cole a chave da voz na conversa. Se continuar travado: **Copiar diagnóstico** e **Abrir o direct**.
:::

# Fontes e datas {de onde vieram preços e requisitos}

Conferido em **18/10/2026** (vozes e planos) e revisado em **27/10/2026**. Quando houver diferença, vale o site oficial.

| Assunto | Fonte |
|---|---|
| Planos do Claude e Claude Code | claude.com/pricing; code.claude.com/docs/en/setup e desktop-quickstart |
| ChatGPT com Codex | learn.chatgpt.com/docs (pricing, quickstart, codex/cli, permission-modes, agents-md, build-skills) |
| ElevenLabs: planos e vozes da biblioteca na API | elevenlabs.io/pricing; ajuda da ElevenLabs, "Why can't I use some voices from the Voice Library?" |
| Fish Audio | docs.fish.audio (pricing-and-rate-limits); fish.audio/plan |
| Node.js e FFmpeg do instalador | nodejs.org/dist; github.com/eugeneware/ffmpeg-static (b6.0) |
| Avisos do macOS e do Windows | support.apple.com/pt-br/102445; learn.microsoft.com, "Microsoft Defender SmartScreen" |




