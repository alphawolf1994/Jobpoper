import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface PayrollListCardProps {
  id: string;
  name: string;
  department: string;
  designation: string;
  phone: string;
  amount: string;
  status: string;
}

const PayrollListCard = ({
  id,
  name,
  department,
  designation,
  phone,
  amount,
  status,
}: PayrollListCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Determine status color
  const statusColor = status === "Paid" ? Colors.green : 
                     status === "Generated" ? Colors.green : Colors.Red;

  return (
    <TouchableOpacity 
      onPress={() => setIsOpen(!isOpen)} 
      style={styles.cardContainer}
    >
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          {/* <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(name)}</Text>
          </View> */}
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.departmentText}>{department}</Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.amountText}>{CurrencySign} {amount}</Text>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status}
          </Text>
        </View>
        <Entypo 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="black" 
        />
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Employee ID" value={id} />
          <DetailRow label="Designation" value={designation} />
          <DetailRow label="Phone" value={phone} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default PayrollListCard;

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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  departmentText: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  rightColumn: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
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
    width: "40%",
  },
  detailValue: {
    fontSize: 14,
    color: Colors.black,
    width: "60%",
    textAlign: "right",
  },
});