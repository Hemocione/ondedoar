import type { PipelineStage } from "mongoose";
import { Point } from "../db/models/points";

export async function getActivePoints() {
  const points = await Point.find({ active: true })
  return points;
}

interface NearestPipelineParams {
  lng: number;
  lat: number;
  maxDistanceMeters: number;
  limit: number;
  type?: string;
  now: Date;
  excludeExpired: boolean;
}

export function buildNearestPipeline(q: NearestPipelineParams): PipelineStage[] {
  const query: Record<string, unknown> = { active: true };
  // Ponto sem expirationDate (ausente ou null) não vence nunca: em prod nenhum
  // banco de sangue tem o campo, então $gte sozinho zeraria o resultado.
  if (q.excludeExpired) {
    query.$or = [
      { expirationDate: { $exists: false } },
      { expirationDate: null },
      { expirationDate: { $gte: q.now } },
    ];
  }
  if (q.type !== undefined) query.type = q.type;

  // $geoNear usa o índice 2dsphere já declarado em PointsSchema.
  return [
    {
      $geoNear: {
        near: { type: "Point", coordinates: [q.lng, q.lat] },
        distanceField: "distanceMeters",
        maxDistance: q.maxDistanceMeters,
        query,
        spherical: true,
      },
    },
    { $limit: q.limit },
  ];
}

export async function getNearestActivePoints(
  q: Omit<NearestPipelineParams, "now">,
): Promise<Array<{ point: Record<string, unknown>; distanceMeters: number }>> {
  // aggregate (e não find) para obter a distância calculada junto do documento.
  const results = await Point.aggregate(buildNearestPipeline({ ...q, now: new Date() }));
  return results.map(({ distanceMeters, ...point }) => ({
    point,
    distanceMeters: Math.round(distanceMeters),
  }));
}

export async function getNearestActivePoint(
  lng: number,
  lat: number,
  maxDistanceMeters: number,
) {
  const [result] = await getNearestActivePoints({
    lng,
    lat,
    maxDistanceMeters,
    limit: 1,
    excludeExpired: false,
  });
  return result ?? null;
}
