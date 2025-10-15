<template>
  <div>
    <HemocioneHeader />
    <transition name="fade-zoom">
      <HemocioneEnableLocation v-if="isShow" @close="isShow = false"/> 
    </transition>
    <PlaceSearchInput class="pt-8" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const isShow = ref(false)

async function verifyLocalization() {
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    if(result.state === 'granted'){
      isShow.value = false
    } else {
      isShow.value = true;
    }
  } catch(err) {
    console.log(err)
  }
}

onMounted(async () => {
  await verifyLocalization()
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
}</style>
