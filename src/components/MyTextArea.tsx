import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../utils";
import ErrorText from "./ErrorText";

import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface MyTextAreaProps {
  placeholder: string;
  value?: string;
  label?: string;
  error?:
    | string
    | null
    | undefined
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
  onChange?: (text: string) => void;
}

const MyTextArea = ({ placeholder, value, label, error, onChange }: MyTextAreaProps) => {
  return (
    <>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.container}>
        <TextInput
          style={styles.textArea}
          placeholder={placeholder}
          placeholderTextColor="#ddd"
          onChangeText={onChange}
          value={value}
          multiline
          numberOfLines={4} // Adjust height of text area
          textAlignVertical="top" // Align text at the top
        />
      </View>
      {error && <ErrorText error={error} />}
    </>
  );
};

export default MyTextArea;

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  textArea: {
    fontSize: 16,
    color: Colors.black,
    minHeight: 100, // Ensure it looks like a text area
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    color: Colors.black,
  },
});
