<template>
  <div>
    <HemocioneHeader v-if="!isIframe" />
    <transition name="fade-zoo">
      <HemocioneEnableLocation v-if="isShow" @close="isShow = false" />
    </transition>
    <PlaceSearchInput class="pt-8" />
    <BottomDrawer />
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/store/users';

const route = useRoute();
const userStore = useUserStore();

const isShow = ref(false);
// TODO: MOVE THIS TO A PLUGIN LIKE CAN DONATE
const isIframe = ref(route.query.iframed === "true")

async function verifyLocation() {
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    if (result.state === 'denied' || result.state === 'prompt') {
      isShow.value = true;
    }
    if (result.state === 'granted') {
      isShow.value = false;
    }
    userStore.setPermissionUserLocation(result.state);
    result.onchange = () => {
      userStore.setPermissionUserLocation(result.state);
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await verifyLocation()
  try {
    isIframe.value = window.self !== window.top;
  } catch (e) {
    isIframe.value = true;
  }
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
