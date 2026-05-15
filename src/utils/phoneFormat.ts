// E.164 phone-number helpers.
//
// Why this file exists:
//   `react-native-phone-number-input` returns a `formattedPhoneNumber` via its
//   `onChangeFormattedText` callback, but that string is unreliable when the
//   user's typed digits partially overlap the country's calling code (or when
//   the user pastes a number that already contains a `+` / country code).
//   For example, with India (+91) selected, typing `91234567890` could come
//   back as `+91234567890` — Twilio interprets that as country code `9`
//   followed by `1234567890`, producing:
//       Invalid parameter `To`: +91234567890
//
//   The fix is to construct E.164 ourselves from the raw national digits
//   (`onChangeText`) plus the country's calling code (read from the input ref
//   via `getCallingCode()`).

/** Strip everything except digits. */
export const onlyDigits = (value: string | null | undefined): string =>
  (value ?? "").replace(/\D/g, "");

/**
 * Build a valid E.164 number from raw national digits + a calling code.
 *
 * Handles the common foot-guns:
 *   - User pastes "+91 98765 43210" → digits only, calling code stripped
 *   - User retypes the country code at the start of the national input
 *     (e.g. types "919876543210" with +91 selected) → de-duped
 *   - User types a leading 0 (Indian trunk prefix) → stripped
 *
 * @param rawNational  The "national" portion as the user typed it (anything;
 *                     non-digits ignored).
 * @param callingCode  Country calling code WITHOUT the leading "+" (e.g. "91"
 *                     for India, "1" for US). Read via PhoneInput's
 *                     `getCallingCode()` ref method.
 */
export const toE164 = (rawNational: string, callingCode: string): string => {
  const cc = onlyDigits(callingCode);
  let national = onlyDigits(rawNational);

  // If the user prefixed the country code into the national field, drop it.
  if (cc && national.startsWith(cc)) {
    national = national.slice(cc.length);
  }

  // Many countries (India, UK, AU, NG…) use a leading "0" trunk prefix when
  // dialling domestically. E.164 never includes it.
  while (national.startsWith("0")) {
    national = national.slice(1);
  }

  if (!cc || !national) return "";
  return `+${cc}${national}`;
};

/**
 * Validate that a string looks like a usable E.164 number.
 * E.164 = "+", country code (1–3 digits, not starting with 0), then up to 12
 * more digits, total digits between 8 and 15.
 */
export const isValidE164 = (value: string): boolean => {
  if (!value) return false;
  if (!/^\+[1-9]\d{7,14}$/.test(value)) return false;
  return true;
};

/**
 * Mask a phone number for display, e.g. "+91 ••• ••• 3210".
 * Useful on the OTP screen so we can confirm the user the code was sent to
 * the right place without printing the whole number.
 */
export const maskPhone = (e164: string): string => {
  if (!e164 || e164.length < 5) return e164;
  const last4 = e164.slice(-4);
  const prefix = e164.slice(0, e164.length - 4).replace(/\d/g, "•");
  return `${prefix}${last4}`;
};
