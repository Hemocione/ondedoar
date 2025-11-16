import type { InngestFunction } from "inngest";
import { Inngest } from "inngest";
import { syncHemocioneIdJob, syncHemocioneIdJobErrorHandler } from "./jobs/syncHemocioneId";
import { syncHemocioneAskForHelpJob, syncHemocioneAskForHelpJobErrorHandler } from "./jobs/syncHemocioneAskForHelp";
import { syncHemocioneDigitalEventsJob, syncHemocioneDigitalEventsJobErrorHandler } from "./jobs/syncHemocioneDigitalEvents";

const config = useRuntimeConfig();

type CallbackArgs = (...args: any[]) => Promise<any> | any;

interface JobConfiguration {
  id: string;
  name?: string;
  onFailure?: CallbackArgs;
  retries?: number
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
    this.inngest = new Inngest({ id: 'onde-doar', name: 'Hemocione - Onde Doar', eventKey: config.inngest.key });

    this.addJob(
      {
        configuration: {
          id: "syncHemocioneId",
          name: "syncHemocioneId",
          onFailure: syncHemocioneIdJobErrorHandler,
          retries: 3, // Number of retries on failure
        },
        trigger: {
          cron: "0 */8 * * *",
          event: 'syncHemocioneId',
        },
        callback: syncHemocioneIdJob,
      }
    )

    this.addJob(
      {
        configuration: {
          id: "syncHemocioneAskForHelp",
          name: "syncHemocioneAskForHelp",
          onFailure: syncHemocioneAskForHelpJobErrorHandler,
          retries: 3, // Number of retries on failure
        },
        trigger: {
          cron: "0 */8 * * *",
          event: 'syncHemocioneAskForHelp',
        },
        callback: syncHemocioneAskForHelpJob,
      }
    )

    this.addJob(
      {
        configuration: {
          id: "syncHemocioneDigitalEvents",
          name: "syncHemocioneDigitalEvents",
          onFailure: syncHemocioneDigitalEventsJobErrorHandler,
          retries: 3, // Number of retries on failure
        },
        trigger: {
          cron: "0 */8 * * *",
          event: 'syncHemocioneDigitalEvents',
        },
        callback: syncHemocioneDigitalEventsJob,
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
    return await this.inngest.send({
      name: eventName,
      data: data || {}
    });
  }
}

export const taskManager = TaskManager.getInstance();