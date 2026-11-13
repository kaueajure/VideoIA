---
name: marca
description: Coloca nome, @, cor e logo da página no estúdio. Use para marca, identidade ou troca de cor/@.
---



# Marca da pessoa

O estúdio vem com a marca neutra de fábrica, Sua Página (@suapagina), ou, na cópia do mantenedor, com a marca de demonstração (@exemplo). Esta skill troca pela página de quem comprou. Tudo que for gerado depois (vídeo, carrossel, avatar, banners) sai com a marca nova, porque o motor lê `marca/tokens.json` a cada geração.

Trocar a marca é uma decisão de marca: é um dos três casos em que você pergunta antes de agir. Faça no máximo 3 perguntas, uma de cada vez, sempre com sugestões prontas para a pessoa só escolher.

## 0. Veja a marca atual
Rode `npm run marca -- --ver`. Se já for a marca da pessoa, pergunte o que ela quer mudar e pule para o passo 4.

## 1. Nicho
Pergunte: "Sobre o que vai ser a sua página?" e ofereça as 8 identidades prontas (`npm run marca -- --listar`):

| Preset | Nicho | Cor |
|---|---|---|
| `curiosidades` | Curiosidades | âmbar #FFC83D |
| `dinheiro` | Dinheiro | verde #3EE08F |
| `historia` | História | coral #FF6B5B |
| `biblia-e-fe` | Bíblia e fé | violeta #B794FF |
| `politica-e-atualidades` | Política e atualidades | azul #6FA8FF |
| `ciencia-e-espaco` | Ciência e espaço | ciano #2FD8F0 |
| `cotidiano-e-casa` | Cotidiano e casa | rosa #FF8FB1 |
| `esportes` | Esportes | lima #B6F23A |

Se o nicho não estiver na lista, escolha o preset mais próximo só pela cor e pela bio, e escreva uma assinatura nova com a pessoa.

## 2. Nome e @
Pergunte se ela já tem um nome. Se não tiver, mostre 5 dos 10 nomes de `templates/identidades/<preset>/nomes.md` e ofereça criar outros com os critérios do guia `guias/src/03-nome-e-identidade.md` (curto, fácil de falar e de escrever, diz o assunto, sem marca de terceiro).

Regras do @ que você confere antes de rodar (o comando também confere e avisa):
- só letras minúsculas e números (ponto no meio é aceito; evite sublinhado, que o Facebook não aceita);
- de 5 a 24 caracteres, o que serve nas 4 redes ao mesmo tempo;
- sem acento, sem espaço.

Lembre a pessoa de **conferir se o @ está livre** nas 4 redes e de buscar o nome no INPI antes de criar as contas (passo a passo no guia 03). Você não consegue garantir que um @ está livre; nunca diga que está.

## 3. Cor
Pergunte se ela quer a cor do preset ou outra. Se ela disser uma cor por nome ("azul petróleo"), converta para hexadecimal e mostre. Não precisa se preocupar com contraste: o comando calcula e, se a cor for escura demais para o fundo, clareia até passar no nível AA e avisa.

## 4. Prévia e aplicação
Primeiro gere a prévia, sem trocar nada:
```bash
npm run marca -- --testar --preset <preset> --nome "<Nome>" --handle "@<handle>" [--cor "#RRGGBB"]
```
Abra `marca/teste/design-system.png` (com Read) e confira: nome inteiro visível, símbolo centralizado, slides de carrossel legíveis. Mostre para a pessoa e pergunte "Posso aplicar?". Com o sim, rode o mesmo comando sem `--testar`.

Opcionais: `--curto "Nome"` (o nome que aparece no cabeçalho do carrossel, se o nome for longo), `--letra X` (a letra do símbolo; padrão é a inicial), `--assinatura "frase"` (rodapé do último slide e banner), `--bio "texto"`.

## 5. Entregue
Diga em poucas linhas:
- os arquivos estão em `marca/saida/` e o `perfil.txt` diz onde vai cada um (foto de perfil, banner do YouTube, capa do Facebook, destaque do Instagram) e traz a bio pronta;
- a marca anterior ficou guardada em `marca/historico/`, caso queira voltar;
- vídeos e carrosséis já feitos não mudam; os próximos saem com a marca nova.

## Onde a cor fica
A cor que vai para os vídeos e carrosséis fica só em `marca/tokens.json` (`paginas.curiosidades.destaque`), gravada pelo comando acima. Cor escrita em `ilustrando.config.json`, num arquivo de anotação ou em outro bloco do tokens não vale: o vídeo avisa `marca-fora-do-lugar` e mostra a cor que vale hoje. Depois de aplicar, confira com `npm run marca -- --ver`. Os estilos pontilhismo, linhas, anatomia, fino, preto-branco e impresso são em preto e branco por desenho e não mostram a cor; diga isso se a pessoa usar um deles.

## Não faça
- Não use nome, logo ou cor que imite outra página, empresa, clube, igreja ou partido.
- Não edite `marca/tokens.json` à mão: use o comando, que calcula o contraste e mede o símbolo.
- Sem travessão longo com espaços em nenhum texto.




