import tailwindcss from "@tailwindcss/vite";

const getSiteUrl = () => {
  if (process.env.VERCEL_ENV === undefined) {
    const nuxtDevConfig = process.env.__NUXT_DEV__;
    let networkAddress;
    if (nuxtDevConfig) {
      const parsedConfig = JSON.parse(nuxtDevConfig);
      networkAddress = parsedConfig?.proxy?.urls?.find(
        (addr: any) => addr.type === "network"
      )?.url;
    }

    return networkAddress || "http://localhost:3000";
  }

  if (process.env.VERCEL_ENV !== "production") {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "https://possodoar.hemocione.com.br";
};

const siteUrl = getSiteUrl();
console.log("Site URL:", siteUrl);

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/global.css"],
  modules: ["@nuxt/eslint", "nuxt-vercel-analytics", "@nuxt/ui", "@pinia/nuxt"],
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
    public: {
      authCookieKey: process.env.HEMOCIONE_AUTH_COOKIE_KEY || "devHemocioneId",
      siteUrl,
      hemocioneIdUrl: process.env.HEMOCIONEID_URL ?? "http://localhost:8080",
      hemocioneIdApiUrl: process.env.HEMOCIONEID_API_URL ?? "http://localhost:8080",
    },
    db: {
      mongo: {
        dbName: process.env.MONGODB_NAME ?? "local",
        uri: process.env.MONGODB_URI ?? "mongodb://localhost:27018/local"
      }
    },
    inngest: {
      key: process.env.INNGEST_EVENT_KEY || "devInngestApiKey",
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY,
      geocoding_url: "https://maps.googleapis.com/maps/api/geocode/json?"
    },
    hemocioneId: {
      apiUrl: process.env.HEMOCIONEID_API_URL ?? "http://localhost:8080",
      backOfficeSecret: process.env.HEMOCIONEID_SECRET ?? "secret"
    },
    hemocioneDigitalEvents: {
      apiUrl: process.env.HEMOCIONE_DIGITAL_EVENTS_API_URL ?? "http://localhost:3001",
      secret: process.env.HEMOCIONEID_SECRET ?? "secret"
    },
    hemocioneAskforHelp: {
      apiUrl: process.env.HEMOCIONE_ASK_FOR_HELP_API_URL ?? "http://localhost:3001",
      secret: process.env.HEMOCIONE_ASK_FOR_HELP_SECRET ?? 'secret'
    }
  }
});