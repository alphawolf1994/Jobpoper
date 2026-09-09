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

const FAST_FIX_TIMEOUT_MS = 6000;
const REFINE_FIX_TIMEOUT_MS = 4000;

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

async function readLastKnownCoords(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const last: any = await ExpoLocation.getLastKnownPositionAsync();
    if (last?.coords) {
      return {
        latitude: last.coords.latitude,
        longitude: last.coords.longitude,
      };
    }
  } catch (e: any) {
    log("last-known failed:", e?.message);
  }
  return null;
}

async function readFreshCoords(
  accuracy: number,
  timeoutMs: number
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const current: any = await withTimeout(
      ExpoLocation.getCurrentPositionAsync({
        accuracy,
        // Android: prompt to turn on system location if it's off, instead of hanging.
        mayShowUserSettingsDialog: true,
      }),
      timeoutMs
    );
    if (current?.coords) {
      return {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };
    }
  } catch (e: any) {
    log("fresh fix failed:", accuracy, e?.message);
  }
  return null;
}

async function ensureLocationReady(
  options: { forcePrompt?: boolean } = {}
): Promise<DeviceLocationFailure | null> {
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

  const servicesEnabled = await ExpoLocation.hasServicesEnabledAsync();
  log("services enabled:", servicesEnabled);
  if (!servicesEnabled) {
    return { ok: false, reason: "services_disabled" };
  }
  return null;
}

/**
 * Fast coordinates for "Use current location" buttons.
 * Uses last-known immediately, then a short network (Low) fix.
 * Never waits on GPS Balanced/Highest — those can hang 30s+ indoors on Android.
 */
export async function getDeviceCoordinatesFast(
  options: {
    forcePrompt?: boolean;
    onFirstFix?: (coords: { latitude: number; longitude: number }) => void;
  } = {}
): Promise<
  | { ok: true; latitude: number; longitude: number }
  | DeviceLocationFailure
> {
  try {
    const blocked = await ensureLocationReady(options);
    if (blocked) return blocked;

    let coords = await readLastKnownCoords();
    if (coords) {
      log("fast last-known:", coords);
      options.onFirstFix?.(coords);
    }

    // Accuracy.Low = Android LOW_POWER (wifi/cell), typically 1–3s.
    // Do not use Lowest (PASSIVE) — that waits for another app to request GPS.
    const fresh = await readFreshCoords(
      ExpoLocation.Accuracy.Low,
      coords ? REFINE_FIX_TIMEOUT_MS : FAST_FIX_TIMEOUT_MS
    );
    if (fresh) {
      coords = fresh;
      log("fast fresh (low):", coords);
      options.onFirstFix?.(coords);
    }

    if (!coords) {
      log("fast path got no coordinates -> timeout");
      return { ok: false, reason: "timeout" };
    }

    return { ok: true, ...coords };
  } catch (e: any) {
    log("fast path unexpected failure:", e?.message);
    return { ok: false, reason: "unavailable" };
  }
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
    const blocked = await ensureLocationReady(options);
    if (blocked) return blocked;

    // Prefer a cached fix so the UI is not blocked on GPS.
    // Then try a short Low-accuracy (network) refresh. Balanced GPS is not
    // used here — on Android it routinely hangs 30s+ indoors.
    let coords = await readLastKnownCoords();
    if (coords) log("last-known fix:", coords);

    const fresh = await readFreshCoords(
      ExpoLocation.Accuracy.Low,
      coords ? REFINE_FIX_TIMEOUT_MS : FAST_FIX_TIMEOUT_MS
    );
    if (fresh) {
      coords = fresh;
      log("fresh (low) fix:", coords);
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
