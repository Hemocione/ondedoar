import { handleHemocioneDigitalEventsPoints } from "~/server/services/hemocioneDigitalEvents";

export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const { after } = params;

  if (!after) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing "after" parameter'
    });
  }

  if (typeof (after) !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: '"after" parameter must be a string'
    });
  }

  const events = await handleHemocioneDigitalEventsPoints();

  return events
})
