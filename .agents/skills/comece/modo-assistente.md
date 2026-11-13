

# Modo assistente: o kit inteiro pela conversa, sem o estúdio web

Leia este arquivo quando a pessoa abriu a pasta direto no Claude Code ou no Codex e escreveu "Comece pelos primeiros passos" sem ter o estúdio no navegador, ou quando ela disser que prefere fazer tudo com você. Funciona igual no Mac e no Windows, no Claude Code (app, aba Code, ou terminal) e no Codex (app ou terminal). Quem abriu o estúdio web segue o roteiro normal da skill.

## Regras que valem o tempo todo
1. **Um passo por vez.** Uma frase para dizer o que vai fazer, o comando, uma frase para dizer o que aconteceu. Mostre `Passo 3 de 7: ...`.
2. **A chave da voz nunca passa pelo chat.** Você não pede, não lê, não mostra e não repete a chave. Ela entra só pelo arquivo `.env`, que a pessoa edita no editor de texto do computador dela. Nunca rode `cat`, `type`, `Get-Content` nem abra o `.env` (o Claude Code e o Codex do estúdio bloqueiam isso). Quem confere é `npm run voz -- --conferir`, que responde só `ok` ou o motivo.
3. **Não há licença de ativação.** O estúdio é open-source; não peça e-mail de compra, chave `ILU1-` nem `npm run ativar`.
4. **Avise antes de cada pedido de aprovação** do aplicativo. Exemplo: "Vou conferir o seu computador. Vai aparecer um pedido de aprovação: pode aprovar."
5. **Sem jargão e sem travessão longo com espaços.** Explique a palavra técnica na mesma frase.
6. **Falhou duas vezes, pare.** No máximo 2 tentativas por problema, só pela lista segura da skill (seção "Quando o estúdio devolver um erro"). Depois: diga em uma frase o que tentou e mande para o direct (https://ig.me/m/kaueajure).
7. **Windows:** ponha `ferramentas\rodar.ps1` na frente dos comandos quando o Node não estiver no caminho do terminal (PowerShell). No Git Bash e no Mac use `ferramentas/rodar`. Os exemplos abaixo usam `npm run ...`.
8. **Nunca abra, controle nem tire print do navegador** (nem para "mostrar o roteiro no estúdio"): o estúdio web se atualiza sozinho. Para saber o estado, rode `npm run comece -- --situacao --json`; ele diz a pasta exata do estúdio em uso (`pasta`): confira que é a mesma pasta aberta no aplicativo. Se `mesmaPastaDoTerminal` for `false`, avise a pessoa e peça para abrir no aplicativo a pasta certa.
9. **Gaste pouco do limite do plano:** saída curta, instalador em segundo plano, use `npm run comece -- --situacao` (uma tela) em vez de vários comandos.

## Antes de tudo: o aviso do plano e das aprovações
Diga uma vez, no começo:
> Vou deixar tudo pronto para o seu primeiro vídeo, uns 15 minutos. O aplicativo vai pedir a sua aprovação em vários comandos: pode aprovar os que eu pedir aqui (todos rodam só dentro desta pasta). Se o limite do seu plano acabar no meio, não perde nada: é só continuar depois.

## Passo 1: conferir o computador
Rode `npm run comece -- --situacao --json` (se `node` não existir, siga o Passo 0 da skill primeiro). Leia o campo `proximo` e vá para o passo dele. Diga em português simples o que já está ok e o que falta, em até 5 linhas. Exemplo:
> Já está pronto: Node, FFmpeg, peças e navegador interno. Falta: voz e a marca. Vamos na ordem.

## Passo 2: instalar o que faltar (você mesmo)
Se `proximo.id` for `instalar`, o instalador da pasta resolve (Passo 0 da skill, o mesmo dos dois cliques, sem janela). Diga: "Falta o motor do estúdio neste computador. Vou instalar aqui na pasta, sem mexer em mais nada seu. Baixa uns 500 MB; vai aparecer um pedido de aprovação." Rode em segundo plano, com o maior tempo limite que o terminal permitir. Se parar, rode de novo (até 3 vezes; ele continua do que falta). Depois rode `npm run comece -- --situacao` outra vez.

## Passo 3: lugar da pasta
Se `proximo.id` for `mover-pasta` (Downloads, OneDrive, iCloud, Dropbox, Google Drive ou dentro do zip), explique e ofereça, sem apagar nada:
> A pasta está num lugar que trava arquivos no meio do vídeo (a nuvem sincroniza, o Downloads é vigiado pelo antivírus). Posso copiar o estúdio para <C:\ilustrando no Windows | ~/ilustrando no Mac>. Nada é apagado: a pasta atual fica como está. Posso copiar?

Só depois do "sim": Windows `node scripts/copiar-estudio.mjs` (copia para `C:\ilustrando`); Mac `cp -R` da pasta para `~/ilustrando`. Depois peça: "Feche esta conversa, abra a pasta nova no aplicativo e escreva de novo: Comece pelos primeiros passos." (A conversa recomeça na pasta nova; o `comece --situacao` mostra onde parou.) Se ela preferir não mover, siga em frente e avise que, se aparecer erro de pasta, é por isso.

## Passo 4: licença (removido)
Pule este passo. O estúdio é open-source: sem ativação, sem marca d'água e sem e-mail de compra.

## Passo 5: voz (a chave nunca no chat)
Primeiro `npm run voz -- --situacao --json`. Se `chave` for `presente`, vá direto à conferência.

**5a. Criar a conta e a chave (a pessoa faz no site):**
> Vou ligar a voz do vídeo. Você faz 4 cliques e eu cuido do resto. A conta grátis da ElevenLabs dá uns 10 minutos de fala por mês.
> 1. Entre em elevenlabs.io/app/sign-up e crie a conta (pode ser com o Google).
> 2. Abra elevenlabs.io/app/settings/api-keys e clique em **Create API Key**. Dê o nome `ilustrando`.
> 3. Deixe marcadas **Text to Speech** e **Voices** (só leitura). Crie e **copie** a chave: ela aparece uma vez só.
> **Não cole a chave aqui na conversa.** Eu vou abrir um arquivo no seu computador e você cola lá. Me diga "pronto, copiei".

**5b. Abrir o arquivo.** Depois do "copiei", rode `npm run voz -- --preparar`.
- Mac: "Abri o arquivo **.env** no TextEdit. Procure a linha `ELEVENLABS_API_KEY=` e cole a chave logo depois do `=`, sem espaço e sem aspas. Salve com **Cmd + S** e feche a janela. Depois me diga 'salvei'." Se o TextEdit mostrar barra de formatação: menu Formatar > Tornar texto simples, e salve de novo.
- Windows: "Abri o arquivo **.env** no Bloco de Notas. Procure a linha `ELEVENLABS_API_KEY=` e cole a chave logo depois do `=`, sem espaço e sem aspas. Salve com **Ctrl + S** e feche a janela. Depois me diga 'salvei'."
- Se o comando disser que não conseguiu abrir o arquivo: "Abra a pasta do estúdio, procure o arquivo `.env` (se não aparecer, é porque arquivos que começam com ponto ficam ocultos: no Mac aperte Cmd + Shift + ponto; no Windows, Exibir > Itens ocultos) e abra com o Bloco de Notas ou o TextEdit."

**5c. Conferir.** Depois do "salvei", rode `npm run voz -- --conferir --json` e use o `codigo`:

| codigo | O que dizer |
|---|---|
| `ok` | "Tudo certo, a voz está ligada. Vamos escolher a voz e seguir." |
| `vazia` | "O arquivo está sem a chave. Abro de novo: cole depois do `=` da linha `ELEVENLABS_API_KEY=` e salve." (rode `--preparar` outra vez) |
| `formato` | "A chave veio com um pedaço de outra coisa e não deu para limpar. Copie de novo, inteira, e cole no mesmo lugar." |
| `recusada` | "A ElevenLabs não reconheceu essa chave. Quase sempre é cópia pela metade ou chave apagada. Crie uma nova em elevenlabs.io/app/settings/api-keys e copie inteira. Eu abro o arquivo de novo." |
| `permissao-tts` | "A chave existe, mas sem a permissão de fala. Crie outra e deixe marcada **Text to Speech**." |
| `plano-gratis-sem-voz` ou `voz-invalida` | "A conta grátis só usa as 10 vozes padrão. Vou trocar para uma delas." (siga 5d) |
| `cota-acabou` | "Os créditos grátis do mês acabaram. Você pode assinar um plano na ElevenLabs ou criar outra conta grátis com outro e-mail, gerar a chave nova e trocar a chave no mesmo arquivo. Quando trocar, me diga 'salvei'." |
| `sem-internet` | "Não consegui falar com a ElevenLabs agora. Confira a internet e tento de novo." |
| `ok-sem-voz-escolhida` | "A chave está certa. Falta escolher a voz." (siga 5d) |

Se o comando avisar que corrigiu a chave sozinho (`corrigida: true`), diga só: "A chave veio com aspas ou espaço; limpei isso para você."

**5d. Escolher a voz.** Rode `npm run voz -- --voz-padrao` (lista as 10 com o tom de cada). Ofereça ouvir as amostras (arquivos em `src/estudio/vozes/`, por exemplo `george.mp3`: Mac `open src/estudio/vozes/george.mp3`; Windows `start "" src\estudio\vozes\george.mp3`). Depois: `npm run voz -- --voz-padrao <nome>`. Sem preferência, George.

**Se a pessoa colar a chave no chat** (não repita, não grave, não use):
> Essa chave ficou salva na conversa, então vamos trocar. Entre em elevenlabs.io/app/settings/api-keys, **apague** essa chave (ícone da lixeira), crie outra e cole só no arquivo que eu abrir. Não repito a chave aqui.
Trate como vazada: não a use nem grave no `.env`; rode `npm run voz -- --preparar` e siga 5b.

**Variável de ambiente (quem já sabe usar):** se a pessoa preferir, ela cria `ELEVENLABS_API_KEY` no sistema (Windows: variáveis de usuário; Mac: `export` no `~/.zprofile`) e reabre o aplicativo. O estúdio usa a variável quando a linha do `.env` está vazia. Nunca peça isso a quem não pediu.

## Passo 6: marca, tipo de página e linha
Siga o Passo 3 da skill principal e a skill `marca`: nome da página, @ e cor; objetivo dos vídeos (`npm run objetivos -- --padrao <id>`); linha editorial. Pergunte uma coisa por vez e rode você os comandos. Se a pessoa não souber, use os padrões e diga que dá para mudar depois.

## Passo 7: prova opcional do motor
Se a pessoa quiser ver um vídeo de exemplo sem gastar voz, rode `npm run prova` (1 a 3 minutos; mais em computador lento). Diga como achar: `projetos/exemplo/saida/`. Explique: "É um vídeo sem voz de propósito. Com a voz ligada, os próximos saem narrados." Se ela já usa o estúdio web, também pode conectar a IA em **Configurações > Configurar IA** e pedir no **Chat**. Se quiser ouvir a voz no exemplo, ofereça `npm run video -- exemplo --voz=elevenlabs --sem-musica` e avise que gasta créditos.

## Passo 8: o pedido do tema
Termine com o resumo da skill (Passo 6 de 6) e o convite: "Agora escreva, do seu jeito: Quero um vídeo sobre <tema>." (No estúdio web com IA conectada, o mesmo pedido pode ir no Chat.) Daí em diante é o fluxo normal (skills `pauta`, `roteiro` e `video`).

## Quando o limite do plano do assistente acabar
Se o aplicativo avisar que o limite do plano acabou (ou a conversa parar no meio):
> O limite do seu plano acabou por agora. Nada se perdeu: o que já foi instalado e configurado fica salvo na pasta. Quando o limite voltar (o aplicativo mostra a hora), abra a mesma pasta e escreva: Comece pelos primeiros passos. Eu vejo onde parou e continuo dali.
Ao retomar, rode só `npm run comece -- --situacao` e siga o `proximo`.

## Quando o aplicativo pedir aprovação demais
Claude Code: sugira o modo que aceita edições da pasta do estúdio e aprove os comandos `npm run ...` do estúdio. Codex: confirmar que a pasta é de confiança e usar "Ask for approval" (nunca "Full access"). Em nenhum dos dois peça para desligar proteções do sistema.

## Atualização
Se a saída trouxer a linha "Aviso do estúdio: a versão ...", repita em uma frase. A atualização é sempre com o arquivo da compra, a pedido da pessoa.




