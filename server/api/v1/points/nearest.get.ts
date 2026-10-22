import { getNearestActivePoint } from '~/server/services/point';
import { parseNearbyQuery } from '~/server/utils/geoQuery';

const DEFAULT_DISTANCE_METERS = 500;

export default defineEventHandler(async (event) => {
  const { lat, lng, maxDistance } = getQuery(event);

  // Contrato antigo: so lat/lng/maxDistance. `limit` e `type` da query sao ignorados.
  const result = parseNearbyQuery(
    { lat, lng, maxDistance },
    { maxDistanceMeters: DEFAULT_DISTANCE_METERS, limit: 1 },
  );
  if (!result.ok) {
    throw createError({ statusCode: 400, statusMessage: result.error });
  }

  const { latitude, longitude, maxDistanceMeters } = result.value;
  return await getNearestActivePoint(longitude, latitude, maxDistanceMeters);
});
