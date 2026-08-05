<template>
  <div
    class="absolute inset-0 bg-hemo-color-text-primary flex flex-col items-center justify-center gap-4 p-8 text-center"
  >
    <template v-if="showDeniedState">
      <p class="text-hemo-color-text-secondary font-medium">
        Precisamos da sua localização pra mostrar os locais de doação mais
        próximos.
      </p>
      <UButton
        :loading="retrying"
        :ui="{
          base: 'bg-hemo-color-primary text-hemo-color-text-primary hover:bg-hemo-color-primary-action',
        }"
        @click="retry"
      >
        Tentar novamente
      </UButton>
    </template>
  </div>
</template>

<script setup>
import { useMapStore } from "~/store/map";
import { useUserStore } from "~/store/users";

const mapStore = useMapStore();
const userStore = useUserStore();
const { userLocation, permitUserLocation } = storeToRefs(userStore);
const { mapCenter } = storeToRefs(mapStore);

// Mesma regra do MapLibre.client.vue: uma busca de endereço explícita ganha
// da geolocalização automática como origem da ordenação.
const initialCenter = [...mapCenter.value];

const retrying = ref(false);
const showDeniedState = computed(
  () => permitUserLocation.value === "denied" && !userLocation.value,
);

function currentOrigin() {
  const hasPendingSearch =
    mapCenter.value[0] !== initialCenter[0] ||
    mapCenter.value[1] !== initialCenter[1];
  return hasPendingSearch ? mapCenter.value : userLocation.value;
}

function refresh() {
  const origin = currentOrigin();
  if (!origin) return;

  const sorted = sortPointsByDistance(mapStore.pinMarkersFeatures, origin, 30);
  const withLabel = sorted.map((point) => ({
    ...point,
    distance: formatDistance(point.distanceMeters),
  }));
  mapStore.updateVisibleFeatures(withLabel);
  mapStore.setLoadingVisibleFeatures(false);
}

// Se a permissao ja estava concedida de uma sessao anterior, o navegador
// nunca chama HemocioneEnableLocation.ativarLocalizacao() (o modal nem
// aparece) -- e sem o botao de geolocalizacao do MapLibre (que nao existe
// nesse modo), nada mais busca a coordenada. Buscamos aqui tambem.
onMounted(() => {
  if (permitUserLocation.value === "granted" && !userLocation.value) {
    fetchUserLocation()
      .then((coords) => userStore.setUserLocation(coords))
      .catch((err) => console.error("Geolocation error:", err));
  }
});

watch(userLocation, refresh, { immediate: true });
watch(mapCenter, refresh);

async function retry() {
  retrying.value = true;
  try {
    const coords = await fetchUserLocation();
    userStore.setUserLocation(coords);
    userStore.setPermissionUserLocation("granted");
  } catch (err) {
    console.error("Geolocation error:", err);
    userStore.setPermissionUserLocation("denied");
  } finally {
    retrying.value = false;
  }
}
</script>
