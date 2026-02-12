import { useMapStore } from '~/store/map';
import { useUserStore } from '~/store/users';

export function useUserLocation() {
  const mapStore = useMapStore();
  const userStore = useUserStore();
  const trackingInterval = useState<NodeJS.Timeout | null>('locationTrackingInterval', () => null);

  const updateLocation = () => {
    console.log('📍 [useUserLocation] Tentando atualizar localização...');
    if (!process.client || !('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        console.log('✅ [useUserLocation] Coordenadas obtidas:', coords);
        mapStore.setUserLocation(coords);
        // Opcional: Centralizar o mapa na localização do usuário se for a primeira vez
        // mapStore.setMapCenter(coords);
        userStore.setPermissionUserLocation('granted');
      },
      (error) => {
        console.error('❌ [useUserLocation] Erro:', error);
        if (error.code === error.PERMISSION_DENIED) {
          userStore.setPermissionUserLocation('denied');
          stopTracking();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const startTracking = () => {
    if (!process.client || !('geolocation' in navigator)) {
      console.warn('⚠️ [useUserLocation] Geolocalização não suportada.');
      return;
    }

    // Se já estiver rodando, não inicia outro
    if (trackingInterval.value) {
      console.log('ℹ️ [useUserLocation] Rastreamento já está ativo.');
      return;
    }

    console.log('🚀 [useUserLocation] Iniciando novo rastreamento...');

    // Primeira chamada imediata
    updateLocation();

    // Configura intervalo de 30 segundos (300000 ms)
    trackingInterval.value = setInterval(() => {
      updateLocation();
    }, 30000);
  };

  const stopTracking = () => {
    if (trackingInterval.value) {
      clearInterval(trackingInterval.value);
      trackingInterval.value = null;
    }
  };

  const checkPermissionAndStart = async () => {
    if (!process.client || !('permissions' in navigator)) return;

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      console.log('📍 [useUserLocation] Permissão inicial:', result.state);
      userStore.setPermissionUserLocation(result.state as PermissionState);

      if (result.state === 'granted') {
        startTracking();
      }

      result.onchange = () => {
        console.log('🔄 [useUserLocation] Permissão mudou para:', result.state);
        userStore.setPermissionUserLocation(result.state as PermissionState);
        if (result.state === 'granted') {
          startTracking();
        } else {
          stopTracking();
        }
      };
    } catch (err) {
      console.error('❌ [useUserLocation] Erro ao verificar permissões:', err);
    }
  };

  return {
    startTracking,
    stopTracking,
    checkPermissionAndStart
  };
}
