import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import MyTextInput from "../MyTextInput";
import DropDownPicker from "react-native-dropdown-picker";
import { Colors } from "../../utils";
import Button from "../Button";

const LoanCalculator = () => {
    const [totalAmount, setTotalAmount] = useState("");
    const [downPayment, setDownPayment] = useState("");
    const [months, setMonths] = useState("3");
    const [interestRate, setInterestRate] = useState("5"); // Fixed interest rate
    const [monthlyPayment, setMonthlyPayment] = useState('0');
    // Dropdown state
    const [openMonths, setOpenMonths] = useState(false);
    const [monthItems, setMonthItems] = useState([
        { label: "3", value: "3" },
        { label: "6", value: "6" },
        { label: "12", value: "12" },
        { label: "24", value: "24" },
    ]);
    const calculatePayment = () => {
        const principal = parseFloat(totalAmount) - parseFloat(downPayment);
        const rate = parseFloat(interestRate) / 100 / 12;
        const numPayments = parseInt(months);

        if (principal > 0 && numPayments > 0) {
            const payment =
                rate > 0
                    ? (principal * rate) / (1 - Math.pow(1 + rate, -numPayments))
                    : principal / numPayments;
         
            setMonthlyPayment(payment.toFixed(2));
        } else {
            setMonthlyPayment('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Loan Calculator</Text>
            <View style={styles.card}>
                <MyTextInput

                    label="Total Amount"
                    placeholder="0"
                    keyboardType="numeric"
                    value={totalAmount}
                    onChange={setTotalAmount}
                    containerStyle={{ backgroundColor: Colors.white }}
                />
                <MyTextInput
                    label="Down Payment"
                    placeholder="0"
                    keyboardType="numeric"
                    value={downPayment}
                    onChange={setDownPayment}
                    containerStyle={{ backgroundColor: Colors.white }}
                />
                <Text style={styles.label}>Amortization Period (months)</Text>
                <DropDownPicker
                    open={openMonths}
                    value={months}
                    items={monthItems}
                    setOpen={setOpenMonths}
                    setValue={setMonths}
                    setItems={setMonthItems}
                    placeholder="Amortization Period (months)"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />

                <MyTextInput
                    label="Interest Rate (%)"
                    placeholder="0"
                    keyboardType="numeric"
                    value={interestRate}
                    editable={false}
                    containerStyle={{ backgroundColor: Colors.white }}
                />
                {/* <View style={styles.footerContainer}> */}
                <Button label="Calculate" onPress={calculatePayment} />
                {/* </View> */}

                {monthlyPayment !== null && (
                    <Text style={styles.result}>
                        Monthly Payment: <Text style={styles.resultValue}>${monthlyPayment}</Text>
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10
    },
    card: {
        backgroundColor: Colors.lightGray,
        padding: 16,
        borderRadius: 20,
    },

    result: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "bold",
    },
    resultValue: {
        color: Colors.primary
    },
    dropdown: {
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    dropdownContainer: {
        position: "absolute",
        top: 50,

    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 20,
        color: Colors.black,
        marginBottom: 10
    },
});

export default LoanCalculator;
