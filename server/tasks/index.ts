import { Inngest, InngestFunction } from "inngest";
import { testJob } from "./jobs/test";
import { syncHemocioneIdJob } from "./jobs/syncHemocioneId";

const config = useRuntimeConfig();

type CallbackArgs = (...args: any[]) => Promise<any> | any;

interface JobConfiguration {
  id: string;
  name?: string;
}

interface EventTrigger {
  event: string
}

interface CronTrigger {
  cron: string
}

type JobTrigger = EventTrigger | CronTrigger

type JobTriggers = EventTrigger | CronTrigger | JobTrigger[]

interface Job {
  configuration: JobConfiguration;
  trigger: JobTriggers;
  callback: CallbackArgs;
}

class TaskManager {
  private static _instance: TaskManager;
  private inngest: Inngest;
  public jobs: InngestFunction.Any[] = [];

  private constructor() {
    // TODO: each job could be dynamically loaded from a directory here
    // and defined in the setupAgenda method
    this.inngest = new Inngest({ id: config.inngest.id });

    this.addJob(
      {
        configuration: {
          id: "syncHemocioneId",
          name: "syncHemocioneId",
        },
        trigger: {
          cron: "0 */8 * * *",
          event: 'syncHemocioneId',
        },
        callback: syncHemocioneIdJob,
      }
    )

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
    const inngestFunction = this.inngest.createFunction(job.configuration, job.trigger, job.callback)
    this.jobs.push(inngestFunction);
  }

  getInngest() {
    return this.inngest;
  }

  async triggerJob(eventName: string, data?: any) {
    return this.inngest.send({
      name: eventName,
      data: data || {}
    });
  }
}

export const taskManager = TaskManager.getInstance();