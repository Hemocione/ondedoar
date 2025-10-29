<template>
  <div class="flex flex-col justify-center items-start gap-6">
    <div class="header flex flex-col">
      <span class="title text-2xl font-semibold">{{ placeDetails.name }}</span>
      <!-- TODO: FIX FORMAT FOR THIS PAGE -->
      <span class="subtitle font-normal text-xs text-gray-500">{{ formatSubtitle(placeDetails.distance,
        placeDetails.address) }}</span>
      <TypeTag :type="placeDetails.type" class="self-start mt-1" />
    </div>

    <div class="content flex flex-col gap-6">
      <div class="address flex flex-row gap-3">
        <img class="w-4 h-4" src="/assets/vectors/RedMapPin.svg" alt="Marcador de mapa vermelho">
        <span class="text-sm font-normal">{{ placeDetails.address }}</span>
      </div>
      <div class="phone flex flex-row gap-3" v-if="placeDetails.phone">
        <img class="w-4 h-4" src="/assets/vectors/RedPhone.svg" alt="Telefone vermelho">
        <span class="text-sm font-normal">{{ placeDetails.phone }}</span>
      </div>
      <div class="link flex flex-row gap-3" v-if="placeDetails.link">
        <img class="w-4 h-4" src="/assets/vectors/RedLink.svg" alt="Globo vermelho com um cursor vermelho">
        <a :href="placeDetails.link" target="_blank" class="text-sm font-bold underline">Ir para o
          site</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  placeDetails: {
    active: boolean,
    name: string,
    phone?: string,
    link?: string,
    type?: string,
    distance?: string,
    address?: string
  }
}>();

</script>