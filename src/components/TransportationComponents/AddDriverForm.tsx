import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image
} from "react-native";

import { Colors, heightToDp, widthToDp } from "../../utils";
import { Header, Button, MyTextInput, ErrorText } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
type DriverFormData = {
    driverName: string;
    driverContact: string;
    driverLicense: string;
    Address: string;
    image?: string;
  
  };
  
  type AddDriverFormProps = {
    onSubmit: (data: DriverFormData) => void;
    initialValues?: DriverFormData | null;
  };

  const AddDriverForm: React.FC<AddDriverFormProps> = ({ onSubmit,initialValues }) => {
    const [image, setImage] = useState<string | null>(null);
   
    useEffect(() => {
      reset({
        driverName: initialValues?.driverName || "",
        driverContact: initialValues?.driverContact || "",
        driverLicense: initialValues?.driverLicense || "",
        Address: initialValues?.Address || "",
       
      });
    
      if (initialValues?.image) {
        setImage(initialValues.image);
      }
    }, [initialValues]);
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<DriverFormData>({
      defaultValues: {
        driverName: initialValues?.driverName || "",
        driverContact: initialValues?.driverContact || "",
        driverLicense: initialValues?.driverLicense || "",
        Address: initialValues?.Address || "",
      },
    });
  
      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };
      
  

  return (
 
      <ScrollView showsVerticalScrollIndicator={false}>
          {/* Pass the form as a child */}
          <View style={{ alignItems: "center", marginVertical: 20 }}>
  <TouchableOpacity onPress={pickImage}>
    {image ? (
      <Image
        source={{ uri: image }}
        style={{ width: 150, height: 150, borderRadius: 10 }}
        resizeMode="cover"
      />
    ) : (
      <View
        style={{
          width: 150,
          height: 150,
          backgroundColor: "#eee",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
      >
        <Text style={{ color: Colors.primary }}>Tap to select image</Text>
      </View>
    )}
  </TouchableOpacity>
</View>
          <View>
            <Controller
              name="driverName"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Driver name is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Driver Name"
                  placeholder="Enter driver name"
                  value={value}
                  error={errors.driverName?.message}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              name="driverContact"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Contact no is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Contact No"
                  value={value}
                  keyboardType="numeric"
                  error={errors.driverContact?.message}
                  placeholder="Enter contact No"
                  onChange={onChange}
                />
              )}
            />

<Controller
              name="driverLicense"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Driver license is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Driver License No"
                  value={value}
                  error={errors.driverLicense?.message}
                  placeholder="Enter license no"
                  keyboardType="numeric"
                  onChange={onChange}
                />
              )}
            />
            <Controller
              name="Address"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Address is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Address"
                  value={value}
                  error={errors.Address?.message}
                  placeholder="Enter driver address"
                  onChange={onChange}
                />
              )}
            />
            
           
            <View style={styles.footerContainer}>
              <Button label="Submit" onPress={handleSubmit(onSubmit)} />
           
            </View>
          </View>
       </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  }, 
  footerContainer: {
    flex: 1,
    justifyContent: "center",
  },
 
 
  
});

export default AddDriverForm;
