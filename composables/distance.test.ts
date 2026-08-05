import { describe, it, expect } from 'vitest';
import { haversineDistanceMeters, sortPointsByDistance, formatDistance } from './distance';

describe('haversineDistanceMeters', () => {
  it('retorna 0 quando origem e destino são o mesmo ponto', () => {
    expect(haversineDistanceMeters([-46.65, -23.56], [-46.65, -23.56])).toBe(0);
  });

  it('calcula ~111.32km para 1 grau de latitude no equador (constante conhecida)', () => {
    const a: [number, number] = [0, 0];
    const b: [number, number] = [0, 1];
    const d = haversineDistanceMeters(a, b);
    expect(d).toBeGreaterThan(110000);
    expect(d).toBeLessThan(112000);
  });
});

describe('sortPointsByDistance', () => {
  const origin: [number, number] = [0, 0];

  it('retorna lista vazia para entrada vazia', () => {
    expect(sortPointsByDistance([], origin)).toEqual([]);
  });

  it('ordena por distância crescente', () => {
    const points = [
      { name: 'longe', coordinates: [10, 10] },
      { name: 'perto', coordinates: [1, 1] },
      { name: 'médio', coordinates: [5, 5] },
    ];
    const sorted = sortPointsByDistance(points, origin);
    expect(sorted.map((p) => p.name)).toEqual(['perto', 'médio', 'longe']);
  });

  it('respeita o limite', () => {
    const points = Array.from({ length: 50 }, (_, i) => ({
      name: `p${i}`,
      coordinates: [i * 0.01, i * 0.01],
    }));
    const sorted = sortPointsByDistance(points, origin, 5);
    expect(sorted).toHaveLength(5);
  });

  it('ignora pontos sem coordenadas válidas', () => {
    const points = [
      { name: 'sem-coord' },
      { name: 'coord-invalida', coordinates: 'not-an-array' },
      { name: 'valido', coordinates: [1, 1] },
    ];
    const sorted = sortPointsByDistance(points as any, origin);
    expect(sorted.map((p) => p.name)).toEqual(['valido']);
  });

  it('anexa distanceMeters em cada item', () => {
    const points = [{ name: 'a', coordinates: [1, 1] }];
    const sorted = sortPointsByDistance(points, origin);
    expect(sorted[0].distanceMeters).toBeGreaterThan(0);
  });
});

describe('formatDistance', () => {
  it('mostra metros quando menor que 1km', () => {
    expect(formatDistance(850)).toBe('850 m');
  });

  it('mostra km com uma casa decimal quando maior ou igual a 1km', () => {
    expect(formatDistance(2300)).toBe('2,3 km');
  });
});
