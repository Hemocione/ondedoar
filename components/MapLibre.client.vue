<template>
  <mgl-map :map-style="style" :center="center" :zoom="zoom" height="100vh" class="absolute" @map:zoom="onMapZoom">
    <mgl-geolocate-control position="bottom-left" :position-options="{ enableHighAccuracy: true }"
      :track-user-location="true" :show-user-location="true" />
    <mgl-navigation-control position="bottom-right" />
    <PinMarker v-for="pinMarker in pinMarkers" :key="pinMarker" :type="pinMarker.type"
      :coordinates="pinMarker.coordinates" :alt="`pin-${pinMarker.type}`" />
  </mgl-map>
</template>

<script setup>
import { ref } from 'vue';
import {
  MglMap,
  MglNavigationControl,
  MglGeolocateControl,
} from '@indoorequal/vue-maplibre-gl';

// Basic info
const style = 'https://api.maptiler.com/maps/bright-v2/style.json?key=BDTz66DnaGp8XHXXMby2';
const center = [-55, -14.8];
const zoom = 3.92;
const pinMarkers = await getPointsParsed();

// TODO: Implement summary when zoom out (ask Joyce to draw a mockup)
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