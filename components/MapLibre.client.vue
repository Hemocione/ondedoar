<template>
  <img ref="askForHelpImg" id="askforhelp" class="hidden" src="/assets/vectors/PinAskForHelp.svg" alt="pin-ask">
  <img ref="bloodBankImg" id="bloodbank" class="hidden" src="/assets/vectors/PinBloodBank.svg" alt="pin-blood-bank">
  <mgl-map :map-style="style" :center="center" :zoom="zoom" height="100vh" class="absolute" @map:zoom="onMapZoom">
    <mgl-navigation-control position="bottom-right" />
    <mgl-image id="askforhelp" :image="askForHelpImg" />
    <mgl-image id="bloodbank" :image="bloodBankImg" />
    <PinMarker :features="pinMarkersFeatures" />
  </mgl-map>
</template>

<script setup>
import { ref } from 'vue';
import {
  MglMap,
  MglNavigationControl,
  MglImage
} from '@indoorequal/vue-maplibre-gl';

// TODO: THINK OF A BETTER WAY TO DECLARE THIS REFS
const askForHelpImg = ref(null);
const bloodBankImg = ref(null);


// Basic info
const style = 'https://api.maptiler.com/maps/bright-v2/style.json?key=BDTz66DnaGp8XHXXMby2';
const center = [-55, -14.8];
const zoom = 3.92;
const pinMarkersFeatures = await getPointsParsed();

// TODO: Implement summary when zoom out (ask Joyce to draw a mockup)
// TODO: Use this to check how many pins to show
const currentZoom = ref();

const onMapZoom = (map) => {
  // A cada zoom, o tamanho do marcador é calculado com base no nível de zoom atual.
  // Você pode ajustar a fórmula `* 10` para controlar o quão rápido o marcador cresce.
  currentZoom.value = map.map.scrollZoom._targetZoom;
};

</script>