import { getPointsParsed } from "~/composables/ondedoar";

export const useMapStore = defineStore("map", {
  // TODO: IMPROVE TYPING
  state: () => ({
    pinMarkersFeatures: [] as any[],
    visibleFeatures: [] as any[],
    loadingVisibleFeatures: true as boolean,
    mapCenter: [-43.9345, -19.9167] as number[],
    zoom: 3.91 as number,
    currentRoute: null as any | null,
  }),

  getters: {
    getMapCenter: (state) => state.mapCenter,
    getVisibleFeatures: (state) => state.visibleFeatures,
    isLoadingVisibleFeatures: (state) => state.loadingVisibleFeatures,
    getPinMarkersFeatures: (state) => state.pinMarkersFeatures,
    getCurrentRoute: (state) => state.currentRoute,
  },
  actions: {
    setLoadingVisibleFeatures(val: boolean) {
      this.loadingVisibleFeatures = val;
    },

    updateVisibleFeatures(features: any[]) {
      this.visibleFeatures = features;
    },

    setCurrentRoute(routeGeoJsonFeature: any | null) {
      this.currentRoute = routeGeoJsonFeature;
    },


    setPinMarkersFeatures(points: any[]) {
      this.pinMarkersFeatures = points;
    },

    setMapCenter(coordinates: number[]) {
      this.mapCenter = coordinates;
    },

    setZoom(zoom: number) {
      this.zoom = zoom;
    },

    async fetchPoints() {
      const points = await getPointsParsed();
      this.setPinMarkersFeatures(points);
      return points;
    },
  },
});
