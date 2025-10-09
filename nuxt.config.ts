import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/global.css"],
  modules: ["@nuxt/eslint", "nuxt-vercel-analytics"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  nitro: {
    preset: 'vercel',
    plugins: ["~/server/plugins/mongoose.ts"],
  },
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
  runtimeConfig: {
    db: {
      mongo: {
        uri: process.env.MONGODB_URI ?? "mongodb://localhost:27018/local"
      }
    },
    inngest: {
      id: process.env.INNGEST_ID ?? "onde-doar-local"
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY,
      geocoding_url: "https://maps.googleapis.com/maps/api/geocode/json?"
    },
    hemocioneId: {
      apiUrl: process.env.HEMOCIONEID_API_URL ?? "http://localhost:8080",
      backOfficeSecret: process.env.HEMOCIONEID_BACKOFFICE_SECRET ?? "secret"
    },
    hemocioneAskforHelp: {
      apiUrl: process.env.HEMOCIONE_ASK_FOR_HELP_API_URL ?? "http://localhost:3001",
      backOfficeSecret: process.env.HEMOCIONE_ASK_FOR_HELP_BACKOFFICE_SECRET ?? 'config.hemocioneAskforHelp.apiUrl'
    }
  }
});
