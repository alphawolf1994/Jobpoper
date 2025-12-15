import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../utils";

// icons
import { Entypo } from "@expo/vector-icons";
import ErrorText from "./ErrorText";

// import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface MyTextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  searchIcon?: boolean;
  leftIcon?: React.ReactNode; // <-- added leftIcon prop
  value?: string;
  label?: string;
  error?: string | null | undefined;
  onChange?: (text: string) => void;
  onSearchPress?: () => void;
  editable?: boolean; // New Prop
  keyboardType?: KeyboardTypeOptions; // New Prop
  containerStyle?: ViewStyle; // New Prop
  firstContainerStyle?: ViewStyle;
}

const MyTextInput = ({
  placeholder,
  secureTextEntry,
  value,
  label,
  error,
  searchIcon,
  leftIcon, // <-- receive leftIcon
  onChange,
  onSearchPress,
  editable = true, // Default is editable
  keyboardType = "default", // Default keyboard type
  containerStyle, // Custom styles for container
  firstContainerStyle,
}: MyTextInputProps) => {
  const [show, setShow] = useState(secureTextEntry);

  return (
    <View style={[firstContainerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, containerStyle]}>
        {leftIcon ? <View style={styles.leftIconWrapper}>{leftIcon}</View> : null}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={show}
            placeholder={placeholder}
            placeholderTextColor="gray"
            onChangeText={onChange}
            value={value}
            editable={editable}
            keyboardType={keyboardType}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            {...(Platform.OS === 'ios' && {
              clearButtonMode: 'never',
              textContentType: 'none',
            })}
          />
        </View>
        {searchIcon ? (
          <TouchableOpacity onPress={onSearchPress}>
            <Entypo name="menu" size={20} color="black" />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setShow(!show)}>
            {show ? (
              <Entypo name="eye" size={20} color="black" />
            ) : (
              <Entypo name="eye-with-line" size={20} color="black" />
            )}
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      {error && <ErrorText error={error} />}
    </View>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 0 : 8,
    marginTop: 10,
    minHeight: 50,
    justifyContent: 'center',
    ...(Platform.OS === 'ios' && {
      paddingTop: 0,
      paddingBottom: 0,
    }),
  },
  leftIconWrapper: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    flex: 1,
    minWidth: 0,
    height: Platform.OS === 'ios' ? 50 : 'auto',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    paddingVertical: Platform.OS === 'android' ? 0 : 0,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
    lineHeight: Platform.OS === 'android' ? 20 : 20,
    height: Platform.OS === 'android' ? 34 : 50,
    ...(Platform.OS === 'ios' && {
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      marginBottom: 0,
    }),
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    color: Colors.black,
  },
});
