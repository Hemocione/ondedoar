import { useState } from '#app';

// Armazena a lista de propriedades das features visíveis no mapa
export const useVisibleFeatures = () => useState<any[]>('visibleFeatures', () => []);