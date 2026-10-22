import { describe, expect, it } from 'vitest';
import { parseNearbyQuery } from './geoQuery';

const defaults = { maxDistanceMeters: 5000, limit: 5 };
const parse = (q: Record<string, unknown>) => parseNearbyQuery(q, defaults);
const errorOf = (q: Record<string, unknown>) => {
  const r = parse(q);
  return r.ok ? null : r.error;
};

describe('parseNearbyQuery', () => {
  it('aplica os defaults quando so lat/lng vem na query', () => {
    expect(parse({ lat: '-22.9', lng: '-43.2' })).toEqual({
      ok: true,
      value: { latitude: -22.9, longitude: -43.2, maxDistanceMeters: 5000, limit: 5 },
    });
  });

  it.each([
    { lat: '', lng: '-43.2' },
    { lat: '   ', lng: '-43.2' },
    { lat: ['1', '2'], lng: '-43.2' },
    { lat: '91', lng: '-43.2' },
    { lng: '-43.2' },
  ])('recusa lat invalida %j', (q) => {
    expect(errorOf(q)).toBe('Invalid lat');
  });

  it.each([
    { lat: '0', lng: '181' },
    { lat: '0', lng: '' },
    { lat: '0', lng: ['1', '2'] },
  ])('recusa lng invalida %j', (q) => {
    expect(errorOf(q)).toBe('Invalid lng');
  });

  it.each(['0', '-1', 'abc'])('recusa maxDistance %s', (maxDistance) => {
    expect(errorOf({ lat: '0', lng: '0', maxDistance })).toBe('Invalid maxDistance');
  });

  it('recusa maxDistance acima do teto e aceita o teto', () => {
    expect(errorOf({ lat: '0', lng: '0', maxDistance: '50001' })).toBe(
      'maxDistance exceeds the 50000m limit',
    );
    const r = parse({ lat: '0', lng: '0', maxDistance: '50000' });
    expect(r.ok && r.value.maxDistanceMeters).toBe(50000);
  });

  it.each(['0', '21', '2.5', '-1', 'abc', ''])('recusa limit %j', (limit) => {
    expect(errorOf({ lat: '0', lng: '0', limit })).toBe('Invalid limit');
  });

  it.each(['1', '20'])('aceita limit %s', (limit) => {
    const r = parse({ lat: '0', lng: '0', limit });
    expect(r.ok && r.value.limit).toBe(Number(limit));
  });

  it.each(['', ['a', 'b'], 'x'.repeat(51)])('recusa type %j', (type) => {
    expect(errorOf({ lat: '0', lng: '0', type })).toBe('Invalid type');
  });

  it('aceita type valido', () => {
    const r = parse({ lat: '0', lng: '0', type: 'bloodbank' });
    expect(r.ok && r.value.type).toBe('bloodbank');
  });
});
