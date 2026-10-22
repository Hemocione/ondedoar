export type AskPointType = 'event' | 'hemocenter';

// O servidor aceita so event | hemocenter; bloodbank/hospital sao hemocentros.
const POINT_TYPE_MAP: Record<string, AskPointType> = {
  event: 'event',
  hemocenter: 'hemocenter',
  bloodbank: 'hemocenter',
  hospital: 'hemocenter',
};

export function askPointType(type: unknown): AskPointType | null {
  return typeof type === 'string' && Object.hasOwn(POINT_TYPE_MAP, type)
    ? POINT_TYPE_MAP[type]
    : null;
}

// Sem tipo elegivel (askforhelp, desconhecido) nao ha contexto: o botao nao aparece.
export function pointAskContext(type: unknown): Record<string, unknown> | null {
  const pointType = askPointType(type);
  if (!pointType) return null;
  return { product: 'ondedoar', screen: 'point', pointType };
}
