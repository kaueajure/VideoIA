# Kit 3D embutido no Estudio de Videos

Esta pasta é o **kit-videos-3d** (Remotion + React Three Fiber) embutido no VideoIA.

## Uso pela UI

1. Abra o estúdio (`npm run estudio -- --abrir`).
2. Aba **3D** (ao lado de **Novo**).
3. Tema (+ gancho/título opcionais) → **Gerar 3D**.
4. Cole/envie o pedido no Chat; o assistente segue a skill `video-3d` e trabalha aqui.

## Uso pelo terminal

Na raiz do VideoIA:

```bash
node scripts/kit-3d-run.mjs status
node scripts/kit-3d-run.mjs novo -- meu-slug "Título"
node scripts/kit-3d-run.mjs voz -- meu-slug
node scripts/kit-3d-run.mjs render -- meu-slug
```

Ou diretamente:

```bash
cd kit-3d
npm install   # primeira vez
npm run status
```

## Chaves

O estúdio sincroniza `ELEVENLABS_*` do `.env` da raiz para `kit-3d/.env` ao criar um vídeo 3D.

## Regras

Leia `CLAUDE.md` desta pasta. Vídeos ficam em `videos/<slug>/`.
