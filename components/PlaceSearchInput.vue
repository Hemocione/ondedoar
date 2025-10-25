<template>
  <!-- TODO: CHANGE IT SO WE SEARCH FOR ADDRESSES AND NOT HEMOTHINKS -->
  <div class="flex justify-center w-full">
    <UInput v-model="place" variant="soft" size="md" type="text" placeholder="Buscar endereço... "
      icon="i-heroicons-magnifying-glass"
      :ui="{ base: 'bg-hemo-color-text-primary text-hemo-color-text-secondary rounded-full shadow-lg/5 w-[80vw] text-lg focus:bg-hemo-color-text-primary focus:text-hemo-color-text-secondary hover:bg-hemo-color-text-primary', leadingIcon: 'w-5 h-5', }">
      <template #trailing>
        <UButton variant="link" icon="i-heroicons-adjustments-horizontal"
          :ui="{ base: 'text-hemo-color-text-secondary active:text-hemo-color-primary-light hover:text-hemo-color-primary-action' }"
          @click="applyFilter" />
      </template>
    </UInput>
  </div>
</template>

<script lang="ts" setup>
const place = ref('')
// TODO: UPDATE FILTER SCHEMA
const filter = ref('')

const test = ref(false)

async function applyFilter() {
  console.log('applyFilter');
  test.value = !test.value
}
</script>