import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
 
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
 
export async function enableReminders() {
  const { granted } = await Notifications.requestPermissionsAsync();
  if (!granted) return false;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("checkins", {
      name: "Check-ins",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return true;
}
 
async function cancelKind(kind) {
  const pending = await Notifications.getAllScheduledNotificationsAsync();
  const mine = pending.filter((n) => n.content.data?.kind === kind);
  await Promise.all(mine.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}
 
// One-off 8 PM reminders for the next three days; skip today after a check-in.
export async function planEveningReminders(history) {
  await cancelKind("evening");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkedInToday = history.some((h) => h.timestamp >= today.getTime());
 
  for (let day = 0; day < 3; day++) {
    const when = new Date();
    when.setDate(when.getDate() + day);
    when.setHours(20, 0, 0, 0);
    if (when <= new Date() || (day === 0 && checkedInToday)) continue;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "How was today?",
        body: "Got a minute? Let's look at how your day on your phone went.",
        data: { kind: "evening", screen: "Check" },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: "checkins" },
    });
  }
}
 
export async function scheduleFollowUp() {
  await cancelKind("follow-up");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "How are you doing?",
      body: "That last session was a heavy one. How are you feeling now?",
      data: { kind: "follow-up", screen: "Home" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2 * 60 * 60,
      channelId: "checkins",
    },
  });
}
// Sends one notification a few seconds from now, to check reminders work.
export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "This is how I'll check in",
      body: "Gentle, quiet, and only as often as you choose.",
      data: { screen: "Home" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: "checkins",
    },
  });
}
