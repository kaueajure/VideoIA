# Fases da Lua com mecanismos visuais

Mesmo roteiro de 44 palavras e mesmas fontes do exemplo `../fases-da-lua/`, com direção substituída em três cenas. Copie roteiro.md, cena.json, fontes.json e fontes.md para um projeto novo e gere a voz normalmente. Não copie palavras.json de outro roteiro.

`fases-lua` mostra Sol, órbita, Terra, Lua iluminada e uma vista da Terra calculada pelo ângulo de iluminação. `reflexao-luz` mostra o percurso da luz do Sol à Lua e da Lua ao observador. São diagramas explicativos, acelerados e fora de escala; não simulam eclipses, inclinação orbital, libração ou a órbita real. Não são imagens astronômicas nem simuladores científicos.

A vista da Terra tem fração iluminada `(1 + cos(ângulo))/2`. Com o Sol à esquerda, ângulo 0 representa Lua cheia e 180 representa Lua nova. A projeção mantém o terminador do lado correspondente ao Sol. As marcações da Terra são ilustrativas, sem pretender representar mapas.

A pergunta final continua editorial. A adequação entre o modelo e as afirmações exige revisão humana ou do agente: o QA geométrico não a comprova. Não selecione estes modelos para outros assuntos apenas para preencher a tela.
