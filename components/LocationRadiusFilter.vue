<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <UButton
      :loading="loading"
      :ui="{
        base: active
          ? 'bg-hemo-color-primary text-hemo-color-text-primary hover:bg-hemo-color-primary-action'
          : 'bg-hemo-color-text-primary text-hemo-color-text-secondary hover:bg-hemo-color-text-primary shadow-lg/5',
      }"
      icon="i-heroicons-map-pin"
      @click="toggle"
    >
      {{ active ? `Raio de ${radiusKm} km` : "Perto de mim" }}
    </UButton>

    <div v-if="active" class="flex flex-row gap-2">
      <UButton
        v-for="option in radiusOptions"
        :key="option"
        size="xs"
        :ui="{
          base:
            option === radiusKm
              ? 'bg-hemo-color-primary text-hemo-color-text-primary'
              : 'bg-hemo-color-text-primary text-hemo-color-text-secondary',
        }"
        @click="selectRadius(option)"
      >
        {{ option }} km
      </UButton>
    </div>

    <p v-if="error" class="text-sm text-red-600 bg-white rounded-md px-3 py-1 shadow-lg/5">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from "~/store/map";
import { useUserStore } from "~/store/users";

const mapStore = useMapStore();
const userStore = useUserStore();
const { userLocation } = storeToRefs(userStore);

const radiusOptions = [5, 10, 20, 50];
const radiusKm = ref(10);
const active = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

async function toggle() {
  if (active.value) {
    active.value = false;
    mapStore.clearLocationFilter();
    return;
  }

  error.value = null;
  loading.value = true;
  try {
    const origin = userLocation.value ?? (await fetchUserLocation());
    userStore.setUserLocation(origin);
    mapStore.setLocationFilter(origin, radiusKm.value);
    mapStore.setMapCenter(origin);
    active.value = true;
  } catch (err) {
    console.error("Geolocation error:", err);
    error.value =
      "Não conseguimos acessar sua localização. Verifique a permissão do navegador.";
  } finally {
    loading.value = false;
  }
}

function selectRadius(km: number) {
  radiusKm.value = km;
  if (active.value && userLocation.value) {
    mapStore.setLocationFilter(userLocation.value, km);
  }
}
</script>
