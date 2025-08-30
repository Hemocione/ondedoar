import { handleHemocioneAskForHelpPoints, HemocioneAskForHelpPointResponse } from "~/server/services/hemocioneAskForHelp";
import { Point } from "~/server/db/models/points";
import { SyncManager } from "~/server/db/models/syncManager";
import { FailureEventArgs } from "inngest";

// TODO: MOVE TO A SPECIFIC FILE FOR INTERFACES
interface Step {
  run(name: string, callback: () => Promise<any>): Promise<any>;
}

export const syncHemocioneAskForHelpJob = async ({ event, step }: { event: any, step: Step }) => {
  console.log(`✅ Job '${event.name}' iniciado com sucesso!`);
  // Since will enable to run this job manually, we can use the event data to get the 'after' parameter
  // If 'after' is not provided, it will be set by last cursor and the job will fetch
  const after = event.data?.after || await SyncManager.getLastCursor("HemocioneId");

  await SyncManager.updateOne(
    { providerName: "HemocioneId" },
    {
      syncStatus: 'in_progress',
    }
  )

  console.log("Getting and Handling Hemocione Ask for Help points...");

  const hemocioneAskForHelpPoints: HemocioneAskForHelpPointResponse[] = await handleHemocioneAskForHelpPoints(after);

  if (!hemocioneAskForHelpPoints) {
    throw new Error('Failed to fetch Hemocione Ask For Help points');
  }

  console.log("✅ Hemocione Ask for Help points handled successfully;", "\nUploading Hemocione Ask for Help points...");

  const upsertOperations = hemocioneAskForHelpPoints.map((hemocioneAskForHelpPoint) => {
    return {
      updateOne: {
        filter: { name: hemocioneAskForHelpPoint.name },
        update: hemocioneAskForHelpPoint,
        upsert: true
      }
    }
  }).filter(op => op !== null);

  if (upsertOperations.length === 0) {
    console.log("No points to upload");
    return [];
  }

  const inactivateOperations = {
    updateMany: {
      filter: { name: { $nin: hemocioneAskForHelpPoints.map(p => p.name) } },
      update: {
        $set: {
          active: false
        }
      }
    }
  }

  const updatePoints = await Point.bulkWrite([...upsertOperations, inactivateOperations])

  await SyncManager.updateOne(
    { providerName: "HemocioneAskForHelp" },
    {
      lastSuccessfulSyncDate: new Date(),
      lastSyncDate: new Date(),
      syncStatus: 'completed',
      syncErrors: null,
      lastSyncResults: updatePoints.upsertedIds
    }
  )

  console.log("✅ Hemocione Ask for Help points uploaded and inactivated successfully")
  const message = `✅ Job '${event.name}' concluído com sucesso!`
}

export const syncHemocioneAskForHelpJobErrorHandler = async ({ error, event }: FailureEventArgs) => {
  console.error(`❌ Job '${event.name}' falhou definitivamente!`, error);
  await SyncManager.updateOne(
    { providerName: "HemocioneAskForHelp" },
    {
      syncStatus: 'failed',
      syncErrors: error.stack,
      lastSyncDate: new Date(),
      lastSyncResults: []
    }
  );
}