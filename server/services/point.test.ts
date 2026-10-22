import { describe, expect, it } from 'vitest';
import { buildNearestPipeline } from './point';

const base = {
  lng: -43.1729,
  lat: -22.9068,
  maxDistanceMeters: 5000,
  limit: 3,
  now: new Date('2026-10-21T12:00:00Z'),
  excludeExpired: false,
};

const geoQuery = (stage: unknown) =>
  (stage as { $geoNear: { query: unknown } }).$geoNear.query;

describe('buildNearestPipeline', () => {
  it('monta $geoNear seguido de $limit', () => {
    const [geoNear, limit] = buildNearestPipeline(base);
    expect(geoNear).toEqual({
      $geoNear: {
        near: { type: 'Point', coordinates: [-43.1729, -22.9068] },
        distanceField: 'distanceMeters',
        maxDistance: 5000,
        query: { active: true },
        spherical: true,
      },
    });
    expect(limit).toEqual({ $limit: 3 });
  });

  it('inclui o filtro de vencidos so com excludeExpired', () => {
    const [geoNear] = buildNearestPipeline({ ...base, excludeExpired: true });
    expect(geoQuery(geoNear)).toEqual({
      active: true,
      $or: [
        { expirationDate: { $exists: false } },
        { expirationDate: null },
        { expirationDate: { $gte: base.now } },
      ],
    });
  });

  it('mantem $geoNear como primeiro estagio com excludeExpired', () => {
    const stages = buildNearestPipeline({ ...base, excludeExpired: true });
    expect(Object.keys(stages[0])).toEqual(['$geoNear']);
    expect(stages[1]).toEqual({ $limit: 3 });
  });

  it('filtra por type quando informado', () => {
    const [geoNear] = buildNearestPipeline({ ...base, type: 'Event' });
    expect(geoQuery(geoNear)).toEqual({ active: true, type: 'Event' });
  });
});
