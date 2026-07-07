import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

import { AppDispatch, RootState } from "../redux/store";
import {
  setDetectedLocation,
  setCurrentLocationCoordinates,
  setIsDetectingLocation,
  setLocationPermissionStatus,
} from "../redux/slices/jobSlice";
import { updateCurrentLocation } from "../redux/slices/authSlice";
import {
  getDeviceLocation,
  LocationErrorReason,
} from "../services/location/currentLocation";
import { calculateDistanceKm } from "../utils/geocode";

// Only re-run auto-detection at most this often (ms) to avoid battery drain
// and spamming the Geocoding API on every screen focus / tab switch.
const MIN_DETECT_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// If the newly detected position is within this distance of the location
// already stored on the profile, we consider it "unchanged" and skip the
// backend update (avoids writes on tiny GPS jitter).
const LOCATION_CHANGED_THRESHOLD_KM = 0.15; // ~150 meters

// Module-level (global) state: shared across every Header instance so that
// switching bottom tabs — which remounts the Header — does NOT re-trigger GPS.
// This persists for the app session and resets on cold start.
let moduleLastDetectedAt = 0;
let moduleDetectionInFlight = false;

interface UseAutoLocationOptions {
  // Persist a successful auto-detect to the server profile so the next launch
  // starts from the right place. Off by default (opt-in).
  persistToProfile?: boolean;
}

// True when the detected location differs meaningfully from what is already
// stored (by distance, or when there is no stored location yet).
function hasLocationChanged(
  stored: { latitude?: number | null; longitude?: number | null } | null | undefined,
  next: { latitude: number; longitude: number }
): boolean {
  if (
    !stored ||
    stored.latitude == null ||
    stored.longitude == null
  ) {
    return true;
  }
  const distance = calculateDistanceKm(
    stored.latitude,
    stored.longitude,
    next.latitude,
    next.longitude
  );
  if (distance == null) return true;
  return distance > LOCATION_CHANGED_THRESHOLD_KM;
}

/**
 * Detects the device's current location and pushes it into Redux so the header
 * label and all coordinate-based job/notification queries follow it.
 *
 * - Runs once when it first mounts (per session), guarded by a throttle.
 * - Never overwrites a location the user picked manually (handled in the slice).
 * - `detectNow(forcePrompt)` can be called on demand (e.g. a "Use my current
 *   location" button) and will re-prompt for permission when needed.
 */
export function useAutoLocation(options: UseAutoLocationOptions = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const { locationSource, isDetectingLocation } = useSelector(
    (state: RootState) => state.job
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  // Location currently stored on the user's server profile.
  const storedProfileLocation = user?.profile?.currentLocation ?? null;

  const notifyFailure = useCallback(
    (reason: LocationErrorReason, forced: boolean) => {
      // Only surface a message when the user explicitly asked (forced).
      if (!forced) return;
      const map: Record<LocationErrorReason, { text1: string; text2: string }> = {
        permission_denied: {
          text1: "Location permission needed",
          text2: "Enable location access in Settings to use your current location.",
        },
        services_disabled: {
          text1: "Location is turned off",
          text2: "Turn on location services and try again.",
        },
        timeout: {
          text1: "Couldn't get your location",
          text2: "Please try again in a moment.",
        },
        unavailable: {
          text1: "Location unavailable",
          text2: "We couldn't read your device location.",
        },
        geocode_failed: {
          text1: "Location set",
          text2: "We found your position but couldn't name the area.",
        },
      };
      const msg = map[reason];
      Toast.show({ type: reason === "geocode_failed" ? "info" : "error", ...msg });
    },
    []
  );

  const detect = useCallback(
    async (forcePrompt: boolean) => {
      if (moduleDetectionInFlight) return;
      // Respect a manual choice unless the user explicitly forces a refresh.
      if (locationSource === "manual" && !forcePrompt) return;

      moduleDetectionInFlight = true;
      dispatch(setIsDetectingLocation(true));
      try {
        const result = await getDeviceLocation({ forcePrompt });
        moduleLastDetectedAt = Date.now();

        if (result.ok) {
          dispatch(setLocationPermissionStatus("granted"));
          dispatch(
            setDetectedLocation({
              fullAddress: result.fullAddress,
              latitude: result.latitude,
              longitude: result.longitude,
              source: "auto",
            })
          );

          // Only write to the backend when the location actually changed
          // compared to what is already stored on the profile. Otherwise skip.
          const changed = hasLocationChanged(storedProfileLocation, {
            latitude: result.latitude,
            longitude: result.longitude,
          });

          if (options.persistToProfile && isAuthenticated && changed) {
            dispatch(
              updateCurrentLocation({
                fullAddress: result.fullAddress,
                latitude: result.latitude,
                longitude: result.longitude,
              })
            )
              .unwrap()
              .catch(() => {
                /* device-local update already applied; ignore profile error */
              });
          }
        } else {
          if (result.reason === "permission_denied") {
            dispatch(setLocationPermissionStatus("denied"));
          }
          // We still have coordinates even if naming failed — keep jobs working.
          if (
            result.reason === "geocode_failed" &&
            result.latitude != null &&
            result.longitude != null
          ) {
            dispatch(
              setCurrentLocationCoordinates({
                latitude: result.latitude,
                longitude: result.longitude,
              })
            );
          }
          notifyFailure(result.reason, forcePrompt);
        }
      } finally {
        moduleDetectionInFlight = false;
        dispatch(setIsDetectingLocation(false));
      }
    },
    [dispatch, locationSource, isAuthenticated, options.persistToProfile, notifyFailure, storedProfileLocation]
  );

  // Auto-run at most once per interval, GLOBALLY across all Header instances.
  // Because the throttle timestamp is module-level, switching bottom tabs
  // (which remounts the Header) will NOT re-trigger GPS within the interval.
  useEffect(() => {
    const now = Date.now();
    const stale = now - moduleLastDetectedAt > MIN_DETECT_INTERVAL_MS;
    if (locationSource === "manual") return;
    if (!stale) return;
    detect(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectNow = useCallback(() => detect(true), [detect]);

  return { detectNow, isDetectingLocation };
}

export default useAutoLocation;
