import { handleHemocioneIdsPoints, HemocioneIdPointResponse } from "~/server/services/hemocioneid";
import { Point } from "~/server/db/models/points";
import { SyncManager } from "~/server/db/models/syncManager";

interface Step {
  run(name: string, callback: () => Promise<any>): Promise<any>;
}

interface UploadedPoints {
  matchedCount: number,
  modifiedCount: number,
  upsertedCount: number,
  insertedIds: string[]
}

interface InactivatedPoints {
  matchedCount: number,
  modifiedCount: number,
  modifiedIds: string[]
}

export const syncHemocioneIdJob = async ({ event, step }: { event: any, step: Step }) => {
  console.log(`✅ Job '${event.name}' iniciado com sucesso!`);
  // Since will enable to run this job manually, we can use the event data to get the 'after' parameter
  // If 'after' is not provided, it will be set by last cursor and the job will fetch
  const after = event.data?.after || undefined;

  await SyncManager.updateOne(
    { providerName: "HemocioneId" },
    {
      syncStatus: 'in_progress',
    }
  )

  console.log("Getting and Handling Hemocione ID points...");

  const hemocioneIdPoints: HemocioneIdPointResponse[] = await handleHemocioneIdsPoints(after);

  if (!hemocioneIdPoints) {
    throw new Error('Failed to fetch Hemocione ID points');
  }

  console.log("✅ Hemocione ID points handled successfully;", "\nUploading Hemocione ID points...");

  // TODO: Think of a better key to filter and create a relation between points in hemocioneId and onde-doar
  const upsertOperations = hemocioneIdPoints.map((hemocioneIdPoint) => {
    return {
      updateOne: {
        filter: { name: hemocioneIdPoint.name },
        update: {
          $set: {
            name: hemocioneIdPoint.name,
            address: hemocioneIdPoint.address,
            phone: hemocioneIdPoint.phone || '',
            link: hemocioneIdPoint.link || '',
            active: hemocioneIdPoint.active,
            type: hemocioneIdPoint.type,
            loc: {
              type: 'Point',
              coordinates: [hemocioneIdPoint.loc.coordinates[0], hemocioneIdPoint.loc.coordinates[1]]
            }
          },
          $setOnInsert: {
            createdAt: new Date(),
          }
        },
        upsert: true, // Create if it doesn't exist
      }
    }
  }).filter(op => op !== null)

  if (upsertOperations.length === 0) {
    console.log("No points to upload");
    return [];
  }

  const printThis = hemocioneIdPoints.map(p => p.name)

  console.log(printThis)

  const toInactivatePoints = await Point.find(
    { active: true, name: { $nin: hemocioneIdPoints.map(p => p.name) } },
    { _id: 1 }
  )

  const inactivateOperations = toInactivatePoints.map((point) => {
    return {
      updateOne: {
        filter: { id: point.id },
        update: {
          $set: {
            active: false
          }
        }
      }
    }
  });

  const updatePoints = await Point.bulkWrite([...upsertOperations, ...inactivateOperations])

  await SyncManager.updateOne(
    { providerName: "HemocioneId" },
    {
      lastSuccessfulSyncDate: new Date(),
      lastSyncDate: new Date(),
      syncStatus: 'completed',
      syncErrors: null,
      lastSyncResults: updatePoints.upsertedIds
    }
  )

  console.log("✅ Hemocione ID points uploaded and inactivated successfully")
  const message = `✅ Job '${event.name}' concluído com sucesso!`
};