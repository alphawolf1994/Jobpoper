import React, { useEffect } from "react";
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  onTokenRefresh,
} from "@react-native-firebase/messaging";
import type { RemoteMessage } from "@react-native-firebase/messaging";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { handleNotificationOpened } from "./pushNotificationHandler";
import { isFirebaseAvailable } from "./firebaseAvailability";
import { registerDevice } from "@/src/services/devices/deviceService";
import {
  addNotificationFromPush,
  getUnreadNotificationsCount,
  incrementUnreadCount,
} from "@/src/redux/slices/notificationSlice";
import type { Notification } from "@/src/interface/interfaces";
import type { AppDispatch, RootState } from "@/src/redux/store";
import {
  navigationRef,
  navigateFromPushPayload,
} from "@/src/navigation/navigationRef";

function makeNotification(
  data: Record<string, string> | undefined,
  title: string,
  body: string
): Notification | null {
  if (!data?.notificationId) return null;
  const t = (data.type as Notification["type"]) || "job_created";
  const relatedEntityType =
    data.relatedEntityType ||
    (t === "verification_review" ? "User" : "Job");
  return {
    _id: data.notificationId,
    recipient: "",
    type: t,
    title,
    message: body,
    relatedEntityType,
    relatedEntityId: data.relatedEntityId || data.notificationId,
    navigationIdentifier: data.navigationIdentifier || "job:unknown",
    isRead: false,
    readAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function syncFromMessage(dispatch: AppDispatch, remote: RemoteMessage) {
  const d = remote.data as Record<string, string> | undefined;
  const title = remote.notification?.title ?? d?.title ?? "JobPoper";
  const body = remote.notification?.body ?? d?.body ?? "";
  const n = makeNotification(d, String(title), String(body));
  if (n) {
    dispatch(addNotificationFromPush(n));
    void dispatch(getUnreadNotificationsCount());
  } else {
    dispatch(incrementUnreadCount());
  }
  Toast.show({
    type: "info",
    text1: String(title),
    text2: String(body) || " ",
    visibilityTime: 5000,
  });
}

export const FcmHandler: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((s: RootState) => s.auth.user?.id);

  useEffect(() => {
    if (!isFirebaseAvailable()) {
      return;
    }
    const messaging = getMessaging();
    return onMessage(messaging, (remote) => {
      syncFromMessage(dispatch, remote);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!isFirebaseAvailable()) return;
    const messaging = getMessaging();
    const offOpen = onNotificationOpenedApp(messaging, (msg) => {
      const d = msg.data as Record<string, string> | undefined;
      if (d?.notificationId) {
        const n = makeNotification(
          d,
          msg.notification?.title ?? d?.title ?? "Notification",
          msg.notification?.body ?? d?.body ?? ""
        );
        if (n) dispatch(addNotificationFromPush(n));
      }
      if (navigationRef.isReady()) {
        navigateFromPushPayload(d);
      } else {
        handleNotificationOpened(msg);
      }
    });
    return offOpen;
  }, [dispatch]);

  useEffect(() => {
    if (!isFirebaseAvailable()) return;
    const messaging = getMessaging();
    getInitialNotification(messaging).then((msg) => {
      if (!msg) return;
      const d = msg.data as Record<string, string> | undefined;
      if (d?.notificationId) {
        const n = makeNotification(
          d,
          msg.notification?.title ?? d?.title ?? "Notification",
          msg.notification?.body ?? d?.body ?? ""
        );
        if (n) dispatch(addNotificationFromPush(n));
      }
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigateFromPushPayload(d);
        } else {
          handleNotificationOpened(msg);
        }
      }, 500);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!isFirebaseAvailable() || !userId) return;
    const messaging = getMessaging();
    return onTokenRefresh(messaging, (newToken) => {
      if (newToken) {
        console.log("[FCM] Token refreshed; new FCM registration token:", newToken);
      } else {
        console.warn("[FCM] onTokenRefresh fired with empty token");
      }
      registerDevice(true).catch((err) => {
        console.error("[FCM] registerDevice after token refresh failed:", err);
      });
    });
  }, [userId]);

  return null;
};
