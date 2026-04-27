import 'react-native-get-random-values';
import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Navigation } from "./navigation";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from 'react-redux';
import { persistor, store } from "./redux/store";

import "react-native-gesture-handler";
import "react-native-reanimated";
import { LogBox } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { navigationRef } from "./navigation/navigationRef";
import { FcmHandler } from "./services/notifications/FcmHandler";
import { PushDeviceSync } from "./components/PushDeviceSync";
import { createAndroidNotificationChannels } from "./services/notifications/androidNotificationChannels";
LogBox.ignoreAllLogs();
Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();

function AndroidChannels() {
  useEffect(() => {
    if (Platform.OS === "android") {
      createAndroidNotificationChannels();
    }
  }, []);
  return null;
}

export function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView>
          <AndroidChannels />
          <FcmHandler />
          <PushDeviceSync />
          <Navigation
            ref={navigationRef}
            linking={{
              enabled: "auto",
              prefixes: [
                "jobpoper://",
                "expo+jobpoper://",
              ],
            }}
            onReady={() => {
              SplashScreen.hideAsync();
            }}
          />
        </GestureHandlerRootView>
      </PersistGate>
      <Toast position="bottom" />
    </Provider>
  );
}
