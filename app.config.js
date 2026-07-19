/**
 * Extends app.json with Firebase (FCM) plugins. Keep bundle IDs in sync with Firebase console.
 * Place firebase/google-services.json and firebase/GoogleService-Info.plist, then: npx expo prebuild
 *
 * APNs environment:
 *   `aps-environment` MUST be `production` for App Store / TestFlight builds, otherwise
 *   iOS push notifications silently fail in production. For Xcode debug runs (development
 *   provisioning profile) it MUST be `development` or APNs registration will silently fail
 *   on the device. Default rules (override any time with APS_ENVIRONMENT=production|development):
 *     - APS_ENVIRONMENT set explicitly  → that value
 *     - EAS / NODE_ENV=production       → "production"
 *     - everything else (dev / debug)   → "development"
 *   Re-run `npx expo prebuild --clean` after changing this so the .entitlements file picks it up.
 */
const withFirebaseConfig = require("./plugins/withFirebaseConfig");
const withAndroidCleartext = require("./plugins/withAndroidCleartext");
const withAndroidReleaseSigning = require("./plugins/withAndroidReleaseSigning");
const withFcmAndroidDefaults = require("./plugins/withFcmAndroidDefaults");
const appJson = require("./app.json");

const APS_ENVIRONMENT = (() => {
  const explicit = process.env.APS_ENVIRONMENT;
  if (explicit === "production" || explicit === "development") return explicit;
  if (process.env.NODE_ENV === "production" || process.env.EAS_BUILD_PROFILE === "production") {
    return "production";
  }
  return "development";
})();
console.log(`[app.config] aps-environment = ${APS_ENVIRONMENT}`);

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
          "We send notifications for jobs, interest, and important updates on MakeMy Task.",
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
      withFcmAndroidDefaults,
    ],
  },
};
