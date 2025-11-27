<template>
  <div class="flex flex-col justify-center items-start gap-6">
    <div class="header flex flex-col">
      <UButton @click="moreInfo = null" class="pb-6 flex justify-start items-center" icon="i-heroicons-arrow-left"
        size="md" color="primary" variant="link" :ui="{ base: 'w-8 h-5 text-gray-800' }" />
      <span class="title text-2xl font-semibold px-1">{{ placeDetails.displayName ?? placeDetails.name }}</span>
      <!-- TODO: FIX FORMAT FOR THIS PAGE -->
      <span class="subtitle font-normal text-xs text-gray-500 px-1">{{ formatSubtitle(placeDetails.distance,
        placeDetails.address) }}</span>
      <TypeTag :type="placeDetails.type" class="self-start mt-1 px-1" />
    </div>

    <div class="content flex flex-col gap-6 px-1">
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
    displayName?: string | null,
    phone?: string,
    link?: string,
    type?: string,
    distance?: string,
    address?: string
  }
}>();

const moreInfo = useMoreInfo();

</script>