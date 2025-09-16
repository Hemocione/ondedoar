<template>
  <main class="main" :class="{ 'iframe-mode': isIframed }">
    <img v-if="!isIframed" src="/logos/principal.svg" alt="Logo Hemocione" width="200" style="padding-top: 3rem" />
    <section class="mapa">
      <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1s8gU7TwBgBVbE9fO3S7yUfrKP8Yhodiy" width="100%"
        height="100%" frameborder="0" :allowfullscreen="!isIframed" />
      <!-- <span class="disclaimer" :class="{ 'iframe-mode': isIframed }">
        Mapa criado por
        <a
          href="https://www.salvovidas.com/"
          target="_blank"
          rel="noopener noreferrer"
          >Salvo Vidas</a
        >
      </span> -->
    </section>
  </main>
</template>
<script setup lang="ts">
const route = useRoute();
const isIframed = computed(() => route.query.iframed === "true");

useHead(() => ({
  title: "Onde doar Sangue | Hemocione",
  meta: [
    {
      name: "description",
      content:
        "Encontre o hemocentro mais próximo de você e doe sangue. Salve vidas!",
    },
    {
      name: "keywords",
      content: "doação de sangue, hemocentro, hemocione, onde doar sangue",
    },
    {
      name: "og:title",
      content: "Onde doar Sangue | Hemocione",
    },
    {
      name: "og:description",
      content:
        "Encontre o hemocentro mais próximo de você e doe sangue. Salve vidas!",
    },
    {
      name: "og:image",
      content:
        "https://cdn.hemocione.com.br/events/prod/uploads/private/1708731949449-takeit.png",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "Onde doar Sangue | Hemocione",
    },
    {
      name: "twitter:description",
      content:
        "Encontre o hemocentro mais próximo de você e doe sangue. Salve vidas!",
    },
    {
      name: "twitter:image",
      content:
        "https://cdn.hemocione.com.br/events/prod/uploads/private/1708731949449-takeit.png",
    },
  ],
}));
</script>

<style scoped>
.disclaimer {
  position: absolute;
  top: -16px;
  right: 0;
  font-size: 0.7rem;
  padding-right: 0.5rem;
  text-align: right;
}

.disclaimer.iframe-mode {
  top: auto;
  bottom: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
}

.disclaimer a {
  color: var(--hemo-color-primary-light);
  text-decoration: none;
}

.main {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  height: 100svh;
  width: 100vw;
  gap: 1.5rem;
}

.main.iframe-mode {
  gap: 0;
}

.mapa {
  position: relative;
  width: 90%;
  height: 70%;
}

.main.iframe-mode .mapa {
  width: 100%;
  height: 100%;
}

.mapa iframe {
  border-radius: 1rem;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.3);
}

.main.iframe-mode .mapa iframe {
  border-radius: 0;
  box-shadow: none;
}

@media screen and (max-width: 768px) {
  .mapa {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .mapa iframe {
    border-radius: 0;
  }
}
</style>
