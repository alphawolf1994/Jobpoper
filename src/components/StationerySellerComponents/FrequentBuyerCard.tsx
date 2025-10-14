import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";

type TrackCardProps = {
    buyerName: string;
    schoolName: string;
    totalOrders: number;
    totalSpend: string;
    lastOrderDate: string;
    loyaltyTier: 'Platinum' | 'Gold' | 'Silver';

};

const FrequentBuyerCard = ({
    buyerName,
    schoolName,
    totalOrders,
    totalSpend,
    lastOrderDate,
    loyaltyTier,
  
}: TrackCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
     
      case "Platinum":
        return "green";
      case "Silver":
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
          <Text numberOfLines={1} style={styles.cardTitle}>{buyerName}</Text>
          <Text style={styles.cardDescription}>Last Order Date: {lastOrderDate}</Text>
        </View>
        <View style={{ width: '30%', alignItems: 'flex-end' }}>
          <Text  style={[styles.statusText, { color: getStatusColor(loyaltyTier) }]}>{loyaltyTier}</Text>
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
            <Text style={styles.detailLeftText}>Buyer Name</Text>
            <Text style={styles.detailRightText}>{buyerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>School/Institude</Text>
            <Text style={styles.detailRightText}>{schoolName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Total Orders</Text>
            <Text style={styles.detailRightText}>{totalOrders}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Total Spend</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {totalSpend}</Text>
          </View>
        
         
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FrequentBuyerCard;

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
