const config = useRuntimeConfig();

export interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state_district?: string;
  state?: string;
  region?: string;
  postcode?: string;
  country: string;
  country_code: string;
  [key: string]: string | undefined; // Para outros campos não mapeados
}

export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: 'node' | 'way' | 'relation';
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  // O campo 'address' é opcional e só aparece com 'addressdetails=1'
  address?: NominatimAddress;
  // O campo 'extratags' é opcional e só aparece com 'extratags=1'
  extratags?: Record<string, string>;
  // O campo 'namedetails' é opcional e só aparece com 'namedetails=1'
  namedetails?: Record<string, string>;
}

function parseAddress(address: string): string {
  return encodeURIComponent(address.trim());
}

async function getGeocodingByAddress(parsedAddress: string): Promise<number[]> {
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${parsedAddress}&limit=1`;
  const response = await $fetch(nominatimUrl, {
    headers: {
      "User-Agent": "GeofenceDrawer/1.0",
    },
  }) as NominatimResult[];

  if (!response?.length) {
    throw new Error(`Endereço ${parsedAddress} não encontrado.`);
  }

  const result = response[0];
  const latitude = parseFloat(result.lat);
  const longitude = parseFloat(result.lon);

  return [
    longitude,
    latitude
  ];
}

export async function handleGeocoding(address: string): Promise<number[]> {
  const parsedAddress = parseAddress(address);
  return await getGeocodingByAddress(parsedAddress);
}