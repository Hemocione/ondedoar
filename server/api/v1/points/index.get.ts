import { getActivePoints } from "~/server/services/point"

export default defineEventHandler(async (event) => {
  const points = await getActivePoints()
  // if (!points) {
  //   setResponseStatus(event, 404)
  //   return {
  //     error: 'No active points found'
  //   }
  // }
  return points
})