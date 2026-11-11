# Validação: edição por cena, direção e pesquisa

Executada em 11/11/2026, sobre a árvore local, preservando os pacotes anteriores e as mudanças que já estavam no workspace. Nenhuma dependência foi adicionada. Os outros cinco repositórios permaneceram sem alterações.

## Entregas verificáveis

| Frente | Implementação | Uso |
|---|---|---|
| Correção localizada | Edição com revisão da versão, histórico, desfazer validado, corte entre cenas e preservação do áudio | Meus vídeos → Corrigir cenas; [guia](edicao-e-direcao.md) |
| Direção visual | Revelação por linha, sequências horizontais, proposta de ritmo preservando conteúdo e gatilhos por palavra | Aplicar ritmo sugerido; [recursos](cena/recursos-visuais.md) |
| Pesquisa assistida | Buscas por alegação e evidência contrária, coleta HTTPS, cache, revisão vinculada ao texto, conferência de citações e integração à entrega | Fontes e pendências → Pesquisar afirmações com o assistente; [guia](pesquisa-assistida.md) |

A extensão de direção preserva integralmente as funções de pesquisa visual que já existiam no módulo. Durante a revisão foram corrigidos uma incompatibilidade de exports, entradas que ficariam fora da cena, recuperação de lock órfão e restauração de histórico inválido. A edição repetida também revelou um vazamento de listeners no lock compartilhado; sua liberação agora remove o handler registrado.

## Testes

A bateria selecionada passou com **138 testes, zero falhas**, abrangendo os pacotes anteriores e as três frentes novas. Foram conferidos edição, corte, cache, áudio preservado, conflitos, histórico corrompido, lock órfão, vazamento de listeners, caminhos e symlinks, extração textual, endereços privados, revisão vencida/adulterada, citações ausentes, bloqueios de publicação e os fluxos de plataforma com rede simulada.

Comando da bateria:

```sh
node --test test/edicao-cena.test.mjs test/pesquisa-assistida.test.mjs test/evolucao-http.test.mjs test/cenas-ui-browser.test.mjs test/direcao-render.test.mjs test/fontes-factuais.test.mjs test/fontes-entrega.test.mjs test/fontes-ui.test.mjs test/youtube.test.mjs test/tiktok.test.mjs test/youtube-ui.test.mjs test/tiktok-ui.test.mjs test/storyboard.test.mjs test/preparacao-video.test.mjs test/protecao-storyboard.test.mjs test/cache-legenda-render.test.mjs test/recursos-visuais.test.mjs test/relatorio-recursos-ui.test.mjs test/ia-estudio.test.mjs
```

Uma execução independente com a suíte do estúdio reproduziu a falha preexistente do teste de limite de computadores da licença. Não há afirmação de que `npm test` completo passe.

Verificações complementares: sintaxe de 18 módulos e dos quatro scripts embutidos das páginas alteradas; `git diff --check`; sincronização das skills. O teste HTTP usa o servidor real e confirma token obrigatório, conflito 409 e desfazer. A interface foi exercitada em Chromium isolado, em 1280 e 360 px: salvar, salvar sem mudanças mantendo Desfazer, restaurar e preservar rascunho após conflito; sem vazamento horizontal. As novas composições foram renderizadas nos dois formatos e conferidas em ordem e fora de ordem, sem cortes de texto nas amostras testadas.

## MP4 real e reaproveitamento

Um piloto isolado reaproveitou a narração local de teste do pacote anterior, sem mudar a voz configurada da página. Depois de aplicar a composição horizontal à cena `luz`, o motor reaproveitou **364 dos 506 quadros** e renderizou novamente **142**. Os hashes do áudio e de `palavras.json` permaneceram iguais. O MP4 final passou no QA sem falhas; três avisos de ritmo/trechos estáticos permaneceram. A entrega factual continuou aprovada e publicável.

Esse ensaio comprova correção localizada e reaproveitamento. Ele não comprova melhoria universal da qualidade editorial. As outras cenas do piloto foram preservadas; ainda precisam de direção mais rica caso o objetivo seja um vídeo de produção.

## Coleta real e citação adulterada

O coletor consultou duas páginas da NASA: Moon Phases e Top Moon Questions, guardando texto, data e SHA-256. A coleta, sozinha, ficou inconclusiva. Após revisão explícita das três afirmações e dos trechos, a checagem passou. Substituir a citação de `f-luz` por uma frase ausente da fonte bloqueou essa afirmação e identificou `t-2` e a cena `luz`.

As páginas são da mesma instituição e não foram tratadas como publicadores independentes. O ensaio usou alegações não quantitativas; não demonstra pesquisa independente de números. A revisão legítima foi restaurada depois do teste. Nenhuma publicação foi realizada.

## Artefatos e limites

Artefatos temporários em `/tmp/metodo-evolucao3/`: logs de testes, capturas de interface, `piloto/saida/{antes.mp4,depois.mp4,validacao.json,qa/folha.jpg}` e `pesquisa-real-completa/saida/validacao.json`. São arquivos da sessão, não versionados.

Não foram chamados provedores pagos de voz/LLM nem executadas publicações reais. A integração com o assistente foi verificada por contexto/prompt e rotas, sem iniciar uma sessão de pesquisa paga. A descoberta de fontes depende das ferramentas de navegação disponíveis no assistente conectado. PDF e páginas dinâmicas podem exigir uma fonte textual alternativa. O método verifica citações e versões, mas a equivalência semântica e a independência editorial continuam sendo avaliações do pesquisador.

A edição direta modifica texto visual e cortes; não há síntese de narração por cena nos provedores atuais. Alterar a fala exige áudio e alinhamento compatíveis. A prévia continua disponível, mas qualquer alteração exige uma entrega nova antes de publicar.
