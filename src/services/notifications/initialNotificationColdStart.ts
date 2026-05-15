/**
 * Single-shot accessor for getInitialNotification().
 *
 * `getInitialNotification` may only be consumed reliably once — RNFirebase clears
 * it after the first read on iOS. If two effects call it (e.g. FcmHandler + a
 * splash screen), one of them gets `null`. Cache the first promise so every
 * consumer gets the same value.
 *
 * Returns `null` when Firebase isn't configured or there was no launching push.
 */

import { Platform } from "react-native";
import type { RemoteMessage } from "@react-native-firebase/messaging";
import { isFirebaseAvailable } from "./firebaseAvailability";

let cached: Promise<RemoteMessage | null> | null = null;

export function getColdStartNotificationOnce(): Promise<RemoteMessage | null> {
  if (Platform.OS === "web") return Promise.resolve(null);
  if (!isFirebaseAvailable()) return Promise.resolve(null);
  if (cached) return cached;

  cached = (async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getMessaging, getInitialNotification } = require(
        "@react-native-firebase/messaging"
      );
      const messaging = getMessaging();
      const msg = (await getInitialNotification(messaging)) as RemoteMessage | null;
      if (msg) {
        console.log("[FCM] Cold-start notification:", {
          title: msg.notification?.title,
          body: msg.notification?.body,
          data: msg.data,
        });
      } else {
        console.log("[FCM] No cold-start notification.");
      }
      return msg ?? null;
    } catch (e) {
      console.warn("[FCM] getInitialNotification threw:", e);
      return null;
    }
  })();

  return cached;
}
