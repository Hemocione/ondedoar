<template>
  <mgl-map :map-style="style" :center="center" :zoom="zoom" height="100vh" class="absolute" @map:zoom="onMapZoom"
    @map:load="onMapLoad">
    <mgl-geolocate-control position="bottom-left" :position-options="{ enableHighAccuracy: true }"
      :track-user-location="true" :show-user-location="true" :fit-bounds-options="{ maxZoom: 12 }"
      @geolocate="onGeolocate" />
    <PinMarker :features="pinMarkersFeatures" />

    <mgl-geo-json-source v-if="currentRoute" source-id="route-source" :data="currentRoute">
      <mgl-line-layer layer-id="route-layer" :layout="{ 'line-join': 'round', 'line-cap': 'round' }" :paint="{ 'line-color': '#EF4444', 'line-width': 5, 'line-opacity': 0.8 }" />
    </mgl-geo-json-source>

  </mgl-map>
</template>

<script setup>
import {
  MglMap,
  MglGeolocateControl,
  MglGeoJsonSource,
  MglLineLayer
} from '@indoorequal/vue-maplibre-gl';

import pinAskForHelpUrl from '~/assets/vectors/PinAskForHelp.svg';
import pinBloodBankUrl from '~/assets/vectors/PinBloodBank.svg';
import pinEventUrl from '~/assets/vectors/PinEvent.svg';
import pinHemoCenterUrl from '~/assets/vectors/PinHemoCenter.svg';
import pinHospitalUrl from '~/assets/vectors/PinHospital.svg';
import { useMapStore } from '~/store/map';
import { useUserStore } from '~/store/users';

// Load stores
const config = useRuntimeConfig();
const userStore = useUserStore();
const { permitUserLocation } = storeToRefs(userStore)
const mapStore = useMapStore();

// Basic info
const style = `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`;
const zoom = 3.91;

const mapInstance = ref(null);

const pinMarkersFeatures = await mapStore.fetchPoints();
const { isLoadingVisibleFeatures: loadingVisibleFeatures, mapCenter: center, currentRoute } = storeToRefs(mapStore);

const updateVisibleFeatures = () => {
  if (!mapInstance.value) return;

  const features = mapInstance.value.queryRenderedFeatures({ layers: ['points'] });

  const uniqueFeatures = new Map();
  features.forEach(feature => {
    if (!uniqueFeatures.has(feature.properties._id)) {
      uniqueFeatures.set(feature.properties._id, feature.properties);
    }
  });

  mapStore.updateVisibleFeatures(Array.from(uniqueFeatures.values()));

  if (loadingVisibleFeatures.value) {
    mapStore.setLoadingVisibleFeatures(false);
  }
};

const onGeolocate = (event) => {
  if (event && event.coords) {
    userStore.setUserLocation([event.coords.longitude, event.coords.latitude]);
  }
};

const onMapLoad = (event) => {
  mapInstance.value = event.map;

  const loadImage = (id, url) => {
    const img = new Image();
    img.onload = () => {
      if (!mapInstance.value.hasImage(id)) {
        mapInstance.value.addImage(id, img);
      }
    };
    img.src = url;
  }

  loadImage('askforhelp', pinAskForHelpUrl);
  loadImage('bloodbank', pinBloodBankUrl);
  loadImage('event', pinEventUrl);
  loadImage('hemocenter', pinHemoCenterUrl);
  loadImage('hospital', pinHospitalUrl);

  // Atualiza a lista de features visíveis sempre que o mapa ficar ocioso
  // (após zoom, pan, etc., e também no carregamento inicial).
  mapInstance.value.on('idle', updateVisibleFeatures);

  const geolocateButton = document.querySelector('.maplibregl-ctrl-geolocate');

  if (!geolocateButton) {
    console.warn('Geolocate button not found');
    return;
  }

  if (permitUserLocation.value === 'granted') {
    geolocateButton.click();
  }

  watch(permitUserLocation, (newPermission) => {
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

watch(currentRoute, (newRoute) => {
  if (newRoute && mapInstance.value) {
    // Optionally fit bounds to the route. Using a simple approach.
    try {
      const coords = newRoute.geometry.coordinates;
      if (coords.length > 0) {
        let minLng = coords[0][0], maxLng = coords[0][0];
        let minLat = coords[0][1], maxLat = coords[0][1];
        for (const [lng, lat] of coords) {
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
        mapInstance.value.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 50 });
      }
    } catch (e) {
      console.error("Error expanding bounding box:", e);
    }
  }
});

// onMounted(async () => {

//   console.log('PinMarkers')
//   console.log(pinMarkersFeatures.value)
// })
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