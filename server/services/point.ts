import { Point } from "../db/models/points";

export async function getActivePoints() {
  const points = await Point.find({ active: true })
  return points;
}

export async function getNearestActivePoint(
  lng: number,
  lat: number,
  maxDistanceMeters: number,
) {
  // $geoNear via aggregate para obter a distância calculada junto do documento.
  // Usa o índice 2dsphere já declarado em PointsSchema.
  const [result] = await Point.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng, lat] },
        distanceField: "distanceMeters",
        maxDistance: maxDistanceMeters,
        query: { active: true },
        spherical: true,
      },
    },
    { $limit: 1 },
  ]);

  if (!result) return null;

  const { distanceMeters, ...point } = result;
  return { point, distanceMeters: Math.round(distanceMeters) };
}
