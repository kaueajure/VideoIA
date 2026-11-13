# Casos editoriais

## Política
- **Política: sem teto de duração** (0.6.42). O alvo de ~60 s (até ~170 palavras) é só recomendação de retenção; acima disso o linter dá uma nota, nunca reprova. Corte atribuição repetida e número que não sustenta o argumento. Máximo de 9 números; o espectador guarda 1 ou 2.
- **Gancho sem alvo cedo em política**: prefira o fato, o número ou a pergunta ao nome do político na primeira frase, quando o fato sustenta o gancho sem ele.

### Linha editorial
Leia a linha da página: `npm run linha -- --ver` (campo `linhaEditorial` de `ilustrando.config.json`; regras em `docs/identidade-e-voz.md`, seção "Linha editorial em política"). Se ainda não foi escolhida, a skill `pauta` pergunta antes. Aplique **de leve**:
- **Ângulo e ordem:** abra pelo fato verdadeiro que conversa com a linha; o outro lado vem depois, mas vem, numa frase, atribuído.
- **Alfinetada:** as uma ou duas alfinetadas miram a incoerência que a linha quer apontar (promessa x entrega, discurso x voto, gasto x resultado), em fato, decisão ou instituição, nunca na pessoa.
- **Pergunta final:** pode puxar o debate para o lado da página, sem induzir com meia verdade.
- **Neutra:** mesmo espaço e mesma força para os dois lados.
**Não muda com a linha:** nenhum fato ou número inventado, distorcido ou fora de contexto; fontes registradas fora da voz e incertezas preservadas na fala; o fato central do outro lado não é omitido; sem ataque pessoal nem desinformação; regras das plataformas e da Justiça Eleitoral em período eleitoral (sem pedir voto, sem propaganda de candidato, sem conteúdo fabricado com IA). Não acrescente citações faladas para atender ao linter.

## Notícia e checagem
- **Notícia com validade de 48 h**: se a checagem em duas fontes não fecha em 24 h, mude o ângulo para a explicação que dura (o que acontece depois, como funciona), nunca publique atrasado como se fosse novidade.
- **Gancho sem repetir a mentira** nos vídeos de boato e checagem: abra pelo fato ("É montagem feita por IA", "O vídeo não mostra isso") e traga a alegação falsa só depois, atribuída. Quem vê só o primeiro segundo não pode sair com o boato na cabeça.

## Economia e dinheiro
- **Gatilho de bolso (PD ou EN pessoal) em economia e dinheiro**: a conta que o espectador faz sobre a própria vida (modelo: cesta-basica-horas, salario-minimo-horas-eua).

## Exposição curta para dor ou cotidiano
Em tema de dor ou de cotidiano ("fecha os apps", "estala os dedos"), ponha 1 ou 2 frases logo depois do gancho que descrevam o que o espectador já faz ou sente ("Todo mundo faz esse ritual: desliza tudo pra cima e sente que arrumou."). Só o hábito reconhecível, sem inventar fato nem pôr a culpa em ninguém. Em política e notícia, pule: o fato abre direto. Máximo 15 palavras, dentro do limite de tamanho do modelo.
