<template>
  <div
    class="enable-location-modal w-full flex flex-col justify-center z-[100] fixed inset-0 bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
    <div class="image-wrapper flex justify-center items-center m-5 mb-[100px]">
      <img src="/assets/vectors/HemocioneLogo.svg" alt="Logo Gota Hemocione" class="w-48 h-48">
    </div>
    <div class="content-wrapper">
      <div class="content-infos-wrapper w-full px-4 flex flex-col gap-3 mb-[100px]">
        <h2 class="text-center text-lg --hemo-color-text-primary font-semibold mb-2">
          Ative a sua localização
        </h2>

        <p class="text-center --color-el-color-text-secondary text-sm mb-6">
          Para encontrar os locais de doação mais próximos, precisamos da sua
          localização. Podemos acessar?
        </p>
      </div>
      <div class="buttons-wrapper w-full px-4 flex flex-col gap-3 flex flex-col items-center mt-5 mb-5">
        <UButton
:ui="{
          base: 'bg-hemo-color-primary text-hemo-color-text-primary hover:bg-hemo-color-primary-action active:bg-hemo-color-secondary active:text-hemo-color-primary-light',
        }" class="active-local-buttom w-full py-4 text-white hover:bg-red-700 flex justify-center items-center"
          @click="ativarLocalizacao()">
          Permitir
        </UButton>

        <UButton
class="not-now-buttom w-full flex justify-center items-center hover:bg-gray-100 rounded-md"
          color="neutral" @click="closeModal()">
          Agora não
        </UButton>
      </div>
    </div>
  </div>
</div></template>
<script lang="ts" setup>
import { useUserStore } from '~/store/users';

const userStore = useUserStore();
const emit = defineEmits(['close']);

function ativarLocalizacao() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      console.log('Coordinates:', pos.coords.latitude, pos.coords.longitude);
      userStore.setPermissionUserLocation('granted');
      console.log('User permission:', userStore.permitUserLocation);
    },
    (error) => {
      console.error('Geolocation error:', error);
      if (error.message === "User denied Geolocation") {
        userStore.setPermissionUserLocation('denied');
        console.log('User permission:', userStore.permitUserLocation);
      }
    }
  );
  console.log('User permission:', userStore.permitUserLocation);
  emit('close', true);
}

function closeModal() {
  userStore.setPermissionUserLocation("denied");;
  emit('close', true);
}
</script>