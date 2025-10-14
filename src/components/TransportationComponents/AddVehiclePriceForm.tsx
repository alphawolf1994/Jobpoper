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
import DropDownPicker from "react-native-dropdown-picker";
type VehicleFormData = {
    hourlyRate: string;
    distanceRate: string;
    monthlyRate: string;
    vehicleModal: string;
  

  };
  
  type AddVehicleFormProps = {
    onSubmit: (data: VehicleFormData) => void;
    initialValues?: VehicleFormData | null;
  };

  const AddVehiclePriceForm: React.FC<AddVehicleFormProps> = ({ onSubmit,initialValues }) => {
 
    const [vehicleItems, setVehicleItems] = useState([
        { label: "Benz Bus", value: "Benz Bus" },
        { label: "Toyota Bus", value: "Toyota Bus" },
        { label: "Hyundai Bus", value: "Hyundai Bus" },
      
    ]);
    const [openRole, setOpenRole] = useState(false);
    useEffect(() => {
      reset({
        hourlyRate: initialValues?.hourlyRate || "",
        distanceRate: initialValues?.distanceRate || "",
        monthlyRate: initialValues?.monthlyRate || "",
        vehicleModal: initialValues?.vehicleModal || "",
       
      });
    
    
    }, [initialValues]);
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<VehicleFormData>({
      defaultValues: {
        hourlyRate: initialValues?.hourlyRate || "",
        distanceRate: initialValues?.distanceRate || "",
        monthlyRate: initialValues?.monthlyRate || "",
        vehicleModal: initialValues?.vehicleModal || "",
      
      },
    });
  
   
      
  

  return (
 
      <ScrollView showsVerticalScrollIndicator={false}>
          {/* Pass the form as a child */}
         
          <View>
          <Text style={styles.label}>Select Vehicle</Text>
                <Controller
                            name="vehicleModal"
                            control={control}
                            rules={{ required: "Vehicle is required" }}
                            render={({ field: { onChange, value } }) => (
                                <>
            <DropDownPicker
                open={openRole}
                value={value}
                items={vehicleItems}
                setOpen={setOpenRole}
                setValue={(callback) => {
                    const newValue = callback(value);
                    onChange(newValue);
                }}
                setItems={setVehicleItems}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={3000}
                zIndexInverse={1000}
            />
          {errors.vehicleModal?.message && (
    <Text style={{ color: "red", marginTop: 5 }}>
        {String(errors.vehicleModal.message)}
    </Text>
)}
        </>
                            )}
                        />
            <Controller
              name="hourlyRate"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Hourly rate is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Hourly Price"
                  placeholder="Enter Price"
                  value={value}
                  keyboardType="numeric"
                  error={errors.hourlyRate?.message}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              name="distanceRate"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "distance rate is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Distance Price"
                  value={value}
                  keyboardType="numeric"
                  error={errors.distanceRate?.message}
                  placeholder="Enter price"
                  onChange={onChange}
                />
              )}
            />

<Controller
              name="monthlyRate"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Monthly rate is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Monthly Price"
                  value={value}
                  keyboardType="numeric"
                  error={errors.monthlyRate?.message}
                  placeholder="Enter price"
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
 
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.gray,

},
dropdownContainer: {
    position: "absolute",
    top: 50,

},
label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    color: Colors.black,
  },
  
});

export default AddVehiclePriceForm;
