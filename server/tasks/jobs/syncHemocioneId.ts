import { handleHemocioneIdsPoints } from "~/server/services/hemocioneid";
import { Point } from "~/server/db/models/points";

interface Step {
  run(name: string, callback: () => Promise<any>): Promise<any>;
}

export const syncHemocioneIdJob = async ({ event, step }: { event: any, step: Step }) => {
  console.log(`✅ Job '${event.name}' iniciado com sucesso!`);

  const after = event.data?.after || undefined;

  const hemocioneIdPoints = await step.run("get-handled-hemocione-id-points", async () => {
    console.log("Getting and Handling Hemocione ID points...");
    return await handleHemocioneIdsPoints(after);
  })

  if (!hemocioneIdPoints) {
    throw new Error('Failed to fetch Hemocione ID points');
  }

  console.log("✅ Hemocione ID points handled successfully");

  const uploadedPoints = await step.run("upload-hemocione-id-points", async () => {
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
  const inactivatedPoints = await step.run("inactivate-hemocione-id-points", async () => {
    console.log("Inactivating Hemocione ID points...");
  })

  // await step.run("finalizar-job", async () => {
  //   // Aqui você poderia, por exemplo, salvar algo no banco de dados.
  //   return { status: "concluído", message };
  // });

  // return { body: message };
};