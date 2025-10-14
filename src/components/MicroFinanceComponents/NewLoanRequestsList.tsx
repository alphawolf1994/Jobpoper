import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Colors } from "../../utils";
import { Ionicons } from "@expo/vector-icons";

const dummyRequests = [
  { id: "1", name: "John Doe", amount: "TZS 2,000,000", date: "2025-09-04" },
  { id: "2", name: "Aisha Musa", amount: "TZS 1,500,000", date: "2025-09-03" },
];

const NewLoanRequestsList = () => (
  <View style={styles.section}>
    <Text style={styles.title}>New Loan Requests</Text>
    <FlatList
      data={dummyRequests}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={[styles.card, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
                 <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.amount}>{item.amount}</Text>
          <Text style={styles.date}>Requested: {item.date}</Text>
        </View>
         <View>
            <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No new requests</Text>}
    />
  </View>
);

const styles = StyleSheet.create({
  section: { marginVertical: 12 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 8, color: Colors.black },
  card: {
    backgroundColor: Colors.SkyBlue,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: { fontWeight: "bold", fontSize: 15, color: Colors.black },
  amount: { fontSize: 14, color: Colors.black, marginVertical: 2,fontWeight: "bold" },
  date: { fontSize: 12, color: Colors.black ,fontWeight: "bold"},
  empty: { color: Colors.gray, fontStyle: "italic", marginTop: 8 },
});

export default NewLoanRequestsList;