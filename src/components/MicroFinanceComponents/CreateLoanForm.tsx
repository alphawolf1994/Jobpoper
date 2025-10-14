import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../../utils";
import { Button, MyTextInput } from "../../components";
import MyTextArea from "../MyTextArea";

type CustomerFormData = {
    customerName: string;
    service: string;
    loanAmount: string;
    interestRate: string;
    tenure: string;
    startDate: string;
    collateralDescription?: string;
    guarantorName?: string;
    guarantorContact?: string;
    remarks?: string;
    document1?: string;
    document2?: string;
};

const interestRateMap: Record<string, string> = {
    "Personal Loan": "12",
    "Home Loan": "9",
    "Auto Loan": "10.5",
};

const requiredDocsMap: Record<string, string[]> = {
    "Home Loan": ["Property Papers", "Salary Slips"],
    "Auto Loan": ["Vehicle Quotation", "Driving License"],
    "Personal Loan": ["ID Proof", "Bank Statement"],
};

const CreateLoanForm = ({ onSubmit }: { onSubmit: (data: CustomerFormData) => void }) => {
    const [openCustomer, setOpenCustomer] = useState(false);
    const [openLoanService, setOpenLoanService] = useState(false);
    const [customerItem, setCustomerItem] = useState([
        { label: "Mr. Imran Khan", value: "Mr. Imran Khan" },
        { label: "Ayesha Ali", value: "Ayesha Ali" },
    ]);
    const [loanServiceItems, setLoanServiceItems] = useState([
        { label: "Personal Loan", value: "Personal Loan" },
        { label: "Home Loan", value: "Home Loan" },
        { label: "Auto Loan", value: "Auto Loan" },
    ]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [documentImages, setDocumentImages] = useState<string[]>([]);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CustomerFormData>({
        defaultValues: {
            customerName: "",
            service: "",
            interestRate: "",
            startDate: new Date().toISOString().split("T")[0],
        },
    });

    const selectedService = watch("service");
    const requiredDocs = requiredDocsMap[selectedService] || [];

    useEffect(() => {
        if (selectedService) {
            const rate = interestRateMap[selectedService];
            setValue("interestRate", rate);
        }
    }, [selectedService]);

    const pickImage = async (index: number) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const updatedImages = [...documentImages];
            updatedImages[index] = result.assets[0].uri;
            setDocumentImages(updatedImages);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setValue("startDate", selectedDate.toISOString().split("T")[0]);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Select Customer</Text>
            <Controller
                name="customerName"
                control={control}
                rules={{ required: "Customer is required" }}
                render={({ field: { onChange, value } }) => (
                    <DropDownPicker
                        open={openCustomer}
                        value={value}
                        items={customerItem}
                        setOpen={setOpenCustomer}
                        setValue={(callback) => onChange(callback(value))}
                        setItems={setCustomerItem}
                        placeholder="Select Customer"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={2000}
                        zIndexInverse={1000}
                    />
                )}
            />

            <Text style={styles.label}>Select Loan Service</Text>
            <Controller
                name="service"
                control={control}
                rules={{ required: "Loan service is required" }}
                render={({ field: { onChange, value } }) => (
                    <DropDownPicker
                        open={openLoanService}
                        value={value}
                        items={loanServiceItems}
                        setOpen={setOpenLoanService}
                        setValue={(callback) => onChange(callback(value))}
                        setItems={setLoanServiceItems}
                        placeholder="Select Loan Service"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={1000}
                        zIndexInverse={1000}
                    />
                )}
            />
  <Controller
                name="loanAmount"
                control={control}
                rules={{
                    required: {
                        value: true,
                        message: "Loan amount is required",
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <MyTextInput
                        label="Loan Amount"
                        placeholder="Amount"
                        value={value}
                        error={errors.loanAmount?.message}
                        keyboardType="numeric"
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
                        label="Interest Rate (%)"
                        placeholder="Interest Rate (%)"
                        value={value}
                        error={errors.interestRate?.message}
                      
                        onChange={onChange}
                    />
                )}
            />
            <Controller
                name="tenure"
                control={control}
                rules={{
                    required: {
                        value: true,
                        message: "tenure is required",
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <MyTextInput
                        label="Repayment Tenure (months)"
                        placeholder="Months"
                        value={value}
                        error={errors.loanAmount?.message}
                        keyboardType="numeric"
                        onChange={onChange}
                    />
                )}
            />
            
       
            <Text style={styles.label}>Start Date</Text>
            <Controller
                name="startDate"
                control={control}
                render={({ field: { value } }) => (
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.dateField}>{value}</Text>
                    </TouchableOpacity>
                )}
            />
            {showDatePicker && (
                <DateTimePicker value={new Date()} mode="date" display="default" onChange={handleDateChange} />
            )}

            <Controller
                name="collateralDescription"
                control={control}

                render={({ field: { onChange, value } }) => (
                    <MyTextInput
                        label="Collateral Description (Optional)"
                        placeholder="Description"
                        value={value}
                        error={errors.collateralDescription?.message}
                        onChange={onChange}
                    />
                )}
            />

          
            <Controller
                name="guarantorName"
                control={control}
                rules={{
                    required: {
                        value: true,
                        message: "Guarantor name is required",
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <MyTextInput
                        label="Guarantor Name"
                        placeholder="Guarantor name"
                        value={value}
                        error={errors.guarantorName?.message}
                        onChange={onChange}
                    />
                )}
            />
          <Controller
                name="guarantorContact"
                control={control}
                rules={{
                    required: {
                        value: true,
                        message: "Guarantor contact is required",
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <MyTextInput
                        label="Guarantor Contact"
                        placeholder="Guarantor contact"
                        value={value}
                        error={errors.guarantorContact?.message}
                        keyboardType="phone-pad"
                        onChange={onChange}
                    />
                )}
            />
            <Controller
                name="remarks"
                control={control}
              
                render={({ field: { onChange, value } }) => (
                    <MyTextArea
                        label="Remarks"
                        placeholder="Remarks"
                        value={value}
                        error={errors.remarks?.message}
                       
                        onChange={onChange}
                    />
                )}
            />

       

            {requiredDocs.length > 0 && (
                <View>
                    <Text style={styles.sectionTitle}>Upload Required Documents</Text>
                    {requiredDocs.map((docLabel, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                            <Text style={[styles.label,{marginBottom:20}]}>{docLabel}</Text>
                            <TouchableOpacity
                                style={styles.imageUpload}
                                onPress={() => pickImage(index)}
                            >
                                {documentImages[index] ? (
                                    <Image source={{ uri: documentImages[index] }} style={styles.image} />
                                ) : (
                                    <Text style={styles.imageText}>Tap to Upload</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <Button
                label="Submit"
                onPress={handleSubmit((data) => {
                    const fullData = {
                        ...data,
                        document1: documentImages[0],
                        document2: documentImages[1],
                    };
                    onSubmit(fullData);
                })}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 16,
    },
    label: {
        fontWeight: "500",
        marginTop: 20,
    },
    dropdown: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    dropdownContainer: {
        position: "absolute",
        top: 50,
        zIndex: 2000,
    },
    dateField: {
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 6,
        marginTop: 10,
    },
    sectionTitle: {
        fontWeight: "600",
        fontSize: 16,
        marginTop: 20,
    },
    imageUpload: {
        height: 150,
        backgroundColor: "#eee",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
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

export default CreateLoanForm;
