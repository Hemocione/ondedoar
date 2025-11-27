<template>
  <UDrawer v-model:open="shouldOpen" :overlay="false" :activeSnapPoint="snapPoint" :dismissible="false" :modal="false"
    :snap-points="visibleFeaturesCount != 0 ? activeSnapPoints : [snapPoints.collapsed]"
    :ui="{ body: 'bg-white', content: 'bg-white rounded-t-4xl ring-0 flex flex-col', container: 'h-full' }"
    @update:activeSnapPoint="onUpadteSnapPoint">
    <template #content>
      <Transition name="fade" mode="out-in">
        <div v-if="snapPoint === snapPoints.collapsed" class="flex flex-col items-center p-4">
          <USkeleton v-if="loadingVisibleFeatures" class="h-6 w-[120px]" :ui="{ base: 'bg-red-500' }" />
          <!-- TODO: FIX TOTAL VISIBLE PLACES WHEN ZOOM OUT MAX -->
          <div v-else class="text-hemo-color-text-secondary font-medium">
            {{ visibleFeaturesCount }} locais visíveis
          </div>
        </div>

        <!-- TODO: MUST FIX SCROLL. THE LAST 5 ITEMS ARE NEVER SCROLLABLE -->
        <div v-else-if="snapPoint === snapPoints.partial" class="my-4 overflow-auto">
          <!-- TODO: MAKE ITEMSHORTINFO CLICKABLE. IT MUST OPEN A MODAL OR A DRAWER WITH THE INFO MISSING -->
          <ItemShortInfo v-for="item in displayItems" :key="item.key" :loading="item.loading"
            :title="item.displayName ?? item.name" :address="item.address" :type="item.type"
            @click="showMoreInfo(item)" />
          <!-- BE MY GUEST TRYING TO FIX SCROLL WITHOUT THIS WORKAROUND -->
          <div class="p-2.5">
            <ItemShortInfo v-for="i in 6" :key="'fake-' + i" :loading="false" title="&nbsp;" address="&nbsp;"
              type="bloodbank" style="visibility: hidden" />
          </div>
        </div>

        <div v-else-if="snapPoint === snapPoints.full">
          <ItemMoreDetails v-if="moreInfo" class="p-7" :place-details="moreInfo" />
        </div>
      </Transition>
    </template>

  </UDrawer>
</template>

<script setup lang="ts">
import type { PlaceDetails } from '~/composables/states';
import { useMapStore } from '~/store/map';
import { useUserStore } from '~/store/users';
// TODO: Think of full state, if it's needed. In case it is: move header to upfront in template, changing z-index.

const userStore = useUserStore();
const { permitUserLocation } = storeToRefs(userStore)
const moreInfo = useMoreInfo();
const shouldOpen = computed(() => permitUserLocation.value !== 'prompt');
const mapStore = useMapStore();
const { getVisibleFeatures: visibleFeatures, isLoadingVisibleFeatures: loadingVisibleFeatures } = storeToRefs(mapStore);
const visibleFeaturesCount = computed(() => visibleFeatures.value ? visibleFeatures.value.length : undefined);
const shouldShowMoreInfo = computed(() => moreInfo.value !== null)

const snapPoints = {
  collapsed: 0.15,
  partial: 0.4,
  full: 0.6
}

const activeSnapPoints = computed(() => {
  return shouldShowMoreInfo.value ? [snapPoints.collapsed, snapPoints.partial, snapPoints.full]
    : [snapPoints.collapsed, snapPoints.partial];
})

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

watch(moreInfo, (newMoreInfo) => {
  if (newMoreInfo === null && snapPoint.value === snapPoints.full) {
    snapPoint.value = snapPoints.partial;
  }
});

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

function showMoreInfo(item: PlaceDetails) {
  moreInfo.value = item;
  snapPoint.value = snapPoints.full;
}

function onUpadteSnapPoint(newSnapPoint: number) {
  if (newSnapPoint !== snapPoints.full) {
    moreInfo.value = null;
  }
  snapPoint.value = Number(newSnapPoint);
}

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