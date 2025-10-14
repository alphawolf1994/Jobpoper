import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import DropDownPicker from "react-native-dropdown-picker";
import { Controller, useForm } from "react-hook-form";
import MyTextInput from "./MyTextInput";
import { Colors } from "../utils";

interface AddMoneyToWalletProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirmPayment: (data: any) => void;
}

const AddMoneyToWallet: React.FC<AddMoneyToWalletProps> = ({ isVisible, onClose, onConfirmPayment }) => {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            
            amount: "",
            paymentMethod: "mobile",
            mobileProvider: "M-Pesa (Vodacom)",
            paypalEmail:"",
            phoneNumber1: "",
            transactionPin: "",
            cardHolderName: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            bankName: "",
            branchName: "",
            accountNumber: "",
            accountName: "",
        },
    });

    const selectedPaymentMethod = watch("paymentMethod");

    useEffect(() => {
        if (isVisible) {
            reset({
                amount: "",
                paymentMethod: "mobile",
                mobileProvider: "M-Pesa (Vodacom)",
                paypalEmail:"",
                phoneNumber1: "",
                transactionPin: "",
                cardHolderName: "",
                cardNumber: "",
                expiryDate: "",
                cvv: "",
                bankName: "",
                branchName: "",
                accountNumber: "",
                accountName: "",
            });
        }
    }, [isVisible]);

    const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
    const [paymentMethodItems, setPaymentMethodItems] = useState([
        { label: "Mobile Payment", value: "mobile" },
        { label: "Card Payment", value: "card" },
        { label: "Bank Payment", value: "bank" },
        { label: "PayPal", value: "paypal" },
    ]);
    const [openmobileProvider, setOpenMobileProvider] = useState(false);
    const [mobileProviderItem, setMobileProviderItem] = useState([
        { label: "M-Pesa (Vodacom)", value: "M-Pesa (Vodacom)" },
        { label: "Tigo Pesa", value: "Tigo Pesa" },
        { label: "Airtel Money", value: "Airtel Money" },
        { label: "Halopesa", value: "Halopesa" },
    ]);

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Money to Wallet</Text>

             

                {/* Amount Input */}
                <Controller
                    name="amount"
                    control={control}
                    rules={{ required: "Amount is required" }}
                    render={({ field: { onChange, value } }) => (
                        <MyTextInput
                            placeholder="Enter Amount"
                            keyboardType="numeric"
                            value={value}
                            error={errors.amount?.message}
                            onChange={onChange}
                        />
                    )}
                />

                {/* Payment Method Dropdown */}
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

                {/* Confirm & Cancel Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit(onConfirmPayment)}>
                        <Text style={styles.buttonText}>Confirm Payment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    dropdown: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    dropdownContainer: {
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        flex: 1,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default AddMoneyToWallet;
