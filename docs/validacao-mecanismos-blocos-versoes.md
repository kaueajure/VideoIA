# Validação: mecanismos, voz por frases e comparação

Pacote aplicado em 11/11/2026. Escopo: itens 1, 2 e 4 solicitados. Sem alterar os cinco repositórios de referência, a voz da página ou as credenciais. Sem chamadas a serviços pagos e sem publicação externa.

## O que mudou

- `engine/mecanismos.js` e `engine/recursos-visuais.js`: dois diagramas explicativos determinísticos (fases da Lua e reflexão da luz), validados e editáveis pelo seletor de cena. Exemplo completo em `docs/exemplos/fases-da-lua-mecanismo/`.
- `narracao/blocos.mjs` e `narracao/index.mjs`: cache por frase, identidade da voz/modelo, montagem por amostras PCM, alinhamento por bloco e recuperação após falha. A compatibilidade com cache integral e voz importada permanece.
- `versoes.mjs`, entrega, rotas e `versoes-ui.js`: cópias independentes do render, entradas e QA; comparação por cena, parâmetros globais, arquivos e novos/resolvidos no QA. Sincronização relativa à cena.

## Piloto visual observado

Mesma narração local eSpeak pt-br, mesmo roteiro de 44 palavras, mesmas quatro cenas e requisitos: 1080 × 1920, 30 fps, 506 quadros, aproximadamente 16,87 s. A renderização usa escala interna .5 e saída no tamanho final, como os pilotos anteriores. Nenhuma imagem gerada, biblioteca ou serviço externo foi necessário.

Foram substituídas três cenas; o convite final foi preservado. A segunda renderização reaproveitou 102 quadros e desenhou 404. Os dois MP4 passaram sem falhas no QA do arquivo. Antes: três avisos de arquivo; depois: dois. Desapareceu o aviso agregado de imagem parada em 77% do vídeo; permaneceram dois avisos de trechos parados. O QA da cena continuou com três avisos nos dois casos. Isso não demonstra superioridade artística ou factual automaticamente.

A folha de contato foi inspecionada. A primeira versão revelou proximidade entre o rótulo da vista da Terra e a nota de escala; a posição e o raio foram corrigidos antes do render final. Diagramas são acelerados e fora de escala, sem eclipses. O modelo da Terra é ilustrativo. O vínculo com as fontes do exemplo permanece, mas exige revisão semântica.

Artefatos locais desta execução: `/tmp/metodo-evolucao4/piloto/saida/antes.mp4`, `depois.mp4`, `folha-depois.jpg` e `validacao.json`. O histórico correspondente está em `/tmp/metodo-evolucao4/piloto/versoes/`.

A comparação também carregou os dois MP4 reais por HTTP Range, com 16,866667 s em cada player, em Chrome headless isolado. O Chromium empacotado não ofereceu decodificador H.264/AAC (`no supported streams`); o mesmo teste passou com o Chrome do sistema, usando perfil temporário de teste, sem controlar o navegador da pessoa. A falha inicial foi de codecs do ambiente, não do MP4 ou da rota. Registro: `/tmp/metodo-evolucao4/interface-real.json`.

## Voz observada

Além dos testes com PCM e provedor simulado, uma execução com síntese local real eSpeak gerou as quatro frases do roteiro. Ao trocar “refletida na superfície” por “refletida pela superfície”, foi sintetizada uma frase e reaproveitadas três, com os mesmos hashes de áudio. Duração: 15,4302 s antes e 15,5520 s depois. Nenhum parâmetro da voz da página foi modificado. Áudios e registro em `/tmp/metodo-evolucao4/voz-local/`.

O teste da integração ElevenLabs substitui o transporte HTTP por respostas locais com áudio e tempos por caractere. Exercita correção de frase, envio de contexto e restauração do manifesto ao voltar ao roteiro anterior. Não valida qualidade, custo real ou continuidade expressiva de ElevenLabs/Fish. As junções da voz comercial ainda exigem escuta. Sem Whisper, o alinhador por pausas continua aproximado.

## Revisão e testes

A revisão independente identificou e confirmou a correção de três problemas: confiança de alinhamento intermediária descartada, manifesto obsoleto ao restaurar cache integral e cena classificada como preservada após mudança global de cor. Os testes cobrem esses casos, retomada da voz, integridade de cache, amostras exatas após montagem/MP3, tags, divisão, modelo da iluminação, pixels determinísticos, preservação de arquivos, deduplicação, cenas novas/removidas, rejeição de symlinks, HTTP Range e sincronização relativa em 360 e 1280 px.

Limites: o histórico começa com as próximas entregas, ocupa disco e não inclui todos os ativos para reconstrução. O QA não comprova o sentido do diagrama nem que uma versão seja preferível. A regressão selecionada passou com 105 testes (incluindo áudio, render, edição, pesquisa, fontes e interfaces), em 280,77 s. Após incluir a preservação dos arquivos reais da coleta/revisão semântica, o reteste de histórico, HTTP/interface e entrega passou com 9 testes, incluindo um caso novo. São 106 casos distintos verificados neste pacote. Logs: `/tmp/metodo-evolucao4/regressao.log` e `reteste-historico.log`. Não foi executada a suíte completa de todos os recursos do produto.
