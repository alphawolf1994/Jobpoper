import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // For up/down icons
import { Colors, CurrencySign } from "../utils";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  time: string;
  date: string;
  method?: "Mobile App" | "Bank Account" | "Stripe" | "PayPal"; // Payment Method (only for credits)
}

const transactions: Transaction[] = [
  { id: "1", type: "debit", amount: 10.5, description: "Paid for School Fee", time: "3:14 pm", date: "Today, 26 Mar, 2025" },
  { id: "2", type: "credit", amount: 20.0, description: "Money Added to Wallet", time: "11:14 am", date: "Today, 26 Mar, 2025", method: "Stripe" },
  { id: "3", type: "credit", amount: 100.0, description: "Money Added to Wallet", time: "3:14 pm", date: "Yesterday, 25 Mar, 2025", method: "PayPal" },
  { id: "4", type: "debit", amount: 10.5, description: "Paid for Semester Fee", time: "3:14 pm", date: "Yesterday, 25 Mar, 2025" },
];

const WalletTransactionHistory = () => {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{paddingBottom:30}}
      renderItem={({ item, index }) => (
        <View>
          {/* Display Date Header if it's the first item or the date changes */}
          {(index === 0 || transactions[index - 1].date !== item.date) && (
            <Text style={styles.dateHeader}>{item.date}</Text>
          )}

          {/* Transaction Row */}
          <View style={styles.transactionRow}>
            <AntDesign name={item.type === "credit" ? "arrowdown" : "arrowup"} size={16} color={item.type === "credit" ? "green" : "red"} />
            <View style={styles.transactionDetails}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.time}>{item.time} | {item.method}</Text>
            </View>
            <Text style={[styles.amount, item.type === "credit" ? styles.credit : styles.debit]}>
              {item.type === "credit" ? "+" : "-"} {CurrencySign} {item.amount.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  dateHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.gray,
    marginVertical: 10,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.SkyBlue,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal:2
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  time: {
    fontSize: 14,
    color: Colors.gray,
  },
  method: {
    fontSize: 14,
    color: Colors.black,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  credit: {
    color: "green",
  },
  debit: {
    color: "red",
  },
});

export default WalletTransactionHistory;
