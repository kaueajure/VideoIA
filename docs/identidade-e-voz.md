

# 02. Identidade e voz

## Visual
Avatar (1080x1080) e banner (2560x1440) de cada página saem de `npm run identidade`.

| Elemento | Valor |
|---|---|
| Fundo | `#14141B` (escuro de verdade) |
| Cartão | `#1E1E28` |
| Texto | `#FFFFFF` |
| Sombra / secundário | `#3C3B4A` |
| Destaque Curiosidades | `#FF7A2F`, apoio `#FFC9A3` |
| Destaque Tecnologia | `#29D9F2`, apoio `#B5F1FA` |
| Destaque Dinheiro | `#46E08A`, apoio `#BDF5D4` |
| Fonte | Inter Tight (já embutida nos kits, licença de uso comercial) |
| Símbolo | o "i": haste branca e ponto na cor da página |

Regra de ouro herdada dos kits: **uma cor de destaque por slide ou cena, em um único elemento.** O olho vai para o destaque ou o destaque morreu.

A identidade é propositalmente diferente de qualquer outro perfil de curiosidades. Pode se inspirar na estrutura (fundo escuro, título curto, um destaque), nunca reproduzir logo, nome ou arte de outro perfil.

## Voz
- **Curioso, direto, sem jargão.** Frases curtas. Uma ideia por frase.
- **Fala com a pessoa**, sobre a vida dela: "o que você vê todo dia".
- **Contradiz antes de explicar.** Todo conteúdo abre com "todo mundo acha X, mas é Y".
- **Humilde com o fato.** Se há controvérsia ou nuance, diz. Ex.: "existem outros motivos". Isso gera confiança e blinda contra comentário corretivo.
- **Um leve toque de acidez e provocação.** A graça está em apontar a incoerência dos fatos, não em xingar pessoas: ironia seca, contraste e pergunta que incomoda. Exemplos: "Pagava mais que todos. Ninguém perguntou por quê?", "Quase sete anos pra decidir que seis dias de trabalho por semana era demais." Uma ou duas alfinetadas por vídeo, em frases curtas, sempre ancoradas em fato conferido.
- **Acidez com limite.** Alfinete em fato, instituição, decisão e incoerência; nunca em aparência, família, religião ou caráter de pessoa. Em política, o mesmo rigor para todos os lados: nada de torcida, nada de adjetivo sobre pessoa, fontes nos registros de pesquisa e incertezas preservadas na fala. Caso em andamento nunca vira condenação.
- **Sem gíria de internet** (o conteúdo tem que envelhecer bem), sem "você sabia que", sem "preste atenção", sem pedir like/seguir em legenda.
- **Sem travessão longo** com espaços. Use vírgula, dois pontos ou ponto final.

## Gancho: o nome quente primeiro
Em assunto que está em alta, **o protagonista que todo mundo está procurando aparece nos primeiros 3 segundos, no texto e na capa** (ex.: "Daniel Vorcaro", "Veja e Globo", "escala 6x1"). Quem vê o vídeo pelo nome que bombou precisa reconhecer o assunto na primeira frase, e a frase já carrega a alfinetada ou o número. Nunca deixe o nome quente para o meio do roteiro.

## Os três ganchos que mais funcionam aqui
1. **A crença errada:** "Todo mundo acha que o 789 do código de barras quer dizer feito no Brasil."
2. **O absurdo familiar:** "Um bueiro quadrado pode engolir a própria tampa."
3. **O número que não bate:** "A diagonal do quadrado é 41% maior que o lado."

## Handle no topo e assinatura no rodapé
- Topo de todo vídeo e cabeçalho do carrossel: o @ de `marca/tokens.json` (na página de demonstração, **@exemplo**).
- Rodapé do último slide: "uma página exclusiva para pessoas inteligentes e curiosas".
- Bio: "Uma página exclusiva para pessoas inteligentes e curiosas 😌".

## Fontes fora da narração
A fala conta o fato e explica o mecanismo, sem anunciar de onde veio a informação. Não escreva chamadas como "segundo a fonte", "de acordo com o estudo", "conforme o relatório" nem leia links, referências bibliográficas ou listas de instituições. Registre a pesquisa em `fontes.md` e `fontes.json`; referências para o público vão na descrição ou legenda da publicação. Essa regra vale também quando o objetivo traz `cuidados.atribuicao: sempre`: a atribuição fica no registro de pesquisa, fora da voz.

Preserve o sentido e o grau de certeza: hipótese continua hipótese, estimativa continua estimativa e investigação não vira condenação. Em casos em andamento, prefira uma formulação direta como "A investigação apura uma suspeita de fraude". Se uma frase só faz sentido como uma acusação sem contexto, reescreva ou omita o trecho. Um órgão ou pesquisador pode aparecer quando for o próprio assunto ou autor da ação narrada; não o acrescente apenas como selo de autoridade. Não apague palavras automaticamente da fala pronta, pois isso pode mudar o sentido.

## Casos em andamento (notícia, investigação, tribunal)
Registre fontes e data da informação nos arquivos de pesquisa e na descrição. Na fala, separe fato de opinião e preserve a condição de suspeita, investigação ou alegação, sem recitar veículos, relatórios ou autoridades. Nunca afirme crime como fato antes da decisão da Justiça, e foto ou logo real só quando fizer parte do contexto, com crédito e licença registrada, e com o mesmo tratamento para todos os lados; nunca imagem que acuse ou ridicularize. Os números precisam de duas fontes; divergência entre fontes vira ressalva falada.

## Séries em partes (linha editorial)
A página publica também **séries em partes** (Parte 1, Parte 2...) quando o tema é grande demais para um vídeo: ranking longo, caso com capítulos ou um tema com vários episódios (ex.: "Os vícios explicados"). Cada parte tem gancho próprio e fato fechado, capa com "PARTE N", legenda com "Parte N de N" e um fecho que anuncia a próxima parte de verdade. São de 2 a 5 partes, publicadas com 3 a 24 h de intervalo. As regras completas estão em `docs/formatos.md`, seção "Série em partes". Valem a mesma voz, a mesma linha editorial em política e o mesmo revezamento do pedido de compartilhamento.

## Linha editorial em política
Cada página diz para onde tende quando o tema é política, em `ilustrando.config.json`:
```json
"linhaEditorial": { "politica": "direita", "intensidade": "leve" }
```
`politica`: `neutra` (padrão, sem lado), `esquerda`, `centro` ou `direita`. `intensidade`: `leve` (padrão) ou `moderada`. Ver e gravar: `npm run linha -- --ver` e `npm run linha -- direita leve`. **Na página do Estudio de videos a linha é direita, leve** (escolha do estúdio). No kit do comprador sai `neutra`, com `"perguntar": true`: a skill `comece` pergunta na primeira vez, e a `pauta` pergunta no primeiro tema político se ainda não foi escolhida.

### O que a linha muda (sempre de leve)
- **O ângulo:** entre dois recortes verdadeiros do mesmo fato, a pauta escolhe o que conversa com o público da página (ex.: o custo para quem paga imposto, a promessa x o resultado, quem decidiu e quem paga a conta).
- **O que vem primeiro:** o fato que abre o vídeo e a ordem dos blocos. O outro lado vem depois, mas vem.
- **Onde vai a alfinetada:** as uma ou duas alfinetadas do roteiro miram a incoerência que a página quer apontar (promessa x entrega, discurso x voto, gasto x resultado). Continua valendo: fato, decisão ou instituição, nunca a pessoa.
- **O tom da pergunta final:** a pergunta de opinião pode puxar para o debate que a página quer ("Quem deveria pagar essa conta?"), sem induzir resposta com mentira ou meia verdade.
- **Neutra:** os dois lados com o mesmo espaço, a mesma ordem de força e alfinetada para quem tiver a incoerência no fato, seja quem for.
- **Leve x moderada:** leve é escolha de ângulo e de ordem, quase invisível; moderada deixa a alfinetada e a pergunta final mais diretas. Nenhuma das duas vira torcida, militância ou "nós x eles".

### O que a linha nunca muda
- **Fato e número:** nada inventado, arredondado a favor, tirado de contexto ou com recorte de tempo escolhido para enganar. Número em duas fontes, como sempre.
- **Sem bordão de ressalva sobre culpa:** nada de "investigado não é culpado", "ser alvo não é ser culpado", "ser citado não é ser culpado", "presunção de inocência" ou frase no mesmo sentido (regra do estúdio, 18/10/2026; o corretor barra pelo campo `expressoesProibidas` do `ilustrando.config.json`). A cautela continua no sentido da frase: diferencie suspeita, investigação e decisão confirmada; preserve uma negativa relevante sem enumerar fontes.
- **Atribuição nos registros:** toda afirmação tem fonte conferida em `fontes.md` e `fontes.json`. A fala não lê essas referências. Caso em andamento mantém o grau de certeza correto e uma negativa relevante, sem condenação antes da Justiça.
- **O fato central do outro lado não some:** se o lado que a página critica tem um argumento ou um dado que muda a leitura, ele entra, numa frase, atribuído.
- **Sem ataque pessoal, sem desinformação:** nada sobre aparência, família, religião ou caráter; nada de boato, montagem, imagem que ridiculariza ou voz e rosto falsos de político.
- **Mesmo tratamento visual** para todos os lados: mesmo tipo, tamanho e enquadramento de foto.
- **Regras das plataformas e da Justiça Eleitoral:** em período eleitoral (no Brasil, a propaganda eleitoral é permitida a partir de 16 de agosto do ano da eleição, Lei 9.504/1997, art. 36), a página não pede voto, não faz propaganda de candidato, não paga impulsionamento de conteúdo eleitoral (só partido, federação, coligação e candidato podem contratar: Lei 9.504/1997, art. 57-C, e Resolução TSE 23.610/2019) e não publica conteúdo fabricado ou manipulado com IA sobre candidato (Resolução TSE 23.610/2019, com as mudanças da 23.732/2024 e da 23.755/2026; esta última proíbe publicar conteúdo novo feito com IA usando imagem ou voz de candidato nas 72 horas antes da eleição até 24 horas depois, mesmo com rótulo. Fontes: planalto.gov.br e tse.jus.br, conferido em 18/10/2026). Anúncio pago sobre tema político nas redes da Meta exige autorização e o rótulo "Pago por". Na dúvida, o vídeo fica neutro.

O linter não exige atribuição falada. A ausência de citações na voz não dispensa a conferência factual e os registros de pesquisa.




