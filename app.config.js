/**
 * Extends app.json with Firebase (FCM) plugins. Keep bundle IDs in sync with Firebase console.
 * Place firebase/google-services.json and firebase/GoogleService-Info.plist, then: npx expo prebuild
 *
 * APNs environment:
 *   `aps-environment` MUST be `production` for App Store / TestFlight builds, otherwise
 *   iOS push notifications silently fail in production. The default below is `production`.
 *   For a local debug build that needs notifications, run with:
 *     APS_ENVIRONMENT=development npx expo prebuild --clean
 *   then `expo run:ios`. Re-prebuild without the env var before shipping to the store.
 */
const withFirebaseConfig = require("./plugins/withFirebaseConfig");
const withAndroidCleartext = require("./plugins/withAndroidCleartext");
const withAndroidReleaseSigning = require("./plugins/withAndroidReleaseSigning");
const appJson = require("./app.json");

const APS_ENVIRONMENT =
  process.env.APS_ENVIRONMENT === "development" ? "development" : "production";

module.exports = {
  expo: {
    ...appJson.expo,
    ios: {
      ...appJson.expo.ios,
      googleServicesFile: "./firebase/GoogleService-Info.plist",
      entitlements: {
        "aps-environment": APS_ENVIRONMENT,
      },
      infoPlist: {
        ...appJson.expo.ios?.infoPlist,
        NSAppTransportSecurity: {
          // IMPORTANT: do NOT also set NSAllowsLocalNetworking, NSExceptionDomains,
          // NSAllowsArbitraryLoadsForMedia, or NSAllowsArbitraryLoadsInWebContent.
          // Per Apple's ATS rules, any of those keys cause iOS to IGNORE
          // NSAllowsArbitraryLoads (treated as false) — which blocks HTTP to
          // non-local addresses (e.g. your live API URL).
          NSAllowsArbitraryLoads: true,
        },
        NSUserNotificationsUsageDescription:
          "We send notifications for jobs, interest, and important updates on JobPoper.",
        // Required so FCM can deliver background/data messages to the app while it
        // is suspended. Without this, setBackgroundMessageHandler never fires and
        // silent / data-only pushes are dropped on iOS.
        UIBackgroundModes: [
          ...((appJson.expo.ios?.infoPlist || {}).UIBackgroundModes || []),
          "remote-notification",
          "fetch",
        ],
      },
    },
    android: {
      ...appJson.expo.android,
      googleServicesFile: "./firebase/google-services.json",
      permissions: [
        ...((appJson.expo.android && appJson.expo.android.permissions) || []),
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "POST_NOTIFICATIONS",
      ],
    },
    plugins: [
      ...((appJson.expo && appJson.expo.plugins) || []),
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      ["expo-build-properties", { ios: { useFrameworks: "static" } }],
      withFirebaseConfig,
      withAndroidCleartext,
      withAndroidReleaseSigning,
    ],
  },
};
