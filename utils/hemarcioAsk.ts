export function pointAskContext(type: unknown): Record<string, unknown> {
  return {
    product: "ondedoar",
    screen: "point",
    ...(type === "event" || type === "hemocenter" ? { pointType: type } : {}),
  };
}
