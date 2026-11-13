

# Cena: estilos smooth

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `smooth` | `forma`: `numero`, `codigo`, `botao`, `checkout`, `lista`, `grade`, `relogio`, `calendario`, `chat`, `barras`, `grafico`, `curva`, `fluxo`, `pessoas`, `notificacao`, `comparacao`, `foto`, `frase`, `icone`, `cta`, `traco`, `titulo`, `selo`, `tipo`; `chave` (a palavra em que a cena age), `fundo`, `troca` (corte, cortina, zoom, whip, sobe), `legenda`; campos por forma em `docs/estilo-smooth.md`. Na cena: `tom` (alterna, escuro, claro). Vale nos 6 irmãos smooth; no `numero`, `layout` (`mostrador`, `cartao`, `barra`, `orbita`) |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `smooth`, `smooth-produto`, `smooth-estrategia`, `smooth-historia`, `smooth-vinheta`, `smooth-tipografia` | Smooth (porte do Fluido): motion design com fluidez de After Effects. Interface de verdade como personagem (vidro, botão e mão, checkout, notificação, gráfico), número que conta, fala palavra por palavra saindo do desfoque, câmera com motivo (pico na palavra, sem salto), três camadas de profundidade, uma cor de destaque (a da marca), gelo e breu alternando. Os irmãos portam os modelos produto, estratégia, história (foto real), vinheta (papel e serifa) e tipografia (brutalista). Guia: `docs/estilo-smooth.md` |

## Estilos smooth (motion de After Effects: smooth, smooth-produto, smooth-estrategia, smooth-historia, smooth-vinheta, smooth-tipografia)
Leia `docs/estilo-smooth.md`. `"estilo": "<id>"` e `"tom": "alterna" | "escuro" | "claro"` na cena; cada beat tem **um** elemento `{ "tipo": "smooth", "forma": ..., "chave": "<palavra dita>" }` (mais a `imagem` de quem é citado, na forma `foto`). Cada frase com um desenho que a explique; a mesma composição no máximo 2 vezes no vídeo e nunca em cenas seguidas (o verificador reprova). No `numero`, `layout`: `mostrador`, `cartao`, `barra` ou `orbita` (sem ele, rodízio).
- **Uma cena por frase, com um gráfico além do texto:** número que conta (`numero`, `relogio` com a fonte), código QR ou de barras (`codigo`), botão com a mão (`botao`), checkout (`checkout`), passos (`lista`), grade de pontos ou pessoas ("3 em 10"), calendário, conversa, barras de uma conta, curva que cresce, fluxo de custo, comparação, frase de virada e o `cta`. Vizinhas nunca repetem.
- **A fala entra na tela palavra por palavra** (até ~84 letras; aí a legenda some); fala maior vai na legenda de uma linha. Números e rótulos do cena.json são fatos: só o que está em `fontes.md`.
- **Troca de beat:** `"troca": "corte"` (padrão, a câmera atravessa o corte), `cortina` (painel na cor da marca, no fecho), `zoom`, `whip`, `sobe`. Nunca clarão branco. Ano com `"ano": true` (1994, não 1.994).






## Dados e gráficos

`barras` usa larguras proporcionais aos valores, com origem em zero e rótulos fora do preenchimento. Valores negativos não são suportados. `curva` e `grafico` exigem `valores` explícitos, com pelo menos dois números finitos; `grafico` não aceita negativos. O planejador não cria séries apenas porque a fala menciona crescimento ou queda. Registre a evidência dos dados em fontes.json; números preenchidos não são prova de origem.
