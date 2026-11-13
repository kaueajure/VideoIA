

# Formato da cena (cena.json)

O diretor (você) escreve `projetos/<nome>/cena.json`. O motor cruza com os tempos da narração e renderiza.

Produções novas também usam o planejamento `direcao.versao: 2` descrito em [Produção criativa](producao-criativa.md): pergunta e resposta na raiz; função, ganho visual, elementos-chave e continuidade em cada beat. Os exemplos básicos abaixo descrevem a composição; acrescente o planejamento nos projetos novos.

```json
{
  "perfil": "curiosidades",
  "tema": "TAMPA DE BUEIRO",
  "beats": [
    {
      "id": "gancho",
      "palavras": [0, 7],
      "titulo": { "texto": "Um bueiro quadrado pode *engolir* a tampa", "entra": 0.1 },
      "elementos": [
        { "tipo": "peca", "forma": "cubo", "papel": "sombra", "pos": [0, -0.2, 0], "escala": 1.7, "entra": "bueiro", "gira": 0.25 }
      ]
    }
  ]
}
```

## Onde está cada parte
Leia este índice e **só o arquivo do estilo da vez** (sem `estilo` na cena, vale o padrão). Os arquivos de assunto só quando a cena pedir.

| estilo ou assunto | arquivo |
|---|---|
| `padrao`, `editorial`, `minimalista`, `papel` (3D, o padrão) | `docs/cena/estilo-padrao.md` |
| `tifo-football` (explicadores de futebol) | `docs/cena/estilo-tifo-football.md` |
| `pontilhismo` e elemento `pontos` | `docs/cena/estilo-pontilhismo.md` |
| `impresso`, `cartoes`, `tubo`, `linhas`, `anatomia`, `fino` | `docs/cena/estilos-motion.md` (e `docs/cena/kit-aberto.md` no cartoes, tubo e impresso) |
| `letreiro`, `interface`, `colagem`, `ribalta`, `mundos` | `docs/cena/estilos-marca.md` e `docs/cena/kit-aberto.md` |
| `fatos` · `mindset` · `mindset2` · `mindset3` | `docs/cena/estilo-fatos.md` · `docs/cena/estilo-mindset.md` · `docs/cena/estilo-mindset2.md` · `docs/cena/estilo-mindset3.md` |
| `colagem3d` · `novela` · `teologia` · `pleno` · `antiguidade` | `docs/cena/estilo-colagem3d.md` · `docs/cena/estilo-novela.md` · `docs/cena/estilo-teologia.md` · `docs/cena/estilo-pleno.md` · `docs/cena/estilo-antiguidade.md` |
| `prickles`, `little-light` · `paper-rocket`, `lighthouse-mouse`, `moon-path` | `docs/cena/estilo-prickles-little-light.md` · `docs/cena/estilo-cartoon-feltro.md` |
| `smooth` e irmãos · `moderno` · `quadro-antigo` · `stop-motion` · `alternativo` | `docs/cena/estilo-smooth.md` · `docs/cena/estilo-moderno.md` · `docs/cena/estilo-quadro-antigo.md` · `docs/cena/estilo-stop-motion.md` · `docs/cena/estilo-alternativo.md` |
| continuidade, queda, física, luz, virada limpa (`efeitos` das cenas novas) | `docs/cena/efeitos-3d.md` |
| formato horizontal, @ e legenda · sujeito e storyboard | `docs/cena/formato.md` · `docs/cena/sujeito.md` |
| comparação proporcional ou por objetos, decomposição de um todo, campo tático, linha do tempo, causa e efeito, destaque em documento e acompanhamento de imagem | `docs/cena/recursos-visuais.md` |
| cenários 3D · peças do dia a dia, de mundo e GLB · lista de formas | `docs/cena/cenarios.md` · `docs/cena/pecas.md` · `docs/cena/repertorio.md` |
| logos e bandeiras · som e trilha | `docs/cena/logos-e-bandeiras.md` · `docs/cena/som-e-trilha.md` |

Em qualquer estilo, `destaque` na cena (`"#RRGGBB"`, 0.6.44) é a cor de destaque só deste vídeo; sem o campo vale a cor da marca. `estiloPlano` é escrito pelo plano automático (não edite). Detalhes em `docs/cena/estilo-padrao.md`, "Transição e brilho".

## Beat
- `frases: [i, j]` (recomendado): da frase i à frase j da narração, nos índices de `node src/video/cli.mjs <projeto> --mapa`. Ou `palavras: [primeira, última]`: índices das palavras da narração (veja `palavras.json` ou `--trechos`). O beat começa na primeira e termina onde o próximo começa.
- `titulo` (opcional): até 2 linhas, até ~40 caracteres. `*palavra*` recebe o destaque. Exceção (0.6.12, `ganchoInteiro`): o título do gancho (beat 1) pode ser a frase inteira, até ~75 caracteres; o motor põe em até 3 linhas, largura útil inteira, fonte de 96 até 80 px. Não encurte o gancho na cena.
- `elementos`: o que aparece na faixa da cena.

## Elementos
Todos aceitam `entra`: número (segundos depois do início do beat) **ou uma palavra da narração** (`"tampa"`): o elemento aparece no instante em que ela é dita. Prefira a palavra.

Para explicar proporção, sequência, mecanismo ou evidência, consulte os recursos visuais acima antes de escolher uma peça decorativa. Eles funcionam nos estilos base e nos dois formatos. Um elemento com `"essencial": true` é protegido contra remoção ou mudança de conteúdo pelo QA; dê um `id` estável para facilitar o diagnóstico. O QA preserva a autoria de cenas sem `automatica: true` e salva ajustes de encaixe separadamente.

| tipo | campos |
|---|---|
| `peca` (3D) | `forma`, `papel`, `pos [x,y,z]`, `escala`, `rot [x,y,z]`, `gira` (rotação por segundo), `dados` |
| `traco` (2D) | `icone`, `papel`, `pos [fx,fy]` (fração da faixa), `tamanho` (px), `dur` (s do desenho) |
| `contador` | `valor`, `prefixo`, `sufixo`, `legenda`, `papel`, `pos [_, fy]`, `casas` (decimais; padrão: as do `valor`, até 2, então `2.2` com `" milhões"` mostra "2,2 milhões") |
| `video` | `arquivo` (b-roll em `assets/`, de `scripts/buscar-broll.mjs`), `modo` (`fundo` ou `card`), `inicio`, `escurece`, `zoom`, `credito`; no card também `pos`, `largura`, `altura`, `forma` (veja "Notas" em `docs/cena/estilo-padrao.md`) |
| outros (`pontos`, `logo`, `bandeira`, `fatos`, `novela`, `mindset3`, `smooth`...) | a linha de cada um está no arquivo do estilo ou do assunto (tabela "Onde está cada parte") |

**Formas 3D básicas:** `cubo`, `lamina`, `esfera`, `cilindro`, `moeda`, `anel`, `prisma`, `raio` (relâmpago), `reuleaux` (triângulo de Reuleaux), `seta`, e as compostas `pilha` (`dados: {n}`) e `barras` (`dados: {valores: [..], destaque: índice}`). Objetos do dia a dia e peças de mundo animadas estão em `docs/cena/pecas.md`. A lista completa e sempre atual: `node -e "import('./src/video/catalogo.mjs').then(m=>console.log(m.FORMAS.join(', ')))"`.
**Ícones em traço:** `lampada`, `lupa`, `relogio`, `moeda`, `bateria`, `wifi`, `seta`, `check`, `x`, `onda`, `casa`, `quadrado`, `circulo`.
**Papéis:** `destaque` (cor da página), `apoio` (versão clara), `frente` (branco), `sombra` (cinza).

## Como pensar uma cena
- Uma **analogia visual** coerente do começo ao fim (um objeto vira o conceito).
- Gancho: o objeto-problema. Meio: o mecanismo, um passo por beat. Virada: o contraste (mesmo objeto em outro estado). Fecho: uma imagem limpa.
- Beat de 1,5 a 4 segundos (uma ideia). Acima de 7 s o QA avisa; acima de 12 s reprova.
- Posição, tamanho e centralização são ajustados sozinhos: o motor encaixa as peças dentro da faixa e das margens. Você decide **o que**, **quando** e **em que ordem**.
- Para número com impacto: `contador`, sincronizado com a palavra do número.
- Para ideia abstrata: `traco` (ícone desenhando).

## Rótulo
Texto curto ligado a uma peça: `{"tipo":"rotulo","em":"<id da peça>","texto":"...","lado":"abaixo|acima|direita","papel":"frente|destaque","entra":...}`. A peça precisa de `"id"`. O motor reserva espaço para o rótulo ao encaixar, com o tamanho real do texto: na fila, a vaga da peça tem a largura do rótulo, e o rótulo desliza para o lado livre se fosse cobrir outra peça. Fica fora da cena 3D (é texto sobre a tela), então respeita a regra de não ter texto dentro do 3D.

## Modelos de cena (no beat: `"modelo": {...}`)
| nome | parâmetros |
|---|---|
| `comparativo` | `a:{forma,rotulo,entra}`, `b:{...}`, `vencedor:"a"\|"b"` |
| `antes-depois` | `forma`, `antes:{rotulo,dados,entra}`, `depois:{rotulo,dados,entra}` |
| `mito-fato` | `mito:{forma,rotulo,entra}`, `fato:{forma,rotulo,entra}` |
| `ranking` | `itens:[{forma,rotulo,entra}]` (até 4), `destaque:índice` |
| `passos` | `itens:[{forma,rotulo,entra}]` (até 3) |
| `causa-efeito` | `a:{forma,rotulo,entra}`, `b:{...}` |
`entra` aceita segundos ou uma palavra da narração. Dá para somar `elementos` extras ao modelo no mesmo beat.

## Contador de ano
`{"tipo":"contador","valor":1954,"formato":"ano"}` mostra 1954 sem separador de milhar.




