import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ViewStyle,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Colors } from "../utils";
import ErrorText from "./ErrorText";

interface PhoneNumberInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onChangeFormattedText?: (text: string) => void;
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
  error,
  containerStyle,
  firstContainerStyle,
  defaultCode = "US",
  disabled = false,
}: PhoneNumberInputProps) => {
  const phoneInput = useRef<PhoneInput>(null);

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
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    color: Colors.black,
  },
});

export default PhoneNumberInput;
