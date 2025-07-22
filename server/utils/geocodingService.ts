const config = useRuntimeConfig();

function parseAddress(address: string): string {
  return encodeURIComponent(address.trim());
}

async function getGeocodingByAddress(parsedAddress: string) {
  return await $fetch(`${config.google.geocoding_url}address=${parsedAddress}&key=${config.google.apiKey}`, {
    method: "GET"
  });
}

export async function handleGeocoding(address: string) {
  const parsedAddress = parseAddress(address);
  return await getGeocodingByAddress(parsedAddress);
}