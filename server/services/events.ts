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
    
    return hemocioneEvents.map((eventos) => ({
        name: eventos.name,
        address: eventos.location.address,
        phone: '',
        link: '',
        active: true,
        type: 'eventos',
        loc: {
            type: 'point',
            coordinates: []
        }   


    })
    )
}
