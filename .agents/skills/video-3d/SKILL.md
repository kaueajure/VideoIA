---
name: video-3d
description: Produz um vídeo 3D com o kit Remotion embutido em kit-3d/ (palco, bonecos, cenas React Three Fiber). Use quando a pessoa pedir vídeo 3D, usar a aba 3D do estúdio, ou o pedido trouxer <!-- kit-3d:v1 --> / pasta kit-3d/videos/.
---

# /video-3d <tema>

Trabalhe **somente** em `kit-3d/` (cwd dos comandos npm). Não use `projetos/`, `cena.json` nem `node src/video/cli.mjs` do VideoIA neste pedido.

Leia `kit-3d/CLAUDE.md` e, se existir, `kit-3d/.claude/skills/video/SKILL.md`. Fale em português do Brasil.

## Pipeline

1. **Pesquisa:** fatos conferidos; fontes no `video.json`, nunca no post.
2. **`npm run novo -- <slug> "Título"`** (dentro de `kit-3d`) ou edite a pasta já criada pelo estúdio em `kit-3d/videos/<slug>/`.
3. **Escreva `video.json`:** gancho, 14–20 cenas, ~300 palavras, duração 1min10s–2min, capa, post, `emocao` em blocos.
4. **Pedido do estúdio web** (`PEDIDO-DO-ESTUDIO.md` com `<!-- kit-3d:v1 -->`): **não pare** para aprovação humana; ponha `roteiroAprovado: true` e siga. Fora do estúdio web, pare e espere o "aprovado" como no kit original.
5. **`npm run voz -- <slug>`:** chave em `kit-3d/.env` (sincronizada do estúdio).
6. **`cenas.tsx`:** kit (`Palco`, `Boneco`, `quando('palavra')`, `<Som>`). Elementos com sentido; sem flicker; animação só por quadro.
7. **`npm run checar`**, **`npm run previa -- <slug> --momentos 0.06,0.5,0.94`**, leia a folha, corrija.
8. **`npm run render -- <slug>`**. Sem flicker. Se houver Drive: `npm run arquivar -- <slug>`.
9. **Publicação no estúdio:** o `post.txt` (e o `post` do `video.json`) vira a legenda em Meus vídeos; se faltar `kit-3d/videos/<slug>/youtube.json`, o estúdio monta o pacote (títulos, descrições, tags) a partir do post. Pode gravar o arquivo no render se quiser revisar antes.

## Comandos (sempre com cwd kit-3d)

```bash
npm run status -- <slug>
npm run novo -- <slug> "Título"
npm run voz -- <slug>
npm run checar
npm run previa -- <slug> --momentos 0.06,0.5,0.94
npm run render -- <slug>
npm run arquivar -- <slug>
```

Atalho a partir da raiz do VideoIA: `node scripts/kit-3d-run.mjs <script> -- <args>`.

## Não faça

- Misturar com skills `pauta` / `roteiro` / `cena` / `video` do VideoIA neste pedido.
- Inventar números ou enfeite 3D sem sentido.
- Abrir ou controlar o navegador do estúdio.
