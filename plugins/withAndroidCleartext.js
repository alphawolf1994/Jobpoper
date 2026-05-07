/**
 * Expo config plugin: ensure android:usesCleartextTraffic="true" is set on
 * the <application> tag in AndroidManifest.xml so the app can talk to plain
 * HTTP endpoints (localhost dev server, internal IPs, etc.).
 *
 * Why this exists:
 *   The `expo.android.usesCleartextTraffic` schema field in app.json is
 *   inconsistent across Expo SDK versions and sometimes silently dropped
 *   from the generated manifest. This plugin guarantees the attribute is
 *   always present after `npx expo prebuild`.
 *
 * NEVER edit android/app/src/main/AndroidManifest.xml by hand — that file
 * is regenerated from app.config.js + plugins on every prebuild.
 */
const { withAndroidManifest } = require("expo/config-plugins");

function withAndroidCleartext(config) {
  return withAndroidManifest(config, async (config) => {
    const application = config.modResults.manifest.application?.[0];
    if (!application) {
      console.warn("[withAndroidCleartext] No <application> tag found — skipping.");
      return config;
    }
    application.$["android:usesCleartextTraffic"] = "true";
    console.log("[withAndroidCleartext] Set android:usesCleartextTraffic=\"true\"");
    return config;
  });
}

module.exports = withAndroidCleartext;
