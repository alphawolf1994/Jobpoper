import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Modal from "react-native-modal";
import DropDownPicker from "react-native-dropdown-picker";
import { Controller, useForm } from "react-hook-form";
import MyTextInput from "./MyTextInput";
import { Colors, CurrencySign } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigation } from "@react-navigation/native";

interface PaymentFormProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirmPayment: (data: any) => void;
    selectedPayment?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ isVisible, onClose, onConfirmPayment, selectedPayment }) => {
    const [buttonDisable, setButtonDisable] = useState(false);
    const navigation = useNavigation()
    const { balance } = useSelector(
        (state: RootState) => state.walletSlice);
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            paymentMethod: "wallet",
            mobileProvider: "M-Pesa (Vodacom)",
            loanProvider: "sbi",
            loanPlan: "16_6",
            loanAmount: "",
            paypalEmail: "",
            phoneNumber1: "",
            transactionPin: "",
            cardHolderName: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            bankName: "",
           
            accountNumber: "",
            accountName: "",
            amount: 0,
            userName: "",
            userEmail: "",
            userPhoneNo: "",
            userCNIC: "",
        },
    });

    const selectedPaymentMethod = watch("paymentMethod");

    useEffect(() => {
        if (isVisible) {
            setValue("paymentMethod", "wallet");
        }
        const selectedPayment1 = selectedPayment?.replace(/,/g, "") || "0";
        const numericValue = parseInt(selectedPayment1, 10) || 0;
        setValue("amount", numericValue);
        if (numericValue > balance) {
            setButtonDisable(true);
        } else {
            setButtonDisable(false);
        }
    }, [isVisible, selectedPayment, balance]);

    const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
    const [paymentMethodItems, setPaymentMethodItems] = useState([
        { label: "Wallet", value: "wallet" },
        { label: "Mobile Payment", value: "mobile" },
        { label: "Card Payment", value: "card" },
        { label: "Bank Payment", value: "bank" },
        { label: "PayPal", value: "paypal" },
        { label: "Request for Loan", value: "loan" },
    ]);
    const [openBankList, setOpenBankList] = useState(false);
    const [bankItems, setbankItems] = useState([
         { label: "National Bank of Commerce (NBC)", value: "nbc" },
        { label: "CRDB Bank", value: "crdb" },
        { label: "NMB Bank", value: "nmb" },
        { label: "Exim Bank Tanzania", value: "exim" },
        { label: "Stanbic Bank Tanzania", value: "stanbic" },
        { label: "Standard Chartered Bank Tanzania", value: "standard_chartered" },
        { label: "Bank of Africa Tanzania", value: "boa" },
        { label: "Diamond Trust Bank Tanzania", value: "dtb" },
        { label: "Azania Bank", value: "azania" },
        { label: "KCB Bank Tanzania", value: "kcb" },
    ]);
    const [openLoanPlan, setOpenLoanPlan] = useState(false);
    const [loanPlanItems, setLoanPlanItems] = useState([
        { label: "16% Interest - 6 Months", value: "16_6" },
        { label: "20% Interest - 12 Months", value: "20_12" },
        { label: "25% Interest - 3 Years", value: "25_36" }
    ]);
    const [openmobileProvider, setOpenMobileProvider] = useState(false);
    const [mobileProviderItem, setMobileProviderItem] = useState([
        { label: "M-Pesa (Vodacom)", value: "M-Pesa (Vodacom)" },
        { label: "Tigo Pesa", value: "Tigo Pesa" },
        { label: "Airtel Money", value: "Airtel Money" },
        { label: "Halopesa", value: "Halopesa" },
    ]);
    const openWalletScreen = () => {
        onClose()
        setTimeout(() => {
            navigation.navigate('WalletScreen')
        }, 500);

    }
    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "center" }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
            >
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
                                        // Navigate to LoanManagementScreen if "loan" is selected
                                        if (callback(value) === "loan") {
                                            onClose();
                                            setTimeout(() => {
                                                navigation.navigate("LoanManagementScreen");
                                            }, 500);
                                        }
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
                                            keyboardType="numeric"
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
                                            keyboardType="numeric"
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
                                            keyboardType="numeric"
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
                                            keyboardType="numeric"
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

                        {selectedPaymentMethod === "paypal" && (
                            <View>

                                <Controller
                                    name="paypalEmail"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Email is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="Email"
                                            value={value}
                                            error={errors.paypalEmail?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />



                            </View>)}


                        {selectedPaymentMethod === "wallet" && (
                            <View>

                                <Text style={{ fontSize: 16, marginVertical: 10 }}>Current Balance: {CurrencySign} {balance}</Text>

                                {buttonDisable && <TouchableOpacity style={[
                                    styles.searchButton,
                                ]} onPress={() => { openWalletScreen() }}>
                                    <Text style={styles.searchText}>Add Money</Text>
                                </TouchableOpacity>}

                            </View>)}


                        {selectedPaymentMethod === "loan" && (
                            <View>
                                <Controller
                                    name="loanProvider"
                                    control={control}
                                   
                                    render={({ field: { onChange, value } }) => (
                                        <DropDownPicker
                                            open={openBankList}
                                            value={value}
                                            items={bankItems}
                                            setOpen={setOpenBankList}
                                            setValue={(callback) => {
                                                const newValue = callback(value);
                                                onChange(newValue);
                                            }}
                                            setItems={setbankItems}
                                            placeholder="Select loan provider"
                                            style={styles.dropdown}
                                            dropDownContainerStyle={styles.dropdownContainer}
                                            zIndex={2000}
                                            zIndexInverse={1000}
                                        />
                                    )}
                                />
                                <Controller
                                    name="loanPlan"
                                    control={control}
                                    rules={{ required: "Loan plan is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <DropDownPicker
                                            open={openLoanPlan}
                                            value={value}
                                            items={loanPlanItems}
                                            setOpen={setOpenLoanPlan}
                                            setValue={(callback) => {
                                                const newValue = callback(value);
                                                onChange(newValue);
                                            }}
                                            setItems={setLoanPlanItems}
                                            placeholder="Select loan Plan"
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
                                            message: "Amount is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            // label="Phone Number"
                                            placeholder="Loan amount"
                                            value={value}
                                            keyboardType="numeric"
                                            error={errors.loanAmount?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />


                                <Controller
                                    name="userName"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Username is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            placeholder="Username"
                                            value={value}
                                            error={errors.userName?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                 <Controller
                                    name="userEmail"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Email is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            placeholder="Email Address"
                                            value={value}
                                            error={errors.userEmail?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                 <Controller
                                    name="userPhoneNo"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Phone no is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            placeholder="Phone Number"
                                            value={value}
                                            error={errors.userPhoneNo?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                 <Controller
                                    name="userCNIC"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "CNIC is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <MyTextInput
                                            placeholder="CNIC No"
                                            value={value}
                                            error={errors.userCNIC?.message}
                                            onChange={onChange}
                                        />
                                    )}
                                />
<TouchableOpacity  style={[
                styles.searchButton ]} onPress={handleSubmit(onConfirmPayment)}>
                <Text style={styles.searchText}>Send Request</Text>
            </TouchableOpacity>
                            </View>)}
                    </View>


                    {selectedPaymentMethod != "loan" && <TouchableOpacity disabled={selectedPaymentMethod === "wallet" && buttonDisable} style={[
                        styles.searchButton,
                        (selectedPaymentMethod === "wallet" && buttonDisable) && styles.disabledButton
                    ]} onPress={handleSubmit(onConfirmPayment)}>
                        <Text style={styles.searchText}>Confirm Payment  {selectedPayment}</Text>
                    </TouchableOpacity>}
                </View>
            </KeyboardAvoidingView>
        </Modal>
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
        alignSelf: 'center'
    },
    disabledButton: {
        backgroundColor: Colors.gray,  // Set a different color for the disabled state
    },
});

export default PaymentForm;
