const config = useRuntimeConfig();

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface NavigationPoint {
  location: Location;
}

export interface Geometry {
  bounds?: {
    northeast: LatLng;
    southwest: LatLng;
  };
  location: LatLng;
  location_type: string;
  viewport: {
    northeast: LatLng;
    southwest: LatLng;
  };
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeocodingResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  navigation_points: NavigationPoint[];
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  types: string[];
}

export interface GeocodingResponse {
  results: GeocodingResult[];
  status: string;
}

function parseAddress(address: string): string {
  return encodeURIComponent(address.trim());
}

async function getGeocodingByAddress(parsedAddress: string): Promise<Location> {
  const addressFullInformation: GeocodingResponse = await $fetch(`${config.google.geocoding_url}address=${parsedAddress}&key=${config.google.apiKey}`, {
    method: "GET"
  });

  return addressFullInformation.results[0].navigation_points[0].location;
}

export async function handleGeocoding(address: string): Promise<Location> {
  const parsedAddress = parseAddress(address);
  return await getGeocodingByAddress(parsedAddress);
}