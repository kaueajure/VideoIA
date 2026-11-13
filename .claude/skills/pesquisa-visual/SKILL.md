---
name: pesquisa-visual
description: Planeja imagens reais, enquadramento e movimento para vídeos do VideoIA. Use antes de fechar o roteiro do primeiro vídeo do estúdio, ao escolher imagens para uma cena ou ao revisar se a foto e o movimento correspondem ao fato narrado.
---

# Pesquisa visual

Use o roteiro em revisão e os fatos conferidos pela skill `pauta`. Para cada imagem importante, identifique a pessoa ou objeto, a ação e o contexto que distinguem o caso (evento, data, local, clube, cargo ou edição, conforme a fala). Decida se a cena precisa de um registro do acontecimento, de uma imagem de contexto ou de uma explicação visual.

- A pesquisa é aberta a qualquer fonte ou banco de imagens acessível na web. Commons, Wikipédia e Openverse são opções, não limites. Compare pelo menos três candidatos para cada imagem principal quando houver oferta, varie termos e idiomas e procure em outra origem quando os resultados não servirem. Menos candidatos exige registrar a limitação, nunca inventar uma conferência.
- Antes de fixar uma foto, abra o arquivo em tamanho real e confirme identidade, contexto e qualidade. A legenda de busca e a semelhança do nome não comprovam correspondência.
- Para buscar, conferir, registrar a licença e escolher o arquivo, siga [Evidência visual](evidencia.md).
- Em todo vídeo novo (incluindo o primeiro do estúdio web), grave `direcao-visual.json` antes da voz e alinhe com `storyboard.md`. Use [Plano visual do VideoIA](plano.md) para ligar cada arquivo e movimento ao trecho narrado. Sem plano visual nos trechos que pedem foto/logo, a skill `cena` não inventa arquivo.
- Se estiver escrevendo `cena.json`, coloque no beat o `arquivo` exato conferido. Use a skill `cena` para composição e a skill `video` para a aprovação de fotos e logos externos no fluxo assistido.
- Para desenvolver um estilo ou ajustar movimento de câmera, consulte [Câmera e animação](movimento.md). Na revisão, a skill `critico` confere os quadros com a fala e com o registro da imagem.
