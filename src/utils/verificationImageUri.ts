/**
 * True when the URI is a newly picked image on this device (not a server-relative path from a prior submission).
 */
export function isFreshLocalVerificationUri(uri?: string | null): boolean {
  if (!uri) return false;
  return (
    uri.startsWith("file:") ||
    uri.startsWith("content:") ||
    uri.startsWith("ph:")
  );
}
