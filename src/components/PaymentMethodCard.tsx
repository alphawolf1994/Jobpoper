import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "../utils";
import { PaymentMethod } from "../interface/interfaces";

interface PaymentMethodCardProps {
  method: PaymentMethod
  onRemove?: (id: string) => void;
}

const PaymentMethodCard = ({ method, onRemove }: PaymentMethodCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  // Get details for each type
  let title = "";
  let subtitle = "";
  let icon = "";
  let details: { label: string; value: string | undefined }[] = [];

  if (method.method === "mobile" && method.mobile) {
    title = method.mobile.vendor || "Mobile Payment";
    subtitle = method.mobile.number;
    icon = "📱";
    details = [
      { label: "Provider", value: method.mobile.vendor },
      { label: "Phone Number", value: method.mobile.number },
      { label: "Type", value: "Mobile Payment" },
    ];
  } else if (method.method === "card" && method.card) {
    title = `•••• ${method.card.cardNumber?.slice(-4)}`;
    subtitle = `Expires ${method.card.expiryDate}`;
    icon = "💳";
    details = [
      { label: "Card Holder", value: method.card.cardHolder },
      { label: "Card Number", value: `•••• •••• •••• ${method.card.cardNumber?.slice(-4)}` },
      { label: "Expiry Date", value: method.card.expiryDate },
      { label: "Type", value: "Card" },
    ];
  } else if (method.method === "bank" && method.bank) {
    title = method.bank.bankName || "Bank Account";
    subtitle = `A/C: ${method.bank.accountNumber}`;
    icon = "🏦";
    details = [
      { label: "Bank Name", value: method.bank.bankName },
      { label: "Account Number", value: method.bank.accountNumber },
      { label: "Account Name", value: method.bank.accountName },
      { label: "Type", value: "Bank Account" },
    ];
  } else if (method.method === "paypal" && method.paypal) {
    title = "PayPal";
    subtitle = method.paypal.account || "";
    icon = "🔵";
    details = [
      { label: "Email/Account", value: method.paypal.account },
      { label: "Type", value: "PayPal" },
    ];
  }

  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "15%", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 28 }}>{icon}</Text>
        </View>
        <View style={{ width: "60%" }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{subtitle}</Text>
          <Text style={styles.smallText}>
            Added on {formatDate(method.createdAt)}
          </Text>
        </View>
        <View style={{ width: "25%", alignItems: "flex-end", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => onRemove && onRemove(method._id)}
            style={styles.removeButton}
          >
            <Entypo name="trash" size={20} color={Colors.Red} />
          </TouchableOpacity>
          <View style={{ alignItems: "flex-end", marginTop: 4 }}>
            {isOpen ? (
              <Entypo name="chevron-small-up" size={24} color="black" />
            ) : (
              <Entypo name="chevron-small-down" size={24} color="black" />
            )}
          </View>
        </View>
      </View>

      {isOpen && (
        <View style={styles.detailsContainer}>
          {details.map((detail, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.detailLeftText}>{detail.label}</Text>
              <Text style={styles.detailRightText}>{detail.value}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PaymentMethodCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 4,
  },
  smallText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  detailLeftText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  detailRightText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  detailRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  removeButton: {
    padding: 4,
    borderRadius: 4,
    alignSelf: "flex-end",
  },
});