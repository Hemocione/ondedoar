<template>
  <div class="enable-location-modal w-full flex flex-col justify-center z-[100] fixed inset-0 bg-white">
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
        <UButton :ui="{
          base: 'bg-hemo-color-primary text-hemo-color-text-primary hover:bg-hemo-color-primary-action active:bg-hemo-color-secondary active:text-hemo-color-primary-light',
        }" class="active-local-buttom w-full py-4 text-white hover:bg-red-700 flex justify-center items-center"
          @click="ativarLocalizacao()">
          Permitir
        </UButton>

        <UButton class="not-now-buttom w-full flex justify-center items-center hover:bg-gray-100 rounded-md"
          color="neutral" @click="closeModal()">
          Agora não
        </UButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '~/store/users';

const userStore = useUserStore();
const emit = defineEmits(['close']);

function ativarLocalizacao() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // Verify the actual permission state after getting position
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        userStore.setPermissionUserLocation(result.state);
      });
    },
    (error) => {
      console.error('Geolocation error:', error);
      // Check actual permission state on error
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        userStore.setPermissionUserLocation(result.state);
      });
    }
  );
  emit('close', true);
}

function closeModal() {
  userStore.setPermissionUserLocation("denied");;
  emit('close', true);
}
</script>