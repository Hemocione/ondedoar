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
    preset: 'vercel-edge',
    plugins: ["~/server/plugins/mongoose.ts"],
  },
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
  runtimeConfig: {
    db: {
      mongo: {
        uri: process.env.MONGODB_URI ?? "mongodb://localhost:27017",
        dbName: process.env.MONGODB_NAME ?? "local",
      }
    }
  }
});
