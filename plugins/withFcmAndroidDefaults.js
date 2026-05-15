/**
 * Expo config plugin: injects Firebase Messaging default channel/icon/color meta-data
 * into AndroidManifest.xml during `expo prebuild`, so the manifest survives
 * `expo prebuild --clean`.
 *
 * Pairs with `createAndroidNotificationChannels()` on the client which creates
 * the `jobpoper_default` and `jobpoper_jobs` channels on first launch.
 *
 * Replace `@mipmap/ic_launcher` with a true monochrome silhouette drawable
 * (e.g. `@drawable/ic_notification`) once you have one — Android tints the icon
 * automatically and coloured icons render as a white square on API 21+.
 */

const { withAndroidManifest } = require("expo/config-plugins");

const DEFAULT_CHANNEL_ID = "jobpoper_default";
const DEFAULT_ICON = "@mipmap/ic_launcher";
const DEFAULT_COLOR = "@android:color/holo_blue_light";

// `@react-native-firebase/messaging`'s library manifest already declares
// `default_notification_channel_id` and `default_notification_color` (via
// `${firebaseJson…}` placeholders). Overriding them here REQUIRES the
// `tools:replace` attribute or the Android manifest merger will fail with
// "Attribute meta-data#…@value value=(...) … is also present at [library:…]".
// `default_notification_icon` is NOT declared by the library, so no replace needed.
const META_ENTRIES = [
  {
    name: "com.google.firebase.messaging.default_notification_channel_id",
    valueKey: "android:value",
    value: DEFAULT_CHANNEL_ID,
    needsToolsReplace: true,
  },
  {
    name: "com.google.firebase.messaging.default_notification_icon",
    valueKey: "android:resource",
    value: DEFAULT_ICON,
    needsToolsReplace: false,
  },
  {
    name: "com.google.firebase.messaging.default_notification_color",
    valueKey: "android:resource",
    value: DEFAULT_COLOR,
    needsToolsReplace: true,
  },
];

function ensureToolsNamespace(manifest) {
  manifest.$ = manifest.$ || {};
  if (!manifest.$["xmlns:tools"]) {
    manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
  }
}

function upsertMetaData(application, entry) {
  application["meta-data"] = application["meta-data"] || [];
  const existing = application["meta-data"].find(
    (m) => m?.$?.["android:name"] === entry.name
  );
  const attrs = {
    "android:name": entry.name,
    [entry.valueKey]: entry.value,
  };
  if (entry.needsToolsReplace) {
    attrs["tools:replace"] = entry.valueKey;
  }
  if (existing) {
    Object.assign(existing.$, attrs);
    return;
  }
  application["meta-data"].push({ $: attrs });
}

function withFcmAndroidDefaults(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults?.manifest;
    const application = manifest?.application?.[0];
    if (!application) {
      console.warn("[withFcmAndroidDefaults] No <application> in AndroidManifest — skipping.");
      return cfg;
    }
    ensureToolsNamespace(manifest);
    for (const entry of META_ENTRIES) {
      upsertMetaData(application, entry);
    }
    console.log(
      "[withFcmAndroidDefaults] Injected FCM default channel/icon/color meta-data (with tools:replace where required)."
    );
    return cfg;
  });
}

module.exports = withFcmAndroidDefaults;
