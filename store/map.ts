import { LRUCache } from "lru-cache";
import { getPointsParsed } from "~/composables/ondedoar";

const pointsCache = new LRUCache<string, any[]>({
  max: 1,
  // 5 minutes
  ttl: 1000 * 60 * 10,
});

export const useMapStore = defineStore("map", {
  // TODO: IMPROVE TYPING
  state: () => ({
    pinMarkersFeatures: [] as any[],
    visibleFeatures: [] as any[],
    loadingVisibleFeatures: true as boolean,
    mapCenter: [-43.9345, -19.9167] as number[],
  }),

  getters: {
    getMapCenter: (state) => state.mapCenter,
    getVisibleFeatures: (state) => state.visibleFeatures,
    isLoadingVisibleFeatures: (state) => state.loadingVisibleFeatures,
    getPinMarkersFeatures: (state) => state.pinMarkersFeatures,
  },
  actions: {
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
      const cacheKey = "all-points";
      if (pointsCache.has(cacheKey)) {
        const cachedPoints = pointsCache.get(cacheKey)!;
        this.setPinMarkersFeatures(cachedPoints);
        return cachedPoints;
      }

      const points = await getPointsParsed();
      this.setPinMarkersFeatures(points);
      pointsCache.set(cacheKey, points);
      return points;
    },
  },
});