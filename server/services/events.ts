const config = useRuntimeConfig()

interface HemocioneDigitalEvents {
    name: string,
    startAt: string,
    endAt: string,
    slug: string,
    local_latitude?: number;
    local_longitude?: number;
    location: {
        address: string;
        city: string;
        state: string;
    }
}

export interface HemocioneDigitalEventsPointResponse {
    name: string,
    displayName?: string | null,
    address: string,
    phone: string,
    link: string,
    active: boolean,
    type: string,
    loc: {
        type: 'Point',
        coordinates: number[]
    }
}

//TODO: Move to utils
function handleFullAdress(address: string, city?: string, state?: string) {

    return `${address}, ${city} - ${state}`
}

async function getHemocioneDigitalEvents(after?: string): Promise<HemocioneDigitalEvents[]> {
    try {
        const hemocioneDigitalEventsPoints = await $fetch(`${config.hemocioneDigitalEvents.apiUrl}/api/v1/points/ondedoar/sync`, {
            method: 'GET',
            headers: {
                'x-secret': config.hemocioneDigitalEvents.secret,
            }
        }) as HemocioneDigitalEvents[]
        return hemocioneDigitalEventsPoints
    } catch (err) {
        console.error(err)
        throw new Error('Failed to fetch hemocioneDigitalEventsPoints')
    }
}

export async function handleHemocioneDigitalEventsPoints(after?: string): Promise<HemocioneDigitalEventsPointResponse[]> {
    const hemocioneDigitalEvents = await getHemocioneDigitalEvents()

    if (!hemocioneDigitalEvents) {
        throw new Error('Failed to fetch hemocioneDigitalEventsPoints')
    }

    return await Promise.all(
        hemocioneDigitalEvents.map(async (hemocioneDigitalEvent) => {
            const { address, city, state } = hemocioneDigitalEvent.location
            const fullAddress = handleFullAdress(address, city, state)
            const coordinates = await handleGeocoding(fullAddress)
            return {
                name: hemocioneDigitalEvent.name,
                displayName: null, // TODO: Populate correctly
                address: hemocioneDigitalEvent.location.address,
                phone: '',
                link: `${config.hemocioneDigitalEvents.apiUrl}/event/${hemocioneDigitalEvent.slug}`,
                active: true,
                type: 'Event',
                loc: {
                    type: 'Point',
                    coordinates: coordinates
                }
            }
        })
    )
}
