<template>
  <img ref="askForHelpImg" id="AskForHelp" class="hidden h-10 w-10" src="/assets/pngs/PinAskForHelp.png" alt="pin-ask">
  <mgl-map :map-style="style" :center="center" :zoom="zoom" height="100vh" class="absolute" @map:zoom="onMapZoom">
    <mgl-navigation-control position="bottom-right" />
    <mgl-image id="AskForHelp" :image="askForHelpImg" />

    <mgl-geo-json-source source-id="point" :data="geojsonSource">
      <mgl-symbol-layer layer-id="AskForHelp" :layout="layout" />
    </mgl-geo-json-source>
  </mgl-map>
</template>

<script setup>
import { ref } from 'vue';
import {
  MglMap,
  MglNavigationControl,
  MglImage,
  MglGeoJsonSource,
  MglSymbolLayer

} from '@indoorequal/vue-maplibre-gl';

// TEST
const askForHelpImg = ref(null);

const geojsonSource = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-55, -14.8]
      },
      properties: {
        symbol: 'AskForHelp'
      }
    }
  ]
};

const layout = {
  'icon-image': ['get', 'symbol'],
  'icon-size': 1
};

// Basic info
const style = 'https://api.maptiler.com/maps/bright-v2/style.json?key=BDTz66DnaGp8XHXXMby2';
const center = [-55, -14.8];
const zoom = 3.92;
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