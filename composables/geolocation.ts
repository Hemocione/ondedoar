export function fetchUserLocation(): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.longitude, pos.coords.latitude]),
      (err) => reject(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
    );
  });
}
