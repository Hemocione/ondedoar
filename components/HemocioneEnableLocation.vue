<template>
  <div
    style="background-color: white"
    class="enable-location-modal h-screen w-full flex flex-col justify-center"
  >
    <div class="image-wrapper flex justify-center items-center">
      <div class="w-24 h-24 bg-gray-200 rounded-lg shadow-sm" />
    </div>
    <div class="content-wrapper">
      <div class="content-infos-wrapper w-full px-4 flex flex-col gap-3">
        <h2
          class="text-center text-lg --hemo-color-text-primary font-semibold mb-2"
        >
          Ative a sua localização
        </h2>

        <p class="text-center --color-el-color-text-secondary text-sm mb-6">
          Para encontrar os locais de doação mais próximos, precisamos da sua
          localização. Podemos acessar?
        </p>
      </div>
      <div class="buttons-wrapper w-full px-4 flex flex-col gap-3">
        <UButton
          :ui="{
            base: 'bg-hemo-color-primary text-hemo-color-text-primary hover:bg-hemo-color-primary-action active:bg-hemo-color-secondary active:text-hemo-color-primary-light',
          }"
          class="active-local-buttom w-full py-4 text-white hover:bg-red-700 flex justify-center items-center"
          @click="ativarLocalizacao()"
        >
          Permitir
        </UButton>

        <UButton
          trailing-icon="i-heroicons-arrow-right"
          class="not-now-buttom w-full flex justify-center items-center"
          color="neutral"
          @click="closeModal()"
        >
          Agora não
        </UButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const coordenate = ref<{ lat: number; lng: number } | null>(null);
const emit = defineEmits(["close"]);

function ativarLocalizacao() {
  navigator.geolocation.getCurrentPosition((pos) => {
    coordenate.value = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };
  });
  closeModal();
}

function closeModal() {
  emit("close");
}
</script>

<style scoped lang="scss">
.enable-location-modal {
}
.header-wrapper {
  background-color: white;
  border-bottom: 1.5px solid #eee;
}
.image-wrapper {
  margin: 20px 20px 100px 20px;
}
.buttons-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.content-infos-wrapper {
  margin-bottom: 100px;
}
.not-now-buttom:hover {
  background-color: #f3f4f6;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}
</style>
