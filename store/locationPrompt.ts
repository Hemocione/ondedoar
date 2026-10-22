// Visibilidade da tela "Ative a sua localizacao"; a bolha do Hemarcio some enquanto ela aparece.
export const useLocationPromptStore = defineStore("locationPrompt", {
  state: () => ({
    visible: false as boolean,
  }),
  actions: {
    setVisible(val: boolean) {
      this.visible = val;
    },
  },
});
