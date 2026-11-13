// Biblioteca 3D Pro: cada categoria exporta os objetos e uma lista para a vitrine (npm run previa -- pro-<categoria>).
import type React from 'react';

export type ItemVitrine = {
  nome: string;
  // O objeto montado como ele deve aparecer na vitrine (posicione em volta de y ≈ 1).
  componente: React.FC;
  // Só nas vitrines de cenas prontas e vinhetas (pro-cenas, pro-vinhetas): quadros que o exemplo dura.
  // Os objetos ignoram.
  duracao?: number;
};
