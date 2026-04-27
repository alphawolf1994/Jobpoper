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
    message.includes("unavailable")
  );
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
  // iOS Simulator has no APNs device token — Firebase FCM will fail with "No APNS token specified".
  if (Platform.OS === "ios" && !Device.isDevice) {
    console.warn(
      "[FCM] iOS Simulator cannot get an APNs/FCM token. Push only works on a real iPhone (and usually needs a dev build on device)."
    );
    return "";
  }
  try {
    const m = loadMessaging();
    if (Platform.OS === "android" && typeof Platform.Version === "number" && Platform.Version >= 33) {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("[FCM] Token not obtained: POST_NOTIFICATIONS permission was denied", status);
        return "";
      }
    }
    if (Platform.OS === "ios") {
      const { getMessaging, requestPermission, getToken, AuthorizationStatus } = m;
      const messaging = getMessaging();
      const status = await requestPermission(messaging);
      const ok =
        status === AuthorizationStatus.AUTHORIZED || status === AuthorizationStatus.PROVISIONAL;
      if (!ok) {
        console.warn("[FCM] Token not obtained: iOS notification permission not granted", status);
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

export async function registerDevice(
  force = false
): Promise<{ success: boolean; error?: string }> {
  if (Platform.OS === "web") {
    return { success: true };
  }
  try {
    const metadata = await getDeviceMetadata();
    if (!metadata) {
      return { success: false, error: "No device metadata" };
    }
    if (!force) {
      const need = await shouldRegisterDevice(metadata);
      if (!need) return { success: true };
    }
    await axiosInstance.post(DEVICES_PATH, metadata);
    await AsyncStorage.setItem(DEVICE_CACHE_KEY, JSON.stringify(metadata));
    if (metadata.pushNotificationToken && metadata.pushNotificationToken !== "pending") {
      console.log("[DeviceService] Device registered with backend; FCM token sent.");
    } else {
      console.warn("[DeviceService] Device registered but FCM token is missing or pending");
    }
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
    console.error("[DeviceService] registerDevice API failed:", e);
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
