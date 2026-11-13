

# Mapa do estúdio

O que é cada pasta e cada arquivo desta pasta, em duas colunas: o que significa para você e o que o assistente (Claude Code ou Codex) faz com ele. A regra de ouro está na última coluna: **seu** quer dizer que é seu e nenhuma atualização mexe; **kit** quer dizer que veio de fábrica e a atualização pode trocar; **protegido** quer dizer que é o motor e não deve ser editado.

## Na raiz

| Arquivo | Para você | Para o assistente | De quem |
|---|---|---|---|
| `COMECE-AQUI.pdf` e `.md` | os primeiros passos | não precisa ler | kit |
| `Instalar (Linux).sh`, `Instalar (Mac).command` e `Instalar (Windows).cmd` | **instala o que falta** (Node, npm, Git, FFmpeg, navegador, alinhador Whisper) e abre o estúdio | pede para a pessoa usar quando o doctor acusar falta de programa | kit |
| `Iniciar` (somente do sistema instalado, gerado ao terminar a instalação) | abre o estúdio no navegador (voz, marca, meus vídeos, atualizar) | `npm run estudio -- --abrir` faz o mesmo | kit |
| `LEIA-ME.md` | visão geral e comandos | referência rápida | kit |
| `MAPA.md` | este mapa | onde fica cada coisa e o que pode editar | kit |
| `LICENSE` | licença MIT do estúdio open-source | não muda nada no trabalho | kit |
| `VERSAO` | a versão instalada (ex.: 0.4.0) | conferir antes de atualizar | kit |
| `CHANGELOG.md` | o que mudou em cada versão | ler depois de atualizar | kit |
| `CLAUDE.md` | as regras do estúdio para o Claude Code | lido no começo de toda conversa | kit |
| `AGENTS.md` | as mesmas regras para o Codex | lido no começo de toda conversa | kit |
| `ilustrando.config.json` | voz padrão, estilo e objetivo da página (`estiloPadrao`, `objetivoPadrao`; o antigo `modeloPadrao` continua valendo), CTA final, música (`trilha`: `clima` e a ordem das fontes de trilha, `ordem`; veja `docs/trilhas.md`) e efeitos (`sfx`: `suave`, `normal` ou `nenhum`), linha editorial em política (`linhaEditorial`) | lê e ajusta quando você pede (`npm run linha`, `npm run modelos -- --padrao <id>`) | seu |
| `.env.exemplo` | modelo do arquivo de chaves | nunca pede a chave no chat | kit |
| `.env` | **suas chaves de voz** (você cria a partir do modelo) | nunca lê em voz alta nem mostra | seu |
| `package.json` e `package-lock.json` | lista travada das peças que o `npm install` baixa | não editar | kit |
| `MANIFESTO.json` e `MANIFESTO.assinatura` | a lista de fábrica de cada arquivo com a impressão digital (SHA-256), assinada por nós | `npm run verificar` compara a pasta com ela | kit |
| `AVISOS-TERCEIROS.md` | licenças dos componentes de terceiros | não precisa ler | kit |
| `.gitignore` | o que nunca vai para o Git (chaves, saídas, cache) | não editar | kit |

## Pastas

| Pasta | Para você | Para o assistente | De quem |
|---|---|---|---|
| `projetos/` | **seus vídeos**, um por pasta (`roteiro.md`, `cena.json`, `fontes.md`, `assets/` com fotos, logos e modelos 3D `.glb` CC0, `assets/referencias/` com fotos que você anexou para a IA encaixar no roteiro (índice em `referencias.md`), `pecas.js` com as peças 3D e cenários criados para aquele vídeo, e a pasta `saida/` com o MP4, o `relatorio.json` e as faixas de som separadas `voz.wav`, `trilha.wav` e `sfx.wav`). `projetos/.trilhas-recentes.json` guarda as últimas trilhas, para o QA avisar quando uma repete. Vêm prontos `exemplo/` (o vídeo de teste) e `exemplo-estilo-<nome>/` (um por estilo de motion, para copiar) | cria e edita aqui; peça ou cenário que não existe nasce no `pecas.js` do projeto; fotos de `assets/referencias/` entram uma vez no beat certo | seu |
| `carrosseis/` | **seus carrosséis**, um por pasta (`carrossel.json`, `assets/` com as fotos e `slides/` com os PNGs). Vêm 28 exemplos prontos, um por tipo de slide (lista em `docs/carrossel-templates.md`) | cria e edita aqui | seu |
| `marca/` | **sua marca**: `tokens.json` (nome, @, cores), `logo/` e `saida/` (avatar, banners) | troca só pela skill `marca` (`npm run marca`) | seu |
| `marcas/` | a **biblioteca de logos e bandeiras** pronta (`indice.json` com id, área, apelidos, cor, fonte, licença e autor; `logos/`, `glifos/`, `bandeiras/`). Lista e regra de uso em `docs/marcas.md` | usa pelo id nos elementos `logo` e `bandeira` da cena e nos slides; procura com `node scripts/marcas.mjs <termo>` | kit |
| `modelos/` | a **base de fábrica** das fichas de estilo e objetivo (31 JSON: os 12 objetivos de sempre, como curiosidades, aula e notícia, e as fichas dos 19 estilos de motion), e o `LEIA-ME.md` com os campos. O nome "modelo" é antigo: hoje cada vídeo tem um **estilo** (aparência) e um **objetivo** (o que ele quer ser) | lê antes da pauta e do roteiro; o linter e o plano automático usam | kit |
| `objetivos/` | os **objetivos novos** de fábrica (`venda`, `tutorial`), no mesmo formato | lê antes da pauta e do roteiro | kit |
| `estilos/meus/`, `objetivos/meus/` | **seus estilos e objetivos** (criados com `npm run estilos -- --novo <id> --base <id>` ou `npm run objetivos -- --novo ...`); vencem os de fábrica com o mesmo nome | cria e ajusta quando você pede | seu |
| `modelos/meus/` | seus modelos do tempo antigo: continuam valendo (viram objetivo, ou estilo se o nome for de um estilo) e a atualização faz uma cópia em `objetivos/meus/` ou `estilos/meus/` | nunca apaga | seu |
| `biblioteca/` | as **peças 3D que o estúdio guarda para reusar**: `pecas/` é a sua (criada nos seus vídeos ou promovida) e `fabrica/pecas/` vem no kit; cada peça tem `peca.js`, `ficha.json`, `mini.jpg` e `teste.json` | busca antes de criar (`node scripts/biblioteca.mjs buscar "<conceito>"`), registra peça boa com `registrar`, fixa a versão com `usar`; ver `biblioteca/LEIA-ME.md` | seu (e kit na `fabrica/`) |
| `guias/` | os 6 guias em PDF (instalação, páginas, identidade, rotina, monetização, perguntas) | consulta quando você tem dúvida | kit |
| `templates/` | identidades prontas, calendário de postagem e modelos de legenda | usa como ponto de partida | kit |
| `docs/` | o método escrito: formatos, ganchos, padrões virais, voz, design, templates de carrossel (`carrossel-templates.md`), um guia por estilo de vídeo (`estilo-<nome>.md`) | consulta as referências indicadas para a etapa atual | kit |
| `.claude/skills/` | o passo a passo de cada tarefa (pauta, roteiro, vídeo, carrossel, publicar...) | segue a skill da tarefa | kit |
| `.agents/skills/` | cópia das skills para o Codex (gerada, não edite) | o Codex segue estas | kit |
| `.codex/` | configuração do Codex só para esta pasta | carregada quando a pasta é confiável | kit |
| `src/` | **o motor** do estúdio (vídeo, carrossel). No pacote vai protegido | roda pelos comandos; não edita | protegido |
| `scripts/` | comandos de manutenção: marca, sincronizar, verificar, atualizar, buscar foto (`buscar-imagem.mjs`) e trecho de vídeo de licença livre (`buscar-broll.mjs`), folha de contato do carrossel (`folha-carrossel.mjs`), foto em pontos e folha dos pontos (`imagem-para-pontos.mjs`, `folha-pontos.mjs`), linha editorial, modelos de vídeo (`modelos.mjs`) | roda pelos comandos `npm run ...` e `node scripts/...` | kit |
| `fontes/` | as fontes da marca (Inter Tight) e as dos estilos (Bricolage Grotesque, Instrument Serif, JetBrains Mono, Poppins, Antonio, Roboto, Euphoria Script) | o motor usa | kit |
| `ferramentas/` | o instalador de um clique (`instalador/`), o alinhador de voz sem Python (`alinhar-voz.mjs`, `alinhador/`), o atalho `rodar` (Node portátil para o assistente) e o extra opcional em Python (`transcrever.py`) | `ferramentas/rodar <comando>` quando `node` não existe no terminal | kit |
| `.programas/` | os programas portáteis que o instalador baixou (Node, FFmpeg, alinhador de voz). Fica só no seu computador | usa pelo `ferramentas/rodar`; não edita | gerada |
| `test/` | testes automáticos (`npm test`) | roda para conferir se está tudo bem | kit |
| `node_modules/` | peças baixadas pelo `npm install` (não vem no zip) | não mexe | gerada |
| `.atualizacao/` | cópia de segurança da versão anterior, criada pelo `npm run atualizar` | usa para desfazer | seu |

## Comandos de manutenção

| Comando | O que faz |
|---|---|
| `npm run doctor` | confere os programas (Node, FFmpeg, Chromium), as chaves e o motor |
| `npm run verificar` | compara cada arquivo com a lista de fábrica e diz, em português, o que mudou. `-- --completo` também roda o doctor e os testes |
| `npm run estudio -- --abrir` | abre o estúdio web (o mesmo que "Abrir Estúdio"): voz, marca, vídeo de teste, meus vídeos, atualizar |
| `npm run atualizar -- <zip>` | instala uma versão nova sem tocar em `projetos/`, `marca/`, `carrosseis/`, `.env` e no que você criou. `-- --simular` só mostra; `-- --desfazer` volta |
| `npm run estilos` / `npm run objetivos` | listam os estilos e os objetivos. `-- --ver <id>` mostra um; `-- --padrao <id>` grava o da página; `-- --novo <id> --base <id>` cria o seu em `estilos/meus/` ou `objetivos/meus/`; `-- --validar` confere todos. `npm run modelos` continua funcionando como apelido |
| `npm test` | testes automáticos do estúdio |

## Comandos do estúdio

```bash
node src/video/cli.mjs <projeto> --voz=mock|elevenlabs|fishaudio|arquivo [--estilo=<id>] [--objetivo=<id>] [--rapido] [--guias] [--sem-render] [--foto=12.5] [--sem-musica] [--horizontal]
node src/video/cli.mjs --status          # estado de todos os projetos e próximo passo de cada um
node src/video/cli.mjs --doctor          # confere Node, FFmpeg, Chromium, WebGL, fontes e chaves
node src/video/cli.mjs <projeto> --sem-lint   # ignora o linter de roteiro (não recomendado)
npm test                                 # testes do motor
node src/carrossel.mjs <nome>            # carrossel em PNG
node src/identidade.mjs                  # logo, avatar da foto de perfil e banners (marca/saida)
npm run verificar                        # arquivos iguais aos de fábrica? (só lê, não muda nada)
npm run estudio -- --abrir               # estúdio web: voz (chave direto no .env), marca, vídeos
npm run atualizar -- <zip>               # versão nova sem tocar em projetos/, carrosseis/, marca/ e .env (a pessoa usa o estúdio web, Atualizar)
bash ferramentas/instalador/bootstrap-unix --assistente   # instala o que falta, com o Node; Windows: ver skill `comece`, Passo 0
node scripts/buscar-imagem.mjs <projeto> "<termo>" [--logo] [--listar] [--id=ID|--escolha=N]   # foto ou logo de licença livre, registrada em fontes.md
node scripts/buscar-broll.mjs <projeto> "<termo>" [--fonte=…] [--listar] [--escolha=N]   # b-roll em vídeo livre (elemento video), em fontes.md
node src/video/cli.mjs --galeria --projeto=<projeto>   # peças do projeto (projetos/<nome>/pecas.js)
node scripts/imagem-para-pontos.mjs <foto> <saida.json> [--corte x,y,l,a] [--limiar 0.14]   # foto em pontos para o pontilhismo, com prévia .jpg
node scripts/folha-pontos.mjs <projeto> [--mp4]   # folha de contato das formas em pontos
node scripts/resumir-relatorio.mjs <projeto> [--campo=<campo>] [--filtro=<texto>]   # resumo do relatório ou trecho solicitado
node scripts/respiros.mjs <projeto> [--simular] [--refazer]   # pausas na voz depois da pontuação, só no silêncio real
npm run linha -- --ver | npm run linha -- <neutra|esquerda|centro|direita> [leve|moderada]   # linha editorial em política
npm run estilos|objetivos [-- --ver <id> | --padrao [<id>] | --novo <id> --base <id> | --validar]   # estilo e objetivo
```

## Regras para o assistente

- Conteúdo da pessoa vive em `projetos/`, `carrosseis/`, `marca/`, `estilos/meus/`, `objetivos/meus/` e `modelos/meus/`. Nada de arquivo solto na raiz.
- Não edite `src/`, `MANIFESTO.*`, `package*.json` nem `.agents/skills/` (gerada). Mudou uma skill? Edite em `.claude/skills/` e rode `npm run sincronizar`.
- Nunca leia, mostre ou peça o conteúdo de `.env`.
- Nunca peça para a pessoa abrir o Terminal ou digitar comando: instalar é dois cliques em "Instalar"; configurar é no estúdio web.




