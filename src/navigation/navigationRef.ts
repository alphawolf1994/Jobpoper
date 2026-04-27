import {
  createNavigationContainerRef,
  CommonActions,
} from "@react-navigation/native";
import type { ParamListBase } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<ParamListBase>();

export function navigateToNotificationScreen(): void {
  if (!navigationRef.isReady()) return;
  try {
    navigationRef.dispatch(
      CommonActions.navigate({ name: "NotificationScreen" } as any)
    );
  } catch {
    // no-op
  }
}

/** Deep link from FCM `data` when user taps a notification. */
export function navigateFromPushPayload(
  data: Record<string, string> | undefined
): void {
  if (!navigationRef.isReady()) return;
  const navId = data?.navigationIdentifier || "";
  const type = (data?.type || "").toLowerCase();
  if (type === "verification_review" || navId.startsWith("verification:")) {
    try {
      navigationRef.dispatch(
        CommonActions.navigate({ name: "VerificationDetailsScreen" } as any)
      );
      return;
    } catch {
      // fall through
    }
  }
  navigateToNotificationScreen();
}
