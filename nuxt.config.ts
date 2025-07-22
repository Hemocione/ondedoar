// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/global.css"],
  modules: ["nuxt-vercel-analytics", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Roboto: true,
    },
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
        uri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/local"
      }
    },
    inngest: {
      id: process.env.INNGEST_ID ?? "onde-doar-local"
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY,
      geocoding_url: "https://maps.googleapis.com/maps/api/geocode/json?"
    }
  }
});
