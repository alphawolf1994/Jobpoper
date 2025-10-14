import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

type TrackCardProps = {
  orderId: string;
  customerName: string;
  productName: string;
  quantity: number;
  orderDate: string;
  deliveryStatus: 'Pending' | 'Delivered' | 'Cancelled';

};

const TrackOrderCard = ({
  orderId,
  productName,
  customerName,
  quantity,
  orderDate,
  deliveryStatus,
  
}: TrackCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
     
      case "Delivered":
        return "green";
      case "Cancelled":
        return Colors.Red;
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
        <View style={{  width: '70%' }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{customerName}</Text>
          <Text style={styles.cardDescription}>Order Date: {orderDate}</Text>
        </View>
        <View style={{ width: '30%', alignItems: 'flex-end' }}>
          <Text  style={[styles.statusText, { color: getStatusColor(deliveryStatus) }]}>{deliveryStatus}</Text>
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
            <Text style={styles.detailLeftText}>Order ID</Text>
            <Text style={styles.detailRightText}>{orderId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Customer Name</Text>
            <Text style={styles.detailRightText}>{customerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Product Name</Text>
            <Text style={styles.detailRightText}>{productName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Quantity</Text>
            <Text style={styles.detailRightText}>{quantity}</Text>
          </View>
        
         
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TrackOrderCard;

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
