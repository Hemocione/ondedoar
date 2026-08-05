<template>
  <div class="flex flex-col justify-center items-start gap-6">
    <div v-if="loadingVisibleFeatures" class="w-full space-y-2 animate-pulse">
      <USkeleton class="h-10 w-3/4" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-6 w-28 mt-1" />
      <USkeleton class="h-5 w-full" />
    </div>
    <div v-else>
      <div class="header flex flex-col">
        <UButton
          class="pb-6 flex justify-start items-center"
          icon="i-heroicons-arrow-left"
          size="md"
          color="primary"
          variant="link"
          :ui="{ base: 'w-8 h-5 text-gray-800' }"
          @click="moreInfo = null"
        />
        <span class="title text-2xl font-semibold px-1">{{
          placeDetails.displayName ?? placeDetails.name
        }}</span>
        <!-- TODO: FIX FORMAT FOR THIS PAGE -->
        <span class="subtitle font-normal text-xs text-gray-500 px-1">{{
          formatSubtitle(placeDetails.distance, placeDetails.address)
        }}</span>
        <TypeTag :type="placeDetails.type" class="self-start mt-1 px-1" />
      </div>

      <div class="content flex flex-col gap-6 px-1">
        <div class="address flex flex-row gap-3">
          <img
            class="w-4 h-4"
            src="/assets/vectors/RedMapPin.svg"
            alt="Marcador de mapa vermelho"
          />
          <span class="text-sm font-normal">{{ placeDetails.address }}</span>
        </div>
        <div v-if="placeDetails.phone" class="phone flex flex-row gap-3">
          <img
            class="w-4 h-4"
            src="/assets/vectors/RedPhone.svg"
            alt="Telefone vermelho"
          />
          <span class="text-sm font-normal">{{ placeDetails.phone }}</span>
        </div>
        <div v-if="placeDetails.link" class="link flex flex-row gap-3">
          <img
            class="w-4 h-4"
            src="/assets/vectors/RedLink.svg"
            alt="Globo vermelho com um cursor vermelho"
          />
          <a
            :href="placeDetails.link"
            target="_blank"
            class="text-sm font-bold underline"
            >Ir para o site</a
          >
        </div>
      </div>

      <div class="route flex flex-row mt-2 w-full">
        <UButton :loading="loadingRoute" @click="handleComoChegar" block color="neutral" variant="solid" :ui="{
          base: 'bg-hemo-color-primary text-white hover:bg-hemo-color-primary-action active:bg-hemo-color-secondary active:text-hemo-color-primary-light disabled:bg-hemo-color-primary/80',
        }" class="w-full flex justify-center py-3 text-white">
          <span v-if="!loadingRoute">Como chegar</span>
        </UButton>
      </div>
      <p v-if="routeError" class="text-red-500 text-xs text-center mt-1">{{ routeError }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useInfoStore } from "~/store/info";
import { useMapStore } from "~/store/map";
import { useUserStore } from "~/store/users";

const props = defineProps<{
  placeDetails: {
    active: boolean;
    name: string;
    displayName?: string | null;
    phone?: string;
    link?: string;
    type?: string;
    distance?: string;
    address?: string;
    // O MapLibre serializa as properties da feature, então as coordenadas
    // chegam como string quando o item vem da lista de pontos visíveis.
    coordinates?: [number, number] | string;
  };
}>();

const infoStore = useInfoStore();
const { isLoadingVisibleFeatures: loadingVisibleFeatures } =
  storeToRefs(infoStore);

const moreInfo = useMoreInfo();
function settingloadingValue() {
  infoStore.setloadingVisibleFeatures(true);
  setTimeout(() => {
    infoStore.setloadingVisibleFeatures(false);
  }, 1500);
}
const userStore = useUserStore();
const mapStore = useMapStore();
const { fetchRoute, loadingRoute, routeError } = useRouting();

const handleComoChegar = async () => {
  // If user has not granted location permission, prompt them
  if (userStore.permitUserLocation === 'denied') {
    userStore.setPermissionUserLocation('prompt');
    return;
  }

  if (userStore.permitUserLocation === 'granted') {
    drawRouteToPlace();
  } else {
    // If it's prompt or unsupported, let's ask for permission and draw
    userStore.setPermissionUserLocation('prompt');
    // In HemocioneEnableLocation, when they grant permission, it'll set status to granted.
    // We would need to either watch it or assume they'll click again. Since HemocioneEnableLocation closes itself,
    // they can click again.
  }
};

const drawRouteToPlace = async () => {
  let destCoords = props.placeDetails.coordinates;
  if (typeof destCoords === 'string') {
    try {
      destCoords = JSON.parse(destCoords);
    } catch {
      // Segue com o valor cru: a validação abaixo vira mensagem de erro na tela.
    }
  }

  if (!destCoords || !Array.isArray(destCoords)) {
    routeError.value = "Coordenadas do destino não encontradas. Tente novamente.";
    return;
  }

  // Sem mapa nao ha onde desenhar a rota: manda pro Google Maps abrir a
  // navegacao de verdade em vez de tentar buscar/exibir a linha da rota.
  if (mapStore.webglSupported === false) {
    const [lng, lat] = destCoords;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
    return;
  }

  if (!navigator.geolocation && !userStore.userLocation) {
    routeError.value = "Geolocalização não é suportada pelo seu navegador.";
    return;
  }

  // Use MapLibre tracked high-accuracy location if available
  if (userStore.userLocation) {
    await fetchRoute(userStore.userLocation, destCoords as [number, number]);
    return;
  }

  // Fallback to one-shot geolocation with high accuracy, bypassing cache
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const userCoords: [number, number] = [pos.coords.longitude, pos.coords.latitude];

      await fetchRoute(userCoords, destCoords as [number, number]);
    },
    (err) => {
      console.error(err);
      routeError.value = "Não foi possível obter a sua localização exata.";
      userStore.setPermissionUserLocation('prompt');
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
};

// Also optionally clean the route when more info is closed
watch(moreInfo, (newVal) => {
  if (!newVal) {
    mapStore.setCurrentRoute(null);
  }
});

onMounted(() => {
  settingloadingValue();
});
</script>
