async function getPoints() {
  return await $fetch('/api/v1/points')
}

// TODO: ADD TYPING
export const getPointsParsed = async () => {
  const points = await getPoints()
  const uniquePoints = new Map()
  points.forEach((point: any) => {
    if (!uniquePoints.has(point.address)) {
      uniquePoints.set(point.address, {
        coordinates: point.loc.coordinates,
        symbol: point.type,
        ...point,
      })
    }
  })
  return Array.from(uniquePoints.values())
}