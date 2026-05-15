import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ViewStyle,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Colors } from "../utils";
import ErrorText from "./ErrorText";

// Account for status bar + extra breathing room so the search input / close
// button never sit underneath the system status bar on Android devices that
// render edge-to-edge (e.g. Motorola Edge 60 Pro with punch-hole camera).
const ANDROID_STATUS_BAR_OFFSET =
  (StatusBar.currentHeight ?? 24) + 12;

interface PhoneNumberInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onChangeFormattedText?: (text: string) => void;
  /**
   * Fires whenever the calling code changes (initial mount + country switch).
   * Value is the dial code WITHOUT a leading "+" (e.g. "91"). Consumers should
   * pair this with the raw `onChangeText` and pass both to `toE164(...)` from
   * `utils/phoneFormat.ts` — that produces a reliable E.164 number, sidestepping
   * the bugs in `onChangeFormattedText` for users whose typed digits overlap
   * the dial code.
   */
  onChangeCallingCode?: (callingCode: string) => void;
  error?: string | null | undefined;
  containerStyle?: ViewStyle;
  firstContainerStyle?: ViewStyle;
  defaultCode?: any;
  disabled?: boolean;
}

const PhoneNumberInput = ({
  label,
  placeholder = "Enter phone number",
  value,
  onChangeText,
  onChangeFormattedText,
  onChangeCallingCode,
  error,
  containerStyle,
  firstContainerStyle,
  defaultCode = "IN",
  disabled = false,
}: PhoneNumberInputProps) => {
  const phoneInput = useRef<PhoneInput>(null);

  // Push the initial calling code up to the parent after mount so consumers
  // don't have to wait for the first country change to know which code is
  // active. The lib's ref methods are only available after a render.
  React.useEffect(() => {
    if (!onChangeCallingCode) return;
    const code = phoneInput.current?.getCallingCode?.();
    if (code) onChangeCallingCode(code);
    // We intentionally only run this once; subsequent updates come through
    // the country picker's onChangeCountry callback below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[firstContainerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, containerStyle]}>
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode={defaultCode}
          layout="first"
          onChangeText={onChangeText}
          onChangeFormattedText={onChangeFormattedText}
          onChangeCountry={(country) => {
            // `country.callingCode` is a string[] like ["91"] in v2.x
            const code = Array.isArray(country?.callingCode)
              ? country.callingCode[0]
              : (country as any)?.callingCode;
            if (code && onChangeCallingCode) onChangeCallingCode(String(code));
          }}
          withDarkTheme={false}
          withShadow={false}
          autoFocus={false}
          disabled={disabled}
          placeholder={placeholder}
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textContainer}
          textInputStyle={styles.textInput}
          codeTextStyle={styles.codeText}
          flagButtonStyle={styles.flagButton}
          countryPickerButtonStyle={styles.countryPickerButton}
          filterProps={{
            placeholder: "Search country",
            placeholderTextColor: Colors.gray,
            style: styles.countryFilterInput,
          }}
          countryPickerProps={{
            modalProps: {
              // Keep the OS status bar visible above the picker modal so
              // the search bar and close button do not overlap it on
              // Android edge-to-edge devices.
              statusBarTranslucent: false,
              hardwareAccelerated: true,
            },
            flatListProps: {
              style: styles.countryList,
              contentContainerStyle: styles.countryListContent,
            },
            closeButtonStyle: styles.countryCloseButton,
            closeButtonImageStyle: styles.countryCloseButtonImage,
          }}
          renderDropdownImage={
            <Text style={styles.dropdownArrow}>▼</Text>
          }
        />
      </View>
      {error && <ErrorText error={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  phoneContainer: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.white,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 10,
  },
  textContainer: {
    backgroundColor: "transparent",
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  textInput: {
    fontSize: 16,
    color: Colors.black,
    paddingVertical: Platform.OS === 'android' ? 0 : 8,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
    lineHeight: Platform.OS === 'android' ? 20 : 22,
    height: Platform.OS === 'android' ? 34 : 'auto',
  },
  codeText: {
    fontSize: 16,
    color: Colors.black,
    paddingVertical: Platform.OS === 'android' ? 0 : 8,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
    lineHeight: Platform.OS === 'android' ? 20 : 22,
    height: Platform.OS === 'android' ? 34 : 'auto',
  },
  flagButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  countryPickerButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  dropdownArrow: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 4,
  },
  countryFilterInput: {
    marginTop: Platform.OS === "android" ? ANDROID_STATUS_BAR_OFFSET : 6,
    marginLeft: 12,
    width: "70%",
    fontSize: 16,
    color: Colors.black,
  },
  countryList: {
    flex: 1,
  },
  countryListContent: {
    paddingBottom: Platform.OS === "android" ? 24 : 0,
  },
  countryCloseButton: {
    marginTop: Platform.OS === "android" ? ANDROID_STATUS_BAR_OFFSET : 6,
    marginLeft: 8,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  countryCloseButtonImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    color: Colors.black,
  },
});

export default PhoneNumberInput;
