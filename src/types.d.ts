declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

// Temporary module declarations for libraries used at runtime
declare module 'react-native-maps' {
  export type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  const MapView: any;
  export const Marker: any;
  export default MapView;
}

declare module 'expo-location' {
  export const requestForegroundPermissionsAsync: any;
  export const getCurrentPositionAsync: any;
  export const Accuracy: any;
}

declare module 'uuid' {
  export function v4(): string;
}
