const config = useRuntimeConfig()

interface HemocioneDigitalEvents {
    name: string,
    startAt: string,
    endAt: string,
    slug: string,
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

async function getEvents(after?: string): Promise<HemocioneDigitalEvents[]> {
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
    const hemocioneDigitalEvents = await getEvents()

    if (!hemocioneDigitalEvents) {
        throw new Error('Failed to fetch Events points')
    }

    return hemocioneDigitalEvents.map(async (evento) => ({
        name: evento.name,
        address: evento.location.address,
        phone: '',
        link: `${config.hemocioneDigitalEvents.apiUrl}/event/${evento.slug}`,
        active: true,
        type: 'Event',
        loc: {
            type: 'Point',
            coordinates: await getEvents()
        }


    })
    )
}
