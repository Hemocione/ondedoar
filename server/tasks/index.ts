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

    this.agenda.on("start", (job) => {
       console.log("Job %s starting", job.attrs.name);
    })

    this.agenda.on("complete", (job) => {
      console.log("Job %s finished", job.attrs.name);
    })
  }

  public static getInstance(): TaskManager {
    if (!this._instance) {
      this._instance = new TaskManager();
    }
    return this._instance;
  }

  addJob(job: { name: string, callback: CallbackArgs }) {
    const taskManager = TaskManager.getInstance();
    taskManager.agenda.define(job.name, job.callback);
  }

  public static setupAgenda() {
    console.log("Setting up Agenda...");
    const taskManager = TaskManager.getInstance();

    taskManager.agenda.start();
  }
}