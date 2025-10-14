import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { Colors } from "../utils";

// Define the props for the Button component
interface ButtonProps {
  label: string; // Label for the button
  onPress: () => void; // Function to execute when the button is pressed
  style?: ViewStyle; // Optional custom style to override default styles
  icon?: ReactNode; // Optional icon component
  disabled?:boolean;
  textStyle?:TextStyle
}

const Button = ({ label, onPress ,style, icon,disabled,textStyle}: ButtonProps) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.signInButton,style]}>
       <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.signInButtonText,textStyle]}>{label}</Text>
      </View>
      {/* <Text style={styles.signInButtonText}>{label}</Text> */}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  signInButton: {
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
});
