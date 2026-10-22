import { getNearestActivePoints } from '~/server/services/point';
import { parseNearbyQuery } from '~/server/utils/geoQuery';

export default defineEventHandler(async (event) => {
  const result = parseNearbyQuery(getQuery(event), {
    maxDistanceMeters: 5_000,
    limit: 5,
  });
  if (!result.ok) {
    throw createError({ statusCode: 400, statusMessage: result.error });
  }

  const { latitude, longitude, maxDistanceMeters, limit, type } = result.value;
  return {
    results: await getNearestActivePoints({
      lng: longitude,
      lat: latitude,
      maxDistanceMeters,
      limit,
      type,
      // Evento vencido não deve ser sugerido ao doador.
      excludeExpired: true,
    }),
  };
});
