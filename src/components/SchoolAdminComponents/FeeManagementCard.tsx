import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import Button from "../Button";
import { useNavigation } from "@react-navigation/native";

interface EnrollmentCardProps {

  className: string;
  sectionName: string;
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  totalStudents: number;
  totalPendingFees:number;
  totalPaidFees:number
}

const FeeManagementCard = ({
  
  sectionName,
  totalAmount,
  totalPaidAmount,
  totalDueAmount,
  totalStudents,
  totalPendingFees,
  totalPaidFees,
  className,
}: EnrollmentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();



  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>Class {className} - Section {sectionName}</Text>
          <Text style={styles.subText}>Total Students: {totalStudents}</Text>
        </View>
        <View style={styles.rightColumn}>
         
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
        <DetailRow label="Total Fee" value={`${CurrencySign} ${Number(totalAmount || 0)}`} />
<DetailRow label="Paid Fee" value={`${CurrencySign} ${Number(totalPaidAmount || 0)}`} />
<DetailRow label="Pending Fee" value={`${CurrencySign} ${Number(totalDueAmount || 0)}`} />
<DetailRow label="Pending Fees Students" value={Number(totalPendingFees || 0)} />
<DetailRow label="Paid Fees Students" value={Number(totalPaidFees || 0)} />
<Button label="View Details" onPress={() => navigation.navigate("SchoolFeeDetailsScreen", { className: className,sectionName:sectionName } as any)} />

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

export default FeeManagementCard;

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
