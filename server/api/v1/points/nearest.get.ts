import { getNearestActivePoint } from '~/server/services/point';

const MAX_ALLOWED_DISTANCE_METERS = 50_000;
const DEFAULT_DISTANCE_METERS = 500;

export default defineEventHandler(async (event) => {
  const { lat, lng, maxDistance } = getQuery(event);

  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid lat' });
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid lng' });
  }

  const requested =
    maxDistance === undefined ? DEFAULT_DISTANCE_METERS : Number(maxDistance);
  if (!Number.isFinite(requested) || requested <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid maxDistance' });
  }
  // Cap para o endpoint não virar dump geográfico do banco inteiro.
  const maxDistanceMeters = Math.min(requested, MAX_ALLOWED_DISTANCE_METERS);

  return await getNearestActivePoint(longitude, latitude, maxDistanceMeters);
});
