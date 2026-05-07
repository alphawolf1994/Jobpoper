/**
 * Extends app.json with Firebase (FCM) plugins. Keep bundle IDs in sync with Firebase console.
 * Place firebase/google-services.json and firebase/GoogleService-Info.plist, then: npx expo prebuild
 */
const withFirebaseConfig = require("./plugins/withFirebaseConfig");
const withAndroidCleartext = require("./plugins/withAndroidCleartext");
const appJson = require("./app.json");

module.exports = {
  expo: {
    ...appJson.expo,
    ios: {
      ...appJson.expo.ios,
      googleServicesFile: "./firebase/GoogleService-Info.plist",
      entitlements: {
        "aps-environment": "development",
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
    ],
  },
};
