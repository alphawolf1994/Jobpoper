import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import { MainStyles } from "../assets/styles";

interface HeadingTextProps {
  text: string;
  textStyle?:TextStyle
}

const HeadingText = ({ text,textStyle }:HeadingTextProps) => {
  return <Text style={[MainStyles.headingText,textStyle]}>{text}</Text>;
};

export default HeadingText;

const styles = StyleSheet.create({});
