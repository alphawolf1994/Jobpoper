import { useEffect, useState } from "react";
import { getDeviceLocation } from "../services/location/currentLocation";

/**
 * Detects the device's country (ISO 3166-1 alpha-2, e.g. "PK") from the user's
 * current location so phone-number inputs can default to the correct country
 * code automatically.
 *
 * Design notes:
 *  - The result is cached at MODULE level, so the location lookup (and the
 *    permission prompt) happens at most ONCE per app session no matter how many
 *    phone inputs / auth screens mount it.
 *  - It never throws and never shows toasts; if detection fails, it simply
 *    returns undefined and callers fall back to their own default country.
 */

let cachedCountryCode: string | null = null; // resolved ISO code, if any
let detectionDone = false; // we already attempted (success or fail)
let detectionInFlight: Promise<string | null> | null = null;

async function resolveCountryCode(): Promise<string | null> {
  if (cachedCountryCode) return cachedCountryCode;
  if (detectionDone) return cachedCountryCode;
  if (detectionInFlight) return detectionInFlight;

  detectionInFlight = (async () => {
    try {
      const result = await getDeviceLocation({ forcePrompt: false });
      if (result.ok && result.countryCode) {
        cachedCountryCode = result.countryCode.toUpperCase();
      }
    } catch {
      // ignore — callers keep their fallback default
    } finally {
      detectionDone = true;
      detectionInFlight = null;
    }
    return cachedCountryCode;
  })();

  return detectionInFlight;
}

export function useAutoCountryCode(enabled: boolean = true) {
  const [countryCode, setCountryCode] = useState<string | undefined>(
    cachedCountryCode ?? undefined
  );

  useEffect(() => {
    if (!enabled) return;
    if (cachedCountryCode) {
      setCountryCode(cachedCountryCode);
      return;
    }
    let active = true;
    resolveCountryCode().then((code) => {
      if (active && code) setCountryCode(code);
    });
    return () => {
      active = false;
    };
  }, [enabled]);

  return countryCode;
}

export default useAutoCountryCode;
