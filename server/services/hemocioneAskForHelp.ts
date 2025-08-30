const config = useRuntimeConfig()

interface HemocioneAskForHelp {
  id: string;
  local_name: string;
  address: string;
  active_campagin: boolean;
  local_latitude: number;
  local_longitude: number;
  review_status: "Approved" | "Pending" | "Declined";
}

// export interface HemocioneAskForHelpResponse {
//   name: string,
//   address: string,
//   phone: string,
//   link: string,
//   active: boolean,
//   type: string,
//   loc: {
//     type: 'Point',
//     coordinates: number[]
//   }
// }

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
    throw new Error('Failed to fetch Hemocione Ask For Help points')
  }
}