export const HEMARCIO_SDK_URL = 'https://chat.hemocione.com.br/sdk/0.1.1/hemocione-sdk.js';

export const HEMARCIO_BUBBLE_OPTIONS = {
  position: 'bottom-right' as const,
  // o puxador e o contador da gaveta ficam centralizados; o canto direito esta livre
  offset: { x: 16, y: 16 },
};

export interface HemarcioVisibilityInput {
  enabled: boolean;
  iframedQuery: boolean;
  inIframe: boolean;
  path: string;
  locationPromptVisible?: boolean;
}

export function resolveHemarcioEnabled(value: unknown): boolean {
  return value === true || value === 'true';
}

export function shouldShowHemarcio(input: HemarcioVisibilityInput): boolean {
  if (!input.enabled) return false;
  if (input.locationPromptVisible) return false;
  if (input.iframedQuery || input.inIframe) return false;
  if (input.path === '/test' || input.path.startsWith('/test/')) return false;
  return true;
}

export function buildHemarcioContext(path: string) {
  return { product: 'ondedoar', page: path };
}
