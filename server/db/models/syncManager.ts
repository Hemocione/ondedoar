import { InferSchemaType, Schema, model } from "mongoose";

const SyncManagerSchema = new Schema({
  providerName: {
    type: String,
    required: true,
  },
  lastSuccessfulSyncDate: {
    type: Date,
    default: null,
  },
  lastSyncDate: {
    type: Date,
    default: null,
  },
  syncStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending',
  },
  lastSyncResults: {
    type: [Object],
    default: []
  },
  syncErrors: {
    stack: String,
    cause: String,
    message: String
  }
}, {
  timestamps: true,
  statics: {
    getLastCursor: async function (providerName: string) {
      const syncDoc = await this.findOne({ providerName: providerName });
      if (syncDoc) {
        return syncDoc.lastSuccessfulSyncDate || syncDoc.lastSyncDate;
      }
      return null;
    }
  }
})

export type SyncManagerSchema = InferSchemaType<typeof SyncManagerSchema>;

export const SyncManager = model<SyncManagerSchema>("SyncManager", SyncManagerSchema);