import * as ExpoLocation from 'expo-location';
import { Alert, Linking } from 'react-native';
import { store } from '../redux/store';
import { setCurrentLocation, setPermissionStatus, setCurrentAddress } from '../redux/slices/locationsSlice';

/**
 * Service to handle user location logic.
 * Enforces the rule: "if user deny the permission then every time when i call it he ask for permission".
 */
export const LocationService = {
  /**
   * Checks permission, requests if needed, and fetches location if granted.
   * Dispatches updates to Redux.
   * @returns The location object if successful, null otherwise.
   */
  getCurrentLocation: async () => {
    try {
      // 1. Check current permission status
      const { status: existingStatus, canAskAgain } = await (ExpoLocation as any).getForegroundPermissionsAsync();
      
      let finalStatus = existingStatus;

      // 2. If not granted, request it.
      if (existingStatus !== 'granted') {
          // Request permission
          const { status: newStatus } = await (ExpoLocation as any).requestForegroundPermissionsAsync();
          finalStatus = newStatus;
      }

      // Update permission status in Redux
      store.dispatch(setPermissionStatus(finalStatus === 'granted' ? 'granted' : 'denied'));

      if (finalStatus !== 'granted') {
        console.log('Location permission denied');
        
        // Show alert to open settings if permission is denied
        Alert.alert(
            "Location Permission Required",
            "This app needs access to your location to show relevant jobs. Please enable it in settings.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: () => Linking.openSettings() }
            ]
        );
        
        return null;
      }

      // 3. Permission granted, fetch location
      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // 4. Dispatch location to Redux
      store.dispatch(setCurrentLocation({ latitude, longitude }));

      // 5. Get reverse geocoding (Area/Address)
      try {
        const reverseGeocode = await (ExpoLocation as any).reverseGeocodeAsync({
            latitude,
            longitude
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
            const address = reverseGeocode[0];
            // Format: "City, Region" or just "City"
            const formattedAddress = [address.city, address.region, address.isoCountryCode]
                .filter(Boolean)
                .join(', ');
            
            store.dispatch(setCurrentAddress(formattedAddress));
            return { latitude, longitude, address: formattedAddress };
        }
      } catch (geoError) {
          console.log('Error in reverse geocoding:', geoError);
          // Don't fail the whole location fetch if reverse geocoding fails
      }

      return { latitude, longitude };

    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  },
};
