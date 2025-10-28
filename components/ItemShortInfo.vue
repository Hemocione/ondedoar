<template>
  <div class="px-7 pt-2 pb-4">
    <div v-if="loading" class="space-y-2 animate-pulse">
      <USkeleton class="h-5 w-3/4" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-6 w-28 mt-1" />
    </div>
    <div v-else class="flex flex-col">
      <span class="title font-bold text-small">{{ title }}</span>
      <span class="subtitle font-normal text-xs text-gray-500">{{ formatSubtitle(distance, address) }}</span>
      <TypeTag :type="type" class="self-start mt-1" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string,
  distance?: string,
  address?: string,
  type?: string,
  loading?: boolean
}>();

function formatSubtitle(distance?: string, address?: string): string {
  if (!distance && !address) {
    return '';
  }

  if (!distance && address) {
    return address;
  }

  return `${distance} • ${address}`;
}
</script>
