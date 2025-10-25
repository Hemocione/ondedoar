import { useState } from '#app';

// Armazena a lista de propriedades das features visíveis no mapa
export const useVisibleFeatures = () => useState<any[]>('visibleFeatures', () => []);

// Armazena o estado de carregamento das features visíveis
export const useLoadingVisibleFeatures = () => useState<boolean>('loadingVisibleFeatures', () => true);