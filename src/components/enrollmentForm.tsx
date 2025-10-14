import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList, Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Colors, heightToDp, widthToDp } from "../utils";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "react-native-gesture-handler";
import Checkbox from "expo-checkbox";
import { fetchSchoolNameSuggestions, fetchLocationSuggestions } from "../redux/slices/filterSchoolSlice";
import { School } from "../interface/interfaces";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import ImagePath from "../assets/images/ImagePath";
import { Controller, useForm } from "react-hook-form";
import MyTextInput from "./MyTextInput";
import MyTextArea from "./MyTextArea";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { submitEnrollment } from "../redux/slices/enrollmentSlice";
import PaymentForm from "./paymentForm";

interface SearchFilterProps {
    onCloseEnrollment: () => void;
    selectedSchool: School | null;
    enrollBottomSheetRef:any;
}





const EnrollmentForm: React.FC<SearchFilterProps> = ({ onCloseEnrollment, selectedSchool,enrollBottomSheetRef }) => {
    const {
        control,
        handleSubmit,
        watch,
        setValue,  // Used to set default value
        formState: { errors },
    } = useForm({
        defaultValues: {
            paymentMethod: "mobile",
            Standard: 'Standard 1 - $10',
            studentName: '',
            parentName: '',
            phoneNumber: '',
            email: '',
            message: '',
            mobileProvider: 'M-Pesa (Vodacom)',
            phoneNumber1: '',
            transactionPin: '',
            cardHolderName: '',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            bankName: '',
            branchName: '',
            accountNumber: '',
            accountName: '',



        },
    });
    const selectedPaymentMethod = watch("paymentMethod"); // Watching for paymentMethod changes
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector(
        (state: RootState) => state.enrollmentSlice
    );
    // const {
    //     control,
    //     handleSubmit,
    //     watch,
    //     formState: { errors },
    // } = useForm();

    const onSubmit = async (data: any) => {
     
      
        setPaymentModal(true)
        // setTimeout(() => {
        //     enrollBottomSheetRef.current?.close()
        // }, 1000);
    }
    const onSubmit1 = async (data: any) => {

        const payload = {
            studentName: data.studentName,
            parentName: data.parentName,
            standard: data.Standard,
            phoneNumber: data.phoneNumber,
            email: data.email,
            message: data.message,
            schoolId: selectedSchool?._id
        }
      

        // setPaymentModal(false)
          enrollBottomSheetRef.current?.close()
        try {
            const resultAction = await dispatch(submitEnrollment(payload));
           
            if (submitEnrollment.fulfilled.match(resultAction)) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Your enrollment was successful! We will get back to you soon...",
                });
                setPaymentModal(false)
                // onCloseEnrollment()
            } else {
                
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: resultAction.payload ? String(resultAction.payload) : "Enrollment Failed",
                });
                setPaymentModal(false)
                // onCloseEnrollment()
            }
        } catch (error: any) {

            Toast.show({
                type: "error",
                text1: "Error",
                text2: error?.message || "Enrollment Failed",
            });
            setPaymentModal(false)
            // onCloseEnrollment()
        }
  
    }
    const [PaymentModal, setPaymentModal] = useState(false);
    const [openStandard, setOpenStandard] = useState(false);
    const [standard, setstandard] = useState<string | null>(null);
    const [standardItems, setStandardItems] = useState([
        { label: "Standard 1 - $10", value: "Standard 1 - $10" },
        { label: "Standard 2 - $15", value: "Standard 2 - $15" },
        { label: "Standard 3 - $20", value: "Standard 3 - $20" },
        { label: "Standard 4 - $25", value: "Standard 4 - $25" },
        { label: "Standard 5 - $30", value: "Standard 5 - $30" },
        { label: "Standard 6 - $35", value: "Standard 6 - $35" },
        { label: "Standard 7 - $40", value: "Standard 7 - $50" },


    ]);
    useEffect(() => {
        if (PaymentModal) {
            setValue("paymentMethod", "mobile"); // Reset payment method when modal opens
        }
    }, [PaymentModal]);
    const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
    const [paymentMethodItems, setPaymentMethodItems] = useState([
        { label: "Mobile Payment", value: "mobile" },
        { label: "Card Payment", value: "card" },
        { label: "Bank Payment", value: "bank" },
    ]);
    const [openmobileProvider, setOpenMobileProvider] = useState(false);
    const [mobileProviderItem, setMobileProviderItem] = useState([
        { label: "M-Pesa (Vodacom)", value: "M-Pesa (Vodacom)" },
        { label: "Tigo Pesa", value: "Tigo Pesa" },
        { label: "Airtel Money", value: "Airtel Money" },
    ]);
    const onClose = () => {
        setPaymentModal(false)
    }



    return (

        <View style={styles.container}>
            <Text style={styles.label}>Enroll Now</Text>
            <View style={styles.secondContainer}>
                <View style={styles.schoolLogo}>
                    <Image
                        style={{
                            width: widthToDp(20),
                            height: heightToDp(10),
                            // resizeMode: "cover",

                        }}
                        source={selectedSchool?.logo ? { uri: selectedSchool.logo } : ImagePath.defaultAvatar}
                    />

                </View>
                <View style={styles.schoolDetails}>
                    <Text style={styles.SchoolName}>{selectedSchool?.contactName}</Text>
                    <View style={styles.detailRow}>
                        <FontAwesome name="phone" size={20} color={Colors.darkGray} style={styles.icon} />
                        <Text style={styles.principalName}>{selectedSchool?.primaryPhoneNumber}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialIcons name="email" size={20} color={Colors.darkGray} style={styles.icon} />
                        <Text style={styles.principalName}>{selectedSchool?.emailID}</Text>
                    </View>
                </View>

            </View>
            <View style={styles.inputContainer}>

                <Controller
                    name="Standard"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Student name is required",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <DropDownPicker
                            open={openStandard}
                            value={value}
                            items={standardItems}
                            setOpen={setOpenStandard}
                            setValue={(callback) => {
                                const newValue = callback(value);
                                onChange(newValue);  // Update form state
                            }}
                            setItems={setStandardItems}
                            placeholder="Select Standard"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            zIndex={3000} // Prevents dropdown being hidden behind other elements
                            zIndexInverse={1000}
                        />
                    )}
                />
                <Controller
                    name="studentName"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Student name is required",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <MyTextInput
                            // label="Student Name"
                            placeholder="Student Name"
                            value={value}
                            error={errors.studentName?.message}
                            onChange={onChange}
                        />
                    )}
                />
                <Controller
                    name="parentName"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Parent name is required",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <MyTextInput
                            // label="Parent Name"
                            placeholder="Parent Name"
                            value={value}
                            error={errors.parentName?.message}
                            onChange={onChange}
                        />
                    )}
                />
                <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Phone number is required",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <MyTextInput
                            // label="Phone Number"
                            placeholder="Phone Number"
                            value={value}
                            keyboardType="numeric"
                            error={errors.phoneNumber?.message}
                            onChange={onChange}
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Email is required",
                        },
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: "Invalid email address",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <MyTextInput
                            // label="Email"
                            placeholder="Parent email"
                            value={value}
                            error={errors.email?.message}
                            onChange={onChange}
                        />
                    )}
                />
                <Controller
                    name="message"
                    control={control}

                    render={({ field: { onChange, value } }) => (
                        <MyTextArea
                            // label="Email"
                            placeholder="Message"
                            value={value}
                            error={errors.message?.message}
                            onChange={onChange}
                        />
                    )}
                />
            </View>






            <TouchableOpacity style={styles.searchButton} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.searchText}>Proceed</Text>
            </TouchableOpacity>
            <PaymentForm
                isVisible={PaymentModal}
                onClose={() => setPaymentModal(false)}
                onConfirmPayment={handleSubmit(onSubmit1)}
            />
            {/* <Modal isVisible={PaymentModal} onBackdropPress={onClose} >
                <View style={styles.modalContent}>
                    <Text>Choose Payment Method</Text>
                    <View style={styles.inputContainer}>

                        <Controller
                            name="paymentMethod"
                            control={control}
                            rules={{ required: "Payment Method is required" }}
                            render={({ field: { onChange, value } }) => (
                                <DropDownPicker
                                    open={openPaymentMethod}
                                    value={value}
                                    items={paymentMethodItems}
                                    setOpen={setOpenPaymentMethod}
                                    setValue={(callback) => {
                                        const newValue = callback(value);
                                        onChange(newValue);
                                    }}
                                    setItems={setPaymentMethodItems}
                                    placeholder="Select Payment Method"
                                    style={styles.dropdown}
                                    dropDownContainerStyle={styles.dropdownContainer}
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                />
                            )}
                        />
                        {selectedPaymentMethod === "mobile" && (
                            <View>
                                <Controller
                                    name="mobileProvider"
                                    control={control}
                                    rules={{ required: "Mobile provider is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <DropDownPicker
                                            open={openmobileProvider}
                                            value={value}
                                            items={mobileProviderItem}
                                            setOpen={setOpenMobileProvider}
                                            setValue={(callback) => {
                                                const newValue = callback(value);
                                                onChange(newValue);
                                            }}
                                            setItems={setMobileProviderItem}
                                            placeholder="Select Payment Method"
                                            style={styles.dropdown}
                                            dropDownContainerStyle={styles.dropdownContainer}
                                            zIndex={2000}
                                            zIndexInverse={1000}
                                        />
                                    )}
                                />
                                <Controller
                                    name="phoneNumber1"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Phone number is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="Phone Number"
                                            value={value}
                                            error={errors.phoneNumber1?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    name="transactionPin"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Pin is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="Enter Pin"
                                            secureTextEntry
                                            value={value}
                                            error={errors.transactionPin?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </View>)}


                        {selectedPaymentMethod === "card" && (
                            <View>

                                <Controller
                                    name="cardHolderName"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Name is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="Card holder name"
                                            value={value}
                                            error={errors.cardHolderName?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    name="cardNumber"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Card number is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="1234 5678 9012 3456"
                                            value={value}
                                            error={errors.cardNumber?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    name="expiryDate"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Expiry date is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="MM/YY"
                                            value={value}
                                            error={errors.expiryDate?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    name="cvv"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Cvv is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="123"
                                            value={value}
                                            error={errors.cvv?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </View>)}


                        {selectedPaymentMethod === "bank" && (
                            <View>

                                <Controller
                                    name="bankName"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Bank name is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="Bank name"
                                            value={value}
                                            error={errors.bankName?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    name="branchName"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Branch name is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="Branch Name"
                                            value={value}
                                            error={errors.branchName?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    name="accountNumber"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Account number is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="123456789"
                                            value={value}
                                            error={errors.accountNumber?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    name="accountName"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Account name is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="Account Name"
                                            value={value}
                                            error={errors.accountName?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </View>)}



                    </View>


                    <TouchableOpacity style={styles.searchButton} onPress={handleSubmit(onSubmit1)}>
                        <Text style={styles.searchText}>Confirm Payment</Text>
                    </TouchableOpacity>
                </View>
            </Modal> */}
        </View>


    );
};

const styles = StyleSheet.create({
    secondContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        paddingVertical: 15
    },
    schoolLogo: {
        flexDirection: "row",
        alignItems: "center",
        width: '30%'

    },
    schoolDetails: {

        width: '70%',

    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    icon: {
        marginRight: 10, // Space between icon and text
    },
    SchoolName: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    principalName: {
        fontSize: 14,

        paddingRight: 20,
        color: Colors.darkGray,
    },

    container: {
        padding: 0,
        position: "relative",
    },


    dropdownWrapper: {
        flex: 1,
        marginRight: 10,

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
    searchButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
        zIndex: 0,
    },
    searchText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    inputContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.black,
        marginBottom: 5,
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
});

export default EnrollmentForm;
