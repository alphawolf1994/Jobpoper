import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Platform } from "react-native";
import type { RootState } from "@/src/redux/store";
import { registerDevice } from "@/src/services/devices/deviceService";

/**
 * Registers FCM device with API when user is logged in.
 * Logout unregistration runs in `logoutUser` (see authSlice) while the token is still valid.
 */
export function PushDeviceSync() {
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }
    if (accessToken && user) {
      registerDevice().catch(() => {});
    }
  }, [accessToken, user?.id]);

  return null;
}
