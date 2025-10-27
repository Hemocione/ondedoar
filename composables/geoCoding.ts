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

export const handleGeocoding = async (address: string): Promise<number[]> => {
  const parsedAddress = parseAddress(address);
  return await getGeocodingByAddress(parsedAddress);
}

export const getGeocodingSuggestions = async (address: string): Promise<NominatimResult[]> => {
  const parsedAddress = parseAddress(address);
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${parsedAddress}&limit=5&addressdetails=1`;
  const response = await $fetch(nominatimUrl, {
    headers: {
      "User-Agent": "GeofenceDrawer/1.0",
    },
  }) as NominatimResult[];

  return response || [];
}

export function formatNominatimAddress(address?: NominatimAddress): string {
  if (!address) {
    return '';
  }

  const street = [address.road, address.house_number].filter(Boolean).join(', ');
  const city = address.city || address.town || address.village;
  const neighborhood = address.neighbourhood || address.suburb;

  const parts: string[] = [];

  if (street) {
    parts.push(street);
  }

  const locationParts: string[] = [];
  if (neighborhood) {
    locationParts.push(neighborhood);
  }
  if (city) {
    locationParts.push(city);
  }
  if (address.state) {
    locationParts.push(address.state);
  }

  if (locationParts.length > 0) {
    parts.push(locationParts.join(' - '));
  }

  return parts.join(' - ');
}