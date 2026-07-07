const GOOGLE_API_KEY = "AIzaSyDx-5zOU35lqenxx6TCR-OkQRj6cHpi5-U";

/**
 * Geocode an address string to latitude/longitude using Google Geocoding API.
 * Returns null if the address cannot be resolved.
 */
export async function geocodeAddressToCoordinates(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  if (!address?.trim()) return null;
  try {
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address.trim())}&key=${GOOGLE_API_KEY}`
    );
    const data = await resp.json();
    if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
    return null;
  } catch {
    return null;
  }
}

export interface ReverseGeocodeResult {
  city: string;
  state: string;
  country: string;
  fullAddress: string;
}

/**
 * Reverse-geocode latitude/longitude into a structured, human-readable address
 * using the Google Geocoding API. Returns null if it cannot be resolved.
 *
 * Shared helper so the header auto-location and AddLocationScreen use the
 * exact same logic instead of duplicating fetch calls.
 */
export async function reverseGeocodeToAddress(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> {
  if (typeof latitude !== "number" || typeof longitude !== "number") return null;
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  try {
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
    );
    const data = await resp.json();
    const result = data?.results?.[0];
    if (data.status !== "OK" || !result) return null;

    let city = "";
    let state = "";
    let country = "";

    (result.address_components || []).forEach((component: any) => {
      const types: string[] = component.types || [];
      if (types.includes("locality") || types.includes("postal_town")) {
        city = component.long_name;
      } else if (!city && types.includes("administrative_area_level_2")) {
        // Fallback for regions without a "locality" (common outside the US)
        city = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        state = component.long_name;
      } else if (types.includes("country")) {
        country = component.long_name;
      }
    });

    // Build a compact label; prefer the components, fall back to Google's string.
    const compact = [city, state, country].filter(Boolean).join(", ");
    const fullAddress = compact || result.formatted_address || "";
    if (!fullAddress) return null;

    return { city, state, country, fullAddress };
  } catch {
    return null;
  }
}

/**
 * Compute the great-circle distance (in kilometers) between two lat/lng points
 * using the Haversine formula. Returns null if any value is invalid.
 */
export function calculateDistanceKm(
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null
): number | null {
  if (
    typeof lat1 !== "number" ||
    typeof lon1 !== "number" ||
    typeof lat2 !== "number" ||
    typeof lon2 !== "number"
  ) {
    return null;
  }
  if (
    Number.isNaN(lat1) ||
    Number.isNaN(lon1) ||
    Number.isNaN(lat2) ||
    Number.isNaN(lon2)
  ) {
    return null;
  }

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // 2 decimal places
}

/**
 * Format a distance in km into a short human-readable label.
 *  - 0.42 km   → "420 m"
 *  - 5 km     → "5 km"
 *  - 12.45 km → "12.5 km"
 */
export function formatDistanceLabel(distanceKm: number | null | undefined): string {
  if (distanceKm === null || distanceKm === undefined || Number.isNaN(distanceKm)) {
    return "";
  }
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }
  return `${Math.round(distanceKm)} km`;
}
