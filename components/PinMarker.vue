<template>
  <mgl-geo-json-source source-id="points" :data="geojsonSources">
    <mgl-symbol-layer
      layer-id="points"
      :layout="layout"
      @click="handleSymbolClick"
    />
  </mgl-geo-json-source>
</template>

<script setup lang="ts">
import { MglGeoJsonSource, MglSymbolLayer } from "@indoorequal/vue-maplibre-gl";
import type { MapMouseEvent } from "maplibre-gl";
import { useDrawerStore } from "~/store/drawer";
import { useInfoStore } from "~/store/info";
import { useMapStore } from "~/store/map";

const props = defineProps<{
  features: {
    coordinates: number[];
    [key: string]: any;
  }[];
  zoom?: number;
}>();

// Precisa ser computed, não um objeto plano fixado no setup: senão a camada
// de pins nunca atualiza quando `features` muda (ex.: filtro de raio ligado/
// desligado) — o source do MapLibre continua servindo os dados do primeiro
// render pra sempre.
const geojsonSources = computed(() => ({
  type: "FeatureCollection",
  features: props.features.map((feature) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: feature.coordinates,
      },
      // `coordinates` fica também nas properties: é daqui que a lista e o painel de
      // detalhes leem o destino do "Como chegar". Sem isso o botão só sabe dizer
      // "Coordenadas do destino não encontradas" (o MapLibre serializa o array,
      // por isso ItemMoreDetails aceita string e faz JSON.parse).
      properties: feature,
    };
  }),
}));

const moreInfo = useMoreInfo();
const mapStore = useMapStore();
const drawerStore = useDrawerStore();
const infoStore = useInfoStore();

const layout = {
  "icon-image": ["get", "symbol"],
  "icon-size": 0.33,
};

function settingloadingValue() {
  infoStore.setloadingVisibleFeatures(true);
  setTimeout(() => {
    infoStore.setloadingVisibleFeatures(false);
  }, 1500);
}

function zoomInPinMarker(pointId: string) {
  const feature = geojsonSources.value.features.find((f) => f.properties._id === pointId);
  
  if (feature && feature.geometry.coordinates) {
    const coord = feature.geometry.coordinates;
    const lng = coord[0] ?? 0;
    const lat = coord[1] ?? 0;

    // Trigger watch in MapLibre.client.vue, which cleanly flyTo({ zoom: 15, offset: [0, 150] }).
    mapStore.setMapCenter([lng, lat - 0.006]);
  }
}

function handleSymbolClick(event: MapMouseEvent) {
  if (event.features && event.features.length > 0) {
    const feature = event.features[0];
  }
  moreInfo.value = event.features[0].properties;
  drawerStore.setFull();
  settingloadingValue();
  zoomInPinMarker(event.features[0].properties._id);
}
</script>
