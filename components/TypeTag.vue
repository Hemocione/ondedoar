<template>
  <div class="inline-flex justify-center items-center px-1 py-0.5 rounded-md text-[0.65rem] font-bold"
    :style="{ backgroundColor: backgroundColor, color: color }">
    {{ name }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string,
  type: string
}>()

const typeConfig: Record<string, { color: string, backgroundColor: string, name: string }> = {
  askforhelp: { color: '#784000', backgroundColor: '#78400030', name: 'Pedido de Ajuda' },
  bloodbank: { color: '#B03DD0', backgroundColor: '#B03DD030', name: 'Bancos de Sangue' },
  event: { color: '#B03DD0', backgroundColor: '#B03DD030', name: 'Evento' },
  hemocenter: { color: '#3D53D0', backgroundColor: '#3D53D030', name: 'Hemocentro' },
  hospital: { color: '#BB0A08', backgroundColor: '#BB0A0830', name: 'Hospital' }
}

const { color, backgroundColor, name } = typeConfig[props.type]
  || {
  color: '#000000',
  backgroundColor: '#CCCCCC30',
  name: 'Desconhecido'
}
// const backgroundColor = props.color + 30
</script>