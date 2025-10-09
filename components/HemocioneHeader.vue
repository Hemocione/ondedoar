<template>
  <div class="flex items-center w-screen h-[55px] bg-black px-4 shadow-xl/20">
    <div class="flex-grow">
      <img class="w-[130px]" src="/assets/vectors/HemocioneWhite.svg"
        alt="Logo da Hemocione em branco e Hemocione escrito em branco">
    </div>
    <UButton :trailing-icon="buttonIcon" size="md" :ui="{ base: 'bg-hemo-color-primary text-hemo-color-text-primary' }"
      @click="buttonEvent">
      {{ buttonText }}
    </UButton>
  </div>
</template>


<!--  TODO: FINISH LOGIC FOR FUNCTIONS -->
<!-- TODO: HANDLE LOGIN -->
<script lang="ts" setup>
const router = useRouter();

const isLoggedIn = ref(false);

const buttonText = computed(() => {
  return isLoggedIn.value ? 'Sair' : 'Entrar';
})

const buttonIcon = computed(() => {
  return isLoggedIn.value ? 'i-heroicons-arrow-left-on-rectangle' : 'i-heroicons-arrow-right-on-rectangle';
})

async function goRegister() {
  console.log('goRegister');
}

async function logOut() {
  console.log('logOut');
}

const buttonEvent = computed(() => {
  return isLoggedIn.value ? logOut : goRegister
})
</script>