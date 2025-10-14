import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface ErrorTextProps {
  error:
    | string
    | null
    | undefined
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
}

const ErrorText = ({ error }: ErrorTextProps) => {
  return <Text style={styles.errorText}>{error}</Text>;
};

export default ErrorText;

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 10,
  },
});
