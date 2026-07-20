import React, { useEffect } from "react";
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
} from "@react-native-firebase/messaging";
import type { RemoteMessage } from "@react-native-firebase/messaging";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { handleNotificationOpened } from "./pushNotificationHandler";
import { isFirebaseAvailable } from "./firebaseAvailability";
import { getColdStartNotificationOnce } from "./initialNotificationColdStart";
import { registerDevice } from "@/src/services/devices/deviceService";
import {
  addNotificationFromPush,
  getUnreadNotificationsCount,
  incrementUnreadCount,
} from "@/src/redux/slices/notificationSlice";
import {
  getUnreadOrdersCount,
  incrementUnreadOrders,
} from "@/src/redux/slices/orderSlice";
import { getUserJobs, markJobStatusLocally } from "@/src/redux/slices/jobSlice";
import type { Notification } from "@/src/interface/interfaces";
import type { AppDispatch, RootState } from "@/src/redux/store";
import {
  navigationRef,
  navigateFromPushPayload,
} from "@/src/navigation/navigationRef";

function maskToken(t: string | undefined | null): string {
  if (!t) return "(empty)";
  if (t.length <= 12) return t;
  return `${t.slice(0, 6)}…${t.slice(-6)} (len=${t.length})`;
}

function logRemoteMessage(label: string, msg: RemoteMessage) {
  console.log(`[FCM] ${label}`, {
    title: msg.notification?.title,
    body: msg.notification?.body,
    data: msg.data,
    messageId: msg.messageId,
    from: msg.from,
    sentTime: msg.sentTime,
  });
}

function makeNotification(
  data: Record<string, string> | undefined,
  title: string,
  body: string
): Notification | null {
  if (!data?.notificationId) return null;
  const t = (data.type as Notification["type"]) || "job_created";
  // Fallback chain: explicit relatedEntityType from push payload wins.
  // Otherwise infer from `type` so we don't mis-shelf entities.
  const inferredEntityType =
    t === "verification_review"
      ? "User"
      : t === "order_received"
      ? "Order"
      : t === "business_profile_review"
      ? "BusinessProfile"
      : "Job";
  const relatedEntityType =
    data.relatedEntityType || inferredEntityType;
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
  const title = remote.notification?.title ?? d?.title ?? "MakeMy Task";
  const body = remote.notification?.body ?? d?.body ?? "";
  const n = makeNotification(d, String(title), String(body));
  if (n) {
    dispatch(addNotificationFromPush(n));
    void dispatch(getUnreadNotificationsCount());
  } else {
    dispatch(incrementUnreadCount());
  }
  // For order_received pushes, also bump the order badge so the header
  // counter updates in real time. We refresh from the server to stay in
  // sync; the optimistic increment is just there for snappiness on slow
  // networks.
  const type = String(d?.type || "").toLowerCase();
  if (type === "order_received") {
    dispatch(incrementUnreadOrders());
    void dispatch(getUnreadOrdersCount());
  }
  // When a worker completes a task, refresh owner's My Tasks so status flips to
  // Completed and the Leave a Review button appears without a manual reload.
  if (type === "job_completed") {
    const jobId = String(d?.relatedEntityId || "").trim();
    if (jobId) {
      dispatch(
        markJobStatusLocally({
          jobId,
          status: "completed",
          completedAt: new Date().toISOString(),
        })
      );
    }
    void dispatch(getUserJobs());
  }
  if (type === "job_started") {
    void dispatch(getUserJobs());
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

  // Foreground messages
  useEffect(() => {
    if (!isFirebaseAvailable()) {
      console.warn("[FCM] Foreground handler skipped — Firebase not available.");
      return;
    }
    const messaging = getMessaging();
    return onMessage(messaging, (remote) => {
      logRemoteMessage("Foreground message received", remote);
      syncFromMessage(dispatch, remote);
    });
  }, [dispatch]);

  // Background -> tap opens app
  useEffect(() => {
    if (!isFirebaseAvailable()) return;
    const messaging = getMessaging();
    const offOpen = onNotificationOpenedApp(messaging, (msg) => {
      logRemoteMessage("Notification opened (from background)", msg);
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

  // Cold-start: app launched by a notification tap (state was "killed")
  useEffect(() => {
    if (!isFirebaseAvailable()) return;
    getColdStartNotificationOnce().then((msg) => {
      if (!msg) return;
      logRemoteMessage("Cold-start notification consumed", msg);
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

  // Token refresh — runs regardless of auth state so a token that rotates
  // before login is still captured. registerDevice() handles "no auth yet"
  // by short-circuiting (axios will 401 and we surface it in the log).
  useEffect(() => {
    if (!isFirebaseAvailable()) return;
    const messaging = getMessaging();
    return onTokenRefresh(messaging, (newToken) => {
      console.log("[FCM] onTokenRefresh ->", maskToken(newToken));
      if (!newToken) {
        console.warn("[FCM] onTokenRefresh fired with empty token");
        return;
      }
      // We may not yet have an access token if this fires very early; pass force=true
      // so a real change triggers a POST as soon as auth is available.
      registerDevice(true)
        .then((r) => console.log("[FCM] registerDevice after token refresh:", r))
        .catch((err) => console.error("[FCM] registerDevice after token refresh failed:", err));
    });
  }, [userId]);

  return null;
};
