<template>
  <div class="flex items-center w-screen h-[55px] bg-black px-4">
    <div class="flex-grow">
      <img class="w-[130px]" src="/assets/vectors/HemocioneWhite.svg"
        alt="Logo da Hemocione em branco e Hemocione escrito em branco">
    </div>
    <UButton trailing-icon="i-heroicons-arrow-left-start-on-rectangle" size="md"
      :ui="{ base: 'bg-hemo-color-primary text-hemo-color-text-primary' }">Sair
    </UButton>
  </div>
</template>

<script lang="ts" setup></script>