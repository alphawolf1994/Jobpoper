import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { Colors } from "../../utils";
import { Button, MyTextInput } from "../../components";

type CustomerFormData = {
  customerName: string;
  customerContact: string;
  gender: string;
  dob: string;
  address: string;
  organization?: string;
  idFront?: string;
  idBack?: string;
  selfie?: string;
  accountNumber: string;
  ifscCode: string;
};

type AddCustomerFormProps = {
  onSubmit: (data: CustomerFormData) => void;
  initialValues?: CustomerFormData | null;
};

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: {
      customerName: initialValues?.customerName || "",
      customerContact: initialValues?.customerContact || "",
      gender: initialValues?.gender || "",
      dob: initialValues?.dob || "",
      address: initialValues?.address || "",
      organization: initialValues?.organization || "",
      accountNumber: initialValues?.accountNumber || "",
      ifscCode: initialValues?.ifscCode || "",
    },
  });

  const pickImage = async (setImage: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Controller
          name="customerName"
          control={control}
          rules={{ required: "Customer name is required" }}
          render={({ field: { onChange, value } }) => (
            <MyTextInput
              label="Customer Name"
              placeholder="Enter customer name"
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
            required: "Contact number is required",
            minLength: { value: 10, message: "Minimum 10 digits" },
          }}
          render={({ field: { onChange, value } }) => (
            <MyTextInput
              label="Contact Number"
              placeholder="Enter contact number"
              keyboardType="phone-pad"
              value={value}
              error={errors.customerContact?.message}
              onChange={onChange}
            />
          )}
        />

        <Controller
          name="gender"
          control={control}
          rules={{ required: "Gender is required" }}
          render={({ field: { onChange, value } }) => (
            <MyTextInput
              label="Gender"
              placeholder="Male / Female / Other"
              value={value}
              error={errors.gender?.message}
              onChange={onChange}
            />
          )}
        />

        <Controller
          name="dob"
          control={control}
          rules={{ required: "Date of birth is required" }}
          render={({ field: { onChange, value } }) => (
            <MyTextInput
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              value={value}
              error={errors.dob?.message}
              onChange={onChange}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field: { onChange, value } }) => (
            <MyTextInput
              label="Full Address"
              placeholder="Enter full address"
              value={value}
              error={errors.address?.message}
              onChange={onChange}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Organization (Optional)</Text>
        <Controller
          name="organization"
          control={control}
          render={({ field: { onChange, value } }) => (
            <MyTextInput
              label="Organization"
              placeholder="Enter organization name"
              value={value}
              onChange={onChange}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>KYC Documents</Text>

        {/* ID Front */}
        <Text style={styles.label}>Government ID Front</Text>
        <TouchableOpacity onPress={() => pickImage(setIdFront)} style={styles.imageUpload}>
          {idFront ? (
            <Image source={{ uri: idFront }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Upload Front</Text>
          )}
        </TouchableOpacity>

        {/* ID Back */}
        <Text style={styles.label}>Government ID Back</Text>
        <TouchableOpacity onPress={() => pickImage(setIdBack)} style={styles.imageUpload}>
          {idBack ? (
            <Image source={{ uri: idBack }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Upload Back</Text>
          )}
        </TouchableOpacity>

        {/* Selfie */}
        <Text style={styles.label}>Live Selfie</Text>
        <TouchableOpacity onPress={() => pickImage(setSelfie)} style={styles.imageUpload}>
          {selfie ? (
            <Image source={{ uri: selfie }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Upload Selfie</Text>
          )}
        </TouchableOpacity>
      </View>

     

      <View style={{ marginVertical: 20 }}>
        <Button
          label="Submit"
          onPress={handleSubmit((data) => {
            onSubmit({
              ...data,
              idFront: idFront || undefined,
              idBack: idBack || undefined,
              selfie: selfie || undefined,
            });
          })}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
  },
  imageUpload: {
    height: 150,
    backgroundColor: "#eee",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  image: {
    height: 150,
    width: "100%",
    borderRadius: 10,
  },
  imageText: {
    color: Colors.primary,
  },
});

export default AddCustomerForm;
