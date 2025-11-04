<template>
  <div class="flex justify-center w-full">
    <div class="relative">
      <UInput v-model="place" variant="soft" size="md" type="text" placeholder="Buscar endereço..."
        icon="i-heroicons-magnifying-glass" :ui="{
          base: 'bg-hemo-color-text-primary text-hemo-color-text-secondary rounded-full shadow-lg/5 w-[80vw] text-lg focus:bg-hemo-color-text-primary focus:text-hemo-color-text-secondary hover:bg-hemo-color-text-primary',
          leadingIcon: 'w-5 h-5',
        }" @keydown.enter.prevent="searchAddress" @blur="isSuggestionsVisible = false">
        <!-- <template #trailing>
          <UButton
            variant="link"
            icon="i-heroicons-adjustments-horizontal"
            :ui="{
              base: 'text-hemo-color-text-secondary active:text-hemo-color-primary-light hover:text-hemo-color-primary-action',
            }"
            @click="searchAddress"
          />
        </template> -->
      </UInput>

      <div v-if="isSuggestionsVisible && suggestions.length"
        class="absolute z-10 w-[80vw] mt-1 bg-white rounded-md shadow-lg">
        <ul>
          <li v-for="suggestion in suggestions" :key="suggestion.place_id"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100" @mousedown.prevent="selectSuggestion(suggestion)">
            {{ formatNominatimAddress(suggestion.address) || suggestion.display_name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { NominatimResult } from '~/composables/geoCoding';

const place = ref('');
const mapCenter = useMapCenter();
const suggestions = ref<NominatimResult[]>([]);
const isSuggestionsVisible = ref(false);

let debounceTimer: NodeJS.Timeout;

watch(place, (newPlace) => {
  clearTimeout(debounceTimer);
  if (newPlace.length > 2) {
    debounceTimer = setTimeout(async () => {
      const fetchedSuggestions = await getGeocodingSuggestions(newPlace);
      const uniqueSuggestions = new Map();
      fetchedSuggestions.forEach(suggestion => {
        const formattedAddress = formatNominatimAddress(suggestion.address) || suggestion.display_name;
        if (!uniqueSuggestions.has(formattedAddress)) {
          uniqueSuggestions.set(formattedAddress, suggestion);
        }
      });
      suggestions.value = Array.from(uniqueSuggestions.values());
      isSuggestionsVisible.value = true;
    }, 500); // 500ms delay
  } else {
    suggestions.value = [];
    isSuggestionsVisible.value = false;
  }
});

async function searchAddress() {
  isSuggestionsVisible.value = false;
  try {
    const searchedCoordinates = await handleGeocoding(place.value);
    mapCenter.value = searchedCoordinates;
  } catch (error) {
    console.error(error);
    // TODO: Add user-facing error handling
  }
}

function selectSuggestion(suggestion: NominatimResult) {
  place.value = suggestion.display_name;
  searchAddress();
}
</script>