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
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getMessaging, setBackgroundMessageHandler } = require(
    "@react-native-firebase/messaging"
  );
  const messaging = getMessaging();
  setBackgroundMessageHandler(messaging, async (msg: RemoteMessage) => {
    if (__DEV__) {
      console.log("[FCM] background", msg.data);
    }
  });
}
