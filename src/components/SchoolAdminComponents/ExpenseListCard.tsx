import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface ExpenseListCardProps {
  id: string;
  expenseName: string;
  description: string;
  category: string;
  date: string;
  amount: string;
  invoiceNo: string;
  paymentMethod: string;
}

const ExpenseListCard = ({
  id,
  expenseName,
  description,
  category,
  date,
  amount,
  invoiceNo,
  paymentMethod,
}: ExpenseListCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials from expense name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Determine category color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Utilities': return Colors.TanBrown;
      case 'Salaries': return Colors.green;
      case 'Maintenance': return Colors.secondary;
      case 'Supplies': return Colors.primary;
      default: return Colors.gray;
    }
  };

  return (
    <TouchableOpacity 
      onPress={() => setIsOpen(!isOpen)} 
      style={styles.cardContainer}
    >
      <View style={styles.row}>
        <View style={styles.leftColumn}>
        
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={1}>{expenseName}</Text>
            <View style={styles.categoryContainer}>
              <Text style={[styles.categoryText, {color: getCategoryColor(category)}]}>
                {category}
              </Text>
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.amountText}>{CurrencySign} {amount}</Text>
          <Entypo 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="black" 
          />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Description" value={description} />
          <DetailRow label="Invoice No" value={invoiceNo} />
          <DetailRow label="Payment Method" value={paymentMethod} />
          <DetailRow label="Expense ID" value={id} />
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

export default ExpenseListCard;

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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  dateText: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
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
    width: "40%",
  },
  detailValue: {
    fontSize: 14,
    color: Colors.black,
    width: "60%",
    textAlign: "right",
  },
});