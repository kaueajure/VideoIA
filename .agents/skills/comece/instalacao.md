# Instalação e Node

## Passo 0. Node e instalação: você mesmo resolve
O estúdio precisa do Node 20 ou mais, do FFmpeg, do navegador interno e das peças. Quem deu dois cliques em Instalar já tem tudo dentro da pasta (`.programas/`). Quem abriu a pasta direto aqui pode não ter nada, nem o Node: tudo bem, o instalador da pasta resolve, e quem roda é você.

**Qual instalador (o mesmo dos dois cliques, sem janela e sem abrir o navegador no fim):**
- Mac e Linux: `bash ferramentas/instalador/bootstrap-unix --assistente`
- Windows (Git Bash do Claude Code, PowerShell ou Prompt do Codex): `powershell.exe -NoProfile -ExecutionPolicy Bypass -File ferramentas/instalador/instalar.ps1 -Assistente` (o `ExecutionPolicy Bypass` vale só para esse processo; não mude nada do sistema)
- Como saber que é Windows: `uname -s` responde `MINGW`, `MSYS` ou `CYGWIN`, ou o seu terminal é o PowerShell.

Ele baixa o Node portátil (só se o computador não tiver o Node 20 ou mais), o FFmpeg, as peças, o navegador interno e o alinhador de voz, confere a impressão digital (SHA-256) de cada arquivo e não instala nada fora da pasta nem pede senha. Baixa uns 500 MB na primeira vez (é rapidinho; em internet lenta, um passo pode passar de 10 minutos). Rode com o maior tempo limite que o seu terminal permitir (no Claude Code, em segundo plano); se o comando for interrompido pelo tempo ou pela internet, rode de novo: ele continua do que falta. No fim aparece "Pronto! Tudo instalado"; se parar, ele imprime "O que houve" e "O que fazer": siga e rode de novo (no máximo 3 vezes).

**A ordem:**
1. Rode `node -v`. Se responder `v20` ou mais, use os comandos normalmente (`node ...`, `npm run ...`) e siga para o Passo 1.
2. Se não existir (ou for menor que 20), rode `ferramentas/rodar node -v` (Mac, Linux e Git Bash) ou `ferramentas\rodar.ps1 node -v` (PowerShell). Ele acha o Node portátil da pasta e o Node do computador fora do caminho do terminal (`/opt/homebrew/bin`, `/usr/local/bin`). Se responder `v20` ou mais, ponha `ferramentas/rodar` (ou `ferramentas\rodar.ps1`) na frente de todo comando `node`, `npm` ou `npx` desta e das outras skills, e siga para o Passo 1.
3. Se nem isso funcionar, não há Node: avise ("Vou instalar o estúdio aqui na pasta, inclusive o Node, o motor que roda tudo. É rapidinho. Vai aparecer um pedido de aprovação: pode aprovar.") e rode o instalador da sua plataforma (acima). Depois use `ferramentas/rodar` (ou `ferramentas\rodar.ps1`) na frente dos comandos, como no item 2.

Se a pessoa preferir, ela pode dar dois cliques em **Instalar (Mac)** ou **Instalar (Windows)**: é o mesmo instalador, numa janela, e no fim abre o estúdio. Avisos do sistema nesse caso: Guia 01, Seções 05 e 06.

Sobre o assistente:
- **Codex:** se um comando falhar com "read-only", "permission denied" ou "sandbox", a pasta ainda não foi marcada como confiável. Explique: "O Codex abriu a pasta só para leitura. No app, confirme que confia na pasta quando ele perguntar e escolha o modo **Ask for approval**. Depois feche e abra o Codex na mesma pasta." Nunca sugira **Full access**. Os comandos do estúdio (`node src/...`, `npm run ...`, `npm test`, `npm ci`, o instalador da pasta e os mesmos com `ferramentas/rodar` na frente) já estão liberados pelas regras do estúdio quando a pasta é confiável. Se o download do instalador falhar por rede, peça para a pessoa aprovar o comando quando o Codex perguntar.
- **Claude Code:** o Claude pede permissão para rodar comandos. Diga à pessoa que pode aprovar os comandos do estúdio.
