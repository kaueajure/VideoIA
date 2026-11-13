# Correção geral do ritmo de produção

12/11/2026. Pedido: reduzir a produção parada em qualquer assunto, preservando o avanço na seleção de imagens. Mudanças no motor, planejamento automático, análise e instruções; sem alterar roteiro, fotos, voz ou MP4 dos projetos existentes.

## Por que a produção continuava parada

1. `avaliarRecurso` limitava o desenvolvimento de todo item a 0,7 s, mesmo com duração autoral maior. Contagens tinham outra janela fixa, de aproximadamente 0,42 s mais um escalonamento curto. Trocar um gráfico estático por um recurso executável não garantia que a ação acompanhasse a fala.
2. O planejador automático fixava a duração em 0,4 s. Os componentes entravam, terminavam quase imediatamente e esperavam o restante da narração.
3. `analisarMontagem` detectava principalmente sequências de arquivos de imagem/SVG. Uma composição de recursos sem ação depois da entrada escapava desse diagnóstico.
4. Avisos de imobilidade ficavam separados da decisão de publicação. Na direção autoral deste caso, o agente aceitou o repouso e as limitações sem resolver a montagem. Aprovação estrutural foi insuficiente.

## O que mudou

- Duração efetiva por item: `item.dur`, depois `recurso.dur`, depois a entrada breve padrão. O render não substitui uma duração dirigida por 0,7 s. A revelação de caixas, moedas, pessoas e bolas respeita o intervalo e conserva quantidades.
- O planejador distribui cada etapa pelo intervalo narrado, com limite de 2,4 s por ação automática e margem de leitura. Não inventa valores nem relações para preencher tempo. Cronologia e causa e efeito também usam essas durações.
- Setas de sequências causais se desenvolvem na etapa correspondente; não aparecem inteiras antes da consequência.
- A preparação recusa ações que ultrapassam o corte ou deixam menos de 0,3 s para observar o resultado. Isso inclui duração herdada do recurso: cortar uma barra enquanto cresce pode falsear sua proporção visível.
- `ritmo-visual.mjs` amostra estados do mesmo avaliador que o render utiliza. Registra os intervalos de repouso depois da ação, independentemente de serem imagens ou gráficos executáveis. Câmera, legenda e grão não mascaram a falta de progressão do conteúdo.
- Registro comum a cenas automáticas e autorais, com ou sem contrato de direção v2: `relatorio.ritmoVisual`. Na direção v2, os detalhes também ficam em `criatividade.montagem.ritmo`.
- Repouso conhecido a partir de 3 s gera aviso; a partir de 4 s, aviso alto que impede publicação automática, preservando a prévia. Leitura documental pede revisão sem forçar animação decorativa. Peças, contadores, vídeo e estilos sem avaliador não recebem diagnóstico falso de imobilidade ou aprovação automática de movimento; ficam explicitamente não avaliados.
- Instruções gerais passaram a exigir planejamento de progressão antes da voz e inspeção da segunda metade do plano, incluindo a espera depois das entradas. O princípio vale para mecanismos, acontecimentos, notícias, documentos, comparações e personagens. Não exige campo, bolas, gráficos ou zoom por tema.

## Reprodução e evidências

Os quatro primeiros testes da nova suíte falharam antes da correção: duração ignorada em itens; duração própria ignorada; objetos já completamente revelados cedo demais; duração inválida por item aceita. Depois da implementação, passaram.

Demonstração sintética sem voz, fontes externas ou créditos pagos: `node scripts/previa-ritmo.mjs`. Arquivo em `.cache/ritmo-producao/previa.mp4`, aproximadamente 21,42 s, fora da pasta de vídeos publicados. Há três sequências: custo de projetos; quantidade de caixas; processo de recebimento, conferência e liberação. Os números e rótulos são ilustrativos, sem promessa factual ou publicação.

18 quadros vistos em `.cache/ritmo-producao/folha.jpg`: barras em 0,4/1,2/2,6 e 3,6/4,5/6 s; contagem em 7,4/8,2/9,6 e 10,6/11,5/13 s; processo em 14,4/15,2/16,6 e 17,6/18,5/20 s. As barras atingem os valores finais, as caixas entram ao longo de cada etapa e as setas avançam entre os estados. A demonstração verifica a execução temporal, não é um modelo visual final a repetir em todos os vídeos.

No mesmo roteiro sintético, o modo de entradas breves produziu 9.70 s de repousos longos identificados; o modo distribuído produziu 0.00 s. Esta medida é do avaliador de estados conhecidos, não fluxo óptico, escuta ou retenção real.

Análise somente em memória de 14 projetos com cena e palavras: o plano atual de Itália x França apresentou 37.28 s de repousos conhecidos e 5 alertas altos. Nenhum arquivo desses projetos foi reescrito. Projetos com componentes não avaliados não foram considerados aprovados por terem zero alertas.

## Revisão independente

A revisão encontrou um falso positivo de contador e a falta de validação da duração herdada. Corrigidos: contador fica não avaliado, e o limite considera `item.dur ?? recurso.dur`. Há regressões para ambos e para a decisão de publicação em uma cena automática sem direção v2. Na segunda revisão, nenhum novo problema importante foi apontado.

## Limites

Verificação final: `npm run test:producao` passou em 45/45 testes; `npm run test:ritmo`, em 11/11; o grupo de regressões de integração, proteção e direção passou em 27/27. A suíte de ritmo inclui renderização real nos formatos vertical e horizontal e nas famílias editorial e smooth, verificando progresso intermediário, proporções finais e busca temporal determinística. As verificações de sintaxe e de espaços do diff também passaram.

As correções eliminam limites ocultos e tornam o repouso visível ao controle de qualidade. Elas não transformam qualquer descrição em ação, nem asseguram boa montagem em todos os estilos. Movimento contínuo de câmera, contagem artificialmente lenta e cortes sem informação continuam sendo escolhas fracas. A direção precisa escolher evidência e mudanças de estado pertinentes, verificar a sequência inteira e ouvir a composição com a voz. A prévia sintética não contém áudio; a revisão audiovisual de uma produção real não foi realizada nesta tarefa.

O vídeo atual não foi refeito nem recebeu novo julgamento factual. As mudanças ficam disponíveis nos comandos de produção seguintes. A seleção de imagens, a identidade da página e as vozes configuradas foram preservadas. Os testes de render executam os módulos atuais, tanto na família editorial quanto na smooth e nos dois formatos.
