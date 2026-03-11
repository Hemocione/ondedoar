import { useMapStore } from '~/store/map';

export const useRouting = () => {
  const mapStore = useMapStore();
  const loadingRoute = ref(false);
  const routeError = ref<string | null>(null);

  /**
   * Fetches the route from OSRM and updates the map store
   */
  const fetchRoute = async (userCoords: [number, number], destCoords: [number, number]) => {
    loadingRoute.value = true;
    routeError.value = null;

    try {
      const { 0: userLon, 1: userLat } = userCoords;
      const { 0: destLon, 1: destLat } = destCoords;

      const url = `/api/v1/route?user=${userLon},${userLat}&dest=${destLon},${destLat}`;
      console.log('Fetching route via proxy API:', url);

      const response = await $fetch<any>(url);

      if (response && response.routes && response.routes.length > 0) {
        const routeGeoJSON = response.routes[0].geometry; // This is a GeoJSON LineString
        mapStore.setCurrentRoute({
          type: 'Feature',
          properties: {},
          geometry: routeGeoJSON
        });

        // Return detailed route info if we want to show duration/distance
        return {
          distance: response.routes[0].distance,
          duration: response.routes[0].duration,
        };
      } else {
        throw new Error('No route found');
      }
    } catch (err: any) {
      console.error('Error fetching route:', err);
      routeError.value = err.message || 'Erro ao buscar rota';
      mapStore.setCurrentRoute(null);
      return null;
    } finally {
      loadingRoute.value = false;
    }
  };

  return {
    fetchRoute,
    loadingRoute,
    routeError
  };
};
