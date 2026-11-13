# Pedido do estúdio web (aba 3D)

Quero um vídeo 3D sobre Raphinha passou do ponto ao falar dos minutos na Seleção. A pasta do estúdio aberta é C:\Users\kaue\Desktop\VideoIA.

MODO: kit-3d embutido no Estudio de Videos. Trabalhe SOMENTE dentro da pasta kit-3d/ (não use projetos/, cena.json nem o motor src/video/ do VideoIA para este pedido).

Leia kit-3d/CLAUDE.md e a skill .claude/skills/video-3d/SKILL.md (ou kit-3d/.claude/skills/video/SKILL.md). Pipeline: pesquisa → video.json → voz → cenas.tsx → prévia → render → arquivar (se houver Drive).

Slug deste vídeo: raphinha-passou-do-ponto-ao-falar-dos-mi
Pasta: kit-3d/videos/raphinha-passou-do-ponto-ao-falar-dos-mi/

O tema digitado pela pessoa é exatamente este e não muda: "Raphinha passou do ponto ao falar dos minutos na Seleção". Não troque, não generalize e não desvie.

Textos que a pessoa pediu (use estes; não troque por versão genérica):
- Gancho (primeira frase do video.json, sem trocar): "Quando Raphinha disse "se realmente conta comigo", ele passou do ponto com Ancelotti?"

Regras do kit (obrigatórias):
- Duração 1min10s a 2min (~300 palavras faladas, 14–20 cenas).
- Fatos conferidos; fontes em video.json (campo fontes), nunca no post.
- Elementos 3D com sentido; nada de enfeite aleatório; assunto desde o quadro 0.
- Animação só por useCurrentFrame/useCena; sem Math.random/Date.now/useFrame do R3F.
- Som sem AI slop (só sons/trilhas licenciados do kit).
- Post com chamada "Mande para quem …" + hashtags.

Fluxo a partir do estúdio web (autônomo):
1. npm run novo -- raphinha-passou-do-ponto-ao-falar-dos-mi "Raphinha passou do ponto ao falar dos minutos na Seleção"  (rode com cwd kit-3d; se a pasta já existir com PEDIDO-DO-ESTUDIO.md, edite o video.json dela).
2. Pesquise, escreva o video.json completo (cenas, capa, post, emocao em blocos).
3. Como o pedido veio do estúdio web com tema/gancho já definidos, NÃO pare para "aprovado": ponha roteiroAprovado: true e siga.
4. npm run voz -- raphinha-passou-do-ponto-ao-falar-dos-mi (ElevenLabs; chave já sincronizada no kit-3d/.env).
5. Escreva kit-3d/videos/raphinha-passou-do-ponto-ao-falar-dos-mi/cenas.tsx sincronizado com quando('palavra').
6. npm run checar && npm run previa -- raphinha-passou-do-ponto-ao-falar-dos-mi --momentos 0.06,0.5,0.94; leia a folha e corrija.
7. npm run render -- raphinha-passou-do-ponto-ao-falar-dos-mi.
8. Se o status mostrar Drive: npm run arquivar -- raphinha-passou-do-ponto-ao-falar-dos-mi.

Não use skills pauta/roteiro/cena/video do VideoIA neste pedido. Não renderize com node src/video/cli.mjs. Não abra nem controle o navegador: a tela do estúdio se atualiza sozinha quando o MP4 existir em kit-3d/videos/raphinha-passou-do-ponto-ao-falar-dos-mi/saida/.

<!-- kit-3d:v1 -->
