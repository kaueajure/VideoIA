---
name: cena
description: Escreve o cena.json de um vídeo do Estudio de videos, o que aparece na tela em cada trecho da narração. Use depois da narração, antes do QA.
---



# Direção de cena

## O que ler (só o necessário)
1. `docs/cena-schema.md`: o índice curto (beat, elementos comuns, modelos de cena) com a tabela "Onde está cada parte".
2. **Só o arquivo do estilo da vez** em `docs/cena/`, pela tabela do índice (sem `estilo` na cena: `docs/cena/estilo-padrao.md`). Os outros arquivos de `docs/cena/` (cenários, peças, repertório, efeitos, som) só quando a cena pedir.
3. `projetos/<nome>/palavras.json`.

Estilo de kit aberto (letreiro, interface, colagem, cartões, tubo, impresso, ribalta, mundos): o `pecas.js` vem antes do plano, `docs/cena/kit-aberto.md`. Anatomia e fino: autoria obrigatória antes do render, `docs/cena/estilos-motion.md`.

**Atalho: use um modelo pronto sempre que o formato tiver um.** Em `beat`, `"modelo": {"nome": "comparativo|antes-depois|mito-fato|ranking|passos|causa-efeito", ...}` gera peças, rótulos, posições e entradas já ajustados. Veja os parâmetros em `docs/cena-schema.md`. Modelo pronto é o caminho barato e confiável; escreva elementos à mão só quando a ideia pedir.

**Modelo de vídeo** (não confundir com o modelo de cena acima): o do STATUS do roteiro ou o padrão da página (`npm run modelos -- --ver <id>`). Dele vêm o `estilo` (e os `efeitos`) quando a cena não define, os cenários preferidos (o primeiro é o padrão), as cenas compostas e as peças sugeridas (`pecasBase`), os títulos (`por-etapa`: "Passo 1", "Passo 2"), a câmera, a transição e o ritmo (`beatSeg`, `beatsMax`). O que você escrever no `cena.json` sempre vence o modelo. Peça que o tema pede e não está no modelo nasce no `pecas.js` do projeto, como sempre.

## Imagens de referência da pessoa (antes do plano)
Se existir `projetos/<nome>/assets/referencias/` (ou `referencias.md` / seção no `PEDIDO-DO-ESTUDIO.md`):
1. Liste os arquivos e **abra cada imagem com Read** (não chute o conteúdo pelo nome).
2. Cruze com o roteiro e o `palavras.json`: para cada foto, escolha **o beat** em que a fala combina com o que a imagem mostra.
3. Coloque no beat: `{"tipo": "imagem", "arquivo": "assets/referencias/<arquivo>", ...}` (forma `card` ou `circulo` conforme o assunto). Registre em `fontes.md` como fornecida pela página.
4. **Cada arquivo entra no máximo uma vez** no `cena.json`, salvo se a fala pedir de novo o mesmo assunto de forma clara (aí pode repetir). Não espalhe a mesma foto em vários beats “para preencher”.
5. Foto que não casa com nenhum trecho: deixe de fora e diga em uma linha no relatório; não force.
6. Essas fotos **já foram escolhidas pela pessoa**: não peça aprovação de novo (diferente das fotos buscadas no Commons).

Se precisar escolher imagens reais ou dirigir câmera e transição, siga `pesquisa-visual`. Em `cena.json`, fixe no beat o campo `arquivo` devolvido pelo download ou o caminho anexado pela pessoa. Use o guia do estilo para o tipo de elemento e mantenha a imagem conferida durante os ajustes.

## Método
1. **Ache a analogia visual.** Um objeto ou par de objetos que carregue a ideia do começo ao fim (um cubo que é o buraco e uma lâmina que é a tampa; uma pilha de moedas que encolhe). Se a ideia é abstrata, use ícone em traço.
2. **Divida em beats por ideia**, não por frase: cada beat é uma ideia. Marque `palavras: [i, j]` com os índices do `palavras.json`. Beats de 1,5 a 3,5 s (veja Ritmo abaixo).
3. **Para cada beat, escolha o que muda na tela.** Entrada sincronizada com a palavra que nomeia (`"entra": "tampa"`). Um elemento em destaque.
4. **Título só onde ajuda**: gancho, virada e fecho. Até ~40 caracteres, 2 linhas.
5. **Número forte vira `contador`**, entrando na palavra do número.
6. **Respiro.** Não encha: 1 a 3 elementos por beat. O motor encaixa o tamanho e centraliza.

## Ritmo e didática (regras duras, o QA confere)
- **Beat de 1,5 a 3,5 s, no máximo 4,5 s.** Acima de 7 s o QA avisa; acima de 12 s reprova. Use `node src/video/cli.mjs <projeto> --trechos` para ver cada oração com os índices de palavra e escreva beats com `"palavras": [a, b]`, um por oração ou ideia.
- **Uma ideia, uma animação que a explica.** Se a narração diz "oito dígitos", a tela mostra oito unidades (`grade`) acendendo. Se diz "uma de dez regiões", mostra dez e uma acende. Não decore: demonstre.
- **Receita para explicar um número com animação:** (1) mostre o todo, (2) destaque a parte (acende, cresce, separa), (3) conte (`contador`) no instante em que é dito, (4) compare com algo familiar, (5) deixe 0,5 s de respiro antes da próxima ideia.
- **Nunca tela vazia:** o primeiro elemento do beat entra em até 0,5 s. Em beat de mais de 3 s, entre outro elemento (rótulo, traço, peça) na palavra seguinte.
- **Pessoa citada pelo nome aparece com foto real e recente** (elemento `imagem`, em círculo; `scripts/buscar-imagem.mjs`), nunca boneco genérico no lugar dela. Boneco só para quem não tem nome ("os investidores"). O QA avisa ("pessoa-sem-foto"). **Busca automática em projetos antigos ou quando solicitada:** escreva `{"tipo": "imagem", "busca": "Lula", "contexto": "presidente", "reserva": "presidentefaixa"}`. O `"contexto"` é obrigatório e sai do tema do vídeo (clube, seleção, cargo, obra), nunca vazio. Sem internet ou sem foto livre, entra a `reserva` e o aviso diz o que fazer.
- **Foto tem de ser do tema (checagem sua, não sorteio).** Antes de deixar a foto na cena: (1) termo = nome + contexto do tema; (2) `--listar` e ler título/descrição dos candidatos; (3) descartar homônimos de outro domínio; (4) abrir a imagem e confirmar visualmente quem/o quê aparece; (5) se não bater com a fala daquele beat, não usar. Primeiro resultado do Commons não vale por ser o primeiro. Nesta página, depois da checagem, mostre as que passaram e espere a pessoa marcar entra/sai (skill `video`).
- **Peça fixa (0.6.22):** peça que você escreve à mão não é trocada pelo estúdio; se for metáfora que a fala não cita (cérebro para "burro"), marque `"fixa": true` no elemento para não gerar aviso. Detalhes em `docs/cena/estilo-padrao.md`.
- **Objeto pelo assunto da fala (0.6.12):** cada peça e cenário tem relação verificável com o que a voz diz NAQUELE beat. Nada de forma geométrica (cubo, esfera, anel) ou objeto decorativo sem a fala pedir. Depois do `--sem-render`, abra `saida/relevancia.json` (fala, o que aparece e nota de 0 a 3 por beat): nota 0 é defeito, troque a peça.
- **Ação e objeto da fala, beat a beat (regra do estúdio, 05/11/2026):** a forma de cada beat sai da AÇÃO e do OBJETO que a fala daquele beat diz ("acorda" é despertador, "dorme" é cama, "manda pra um amigo" é compartilhar), nunca só do assunto do vídeo nem de um rodízio de formas. Sem nada que represente a frase, use a figura neutra do estilo + o texto da fala, nunca uma decoração qualquer. O plano automático já decide assim e grava em `cena.falaForma` (`por`: regra, conceito, intencao, fala, foto, numero, texto, cenario ou neutro); confira com `auditarFalaForma` (`src/video/fala-forma.mjs`): `falhas` do tipo `fala-desenho` é defeito. Ação frequente sem figura entra no dicionário comum (`docs/planejador-fala-forma.md`).
- **Ambiente 3D de fundo** (`"cenario"`) em pelo menos 1 de cada 4 beats, onde contextualiza: `tribunal` (STF, Justiça, PF), `escritorio` ou `cidade` (banco, mercado), `palanque` (debate, eleição), `sala` (casa). Uma ideia, um lugar. O QA avisa ("pouco-cenario").
- **Cenários por tema:** política `plenario`, `palanque`, `debate`, `sala-imprensa`, `secao-eleitoral`, `gabinete`, `estudio-tv`, `planalto`, `congresso-exterior`; justiça `tribunal`, `stf`, `delegacia`, `presidio`; economia `agencia-banco`, `mercado-financeiro`, `escritorio`, `sala-reuniao`, `fabrica`, `agro`, `porto`, `posto-gasolina`, `supermercado`, `aeroporto`; tecnologia e ciência `data-center`, `laboratorio`; Brasil e cotidiano `favela`, `praia`, `estadio`, `igreja`, `rua-dia`, `rua`, `rua-noite-chuva`, `onibus-interior`, `cidade`, `sala`, `cozinha`, `quarto`, `sala-aula`, `hospital`, `mesa`, `campo`. Escolha o lugar que a voz descreve naquele beat; se nenhum serve, crie no `pecas.js` do projeto.
- **Número grande (contador) e título ficam sobre fundo limpo:** sem cenário com janelas, luzes ou ripas na altura do texto (cidade, escritório, sala, fábrica atrás do título; também tribunal atrás do número): texto branco sobre janela clara some.
- **Protagonista grande:** a peça 3D ocupa 55 a 70% da altura útil. Peça que ficou minúscula ganha `escala` ou `fator`. Foto de pessoa é menor (0.6.12): sozinha `largura` 560 a 620, com título 520, dupla 400 a 420 cada; cartão de documento até 780 x 700 (ou o recorte do trecho com marca-texto).
- **Peça larga e resolução (0.6.22):** peça com largura de 1,6 vez a altura ou mais (carro, ônibus, carrinho, avião) se dimensiona pela proporção: o motor a põe na largura útil e deixa a câmera quase parada; não force `camera.forca` alta nem `fator` baixo nela (o QA avisa `peca-larga-pequena`). Foto, logo ou obra grande precisa de arquivo que aguente o tamanho: ampliada mais de 1,5 vez, o QA avisa `resolucao-baixa`; troque por versão maior ou mostre menor. `entrada` vale também em `logo` e `bandeira` (gira, cresce, desliza). Na teologia, a obra muda com o assunto do beat (medalhão para pessoa, `tela` para drama, `gotico` para igreja, `arco` para glória, `rasgado` em sépia para escrito), nunca a mesma moldura no vídeo todo.
- **Variar (0.6.12, objetivos curiosidade e noticia):** número que a voz fala sozinho (beat de até 8 palavras) fica sem legenda; o rótulo do número dá contexto, nunca repete a fala. Varie a `entrada` do protagonista (peça: queda, gira, cresce, desliza; foto: iris, desliza, aro, aproxima; cartão: papel, recua; número: dispara, rolo, placar), nunca a mesma em 2 beats seguidos, e ponha cenário do tema no máximo a cada 3 beats (número também). Gancho: frase curta inteira no título do beat 1 (até 4 palavras entra de uma vez). Política: até 60 s.
- **Dois elementos no beat (peça, foto ou número):** o primeiro entra centrado sozinho e desliza para o lado ou para baixo quando o segundo entra; o motor faz isso sozinho, desde que os dois tenham tempos de entrada diferentes. Não deixe metade da tela vazia esperando o segundo.
- **Cenas novas:** ative `continuidade: true`, `entrada: "queda"`, `fisica: true` e `luz: "estudio"` em `efeitos`. Use o mesmo `id` enquanto a peça continuar. Consulte [Continuidade, física e iluminação](movimento.md) ao reutilizar peças entre beats, encostar objetos ou ajustar a luz.
- **Bonecos em revisão suspensa:** o modo `efeitos.gente: "adulto"` foi reprovado na revisão do estúdio em 24/10/2026. Não o use em produção nem o acrescente a cenas novas. O desenvolvimento será retomado pelo Claude. Pessoa real citada pelo nome continua exigindo foto.
- **Mesma metáfora do começo ao fim** (a grade de 8 casas do CEP volta do gancho ao fecho, mudando de cor nas faixas).
- **Título** só nos beats de gancho, virada e fecho. Cada palavra nasce quando é dita.
- **Casos reais** (notícia, investigação): nenhuma imagem que acuse ou ridicularize. Foto real (elemento `imagem`) só quando ajuda a reconhecer o assunto, com crédito e licença livre, e o mesmo tratamento para todos os lados; no resto, símbolos (prédio, documento, mapa, balança, grade).

## Recursos da cena
Se faltar peça ou cenário, crie em `projetos/<nome>/pecas.js`. Para um objeto complexo, use GLB CC0. Consulte [Recursos da cena](recursos.md) na seção de que precisar para repertório, modelo GLB ou câmera.

## Erros comuns
- Dois elementos disputando destaque (o motor rebaixa, mas decida você).
- Peças demais lado a lado: use no máximo 3.
- Cena vazia enquanto a narração explica algo.
- Mesmo objeto em todos os beats sem mudar de estado: varie escala, rotação e papel para mostrar a mudança de ideia.
- Cena genérica: texto grande no centro + peça qualquer. Cada peça precisa ter um motivo.
- Foto pelo nome sem conferir o tema (ex.: "Paulinho" sertanejo no vídeo de futebol). Homônimo errado é defeito, não detalhe.

Escreva o arquivo e rode o QA. Não peça aprovação do roteiro visual, **exceto** a lista de fotos/logos reais (skill `video`: a pessoa escolhe o que entra).
- Fecho: quando o roteiro termina com o convite padrão, o último beat mostra o título animado `Comenta *PALAVRA*` (a `palavra` de `cta` em `ilustrando.config.json`, quando `comentar` está ligado) na hora em que a voz diz a palavra, e o beat anterior mostra `Segue @handle` (o @ da página em `marca/tokens.json`). Com `comentar` desligado, só o `Segue @handle`.
- Repertório: 629 formas procedurais, 168 modelos GLB (`glb-*`) e 48 cenários (campo `cenario` no beat) em `src/video/formas.json` (lista por tema em `docs/cena/repertorio.md`), mais as peças e cenários do projeto (`projetos/<nome>/pecas.js`). Procure a peça que representa o que a voz diz antes de usar uma forma genérica (aviao, hospital, coracao, cofre, urna, dna, rede, linhatempo...); se não houver, crie no `pecas.js`. Veja as peças com `node src/video/cli.mjs --galeria <tema|nomes> --por=4`. O plano automático já escolhe entre elas pelo léxico em `src/video/lexico/`.
- Convite final: a seta aponta para baixo (`"rot": 90` no traço `seta`).
- Círculo ou destaque em volta de número: traço com `"em": "<id do contador>"`, nunca posição solta.
- Logo ou bandeira conhecidos (apps, IA, partidos, STF, bancos, clubes, países, estados): elemento `logo` ou `bandeira` pelo id da biblioteca (`node scripts/marcas.mjs <termo>`, `docs/marcas.md`), já com acabamento e crédito automático no fontes.md. Uso editorial, sem sugerir parceria; nada de marca de terceiro em anúncio pago.
- Foto ou logo real: elemento `imagem` (veja `docs/cena/estilo-padrao.md`, Notas), com crédito e licença em fontes.md. Para achar e registrar: `node scripts/buscar-imagem.mjs <projeto> "<termo>" --listar`, depois `--escolha=N` (ou `--logo`).

## Afirmações nas cenas
Consulte `docs/fontes-factuais.md`. O motor relaciona os intervalos de palavras aos ids do registro. Para dados adicionais em títulos, contadores, gráficos ou documentos, declare `afirmacoes: ["f-id"]` no beat ou elemento e confira suas evidências. Depois de voz e cenas prontas, rode `npm run fontes -- <projeto> --video --exportar`. O vínculo temporal não comprova equivalência visual.


## Edição localizada e pesquisa assistida
Consulte `docs/edicao-e-direcao.md` ao corrigir uma cena: use o editor com a revisão atual, preserve voz e trechos válidos, confira também a vizinha se mover um corte e gere entrega nova após revisar a prévia. Para investigar fatos, siga `docs/pesquisa-assistida.md`: buscas por afirmação e evidência contrária, coleta textual, citações exatas e revisão vinculada à versão consultada. Não trate coleta ou registro estrutural como prova semântica.

## Mecanismos, narração e versões
Ao corrigir vídeos, consulte `docs/narracao-em-blocos.md` e `docs/comparacao-de-versoes.md`. Preserve blocos de voz válidos; não use refazer integral para uma correção local. Confira palavras.json e cortes após mudar a fala. Para mecanismos específicos, consulte `docs/cena/recursos-visuais.md`: os modelos da Lua são esquemas fora de escala, sem eclipses, e não substituem direção específica de outros assuntos. Compare a nova entrega com a anterior; menos avisos não comprova melhoria artística ou factual.
