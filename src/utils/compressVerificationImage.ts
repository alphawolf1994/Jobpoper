const MAX_WIDTH = 1280;
const JPEG_QUALITY = 0.7;

type CompressedImage = {
  uri: string;
  name: string;
  type: string;
};

function fallbackFromUri(uri: string, fileNamePrefix: string): CompressedImage {
  const fallbackName = uri.split("/").pop() || `${fileNamePrefix}.jpg`;
  const ext = fallbackName.split(".").pop()?.toLowerCase();
  const type =
    ext === "png"
      ? "image/png"
      : ext === "webp"
      ? "image/webp"
      : ext === "heic" || ext === "heif"
      ? "image/heic"
      : "image/jpeg";

  return {
    uri,
    name: fallbackName.includes(".") ? fallbackName : `${fileNamePrefix}.jpg`,
    type,
  };
}

/**
 * Resize (only if wider than MAX_WIDTH) + re-encode to JPEG so uploads stay
 * small and HEIC/HEIF never hits the server.
 *
 * Uses a dynamic import so apps that haven't rebuilt native code yet still
 * work — they just skip compression until ExpoImageManipulator is linked.
 */
export async function compressVerificationImage(
  uri: string,
  fileNamePrefix: string
): Promise<CompressedImage> {
  let ImageManipulator: typeof import("expo-image-manipulator");
  try {
    ImageManipulator = await import("expo-image-manipulator");
  } catch (error) {
    console.warn(
      "[verification] expo-image-manipulator unavailable — uploading original image. Rebuild the native app to enable compression.",
      error
    );
    return fallbackFromUri(uri, fileNamePrefix);
  }

  try {
    // First pass: convert to JPEG so HEIC becomes upload-friendly and we get dimensions.
    const probed = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    const actions =
      probed.width > MAX_WIDTH ? [{ resize: { width: MAX_WIDTH } }] : [];

    const result = await ImageManipulator.manipulateAsync(
      probed.uri,
      actions,
      {
        compress: JPEG_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return {
      uri: result.uri,
      name: `${fileNamePrefix}-${Date.now()}.jpg`,
      type: "image/jpeg",
    };
  } catch (error) {
    console.warn(
      "[verification] image compression failed — uploading original image.",
      error
    );
    return fallbackFromUri(uri, fileNamePrefix);
  }
}
