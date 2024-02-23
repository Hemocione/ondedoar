<template>
  <main class="main">
    <img
      src="/logos/principal.svg"
      alt="Logo Hemocione"
      width="200"
      style="padding-top: 2rem"
    />
    <section class="mapa">
      <iframe
        src="https://www.google.com/maps/d/u/0/embed?mid=1s8gU7TwBgBVbE9fO3S7yUfrKP8Yhodiy"
        width="100%"
        height="100%"
        frameborder="0" 
        allowfullscreen
      />
      <span class="disclaimer">
        Mapa criado por <a href="https://www.salvovidas.com/" target="_blank" rel="noopener noreferrer">Salvo Vidas</a>
      </span>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead(() => ({
  title: 'Onde doar Sangue | Hemocione' ,
}))
</script>

<style scoped>
.disclaimer {
  position: absolute;
  top: -16px;
  right: 0;
  font-size: 0.7rem;
  text-align: right;
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

.mapa {
  position: relative;
  width: 90%;
  height: 70%;
}

.mapa iframe {
  border-radius: 1rem;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.3);
}

@media screen and (max-width: 768px){
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