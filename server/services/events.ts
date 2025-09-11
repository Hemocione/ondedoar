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

async function getHemocioneDigitalEvents(after?: string): Promise<HemocioneDigitalEvents[]> {
    try {
        const localEvents = await $fetch(`${config.hemocioneDigitalEvents.apiUrl}/api/v1/points/ondedoar/sync`, {
            method: 'GET',
            headers: {
                'x-secret': config.hemocioneDigitalEvents.backOfficeSecret,
            }
        }) as HemocioneDigitalEvents[]
        return localEvents
    } catch (err) {
        console.error(err)
        throw new Error('Failed to fetch Events points')
    }
}

export async function handleEvents(after?: string): Promise<HemocioneDigitalEventsPointResponse[]> {
    const hemocioneDigitalEvents = await getHemocioneDigitalEvents()

    if (!hemocioneDigitalEvents) {
        throw new Error('Failed to fetch Events points')
    }

    return await Promise.all(
        hemocioneDigitalEvents.map(async (hemocioneDigitalEvent) => {
            const coordinates = (hemocioneDigitalEvent.local_longitude && hemocioneDigitalEvent.local_latitude) ?
            [hemocioneDigitalEvent.local_longitude, hemocioneDigitalEvent.local_latitude] : await handleGeocoding(hemocioneDigitalEvent.location.address)
            return {  
                name: hemocioneDigitalEvent.name,
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
