import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import Button from "../Button";

interface OrderCardProps {
  orderId: string;
  schoolName: string;
  schoolImage: string;
  orderDate: string;
  deliveryDate: string;
  items: string[];
  totalAmount: number;
  status: "Pending" | "Accepted" | "Rejected" | "Delivered";
  payment: "Paid" | "Pending" | "Refunded";
}

const OrderCard = ({
  orderId,
  schoolName,
  schoolImage,
  orderDate,
  deliveryDate,
  items,
  totalAmount,
  status: initialStatus,
  payment
}: OrderCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
      case "Shipped":
        return Colors.primary;
      case "Delivered":
        case "Accepted":
        return "green";
      case "Cancelled":
        return Colors.Red;
      default:
        return Colors.gray;
    }
  };

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case "Paid":
        return "green";
      case "Pending":
        return Colors.Red;
      case "Refunded":
        return Colors.primary;
      default:
        return Colors.gray;
    }
  };
  const handleAccept = () => {
    setStatus("Accepted");
    // You can call an API here to update the order status on the backend
  };

  const handleReject = () => {
    setStatus("Rejected");
    // You can call an API here to update the order status on the backend
  };
  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: schoolImage }} style={styles.profileImage} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{schoolName}</Text>
          <Text style={styles.cardDescription}>Order ID: {orderId}</Text>
          <Text style={styles.cardDescription}>Order Date: {orderDate}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>{status}</Text>
          <Text style={{ color: getPaymentColor(payment), marginTop: 4 }}>{payment}</Text>
          <Entypo
            name={isOpen ? "chevron-small-up" : "chevron-small-down"}
            size={24}
            color="black"
            style={{ marginTop: 4 }}
          />
        </View>
      </View>

      {isOpen && (
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Delivery Date:</Text>
            <Text style={styles.detailRightText}>{deliveryDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Total Amount:</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {totalAmount.toFixed(2)}</Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.detailLeftText}>Items:</Text>
            {items.map((item, index) => (
              <Text key={index} style={styles.detailRightText}>• {item}</Text>
            ))}
          </View>
          {status === "Pending" && (
            <View style={[styles.detailRow, { marginTop: 12 }]}>
              <Button label="Accept" onPress={handleAccept} style={styles.editBtn} textStyle={{ fontSize: 14 }} />
              <Button label="Reject" onPress={handleReject} style={styles.deleteBtn} textStyle={{ fontSize: 14 }} />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.black,
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsSection: {
    marginTop: 12,
    borderTopWidth: 0.5,
    borderColor: Colors.lightBlue,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  detailLeftText: {
    fontSize: 14,
    color: Colors.black,
  },
  detailRightText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  editBtn: {
    width: "48%",
    backgroundColor: Colors.secondary,
  },
  deleteBtn: {
    width: "48%",
  },
});
