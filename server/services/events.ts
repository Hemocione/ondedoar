const config = useRuntimeConfig()

interface DonateEvents {
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

export interface DonateEventsResponse {
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

async function getEvents() {
    try{
    const localEvents = await $fetch(`${config.events.apiUrl}/points/ondedoar/sync`, {
        method: 'GET',
        headers: {
        'x-secret': config.events.backOfficeSecret,
        }
    })

    return localEvents
    } catch(err) {
        console.error(err)
        throw new Error('Failed to fetch Events points')
    }
}

export async function handleEvents() {
    const hemocioneEvents = await getEvents()

    if(!hemocioneEvents){
        throw new Error('Failed to fetch Events points')
    }
    
    return hemocioneEvents
}
