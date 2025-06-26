import { taskManager } from "../tasks";

export default defineNitroPlugin(async (_nitro) => {
  // Add jobs to the task manager
  // taskManager.addJob({
  //   name: "exampleJob",
  //   callback: () => console.log("Example job executed!"),
  // });
  console.log("Added jobs to the task manager.");

  // Set job frequency
  // taskManager.setJobFrequency("5 minutes", { name: "exampleJob" });
  console.log("Set frequency for jobs in the task manager.");

  // Setup Agenda
  taskManager.setupAgenda();
  console.log("Agenda plugin initialized.");
});
