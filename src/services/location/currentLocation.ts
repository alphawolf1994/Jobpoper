import * as ExpoLocation from "expo-location";
import {
  reverseGeocodeToAddress,
  ReverseGeocodeResult,
} from "../../utils/geocode";

export type LocationErrorReason =
  | "permission_denied"
  | "services_disabled"
  | "timeout"
  | "unavailable"
  | "geocode_failed";

export interface DeviceLocationSuccess {
  ok: true;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  fullAddress: string;
}

export interface DeviceLocationFailure {
  ok: false;
  reason: LocationErrorReason;
  // Coordinates may still be available even when reverse-geocoding fails.
  latitude?: number;
  longitude?: number;
}

export type DeviceLocationResult =
  | DeviceLocationSuccess
  | DeviceLocationFailure;

const GET_POSITION_TIMEOUT_MS = 15000;

// Lightweight diagnostic logging (visible in Metro / device logs).
const log = (...args: any[]) => console.log("[auto-location]", ...args);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("location_timeout")), ms)
    ),
  ]);
}

/**
 * Detect the device's current location and reverse-geocode it into a
 * human-readable address.
 *
 * Behavior:
 *  - Requests foreground permission only if not already decided (unless
 *    `forcePrompt` is true).
 *  - Falls back to the last known position if a fresh fix is slow.
 *  - Never throws; always resolves to a typed result so callers can branch
 *    on `reason` for each scenario.
 */
export async function getDeviceLocation(
  options: { forcePrompt?: boolean } = {}
): Promise<DeviceLocationResult> {
  try {
    // 1. Permission
    let { status, canAskAgain } =
      await ExpoLocation.getForegroundPermissionsAsync();
    log("permission status:", status, "canAskAgain:", canAskAgain);

    if (status !== "granted" && (canAskAgain || options.forcePrompt)) {
      const req = await ExpoLocation.requestForegroundPermissionsAsync();
      status = req.status;
      log("permission after request:", status);
    }

    if (status !== "granted") {
      return { ok: false, reason: "permission_denied" };
    }

    // 2. Are location services actually on?
    const servicesEnabled = await ExpoLocation.hasServicesEnabledAsync();
    log("services enabled:", servicesEnabled);
    if (!servicesEnabled) {
      return { ok: false, reason: "services_disabled" };
    }

    // 3. Position acquisition. Strategy:
    //    a) grab a cached last-known fix first (instant, may be null)
    //    b) request a fresh fix; if it succeeds, prefer it
    //    c) if the fresh fix times out, retry once at lower accuracy
    //    Whichever produces coordinates first is used, so an emulator/indoor
    //    device with a cached fix still succeeds.
    let coords: { latitude: number; longitude: number } | null = null;

    try {
      const last: any = await ExpoLocation.getLastKnownPositionAsync();
      if (last?.coords) {
        coords = {
          latitude: last.coords.latitude,
          longitude: last.coords.longitude,
        };
        log("last-known fix:", coords);
      }
    } catch (e: any) {
      log("last-known failed:", e?.message);
    }

    try {
      const current: any = await withTimeout(
        ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        }),
        GET_POSITION_TIMEOUT_MS
      );
      if (current?.coords) {
        coords = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };
        log("fresh (balanced) fix:", coords);
      }
    } catch (e: any) {
      log("fresh (balanced) fix failed:", e?.message);
      // Retry once at the lowest accuracy — much faster to acquire indoors.
      if (!coords) {
        try {
          const low: any = await withTimeout(
            ExpoLocation.getCurrentPositionAsync({
              accuracy: ExpoLocation.Accuracy.Lowest,
            }),
            GET_POSITION_TIMEOUT_MS
          );
          if (low?.coords) {
            coords = {
              latitude: low.coords.latitude,
              longitude: low.coords.longitude,
            };
            log("fresh (lowest) fix:", coords);
          }
        } catch (e2: any) {
          log("fresh (lowest) fix failed:", e2?.message);
        }
      }
    }

    if (!coords) {
      log("no coordinates obtained -> timeout");
      return { ok: false, reason: "timeout" };
    }

    // 4. Reverse geocode to a label.
    const address: ReverseGeocodeResult | null = await reverseGeocodeToAddress(
      coords.latitude,
      coords.longitude
    );

    if (!address) {
      log("reverse-geocode returned no address for", coords);
      // Coordinates are still usable for job queries even without a label.
      return {
        ok: false,
        reason: "geocode_failed",
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
    }

    log("resolved location:", address.fullAddress);
    return {
      ok: true,
      latitude: coords.latitude,
      longitude: coords.longitude,
      city: address.city,
      state: address.state,
      country: address.country,
      countryCode: address.countryCode,
      fullAddress: address.fullAddress,
    };
  } catch (e: any) {
    log("unexpected failure:", e?.message);
    return { ok: false, reason: "unavailable" };
  }
}
