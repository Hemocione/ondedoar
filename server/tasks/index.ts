import { Agenda } from "@hokify/agenda";

const config = useRuntimeConfig();

type CallbackArgs = (...args: any[]) => void;

class TaskManager {
  private static _instance: TaskManager;
  private agenda: Agenda;

  private constructor() {
    this.agenda = new Agenda({
      db: {
        address: config.db.mongo.uri,
        collection: "agendaJobs",
      }
    });
  }

  public static getInstance(): TaskManager {
    if (!this._instance) {
      this._instance = new TaskManager();
    }
    return this._instance;
  }

  public static addJob(fn: { name: string, callback: CallbackArgs }) {
    const taskManager = TaskManager.getInstance();
    taskManager.agenda.define(fn.name, fn.callback);
  }
}