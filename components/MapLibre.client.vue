<template>
  <img ref="pinAskForHelpImg" id="askforhelp" class="hidden" src="/assets/vectors/PinAskForHelp.svg"
    alt="pin-ask-for-help">
  <img ref="pinBloodBankImg" id="bloodbank" class="hidden" src="/assets/vectors/PinBloodBank.svg" alt="pin-blood-bank">
  <img ref="pinEventImg" id="event" class="hidden" src="/assets/vectors/PinEvent.svg" alt="pin-event">
  <img ref="pinHemoCenterImg" id="hemocenter" class="hidden" src="/assets/vectors/PinHemoCenter.svg"
    alt="pin-hemocenter">
  <img ref="pinHospitalImg" id="hospital" class="hidden" src="/assets/vectors/PinHospital.svg" alt="pin-hospital">

  <mgl-map :map-style="style" :center="center" :zoom="zoom" height="100vh" class="absolute" @map:zoom="onMapZoom"
    @map:load="onMapLoad">
    <mgl-navigation-control position="bottom-right" />
    <mgl-image id="askforhelp" :image="pinAskForHelpImg" />
    <mgl-image id="bloodbank" :image="pinBloodBankImg" />
    <mgl-image id="event" :image="pinEventImg" />
    <mgl-image id="hemocenter" :image="pinHemoCenterImg" />
    <mgl-image id="hospital" :image="pinHospitalImg" />
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
const pinAskForHelpImg = ref(null);
const pinBloodBankImg = ref(null);
const pinEventImg = ref(null);
const pinHemoCenterImg = ref(null);
const pinHospitalImg = ref(null);


// Basic info
const style = 'https://api.maptiler.com/maps/bright-v2/style.json?key=BDTz66DnaGp8XHXXMby2';
const center = [-55, -14.8];
const zoom = 3.92;
const pinMarkersFeatures = await getPointsParsed();

// --- Contagem de marcadores visíveis ---
const mapInstance = ref(null);

const updateVisibleMarkersCount = () => {
  if (!mapInstance.value) return;

  const features = mapInstance.value.queryRenderedFeatures({ layers: ['points'] });

  // Usamos um Set para garantir que cada marcador seja contado apenas uma vez,
  // mesmo que a biblioteca do mapa o divida em múltiplos "features" renderizados.
  // O ID do ponto (ex: `feature.properties._id`) é usado para a identificação única.
  const uniqueIds = new Set();
  features.forEach(feature => uniqueIds.add(feature.properties._id));

  console.log('Marcadores visíveis:', uniqueIds.size);
};

const onMapLoad = (event) => {
  mapInstance.value = event.map;
  // Atualiza a contagem sempre que o mapa terminar de se mover ou dar zoom.
  mapInstance.value.on('moveend', updateVisibleMarkersCount);
  mapInstance.value.on('zoomend', updateVisibleMarkersCount);

  // Chama uma vez no início para a contagem inicial.
  updateVisibleMarkersCount();
}
// --- Fim da contagem ---


// TODO: Implement summary when zoom out (ask Joyce to draw a mockup)
// TODO: Use this to check how many pins to show
const currentZoom = ref();

const onMapZoom = (map) => {
  // A cada zoom, o tamanho do marcador é calculado com base no nível de zoom atual.
  // Você pode ajustar a fórmula `* 10` para controlar o quão rápido o marcador cresce.
  currentZoom.value = map.map.scrollZoom._targetZoom;
};

</script>