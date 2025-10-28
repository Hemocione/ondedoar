import { useState } from '#app';

// Armazena a lista de propriedades das features visíveis no mapa
export const useVisibleFeatures = () => useState<any[]>('visibleFeatures', () => []);

// Armazena o estado de carregamento das features visíveis
export const useLoadingVisibleFeatures = () => useState<boolean>('loadingVisibleFeatures', () => true);

// Armazena as coordenadas do centro do mapa
export const useMapCenter = () => useState<number[]>('mapCenter', () => [-43.9345, -19.9167]);