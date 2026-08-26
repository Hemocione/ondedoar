export function haversineDistanceMeters(
  a: [number, number],
  b: [number, number],
): number {
  const [lngA, latA] = a;
  const [lngB, latB] = b;
  const R = 6371000; // raio médio da Terra, em metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(latB - latA);
  const dLng = toRad(lngB - lngA);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(latA)) * Math.cos(toRad(latB)) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}

function hasValidCoordinates(
  point: { coordinates?: unknown },
): point is { coordinates: [number, number] } {
  return (
    Array.isArray(point.coordinates) &&
    point.coordinates.length === 2 &&
    typeof point.coordinates[0] === 'number' &&
    typeof point.coordinates[1] === 'number'
  );
}

export function sortPointsByDistance<T extends { coordinates?: unknown }>(
  points: T[],
  origin: [number, number],
  limit = 30,
): (T & { distanceMeters: number })[] {
  return points
    .filter(hasValidCoordinates)
    .map((point) => ({
      ...point,
      distanceMeters: haversineDistanceMeters(origin, point.coordinates),
    }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit);
}

export function filterPointsByRadius<T extends { coordinates?: unknown }>(
  points: T[],
  origin: [number, number],
  radiusKm: number,
): (T & { distanceMeters: number })[] {
  const radiusMeters = radiusKm * 1000;
  return points
    .filter(hasValidCoordinates)
    .map((point) => ({
      ...point,
      distanceMeters: haversineDistanceMeters(origin, point.coordinates),
    }))
    .filter((point) => point.distanceMeters <= radiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}
