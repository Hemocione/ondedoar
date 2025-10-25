<template>
  <div ref="drawer" :style="drawerStyle" class="fixed inset-x-0 bottom-0 z-20 flex flex-col"
    :class="{ 'transition-transform duration-300 ease-out': !isDragging }">
    <div @mousedown="startDrag" @touchstart="startDrag"
      @click="drawerState = drawerState === 'full' ? 'partial' : 'full'"
      class="flex-shrink-0 cursor-pointer bg-white p-4 shadow-lg  rounded-t-[32px]">
      <div class="mx-auto h-1.5 w-12 rounded-full bg-gray-300"></div>
    </div>

    <div class="flex-grow overflow-auto bg-white" :class="{
      'invisible': drawerState === 'collapsed',
      'visible': drawerState !== 'collapsed'
    }">
      <div class="px-7 py-2">
        <ItemShortInfo v-for="i in 20" :key="i" class="pb-3" distance="10" address="Rua Itua 222, apt 204"
          :type="'bloodbank'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

type DrawerState = 'collapsed' | 'partial' | 'full'

const drawerState = ref<DrawerState>('partial')
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const drawer = ref<HTMLElement | null>(null)

// Define a altura em pixels para cada estado
const heights = ref({
  full: 100,
  partial: 0, // Será definido no onMounted
  collapsed: 0, // Será definido no onMounted
})

onMounted(() => {
  heights.value.partial = window.innerHeight * 0.58
  heights.value.collapsed = window.innerHeight * 0.58
  // Inicializa currentY com o valor correto
  snapTo(drawerState.value)
})

const snapTo = (state: DrawerState) => {
  drawerState.value = state
  if (heights.value[state]) {
    currentY.value = heights.value[state]
  }
}

const drawerStyle = computed(() => {
  const translateY = isDragging.value ? currentY.value : heights.value[drawerState.value];
  // Garante que o valor não seja 0 para evitar problemas no SSR inicial
  return {
    transform: `translateY(${translateY || 0}px)`,
  }
})

const startDrag = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true
  const touch = event.type === 'touchstart' ? (event as TouchEvent).touches[0] : null
  startY.value = touch ? touch.clientY : (event as MouseEvent).clientY
  currentY.value = heights.value[drawerState.value]

  // Adiciona os listeners no window para capturar o movimento em qualquer lugar da tela
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', endDrag)
}

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  const touch = event.type === 'touchmove' ? (event as TouchEvent).touches[0] : null
  const clientY = touch ? touch.clientY : (event as MouseEvent).clientY
  const deltaY = clientY - startY.value
  const newY = heights.value[drawerState.value] + deltaY

  // Impede que o drawer seja arrastado para mais cima que o 'full' ou mais baixo que o 'collapsed'
  currentY.value = Math.max(heights.value.full, Math.min(newY, heights.value.collapsed))
}

const endDrag = () => {
  if (!isDragging.value) return

  isDragging.value = false

  // Remove os listeners do window
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', endDrag)

  // Lógica para determinar o estado mais próximo (snap)
  const closestState = (Object.keys(heights.value) as DrawerState[]).reduce((prev, curr) => {
    return Math.abs(heights.value[curr] - currentY.value) < Math.abs(heights.value[prev] - currentY.value)
      ? curr
      : prev
  })

  snapTo(closestState)
}

// Limpa os event listeners quando o componente é desmontado
onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', endDrag)
})
</script>

<style scoped>
/* Garante que a drawer não ultrapasse a tela quando expandida */
.fixed {
  max-height: 100vh;
}
</style>
