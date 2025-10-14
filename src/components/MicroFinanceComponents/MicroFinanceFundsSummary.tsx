import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors, CurrencySign } from "../../utils";
import ImagePath from "../../assets/images/ImagePath"; // Use your coin image if available

const MicroFinanceFundsSummary = () => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Total Available Funds</Text>
        {/* Replace with your coin image if needed */}
        <Image source={ImagePath.paymenntCollectionIcon} style={styles.coinIcon} />
      </View>
      <Text style={styles.amountText}>{CurrencySign} 50,000,000.00</Text>
      <Text style={styles.subHeader}>Total Loan Amount</Text>
      {/* <Text style={styles.subDesc}>Flot dom payment crough ronugh machine</Text> */}
      <View style={styles.statusRow}>
        <View style={[styles.statusBox, { backgroundColor: Colors.primary }]}>
          <Text style={styles.statusLabel}>Approved</Text>
          <Text style={styles.statusValue}>{CurrencySign} 26.82k</Text>
        </View>
        <View style={[styles.statusBox, { backgroundColor: Colors.TanBrown }]}>
          <Text style={styles.statusLabel}>Pending</Text>
          <Text style={styles.statusValue}>{CurrencySign} 12.50k</Text>
        </View>
        <View style={[styles.statusBox, { backgroundColor: Colors.Red }]}>
          <Text style={styles.statusLabel}>Rejected</Text>
          <Text style={styles.statusValue}>{CurrencySign} 5k</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SkyBlue,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  coinIcon: {
    width: 32,
    height: 32,
  },
  amountText: {
    color: Colors.black,
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 8,
  },
  subHeader: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  subDesc: {
    color: Colors.black,
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statusBox: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: "center",
    minWidth: 90,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.white,
    // Ensure single line
    flexShrink: 1,
 
   
  },
});

export default MicroFinanceFundsSummary;