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


// TODO: REMOVE STEPS SINCE THEY COST MONEY. ENCAPSULATE IT WITH A TRY CATCH TO GRAB ERRORS
export const syncHemocioneIdJob = async ({ event, step }: { event: any, step: Step }) => {
  console.log(`✅ Job '${event.name}' iniciado com sucesso!`);

  // Since will enable to run this job manually, we can use the event data to get the 'after' parameter
  // If 'after' is not provided, it will be set by last cursor and the job will fetch
  const after = event.data?.after || undefined;

  const hemocioneIdPoints: HemocioneIdPointResponse[] = await step.run("get-handled-hemocione-id-points", async () => {
    await SyncManager.updateOne(
      { providerName: "HemocioneId" },
      {
        syncStatus: 'in_progress',
      }
    )
    console.log("Getting and Handling Hemocione ID points...");
    return await handleHemocioneIdsPoints(after);
  })

  if (!hemocioneIdPoints) {
    throw new Error('Failed to fetch Hemocione ID points');
  }

  console.log("✅ Hemocione ID points handled successfully");

  const uploadedPoints: UploadedPoints = await step.run("upload-hemocione-id-points", async () => {
    console.log("Uploading Hemocione ID points...");
    // TODO: Think of a better key to filter and create a relation between points in hemocioneId and onde-doar
    const operations = hemocioneIdPoints.map((hemocioneIdPoint) => {
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

    if (operations.length === 0) {
      console.log("No points to upload");
      return [];
    }

    const result = await Point.bulkWrite(operations)

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
      insertedIds: result.upsertedIds ? Object.values(result.upsertedIds) : []
    }
  })

  // TODO: Finish inactivating points that are not in the hemocioneIdPoints response
  const inactivatedPoints: InactivatedPoints = await step.run("inactivate-hemocione-id-points", async () => {
    console.log("Inactivating Hemocione ID points...");

    const result = await Point.updateMany(
      { active: true, name: { $nin: hemocioneIdPoints.map(p => p.name) } },
      { $set: { active: false } }
    );

    const modifiedIds = await Point.find(
      { active: false, name: { $nin: hemocioneIdPoints.map(p => p.name) } },
      { _id: 1 }
    ).then(points => points.map(point => point._id.toString()));

    await SyncManager.updateOne(
      { providerName: "HemocioneId" },
      {
        lastSuccessfulSyncDate: new Date(),
        lastSyncDate: new Date(),
        syncStatus: 'completed',
        syncErrors: null
      }
    )

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      modifiedIds: modifiedIds
    }
  })

  console.log("✅ Hemocione ID points uploaded and inactivated successfully")
  const message = `✅ Job '${event.name}' concluído com sucesso!`

  // await step.run("finalizar-job", async () => {
  //   // Aqui você poderia, por exemplo, salvar algo no banco de dados.
  //   return { status: "concluído", message };
  // });

  // return { body: message };
};