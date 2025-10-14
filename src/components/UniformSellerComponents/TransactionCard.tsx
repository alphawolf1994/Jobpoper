import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface TransactionCardProps {
    transactionId: string;
    date: string;
    school: string;
    amount: string;
    status: string;
}

const TransactionCard = ({
    transactionId,
    date,
    school,
    amount,
    status
}: TransactionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row" }}>
       
        <View style={{  width: '70%' }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{school}</Text>
          <Text style={styles.cardDescription}>date: {date}</Text>
        </View>
        <View style={{ width: '30%', alignItems: 'flex-end' }}>
          <View style={{ alignItems: "flex-end", marginTop: 4 }}>
          <Text style={[styles.statusText, { color: Colors.green }]}>{status}</Text>
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
            <Text style={styles.detailLeftText}>Transaction ID</Text>
            <Text style={styles.detailRightText}>{transactionId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Amount</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {amount}</Text>
          </View>
         
          
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TransactionCard;

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
