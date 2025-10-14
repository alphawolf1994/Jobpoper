import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface IncomeListCardProps {
  id: string;
  incomeName: string;
  description: string;
  source: string;
  date: string;
  amount: string;
  invoiceNo: string;
  paymentMethod: string;
}

const IncomeListCard = ({
  id,
  incomeName,
  description,
  source,
  date,
  amount,
  invoiceNo,
  paymentMethod,
}: IncomeListCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials from income name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Determine source color
  const getSourceColor = (source: string) => {
    switch(source) {
      case 'Tuition Fees': return Colors.TanBrown;
      case 'Government Grants': return Colors.green;
      case 'Donations': return Colors.primary;
      case 'Merchandise': return Colors.secondary;
      case 'Parking Fees': return Colors.PastelPink;
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
            <Text style={styles.title} numberOfLines={1}>{incomeName}</Text>
            <View style={styles.sourceContainer}>
              <Text style={[styles.sourceText, {color: getSourceColor(source)}]}>
                {source}
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
          <DetailRow label="Income ID" value={id} />
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

export default IncomeListCard;

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
  sourceContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  sourceText: {
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
    color: Colors.green, // Green color for income amounts
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