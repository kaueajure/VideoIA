---
name: estilo
description: Cria com o usuário a identidade visual do canal — nome da série, estilo (Noite, Papel, Oceano ou Neon) e cor de destaque — e mostra prévias até ele aprovar. Use no primeiro uso do kit (MARCA.assinatura ainda é "SEU CANAL"), ou quando o usuário pedir para mudar o visual, as cores ou o nome que aparece nos vídeos.
---

# /estilo

Fale em português simples: o usuário pode nunca ter mexido com código. Uma pergunta por vez.

## 1. Conheça o canal
- Nome do perfil e da série: aparece pequeno no topo de todo vídeo e no rodapé da capa (ex.: `CURIOSIDADE AGORA`, `VOCÊ SABIA?`, `@seuperfil`). Até ~24 caracteres, em maiúsculas.
- O perfil já tem cores (logo, paleta)? Peça o código (#RRGGBB) ou a descrição ("rosa forte") e converta.
- Assunto do canal (ciência, história, bichos, tecnologia...): ajuda a sugerir o estilo.

## 2. Mostre os estilos
- `npm run estilo -- --todos` → peça para abrir `saida/estilo/estilos.png` (clicar no caminho abre no VS Code).
- Descreva cada um em uma linha (campo `descricao` em `src/kit/estilos.ts`) e recomende um para o assunto do canal:
  Noite (clássico, qualquer tema) · Papel (didático, infantil, história) · Oceano (natureza, ciência, mistério) · Neon (games, tecnologia, internet).

## 3. Teste antes de salvar
- `npm run estilo -- --estilo <nome> [--destaque "#RRGGBB"]` → `saida/estilo/previa.png` (cena + capa). Peça a opinião.
- Contraste: a palavra acesa da legenda precisa ser lida no celular. Papel pede destaque escuro/forte; Noite, Oceano e Neon pedem destaque claro/vivo. Se a cor do usuário tiver pouco contraste, diga e sugira uma variação próxima.
- Quer algo fora dos 4 ("verde e preto")? Crie um estilo novo em `ESTILOS` copiando o mais parecido, ajuste as cores e mostre a prévia.

## 4. Grave e confirme
- Aprovado → `src/config.ts` > `MARCA`: `nome`, `assinatura`, `estilo`, `destaque` (ou `null` para a cor do estilo). Se o usuário usa o arquivo no Drive, ajuste também `ARQUIVO.pastaNoDrive` com o nome do canal.
- `npm run estilo` (sem opções) para a prévia final e `npm run checar`.
- Vídeos para clientes: não mude `MARCA`; crie (se precisar) um estilo novo em `ESTILOS` com as cores do cliente e use `"estilo": {"base", "destaque", "assinatura"}` no `video.json` daquele vídeo. Teste com `npm run estilo -- --estilo <nome> --destaque "#..."`.
- Explique: todo vídeo novo já sai nesse visual; vídeos antigos só mudam se forem renderizados de novo. Dá para trocar a qualquer momento com `/estilo`.
