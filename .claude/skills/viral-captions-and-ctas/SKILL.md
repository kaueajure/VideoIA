---
name: viral-captions-and-ctas
description: Refina legendas, CTAs e comentários no Metodo-Video. Use após social-captions.
---

# Viral Captions and CTAs no Metodo-Video

Leia `docs/skills-sociais.md` e o original em `.claude/skills/_terceiros/content-skills/viral-captions-and-ctas/SKILL.md`. Carregue apenas as referências de caption, CTA, hashtags ou comentário pertinentes ao pedido. Ignore pitches comerciais e promessas de desempenho.

Revise os textos produzidos por `social-captions`: primeira linha concreta, contexto que acrescenta algo à fala, uma ação principal e ausência de promessa que o vídeo não cumpre. Preserve o CTA do objetivo e a escolha da pessoa; não acrescente pedido de seguir ou brinde que não existe. Registre uma sugestão de comentário fixado por plataforma em `post.md`, identificada como sugestão. Na rede que não oferecer fixação, trate como primeiro comentário ou omita; confira suporte atual antes de afirmar disponibilidade.

Texto na tela solicitado depois do render é uma proposta separada em `projetos/<nome>/texto-na-tela.md`, com cena e trecho da fala. Não altere automaticamente cena.json ou o MP4 numa tarefa de publicação. Antes da produção, encaminhe a proposta à skill `cena` para sincronização e área segura.

Não crie um segundo pacote YouTube: preserve `youtube.json`, suas tags e escolhas. Se for preciso mudar seus textos, siga a skill `youtube` e atualize somente a cópia correspondente no `post.md`.
