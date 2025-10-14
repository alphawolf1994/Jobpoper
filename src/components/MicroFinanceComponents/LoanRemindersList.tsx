import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Colors } from "../../utils";
import { Ionicons } from "@expo/vector-icons";

const dummyReminders = [
  { id: "1", name: "John Doe", emi: "TZS 50,000", dueDate: "2025-09-05" },
  { id: "2", name: "Aisha Musa", emi: "TZS 30,000", dueDate: "2025-09-06" },
];

const LoanRemindersList = () => (
  <View style={styles.section}>
    <Text style={styles.title}>Upcoming EMI Reminders</Text>
    <FlatList
      data={dummyReminders}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={[styles.card, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.emi}>EMI: {item.emi}</Text>
            <Text style={styles.due}>Due: {item.dueDate}</Text>
          </View>
          
          <View>
            <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No EMI reminders</Text>}
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
  },
  name: { fontWeight: "bold", fontSize: 15, color: Colors.black },
  emi: { fontSize: 14, color: Colors.black, marginVertical: 2,fontWeight: "bold" },
  due: { fontSize: 12, color: Colors.black,fontWeight: "bold" },
  empty: { color: Colors.gray, fontStyle: "italic", marginTop: 8 },
});

export default LoanRemindersList;