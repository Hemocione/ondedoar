export const useInfoStore = defineStore("info", {
  state: () => ({
    loadingVisibleFeatures: true as boolean,
  }),
  getters: {
    isLoadingVisibleFeatures: (state) => state.loadingVisibleFeatures,
  },
  actions: {
    setloadingVisibleFeatures(val: boolean) {
      this.loadingVisibleFeatures = val;
    },
  },
});
