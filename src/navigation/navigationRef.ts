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

export function navigateToOrdersScreen(): void {
  if (!navigationRef.isReady()) return;
  try {
    navigationRef.dispatch(
      CommonActions.navigate({ name: "OrdersScreen" } as any)
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
  // Order push notification → Orders Screen per the Raise-an-Order spec.
  if (type === "order_received" || navId.startsWith("order:")) {
    navigateToOrdersScreen();
    return;
  }
  // Job-related pushes (interest, started, completed, etc.) → job details when id present
  if (navId.startsWith("job:")) {
    const jobId = navId.split(":")[1];
    if (jobId) {
      try {
        navigationRef.dispatch(
          CommonActions.navigate({
            name: "JobDetailsScreen",
            params: { jobId },
          } as any)
        );
        return;
      } catch {
        // fall through
      }
    }
  }
  // Review notifications → worker's public profile (reviews tab)
  if (type === "job_review" || navId.startsWith("worker-profile:")) {
    const workerId = navId.split(":")[1];
    if (workerId) {
      try {
        navigationRef.dispatch(
          CommonActions.navigate({
            name: "WorkerProfileScreen",
            params: { workerId },
          } as any)
        );
        return;
      } catch {
        // fall through
      }
    }
  }
  navigateToNotificationScreen();
}
