export const MAX_ALLOWED_DISTANCE_METERS = 50_000;
const MAX_LIMIT = 20;
const MAX_TYPE_LENGTH = 50;

export type GeoQueryError =
  | 'Invalid lat'
  | 'Invalid lng'
  | 'Invalid maxDistance'
  | `maxDistance exceeds the ${number}m limit`
  | 'Invalid limit'
  | 'Invalid type';

export interface NearbyQuery {
  latitude: number;
  longitude: number;
  maxDistanceMeters: number;
  limit: number;
  type?: string;
}

/**
 * Number('') e Number('   ') dao 0, entao `?lat=&lng=` passaria como a
 * coordenada (0, 0) — no golfo da Guine — em vez de 400. Recusa antes de
 * coagir. Array (param repetido na query) tambem nao e coordenada.
 */
const parseQueryNumber = (value: unknown): number => {
  if (typeof value !== 'string') return NaN;
  // Só decimal simples: Number() aceitaria '0x10' e '1e1'.
  const trimmed = value.trim();
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return NaN;
  return Number(trimmed);
};

export function parseNearbyQuery(
  query: Record<string, unknown>,
  defaults: { maxDistanceMeters: number; limit: number },
): { ok: true; value: NearbyQuery } | { ok: false; error: GeoQueryError } {
  const latitude = parseQueryNumber(query.lat);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return { ok: false, error: 'Invalid lat' };
  }
  const longitude = parseQueryNumber(query.lng);
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return { ok: false, error: 'Invalid lng' };
  }

  const maxDistanceMeters =
    query.maxDistance === undefined
      ? defaults.maxDistanceMeters
      : parseQueryNumber(query.maxDistance);
  if (!Number.isFinite(maxDistanceMeters) || maxDistanceMeters <= 0) {
    return { ok: false, error: 'Invalid maxDistance' };
  }
  // Recusa acima do teto em vez de clampar: clampar em silêncio faria a resposta
  // representar um raio de busca diferente do que o cliente pediu, sem ele saber.
  // O teto existe para o endpoint não virar dump geográfico do banco inteiro.
  if (maxDistanceMeters > MAX_ALLOWED_DISTANCE_METERS) {
    return {
      ok: false,
      error: `maxDistance exceeds the ${MAX_ALLOWED_DISTANCE_METERS}m limit`,
    };
  }

  const limit =
    query.limit === undefined ? defaults.limit : parseQueryNumber(query.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return { ok: false, error: 'Invalid limit' };
  }

  const value: NearbyQuery = { latitude, longitude, maxDistanceMeters, limit };
  if (query.type !== undefined) {
    if (
      typeof query.type !== 'string' ||
      query.type.trim() === '' ||
      query.type.length > MAX_TYPE_LENGTH
    ) {
      return { ok: false, error: 'Invalid type' };
    }
    value.type = query.type;
  }
  return { ok: true, value };
}
