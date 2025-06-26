import { Agenda } from "@hokify/agenda";

const config = useRuntimeConfig();

type CallbackArgs = (...args: any[]) => void;

interface Job {
  name: string;
  callback: CallbackArgs;
}

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

  setJobFrequency(frequency: string, job: Job) {
    this.agenda.every(frequency, job.name);
  }

  addJob(job: Job) {
    this.agenda.define(job.name, job.callback);
  }

  setupAgenda() {
    console.log("Setting up Agenda...");

    this.agenda.start();
  }
}

export const taskManager = TaskManager.getInstance();