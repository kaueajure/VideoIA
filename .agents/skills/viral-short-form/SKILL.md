---
name: viral-short-form
description: Revisa gancho e retenção do roteiro curto no Metodo-Video antes da voz.
---

# Viral Short Form no Metodo-Video

Leia `docs/skills-sociais.md` e o original em `.claude/skills/_terceiros/content-skills/viral-short-form/SKILL.md`. Use `references/retention.md` para diagnóstico e `references/hooks.md` quando o gancho precisar mudar. Não é preciso carregar todas as referências.

Na etapa `roteiro`, identifique onde a promessa demora, a explicação fica repetida ou a conclusão deixa de responder ao gancho. Cite os trechos concretos e proponha mudanças sustentadas pelas fontes. Registre diagnóstico e decisões em `projetos/<nome>/revisao-roteiro.md`; não insira a análise na fala narrada.

Ao criar roteiro, explore ângulos diferentes e mantenha as três opções de GANCHOS no formato `GANCHOS:` exigido pelo estúdio; a referência de 6–10 opções é opcional para exploração, não obrigação de saída. Respeite frase fixada pela pessoa, duração e faixas do objetivo. Em roteiro existente, mude somente os trechos autorizados e atualize fontes.json se a afirmação mudar. Refaça a checagem factual e o linter do fluxo `roteiro`.

Conclua essa revisão antes de gerar voz. Se já existir voz ou vídeo, avise quais frases/cenas exigem nova produção; não sintetize nem renderize apenas por um pedido de diagnóstico. Não invente curva de retenção ou ponto de abandono sem métricas reais. Em vídeo horizontal longo, use somente a análise pertinente, sem forçar estrutura de Shorts. Ignore pitches de produto das referências.
