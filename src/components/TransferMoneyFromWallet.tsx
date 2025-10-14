import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";

import { deductFunds } from "../redux/slices/walletSlice";
import { RootState } from "../redux/store";
import HeadingText from "./HeadingText";
import { Colors, CurrencySign } from "../utils";
import MyTextInput from "./MyTextInput";
import Button from "./Button";

interface TransferMoneyModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const TransferMoneyFromWallet: React.FC<TransferMoneyModalProps> = ({ isVisible, onClose }) => {
    const dispatch = useDispatch();
    const balance = useSelector((state: RootState) => state.walletSlice.balance);

    const [walletId, setWalletId] = useState("");
    const [amount, setAmount] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Static receiver name (for now)
    const receiverName = "John Doe";

    // Function to check if wallet exists
    const checkWalletExists = (id: string) => {
        return id !== "123456789"; // Static check: 123456789 is considered non-existent
    };

    const handleValidateTransfer = () => {
        const transferAmount = parseFloat(amount);

        if (!walletId) {
            Alert.alert("Error", "Please enter a Wallet ID");
            return;
        }

        if (!checkWalletExists(walletId)) {
            Alert.alert("Error", "Wallet ID does not exist. Please enter a valid Wallet ID.");
            return;
        }

        if (!amount || isNaN(transferAmount) || transferAmount <= 0) {
            Alert.alert("Error", "Please enter a valid amount.");
            return;
        }

        if (transferAmount > balance) {
            Alert.alert("Error", "Insufficient balance.");
            return;
        }

        // If everything is valid, move to confirmation step
        setIsConfirmed(true);
    };

    const handleConfirmTransfer = () => {
        const transferAmount = parseFloat(amount);

        // Deduct amount from current balance
        dispatch(deductFunds(transferAmount));
        Alert.alert("Success", `You have successfully transferred ${CurrencySign}${transferAmount} to ${receiverName} (Wallet ID: ${walletId})`);

        // Reset state
        setWalletId("");
        setAmount("");
        setIsConfirmed(false);
        onClose(); // Close modal after transfer
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} animationIn="slideInUp" animationOut="slideOutDown">
            <View style={styles.modalContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <HeadingText textStyle={styles.headerText} text="Transfer Money" />
                    <Text style={{ fontSize: 16, marginBottom: 10 }}>Balance: {CurrencySign} {balance}</Text>
                </View>

                {!isConfirmed ? (
                    // Step 1: Enter Wallet ID & Amount
                    <View>
                        <MyTextInput
                            label="Enter Wallet ID:"
                            keyboardType="numeric"
                            value={walletId}
                            placeholder="Enter Wallet ID"
                            onChange={setWalletId}
                        />

                        <MyTextInput
                            label="Enter Amount to Transfer:"
                            keyboardType="numeric"
                            value={amount}
                            placeholder="Enter Amount"
                            onChange={setAmount}
                        />

                        <Button label="Next" onPress={handleValidateTransfer} />
                    </View>
                ) : (
                    // Step 2: Show Confirmation Details
                    <View style={styles.confirmationContainer}>
                        <HeadingText textStyle={styles.confirmHeader} text="Confirm Transfer" />
                        <View style={styles.RowSide}>
                        <Text style={styles.detailText}>Receiver: </Text>
                        <Text style={styles.boldText}>{receiverName}</Text>
                        </View>
                        <View style={styles.RowSide}>
                        <Text style={styles.detailText}>Wallet ID: </Text>
                        <Text style={styles.boldText}>{walletId}</Text>
                        </View>
                        <View style={styles.RowSide}>
                        <Text style={styles.detailText}>Amount: </Text>
                        <Text style={styles.boldText}>{CurrencySign} {amount}</Text>
                        </View>
                
                        <View style={styles.buttonRow}>
                            <Button label="Cancel" onPress={() => setIsConfirmed(false)} />
                            <Button label="Confirm Transfer" onPress={handleConfirmTransfer} />
                        </View>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    confirmationContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: Colors.grayShade1,
        borderRadius: 10,
    },
    confirmHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
    },
    boldText: {
        fontWeight: "bold",
        color: Colors.primary,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    RowSide:{
        flexDirection:'row',
        justifyContent:'space-between',
    }
});

export default TransferMoneyFromWallet;
