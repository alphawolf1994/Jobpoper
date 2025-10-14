import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface ShippingCardProps {
    month: string;
    totalRevenue: string;
    grossProfit: string;
    newProfit: string;
    costGoodSold: string;
}

const RevenueCard = ({
    month,
    totalRevenue,
    grossProfit,
    newProfit,
    costGoodSold,
 
}: ShippingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
 
  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row" }}>
      
        <View style={{ width: '80%' }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{month}</Text>
          <Text style={styles.cardDescription}>Total Revenue: {CurrencySign} {totalRevenue} </Text>
        </View>
        <View style={{ width: '20%', alignItems: 'flex-end' }}>
        
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
            <Text style={styles.detailLeftText}>Month</Text>
            <Text style={styles.detailRightText}>{month}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Total Revenue</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {totalRevenue}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Gross Profit</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {grossProfit}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>New Profit</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {newProfit}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Cost of Goods Sold</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {costGoodSold}</Text>
          </View>
          
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RevenueCard;

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
