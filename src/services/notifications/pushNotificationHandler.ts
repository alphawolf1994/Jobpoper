import { Platform } from "react-native";
import type { RemoteMessage } from "@react-native-firebase/messaging";
import {
  navigationRef,
  navigateFromPushPayload,
} from "@/src/navigation/navigationRef";
import { isFirebaseAvailable } from "./firebaseAvailability";

export function handleNotificationOpened(
  message: RemoteMessage | null | undefined
): void {
  if (!message) return;
  if (navigationRef.isReady()) {
    navigateFromPushPayload(message.data as Record<string, string> | undefined);
  }
}

export function registerBackgroundHandler(): void {
  if (Platform.OS === "web" || !isFirebaseAvailable()) {
    console.warn(
      "[FCM] Background handler not registered (web platform or Firebase missing)."
    );
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getMessaging, setBackgroundMessageHandler } = require(
    "@react-native-firebase/messaging"
  );
  const messaging = getMessaging();
  setBackgroundMessageHandler(messaging, async (msg: RemoteMessage) => {
    // Visible (notification+data) pushes are still drawn by the OS — this handler is mainly
    // for data-only messages and lets us verify delivery in `adb logcat` / iOS Console.
    console.log("[FCM] Background message received", {
      title: msg.notification?.title,
      body: msg.notification?.body,
      data: msg.data,
      messageId: msg.messageId,
      sentTime: msg.sentTime,
    });
  });
  console.log("[FCM] Background message handler registered.");
}
