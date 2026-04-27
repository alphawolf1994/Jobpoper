/**
 * Expo config plugin: copy Firebase config from firebase/ into android/ and ios/ during prebuild.
 */
const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("expo/config-plugins");

const FIREBASE_DIR = "firebase";
const ANDROID_SOURCE = path.join(FIREBASE_DIR, "google-services.json");
const IOS_SOURCE = path.join(FIREBASE_DIR, "GoogleService-Info.plist");

function withFirebaseAndroid(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const platformRoot = config.modRequest.platformProjectRoot;
      const sourcePath = path.join(projectRoot, ANDROID_SOURCE);
      const destPath = path.join(platformRoot, "app", "google-services.json");

      if (!fs.existsSync(sourcePath)) {
        console.warn(
          "[withFirebaseConfig] firebase/google-services.json not found – add before prebuild for FCM.",
        );
        return config;
      }

      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(sourcePath, destPath);
      console.log("[withFirebaseConfig] Copied google-services.json to android/app/");

      const settingsPath = path.join(platformRoot, "settings.gradle");
      if (fs.existsSync(settingsPath)) {
        let settings = fs.readFileSync(settingsPath, "utf8");
        if (!settings.includes("gradlePluginPortal()")) {
          settings = settings.replace(
            /pluginManagement\s*\{\s*\n/,
            "pluginManagement {\n  repositories {\n    gradlePluginPortal()\n    google()\n    mavenCentral()\n  }\n  ",
          );
          fs.writeFileSync(settingsPath, settings);
          console.log(
            "[withFirebaseConfig] Added gradlePluginPortal() to android/settings.gradle for RNFB",
          );
        }
      }

      const buildGradlePath = path.join(platformRoot, "build.gradle");
      const notifeeLibs = path.join(
        projectRoot,
        "node_modules",
        "@notifee",
        "react-native",
        "android",
        "libs",
      );
      if (fs.existsSync(buildGradlePath) && fs.existsSync(notifeeLibs)) {
        let buildGradle = fs.readFileSync(buildGradlePath, "utf8");
        const notifeeMaven =
          'maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }';
        if (!buildGradle.includes("@notifee/react-native/android/libs")) {
          buildGradle = buildGradle.replace(
            /allprojects\s*\{\s*repositories\s*\{/,
            `allprojects {\n  repositories {\n    ${notifeeMaven}\n`,
          );
          fs.writeFileSync(buildGradlePath, buildGradle);
          console.log(
            "[withFirebaseConfig] Added Notifee local Maven repo to android/build.gradle",
          );
        }
      }

      return config;
    },
  ]);
}

function withFirebaseIos(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const platformRoot = config.modRequest.platformProjectRoot;
      const projectName = config.modRequest.projectName || "JobPoper";
      const sourcePath = path.join(projectRoot, IOS_SOURCE);
      const destPath = path.join(platformRoot, projectName, "GoogleService-Info.plist");

      if (!fs.existsSync(sourcePath)) {
        console.warn(
          "[withFirebaseConfig] firebase/GoogleService-Info.plist not found – add before prebuild for FCM.",
        );
        return config;
      }

      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(sourcePath, destPath);
      console.log(
        "[withFirebaseConfig] Copied GoogleService-Info.plist to ios/" + projectName + "/",
      );

      const podfilePath = path.join(platformRoot, "Podfile");
      if (fs.existsSync(podfilePath)) {
        let podfile = fs.readFileSync(podfilePath, "utf8");
        const snippet = [
          "    installer.pods_project.targets.each do |target|",
          "      target.build_configurations.each do |build_config|",
          "        build_config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'",
          "        if target.name.start_with?('RNFB')",
          "          build_config.build_settings['CLANG_ENABLE_MODULES'] = 'NO'",
          "        end",
          "      end",
          "    end",
          "    ",
        ].join("\n");
        if (!podfile.includes("CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES")) {
          podfile = podfile.replace(
            /post_install do \|installer\|\n(\s+)react_native_post_install/,
            `post_install do |installer|\n${snippet}$1react_native_post_install`,
          );
          fs.writeFileSync(podfilePath, podfile);
          console.log("[withFirebaseConfig] Patched Podfile for RNFB non-modular header fix");
        }
      }

      return config;
    },
  ]);
}

function withFirebaseConfig(config) {
  config = withFirebaseAndroid(config);
  config = withFirebaseIos(config);
  return config;
}

module.exports = withFirebaseConfig;
