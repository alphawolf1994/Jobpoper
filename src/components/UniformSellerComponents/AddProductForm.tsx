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
    productName: string;
    size: string;
    stock: string;
    price: string;
    image:string;
  
  };
  
  type AddDriverFormProps = {
    onSubmit: (data: DriverFormData) => void;
   
  };

  const AddProductForm: React.FC<AddDriverFormProps> = ({ onSubmit }) => {
    const [image, setImage] = useState<string | null>(null);
   
   
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<DriverFormData>({
      
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
              name="productName"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Product name is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Product Name"
                  placeholder="Enter product name"
                  value={value}
                  error={errors.productName?.message}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              name="size"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Size is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Size"
                  value={value}
                  error={errors.size?.message}
                  placeholder="Enter size (e.g S,M,L)"
                  onChange={onChange}
                />
              )}
            />

<Controller
              name="stock"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Stock is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Stock"
                  value={value}
                  error={errors.stock?.message}
                  placeholder="Enter stock"
                  onChange={onChange}
                  keyboardType="numeric"
                />
              )}
            />
            <Controller
              name="price"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Price is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Price"
                  value={value}
                  error={errors.price?.message}
                  placeholder="Enter price"
                  onChange={onChange}
                  keyboardType="numeric"
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

export default AddProductForm;
