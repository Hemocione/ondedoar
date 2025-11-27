import { useState } from '#app';
// Armazena os detalhes do local para mostrar mais informações
export interface PlaceDetails {
  active: boolean;
  name: string;
  displayName?: string | null;
  phone?: string;
  link?: string;
  type: string;
  address: string;
}

export const useMoreInfo = () => useState<PlaceDetails | null>('moreInfo', () => null);
