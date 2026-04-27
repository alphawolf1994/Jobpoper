import './gesture-handler';

import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import { registerBackgroundHandler } from './src/services/notifications/pushNotificationHandler';
import { isFirebaseAvailable } from './src/services/notifications/firebaseAvailability';
import { App } from './src/App';

if (Platform.OS !== 'web' && isFirebaseAvailable()) {
  registerBackgroundHandler();
}

registerRootComponent(App);
