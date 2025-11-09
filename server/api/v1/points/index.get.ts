import { getActivePoints } from '~/server/services/point';

const cacheKey = 'active-points';

export default defineEventHandler(async () => {
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const points = await getActivePoints();
  cache.set(cacheKey, points);
  return points;
});