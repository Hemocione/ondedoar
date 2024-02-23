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
    preset: 'vercel-edge'
  },
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
});
