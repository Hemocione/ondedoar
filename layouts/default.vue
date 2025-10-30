<!-- TODO: FIX MAP INTERECTIVENESS AND BUTTONS AND COMPONENTS ONE -->
<template>
  <div class="relative min-h-screen">
    <div class="absolute z-10 w-full">
      <slot />
    </div>

    <MapLibreClient class="absolute inset-0" />
  </div>
</template>

<script setup lang="ts">
import MapLibreClient from '~/components/MapLibre.client.vue';
</script>

<style></style>