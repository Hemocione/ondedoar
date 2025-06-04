import { Point } from "../db/models/points";

export async function getActivePoints() {
  const points = await Point.find()
  return points;
}