import { getPointsParsed } from "~/composables/ondedoar";

export const useMapStore = defineStore("map", {
  // TODO: IMPROVE TYPING
  state: () => ({
    pinMarkersFeatures: [] as any[],
    visibleFeatures: [] as any[],
    loadingVisibleFeatures: true as boolean,
    mapCenter: [-43.9345, -19.9167] as number[],
    userLocation: null as number[] | null,
  }),

  getters: {
    getMapCenter: (state) => state.mapCenter,
    getVisibleFeatures: (state) => state.visibleFeatures,
    isLoadingVisibleFeatures: (state) => state.loadingVisibleFeatures,
    getPinMarkersFeatures: (state) => state.pinMarkersFeatures,
    getUserLocation: (state) => state.userLocation,
  },
  actions: {
    setUserLocation(location: number[] | null) {
      this.userLocation = location;
    },

    setLoadingVisibleFeatures(val: boolean) {
      this.loadingVisibleFeatures = val;
    },

    updateVisibleFeatures(features: any[]) {
      this.visibleFeatures = features;
    },


    setPinMarkersFeatures(points: any[]) {
      this.pinMarkersFeatures = points;
    },

    async fetchPoints() {
      const points = await getPointsParsed();
      this.setPinMarkersFeatures(points);
      return points;
    },
  },
});