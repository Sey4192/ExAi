import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { loadHistory } from "../storage/storage";
import { planEveningReminders } from "./notifications";
 
const TASK = "replan-reminders";
 
// Must be defined at module scope, before the app renders.
TaskManager.defineTask(TASK, async () => {
  try {
    await planEveningReminders(await loadHistory());
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});
 
export async function registerBackgroundTask() {
  if (!(await TaskManager.isTaskRegisteredAsync(TASK))) {
    await BackgroundTask.registerTaskAsync(TASK, { minimumInterval: 60 });
  }
}
