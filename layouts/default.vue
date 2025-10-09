<template>
  <div class="relative h-screen overflow-hidden">
    <div class="absolute inset-0 z-10">
      <slot />
    </div>

    <MapLibreClient class="absolute inset-0" />
  </div>
</template>

<script setup lang="ts">
import MapLibreClient from '~/components/MapLibre.client.vue';
</script>

<style></style>