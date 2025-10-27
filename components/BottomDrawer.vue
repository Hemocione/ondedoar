<template>
  <UDrawer v-model:open="open" :overlay="false" :activeSnapPoint="snapPoint" :dismissible="false" :modal="false"
    :snap-points="[snapPoints.collapsed, snapPoints.partial]"
    :ui="{ body: 'bg-white', content: 'bg-white rounded-t-4xl ring-0' }"
    @update:activeSnapPoint="snapPoint = Number($event)">
    <template #content>
      <Transition name="fade" mode="out-in">
        <div v-if="snapPoint === snapPoints.collapsed" class="flex flex-col items-center p-4">
          <USkeleton v-if="loadingVisibleFeatures" class="h-6 w-[120px]" :ui="{ base: 'bg-red-500' }" />
          <div v-else class="text-hemo-color-text-secondary font-medium">
            {{ visibleFeaturesCount }} locais visíveis
          </div>
        </div>

        <!-- TODO: MUST FIX SCROLL. THE LAST 5 ITEMS ARE NEVER SCROLLABLE -->
        <div v-else class="my-4 overflow-auto">
          <ItemShortInfo v-for="item in displayItems" :key="item.key" :loading="item.loading" :title="item.name"
            :address="item.address" :type="item.type" />
        </div>
      </Transition>
    </template>

  </UDrawer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

// TODO: Think of full state, if it's needed. In case it is: move header to upfront in template, changing z-index.

const open = ref(true)
const snapPoints = {
  collapsed: 0.15,
  partial: 0.4,
}
const snapPoint = ref(snapPoints.collapsed)
const isTransitioning = ref(false);

watch(snapPoint, (newSnapPoint) => {
  if (newSnapPoint === snapPoints.partial) {
    isTransitioning.value = true;
    setTimeout(() => {
      isTransitioning.value = false;
    }, 1500); // 0.5 second
  }
});

const visibleFeatures = useVisibleFeatures();
const visibleFeaturesCount = computed(() => visibleFeatures ? visibleFeatures.value.length : undefined);
const loadingVisibleFeatures = useLoadingVisibleFeatures();

const displayItems = computed(() => {
  // If transitioning or loading data, show skeletons
  if (isTransitioning.value || loadingVisibleFeatures.value) {
    const count = visibleFeaturesCount.value || 3; // Use real count or 3 as a fallback
    return Array.from({ length: count }, (_, i) => ({
      key: `skeleton-${i}`,
      loading: true
    }));
  }

  // Otherwise, show real data
  return visibleFeatures.value.map(feature => ({
    ...feature,
    key: feature.name,
    loading: false,
  }));
});

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
