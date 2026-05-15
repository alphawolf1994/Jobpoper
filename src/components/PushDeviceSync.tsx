import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Platform } from "react-native";
import type { RootState } from "@/src/redux/store";
import { registerDevice } from "@/src/services/devices/deviceService";

/**
 * Registers FCM device with API when user is logged in.
 * Logout unregistration runs in `logoutUser` (see authSlice) while the token is still valid.
 *
 * Uses `force=true` so the backend always sees the *currently* logged-in user on this
 * physical device (the device row is upserted by (user, deviceId), and the backend now
 * deactivates other users' rows sharing the same deviceId). Without force, the per-payload
 * cache could short-circuit and leave a stale `isActive` mapping on the server.
 */
export function PushDeviceSync() {
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => {
    if (Platform.OS === "web") return;
    if (!accessToken || !user) return;
    console.log("[PushDeviceSync] auth changed -> forcing device register for user:", user?.id);
    registerDevice(true)
      .then((r) => console.log("[PushDeviceSync] registerDevice result:", r))
      .catch((e) => console.warn("[PushDeviceSync] registerDevice threw:", e));
  }, [accessToken, user?.id]);

  return null;
}
