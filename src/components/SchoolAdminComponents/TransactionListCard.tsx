import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface TransactionListCardProps {
  id: string;
  description: string;
  transactionDate: string;
  amount: string;
  transactionType: 'Income' | 'Expense';
  paymentMethod: string;
  status: string;
}

const TransactionListCard = ({
  id,
  description,
  transactionDate,
  amount,
  transactionType,
  paymentMethod,
  status,
}: TransactionListCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials from description
  const getInitials = (desc: string) => {
    return desc
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Determine colors based on transaction type and status
  const amountColor = transactionType === 'Income' ? Colors.green : Colors.Red;
  const statusColor = status === 'Computed' ? Colors.TanBrown : Colors.secondary;

  return (
    <TouchableOpacity 
      onPress={() => setIsOpen(!isOpen)} 
      style={styles.cardContainer}
    >
      <View style={styles.row}>
        <View style={styles.leftColumn}>
         
          <View style={styles.infoContainer}>
            <Text style={styles.descriptionText} numberOfLines={1}>{description}</Text>
            <Text style={styles.dateText}>{transactionDate}</Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.amountText, {color: amountColor}]}>{CurrencySign} {amount}</Text>
          <Text style={[styles.statusText, {color: statusColor}]}>{status}</Text>
        </View>
        <Entypo 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="black" 
        />
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Transaction ID" value={id} />
          <DetailRow label="Type" value={transactionType} />
          <DetailRow label="Payment Method" value={paymentMethod} />
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

export default TransactionListCard;

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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.white,
  },
  infoContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  dateText: {
    fontSize: 12,
    color: Colors.darkGray,
    marginTop: 4,
  },
  rightColumn: {
    alignItems: "flex-end",
    marginRight: 10,
    minWidth: 80,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
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