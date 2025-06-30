import { Inngest, InngestFunction } from "inngest";

const config = useRuntimeConfig();

type CallbackArgs = (...args: any[]) => void;

interface Job {
  name: string;
  callback: CallbackArgs;
  cron: string;
}

class TaskManager {
  private static _instance: TaskManager;
  private inngest: Inngest;
  public jobs: any = [];

  private constructor() {
    // TODO: each job could be dynamically loaded from a directory here
    // and defined in the setupAgenda method
    this.inngest = new Inngest({ id: config.inngest.id });
  }

  public static getInstance(): TaskManager {
    if (!this._instance) {
      this._instance = new TaskManager();
    }
    return this._instance;
  }

  addJob(job: Job) {
    this.jobs.push(this.inngest.createFunction({ id: job.name }, { cron: job.cron }, job.callback));
  }

  getInngest() {
    return this.inngest;
  }
}

export const taskManager = TaskManager.getInstance();