<template>
  <mgl-geo-json-source source-id="points" :data="geojsonSources">
    <mgl-symbol-layer layer-id="points" :layout="layout" @click="handleSymbolClick" />
  </mgl-geo-json-source>
</template>

<script setup lang="ts">
import {
  MglGeoJsonSource,
  MglSymbolLayer
} from '@indoorequal/vue-maplibre-gl';
import type { MapMouseEvent } from 'maplibre-gl';

const props = defineProps<{
  features: {
    coordinates: number[],
    [key: string]: any
  }[],
  zoom?: number
}>()

const geojsonSources = {
  type: 'FeatureCollection',
  features: props.features.map((feature) => {
    const { coordinates, ...properties } = feature;
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates
      },
      properties
    }
  })
};

const layout = {
  'icon-image': ['get', 'symbol'],
  'icon-size': 0.33
};

function handleSymbolClick(event: MapMouseEvent) {
  if (event.features && event.features.length > 0) {
    const feature = event.features[0];
    console.log('Dados do ponto:', feature.properties);
  }
}
</script>
