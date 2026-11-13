# Recuperação do estúdio

## Quando o estúdio devolver um erro
Vale em qualquer momento, não só na primeira vez. O estúdio mostra a causa, "O que fazer", um código curto da falha (`ffmpeg-falhou`, `ffmpeg-quadros`, `voz-eleven-cota`, `navegador-nao-abre`...) e o botão **Copiar diagnóstico**. Ele já se corrige sozinho nas falhas de ambiente (FFmpeg, navegador, alinhador de voz, pasta curta, arquivo travado, porta, pouco 3D) e avisa numa linha "ajustei ... e continuei": isso não é erro e você não refaz.

**1. Comece pela mensagem ou pelo código da falha.** Se o projeto tem relatório, rode `node scripts/resumir-relatorio.mjs <projeto>`. O resumo mostra etapas, contagens e uma amostra das falhas.

Para conferir todas as falhas, use `--campo=falhas`. Para avisos, use `--campo=avisos --filtro=<termo>`. Para áudio, selecione `--campo=audio` ou o subcampo necessário. Abra `projetos/<nome>/saida/relatorio.json` se o recorte não explicar o problema.

Se a tentativa atual não gerou relatório, comece pela saída do comando atual ou pelo diagnóstico do estúdio. Use `npm run doctor` para falha de ambiente e `npm run verificar` para suspeita de integridade do kit.

**2. Lista segura: só estas correções.**
1. Repetir o passo. O estúdio reaproveita narração, trilha e quadros já feitos, sem gastar crédito.
2. Reinstalar um componente do kit com o comando oficial: `bash ferramentas/instalador/bootstrap-unix --assistente` (Mac e Linux) ou o do Windows no Passo 0. Ele também troca um FFmpeg problemático pelo do kit.
3. Trocar uma configuração do estúdio pelo estúdio web ou pelos comandos oficiais. Ex.: `"encoder": "x264"` no `ilustrando.config.json`; a voz em Começar > Voz.
4. Erro de caminho: usar uma pasta curta. Mover a pasta do estúdio para a pasta pessoal, com nome curto, fora de Downloads e do OneDrive.
5. Rodar `npm run verificar` e `npm run doctor`.
6. Voz da ElevenLabs bloqueada (`voz-eleven-bloqueio`, "unusual activity"): não é chave errada nem defeito do estúdio. Confira com `npm run voz -- --conferir` (ou o botão Testar minha chave, em Começar > Voz), explique a trava em uma frase e siga o vídeo com `--voz=mock` se a pessoa quiser ver o resultado já; a narração entra depois, quando a conta liberar.

**3. Nunca:**
- editar `src/`, `ferramentas/` ou qualquer código do kit sem necessidade (prefira os comandos oficiais);
- baixar outro FFmpeg ou Node por conta própria, nem mexer no PATH do sistema;
- gastar crédito pago (ElevenLabs, Fish Audio) sem perguntar antes: nada de `--refazer-voz` nem de apagar `narracao.mp3` ou `palavras.json` para "tentar de novo";
- pedir chave no chat.

**4. Duas tentativas, no máximo.** Se não resolver, pare e diga, em uma frase, o que tentou. Peça à pessoa para clicar em **Copiar diagnóstico** e depois em **Abrir o direct** (direct do Instagram @kaueajure, https://ig.me/m/kaueajure) e colar lá. Não invente texto de suporte com hipótese técnica: repita o que o estúdio disse.

O aviso do doctor "nenhum assistente encontrado no Terminal" não é erro: só quer dizer que o comando `claude` ou `codex` não está no Terminal. Quem usa o app do Claude ou do Codex não precisa fazer nada.
