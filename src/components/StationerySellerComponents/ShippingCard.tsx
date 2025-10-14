import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface ShippingCardProps {
  shippingId: string;
  orderId: string;
  courierName: string;
  dispatchDate: string;
  expectedDelivery: string;
  shippingStatus: 'Delivered' | 'Pending' | 'In Transit';
}

const ShippingCard = ({
  shippingId,
  orderId,
  courierName,
  dispatchDate,
  expectedDelivery,
  shippingStatus,
 
}: ShippingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
     
      case "Delivered":
        return "green";
      case "In Transit":
        return Colors.primary;
      default:
        return Colors.secondary;
    }
  };
  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row" }}>
      
        <View style={{ width: '70%' }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{courierName}</Text>
          <Text style={styles.cardDescription}>Order ID: {orderId} </Text>
        </View>
        <View style={{ width: '30%', alignItems: 'flex-end' }}>
          <Text style={[styles.statusText, { color: getStatusColor(shippingStatus) }]}>{shippingStatus}</Text>
          <View style={{ alignItems: "flex-end", marginTop: 4 }}>
            <Entypo
              name={isOpen ? "chevron-small-up" : "chevron-small-down"}
              size={24}
              color="black"
            />
          </View>
        </View>
      </View>

      {isOpen && (
        <View style={{ marginTop: 10, borderTopWidth: 0.5, borderColor: Colors.lightBlue }}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Shipping ID</Text>
            <Text style={styles.detailRightText}>{shippingId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Order ID</Text>
            <Text style={styles.detailRightText}>{orderId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Courier Name</Text>
            <Text style={styles.detailRightText}>{courierName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Dispatch Date</Text>
            <Text style={styles.detailRightText}>{dispatchDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Expected Delivery</Text>
            <Text style={styles.detailRightText}>{expectedDelivery}</Text>
          </View>
          
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ShippingCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  detailRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
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
});
