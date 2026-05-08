/**
 * Expo config plugin: Play Store release signing for Android.
 * Survives `expo prebuild --clean` because it runs on every prebuild.
 *
 * What it does on every prebuild:
 *   1. Copies `jobpoper_key.jks` from project root → `android/app/jobpoper_key.jks`.
 *   2. Reads `android-keystore.properties` from project root (you create this once).
 *   3. Patches `android/app/build.gradle` with a release signingConfig that uses
 *      those credentials.
 *
 * Setup (one-time, on each developer's machine):
 *   - Copy `android-keystore.properties.example` → `android-keystore.properties`
 *   - Fill in your real storePassword, keyAlias, keyPassword
 *   - That file is gitignored — never commit it
 *   - Place `jobpoper_key.jks` at project root (already gitignored via *.jks)
 *
 * After setup: just run `npx expo prebuild --clean` and signing is configured.
 *
 * Fallback: if android-keystore.properties is missing but env vars are set
 *   (JOBPOPER_KEYSTORE_PASSWORD, JOBPOPER_KEY_ALIAS, JOBPOPER_KEY_PASSWORD),
 *   gradle reads them via System.getenv(). Useful for CI / EAS Build.
 *
 * If neither exist, release falls back to debug signing (won't work for Play Store
 * but keeps `expo run:android` working locally).
 */
const fs = require("fs");
const path = require("path");
const { withDangerousMod, withAppBuildGradle } = require("expo/config-plugins");

const KEYSTORE_FILENAME = "jobpoper_key.jks";
const PROPS_FILENAME = "android-keystore.properties";

/** Parse a simple .properties file (key=value lines, # comments). */
function parseProperties(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith("!")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    out[key] = value;
  }
  return out;
}

function loadKeystoreProps(projectRoot) {
  const propsPath = path.join(projectRoot, PROPS_FILENAME);
  if (!fs.existsSync(propsPath)) return null;
  try {
    const props = parseProperties(fs.readFileSync(propsPath, "utf8"));
    if (!props.storePassword || !props.keyAlias) {
      console.warn(
        `[withAndroidReleaseSigning] ${PROPS_FILENAME} is missing required fields (storePassword, keyAlias).`
      );
      return null;
    }
    return props;
  } catch (e) {
    console.warn(`[withAndroidReleaseSigning] Failed to read ${PROPS_FILENAME}:`, e.message);
    return null;
  }
}

/** Escape a string for safe inclusion inside a Groovy single-quoted string. */
function groovyEscape(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function withAndroidReleaseSigning(config) {
  // --- 1) Patch android/app/build.gradle ---
  config = withAppBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents;
    const projectRoot = cfg.modRequest.projectRoot;
    const props = loadKeystoreProps(projectRoot);

    // Idempotent — if already patched, skip
    if (contents.includes("// JOBPOPER_RELEASE_SIGNING_PATCH")) {
      return cfg;
    }

    // Build the release signingConfig block. If a properties file is present,
    // bake the values directly. Otherwise fall back to env vars (for CI).
    let releaseSigning;
    if (props) {
      const sp = groovyEscape(props.storePassword);
      const ka = groovyEscape(props.keyAlias);
      const kp = groovyEscape(props.keyPassword || props.storePassword);
      const ks = groovyEscape(props.storeFile || KEYSTORE_FILENAME);
      releaseSigning = `        release {
            // JOBPOPER_RELEASE_SIGNING_PATCH (props file)
            def ksFile = file('${ks}')
            if (ksFile.exists()) {
                storeFile ksFile
                storePassword '${sp}'
                keyAlias '${ka}'
                keyPassword '${kp}'
            } else {
                storeFile file('debug.keystore')
                storePassword 'android'
                keyAlias 'androiddebugkey'
                keyPassword 'android'
            }
        }`;
    } else {
      releaseSigning = `        release {
            // JOBPOPER_RELEASE_SIGNING_PATCH (env vars)
            def storePass = System.getenv('JOBPOPER_KEYSTORE_PASSWORD')
            def ksFile = file('${KEYSTORE_FILENAME}')
            if (storePass != null && !storePass.isEmpty() && ksFile.exists()) {
                storeFile ksFile
                storePassword storePass
                keyAlias (System.getenv('JOBPOPER_KEY_ALIAS') ?: 'upload')
                keyPassword (System.getenv('JOBPOPER_KEY_PASSWORD') ?: storePass)
            } else {
                storeFile file('debug.keystore')
                storePassword 'android'
                keyAlias 'androiddebugkey'
                keyPassword 'android'
            }
        }`;
    }

    const oldSigning = `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }`;

    const newSigning = `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
${releaseSigning}
    }`;

    if (!contents.includes(oldSigning)) {
      throw new Error(
        "[withAndroidReleaseSigning] Expected debug signingConfigs block not found — plugin needs an update."
      );
    }
    contents = contents.replace(oldSigning, newSigning);

    // Switch release buildType from debug → release signing
    const oldRelease = `        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug`;
    const newRelease = `        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.release`;

    if (!contents.includes(oldRelease)) {
      throw new Error(
        "[withAndroidReleaseSigning] release buildType block not found — plugin needs an update."
      );
    }
    contents = contents.replace(oldRelease, newRelease);

    cfg.modResults.contents = contents;
    return cfg;
  });

  // --- 2) Copy keystore into android/app/ ---
  config = withDangerousMod(config, [
    "android",
    async (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const platformRoot = cfg.modRequest.platformProjectRoot;
      const appDir = path.join(platformRoot, "app");
      const src = path.join(projectRoot, KEYSTORE_FILENAME);
      const dest = path.join(appDir, KEYSTORE_FILENAME);

      if (!fs.existsSync(src)) {
        console.warn(
          `[withAndroidReleaseSigning] ${KEYSTORE_FILENAME} not found in project root — release builds will fall back to debug signing (Play Store will reject).`
        );
        return cfg;
      }

      fs.mkdirSync(appDir, { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`[withAndroidReleaseSigning] Copied ${KEYSTORE_FILENAME} → android/app/`);

      const props = loadKeystoreProps(projectRoot);
      if (props) {
        console.log(
          `[withAndroidReleaseSigning] Release signing configured from ${PROPS_FILENAME} (alias='${props.keyAlias}')`
        );
      } else if (process.env.JOBPOPER_KEYSTORE_PASSWORD) {
        console.log("[withAndroidReleaseSigning] Release signing will use env vars at gradle build time.");
      } else {
        console.warn(
          `[withAndroidReleaseSigning] Neither ${PROPS_FILENAME} nor JOBPOPER_KEYSTORE_PASSWORD env var found.\n` +
            `  → Copy android-keystore.properties.example → android-keystore.properties and fill it in,\n` +
            `    or set env vars before \`./gradlew bundleRelease\`.\n` +
            `  → Until then, release builds fall back to debug signing (Play Store will reject).`
        );
      }

      return cfg;
    },
  ]);

  return config;
}

module.exports = withAndroidReleaseSigning;
