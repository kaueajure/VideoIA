# Envio manual ao YouTube

Na aba **Vídeos**, cada vídeo possui o botão **Enviar ao YouTube**. O botão **Textos YouTube** continua disponível para consultar e copiar as opções de título e descrição.

## Primeira conexão

1. Abra **Enviar ao YouTube** e expanda **Como configurar e importar o JSON**.
2. No [Google Cloud](https://console.cloud.google.com/apis/library/youtube.googleapis.com), crie ou escolha um projeto e habilite a **YouTube Data API v3**.
3. Configure a tela de consentimento OAuth. Se o aplicativo estiver em teste, inclua sua conta nos usuários de teste.
4. Crie um cliente OAuth do tipo **Aplicativo para computador** e baixe o JSON.
5. Importe esse arquivo na janela do estúdio. Não envie o JSON nem suas credenciais no chat.
6. Clique em **Conectar canal Google**, depois em **Autorizar no Google**. Autorize a leitura do canal e o envio de vídeos. Confira a conta e o canal escolhidos.
7. Volte à janela do estúdio. O nome e o identificador do canal aparecerão acima dos dados do vídeo.

A conexão usa OAuth com PKCE e retorno ao endereço local do estúdio. Não é necessário configurar um site público para este aplicativo local. Os requisitos e eventuais verificações do aplicativo são administrados pelo Google: [OAuth para aplicativos de computador](https://developers.google.com/identity/protocols/oauth2/native-app).

## Enviar um vídeo

1. Assista à prévia do arquivo final.
2. Revise título, descrição e tags. A primeira opção do pacote `youtube.json` preenche os campos; as hashtags que ainda não estiverem na descrição são acrescentadas. É possível editar os textos antes de enviar.
3. Escolha **Privado**, **Não listado** ou **Público** e responda às declarações sobre conteúdo infantil e conteúdo realista alterado ou sintético.
4. Marque a autorização do envio para o canal exibido.
5. Clique em **Enviar ao YouTube** e mantenha o estúdio aberto até concluir.

Gerar um vídeo, abrir essa janela, importar credenciais e conectar o canal **não enviam vídeos**. A confirmação e o clique são obrigatórios. O YouTube ainda processa o arquivo após recebê-lo; a conclusão do upload não garante que o processamento ou a moderação tenham terminado.

Somente a entrega com `publicavel: true`, QA aprovado, voz real, fontes sem pendências e MP4 final disponível pode ser enviada. O servidor confere o SHA-256 do arquivo contra `entrega.json`. A prévia usa exatamente o arquivo identificado nessa entrega. Se o vídeo ou o canal mudarem depois de abrir a janela, reabra e revise antes de confirmar.

## Interrupções e duplicatas

O upload usa o [protocolo retomável do YouTube](https://developers.google.com/youtube/data/guides/using_resumable_upload_protocol). O progresso exibido representa os bytes confirmados pelo YouTube.

Se a rede cair ou o estúdio fechar, abra novamente o botão do mesmo projeto. Marque a confirmação e use **Continuar envio ao YouTube**. O estúdio consulta a sessão anterior antes de continuar; não retoma automaticamente ao reiniciar. Uma sessão em andamento mantém os metadados originais e o canal original.

Após um envio confirmado, o estúdio mostra **Abrir vídeo no YouTube** e bloqueia outro upload do mesmo projeto. Se a sessão expirar, o registro é preservado e nenhum novo upload é criado automaticamente. Confira o canal antes de qualquer recuperação manual para evitar duplicação.

## Credenciais e registros

Os arquivos ficam em `.estudio/youtube/`, pasta ignorada pelo Git e pelo mecanismo de atualização:

- `cliente.json`: credenciais do cliente OAuth importadas.
- `tokens.json`: autorização renovável e identificação do canal.
- `envios/<projeto>.json`: estado, metadados, hash e sessão do envio.

Os arquivos são gravados com permissão `0600` nos sistemas que a suportam. Não são criptografados no disco; proteja a conta do computador e não compartilhe essa pasta em backups públicos. Tokens, segredo do cliente e endereço privado da sessão não são devolvidos nas consultas da interface.

**Desconectar canal** remove a autorização local e tenta revogá-la no Google. Se não houver rede, a tela informa que a revogação remota pode ficar pendente. Importar novas credenciais também desconecta a conta local, sem excluir vídeos do YouTube.

## Pontos de implementação

- `src/estudio/youtube.mjs`: OAuth, validação, registros privados e upload.
- `src/estudio/rotas/youtube.mjs`: rotas HTTP do estúdio.
- `src/estudio/youtube-ui.js`: janela de configuração, revisão e envio manual.
- `test/youtube.test.mjs` e `test/youtube-ui.test.mjs`: testes com Google simulado, sem publicar vídeos reais.

As operações de escrita exigem o token local do estúdio. O callback OAuth exige estado aleatório válido, de uso único e com prazo de validade. Nenhuma integração foi adicionada ao final do pipeline de renderização.
