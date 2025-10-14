import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,

} from "react-native";

import { Colors, heightToDp, widthToDp } from "../../utils";
import { Header, Button, MyTextInput, ErrorText } from "../../components";
import { Controller, useForm } from "react-hook-form";
import MyTextArea from "../MyTextArea";

type InterestRateRange = {
  amount: string;
  rate: string;
};

type DriverFormData = {
  serviceName: string;
  interestRate: string;
  description: string;
  interestRateRanges?: InterestRateRange[];
};
  
  type AddDriverFormProps = {
    onSubmit: (data: DriverFormData) => void;
    initialValues?: DriverFormData | null;
  };

  const AddServiceForm: React.FC<AddDriverFormProps> = ({ onSubmit,initialValues }) => {
 
   
    useEffect(() => {
      reset({
        serviceName: initialValues?.serviceName || "",
        interestRate: initialValues?.interestRate || "",
        description: initialValues?.description || "",
        interestRateRanges: initialValues?.interestRateRanges || [],
       
       
      });
      setRanges(initialValues?.interestRateRanges || []);
   
    }, [initialValues]);
    const [ranges, setRanges] = useState<InterestRateRange[]>(initialValues?.interestRateRanges || []);

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<DriverFormData>({
      defaultValues: {
        serviceName: initialValues?.serviceName || "",
        interestRate: initialValues?.interestRate || "",
        description: initialValues?.description || "",
        interestRateRanges: initialValues?.interestRateRanges || [],
      },
      
    });
  
    const handleAddRange = () => {
      setRanges(prev => [...prev, { amount: "", rate: "" }]);
    };
      
    const handleRangeChange = (index: number, key: keyof InterestRateRange, value: string) => {
      const updated = [...ranges];
      updated[index][key] = value;
      setRanges(updated);
    };
    const handleFormSubmit = (data: DriverFormData) => {
      onSubmit({ ...data, interestRateRanges: ranges });
    };
  return (
 
      <ScrollView showsVerticalScrollIndicator={false}>
          {/* Pass the form as a child */}
         
          <View>
            <Controller
              name="serviceName"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Service name is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Service Name"
                  placeholder="Enter service name"
                  value={value}
                  error={errors.serviceName?.message}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              name="interestRate"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Interest rate is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextInput
                  label="Interest Rate Type"
                  value={value}
                  error={errors.interestRate?.message}
                  placeholder="eg.monthly or  yearly"
                  onChange={onChange}
                />
              )}
            />

<Controller
              name="description"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Description is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextArea
                  label="Description"
                  value={value}
                  error={errors.description?.message}
                  placeholder="Enter description"
                  onChange={onChange}
                />
              )}
            />
          {/* Dynamic Interest Rate Ranges */}
        {ranges.map((range, index) => (
          <View key={index} style={{ marginBottom: 10,flex:1,flexDirection:'row',justifyContent:'space-between' }}>
            <View style={{width:'45%'}}>
            <MyTextInput
              label={`Amount ${index + 1}`}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={range.amount}
              onChange={(value) => handleRangeChange(index, "amount", value)}
            />
            </View>
            <View style={{width:'45%'}}>
            <MyTextInput
              label={`Interest Rate ${index + 1}`}
              placeholder="Enter interest rate"
              value={range.rate}
              onChange={(value) => handleRangeChange(index, "rate", value)}
            />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.paidFeeContainer} onPress={handleAddRange}>
          <Text style={styles.feeText}>Add Interest Rate Range</Text>
        </TouchableOpacity>
            
           
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
  paidFeeContainer:{
    flex:1,
    width:'60%',
   alignSelf:'flex-end',
       alignItems: "center",
       backgroundColor:Colors.primary,
       paddingHorizontal:10,
       paddingVertical:5,
       borderRadius:10,
       marginTop:10
     },
    
     feeText:{
       marginLeft: 8,
       fontSize: 16, 
       fontWeight:'bold',
       color:Colors.white
     },
 
  
});

export default AddServiceForm;
