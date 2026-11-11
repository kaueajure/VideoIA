# Piloto de evidências: fases da Lua

Exemplo curto para validar os vínculos entre pesquisa, fala e cenas. As três alegações foram conferidas nas páginas da NASA e de Harvard-Smithsonian citadas em `fontes.json`, em 11/11/2026. A pergunta final é editorial. Os textos dos cartões são sínteses, não citações atribuídas às instituições.

Copie `roteiro.md`, `fontes.md`, `fontes.json` e `cena.json` para um projeto novo em `projetos/`. O comando `npm run fontes -- <nome> --exportar` deve aprovar o roteiro. Depois de gerar a voz alinhada, `npm run fontes -- <nome> --video --exportar` deve vincular:

| Afirmação | Trecho | Beat |
|---|---|---|
| `f-fases` | `t-1` | `fases` |
| `f-luz` | `t-2` | `luz` |
| `f-perspectiva` | `t-3` | `perspectiva` |

Para testar a detecção, faça uma cópia do projeto e remova apenas `afirmacoes[id=f-luz].evidencias`. A checagem deve sair com código 1 e apontar `f-luz`, `t-2` e `luz`; a entrega deve registrar `publicavel: false`. A prévia e o MP4 continuam disponíveis. Restaurar a evidência exige gerar uma entrega com a revisão atual.

A validação técnica deste pacote usou voz local eSpeak NG pt-br, alinhamento pelos eventos do sintetizador, FFmpeg/AAC e render do próprio motor a 30 fps, sem chamar provedores pagos ou enviar às redes. Essa voz serve apenas ao teste, sem mudar a voz da página. Este exemplo de 44 palavras não pretende cumprir a extensão editorial de um vídeo de produção nem demonstrar direção astronômica detalhada. Os cartões e as setas são esquemas conceituais; não representam órbitas em escala.
