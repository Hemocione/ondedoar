<template>
  <UDrawer v-model:open="open" :overlay="false" :activeSnapPoint="snapPoint" :snap-points="[0.1, 0.4, 0.8]">
    <template #content>
      <UButton label="Para partial" v-if="snapPoint === 0.1" class="h-10 m-4" @click="snapPoint = 0.4" />
      <UButton label="Para full" v-if="snapPoint === 0.4" class="h-48 m-4" @click="snapPoint = 0.8" />
      <UButton label="Para collapsed" v-if="snapPoint === 0.8" class="h-96 m-4" @click="snapPoint = 0.1" />
    </template>

  </UDrawer>
</template>

<script setup lang="ts">
const open = ref(true)
const snapPoints = {
  collapsed: 0.1,
  partial: 0.4,
  full: 0.8,
}
const snapPoint = ref(snapPoints.collapsed)
</script>