// ParentLoanRequestForm.tsx
import React, { useEffect, useState } from "react";
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

type ParentLoanRequestData = {
    loanType: string;
    provider: string;
    amount: string;
    interestRate: string;
    startDate: string;
    remarks?: string;
    document?: string;
};





const StationaryLoanRequestForm = ({ onSubmit }: { onSubmit: (data: ParentLoanRequestData) => void }) => {
    const [openType, setOpenType] = useState(false);
    const [openProvider, setOpenProvider] = useState(false);
    const [providerOptions, setProviderOptions] = useState<{ label: string; value: string; rate: string }[]>([]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [documentImage, setDocumentImage] = useState<string | null>(null);
    const [loanTypeOptions, setLoanTypeOption] = useState([
        { label: "Personal Loan", value: "Personal Loan" },
        { label: "Home Loan", value: "Home Loan" },
        { label: "Auto Loan", value: "Auto Loan" },
    ]);
    const [providerMap, setProviderMap] = useState([
        { label: "ABC Micro Finance", value: "ABC Micro Finance", rate: "10" },
        { label: "EduLoan Services", value: "EduLoan Services", rate: "11.5" },
        { label: "XYZ Bank", value: "XYZ Bank", rate: "12" },
        { label: "QuickLoan Inc.", value: "QuickLoan Inc.", rate: "13" },
    ]);
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ParentLoanRequestData>({
        defaultValues: {
            loanType: "",
            provider: "",
            interestRate: "",
            startDate: new Date().toISOString().split("T")[0],
        },
    });

    const selectedType = watch("loanType");
    const selectedProvider = watch("provider");

    // useEffect(() => {
    //     if (selectedType) {
    //         const options = providerMap[selectedType] || [];
    //         setProviderOptions(options);
    //     }
    // }, [selectedType]);

    // useEffect(() => {
    //     if (selectedType && selectedProvider) {
    //         const rate = providerMap[selectedType].find(p => p.value === selectedProvider)?.rate;
    //         if (rate) setValue("interestRate", rate);
    //     }
    // }, [selectedProvider]);

    const pickDocument = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setDocumentImage(result.assets[0].uri);
        }
    };

    const handleDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setValue("startDate", selectedDate.toISOString().split("T")[0]);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Select Loan Type</Text>
            <Controller
                name="loanType"
                control={control}
                rules={{ required: "Loan type is required" }}
                render={({ field: { onChange, value } }) => (
                  
                    <DropDownPicker
                    open={openType}
                    value={value}
                    items={loanTypeOptions}
                    setOpen={setOpenType}
                    setValue={(callback) => onChange(callback(value))}
                    setItems={setLoanTypeOption}
                    placeholder="Select Loan Type"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    zIndex={2000}
                    zIndexInverse={1000}
                />
                )}
            />

            {/* {selectedType && ( */}
                <>
                    <Text style={styles.label}>Select Provider</Text>
                    <Controller
                        name="provider"
                        control={control}
                        rules={{ required: "Provider is required" }}
                        render={({ field: { onChange, value } }) => (
                            <DropDownPicker
                                open={openProvider}
                                value={value}
                                items={providerMap}
                                setOpen={setOpenProvider}
                                setValue={(callback) => onChange(callback(value))}
                                setItems={setProviderMap}
                                placeholder="Select Provider"
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                                zIndex={1500}
                                zIndexInverse={1000}
                            />
                        )}
                    />
                </>
            {/* )} */}

            {/* {selectedProvider && ( */}
                <>
                    <Controller
                        name="amount"
                        control={control}
                        rules={{ required: "Loan amount is required" }}
                        render={({ field: { onChange, value } }) => (
                            <MyTextInput
                                label="Loan Amount"
                                placeholder="Enter amount"
                                keyboardType="numeric"
                                value={value}
                                error={errors.amount?.message}
                                onChange={onChange}
                            />
                        )}
                    />

                    <Controller
                        name="interestRate"
                        control={control}
                        render={({ field: { value } }) => (
                            <MyTextInput
                                label="Interest Rate (%)"
                                value={value}
                                placeholder="Interest Rate"
                                editable={false}
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
                        name="remarks"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <MyTextArea
                                label="Remarks (Optional)"
                                placeholder="Write your remarks"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />

                    <Text style={styles.sectionTitle}>Upload Verification Document</Text>
                    <TouchableOpacity style={styles.imageUpload} onPress={pickDocument}>
                        {documentImage ? (
                            <Image source={{ uri: documentImage }} style={styles.image} />
                        ) : (
                            <Text style={styles.imageText}>Tap to Upload</Text>
                        )}
                    </TouchableOpacity>

                    <Button
                        label="Request Loan"
                        onPress={handleSubmit((data) =>
                            onSubmit({ ...data, document: documentImage || undefined })
                        )}
                    />
                </>
            {/* )} */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        // padding: 16,
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
        marginVertical: 10,
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

export default StationaryLoanRequestForm;
