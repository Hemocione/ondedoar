<template>
  <img ref="askForHelpImg" id="AskForHelp" class="hidden h-10 w-10" src="/assets/pngs/PinAskForHelp.png" alt="pin-ask">
  <img ref="bloodBankImg" id="BloodBank" class="hidden h-10 w-10" src="/assets/pngs/PinBloodBank.png"
    alt="pin-blood-bank">
  <mgl-map :map-style="style" :center="center" :zoom="zoom" height="100vh" class="absolute" @map:zoom="onMapZoom">
    <mgl-navigation-control position="bottom-right" />
    <mgl-image id="AskForHelp" :image="askForHelpImg" />
    <mgl-image id="BloodBank" :image="bloodBankImg" />
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
const pinMarkersFeatures = [
  {
    coordinates: [-55, -24.8],
    symbol: 'AskForHelp'
  },
  {
    coordinates: [-55, -14.8],
    symbol: 'BloodBank'
  }
]
// const pinImgs = [
//   {
//     name: 'PinAskForHelp',
//     imgSrc: pinAskForHelpSrc
//   },
//   {
//     name: 'PinBloodBank',
//     imgSrc: pinBloodBankSrc
//   },
//   {
//     name: 'PinHospital',
//     imgSrc: pinHospitalSrc
//   },
// ];
// const pins = [
//   {
//     id: 1,
//     name: 'pinAskForHelp',
//     imgSrc: pinAskForHelpSrc,
//     coordinates: [-47.8825, -15.7942], // Brasília
//   },
//   {
//     id: 2,
//     name: 'PinBloodBank',
//     imgSrc: pinBloodBankSrc,
//     coordinates: [-43.2096, -22.9035], // Rio de Janeiro
//   },
//   {
//     id: 3,
//     name: 'PinHospital',
//     imgSrc: pinHospitalSrc,
//     coordinates: [-46.6333, -23.5505], // São Paulo
//   },
// ];
// TODO: Use this to check how many pins to show
const currentZoom = ref();

const onMapZoom = (map) => {
  // A cada zoom, o tamanho do marcador é calculado com base no nível de zoom atual.
  // Você pode ajustar a fórmula `* 10` para controlar o quão rápido o marcador cresce.
  currentZoom.value = map.map.scrollZoom._targetZoom;
};

</script>