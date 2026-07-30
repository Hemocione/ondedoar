import { getNearestActivePoint } from '~/server/services/point';

const MAX_ALLOWED_DISTANCE_METERS = 50_000;
const DEFAULT_DISTANCE_METERS = 500;

/**
 * Number('') e Number('   ') dao 0, entao `?lat=&lng=` passaria como a
 * coordenada (0, 0) — no golfo da Guine — em vez de 400. Recusa antes de
 * coagir. Array (param repetido na query) tambem nao e coordenada.
 */
const parseQueryNumber = (value: unknown): number => {
  if (typeof value !== "string" || value.trim() === "") return NaN;
  return Number(value);
};

export default defineEventHandler(async (event) => {
  const { lat, lng, maxDistance } = getQuery(event);

  const latitude = parseQueryNumber(lat);
  const longitude = parseQueryNumber(lng);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid lat' });
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid lng' });
  }

  const requested =
    maxDistance === undefined
      ? DEFAULT_DISTANCE_METERS
      : parseQueryNumber(maxDistance);
  if (!Number.isFinite(requested) || requested <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid maxDistance' });
  }
  // Recusa acima do teto em vez de clampar: clampar em silêncio faria a resposta
  // representar um raio de busca diferente do que o cliente pediu, sem ele saber.
  // O teto existe para o endpoint não virar dump geográfico do banco inteiro.
  if (requested > MAX_ALLOWED_DISTANCE_METERS) {
    throw createError({
      statusCode: 400,
      statusMessage: `maxDistance exceeds the ${MAX_ALLOWED_DISTANCE_METERS}m limit`,
    });
  }
  const maxDistanceMeters = requested;

  return await getNearestActivePoint(longitude, latitude, maxDistanceMeters);
});
