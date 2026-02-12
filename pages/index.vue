<template>
  <div>
    <HemocioneHeader v-if="!isIframe" />
    <transition name="fade-zoo">
      <HemocioneEnableLocation v-if="isShow && !isIframe" @close="isShow = false" />
    </transition>
    <PlaceSearchInput class="pt-8" />
    <BottomDrawer />
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/store/users';
import { useUserLocation } from '~/composables/useUserLocation';

const route = useRoute();
const userStore = useUserStore();
const { checkPermissionAndStart } = useUserLocation();

const isShow = ref(false);
// TODO: MOVE THIS TO A PLUGIN LIKE CAN DONATE
const isIframe = ref(route.query.iframed === "true")

onMounted(async () => {
  await checkPermissionAndStart();
  
  // Se a permissão for 'prompt' (padrão inicial), mostra o modal customizado.
  // O modal customizado chama startTracking() que por sua vez chama getCurrentPosition() e pede a permissão nativa.
  if (userStore.permitUserLocation === 'prompt') {
    isShow.value = true;
  } else if (userStore.permitUserLocation === 'denied') {
    // Opcional: Mostrar uma mensagem diferente ou tentar novamente se o usuário clicar em algo
    // isShow.value = true; 
  } else {
    isShow.value = false;
  }

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
