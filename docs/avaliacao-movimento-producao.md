# Produção visual: diagnóstico e mudanças

Pedido: analisar `/home/metabit/Downloads/video (2).mp4` e melhorar a produção dos próximos vídeos, sem refazer esse arquivo. A análise usa quadros amostrados do MP4 e o plano correspondente de `italia-x-franca-o-classico-da-rodada-de`. O vídeo tem 65,5 s, 1080 × 1920, 30 fps. Não houve avaliação auditiva da narração; sincronismo com som e retenção real não estão comprovados por este diagnóstico.

## O que falhou

- Abertura com pergunta longa e duas bandeiras pequenas. O visual identifica as seleções, mas não apresenta uma situação que sustente a curiosidade.
- O plano contém 46 s consecutivos, de aproximadamente 7,2 a 53,2 s, compostos por imagens SVG de gráficos. São cartões com valores finais, sem transformação interna implementada.
- Três sequências mantêm o mesmo arquivo por cerca de 8,6 s, 8,9 s e 8,7 s. Títulos, legendas e pequenas mudanças de destaque não acrescentam ação ao conteúdo do gráfico.
- O plano reserva aproximadamente 48,9 s a imagens isoladas, incluindo a foto de contexto. Isso é duração estrutural do plano, não medição de pixels nem resultado de retenção.
- `sujeito.acao` e `direcao.ganhoVisual` descrevem “revelar cartão” repetidamente. Preencher os campos atende a um contrato estrutural; não demonstra uma cena interessante. As regras anteriores permitiam que isso fosse entregue com alertas.

## Mudanças para novas produções

1. Comparações explícitas de gols pequenos podem usar bolas contáveis, com entrada escalonada, deslocamento e rotação, mantendo os valores exatos. Valores maiores continuam proporcionais; não se arredondam dados para caber no desenho.
2. `decomposicao` preserva os objetos de um total enquanto os separa em grupos, tornando a relação parte/todo visível. A soma é validada e a transformação precisa terminar antes do corte.
3. `campo-tatico` permite corrida, passe com trajetória e identificação de quem está com a bola. É um esquema ilustrativo identificado na tela, sem simular um registro de jogo real.
4. A direção v2 passa a identificar a duração de imagens isoladas, alertar para arquivo congelado e reprovar séries longas de SVGs estáticos. Não reescreve cenas existentes.
5. As instruções de cena, produção, crítica e novos pedidos do estúdio passam a exigir inspeção antes, durante e depois das ações centrais. O roteiro deve permitir uma sequência visual pertinente antes de contratar voz e render.

Os novos recursos são opções de direção, não um rodízio para preencher qualquer história. Registros reais, documentos, objetos, detalhes, composição e concisão continuam necessários. Uma notícia não deve virar um campo tático sem que a fala explique uma relação tática. Aumentar movimento aleatório ou trocar barras por bolas em todos os planos mantém a mesma fraqueza narrativa.

## Conferência

O comando `node scripts/previa-movimento.mjs` gera uma demonstração sintética de 12 s, sem áudio, em `.cache/producao-movimento/previa.mp4`. Não altera projetos existentes nem usa serviços pagos. Os dados são fictícios. A sequência permite conferir comparação por unidades, separação de um todo e movimentação no campo.

Os testes em `scripts/producao-movimento.test.mjs` verificam conservação de objetos, validação factual das quantidades declaradas (sem verificar fontes externas), busca temporal determinística, continuidade de passes e render nos estilos editorial e smooth, em vertical e horizontal. Há regressão para composição horizontal com título, handle e três grupos. A análise automática continua sem aprovar mérito artístico ou prometer retenção.

Na verificação desta mudança, passaram 46 testes nas suítes de produção e integração, mais 30 testes relacionados a recursos visuais, mecanismos, storyboard, proteção de autoria e direção de render. `git diff --check` não apontou erros. A prévia foi renderizada com 12 s e teve seus quadros inspecionados; a revisão independente encontrou dois defeitos de borda, corrigidos e cobertos por regressão. Estes resultados comprovam a integração exercitada, não a retenção dos próximos vídeos.
