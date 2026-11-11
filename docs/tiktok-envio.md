# Envio manual ao TikTok

O botão **Enviar ao TikTok** aparece em cada vídeo na aba **Vídeos**. A configuração e a conexão ficam nessa janela. Não há envio ao renderizar, conectar a conta ou reiniciar o estúdio.

## Configurar no portal TikTok for Developers

Na tela **Minhas organizações**, crie ou selecione sua organização e depois crie o aplicativo no portal. Preencha os dados reais do aplicativo e os endereços de política de privacidade e termos solicitados pelo TikTok. O estúdio local não hospeda automaticamente esses documentos públicos.

1. Configure a plataforma **Desktop** no aplicativo e adicione o **Login Kit**.
2. Em Redirect URI do Login Kit, cadastre exatamente:

   ```text
   http://127.0.0.1:*/api/tiktok/callback/
   ```

   O TikTok admite porta curinga no Login Kit para Desktop. Ela permite usar o estúdio mesmo que a porta local mude. A janela também mostra o endereço com a porta da sessão, se você preferir cadastrá-lo especificamente. Preserve a barra final. [Documentação oficial do Login Kit Desktop](https://developers.tiktok.com/docs/en/login-kit-desktop).

3. Adicione **Content Posting API** e escolha as permissões do modo desejado:

   | Modo no estúdio | Permissões |
   |---|---|
   | Publicar diretamente | `user.info.basic` e `video.publish` |
   | Finalizar no aplicativo | `user.info.basic` e `video.upload` |

4. Configure o ambiente de teste e os usuários autorizados conforme as opções do portal. Solicite as aprovações necessárias. Credenciais de teste e de produção devem corresponder ao ambiente que será usado.
5. Copie **Client key** e **Client secret** para **Configurar aplicativo TikTok**, dentro da janela de envio do estúdio. Escolha o mesmo modo habilitado no portal e salve.
6. Clique em **Conectar TikTok**, depois **Autorizar no TikTok**. Faça login e autorize as permissões solicitadas. Volte ao estúdio para conferir a conta.

Não cole credenciais no chat. Salvar outras credenciais ou trocar o modo desconecta a conta local; conecte novamente para autorizar as permissões correspondentes.

## Publicar diretamente

O estúdio consulta as informações atuais do criador ao abrir a janela e antes de um novo envio. Exibe o nome da conta, as opções de privacidade e as interações permitidas.

Assista à prévia do MP4 final, preencha a legenda e escolha quem pode assistir. Comentários, dueto e costura começam desativados; opções bloqueadas pela conta não podem ser habilitadas. Se houver conteúdo comercial, indique sua marca, outra marca ou ambas. Parceria paga exige visibilidade pública ou para amigos e aceite da política de conteúdo de marca. Marque a identificação de conteúdo de IA quando aplicável.

Aceite a confirmação de uso de música, autorize o envio para a conta mostrada e clique em **Publicar no TikTok**.

**A publicação pública depende da aprovação do TikTok.** Sem auditoria, Direct Post está restrito a testes privados, com a conta privada e visibilidade `SELF_ONLY`. As diretrizes também excluem ferramentas limitadas a uso pessoal ou interno para publicar somente nas contas do próprio desenvolvedor ou equipe. A implementação não garante aprovação e não contorna essas restrições. [Diretrizes oficiais](https://developers.tiktok.com/docs/en/content-sharing-guidelines).

## Finalizar no aplicativo

Nesse modo o estúdio usa o endpoint de upload para a caixa de entrada. Após receber a notificação, abra o TikTok, revise legenda, privacidade e demais opções e conclua a publicação no aplicativo. A mensagem **Vídeo entregue à caixa de entrada** significa que essa etapa ainda depende de você. Também é necessário ter aprovação da permissão `video.upload`. [Fluxo oficial de upload](https://developers.tiktok.com/docs/en/content-posting-api-get-started-upload-content).

## Qualidade, andamento e interrupções

O arquivo precisa ser a entrega final aprovada, com voz real, fontes sem pendências e hash SHA-256 correspondente a `entrega.json`. A prévia e o upload usam o mesmo arquivo. O ffprobe confere o vídeo; o modo direto respeita a duração máxima retornada para a conta.

O progresso representa as partes aceitas pelo TikTok. Após o upload, o estado fica **Aguardando o processamento**, até a consulta confirmar publicação ou entrega à caixa de entrada. Consulte novamente para acompanhar publicação e liberação de identificadores públicos. Não há garantia de tempo de processamento.

Se a conexão cair, clique em **Consultar andamento**. Para continuar um upload incompleto, confirme novamente e use **Continuar envio ao TikTok**. O sistema consulta os bytes aceitos e usa o mesmo identificador de envio. Reiniciar o estúdio não envia bytes automaticamente. O TikTok limita a validade do endereço de upload; após expirar, o registro fica preservado.

Se a conexão cair durante a criação e nenhum identificador for recebido, o resultado fica **incerto**. O botão bloqueia outro envio do projeto para evitar duplicatas. Confira a conta no TikTok antes de qualquer recuperação manual do registro. Envios concluídos ou recusados também não geram outra publicação automaticamente.

## Armazenamento local e segurança

Em `.estudio/tiktok/` ficam `cliente.json`, `tokens.json` e `envios/<projeto>.json`. A pasta é ignorada pelo Git e pelo atualizador. Os arquivos são gravados com permissão `0600` nos sistemas que a suportam; não há criptografia no disco. Proteja sua conta do computador e não compartilhe esses arquivos.

O segredo, os tokens e o endereço privado de upload não são devolvidos nas consultas da interface. O servidor troca os códigos de autorização e renova os tokens, incluindo a rotação do refresh token. O callback verifica estado aleatório de uso único e prazo de validade, com PKCE SHA-256 hexadecimal conforme o TikTok Desktop.

**Desconectar TikTok** remove os tokens locais e tenta revogar o acesso remoto. Se a revogação não for confirmada, a tela orienta a remover a permissão nas configurações da conta TikTok.

## Código e validação

- `src/estudio/tiktok.mjs`: OAuth, regras de publicação, upload e andamento.
- `src/estudio/rotas/tiktok.mjs`: rotas HTTP protegidas pelo token local nos pedidos de escrita.
- `src/estudio/tiktok-ui.js`: configuração e fluxo manual na janela do estúdio.
- `test/tiktok.test.mjs` e `test/tiktok-ui.test.mjs`: testes com respostas simuladas, sem usar contas reais.

As verificações de interface são executadas sem abrir nem controlar o navegador, conforme as regras deste estúdio. A aprovação do aplicativo, a autorização e o primeiro envio real precisam ser conferidos após configurar sua conta.
