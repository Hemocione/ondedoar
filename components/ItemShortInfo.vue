<template>
  <div class="flex flex-col p-7">
    <span class="title font-bold text-small">Teste</span>
    <span class="subtitle font-normal text-xs text-gray-500">{{ formatSubtitle(distance, address) }}</span>
    <TypeTag :type="type" class="self-start" />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  distance: string,
  address: string,
  type: string
}>()

function formatSubtitle(distance: string, address: string): string {
  return `${distance} • ${address}`;
}
</script>