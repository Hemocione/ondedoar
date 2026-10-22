<template>
  <button
    v-if="available"
    type="button"
    class="hemarcio-ask-button"
    @click="ask(intent, context)"
  >
    <img
      class="hemarcio-ask-face"
      src="/hemarcio-face.svg"
      alt=""
      width="24"
      height="24"
    />
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  intent: string;
  context: Record<string, unknown>;
  label: string;
}>();

const { available, ask } = useHemarcioAsk();
</script>

<style scoped>
.hemarcio-ask-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  margin-top: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: white;
  color: #1f2937;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.hemarcio-ask-button:hover {
  background-color: #f9fafb;
}

.hemarcio-ask-face {
  flex-shrink: 0;
}
</style>
