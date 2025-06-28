import { serve } from 'inngest/nuxt';

// Export Inngest here
// TODO: Add the Inngest instance to the Nuxt context
export default defineEventHandler(serve())