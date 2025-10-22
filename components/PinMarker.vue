<template>
  <mgl-geo-json-source source-id="point" :data="geojsonSource">
    <mgl-symbol-layer layer-id="AskForHelp" :layout="layout" />
  </mgl-geo-json-source>
</template>

<script setup lang="ts">
import {
  MglGeoJsonSource,
  MglSymbolLayer
} from '@indoorequal/vue-maplibre-gl';

const geojsonSource = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-55, -24.8]
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

</script>