# Verificação da marca opcional

A marca deixou de bloquear a configuração. Configurações > Sua marca (opcional) permite desmarcar “Exibir minha marca nos vídeos”. A escolha não apaga tokens, cores ou arquivos de identidade; atua nas próximas prévias e renderizações, inclusive de cenas existentes. Não modifica vídeos exportados nem grava nova narração.

## Checagens direcionadas

Comando: `node --test scripts/marca-opcional.test.mjs scripts/marca-opcional-api.test.mjs scripts/marca-opcional-ui.test.mjs test/preparacao-video.test.mjs test/protecao-storyboard.test.mjs test/camera.test.mjs`. Resultado: 20 testes aprovados. Abrange marca ausente/neutra, persistência e reativação, preservação de identidade e cena, endpoint autenticado, erro HTTP em JSON, saída do painel durante espera, preparação/cache e regressões de câmera/storyboard. Sintaxe dos três scripts inline da interface e dos módulos alterados conferida com `node --check`; `git diff --check` limpo; `npm run sincronizar -- --conferir` aprovado.

A revisão independente encontrou persistência indevida do desligamento global em `cena.handle`; corrigida, com teste de reativação de cena horizontal. A preferência global agora é aplicada à spec preparada, não à autoria gravada. Ocultar somente o @ continua separado de ocultar a identificação também no CTA. O fallback legado de teologia agora distingue string vazia (identificação deliberadamente omitida) de valor ausente.

## Limites da verificação

O navegador não foi aberto, respeitando a instrução da sessão. Os handlers foram exercitados com estados controlados e a API com um estúdio temporário, sem usar dados reais nem gerar voz paga. Revisão visual interativa não realizada. Os arquivos de identidade e o projeto Vini não foram alterados nesta manutenção.

A bateria ampliada antiga apresentou falhas fora do escopo: expectativas de licença com limite de computadores já removido, catálogo de exceções de cores incompatível com os arquivos distribuídos e travessões em arquivos existentes. Não se declara a bateria completa aprovada. A alteração do runtime não acrescenta cores e o HTML mantém a mesma quantidade de travessões do HEAD. A auditoria estática premium também reportou 49 achados em componentes existentes (botões com ligação dinâmica não reconhecida e decisões antigas de controles); não foi usada como aprovação visual nem motivou reformulação dessas telas. Evidência local da execução: `/tmp/videos-ia-premium-audit-evidence.json`.

Reabrir o estúdio carrega a interface e os módulos atualizados. Reabrir a sessão Codex carrega a regra atualizada de marca opcional no AGENTS.md.
