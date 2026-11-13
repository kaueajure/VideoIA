# Evidência visual

## Antes da busca

Parta da afirmação narrada e de uma fonte verificável. Anote em `fontes.md` qual fonte sustenta a ação central e o que identificaria uma imagem do caso. Use a página da partida, órgão, obra ou instituição quando houver. Em um fato controverso, preserve atribuições e incertezas.

Escolha a função da imagem em cada trecho:

- **Registro.** A página de origem e o conteúdo visível sustentam que a imagem mostra o acontecimento citado. Verifique data ou período, envolvidos e sinais como uniforme, local ou edição.
- **Contexto.** Retrato, objeto ou lugar verificável para identificar o assunto. Coloque no trecho de apresentação. Se a montagem puder sugerir que a foto é do lance, escolha outro trecho ou identifique a foto como ilustrativa.
- **Explicação visual.** Use diagrama, mapa, placar ou peça quando precisar explicar uma regra, ou quando faltar um registro verificável e reutilizável.

## Buscar e fixar o arquivo

1. Priorize a imagem anexada pela pessoa se ela combinar com o trecho. Abra o arquivo para conferir a identidade e o contexto.
2. Monte uma consulta com nome, ação e contexto. Comece pelos trechos mais importantes. Exemplo de busca para um lance: nome do jogador + equipes + competição + data.
3. Pesquise em qualquer fonte acessível: buscadores de imagens, imprensa, órgãos, clubes, museus, arquivos, universidades, fotógrafos e bancos de imagens. Não se limite a Commons, Wikipédia ou Openverse. Abra as páginas de origem e compare os candidatos em tamanho real; registre identidade, contexto, data/local e direito de reutilização.
4. Para o Commons, rode `node scripts/buscar-imagem.mjs <projeto> "<termo>" --listar`. Abra a página do candidato, compare a descrição com a fonte factual e confira licença e autoria. O título ou o nome do arquivo serve como pista.
5. Baixe pelo ID conferido com `node scripts/buscar-imagem.mjs <projeto> "<mesmo termo>" --id=<id> --nome=<nome-descritivo>`. Para logo, mantenha `--logo`. Abra o arquivo baixado e confirme que é o mesmo candidato e que o recorte lê bem.
6. Para arquivos de outros sites, use o mesmo comando com `--url=<arquivo-direto> --pagina=<origem> --autor="<autor>" --licenca="<condicoes-de-uso>" --licenca-url=<pagina-das-condicoes>`. Não use a miniatura do buscador como original. O importador confere formato e tamanho, mas não reconhece pessoas nem comprova autorização: confirme isso na origem e olhando o arquivo.
7. Use literalmente o `assets/…` devolvido pelo comando. Ele já registra o crédito em `fontes.md`. Preserve a seção `## Imagens` ao complementar as fontes do roteiro. Para arquivo anexado, mantenha o caminho `assets/referencias/…` e o crédito fornecido pela pessoa, quando houver. Quando o arquivo não couber no trecho ou no estilo, use o recurso explicativo e registre a troca.

Se tiver uma ferramenta de busca de imagens disponível, use-a para achar páginas de origem ou confirmar o contexto. A busca da Brave é opcional e exige chave. A licença e o crédito precisam ser verificados na origem.

Métodos de referência. [Grounded Citations](https://github.com/nousresearch/hermes-agent/blob/main/skills/research/grounded-citations/SKILL.md) · [Brave Images Search](https://github.com/brave/brave-search-skills/blob/main/skills/images-search/SKILL.md) · [Reutilização no Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)

## Critérios para aceitar a imagem
- Compare pelo menos três candidatos para cada imagem principal quando disponíveis e explique a escolha em `fontes.md`. Registre consultas e candidatos rejeitados por homônimo, evento errado, baixa resolução ou recorte ruim.
- Confira rosto/identidade, objeto/modelo, uniforme, clube/cargo, evento, data e lugar quando forem relevantes. Não reutilize uma foto de outro acontecimento como registro do fato atual.
- Prefira original com lado menor de pelo menos 720 px; para protagonista em tela grande, busque 1080 px ou mais na área que ficará visível. Ampliar uma miniatura não cria detalhes. O importador aceita `--min-lado=<pixels>` para um uso menor justificado, como uma foto histórica sem original maior.
- Abra também o arquivo baixado e confira o recorte no quadro do vídeo. Não marque a foto como aprovada visualmente sem vê-la. Se não conseguir conferir a imagem neste ambiente, registre a pendência e não declare a identidade confirmada.
- Se nenhum candidato servir, refine a busca com data/local/ação, traduza termos e mude de origem. Persistindo a falta de uma foto correta, use uma explicação visual fiel e registre a limitação; nunca uma foto errada.
