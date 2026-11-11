# Validação da instalação das skills sociais

Executada em 11/11/2026. Quatro adaptadores locais registrados no Claude Code e no Codex: `social-captions`, `viral-captions-and-ctas`, `viral-short-form` e `social-content`. O catálogo do projeto passou de 12 para 16 skills. Contrato, origens, commits e uso: [skills-sociais.md](skills-sociais.md).

## Integração aplicada

`pauta`, `roteiro`, `publicar`, `youtube` e as instruções do projeto agora apontam para as skills pertinentes. O prompt do chat do estúdio também aplica esse roteamento. Pesquisa factual e correção visual continuam com seus escopos; o ramo de YouTube permanece exclusivo para seu pacote. Os textos em português, o registro factual, as escolhas anteriores e o schema existente de youtube.json prevalecem sobre fórmulas externas.

O material original foi instalado com o helper skill-installer em staging e incorporado ao projeto com referências e licenças MIT. As duas referências Vyral preexistentes foram preservadas; `viral-captions-and-ctas` era byte a byte igual à versão fixada. A skill atual de Corey usa o nome upstream `social`; o adaptador conserva `social-content` solicitado. Os 37 arquivos das quatro origens foram conferidos contra os hashes de `_terceiros/skills-sociais.lock.json`.

## Verificações observadas

- As quatro entradas locais passaram no quick_validate da skill-creator.
- `npm run sincronizar -- --conferir`: 16 skills e AGENTS.md em sincronia. AGENTS.md: 15.978 bytes, abaixo do limite local de 16 KiB.
- `node --test test/assistentes.test.mjs test/ia-estudio.test.mjs test/evolucao-http.test.mjs test/youtube.test.mjs`: 39 testes passaram, zero falhas.
- Sintaxe de `src/estudio/assistentes.mjs` e `git diff --check` passaram.
- Os cinco repositórios de referência permaneceram limpos.

## Ensaio comportamental

Um agente independente recebeu as quatro skills e apenas o exemplo bruto de fases da Lua, com pedido de legendas para Instagram/Facebook/TikTok/YouTube em português, diagnóstico do roteiro sem alterar a fala e três reaproveitamentos sem agendamento. Produziu somente arquivos temporários:

- `/tmp/metodo-skills-sociais/ensaio/projetos/lua/post.md`
- `/tmp/metodo-skills-sociais/ensaio/projetos/lua/youtube.json`
- `/tmp/metodo-skills-sociais/ensaio/projetos/lua/revisao-roteiro.md`
- `/tmp/metodo-skills-sociais/ensaio/projetos/lua/plano-social.md`

A conferência independente validou as nove combinações de três títulos e três descrições no validador de metadados já usado pelo envio. Tags do Studio estavam presentes, separadas das hashtags, e o pacote continha #Shorts. Roteiro, fontes e cena permaneceram idênticos aos originais. Não foi criado entrega.json, áudio ou render. Os textos permaneceram rascunhos e preservaram a distinção entre fases e eclipses.

A checagem estrutural do roteiro do exemplo passou. A checagem de vídeo não passou porque faltavam palavras e intervalos de cena, como esperado num ensaio só de textos. O linter editorial padrão deu 43/100 ao exemplo de 44 palavras; o diagnóstico não inventou números ou ampliou a fala para satisfazer a rubrica. Isso é limitação do exemplo para produção, não falha da instalação. Relatórios em `/tmp/metodo-skills-sociais/ensaio/verificacao-fluxo.json` e `/tmp/metodo-skills-sociais/validacao-artefatos.json`.

A revisão apontou uma ambiguidade anterior em `publicar`: a orientação de renderizar novamente diante de pendência podia ampliar um pedido só de texto. Ela foi corrigida: rascunhos registram pendências; voz/render e nova entrega pertencem à etapa de liberação do vídeo, dentro do pedido autorizado.

## Limites

O ensaio verifica uso das instruções e compatibilidade dos arquivos, não aumento de alcance, viralização ou qualidade de todo texto futuro. Não houve nova pesquisa astronômica externa; o ensaio usou as evidências já fornecidas no exemplo. Não foram validados algoritmos de redes ou percentuais de desempenho das referências. Nenhuma API paga, conexão social, upload ou agendamento foi executado. O fluxo depende do assistente conectado ler as skills; o motor de renderização não gera legendas de publicação sozinho.
