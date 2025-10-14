import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import Button from "../Button";
import { useNavigation } from "@react-navigation/native";

interface FeeDetailCardProps {
    feeDetail: any;
  }

const StudentFeeCard = ({
  
    feeDetail
}: FeeDetailCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();



  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{feeDetail?.feeAssign?.feeMasters?.feeType}</Text>
          <Text style={styles.subText}>Total Amount: {CurrencySign} {feeDetail?.amount}</Text>
        </View>
        <View style={styles.rightColumn}>
        <Text style={[styles.statusText, { color: feeDetail?.status === 'Active' ? 'green' : Colors.Red }]}>
            {feeDetail?.status}
          </Text>
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
        <DetailRow label="Due Amount" value={`${CurrencySign} ${Number(feeDetail?.amountDue || 0)}`} />
<DetailRow label="Paid Amount" value={`${CurrencySign} ${Number(feeDetail?.paidAmount || 0)}`} />
<DetailRow label="Due Date" value={feeDetail?.feeAssign?.feeMasters?.dueDate} />

        </View>
      )}
    </TouchableOpacity>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{String(value)}</Text>
  </View>
);

export default StudentFeeCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  subText: {
    fontSize: 14,
    color: Colors.black,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  details: {
    marginTop: 12,
    borderTopWidth: 0.5,
    borderColor: Colors.lightBlue,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.black,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
});
