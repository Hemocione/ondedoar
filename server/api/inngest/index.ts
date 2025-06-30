import { serve } from 'inngest/nuxt';
import { taskManager } from '~/server/tasks';

// Export Inngest here
// TODO: Add the Inngest instance to the Nuxt context
export default defineEventHandler(serve({
  client: taskManager.getInngest(),
  functions: taskManager.jobs,
}))