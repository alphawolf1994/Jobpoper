import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, CurrencySign } from "../../utils";

interface HostelFeeStructureProps {
  hostel: any;
}

const HostelFeeStructure = ({ hostel }: HostelFeeStructureProps) => {
  const feeStructure = hostel?.feeStructure ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hostel Fee Structure</Text>
      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={styles.cellHeader}>Room Type</Text>
          <Text style={styles.cellHeader}>Monthly Fee</Text>
          <Text style={styles.cellHeader}>Annual Fee</Text>
        </View>
        {feeStructure.map((item: any) => (
          <View key={item._id} style={styles.row}>
            <Text style={styles.cell}>{item.roomType}</Text>
            <Text style={styles.cell}>{CurrencySign} {item.monthlyFee}</Text>
            <Text style={styles.cell}>{CurrencySign} {item.annualFee}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.grayShade1,
    borderRadius: 5,
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: Colors.SlateGray,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayShade1,
    padding: 10,
  },
  cellHeader: {
    flex: 1,
    fontWeight: "600",
    color: Colors.black,
    fontSize: 16,
  },
  cell: {
    flex: 1,
  },
});

export default HostelFeeStructure;
