import { taskManager } from "~/server/tasks";
import { SyncManager } from "~/server/db/models/syncManager";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { providerName } = body

  if (!providerName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing "provider" parameter'
    });
  }

  if (typeof (providerName) !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: '"provider" parameter must be a string'
    });
  }

  const syncManager = await SyncManager.create({
    providerName
  })

  event.node.res.statusCode = 201;

  return {
    syncManager
  };
})