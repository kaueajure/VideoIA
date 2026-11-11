# Evidências por afirmação

Cada projeto de vídeo tem `fontes.json`, versão 1. Ele liga o texto narrado a afirmações identificadas, cada uma com evidência, fonte, data e ressalvas. O motor verifica registros e vínculos; a IA responsável pela pesquisa abre as fontes e confere se elas sustentam a frase, inclusive qualificadores e contexto. Uma URL e o estado `verificada` não comprovam verdade.

`fontes.md` continua guardando pesquisa livre, pendências e créditos/licenças de imagens, vídeos e áudio. O registro JSON não substitui os créditos de mídia. Não apague seções antigas para fazer a checagem passar.

## Fluxo do agente

1. Pesquise o tema em fontes primárias e independentes, conforme o objetivo. Nunca marque uma página não aberta como consultada.
2. Finalize o texto narrado. Para iniciar um registro sem sobrescrever pesquisa anterior, use `npm run fontes -- <projeto> --iniciar`. O comando cria afirmações **pendentes**, uma por parágrafo, sem inventar fontes. Ele sai com código 1 enquanto houver pendências.
3. Edite `fontes.json`: divida parágrafos com várias alegações em trechos menores; registre as evidências e confira a equivalência entre a fala, a afirmação e o trecho da fonte. Classifique convites, perguntas e opiniões como editoriais somente quando não afirmarem fatos, com justificativa explícita. Não use a classificação editorial para esconder alegações sem fonte.
4. Rode `npm run fontes -- <projeto> --exportar` antes da voz final. A saída inclui ids e falas que precisam de pesquisa/correção. A nota editorial do roteiro permanece independente dessa checagem.
5. Depois de voz e cenas prontas, rode `npm run fontes -- <projeto> --video --exportar`. O motor cruza palavras e intervalos para encontrar os beats de cada afirmação. Revise também os quadros; a correspondência por intervalo não avalia a semântica da imagem.
6. Produza a entrega. A liberação factual exige a checagem do vídeo completo, não apenas do roteiro. Voz real, QA, avisos altos, revisão humana do objetivo e pendências em `fontes.md` continuam sendo condições próprias da publicação.

A pesquisa e as correções continuam autônomas. Não solicite aprovação humana para preencher o registro; resolva a pendência na fonte ou reduza/retire a alegação e ajuste o roteiro, o registro, a voz e as cenas afetadas. Só interrompa nos bloqueios já previstos pelo estúdio.

## Estrutura

Este é um modelo **pendente**, não uma evidência pesquisada:

```json
{
  "versao": 1,
  "fontes": [{
    "id": "s-primaria",
    "titulo": "Título da página realmente consultada",
    "url": "https://example.com/documento",
    "publicador": "Instituição responsável",
    "consultadaEm": "2026-11-11"
  }],
  "afirmacoes": [{
    "id": "f-mecanismo",
    "texto": "Afirmação precisa, com o mesmo alcance da fala.",
    "tipo": "fato",
    "estado": "pendente",
    "evidencias": [],
    "ressalvas": []
  }],
  "trechos": [{
    "id": "t-mecanismo",
    "texto": "Afirmação precisa, com o mesmo alcance da fala.",
    "tipo": "factual",
    "afirmacoes": ["f-mecanismo"]
  }, {
    "id": "t-convite",
    "texto": "Observe o fenômeno.",
    "tipo": "editorial",
    "justificativa": "Convite à observação, sem nova alegação factual."
  }]
}
```

Quando conferir a alegação, acrescente `verificadaEm: "AAAA-MM-DD"`, mude `estado` para `verificada` e preencha `evidencias` com objetos deste formato:

```json
{"fonte":"s-primaria","trecho":"Transcrição curta realmente conferida.","localizacao":"Seção, página ou parágrafo do documento"}
```

- Ids de fontes, afirmações e trechos: letras minúsculas, números e hífen, começando por letra, até 64 caracteres. Não repita ids dentro de cada lista. Os ids dos beats mantêm o contrato da cena: texto não vazio e único, inclusive números e sublinhados.
- `estado`: somente `verificada` é apto para publicação. `pendente` e `contestada` mantêm a entrega bloqueada. Uma ressalva não transforma automaticamente uma controvérsia em certeza; confira a formulação atribuída e com o alcance correto.
- `ressalvas`: lista de limites importantes da evidência. O sistema as apresenta, mas não verifica se foram ditas no roteiro; o agente precisa conferir essa correspondência.
- `validadeAte` é opcional para fatos sujeitos a mudança. Depois da data, pesquise novamente. Datas de consulta/verificação precisam existir e não podem estar no futuro.
- `tipo: "numero"`: use para qualquer alegação quantitativa, inclusive por extenso. Exige duas URLs e dois publicadores informados distintos. Algarismos no texto também ativam esse mínimo. `fontesMinimas` pode exigir mais fontes; não reduz o mínimo. Nomes distintos não provam independência editorial: a pesquisa precisa conferir isso.
- `trechos[].texto` transcreve o texto narrado atual, com pontuação. STATUS, GANCHOS, cabeçalhos, comentários e tags de voz não fazem parte dele. Espaços e quebras de linha são normalizados; asteriscos de destaque são removidos. A cobertura precisa incluir toda a fala, sem sobreposição. Texto repetido exige `ocorrencia`, começando em 1.
- Um trecho pode citar várias afirmações; uma afirmação pode ser usada em vários trechos. Registros de pesquisa sem uso não liberam nem bloqueiam afirmações usadas no vídeo, mas são listados como aviso.

## Vínculos com as cenas

O relatório mostra palavras, tempos e ids dos beats que se sobrepõem a cada trecho. A voz alinhada precisa corresponder ao roteiro atual, e os beats precisam cobrir suas palavras. Cenas escritas com `frases` são compiladas antes da checagem.

Para uma alegação adicional que apareça somente no título, número, gráfico ou documento, declare o vínculo no beat ou no elemento:

```json
{"id":"comparacao","palavras":[0,8],"afirmacoes":["f-mecanismo"],"elementos":[]}
```

O id precisa existir e ter evidências completas. O motor não descobre automaticamente fatos visuais nem compreende se uma imagem sustenta uma afirmação; essa revisão continua necessária.

## Relatórios, prévia e publicação

- `saida/fatos-check.json`: checagem completa, com códigos, afirmações, trechos, tempos, beats, fontes e pendências.
- `saida/fontes-factuais.md`: resumo legível, gerado com `--exportar`. Nunca sobrescreve `fontes.md`.
- `saida/relatorio.json`: inclui `factual` nas produções novas, inclusive com `--sem-render`.
- `saida/entrega.json`: inclui `factual.aprovado`, `escopo: "video"` e uma assinatura dos quatro arquivos de entrada (`roteiro.md`, `fontes.json`, `palavras.json`, `cena.json`). `publicavel` fica falso com pendências factuais.
- O estúdio mostra as pendências atuais em Fontes e em Controle de qualidade. A prévia e o download continuam disponíveis para corrigir o conteúdo.
- O status e os preparadores de envio reavaliam os registros. Alterar qualquer entrada invalida o vínculo com a entrega anterior, mesmo que o registro novo seja válido. Refaça a entrega para vincular o vídeo à revisão atual; o render pode aproveitar o cache.

Projetos antigos sem `fontes.json` continuam renderizando para revisão. Para publicar ou reenviar, precisam migrar os registros e gerar uma entrega nova. Não há aprovação factual automática para fontes apenas listadas em Markdown.

Um exemplo pesquisado está em [`exemplos/fases-da-lua/`](exemplos/fases-da-lua/README.md), com roteiro, evidências e cenas e o procedimento de remoção de uma evidência.

Os workers de YouTube e TikTok também reavaliam as fontes imediatamente antes de abrir uma sessão de envio e antes de transmitir cada parte, inclusive depois de renovar a autorização. Uma alteração durante uma requisição já em andamento não pode desfazer os bytes que foram transmitidos; as partes seguintes ficam bloqueadas.

A pesquisa assistida é uma etapa adicional opcional: [pesquisa-assistida.md](pesquisa-assistida.md). Quando iniciada, suas pendências e versões também integram a liberação e a assinatura da entrega.
