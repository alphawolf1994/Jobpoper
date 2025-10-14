import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Modal from "react-native-modal";
import DropDownPicker from "react-native-dropdown-picker";
import MyTextInput from "./MyTextInput";
import { Colors } from "../utils";

interface PaymentFormProps {
  onAddPaymentMethod: (data: any) => void;
}

const PaymentMethodForm: React.FC<PaymentFormProps> = ({
  onAddPaymentMethod,
}) => {
  // Payment type
  const [openPaymentType, setOpenPaymentType] = useState(false);
  const [paymentType, setPaymentType] = useState<string | null>('mobile');
  const [paymentTypeItems, setPaymentTypeItems] = useState([
    { label: "Mobile Payment", value: "mobile" },
    { label: "Card Payment", value: "card" },
    { label: "Bank Payment", value: "bank" },
    { label: "PayPal", value: "paypal" },
  ]);

  // Mobile
  const [openMobileProvider, setOpenMobileProvider] = useState(false);
  const [mobileProvider, setMobileProvider] = useState<string | null>(null);
  const [mobileProviderItems, setMobileProviderItems] = useState([
    { label: "M-Pesa (Vodacom)", value: "M-Pesa (Vodacom)" },
    { label: "Tigo Pesa", value: "Tigo Pesa" },
    { label: "Airtel Money", value: "Airtel Money" },
    { label: "Halopesa", value: "Halopesa" },
  ]);
  const [mobileNumber, setMobileNumber] = useState("");

  // Card
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Bank
  const [openBank, setOpenBank] = useState(false);
  const [bankName, setBankName] = useState<string | null>(null);
  const [bankItems, setBankItems] = useState([
    { label: "National Bank of Commerce (NBC)", value: "National Bank of Commerce (NBC)" },
    { label: "CRDB Bank", value: "CRDB Bank" },
    { label: "NMB Bank", value: "NMB Bank" },
    { label: "Exim Bank Tanzania", value: "Exim Bank Tanzania" },
    { label: "Stanbic Bank Tanzania", value: "Stanbic Bank Tanzania" },
    { label: "Standard Chartered Bank Tanzania", value: "Standard Chartered Bank Tanzania" },
    { label: "Bank of Africa Tanzania", value: "Bank of Africa Tanzania" },
    { label: "Diamond Trust Bank Tanzania", value: "Diamond Trust Bank Tanzania" },
    { label: "Azania Bank", value: "Azania Bank" },
    { label: "KCB Bank Tanzania", value: "KCB Bank Tanzania" },
  ]);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  // PayPal
  const [paypalEmail, setPaypalEmail] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    let newErrors: { [key: string]: string } = {};

    if (!paymentType) newErrors.paymentType = "Payment type is required";

    if (paymentType === "mobile") {
      if (!mobileProvider) newErrors.mobileProvider = "Mobile provider is required";
      if (!mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    }
    if (paymentType === "card") {
      if (!cardHolderName) newErrors.cardHolderName = "Card holder name is required";
      if (!cardNumber) newErrors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(cardNumber)) newErrors.cardNumber = "Card number must be 16 digits";
      if (!expiryDate) newErrors.expiryDate = "Expiry date is required";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = "Expiry date must be MM/YY";
      } else {
        // Check if expiry is in the future
        const [mm, yy] = expiryDate.split("/");
        const expMonth = parseInt(mm, 10);
        const expYear = 2000 + parseInt(yy, 10);
        const now = new Date();
        const expiry = new Date(expYear, expMonth - 1, 1);
        // Set expiry to last day of the month
        expiry.setMonth(expiry.getMonth() + 1);
        expiry.setDate(0);
        if (expiry < now) {
          newErrors.expiryDate = "Expiry date must be in the future";
        }
      }
      if (!cvv) newErrors.cvv = "CVV is required";
    }
    if (paymentType === "bank") {
      if (!bankName) newErrors.bankName = "Bank name is required";
      if (!accountNumber) newErrors.accountNumber = "Account number is required";
      if (!accountName) newErrors.accountName = "Account name is required";
    }
    if (paymentType === "paypal") {
      if (!paypalEmail) newErrors.paypalEmail = "PayPal email is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Prepare data
    let data: any = { paymentType };
    if (paymentType === "mobile") {
      data = { ...data, mobileProvider, mobileNumber };
    }
    if (paymentType === "card") {
      data = { ...data, cardHolderName, cardNumber, expiryDate, cvv };
    }
    if (paymentType === "bank") {
      data = { ...data, bankName, accountNumber, accountName };
    }
    if (paymentType === "paypal") {
      data = { ...data, paypalEmail };
    }

    onAddPaymentMethod(data);
   
    // Optionally reset form here
  };

  return (
   
      <View style={styles.container}>
        <Text style={styles.title}>Add Payment Method</Text>
        <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Payment Type</Text>
          <DropDownPicker
            open={openPaymentType}
            value={paymentType}
            items={paymentTypeItems}
            setOpen={setOpenPaymentType}
            setValue={setPaymentType}
            setItems={setPaymentTypeItems}
            placeholder="Select Payment Type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
            zIndexInverse={1000}
          />
          {errors.paymentType && <Text style={styles.errorText}>{errors.paymentType}</Text>}

          {/* Mobile Payment */}
          {paymentType === "mobile" && (
            <>
              <Text style={styles.label}>Mobile Provider</Text>
              <DropDownPicker
                open={openMobileProvider}
                value={mobileProvider}
                items={mobileProviderItems}
                setOpen={setOpenMobileProvider}
                setValue={setMobileProvider}
                setItems={setMobileProviderItems}
                placeholder="Select Mobile Provider"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={2000}
                zIndexInverse={1000}
              />
              {errors.mobileProvider && <Text style={styles.errorText}>{errors.mobileProvider}</Text>}
              <MyTextInput
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={setMobileNumber}
                keyboardType="phone-pad"
                error={errors.mobileNumber}
              />
             
            </>
          )}

          {/* Card Payment */}
          {paymentType === "card" && (
            <>
              <MyTextInput
                placeholder="Card Holder Name"
                value={cardHolderName}
                onChange={setCardHolderName}
                error={errors.cardHolderName}
              />
              <MyTextInput
                placeholder="Card Number"
                value={cardNumber}
                onChange={setCardNumber}
                keyboardType="numeric"
                error={errors.cardNumber}
              />
              <MyTextInput
                placeholder="Expiry Date (MM/YY)"
                value={expiryDate}
                onChange={setExpiryDate}
                keyboardType="numeric"
                error={errors.expiryDate}
              />
              <MyTextInput
                placeholder="CVV"
                value={cvv}
                onChange={setCvv}
                keyboardType="numeric"
                error={errors.cvv}
              />
            </>
          )}

          {/* Bank Payment */}
          {paymentType === "bank" && (
            <>
              <Text style={styles.label}>Bank Name</Text>
              <DropDownPicker
                open={openBank}
                value={bankName}
                items={bankItems}
                setOpen={setOpenBank}
                setValue={setBankName}
                setItems={setBankItems}
                placeholder="Select Bank"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={2000}
                zIndexInverse={1000}
              />
              {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}
              <MyTextInput
                placeholder="Account Number"
                value={accountNumber}
                onChange={setAccountNumber}
                keyboardType="numeric"
                error={errors.accountNumber}
              />
              <MyTextInput
                placeholder="Account Name"
                value={accountName}
                onChange={setAccountName}
                error={errors.accountName}
              />
            </>
          )}

          {/* PayPal */}
          {paymentType === "paypal" && (
            <>
              <MyTextInput
                placeholder="PayPal Email"
                value={paypalEmail}
                onChange={setPaypalEmail}
                keyboardType="email-address"
                error={errors.paypalEmail}
              />
            </>
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignSelf: "center",
    maxHeight: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    marginTop: 10,
    marginBottom: 5,
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  dropdownContainer: {
    position: "absolute",
    top: 50,
    zIndex: 1000,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
   container: {
        backgroundColor: Colors.white,
    },
});

export default PaymentMethodForm;
