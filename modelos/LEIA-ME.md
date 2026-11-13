

# Estilos e objetivos (o antigo "modelo de vídeo")

Desde a 0.6.13 cada vídeo tem duas escolhas que se combinam livremente:
- **Estilo**: a aparência (linguagem visual, camadas, ritmo visual mínimo). 24 ao todo: `npm run estilos`.
- **Objetivo**: o que o vídeo quer ser (formato, roteiro, tom, voz, CTA, carrossel, legenda e cuidados). 14 ao todo: `npm run objetivos`.

Exemplo: `Estilo: pontilhismo. Objetivo: venda.` O objetivo decide voz, CTA, legenda, formato e duração; o estilo decide a aparência e o ritmo visual mínimo. Sem estilo, o objetivo usa o estilo que combina com ele. Só o estilo, sem objetivo, usa o jeito de roteiro próprio do estilo (igual ao antigo modelo com o nome do estilo).

Esta pasta guarda a base de fábrica, no mesmo formato de sempre: os 12 objetivos de sempre (`curiosidades.json` é o objetivo `curiosidade`, os outros têm o mesmo nome) e as fichas dos 19 estilos de motion. Os objetivos novos (`venda`, `tutorial`) ficam em `objetivos/`. Os seus ficam em `estilos/meus/` e `objetivos/meus/` (nenhuma atualização mexe) e vencem um de fábrica com o mesmo `id`. O que você criou em `modelos/meus/` continua valendo: vira objetivo (ou estilo, se o nome for de um estilo) e a atualização faz uma cópia no lugar novo, sem apagar o original.

## Como se escolhe
Do mais fraco ao mais forte:
1. `ilustrando.config.json`, campos `estiloPadrao` e `objetivoPadrao` (o estúdio web, em Estilo e objetivo, ou `npm run objetivos -- --padrao <id>`);
2. a linha `STATUS` do `roteiro.md`: `STATUS: ... Estilo: papel. Objetivo: aula. Formato: passo a passo.`;
3. `--estilo=<id>` e `--objetivo=<id>` no comando do vídeo;
4. o `cena.json`: o que estiver escrito no beat ou na cena sempre vence.

Os nomes antigos continuam valendo, com o mesmo resultado de antes: `modeloPadrao` no config, `Modelo: <id>` no STATUS e `--modelo=<id>` no comando. A ficha só preenche o que está vazio. Nunca apaga escolha explícita.

## Comandos
```bash
npm run estilos                                    # lista os estilos (* = o padrão da página)
npm run objetivos                                  # lista os objetivos
npm run objetivos -- --ver aula                    # mostra um em português (estilos: npm run estilos -- --ver <id>)
npm run objetivos -- --padrao receita              # grava o objetivo padrão da página
npm run estilos -- --padrao papel                  # grava o estilo padrão da página
npm run objetivos -- --novo clinica --base negocio # cria o seu em objetivos/meus/clinica.json
npm run objetivos -- --validar                     # confere todas as fichas
```
`npm run modelos` continua funcionando como apelido.

## Campos
Todos opcionais, exceto `id` (igual ao nome do arquivo, só `[a-z0-9-]`), `nome` e `versao`.

| Campo | O que é | Quem usa |
|---|---|---|
| `paraQuem`, `exemplosDePedido`, `apelidos` | para quem serve, pedidos típicos e outros nomes aceitos (ex.: `negocio-local` para `negocio`) | `npm run estilos`, `npm run objetivos`, skills `comece` e `pauta` |
| `formato.preferidos`, `proibidos`, `padrao` | entre os 8 formatos de `docs/formatos.md` (`revelacao`, `mito-fato`, `comparativo`, `antes-depois`, `ranking`, `numero-impossivel`, `passo-a-passo`, `causa-efeito`) | skills `pauta` e `roteiro` |
| `roteiro.palavras`, `alvoSegundos` | faixa do texto e da fala. Com `[150, 230]` o linter usa os limites de sempre (benchmark dos virais); com outra faixa, avisa fora dela (acima do máximo é só sugestão, sem teto de duração desde a 0.6.42) e reprova abaixo de 80% do mínimo | linter e skill `roteiro` |
| `roteiro.estrutura` | blocos em ordem (`bloco`, `seg`, `n`, `instrucao`, `texto`, `obrigatorio`) | skill `roteiro` |
| `roteiro.gatilhos` | 1 a 3 dos 9 gatilhos de `docs/ganchos.md` | skill `roteiro` |
| `roteiro.abertura3Tempos`, `promessaMarca`, `loopAberto` | se a abertura em 3 tempos vale, qual promessa dizer e se há loop aberto | linter e skill `roteiro` |
| `roteiro.reHookPct`, `alfinetadas`, `pessoa`, `tom`, `vocabulario` | posição do re-hook, mínimo e máximo de alfinetadas, tratamento e tom de voz do texto | skill `roteiro` |
| `roteiro.proibir` | expressões que o linter reprova | linter |
| `voz.velocidade`, `direcao`, `pausaEntreBlocos` | ritmo e marcação de voz da primeira linha (ex.: `[calm, clear]`) | skill `roteiro` |
| `visual.estilo`, `efeitos`, `transicao` | acabamento quando a cena não define | plano automático e compilador |
| `visual.cenarios` | cenários preferidos; o primeiro é o do plano automático (`palco` = o de sempre) | plano automático e skill `cena` |
| `visual.cenas`, `pecasBase` | cenas compostas e peças sugeridas | skill `cena` |
| `visual.reserva` | peças que o plano automático usa quando a frase não sugere nenhuma (sem o campo: formas geométricas) | plano automático |
| `visual.camera`, `titulos`, `contador`, `imagens`, `pecasPorTema` | câmera (`padrao`, `revelar`, `numero`), títulos (`nenhum`, `gancho`, `por-etapa`), contador, fotos reais | plano automático e skill `cena` |
| `ritmo.beatSeg`, `trocaVisualMaxSeg`, `beatsMax` | duração dos beats e limite de beats (só avisa) | plano automático e validador da cena |
| `som.musica`, `sfx` | se o tipo de página pede trilha e a intensidade dos efeitos; `"sfx": "nenhum"` desliga os efeitos no motor (o nível vem do `sfx` do config) | skill `video` e motor |
| `cta.tipo`, `texto`, `palavra`, `perguntaFinal` (e `endereco`, `whatsapp`, `horario`) | convite final: `comentar` usa o `cta` do config; `salvar`, `compartilhar`, `visitar`, `link` e `seguir` usam o texto do objetivo; `CTA: simples` no STATUS dispensa | linter e skills `roteiro`, `carrossel`, `publicar` |
| `carrossel.sequencia`, `slides`, `estilo`, `virais`, `visual` | ordem e quantidade de slides; `virais` são os tipos de slide virais que combinam com a página, do mais indicado ao menos (post, jornal, gráfico...); `visual` é o papel do carrossel (`escuro`, `claro` ou `papel`) | skill `carrossel` |
| `publicar.legenda`, `hashtags`, `fontesNaLegenda`, `aviso` | jeito da legenda | skill `publicar` |
| `cuidados.fontesMinimas`, `fonteOficial`, `atribuicao`, `avisoFalado`, `avisoLegenda`, `temasBloqueados`, `revisaoHumana` | regras de fato e de responsabilidade; `avisoFalado` o linter cobra; `revisaoHumana` deixa o `entrega.json` com `publicavel: false` | skills `pauta` e `publicar`, linter, vídeo |

`cuidados.atribuicao` trata do vínculo entre afirmações e fontes nos arquivos de pesquisa. Mesmo com `sempre`, não recite fontes na narração. Referências ficam em `fontes.md`, `fontes.json` e na descrição, preservando o grau de certeza na fala.

Cada estilo de motion tem uma ficha com o nome dele (`interface`, `antiguidade`, `moderno`...), com a aparência e o jeito de roteiro próprio dele (usado quando o vídeo não escolhe objetivo). O `moderno` (janelas de vidro em perspectiva, cursor, crachá de passo e legenda com caixa de seleção) serve a tutorial, "como fazer", demonstração de ferramenta e antes e depois: `docs/estilo-moderno.md`.

O validador (`npm run objetivos -- --validar`) recusa campo desconhecido, peça ou cenário que não existe, formato fora dos 8, estilo fora dos 24 e faixa de palavras incoerente com a duração, sempre com a sugestão do nome mais próximo.




