import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import { Colors, heightToDp, widthToDp } from "../../utils";
import { Header, Button, MyTextInput, ErrorText } from "../../components";
import { Controller, useForm } from "react-hook-form";
import MyTextArea from "../MyTextArea";
import * as DocumentPicker from "expo-document-picker";
import { Feather } from "@expo/vector-icons";
type BidFormData = {
    proposalFile: string;
    bidDescription: string;
  
  };
  
  type AddBidFormProps = {
    onSubmit: (data: BidFormData) => void;
  };
  type DocumentPickerResult = {
    assets: DocumentPickerAsset[];
    canceled: boolean;
  }
  
  type DocumentPickerAsset = {
    uri: string;
    name: string;
    size?: number;
    mimeType?: string;
  }
  
  const AddBidForm: React.FC<AddBidFormProps> = ({ onSubmit }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
      } = useForm<BidFormData>()
    const pickedFile = watch("proposalFile");
    const pickDocument = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({
            type: "*/*",
            copyToCacheDirectory: true,
          });
      
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const file = result.assets[0];
            setValue("proposalFile", file.uri); // or store the full `file` object if needed
          }
        } catch (err) {
          console.error("File picking error", err);
        }
      };
    
  return (
 
      <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Controller
              name="bidDescription"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "description is required",
                },
               
              }}
              render={({ field: { onChange, value } }) => (
                <MyTextArea
                  label="Description"
                  value={value}
                  error={errors.bidDescription?.message}
                  placeholder="Enter description"
                  onChange={onChange}
                />
              )}
            />
 {/* File Picker */}
 <Text style={styles.label}>Attach File</Text>
        <TouchableOpacity style={styles.filePicker} onPress={pickDocument}>
          <Feather name="paperclip" size={20} color={Colors.primary} />
          <Text style={styles.fileText}>
            {pickedFile ? pickedFile.split("/").pop() : "Choose File"}
          </Text>
        </TouchableOpacity>
        {errors.proposalFile && (
            <Text>{errors.proposalFile.message}</Text>
        )}
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
  label: {
    marginTop: heightToDp("2%"),
    marginBottom: heightToDp("1%"),
    fontWeight: "600",
    fontSize: 16,
    color: Colors.black,
  },
  filePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  fileText: {
    marginLeft: 10,
    color: Colors.black,
  },
  footerContainer: {
    flex: 1,
    justifyContent: "center",
  },

 
  
});

export default AddBidForm;
