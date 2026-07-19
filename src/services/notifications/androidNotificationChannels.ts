import { Platform } from "react-native";
import { isFirebaseAvailable } from "./firebaseAvailability";

export const ANDROID_CHANNEL_IDS = {
  DEFAULT: "jobpoper_default",
  JOBS: "jobpoper_jobs",
} as const;

export async function createAndroidNotificationChannels(): Promise<void> {
  if (Platform.OS !== "android") return;
  if (!isFirebaseAvailable()) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const notifee = require("@notifee/react-native").default;
    const { AndroidImportance } = require("@notifee/react-native");
    await notifee.createChannels([
      {
        id: ANDROID_CHANNEL_IDS.DEFAULT,
        name: "General",
        description: "General MakeMy Task notifications",
        importance: AndroidImportance.HIGH,
      },
      {
        id: ANDROID_CHANNEL_IDS.JOBS,
        name: "Jobs & activity",
        description: "New jobs, interest, and work updates",
        importance: AndroidImportance.HIGH,
      },
    ]);
  } catch (e) {
    if (__DEV__) {
      console.warn("[Notifications] Android channels:", e);
    }
  }
}
