<template>
  <UDrawer v-model:open="open" :overlay="false" :activeSnapPoint="snapPoint"
    :snap-points="[snapPoints.collapsed, snapPoints.partial, snapPoints.full]">
    <template #content>
      <div v-show="snapPoint === snapPoints.collapsed">
        <UButton label="Para partial" class="h-10 m-4" @click="snapPoint = snapPoints.partial" />

      </div>

      <div v-show="snapPoint !== snapPoints.collapsed">
        <UButton label="Para full" class="h-48 m-4" @click="snapPoint = snapPoints.full" />
        <UButton label="Para collapsed" v-if="snapPoint === snapPoints.full" class="h-96 m-4"
          @click="snapPoint = snapPoints.collapsed" />
      </div>
    </template>

  </UDrawer>
</template>

<script setup lang="ts">
const open = ref(true)
const snapPoints = {
  collapsed: 0.15,
  partial: 0.4,
  full: 0.8,
}
const snapPoint = ref(snapPoints.collapsed)
</script>