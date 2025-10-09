<template>
  <mgl-map :map-style="style" :center="center" :zoom="zoom" height="100vh" class="absolute" @map:zoom="onMapZoom">
    <mgl-navigation-control />
  </mgl-map>
</template>

<script setup>
import {
  MglMap,
  MglNavigationControl,
} from '@indoorequal/vue-maplibre-gl';

// Basic info for MapLibre
const style = 'https://api.maptiler.com/maps/bright-v2/style.json?key=BDTz66DnaGp8XHXXMby2';
const center = [-55, -14.8];
const zoom = 3.92;

// TODO: Use this to check how many pins to show
const currentZoom = ref();

const onMapZoom = (map) => {
  // A cada zoom, o tamanho do marcador é calculado com base no nível de zoom atual.
  // Você pode ajustar a fórmula `* 10` para controlar o quão rápido o marcador cresce.
  currentZoom.value = map.map.scrollZoom._targetZoom;
};
</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
</style>