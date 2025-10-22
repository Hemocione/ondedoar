async function getPoints() {
  return await $fetch('/api/v1/points')
}

// TODO: ADD TYPING
export const getPointsParsed = async () => {
  const points = await getPoints()
  return points.map((point: any) => {
    return {
      coordinates: point.loc.coordinates,
      symbol: point.type
    }
  })
}