# Validação do pacote 2: evidências factuais

Executada em 11/11/2026, sobre a árvore local, preservando as alterações que já existiam. Não foram adicionadas dependências nem modificados os outros cinco repositórios.

## Verificações de código

A bateria abaixo passou com **115 testes, zero falhas**:

```sh
node --test test/fontes-factuais.test.mjs test/fontes-entrega.test.mjs test/fontes-ui.test.mjs test/youtube.test.mjs test/tiktok.test.mjs test/youtube-ui.test.mjs test/tiktok-ui.test.mjs test/storyboard.test.mjs test/preparacao-video.test.mjs test/protecao-storyboard.test.mjs test/cache-legenda-render.test.mjs test/recursos-visuais.test.mjs test/relatorio-recursos-ui.test.mjs test/ia-estudio.test.mjs
```

Cobertura: registros ausentes/inválidos, fontes removidas, evidências vazias, datas e expiração, cobertura da fala, trechos repetidos, vínculos com beats, alegações quantitativas, assinatura da entrega, liberação independente do QA, exportação preservando fontes.md, apresentação escapada na interface e regressões do pacote 1. Os testes de publicação usam rede simulada: remoção antes do worker, depois de abrir a sessão e entre partes interrompe o envio. IDs de beats como `1971` e `fim_cta` continuam aceitos.

A revisão de código identificou e confirmou as correções da revalidação durante uploads e da compatibilidade dos IDs de beats. Também passaram a verificação de sintaxe dos módulos e dos três scripts embutidos da página, `git diff --check` e `node scripts/sincronizar-skills.mjs --conferir`.

Uma execução ampliada com `test/estudio.test.mjs` encontrou a falha preexistente `erros traduzidos: causa e o que fazer, sem mandar abrir o Terminal`: o teste espera “máximo de computadores”, mas o tradutor do próprio HEAD responde “Não há limite de computadores por licença.” Esse teste e esse módulo não foram alterados pelo pacote. Não há afirmação de que a suíte completa do repositório passe.

## Piloto com MP4 real

Entradas distribuídas: [`exemplos/fases-da-lua/`](exemplos/fases-da-lua/README.md). O teste local gerou voz com eSpeak NG pt-br e seus eventos de palavras, normalizou o áudio com FFmpeg e renderizou pelo motor do método. Não consumiu provedores pagos, não leu credenciais e não mudou a voz da página.

Resultado observado:

- 44 palavras, três afirmações pesquisadas, quatro beats; autoria de `cena.json` preservada.
- MP4 H.264/AAC, 1080 × 1920, 30 fps, 16,87 segundos, 506 quadros, cerca de 0,5 MB.
- Áudio medido em -16,2 LUFS, pico -1,3 dB.
- QA da cena e QA do arquivo: zero falhas, três avisos cada. Persistem avisos de ritmo/abertura e trechos estáticos; este piloto valida o fluxo factual e não demonstra acabamento editorial de produção.
- Registro completo: checagem factual aprovada, entrega `aprovado: true`, `publicavel: true`; status também publicável.
- Remoção de `f-luz.evidencias`: relatório identifica `f-luz`, fala `t-2`, beat `luz`; entrega e status deixam de ser publicáveis, preservando o MP4.
- Evidência restaurada e entrega regenerada ao fim. A mudança durante uma requisição já em trânsito não permite desfazer bytes enviados; a proteção bloqueia a próxima transmissão.

Artefatos locais dessa execução em `/tmp/metodo-pacote2/piloto/saida/`: `piloto-fontes.mp4`, `qa/folha.jpg`, `validacao-pacote2.json`, `status-validacao.json`, `fatos-check.json`, `fatos-sem-evidencia.json`, `entrega-completa.json` e `entrega-sem-evidencia.json`. Logs das verificações em `/tmp/metodo-pacote2/`. São artefatos temporários da sessão, não arquivos versionados.

## Limites e adoção

A checagem valida registros e vínculos declarados. A pesquisa ainda precisa comprovar se a fonte sustenta o fato, se os publicadores são independentes e se a formulação preserva ressalvas; a revisão visual precisa conferir os fatos mostrados nas imagens. Não foram validados fornecedores pagos ou publicações reais no YouTube/TikTok.

Projetos existentes continuam disponíveis para prévia. Para publicar, precisam preencher `fontes.json` e gerar uma entrega correspondente às entradas atuais. O procedimento está em [`fontes-factuais.md`](fontes-factuais.md). Não houve migração automática nem alteração da pesquisa de projetos existentes.
