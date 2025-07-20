import { Inngest, InngestFunction } from "inngest";
import { testJob } from "./jobs/test";

const config = useRuntimeConfig();

type CallbackArgs = (...args: any[]) => Promise<any> | any;

interface Job {
  name: string;
  callback: CallbackArgs;
  cron: string;
}

class TaskManager {
  private static _instance: TaskManager;
  private inngest: Inngest;
  public jobs: InngestFunction.Any[] = [];

  private constructor() {
    // TODO: each job could be dynamically loaded from a directory here
    // and defined in the setupAgenda method
    this.inngest = new Inngest({ id: config.inngest.id });

    // this.addJob({
    //   name: "test",
    //   callback: testJob,
    //   cron: "*/5 * * * *", // Every 5 minutes
    // });
  }

  public static getInstance(): TaskManager {
    if (!this._instance) {
      this._instance = new TaskManager();
    }
    return this._instance;
  }

  addJob(job: Job) {
    const inngestFunction = this.inngest.createFunction({ id: job.name }, { cron: job.cron }, job.callback)
    this.jobs.push(inngestFunction);
  }

  getInngest() {
    return this.inngest;
  }
}

export const taskManager = TaskManager.getInstance();