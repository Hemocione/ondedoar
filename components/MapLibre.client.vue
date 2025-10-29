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
    <mgl-geolocate-control position="bottom-left" :position-options="{ enableHighAccuracy: true }"
      :track-user-location="true" :show-user-location="true" :fit-bounds-options="{ maxZoom: 12 }" />
    <mgl-image id="askforhelp" :image="pinAskForHelpImg" />
    <mgl-image id="bloodbank" :image="pinBloodBankImg" />
    <mgl-image id="event" :image="pinEventImg" />
    <mgl-image id="hemocenter" :image="pinHemoCenterImg" />
    <mgl-image id="hospital" :image="pinHospitalImg" />
    <PinMarker :features="pinMarkersFeatures" />
  </mgl-map>
</template>

<script setup>
import {
  MglMap,
  MglGeolocateControl,
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
const center = useMapCenter();
const zoom = 3.92;
const pinMarkersFeatures = await getPointsParsed();

const mapInstance = ref(null);

// Load composables
const visibleFeatures = useVisibleFeatures();
const loadingVisibleFeatures = useLoadingVisibleFeatures();
const locationPermission = useLocationPermission();

const updateVisibleFeatures = () => {
  if (!mapInstance.value) return;

  const features = mapInstance.value.queryRenderedFeatures({ layers: ['points'] });

  const uniqueFeatures = new Map();
  features.forEach(feature => {
    if (!uniqueFeatures.has(feature.properties._id)) {
      uniqueFeatures.set(feature.properties._id, feature.properties);
    }
  });

  visibleFeatures.value = Array.from(uniqueFeatures.values());

  if (loadingVisibleFeatures.value) {
    loadingVisibleFeatures.value = false;
  }
};

const onMapLoad = (event) => {
  mapInstance.value = event.map;

  // Atualiza a lista de features visíveis sempre que o mapa ficar ocioso
  // (após zoom, pan, etc., e também no carregamento inicial).
  mapInstance.value.on('idle', updateVisibleFeatures);

  const geolocateButton = document.querySelector('.maplibregl-ctrl-geolocate');

  if (!geolocateButton) {
    console.warn('Geolocate button not found');
    return;
  }

  if (locationPermission.value === 'granted') {
    geolocateButton.click();
  }

  watch(locationPermission, (newPermission) => {
    if (newPermission === 'granted') {
      geolocateButton.click();
    }
  });
}

const currentZoom = ref();

const onMapZoom = (map) => {
  // A cada zoom, o tamanho do marcador é calculado com base no nível de zoom atual.
  // Você pode ajustar a fórmula `* 10` para controlar o quão rápido o marcador cresce.
  currentZoom.value = map.map.scrollZoom._targetZoom;
};

watch(center, (newCenter) => {
  if (mapInstance.value) {
    mapInstance.value.flyTo({ center: newCenter, zoom: 15 });
  }
});

</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";

.maplibregl-user-location-dot,
.maplibregl-user-location-dot:before {
  background-color: var(--color-red-700);
}

.maplibregl-user-location-accuracy-circle {
  background-color: #B91C1C80;
}
</style>