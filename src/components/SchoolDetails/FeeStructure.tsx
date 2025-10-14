import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils";
interface FeeStructureProps {
    school: any;
  }
const FeeStructure = ({ school }: FeeStructureProps) => {
  const feeStructure = school?.feeStructure ?? [];
  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={styles.cellHeader}>Grades</Text>
          <Text style={styles.cellHeader}>USD ($)</Text>
        </View>
        {feeStructure.map((item:any) => (
          <View key={item._id} style={styles.row}>
            <Text style={styles.cell}>{item.grade}</Text>
            <Text style={styles.cell}>${item.fee}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
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
    fontSize:16,
   
  },
  cell: {
    flex: 1,
    
  },
});

export default FeeStructure;
