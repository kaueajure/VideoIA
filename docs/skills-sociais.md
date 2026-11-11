# Skills sociais instaladas no Metodo-Video

As quatro skills solicitadas estão disponíveis no primeiro nível de `.claude/skills/` e `.agents/skills/`. Os arquivos originais ficam em `_terceiros/`, com referências, licença e versões fixadas em `skills-sociais.lock.json`. As entradas do primeiro nível são adaptadores locais, não cópias que se atualizam pela rede.

| Skill local | Origem | Uso no projeto |
|---|---|---|
| `social-captions` | [Roman Knox / rediumvex](https://github.com/rediumvex/social-media-caption-generator-claude/tree/37cad5471762609282583d9fb3e7b532d609630e) | Primeira versão das legendas por plataforma |
| `viral-captions-and-ctas` | [Vyral](https://github.com/vyralcontent/content-skills/tree/349e495d97029a3e6303a7510e3f39c73f36d8fe/skills/viral-captions-and-ctas) | Revisão de legendas, CTA, hashtags e comentário |
| `viral-short-form` | [Vyral](https://github.com/vyralcontent/content-skills/tree/349e495d97029a3e6303a7510e3f39c73f36d8fe/skills/viral-short-form) | Revisão de gancho, desenvolvimento e conclusão antes da voz |
| `social-content` | [Corey Haines, upstream `social`](https://github.com/coreyhaines31/marketingskills/tree/1f837447b20bb6f0e72d87b80ece1c221c362c7d/skills/social) | Formatos, reaproveitamento e calendário quando pedidos |

Todas as origens instaladas têm licença MIT, preservada junto às cópias. `viral-captions-and-ctas` já existia como referência byte a byte igual à versão fixada; foi reaproveitada. A referência anterior `viral-youtube-shorts` continua disponível.

## Como o projeto usa

- `pauta`: chama `social-content` se houver planejamento/reaproveitamento, sem impor essa etapa a cada vídeo.
- `roteiro`: aplica `viral-short-form` antes de liberar a fala final e a voz.
- `publicar`: usa `social-captions` para as legendas e `viral-captions-and-ctas` para a revisão, preservando a verificação da entrega.
- `youtube`: usa os métodos de caption/CTA, mas continua sendo o único responsável por `youtube.json`, incluindo tags.
- O prompt do chat do estúdio aponta esse roteamento. Uma tarefa exclusiva de YouTube não chama produção; tarefas de pesquisa ou correção visual não disparam revisão de roteiro ou publicação.

São instruções para o assistente conectado (Codex, Claude Code ou Cursor), não geradores determinísticos do motor de vídeo. Instalar uma skill não cria conta, conexão, agenda ou serviço. O motor não passa a chamar uma API de marketing. O assistente precisa ler as skills e produzir os arquivos; os validadores existentes continuam conferindo fontes, roteiro e metadados de envio. A qualidade editorial requer revisão.

## Entradas e precedência

Leia o roteiro final e as fontes atuais, o objetivo da entrega, as orientações da página em `docs/identidade-e-voz.md` e escolhas já registradas em `youtube.json`/`post.md`. Consulte os campos necessários de marca/configuração, sem ler `.env` ou credenciais. O pedido da pessoa e o contrato local prevalecem sobre fórmulas dos materiais de referência.

Adaptações deliberadas:

- Use o idioma do roteiro, normalmente pt-BR. O requisito de inglês do original Social Media Caption Generator não se aplica aqui.
- Gere somente as plataformas pedidas. Sem indicação, o pacote do estúdio cobre Instagram Reels, Facebook Reels, TikTok e YouTube. Threads, grupo do Facebook, LinkedIn ou carrossel entram quando pertinentes ao pedido; não produza sete versões automaticamente para uma solicitação de uma rede.
- Preserve fatos, atribuições e ressalvas. Não adicione números, resultados pessoais, depoimentos, links, produtos ou promessas sem evidência para preencher uma fórmula.
- Percentuais de alcance, regras de algoritmo, horários e cadências das referências são hipóteses de trabalho, não fatos verificados. Não repita os percentuais sem fonte. Antes de afirmar limite ou capacidade atual de uma plataforma, verifique sua documentação oficial. Não é necessário pesquisar algoritmo para redigir cada legenda.
- Preserve o CTA do objetivo e a escolha da pessoa. Uma ação principal por texto; sem oferta, assinatura, link ou comentário automatizado que o projeto não disponibilize.
- Não force termos de urgência, promessas de viralização, perguntas artificiais ou pitches dos autores. Regras de formato rígidas são ajustáveis ao objetivo e às ressalvas necessárias.
- Preparar textos não autoriza envio, agendamento ou interação em redes. O fluxo de upload existente mantém suas confirmações. Pendências podem ter rascunhos explicitamente identificados; não podem ganhar status de publicação aprovada.

## Saídas compatíveis

`post.md`, em `projetos/<nome>/`, continua sendo a saída de legendas. Preserve as palavras-chave, o texto alternativo, as fontes e créditos exigidos por `publicar`. Cada plataforma pedida recebe legenda, hashtags pertinentes, CTA coerente e sugestão de comentário. O CTA pode já estar no texto; não o repita como segundo pedido. O comentário é uma proposta editorial, não uma ação executada. Texto na tela após render deve ir para `texto-na-tela.md`, sem alterar o vídeo nesta etapa.

Para YouTube, preserve o schema já consumido pela interface:

```json
{
  "gerado": "data ISO da geração",
  "formato": "vertical",
  "titulos": ["opção 1", "opção 2", "opção 3"],
  "descricoes": ["opção curta", "opção média", "opção completa"],
  "tags": ["assunto", "termo de busca"],
  "hashtags": ["#Assunto", "#Nicho", "#Shorts"]
}
```

`tags` são termos do campo Tags do Studio, sem `#`; `hashtags` são marcadores no texto. Use os limites e o checklist da skill `youtube`, sem misturar os campos. Preserve uma escolha anterior válida ao copiar título e descrição para `post.md`. Ao revisar só uma opção, não gere o restante novamente nem toque em voz/cenas. Horizontal conserva seu formato e não recebe `#Shorts` automaticamente.

A revisão do roteiro vai para `revisao-roteiro.md`; o plano social, para `plano-social.md`. Esses relatórios não entram na narração. Mudanças autorizadas na fala exigem conferir fontes, palavras e cortes antes da próxima entrega.

## Como pedir no chat

- “Prepare as legendas do projeto X para Instagram, Facebook, TikTok e YouTube, com hashtags e tags do Studio.”
- “Revise onde o roteiro do projeto X perde atenção, antes de gerar a voz.”
- “Sugira três reaproveitamentos deste vídeo para a próxima semana, sem agendar.”

Os mesmos pedidos funcionam no chat do estúdio conectado a um assistente. Os adaptadores locais também podem ser invocados pelo nome (`social-captions`, `viral-captions-and-ctas`, `viral-short-form` e `social-content`).

## Atualização e verificação

Edite adaptadores em `.claude/skills/` e rode `npm run sincronizar`; `.agents/skills/` e o índice de `AGENTS.md` são gerados. `npm run sincronizar -- --conferir` verifica a correspondência. Reabra o Codex após alterações nas skills; os arquivos estarão disponíveis para descoberta na próxima interação que recarregar o catálogo. Reinicie o estúdio para carregar mudanças do módulo do chat.

Para atualizar origens, escolha um commit, revise os arquivos, preserve as licenças, atualize hashes no lock e confira se as adaptações continuam válidas. Não substitua as regras do projeto pela versão remota automaticamente.
