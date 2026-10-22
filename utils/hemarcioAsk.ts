export type AskPointType = 'event' | 'hemocenter';

export function askPointType(type: unknown): AskPointType | null {
  return type === 'event' || type === 'hemocenter' ? type : null;
}

// Sem tipo elegivel nao ha contexto: o botao nao aparece.
export function pointAskContext(type: unknown): Record<string, unknown> | null {
  const pointType = askPointType(type);
  if (!pointType) return null;
  return { product: 'ondedoar', screen: 'point', pointType };
}
