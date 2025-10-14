import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { Navigation } from "./navigation";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Provider } from 'react-redux';
// import { persistor, store } from "./redux/store";
import * as Font from "expo-font";

import "react-native-gesture-handler";
import "react-native-reanimated";
// import { PersistGate } from 'redux-persist/integration/react';
import { Text,ActivityIndicator, View } from "react-native";
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
 

  return (
    <>
     {/* <Provider store={store}> */}
     {/* <PersistGate loading={<View><ActivityIndicator size="large" /></View>} persistor={persistor}> */}
      <GestureHandlerRootView>
        <Navigation
          linking={{
            enabled: "auto",
            prefixes: [
              // Change the scheme to match your app's scheme defined in app.json
              "helloworld://",
            ],
          }}
          onReady={() => {
            SplashScreen.hideAsync();
          }}
        />
      </GestureHandlerRootView>
      <Toast position="bottom" />
      {/* </PersistGate> */}
      {/* </Provider> */}
    </>
  );
}
