<template>
  <mgl-marker :coordinates="coordinates">
    <template v-slot:marker>
      <img v-show="type === 'askforhelp'" class="w-9 h-9" src="/assets/vectors/PinAskForHelp.svg" :alt="alt">
      <img v-show="type === 'bloodbank'" class="w-9 h-9" src="/assets/vectors/PinBloodBank.svg" :alt="alt">
      <img v-show="type === 'event'" class="w-9 h-9" src="/assets/vectors/PinEvent.svg" :alt="alt">
      <img v-show="type === 'hemocenter'" class="w-9 h-9" src="/assets/vectors/PinHemoCenter.svg" :alt="alt">
      <img v-show="type === 'hospital'" class="w-9 h-9" src="/assets/vectors/PinHospital.svg" :alt="alt">
    </template>
  </mgl-marker>
</template>

<script setup lang="ts">
import {
  MglMarker
} from '@indoorequal/vue-maplibre-gl';

const props = defineProps<{
  type: string,
  coordinates: number[],
  alt: string
}>()

</script>