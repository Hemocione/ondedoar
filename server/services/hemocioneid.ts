const config = useRuntimeConfig()

interface HemocioneIdPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  displayName: string | null; // Pode ser string ou null
}

async function getHemocioneIdsPoints(after?: string): Promise<HemocioneIdPoint[] | undefined> {
  try {
    const hemocioneIdPoints = await $fetch(`${config.hemocioneId.apiUrl}/points/onde-doar/sync`, {
      method: 'GET',
      headers: {
        'x-secret': config.hemocioneId.backOfficeSecret
      }
    }) as HemocioneIdPoint[];
    return hemocioneIdPoints
  } catch (error) {
    console.error(`Error fetching Hemocione ID points using after ${after}:`, error)
    return
  }
}

export async function handleHemocioneIdsPoints(after?: string) {
  const hemocioneIdPoints = await getHemocioneIdsPoints(after)

  if (!hemocioneIdPoints) {
    throw new Error('Failed to fetch Hemocione ID points')
  }

  return hemocioneIdPoints.map((hemocioneIdPoint) => ({
    name: hemocioneIdPoint.name,
    address: hemocioneIdPoint.address,
    phone: '', // TODO: Add phone if available in HemocioneId provider
    link: '', // TODO: Add link if available in HemocioneId provider
    active: true,
    type: 'bloodbank',
    loc: {
      type: 'Point',
      coordinates: [hemocioneIdPoint.longitude, hemocioneIdPoint.latitude]
    }
  }))
}