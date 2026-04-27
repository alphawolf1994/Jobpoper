import { Platform } from "react-native";

/**
 * True when a Firebase default app is registered (native + google services present).
 * On web, always false. Uses require so web bundles do not need native Firebase.
 */
export function isFirebaseAvailable(): boolean {
  if (Platform.OS === "web") return false;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getApps } = require("@react-native-firebase/app");
    return getApps().length > 0;
  } catch {
    return false;
  }
}
