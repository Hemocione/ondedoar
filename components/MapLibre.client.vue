<template>
  <mgl-map :map-style="style" :center="center" :zoom="zoom" height="100vh" class="absolute" @map:zoom="onMapZoom"
    @map:load="onMapLoad">
    <mgl-navigation-control position="bottom-right" />
    <!-- CURRENTLY WORKING -> NEEDS TO FIX SIZE -> NEEDS TO MOVE INTO COMPONENT -->
    <img src="/assets/vectors/PinAskForHelp.svg" alt="pin-ask" ref="pin" style="display: none">
    <mgl-image id="pin" :image="pin" />

    <mgl-geo-json-source source-id="point" :data="geojsonSource">
      <mgl-symbol-layer layer-id="pin" :layout="layout" />
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
import pinAskForHelpSrc from '~/assets/pngs/PinAskForHelp.png';
import pinBloodBankSrc from '~/assets/pngs/PinBloodBank.png';
import pinHospitalSrc from '~/assets/pngs/PinHospital.png';

// TEST
const geojsonSource = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      },
      properties: {
        symbol: 'pin'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [42, 42]
      },
      properties: {
        symbol: 'dog'
      }
    }
  ]
};

const layout = {
  'icon-image': ['get', 'symbol'],
  'icon-size': 0.25
};

// Basic info
const style = 'https://api.maptiler.com/maps/bright-v2/style.json?key=BDTz66DnaGp8XHXXMby2';
const center = [-55, -14.8];
const zoom = 3.92;
const pinImgs = [
  {
    name: 'PinAskForHelp',
    imgSrc: pinAskForHelpSrc
  },
  {
    name: 'PinBloodBank',
    imgSrc: pinBloodBankSrc
  },
  {
    name: 'PinHospital',
    imgSrc: pinHospitalSrc
  },
];
const pins = [
  {
    id: 1,
    name: 'pinAskForHelp',
    imgSrc: pinAskForHelpSrc,
    coordinates: [-47.8825, -15.7942], // Brasília
  },
  {
    id: 2,
    name: 'PinBloodBank',
    imgSrc: pinBloodBankSrc,
    coordinates: [-43.2096, -22.9035], // Rio de Janeiro
  },
  {
    id: 3,
    name: 'PinHospital',
    imgSrc: pinHospitalSrc,
    coordinates: [-46.6333, -23.5505], // São Paulo
  },
];
// TODO: Use this to check how many pins to show
const currentZoom = ref();

const onMapZoom = (map) => {
  // A cada zoom, o tamanho do marcador é calculado com base no nível de zoom atual.
  // Você pode ajustar a fórmula `* 10` para controlar o quão rápido o marcador cresce.
  currentZoom.value = map.map.scrollZoom._targetZoom;
};

const onMapLoad = ({ map }) => {
  pinImgs.forEach(pinImg => {
    map.loadImage(pinImg.imgSrc, (error, image) => {
      if (error) {
        console.error(`An error occurred while loading image ${pinImg.name}:`, error);
        return;
      }
      // Check if the image is already added to prevent errors on style change or hot-reload
      if (!map.hasImage(pinImg.name)) {
        map.addImage(pinImg.name, image);
      }
    });
  });
};
</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
</style>