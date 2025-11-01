export function getHemocioneIdUrl(redirectUrl: string): string {
  const config = useRuntimeConfig();

  const encodedRedirectUrl = encodeURIComponent(redirectUrl);
  console.log(redirectUrl)
  console.log(config.public.hemocioneIdUrl)
  return `${config.public.hemocioneIdUrl}?redirect=${encodedRedirectUrl}`;
}
