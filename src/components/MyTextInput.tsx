import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../utils";

// icons
import { Entypo } from "@expo/vector-icons";
import ErrorText from "./ErrorText";

import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface MyTextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  searchIcon?:boolean;
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
  onSearchPress?: () => void;
  editable?: boolean; // New Prop
  keyboardType?: KeyboardTypeOptions; // New Prop
  containerStyle?: ViewStyle; // New Prop
  firstContainerStyle?:ViewStyle
}

const MyTextInput = ({
  placeholder,
  secureTextEntry,
  value,
  label,
  error,
  searchIcon,
  onChange,
  onSearchPress,
  editable = true, // Default is editable
  keyboardType = "default", // Default keyboard type
  containerStyle, // Custom styles for container
  firstContainerStyle
}: MyTextInputProps) => {
  const [show, setShow] = useState(secureTextEntry);

  return (
    <View style={[firstContainerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, containerStyle]}>
        <TextInput
          style={styles.input}
          secureTextEntry={show}
          placeholder={placeholder}
          placeholderTextColor="#ddd"
          onChangeText={onChange}
          value={value}
          editable={editable} 
          keyboardType={keyboardType}
        />
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
  container:{
    flexDirection: "row",
    alignItems: "center",
    borderColor:Colors.gray,
    borderWidth:1,
    borderRadius:10,
    padding:10,
    marginTop:10,
    height:50
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
   
  
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    color: Colors.black,
  },
});
