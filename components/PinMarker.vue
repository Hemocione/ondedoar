<template>
  <mgl-geo-json-souce>
    <mgl-symbol-layer :id="name + '-layer'" :source="imgData" :layout="imgLayout" />
  </mgl-geo-json-souce>

</template>

<script setup lang="ts">


const props = defineProps<{
  imgSrc: string;
  name: string;
  coordinates: [number, number];
  zoom: number;
}>();

const imgData = computed(() => {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: {
          symbol: props.name,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: props.coordinates,
        }
      }
    ]
  }
})

const imgLayout = {
  'icon-image': ['get', 'symbol'],
  'icon-size': 500,
}

</script>