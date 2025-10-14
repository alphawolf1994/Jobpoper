import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface InventoryCardProps {
  productId: string;
  productName: string;
  size: string;
  color: string;
  status: 'In Stock' | 'Out Of Stock';
  currentStock: number;
  incomingStock: number;
  reservedStock: number;
  availableStock: number;
  lastUpdated: string;
  imageUrl: string;
}

const InventoryCard = ({
  productId,
  productName,
  size,
  color,
  status,
  currentStock,
  incomingStock,
  reservedStock,
  availableStock,
  lastUpdated,
  imageUrl
}: InventoryCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: '15%' }}>
          <Image source={{ uri: imageUrl }} style={styles.profileImage} />
        </View>
        <View style={{ marginLeft: 10, width: '55%' }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{productName}</Text>
          <Text style={styles.cardDescription}>Size: {size} | Color: {color}</Text>
        </View>
        <View style={{ width: '30%', alignItems: 'flex-end' }}>
          <Text style={[styles.statusText, { color: status === 'In Stock' ? 'green' : Colors.Red }]}>{status}</Text>
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
            <Text style={styles.detailLeftText}>Product ID</Text>
            <Text style={styles.detailRightText}>{productId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Current Stock</Text>
            <Text style={styles.detailRightText}>{currentStock}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Incoming Stock</Text>
            <Text style={styles.detailRightText}>{incomingStock}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Reserved Stock</Text>
            <Text style={styles.detailRightText}>{reservedStock}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Available Stock</Text>
            <Text style={styles.detailRightText}>{availableStock}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Last Updated</Text>
            <Text style={styles.detailRightText}>{lastUpdated}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default InventoryCard;

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
