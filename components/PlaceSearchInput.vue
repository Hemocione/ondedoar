<template>
  <div class="flex bg-transparent justify-center w-full">
    <UInput v-model="place" variant="soft" size="md" type="text" placeholder="Buscar endereço... "
      icon="i-heroicons-magnifying-glass"
      :ui="{ base: 'bg-hemo-color-text-primary text-hemo-color-text-secondary rounded-full shadow-lg/5 w-[80vw] text-lg focus:bg-hemo-color-text-primary focus:text-hemo-color-text-secondary', leadingIcon: 'w-5 h-5', }" />
  </div>
</template>

<script lang="ts" setup>
const place = ref('')
</script>