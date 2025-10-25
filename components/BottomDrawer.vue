<template>
  <!-- TODO: REMOVE RING FROM DRAWER UI -->
  <UDrawer v-model:open="open" :overlay="false" :activeSnapPoint="snapPoint" :dismissible="false" :modal="false"
    :snap-points="[snapPoints.collapsed, snapPoints.partial]" :ui="{ body: 'bg-white', content: 'bg-white' }">
    <template #content>
      <div v-show="snapPoint === snapPoints.collapsed">
        <UButton label="Para partial" class="h-10 m-4" @click="snapPoint = snapPoints.partial" />

      </div>

      <div v-show="snapPoint !== snapPoints.collapsed">
        <UButton label="Para collapsed" class="h-96 m-4" @click="snapPoint = snapPoints.collapsed" />
      </div>
    </template>

  </UDrawer>
</template>

<script setup lang="ts">
// TODO: Think of full state, if it's needed. In case it is: move header to upfront in template, changing z-index.

const open = ref(true)
const snapPoints = {
  collapsed: 0.15,
  partial: 0.4,
}
const snapPoint = ref(snapPoints.collapsed)
</script>