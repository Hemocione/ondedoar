<template>
  <div class="flex items-center w-[100vw] h-[55px] bg-black px-4 shadow-xl/20">
    <div class="flex-grow">
      <img class="w-[130px]" src="/assets/vectors/HemocioneWhite.svg"
        alt="Logo da Hemocione em branco e Hemocione escrito em branco">
    </div>
    <!-- TODO: FIX LOGIN PROCESS -->
    <UButton :trailing-icon="buttonIcon" size="md"
      :ui="{ base: 'bg-hemo-color-primary text-hemo-color-text-primary hover:bg-hemo-color-primary-action active:bg-hemo-color-secondary active:text-hemo-color-primary-light' }"
      @click="buttonEvent">
      {{ buttonText }}
    </UButton>
  </div>
</template>


<!--  TODO: FINISH LOGIC FOR FUNCTIONS -->
<!-- TODO: HANDLE LOGIN -->
<script lang="ts" setup>
import { redirectToID } from '~/middleware/auth';
import { useUserStore } from '~/store/users';
const router = useRouter();

const userStore = useUserStore();
const { user, loggedIn } = storeToRefs(userStore);

const buttonText = computed(() => {
  return user.value ? `Sair (${user.value?.givenName?.trim()})` : "Entrar";
});

const buttonIcon = computed(() => {
  return user.value ? 'i-heroicons-arrow-left-on-rectangle' : 'i-heroicons-arrow-right-on-rectangle';
})

async function goRegister() {
  if (loggedIn.value) {
    sessionStorage.setItem("anonymousMode", "false");
    router.push("/intention");
  } else {
    sessionStorage.setItem("anonymousMode", "false");
    redirectToID(`/`);
  }
}

async function logOut() {
  await userStore.logOut();
  sessionStorage.setItem("anonymousMode", "true");
  router.push("/");
}

const buttonEvent = computed(() => {
  return user.value ? logOut : goRegister
})
</script>
