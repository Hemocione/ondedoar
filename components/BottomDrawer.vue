<template>
  <!-- TODO: REMOVE RING FROM DRAWER UI -->
  <!-- TODO: THINK OF MOVING THE ELEMENTS INSIDE TEMPLATE CONTENT TO A SLOT -->
  <UDrawer v-model:open="open" :overlay="false" :activeSnapPoint="snapPoint" :dismissible="false" :modal="false"
    :snap-points="[snapPoints.collapsed, snapPoints.partial]" :ui="{ body: 'bg-white', content: 'bg-white' }"
    @update:activeSnapPoint="snapPoint = Number($event)">
    <template #content>
      <Transition name="fade" mode="out-in">
        <div v-if="snapPoint === snapPoints.collapsed" class="flex flex-col items-center p-4">
          <USkeleton v-if="loadingVisibleFeatures" class="h-6 w-[120px]" :ui="{ base: 'bg-red-500' }" />
          <div v-else class="text-hemo-color-text-secondary font-medium">
            {{ visibleFeaturesCount }} locais visíveis
          </div>
        </div>

        <div v-else>
          <div v-for="visibleFeature in visibleFeatures" :key="visibleFeature.name">
            <USkeleton v-if="loadingVisibleFeatures" class="h-6 w-[120px]" :ui="{ base: 'bg-red-500' }" />
            <ItemShortInfo :distance="'10km'" :address="visibleFeature.address" :type="visibleFeature.type" />
          </div>
        </div>
      </Transition>
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

const visibleFeatures = useVisibleFeatures();
const visibleFeaturesCount = computed(() => visibleFeatures ? visibleFeatures.value.length : undefined);
const loadingVisibleFeatures = useLoadingVisibleFeatures();

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
