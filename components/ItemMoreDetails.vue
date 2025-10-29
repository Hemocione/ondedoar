<template>
  <div class="flex flex-col justify-center items-start">
    <div class="header flex flex-col">
      <span class="title text-2xl font-semibold">{{ name }}</span>
      <!-- TODO: FIX FORMAT FOR THIS PAGE -->
      <span class="subtitle font-normal text-xs text-gray-500">{{ formatSubtitle(distance, address) }}</span>
      <TypeTag :type="type" class="self-start mt-1" />
    </div>

    <div class="content ">
      <div class="address flex flex-row gap-3">
        <img class="w-4 h-4" src="/assets/vectors/RedMapPin.svg" alt="Marcador de mapa vermelho">
        <span class="text-sm font-normal">{{ address }}</span>
      </div>
      <div class="phone flex flex-row gap-3" v-if="phone">
        <img class="w-4 h-4" src="/assets/vectors/RedPhone.svg" alt="Telefone vermelho">
        <span class="text-sm font-normal">{{ phone }}</span>
      </div>
      <div class="link flex flex-row gap-3" v-if="link">
        <img class="w-4 h-4" src="/assets/vectors/RedLink.svg" alt="Globo vermelho com um cursor vermelho">
        <span class="text-sm font-normal">{{ link }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  active: boolean,
  name: string,
  phone?: string,
  link?: string,
  type?: string,
  distance?: string,
  address?: string
}>();

</script>