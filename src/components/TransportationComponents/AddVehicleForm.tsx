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
type VehicleFormData = {
    vehicleNo: string;
    vehicleModal: string;
    yearOfManufacture: string;
    chassisNo: string;
    capacity: string;
    image?: string;

  };
  
  type AddVehicleFormProps = {
    onSubmit: (data: VehicleFormData) => void;
    initialValues?: VehicleFormData | null;
  };

  const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onSubmit,initialValues }) => {
    const [image, setImage] = useState<string | null>(null);
   
    useEffect(() => {
      reset({
        vehicleNo: initialValues?.vehicleNo || "",
        vehicleModal: initialValues?.vehicleModal || "",
        yearOfManufacture: initialValues?.yearOfManufacture || "",
        chassisNo: initialValues?.chassisNo || "",
        capacity: initialValues?.capacity || "",
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
    } = useForm<VehicleFormData>({
      defaultValues: {
        vehicleNo: initialValues?.vehicleNo || "",
        vehicleModal: initialValues?.vehicleModal || "",
        yearOfManufacture: initialValues?.yearOfManufacture || "",
        chassisNo: initialValues?.chassisNo || "",
        capacity: initialValues?.capacity || "",
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
              name="vehicleNo"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Vehicle number is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Vehicle No"
                  placeholder="Enter vehicle no"
                  value={value}
                  error={errors.vehicleNo?.message}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              name="vehicleModal"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Vehicle modal is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Vehicle Modal"
                  value={value}
                  error={errors.vehicleModal?.message}
                  placeholder="Enter vehicle modal"
                  onChange={onChange}
                />
              )}
            />

<Controller
              name="yearOfManufacture"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Vehicle yaer is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Year Of Manufacture"
                  value={value}
                  error={errors.yearOfManufacture?.message}
                  placeholder="Enter vehicle yaer"
                  keyboardType="numeric"
                  onChange={onChange}
                />
              )}
            />
            <Controller
              name="chassisNo"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Vehicle yaer is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Chassis No"
                  value={value}
                  error={errors.chassisNo?.message}
                  placeholder="Enter chassis no"
                  onChange={onChange}
                />
              )}
            />
             <Controller
              name="capacity"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Vehicle yaer is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Capacity"
                  value={value}
                  error={errors.capacity?.message}
                  placeholder="Enter capacity"
                  keyboardType="numeric"
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

export default AddVehicleForm;
