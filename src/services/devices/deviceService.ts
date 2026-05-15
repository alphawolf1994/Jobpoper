import { Platform, PermissionsAndroid } from "react-native";
import * as Device from "expo-device";
import * as Application from "expo-application";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/src/api/axiosInstance";
import { isFirebaseAvailable } from "@/src/services/notifications/firebaseAvailability";

const DEVICE_ID_KEY = "@jobpoper_device_id";
const DEVICE_CACHE_KEY = "@jobpoper_device_cache";
// With axios baseURL `http://host:port/api`, paths like `/auth/me` resolve to `http://host:port/auth/me` (no /api).
// So use `/devices` → `http://host:port/devices`, matching other APIs. `/api/devices` would only work if mounted.
const DEVICES_PATH = "/devices";

export interface DeviceRegistrationPayload {
  deviceId: string;
  deviceName: string;
  platform: string;
  osVersion: string;
  appVersion: string;
  pushNotificationToken: string;
}

async function getOrCreateDeviceId(): Promise<string> {
  if (Platform.OS === "web") {
    return "web";
  }
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function loadMessaging() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@react-native-firebase/messaging");
}

/** Same strategy as Receni: Google Play can return SERVICE_NOT_AVAILABLE on first getToken. */
const FCM_RETRY_ATTEMPTS = 3;
const FCM_RETRY_DELAY_MS = 2500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientFcmError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("SERVICE_NOT_AVAILABLE") ||
    message.includes("java.io.IOException") ||
    message.includes("java.util.concurrent") ||
    message.includes("TIMEOUT") ||
    message.includes("Network") ||
    message.includes("unavailable") ||
    // iOS race: APNs handshake hasn't delivered the device token yet.
    // Retrying after a short delay normally resolves it once registerDeviceForRemoteMessages completes.
    message.includes("No APNS token specified") ||
    message.includes("APNS token") ||
    message.toLowerCase().includes("apns")
  );
}

/**
 * Wait for iOS to deliver the APNs device token after registerDeviceForRemoteMessages().
 * On a real device this normally completes in <1s. On the iOS Simulator it requires:
 *   • Apple-Silicon Mac, macOS 13+, Xcode 14+, Simulator running iOS 16+
 *   • A signed-in Apple ID in the Simulator's Settings app
 *   • Internet connectivity from the Mac to APNs
 * If the token never arrives we return null so the caller can skip cleanly.
 */
async function waitForApnsToken(
  getAPNSToken: (m: any) => Promise<string | null>,
  messaging: any,
  totalTimeoutMs = 15000,
  pollMs = 500
): Promise<string | null> {
  const start = Date.now();
  let lastLogAt = 0;
  while (Date.now() - start < totalTimeoutMs) {
    try {
      const t = await getAPNSToken(messaging);
      if (t) {
        const elapsed = Date.now() - start;
        console.log(
          `[FCM] APNs device token acquired after ${elapsed}ms:`,
          `${t.slice(0, 8)}…${t.slice(-6)} (len=${t.length})`
        );
        return t;
      }
    } catch (e) {
      // getAPNSToken can throw "No APNS token" on some RNFB versions — treat as "not ready yet"
      const msg = e instanceof Error ? e.message : String(e);
      const now = Date.now();
      if (now - lastLogAt > 2000) {
        console.log("[FCM] Waiting for APNs token… last error:", msg);
        lastLogAt = now;
      }
    }
    await delay(pollMs);
  }
  console.warn(
    "[FCM] APNs token never arrived within " +
      totalTimeoutMs +
      "ms. Most common causes:\n" +
      "  • iOS Simulator on Intel Mac, macOS <13, Xcode <14, or iOS <16 — APNs not supported.\n" +
      "  • Simulator has no Apple ID signed in (Settings → Sign in to your iPhone).\n" +
      "  • Wrong aps-environment for the build (dev profile + production entitlement, or vice versa).\n" +
      "  • App ID missing 'Push Notifications' capability in Apple Developer.\n" +
      "  • No network access from the Mac to APNs (api.push.apple.com)."
  );
  return null;
}

/**
 * Fetches FCM token with retries (Android + iOS) — mirrors Receni deviceService.
 */
async function fetchFcmTokenWithRetry(
  getToken: (m: ReturnType<ReturnType<typeof loadMessaging>["getMessaging"]>) => Promise<string>,
  messaging: ReturnType<ReturnType<typeof loadMessaging>["getMessaging"]>,
  label: "iOS" | "Android"
): Promise<string> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= FCM_RETRY_ATTEMPTS; attempt++) {
    try {
      const token = (await getToken(messaging)) || "";
      if (token) {
        console.log(`[FCM] FCM registration token (${label}):`, token);
        return token;
      }
      if (attempt < FCM_RETRY_ATTEMPTS) {
        console.log(`[FCM] getToken empty (attempt ${attempt}/${FCM_RETRY_ATTEMPTS}), retrying...`);
        await delay(FCM_RETRY_DELAY_MS);
      } else {
        console.warn(`[FCM] getToken returned empty after ${FCM_RETRY_ATTEMPTS} attempts (${label})`);
      }
    } catch (error) {
      lastError = error;
      console.log(
        `[FCM] getToken failed (attempt ${attempt}/${FCM_RETRY_ATTEMPTS}):`,
        error instanceof Error ? error.message : error
      );
      if (attempt < FCM_RETRY_ATTEMPTS && isTransientFcmError(error)) {
        console.log(`[FCM] Retrying in ${FCM_RETRY_DELAY_MS}ms (transient FCM error)...`);
        await delay(FCM_RETRY_DELAY_MS);
      } else {
        break;
      }
    }
  }
  if (lastError) {
    console.error("[FCM] Giving up on FCM token after retries.", lastError);
  }
  return "";
}

async function getFcmToken(): Promise<string> {
  if (Platform.OS === "web") {
    console.log("[FCM] Skipping token: web platform");
    return "";
  }
  if (!isFirebaseAvailable()) {
    console.warn(
      "[FCM] Skipping token: Firebase not configured (add firebase/ plist + json, then prebuild & rebuild)"
    );
    return "";
  }
  try {
    const m = loadMessaging();
    if (Platform.OS === "android" && typeof Platform.Version === "number" && Platform.Version >= 33) {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log("[FCM] Android POST_NOTIFICATIONS request result:", status);
      if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("[FCM] Token not obtained: POST_NOTIFICATIONS permission was denied", status);
        return "";
      }
    }
    if (Platform.OS === "ios") {
      const {
        getMessaging,
        requestPermission,
        registerDeviceForRemoteMessages,
        getAPNSToken,
        getToken,
        AuthorizationStatus,
      } = m;
      const messaging = getMessaging();
      const status = await requestPermission(messaging);
      console.log("[FCM] iOS requestPermission result:", status);
      const ok =
        status === AuthorizationStatus.AUTHORIZED || status === AuthorizationStatus.PROVISIONAL;
      if (!ok) {
        console.warn("[FCM] Token not obtained: iOS notification permission not granted", status);
        return "";
      }
      // Kick off the APNs handshake. With RNFirebase's auto-register enabled this is a no-op
      // (you'll see the harmless "Usage of registerDeviceForRemoteMessages is not required"
      // warning), but calling it explicitly is safe and idempotent.
      try {
        await registerDeviceForRemoteMessages(messaging);
        console.log("[FCM] iOS registerDeviceForRemoteMessages OK");
      } catch (e) {
        console.warn(
          "[FCM] iOS registerDeviceForRemoteMessages failed (continuing — token call may still work):",
          e instanceof Error ? e.message : e
        );
      }
      if (!Device.isDevice) {
        console.log(
          "[FCM] iOS Simulator detected — waiting for APNs token. " +
            "Requires iOS 16+ Simulator on macOS 13+ Apple Silicon (Xcode 14+)."
        );
      }
      // CRITICAL: wait for the OS to actually deliver the APNs device token via
      // application(_:didRegisterForRemoteNotificationsWithDeviceToken:). Without this,
      // getToken() races the handshake and throws "No APNS token specified before fetching FCM Token".
      const apns = await waitForApnsToken(getAPNSToken, messaging);
      if (!apns) {
        console.warn(
          "[FCM] Skipping getToken() — no APNs device token. App-triggered push will not work " +
            "on this build until APNs is available. In-app notifications still work."
        );
        return "";
      }
      return await fetchFcmTokenWithRetry(getToken, messaging, "iOS");
    }
    const { getMessaging, getToken } = m;
    const messaging = getMessaging();
    return await fetchFcmTokenWithRetry(getToken, messaging, "Android");
  } catch (e) {
    console.error("[FCM] Error getting FCM token:", e);
    return "";
  }
}

export async function getDeviceMetadata(): Promise<DeviceRegistrationPayload | null> {
  if (Platform.OS === "web") {
    return null;
  }
  try {
    const deviceId = await getOrCreateDeviceId();
    const deviceName = Device.modelName || Device.deviceName || "Device";
    const isIos = Platform.OS === "ios";
    const osVersion = Device.osVersion || String(Platform.Version);
    const appVersion = Application.nativeApplicationVersion || "1.0.0";
    let pushToken = "";
    try {
      pushToken = await getFcmToken();
    } catch (e) {
      console.error("[FCM] getDeviceMetadata / getFcmToken failed:", e);
      pushToken = "";
    }
    return {
      deviceId,
      deviceName,
      platform: isIos ? "iOS" : "Android",
      osVersion,
      appVersion,
      pushNotificationToken: pushToken || "pending",
    };
  } catch (e) {
    console.error("[DeviceService] getDeviceMetadata failed:", e);
    return null;
  }
}

export async function shouldRegisterDevice(
  latest: DeviceRegistrationPayload
): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }
  const raw = await AsyncStorage.getItem(DEVICE_CACHE_KEY);
  if (!raw) return true;
  try {
    const cached = JSON.parse(raw) as DeviceRegistrationPayload;
    return (
      cached.pushNotificationToken !== latest.pushNotificationToken ||
      cached.appVersion !== latest.appVersion ||
      cached.osVersion !== latest.osVersion
    );
  } catch {
    return true;
  }
}

// Single in-flight retry timer for "token wasn't ready yet" so we don't pile up retries
// when registerDevice is called multiple times before the first attempt resolves.
let pendingTokenRetryHandle: ReturnType<typeof setTimeout> | null = null;

function maskToken(t: string | undefined | null): string {
  if (!t) return "(empty)";
  if (t === "pending") return "pending";
  if (t.length <= 12) return t;
  return `${t.slice(0, 6)}…${t.slice(-6)} (len=${t.length})`;
}

export async function registerDevice(
  force = false
): Promise<{ success: boolean; error?: string }> {
  if (Platform.OS === "web") {
    return { success: true };
  }
  try {
    const metadata = await getDeviceMetadata();
    if (!metadata) {
      console.warn("[DeviceService] No device metadata — skipping register");
      return { success: false, error: "No device metadata" };
    }

    const tokenReady =
      !!metadata.pushNotificationToken && metadata.pushNotificationToken !== "pending";

    console.log("[DeviceService] registerDevice attempt:", {
      force,
      deviceId: metadata.deviceId,
      platform: metadata.platform,
      tokenReady,
      tokenPreview: maskToken(metadata.pushNotificationToken),
    });

    // If the FCM token isn't ready yet (first launch / slow Play Services / Simulator) DO NOT POST
    // — the backend would store "" and the recipient filter (`pushNotificationToken != ""`) would
    // exclude this device. Schedule one delayed retry so the first login still gets through quickly,
    // and rely on onTokenRefresh to push the real token later.
    if (!tokenReady) {
      console.warn(
        "[DeviceService] Push token not ready (=" +
          maskToken(metadata.pushNotificationToken) +
          ") — skipping POST and scheduling a single retry in 5s."
      );
      if (pendingTokenRetryHandle) clearTimeout(pendingTokenRetryHandle);
      pendingTokenRetryHandle = setTimeout(() => {
        pendingTokenRetryHandle = null;
        registerDevice(true)
          .then((r) => console.log("[DeviceService] Delayed retry result:", r))
          .catch((e) => console.warn("[DeviceService] Delayed retry failed:", e));
      }, 5000);
      return { success: false, error: "Token not ready" };
    }

    if (!force) {
      const need = await shouldRegisterDevice(metadata);
      if (!need) {
        console.log("[DeviceService] Cache unchanged — not re-registering.");
        return { success: true };
      }
    }

    const response = await axiosInstance.post(DEVICES_PATH, metadata);
    await AsyncStorage.setItem(DEVICE_CACHE_KEY, JSON.stringify(metadata));
    console.log(
      "[DeviceService] Device registered OK (HTTP " +
        (response?.status ?? "?") +
        ") token=" +
        maskToken(metadata.pushNotificationToken)
    );
    return { success: true };
  } catch (e: unknown) {
    const err = e as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };
    const status = err?.response?.status;
    if (status === 404) {
      console.error(
        "[DeviceService] POST /devices returned 404. Redeploy jobpoper_backend with app.use('/devices', devicesRouter) (and pull latest), then restart."
      );
    }
    const message =
      err?.response?.data?.message || err?.message || "Device registration failed";
    console.error("[DeviceService] registerDevice API failed:", {
      status,
      message,
      data: err?.response?.data,
    });
    return { success: false, error: message };
  }
}

export async function unregisterCurrentDevice(): Promise<{
  success: boolean;
  error?: string;
}> {
  if (Platform.OS === "web") {
    return { success: true };
  }
  const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    return { success: true };
  }
  try {
    await axiosInstance.delete(`${DEVICES_PATH}/${encodeURIComponent(deviceId)}`);
    await AsyncStorage.removeItem(DEVICE_CACHE_KEY);
    return { success: true };
  } catch (e: unknown) {
    console.error("[DeviceService] unregisterCurrentDevice failed:", e);
    const err = e as { message?: string };
    return { success: false, error: err?.message || "Unregister failed" };
  }
}
