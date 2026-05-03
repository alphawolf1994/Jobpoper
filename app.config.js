/**
 * Extends app.json with Firebase (FCM) plugins. Keep bundle IDs in sync with Firebase console.
 * Place firebase/google-services.json and firebase/GoogleService-Info.plist, then: npx expo prebuild
 */
const withFirebaseConfig = require("./plugins/withFirebaseConfig");
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
          NSAllowsArbitraryLoads: true,
          NSAllowsLocalNetworking: true,
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
    ],
  },
};
