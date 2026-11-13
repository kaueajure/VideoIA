---
name: social-captions
description: Escreve legendas por plataforma no Metodo-Video. Use em publicar.
---

# Social Media Caption Generator no Metodo-Video

Leia `docs/skills-sociais.md` para entradas, prioridade editorial e arquivos de saída. Use o método original em `.claude/skills/_terceiros/social-media-caption-generator/SKILL.md`, aplicando as adaptações daquele contrato: idioma do roteiro, plataformas solicitadas e fatos sustentados. As fórmulas e os percentuais da referência são heurísticas, não evidência ou garantia de alcance.

Extraia assunto, promessa e nuance do roteiro final. Escreva uma legenda própria por plataforma, sem copiar o mesmo bloco para todas; coloque o assunto cedo e uma ação coerente com o vídeo. Salve as seções em `projetos/<nome>/post.md` através da skill `publicar`, preservando escolhas anteriores. Para YouTube, use `youtube`: entregue `youtube.json` com três títulos, três descrições, **tags** do Studio e hashtags. O original não entrega tags; este adaptador exige esse campo.

Use `viral-captions-and-ctas` para revisar CTA e comentário fixado. Um pedido só de legendas não autoriza mudar roteiro, voz ou render. Textos podem ser preparados como rascunho com pendências; não declare publicável nem envie a plataformas sem atender ao fluxo de entrega e autorização existentes.
