# Pedido do estúdio web (aba 3D)

Quero um vídeo 3D sobre um Esposito perdeu o pênalti. O outro decidiu contra a França. A pasta do estúdio aberta é C:\Users\kaue\Desktop\VideoIA.

MODO: kit-3d embutido no Estudio de Videos. Trabalhe SOMENTE dentro da pasta kit-3d/ (não use projetos/, cena.json nem o motor src/video/ do VideoIA para este pedido).

Leia kit-3d/CLAUDE.md e a skill .claude/skills/video-3d/SKILL.md (ou kit-3d/.claude/skills/video/SKILL.md). Pipeline: pesquisa → video.json → voz → cenas.tsx → prévia → render → arquivar (se houver Drive).

Slug deste vídeo: um-esposito-perdeu-o-penalti-o-outro-dec
Pasta: kit-3d/videos/um-esposito-perdeu-o-penalti-o-outro-dec/

O tema digitado pela pessoa é exatamente este e não muda: "um Esposito perdeu o pênalti. O outro decidiu contra a França". Não troque, não generalize e não desvie.

Textos que a pessoa pediu (use estes; não troque por versão genérica):
- Gancho (primeira frase do video.json, sem trocar): "Um irmão perdeu. O outro decidiu"

Regras do kit (obrigatórias):
- Duração 1min10s a 2min (~300 palavras faladas, 14–20 cenas).
- Fatos conferidos; fontes em video.json (campo fontes), nunca no post.
- Elementos 3D com sentido; nada de enfeite aleatório; assunto desde o quadro 0.
- Animação só por useCurrentFrame/useCena; sem Math.random/Date.now/useFrame do R3F.
- Som sem AI slop (só sons/trilhas licenciados do kit).
- Post com chamada "Mande para quem …" + hashtags.

Fluxo a partir do estúdio web (autônomo):
1. npm run novo -- um-esposito-perdeu-o-penalti-o-outro-dec "um Esposito perdeu o pênalti. O outro decidiu contra a França"  (rode com cwd kit-3d; se a pasta já existir com PEDIDO-DO-ESTUDIO.md, edite o video.json dela).
2. Pesquise, escreva o video.json completo (cenas, capa, post, emocao em blocos).
3. Como o pedido veio do estúdio web com tema/gancho já definidos, NÃO pare para "aprovado": ponha roteiroAprovado: true e siga.
4. npm run voz -- um-esposito-perdeu-o-penalti-o-outro-dec (ElevenLabs; chave já sincronizada no kit-3d/.env).
5. Escreva kit-3d/videos/um-esposito-perdeu-o-penalti-o-outro-dec/cenas.tsx sincronizado com quando('palavra').
6. npm run checar && npm run previa -- um-esposito-perdeu-o-penalti-o-outro-dec --momentos 0.06,0.5,0.94; leia a folha e corrija.
7. npm run render -- um-esposito-perdeu-o-penalti-o-outro-dec.
8. Se o status mostrar Drive: npm run arquivar -- um-esposito-perdeu-o-penalti-o-outro-dec.

Não use skills pauta/roteiro/cena/video do VideoIA neste pedido. Não renderize com node src/video/cli.mjs. Não abra nem controle o navegador: a tela do estúdio se atualiza sozinha quando o MP4 existir em kit-3d/videos/um-esposito-perdeu-o-penalti-o-outro-dec/saida/.

<!-- kit-3d:v1 -->
