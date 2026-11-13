# Explicações integradas à produção

Os recursos explicativos fazem parte da criação de novos planos e da pesquisa visual anterior à voz. Não é necessário gerar um vídeo antigo para ativá-los. A biblioteca executável está em `docs/cena/recursos-visuais.md`.

## Seleção automática

Ao criar um autoplano novo em português, o motor tenta usar recursos nos estilos base e na família smooth:

- **Comparação:** duas afirmações completas com sujeitos distintos, verbo de quantidade, valores exatos e a mesma unidade. Exemplo sintético: “O time A marcou dez gols. O time B marcou vinte gols.” A comparação pode estar no mesmo beat ou em dois beats vizinhos. Os números podem ser algarismos com vírgula decimal ou números por extenso dentro do subconjunto reconhecido. Unidades disponíveis: gols, pontos, reais, minutos, segundos, metros, quilômetros, quilos, pessoas, votos e títulos.
- **Cronologia:** dois acontecimentos consecutivos apresentados como “Em 2020, a obra começou. Em 2022, a obra terminou.” Os anos precisam estar explícitos e em ordem crescente. O espaçamento dos marcos é editorial, sem representar proporcionalmente a distância entre anos.
- **Causa e efeito:** a fala afirma a consequência com “Por isso”, e causa e efeito cabem como rótulos completos. Exemplo sintético: “A água recebe calor. Por isso a água se expande.” A seta representa a afirmação do roteiro; a pesquisa ainda precisa sustentar essa causalidade.

O resultado vem em `cena.explicacoes.escolhas`, com beat, forma, motivo e revisão pendente. Os ids dos beats e os intervalos de palavras são preservados. A entrada da segunda parte acompanha a oração correspondente; a animação precisa deixar tempo para perceber o estado final.

Comparações exatas de gols inteiros até 24 por item usam `visual: "unidades"` e `simbolo: "bola"`: uma bola por gol, em vez de barras. Quantidades maiores continuam proporcionais. `decomposicao` e `campo-tatico` estão disponíveis para direção explícita; o parser não infere a origem de um total nem inventa jogadas a partir da notícia. Não use o mesmo recurso em todo o vídeo por conveniência.

O recurso instalado recebe `essencial: true` por padrão: um reparo automático de encaixe não pode apagar a explicação para eliminar uma falha de QA. Um plano visual explícito pode definir essa opção; mudar o conteúdo continua exigindo conferir o novo resultado.

São regras conservadoras, não compreensão semântica universal. O motor recusa números vagos, faixas, unidades diferentes, rótulos longos e casos fora do parser. Não interpreta automaticamente percentuais, milhares, milhões, números em idiomas diferentes ou qualquer texto livre. Nesses casos, o agente escreve o recurso estruturado com base nas evidências. Não encurte uma afirmação eliminando sua ressalva para forçar a detecção.

A automação não altera beats com briefing autoral, direção criativa, proteção explícita, elemento essencial ou ativo local escolhido. Uma busca de foto ainda não selecionada pode ceder lugar à explicação; uma foto posteriormente curada no plano visual prevalece sobre a sugestão automática. Estilos não suportados conservam seu planejador. `plano.recursosExplicativos: false` desliga essa seleção na chamada do autoplano.

## Planejamento explícito antes da voz

Além de imagem e câmera, um plano de `direcao-visual.json` aceita `recurso`:

```json
{
  "versao": 1,
  "planos": [
    {
      "trecho": "a temperatura aumenta",
      "recurso": {
        "forma": "causa-efeito",
        "itens": [
          { "rotulo": "A água recebe calor", "entra": 0 },
          { "rotulo": "A temperatura aumenta", "entra": "temperatura" }
        ]
      }
    }
  ]
}
```

O trecho deve ser único na narração e caber em um beat. `entra` por palavra pertence à fala desse beat; use os tempos finais para conferir a ligação. O recurso recebe um id estável, `<beat>-explicacao`, quando o plano não define um. O plano pode usar comparação, linha do tempo, causa e efeito, documento, acompanhamento de imagem ou mecanismo, com os mesmos campos validados do `cena.json`.

Escolha **imagem ou recurso** em cada plano. Um recurso inválido ou um plano com as duas opções é reportado sem substituir o conteúdo. Documento exige identificação da fonte; imagem exige arquivo local preparado; mecanismo exige um dos modelos implementados. O registro factual e os direitos de uso continuam necessários. Não invente documentos, dados, diagramas ou fontes para preencher os campos.

Nos projetos automáticos, a curadoria é aplicada na etapa de preparação de ativos. Em cenas autorais, escreva diretamente o elemento `tipo: "recurso"` no beat e vincule seu id a `direcao.elementosChave`. O novo contrato de direção não aceita o autoplano como entrega autoral final: use a sugestão como ponto de partida, confira os dados e complete a direção de cada cena.

## Render, revisão e edição

No smooth, a cena conserva o estilo e sua fala sincronizada. A explicação é desenhada na mesma implementação Canvas dos estilos base, em uma faixa que não cobre a fala. As cores acompanham a paleta clara ou escura da cena. O QA mede o recurso desenhado e continua apontando texto que não cabe e entradas inválidas. A auditoria lexical registra o conteúdo composto como não avaliado; não atribui aprovação semântica pelo nome do recurso.

As formas explicativas podem se repetir quando uma explicação precisa de continuidade. Elas não são obrigadas a trocar de desenho pelo rodízio de formas decorativas do smooth. Ainda precisam de revisão de estado, progressão, clareza e fontes.

O editor de cenas já reconhece os recursos: seus controles de texto, rótulo, duração, layout e revelação continuam disponíveis, inclusive quando o estilo do vídeo é smooth. Salvar preserva a voz e o histórico; confira a prévia antes de gerar uma entrega nova.

Verificação da integração: `npm run test:explicacoes`. Inclui escolha pelo autoplano, curadoria, preservação de autoria, render nos dois formatos e passagem dos seis recursos pelo QA rígido do smooth. Os testes usam exemplos sintéticos, não comprovam a verdade dos dados nem excelência artística.

Verificação dos novos recursos de movimento: `node --test scripts/producao-movimento.test.mjs`, também incluído em `npm run test:producao`. Cobre unidades contáveis, decomposição, campo tático, limites de quantidade, composição horizontal com título e handle e detecção de sequências estáticas. Demonstração curta: `node scripts/previa-movimento.mjs`.
