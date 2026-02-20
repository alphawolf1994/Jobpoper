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
