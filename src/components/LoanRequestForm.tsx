// ParentLoanRequestForm.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../utils";
import { Button, MyTextInput } from ".";
import MyTextArea from "./MyTextArea";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { Ionicons } from "@expo/vector-icons"; // For back icon

type ParentLoanRequestData = {
    loanType: string;
    provider: string;
    amount: string;
    fullName: string;
    email: string;
    remarks?: string;
};

const LoanRequestForm = ({ onSubmit }: { onSubmit: (data: ParentLoanRequestData) => void }) => {
    const {  user } = useSelector(
        (state: RootState) => state.auth
    );
    const [loanType, setLoanType] = useState("");
    const [amount, setAmount] = useState("");
    const [fullName, setFullName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [remarks, setRemarks] = useState("");
    const [searched, setSearched] = useState(false);
    const [loanOptions, setLoanOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
 
    const [openType, setOpenType] = useState(false);
    const [loanTypeOptions, setLoanTypeOption] = useState([
        { label: "Education Loan", value: "Education Loan" },
        { label: "Personal Loan", value: "Personal Loan" },
        { label: "Automobile Loan", value: "Automobile Loan" },
        { label: "Car Loan", value: "Car Loan" },
        { label: "Tuition Fee Loan", value: "Tuition Fee Loan" },
        { label: "School Infrastructure Loan", value: "School Infrastructure Loan" },
        { label: "Learning Material Loan", value: "Learning Material Loan" },
        { label: "Technology Upgrade Loan", value: "Technology Upgrade Loan" },
        { label: "Library Development Loan", value: "Library Development Loan" },
        { label: "Transport Facility Loan", value: "Transport Facility Loan" },
        { label: "Hostel Facility Loan", value: "Hostel Facility Loan" },
        { label: "Sports annd Recreation Loan", value: "Sports annd Recreation Loan" },
        { label: "Smart Classroom Setup Loan", value: "Smart Classroom Setup Loan" },
        { label: "General Purpose School Loan", value: "General Purpose School Loan" },
    ]);

    // Static vendor data
    const staticVendors = [
        {
            _id: "vendor1",
            vendor: { name: "EduFinance Bank" },
            minAmount: "₹50,000",
            maxAmount: "₹5,00,000",
            interestRate: "8.5",
            tenureMonths: "24"
        },
        {
            _id: "vendor2", 
            vendor: { name: "School Credit Union" },
            minAmount: "₹25,000",
            maxAmount: "₹3,00,000",
            interestRate: "9.2",
            tenureMonths: "36"
        },
        {
            _id: "vendor3",
            vendor: { name: "Academic Loans Ltd" },
            minAmount: "₹1,00,000",
            maxAmount: "₹10,00,000",
            interestRate: "7.8",
            tenureMonths: "48"
        },
        {
            _id: "vendor4",
            vendor: { name: "Student Finance Co" },
            minAmount: "₹30,000",
            maxAmount: "₹2,50,000",
            interestRate: "10.5",
            tenureMonths: "18"
        },
        {
            _id: "vendor5",
            vendor: { name: "Education First Bank" },
            minAmount: "₹75,000",
            maxAmount: "₹7,50,000",
            interestRate: "8.0",
            tenureMonths: "60"
        },
        {
            _id: "vendor6",
            vendor: { name: "Learning Capital" },
            minAmount: "₹40,000",
            maxAmount: "₹4,00,000",
            interestRate: "9.8",
            tenureMonths: "30"
        }
    ];

    // Only call API on Search button click
    const [errorsState, setErrorsState] = useState<{ [key: string]: string }>({});

    const listRef = React.useRef<ScrollView>(null);

    const handleSearch = () => {
        const newErrors: { [key: string]: string } = {};
        if (!fullName) newErrors.fullName = "Full name is required";
        if (!email) newErrors.email = "Email is required";
        if (!loanType) newErrors.loanType = "Loan type is required";
        if (!amount) newErrors.amount = "Amount is required";

        setErrorsState(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            // Simulate API call delay
            setTimeout(() => {
                // Filter vendors based on loan type and amount
                const filteredVendors = staticVendors.filter(vendor => {
                    const requestedAmount = Number(amount);
                    const minAmount = Number(vendor.minAmount.replace(/[₹,]/g, ''));
                    const maxAmount = Number(vendor.maxAmount.replace(/[₹,]/g, ''));
                    return requestedAmount >= minAmount && requestedAmount <= maxAmount;
                });
                
                setLoanOptions(filteredVendors.length > 0 ? filteredVendors : staticVendors);
                setLoading(false);
                setSearched(true);
            }, 1000); // 1 second delay to simulate API call
        }
    };

    useEffect(() => {
        if (searched && loanOptions.length > 0 && listRef.current) {
            setTimeout(() => {
                // Scroll further down by a fixed offset (e.g., 300px)
                listRef.current?.scrollTo({ y: 300, animated: true });
            }, 300); // slight delay for rendering
        }
    }, [searched, loanOptions]);


    // Handle Apply button click for a vendor
    const handleApply = (vendorId: string) => {
        onSubmit({
            loanType,
            provider: vendorId,
            amount,
            fullName,
            email,
            remarks,
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // adjust offset as needed
        >
            <ScrollView style={styles.container} ref={listRef} showsVerticalScrollIndicator={false}>
                {searched ? (
                    <View>
                        {/* Top Back Button */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setSearched(false)}
                        >
                            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>Available Loan Options</Text>
                        <FlatList
                            data={loanOptions}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => (
                                <View style={styles.optionCard}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.vendorName}>{item.vendor.name}</Text>
                                        <Text style={styles.optionText}>Min Amount: {item.minAmount}</Text>
                                        <Text style={styles.optionText}>Max Amount: {item.maxAmount}</Text>
                                        <Text style={styles.optionText}>Interest Rate: {item.interestRate}%</Text>
                                        <Text style={styles.optionText}>Tenure: {item.tenureMonths} months</Text>
                                    </View>
                                    <Button
                                        label="Apply"
                                        onPress={() => handleApply(item._id)}
                                        style={{ marginLeft: 10, minWidth: 80 }}
                                    />
                                </View>
                            )}
                            ListEmptyComponent={<Text style={{ color: Colors.gray, marginTop: 10 }}>No loan options available.</Text>}
                        />
                        {loading && <Loader />}
                    </View>
                ) : (
                    <>
                        {/* Full Name and Email inline */}
                        <View style={styles.inlineInputs}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <MyTextInput
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={setFullName}
                                />
                                {errorsState.fullName && (
                                    <Text style={styles.errorText}>{errorsState.fullName}</Text>
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <MyTextInput
                                    label="Email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={setEmail}
                                    keyboardType="email-address"
                                />
                                {errorsState.email && (
                                    <Text style={styles.errorText}>{errorsState.email}</Text>
                                )}
                            </View>
                        </View>

                        {/* Select Loan Type */}
                        <Text style={styles.label}>Select Loan Type</Text>
                        <DropDownPicker
                            open={openType}
                            value={loanType}
                            items={loanTypeOptions}
                            setOpen={setOpenType}
                            setValue={setLoanType}
                            setItems={setLoanTypeOption}
                            placeholder="Select Loan Type"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            zIndex={2000}
                            zIndexInverse={1000}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                                nestedScrollEnabled: true,
                            }}
                        />
                        {errorsState.loanType && (
                            <Text style={styles.errorText}>{errorsState.loanType}</Text>
                        )}

                        {/* Loan Amount */}
                        <View style={{ marginTop: 10 }}>
                            <MyTextInput
                                label="Loan Amount"
                                placeholder="Enter amount"
                                keyboardType="numeric"
                                value={amount}
                                onChange={setAmount}
                            />
                            {errorsState.amount && (
                                <Text style={styles.errorText}>{errorsState.amount}</Text>
                            )}
                        </View>

                        {/* Remarks */}
                        <MyTextArea
                            label="Specifications"
                            placeholder="Enter any specific requirements or remarks"
                            value={remarks}
                            onChange={setRemarks}
                        />

                        {/* Search Button */}
                        <Button
                            label="Search"
                            onPress={handleSearch}
                            style={{ marginTop: 20 }}
                        />
                        {loading && <Loader />}
                    </>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
    inlineInputs: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 10,
    },
    label: {
        fontWeight: "500",
        marginTop: 10,
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
    sectionTitle: {
        fontWeight: "600",
        fontSize: 16,
        marginTop: 20,
    },
    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.gray,
        padding: 12,
        marginVertical: 6,
        elevation: 2,
    },
    vendorName: {
        fontWeight: "600",
        fontSize: 16,
        color: Colors.primary,
        marginBottom: 2,
    },
    optionText: {
        fontSize: 14,
        color: Colors.black,
        marginBottom: 1,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 2,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        marginBottom: 10,
    },
    backText: {
        color: Colors.primary,
        fontSize: 16,
        marginLeft: 6,
        fontWeight: "500",
    },
});

export default LoanRequestForm;
