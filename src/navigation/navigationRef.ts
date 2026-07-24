import {
  createNavigationContainerRef,
  CommonActions,
} from "@react-navigation/native";
import type { ParamListBase } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<ParamListBase>();

/** Pending cold-start / early push deep-link waiting for boot to finish. */
let pendingPushData: Record<string, string> | undefined;

const BOOT_ROUTES = new Set([
  "SplashScreen",
  "IntroScreen",
  "LoginScreen",
  "SignupPhoneScreen",
  "Register",
  "PhoneVerificationScreen",
  "OTP",
  "CreatePinScreen",
  "ForgotPinScreen",
  "VerifyOtpScreen",
  "CreateNewPinScreen",
  "BasicProfileScreen",
]);

function isBootRoute(name?: string | null): boolean {
  return !name || BOOT_ROUTES.has(name);
}

/** Hard-logout: reset the stack to the Login screen, flagging that the
 *  account was blocked so LoginScreen can surface the blocked modal. */
export function resetToLoginBlocked(): void {
  if (!navigationRef.isReady()) return;
  try {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen", params: { blocked: true } }],
      } as any)
    );
  } catch {
    // no-op
  }
}

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

/**
 * Queue a push deep-link until splash/auth has left the boot stack.
 * Prevents JobDetails → Home bounce on cold start (Splash later navigates HomeTabs).
 */
export function queuePushNavigation(
  data: Record<string, string> | undefined
): void {
  if (!data) return;
  pendingPushData = data;
  tryFlushPendingPushNavigation();
}

/** Call after Splash (or any auth gate) lands on HomeTabs / AdminTabs. */
export function tryFlushPendingPushNavigation(): void {
  if (!pendingPushData || !navigationRef.isReady()) return;
  const current = navigationRef.getCurrentRoute()?.name;
  if (isBootRoute(current)) return;
  const data = pendingPushData;
  pendingPushData = undefined;
  navigateFromPushPayload(data);
}

/** Deep link from FCM `data` when user taps a notification. */
export function navigateFromPushPayload(
  data: Record<string, string> | undefined
): void {
  if (!navigationRef.isReady()) return;

  // If we're still on splash/login, queue instead of navigating into a screen
  // that Splash will immediately overwrite with HomeTabs.
  const current = navigationRef.getCurrentRoute()?.name;
  if (isBootRoute(current)) {
    queuePushNavigation(data);
    return;
  }

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
  // Job-related pushes → reset stack so JobDetails sits on top of HomeTabs
  // (stable back button, no bounce from a later boot navigate).
  if (navId.startsWith("job:")) {
    const jobId = navId.split(":")[1];
    if (jobId) {
      try {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: "HomeTabs" },
              { name: "JobDetailsScreen", params: { jobId } },
            ],
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
          CommonActions.reset({
            index: 1,
            routes: [
              { name: "HomeTabs" },
              { name: "WorkerProfileScreen", params: { workerId } },
            ],
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
