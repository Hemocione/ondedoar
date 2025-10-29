<template>
  <div>
    <HemocioneHeader />
    <transition name="fade-zoom">
      <HemocioneEnableLocation v-if="isShow" />
    </transition>
    <PlaceSearchInput class="pt-8" />
    <BottomDrawer />
  </div>
</template>
<script setup lang="ts">

const locationPermission = useLocationPermission();
const isShow = computed(() => locationPermission.value === 'prompt');

async function verifyLocalion() {
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    locationPermission.value = result.state;
    result.onchange = () => {
      locationPermission.value = result.state;
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await verifyLocalion()
})

</script>

<style lang="scss">
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
