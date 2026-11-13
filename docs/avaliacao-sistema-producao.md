# Avaliação do sistema de produção

Data: 12/11/2026. Escopo: `Metodo-Video`, da pesquisa à entrega e à edição. Os repositórios vizinhos não fazem parte do motor deste estúdio.

Atualização após a avaliação: a integração descrita em `docs/integracao-explicacoes.md` foi implementada. O autoplano novo passou a reconhecer um subconjunto explícito de comparações, cronologias e consequências; o plano visual aceita os seis recursos, que agora também renderizam na família smooth. Os achados abaixo registram o estado avaliado antes dessa integração. A limitação de execução semântica geral e as demais prioridades continuam relevantes.

## Conclusão

O sistema tem uma base funcional para produzir, conferir e revisar vídeos. Seu principal limite criativo está na transformação da explicação em ação visual: o planejador escolhe muitos componentes por palavras-chave e o resultado depende bastante da direção escrita pelo agente. Mais estilos e mais campos obrigatórios não resolvem essa limitação sozinhos.

Há recursos executáveis melhores que os usados nas produções analisadas: comparação proporcional, sequência causal, linha do tempo, destaque em documento e acompanhamento de imagem. Entretanto, estão concentrados nos estilos base e não aparecem nos arquivos de cena da amostra. A prioridade é integrar essa capacidade à criação cotidiana e desenvolver composições específicas para os temas recorrentes.

## Evidência das produções existentes

Inventário local de 11 projetos que possuem roteiro e cena, excluindo os exemplos do kit:

| Medida | Resultado |
|---|---:|
| Cenas | 241 |
| Projetos com `automatica: true` | 8 de 11 |
| Elementos de imagem, incluindo repetições | 51 |
| Elementos de peça | 94 |
| Elementos smooth | 65 |
| Contadores | 32 |
| Elementos `video` | 0 |
| Elementos `recurso` | 0 |
| Projetos com peças locais em `pecas.js` | 0 |
| Projetos com registro `fontes.json` | 1 de 11 |

Esses números descrevem o acervo, não uma execução dos pedidos novos. Fotos repetidas não representam novos ativos; ausência de vídeo real não é defeito por si só. O conjunto mostra uma produção concentrada no repertório pronto, com pouca execução de mecanismos ou ações próprias. Os controles factuais atuais já exigem registro para liberar publicação, mas o acervo antigo ainda precisa dessa migração quando for reutilizado.

## Avaliação por etapa

| Etapa | O que já funciona | Limite encontrado e melhoria indicada |
|---|---|---|
| Pesquisa e fatos | Registro de afirmações, evidências, ressalvas e vínculo com a entrega | A revisão semântica continua sendo do agente. Não tratar presença de fonte como comprovação automática da imagem ou da conclusão. |
| Roteiro | Objetivos, alternativas de gancho, revisão e linter | Existem orientações rígidas de contraste, números e virada que podem deixar vídeos parecidos. Avaliar o roteiro pelo que explica; métricas de texto não medem interesse real. Preservar as escolhas editoriais da página. |
| Pesquisa visual | Escolha explícita de arquivo, contexto e origem; foto não é baixada às cegas | A seleção ainda depende do trabalho do agente. Planejar os ativos da explicação central antes da voz, além dos retratos de apresentação. |
| Planejamento automático | Gera cenas e sincroniza com a fala | Usa regras lexicais. “Minutos” pode virar relógio mesmo quando o assunto é gestão de utilização; “contra” pode ser adversário ou proteção. Não confundir associação de palavras com direção. |
| Direção criativa | Novo contrato liga intenção a elementos e verifica continuidade declarada | O preenchimento não demonstra que a ação acontece. A revisão precisa observar estados e transições renderizados. |
| Repertório explicativo | Recursos de comparação, documento, sequência e mecanismos determinísticos | Recursos gerais estão restritos a `padrao`, `editorial`, `minimalista` e `papel`; mecanismos específicos disponíveis são os dois modelos da Lua. Não há mecanismo universal que execute qualquer descrição. |
| Animação e câmera | Render por tempo, testes de determinismo e limites de câmera | Movimento de câmera e entrada de componente não substituem transformação do objeto. Desenvolver ações dirigidas pelo conteúdo e continuidade entre planos. |
| Dados na tela | Valores declarados e registro factual | Foram encontrados gráficos inventados e distorção de proporção no smooth. Correções abaixo. Gráficos ainda precisam de unidades, contexto e conferência da fonte. |
| Narração | Cache por frases, proteção de créditos, voz consistente e alinhamento | A interpretação de blocos pode variar nas junções. Quando falta alinhamento confiável, o fallback usa pausas ou distribuição proporcional; isso não comprova sincronismo exato por palavra. |
| Som | Faixas separadas, controle de intensidade e redução da trilha sob a voz | Os testes verificam mixagem e níveis, não intenção dramática ou naturalidade. Conferir junções, pausas e relação dos efeitos com a ação visível. |
| Edição | Mudanças locais, revisão contra conflito, cortes entre vizinhas, histórico e desfazer | A interface é principalmente textual. Faltam controles diretos de troca de ativo, recorte, ponto focal, posição e escala com retorno visual integrado. A prévia e a comparação de versões já existem e devem ser aproveitadas. |
| QA | Mede composição, área segura, contraste, entrada, câmera, áudio e arquivo final | Verificadores lexicais geram falsos sinais. Uma composição pode cumprir a geometria e continuar fraca. Separar falha técnica, suspeita semântica e julgamento criativo. |
| Publicação | Lista e detalhe usam decisão compartilhada e verificam fontes atuais | “Pronto para publicar” depende das verificações implementadas; não comprova excelência artística ou potencial de audiência. |
| Manutenção | Módulos, testes de render e assinatura do motor para cache | Há código fonte e um runtime legado empacotado de aproximadamente 3,3 MB, com substituições manuais de funções. Isso aumenta o risco de Node e render usarem implementações diferentes. Priorizar uma construção reproduzível do runtime a partir de uma única fonte. |

Referências principais: `src/video/autoplano-smooth.mjs`, `src/video/fala-forma/figuras.mjs`, `src/video/engine/recursos-visuais.js`, `src/video/narracao/`, `src/video/mixagem.mjs`, `src/video/preparar-spec.mjs`, `src/video/previa.mjs`, `src/video/editar-cena.mjs`, `src/video/estado-publicacao.mjs` e `src/video/engine/runtime.js`.

## Correções implementadas nesta avaliação

1. **Barras proporcionais no smooth.** O desenho anterior aplicava raiz quadrada ao valor e uma largura mínima de 300 px: zero ainda tinha barra e diferenças grandes pareciam pequenas. A nova composição parte de zero, usa a proporção exata e posiciona valores e rótulos fora do preenchimento. Os números ficam no valor final enquanto a barra se revela. Funciona no render vertical e horizontal.
2. **Gráficos sem séries inventadas.** O planejador deixou de criar curvas com sequências fixas como `[6,9,14,24,45,100]` a partir de “cresceu”, ou outra sequência arbitrária a partir de “caiu”. Curva e gráfico exigem pelo menos dois valores explícitos e finitos. Colunas rejeitam negativos, e sua altura deixa de cortar os dados em 100 ou impor altura mínima a zero. Isso melhora fidelidade, mas não cria uma explicação visual para substituir a curva: essa escolha continua sendo da direção.
3. **Comparação contextual.** “Contra” e “enquanto” isolados deixam de exigir comparação. Comparações explícitas continuam reconhecidas; o uso dessas duas palavras com quantidades dos dois lados continua gerando sinal. A heurística ainda pode errar em frases complexas. A checagem do plano do Raphinha, em memória, ficou sem as duas falhas anteriores de comparação por adversário; os avisos restantes não são aprovação artística.
4. **Prévia preserva enquadramento revisado.** O encaixe salvo pelo QA não passa por outra ampliação automática da foto, inclusive no runtime. Uma foto ajustada para 400 px permanece com 400 px. Se autoria ou voz mudar, a assinatura invalida o encaixe salvo e a prévia prepara o estado atual.
5. **Posição explícita de contador é respeitada.** O painel automático deixa de mover um contador que possui `pos` autoral. Antes, a automação escondia inclusive um posicionamento ruim e fazia o QA medir outra composição. O QA volta a poder apontar esse erro.

Nenhum roteiro, ativo, voz ou MP4 de produção foi refeito nesta avaliação. Os renders de verificação usam fixtures locais.

## Validação executada

- Antes das correções: suíte geral com 379 testes, 363 aprovados, 12 falhas e 4 ignorados.
- Depois: os mesmos 379 testes, 365 aprovados, 10 falhas e 4 ignorados. Foram resolvidas as falhas de preservação do enquadramento da prévia e de detecção do contador posicionado no alto. Não houve nova falha na comparação pelos nomes dos testes.
- 24 testes focados de produção, direção criativa e qualidade visual aprovados, incluindo os renders de barras nos dois formatos, dados acima de cem, zero, proporção, determinismo e posição autoral. O teste adicional de colunas foi executado após o primeiro grupo de 23.
- Sintaxe dos módulos alterados, `git diff --check` e sincronização das skills conferidos.
- Planos de Data FIFA e Harry Kane montados em memória com o motor atualizado, sem modificar arquivos dos projetos.

As dez falhas restantes abrangem listas de exceções de cores desatualizadas, arquivos e fixture de mindset3 ausentes, expectativas de ordem dos estilos, correspondência literal do código no teste de QA, mensagem antiga de licenciamento, dependência do objetivo pessoal configurado e uma checagem textual que inclui documentação de terceiros. Elas não foram descartadas nem tratadas como aprovação; precisam de uma revisão própria de manutenção.

## Ordem recomendada para a próxima evolução

1. **Integrar explicações executáveis à escolha das cenas.** Planejar evidência, relação e mudança de estado antes de escolher o componente. Para os temas recorrentes, implementar composições como cronologia de acontecimentos, distribuição de utilização e comparação de desempenho, com parâmetros e dados explícitos. O objetivo é acrescentar entendimento; não impor um diagrama a toda fala.
2. **Unificar a fonte do motor e ampliar o suporte dos recursos.** Estabelecer uma construção reproduzível do runtime e testar a mesma composição pela análise e pelo render. Só então ampliar recursos explicativos para outros estilos com adaptação real de layout, legenda e QA.
3. **Melhorar o ciclo de edição visual.** Usar a cena e a prévia existentes para trocar ativo, recortar, escolher ponto focal e ajustar composição; manter histórico, voz e cache. Reutilizar comparação de versões para verificar o ganho real.
4. **Revisar o resultado em movimento.** Usar os quadros de início, meio e fim para verificar ação e continuidade, e reprodução com som para ritmo e sincronismo. Registrar defeitos concretos; uma nota alta ou redução de avisos não basta.
5. **Tornar os testes reproduzíveis.** Corrigir dependência de configuração pessoal, fixtures ausentes, ordem fixa de estilos e verificações de texto do código. Separar comportamento executado de expectativas que ficaram antigas. Não afrouxar checagens só para obter aprovação.

## Limites desta avaliação

Foram inspecionados os caminhos principais de produção, recursos, direção, áudio, edição, prévia, cache, fontes e publicação, além do inventário de cenas e da suíte de testes. A interface foi avaliada pelo código e pelos testes de integração; não houve sessão de usabilidade no navegador. Não foi feita uma nova produção completa nem escuta crítica das vozes comerciais. A revisão de código não cobre visualmente todos os quadros de todos os estilos. A avaliação não estima retenção ou desempenho de audiência, pois não há experimento ou dados suficientes para essa conclusão.
