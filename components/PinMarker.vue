<template>
  <mgl-geo-json-source source-id="points" :data="geojsonSources">
    <mgl-symbol-layer layer-id="points" :layout="layout" />
  </mgl-geo-json-source>
</template>

<script setup lang="ts">
import {
  MglGeoJsonSource,
  MglSymbolLayer
} from '@indoorequal/vue-maplibre-gl';

const props = defineProps<{
  features: {
    coordinates: number[],
    symbol: string
  }[],
  zoom?: number
}>()

const geojsonSources = {
  type: 'FeatureCollection',
  features: props.features.map((feature) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: feature.coordinates
      },
      properties: {
        symbol: feature.symbol
      }
    }
  })
};

const layout = {
  'icon-image': ['get', 'symbol'],
  'icon-size': 1
};

</script>