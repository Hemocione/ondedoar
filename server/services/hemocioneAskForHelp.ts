import { handleGeocoding } from "~/server/utils/geocodingService"

const config = useRuntimeConfig()

interface HemocioneAskForHelp {
  id: string;
  local_name: string;
  address: string;
  active_campagin: boolean;
  local_latitude?: number;
  local_longitude?: number;
  review_status: "Approved" | "Pending" | "Declined";
}

// TODO: MAKE THIS A PATTERNED INTERFACE FOR ALL RESPONSES
export interface HemocioneAskForHelpPointResponse {
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

async function getHemocioneAskForHelpPoints(after?: string): Promise<HemocioneAskForHelp[]> {
  try {
    const hemocioneAskForHelpPoints = await $fetch(`${config.hemocioneAskforHelp.apiUrl}/api/points/onde-doar/sync`, {
      method: 'POST',
      headers: {
        'x-secret': config.hemocioneAskforHelp.backOfficeSecret
      },
      body: {
        after
      }
    }) as HemocioneAskForHelp[];
    return hemocioneAskForHelpPoints
  } catch (error) {
    console.error(`Error fetching Hemocione Ask For Help points using after ${after}:`, error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch Hemocione Ask For Help points',
        cause: error
     })
  }
}

function parseLink(id: string): string {
  return `${config.hemocioneAskforHelp.apiUrl}/description/${id}`;
}

export async function handleHemocioneAskForHelpPoints(after?: string): Promise<HemocioneAskForHelpPointResponse[]> {
  const hemocioneAskForHelpPoints = await getHemocioneAskForHelpPoints(after)

  if (!hemocioneAskForHelpPoints) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch Hemocione Ask For Help points',
        cause: error
     })
  }

  return await Promise.all(
    hemocioneAskForHelpPoints.map(async (hemocioneAskForHelpPoint) => {
      // TODO: STUDY THE NEED FOR A QUEUE SYSTEM TO HANDLE GEOCODING REQUESTS
      const coordinates = (hemocioneAskForHelpPoint.local_longitude && hemocioneAskForHelpPoint.local_latitude) ? [
        hemocioneAskForHelpPoint.local_longitude,
        hemocioneAskForHelpPoint.local_latitude
      ] : await handleGeocoding(hemocioneAskForHelpPoint.address)

      return {
        name: hemocioneAskForHelpPoint.local_name,
        address: hemocioneAskForHelpPoint.address,
        phone: '', // TODO: Add phone if available in Hemocione Ask For Help provider
        link: parseLink(hemocioneAskForHelpPoint.id),
        active: hemocioneAskForHelpPoint.active_campagin && hemocioneAskForHelpPoint.review_status === 'Approved',
        type: 'campaign',
        loc: {
          type: 'Point',
          coordinates
        }
      }
    })
  )
}