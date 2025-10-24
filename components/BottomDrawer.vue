<template>
  <div :style="drawerStyle"
    class="fixed inset-x-0 bottom-0 z-20 flex flex-col transition-transform duration-300 ease-out">
    <div @click="toggleState" class="flex-shrink-0 cursor-pointer rounded-t-lg bg-white p-4 shadow-lg">
      <div class="mx-auto h-1.5 w-12 rounded-full bg-gray-300"></div>
    </div>

    <div class="flex-grow overflow-auto bg-white" :class="{
      'invisible': drawerState === 'collapsed',
      'visible': drawerState !== 'collapsed'
    }">
      <div class="p-4">
        <h2 class="text-lg font-bold">Conteúdo da Drawer</h2>
        <p>Aqui vai o conteúdo, como a lista de acomodações ou filtros.</p>
        <p class="mt-4">Estado atual: {{ drawerState }}</p>

        <div class="mt-4 flex space-x-2">
          <UButton @click.stop="drawerState = 'collapsed'" label="Recolher" />
          <UButton @click.stop="drawerState = 'partial'" label="Parcial" />
          <UButton @click.stop="drawerState = 'full'" label="Expandir" />
        </div>

        <div class="mt-4 h-96 space-y-2">
          <div v-for="i in 20" :key="i" class="h-10 rounded bg-gray-100 p-2">Item {{ i }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Nossos três estados
type DrawerState = 'collapsed' | 'partial' | 'full'
const drawerState = ref<DrawerState>('partial')

// Define a altura visível para cada estado
// Você pode ajustar esses valores (vh = viewport height)
const heights = {
  // 'calc(100vh - 80px)' significa que 80px da drawer ficarão visíveis
  collapsed: 'calc(100vh - 80px)',
  // '50vh' significa que a drawer começará na metade da tela
  partial: '50vh',
  // '100px' significa que a drawer começará a 100px do topo da tela
  full: '100px'
}

// Computa o estilo de 'transform' baseado no estado
const drawerStyle = computed(() => ({
  // 'translateY' move o elemento para baixo.
  // 'heights[drawerState.value]' diz *quanto* mover para baixo (a partir do topo).
  transform: `translateY(${heights[drawerState.value]})`
}))

// Uma função simples para alternar os estados ao clicar no puxador
const toggleState = () => {
  if (drawerState.value === 'partial') {
    drawerState.value = 'full'
  } else if (drawerState.value === 'full') {
    drawerState.value = 'collapsed'
  } else {
    drawerState.value = 'partial'
  }
}
</script>

<style scoped>
/* Garante que a drawer não ultrapasse a tela quando expandida */
div[style] {
  max-height: 100vh;
}
</style>