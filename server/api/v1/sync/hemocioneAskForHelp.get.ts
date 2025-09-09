import { taskManager } from "~/server/tasks";

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

  const ids = await taskManager.triggerJob('syncHemocioneAskForHelp', { after });

  return {
    message: 'Hemocione Ask for Help points sync job triggered successfully',
    ids
  };
})