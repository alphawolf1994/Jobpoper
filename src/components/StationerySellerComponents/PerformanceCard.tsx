import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface ShippingCardProps {
    metric: string;
    currentValue: string | number;
    targetValue: string | number;
    performanceStatus: "On Track" | "Needs Improvement";
    lastEvaluated: string;
}

const PerformanceCard = ({
    metric,
    currentValue,
    targetValue,
    performanceStatus,
    lastEvaluated,

 
}: ShippingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
     
      case "On Track":
        return "green";
      case "Pending":
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
      
        <View style={{ width: '60%' }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{metric}</Text>
          <Text style={styles.cardDescription}>Last Evaluated: {lastEvaluated} </Text>
        </View>
        <View style={{ width: '40%', alignItems: 'flex-end' }}>
          <Text style={[styles.statusText, { color: getStatusColor(performanceStatus) }]}>{performanceStatus}</Text>
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
            <Text style={styles.detailLeftText}>Metric</Text>
            <Text style={styles.detailRightText}>{metric}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Current Value</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {currentValue}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Target Value</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {targetValue}</Text>
          </View>
        
          
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PerformanceCard;

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
