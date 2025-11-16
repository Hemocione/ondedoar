import type { HemocioneDigitalEventsPointResponse } from "@/server/services/hemocioneDigitalEvents";
import { handleHemocioneDigitalEventsPoints } from "@/server/services/hemocioneDigitalEvents"
import { Point } from "~/server/db/models/points";
import { SyncManager } from "~/server/db/models/syncManager";
import type { FailureEventArgs } from "inngest";


// Fazer o Job de atualizar os eventos digitais do hemocione

interface Step {
  run(name: string, callback: () => Promise<any>): Promise<any>;
}

export const syncHemocioneDigitalEventsJob = async ({ event, step }: { event: any, step: Step }) => {
    console.log(`✅ Job '${event.name}' iniciado com sucesso!`);

    const after = event.data?.after || await SyncManager.getLastCursor("HemocioneDigitalEvents");

    await SyncManager.updateOne(
        { providerName: "HemocioneDigitalEvents" },
        {syncStatus: 'in_progress',}
    )

    const hemocioneDigitalEventsPoints: HemocioneDigitalEventsPointResponse[] = await handleHemocioneDigitalEventsPoints(after);

    if (!hemocioneDigitalEventsPoints) {
        throw new Error('Failed to fetch Hemocione Digital Events points at syncHemocioneIdJob');
    }

    const upsertOperations = hemocioneDigitalEventsPoints.map((hemocioneDigitalEventsPoint) => {
        return {
        updateOne: {
            filter: { name: hemocioneDigitalEventsPoint.name },
            update: {
            $set: hemocioneDigitalEventsPoint,
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

    const inactivateOperations = {
        updateMany: {
        filter: { name: { $nin: hemocioneDigitalEventsPoints.map(p => p.name) } },
        update: {
            $set: {
            active: false
            }
        }
        }
    }
  
    const updatePoints = await Point.bulkWrite([...upsertOperations, inactivateOperations])

    await SyncManager.updateOne(
        { providerName: "HemocioneDigitalEvents" },
        {
        lastSuccessfulSyncDate: new Date(),
        lastSyncDate: new Date(),
        syncStatus: 'completed',
        syncErrors: null,
        lastSyncResults: updatePoints.upsertedIds
        }
    )

    console.log("✅ Hemocione Digital Events points uploaded and inactivated successfully")
}

export const syncHemocioneDigitalEventsJobErrorHandler =  async ({ error, event }: FailureEventArgs) => {
    
    console.error(`❌ Job '${event.name}' falhou definitivamente!`, error);
    
    await SyncManager.updateOne(
    { providerName: "HemocioneDigitalEvents" },
    {
        syncStatus: 'failed',
        syncErrors: {
        stack: error.stack,
        cause: error.cause,
        message: error.message
        },
        lastSyncDate: new Date(),
        lastSyncResults: []
    }
    );
}