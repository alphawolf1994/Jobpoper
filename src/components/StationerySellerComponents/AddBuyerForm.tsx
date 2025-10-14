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
type DriverFormData = {
    customerName: string;
    customerContact: string;
    organization: string;
    Address: string;
    status: string;
  
  };
  
  type AddDriverFormProps = {
    onSubmit: (data: DriverFormData) => void;
    initialValues?: DriverFormData | null;
  };

  const AddBuyerForm: React.FC<AddDriverFormProps> = ({ onSubmit,initialValues }) => {
 
    const [openStatus, setOpenStatus] = useState(false);
    const [statusItems, setStatusItems] = useState([
        { label: "Platinum", value: "Platinum" },
        { label: "Gold", value: "Gold" },
        { label: "Silver", value: "Silver" },
      
    ]);
  
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<DriverFormData>({
      defaultValues: {
        customerName: initialValues?.customerName || "",
        customerContact: initialValues?.customerContact || "",
        organization: initialValues?.organization || "",
        Address: initialValues?.Address || "",
        status: initialValues?.status || "",
      },
    });
  
     
  

  return (
 
      <ScrollView showsVerticalScrollIndicator={false}>
          {/* Pass the form as a child */}
         
          <View>
          <Text style={styles.label}>Loyalty Tier</Text>
            <Controller
                                name="status"
                                control={control}
                                rules={{ required: "Loyalty tier is required" }}
                                render={({ field: { onChange, value } }) => (
                                    <DropDownPicker
                                        open={openStatus}
                                        value={value}
                                        items={statusItems}
                                        setOpen={setOpenStatus}
                                        setValue={(callback) => {
                                            const newValue = callback(value);
                                            onChange(newValue);
                                        }}
                                        setItems={setStatusItems}
                                        placeholder="Select loyalty tier"
                                        style={styles.dropdown}
                                        dropDownContainerStyle={styles.dropdownContainer}
                                        zIndex={1000}
                                        zIndexInverse={1000}
                                    />
                                )}
                            />
            <Controller
              name="customerName"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Buyer name is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Buyer Name"
                  placeholder="Enter buyer name"
                  value={value}
                  error={errors.customerName?.message}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              name="customerContact"
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
                  error={errors.customerContact?.message}
                  placeholder="Enter contact No"
                  onChange={onChange}
                />
              )}
            />

<Controller
              name="organization"
              control={control}
             
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Organization Name"
                  value={value}
                  error={errors.organization?.message}
                  placeholder="Enter organization name"
          
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

export default AddBuyerForm;
