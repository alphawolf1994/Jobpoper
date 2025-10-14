import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";

import { Colors } from "../../utils";
import { Button, MyTextInput } from "../../components";
import { Controller, useForm } from "react-hook-form";

type RouteFormData = {
    routeName: string;
    source: string;
    destination: string;
  
  };
  
  type AddRouteFormProps = {
    onSubmit: (data: RouteFormData) => void;
    initialValues?: RouteFormData | null;
  };

  const AddRouteForm: React.FC<AddRouteFormProps> = ({ onSubmit,initialValues }) => {
   
    
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<RouteFormData>({
      defaultValues: {
        routeName: initialValues?.routeName || "",
        source: initialValues?.source || "",
        destination: initialValues?.destination || "",
        
      },
    });
  
    useEffect(() => {
        if (initialValues) {
          reset({
            routeName: initialValues.routeName,
            source: initialValues.source,
            destination: initialValues.destination,
          });
        }
      }, [initialValues, reset]);  
  

  return (
 
      <ScrollView showsVerticalScrollIndicator={false}>
          {/* Pass the form as a child */}
          
          <View>
            <Controller
              name="routeName"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Driver name is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Route Name"
                  placeholder="Enter route name"
                  value={value}
                  error={errors.routeName?.message}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              name="source"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Source is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Source"
                  value={value}
                  error={errors.source?.message}
                  placeholder="Enter contact No"
                  onChange={onChange}
                />
              )}
            />

<Controller
              name="destination"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Driver license is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Destination"
                  value={value}
                  error={errors.destination?.message}
                  placeholder="Enter destination "
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

export default AddRouteForm;
