# Comparar entregas

Cada chamada de entrega registra `projetos/<nome>/versoes/<id>/`: MP4 independente, roteiro, cena, palavras, fontes, manifesto de voz quando disponível e `versao.json` com cenas compiladas, hashes e QA. Entregas iguais são deduplicadas. Revisões com pendências também são guardadas, com a situação registrada na época; isso não libera publicação. Não há upload ou restauração automática.

Abra **Projetos > Comparar versões** depois de gerar pelo menos duas entregas. Escolha Antes e Depois e uma cena. O botão de início posiciona cada vídeo no início daquela cena; sincronizar usa a fração percorrida na cena de Antes, acomodando durações diferentes. A interface mostra cenas adicionadas, removidas ou alteradas, arquivos que mudaram e avisos/falhas novos ou resolvidos. As cores globais, efeitos e configuração compilada também participam da assinatura das cenas. Um aviso resolvido não comprova melhoria factual ou artística.

O histórico começa após esta atualização: renders anteriores não são reconstruídos. Os vídeos consomem disco e não são apagados automaticamente; a interface informa o volume total. A cópia usa reflink quando suportado, com fallback nativo de cópia, sem hardlink: sobrescrever o vídeo ativo não altera o anterior. Mantenha espaço para outra cópia do render. Falha ao gravar o histórico interrompe a entrega, preservando o MP4 gerado; corrija o erro indicado e tente novamente.

Isto é um arquivo de resultados para comparação, não um pacote completo de reconstrução: peças locais, fontes instaladas, ativos e dependências do motor não são copiados. As versões nunca devem ser editadas à mão. Para publicar, vale a checagem da entrega atual, inclusive alterações posteriores em fontes e revisão factual.
