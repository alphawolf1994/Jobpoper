import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import { FeeMaster } from "../../interface/interfaces";

interface FeeMasterCardProps {
  feeMaster: FeeMaster;
}

const FeesMasterCard = ({ feeMaster }: FeeMasterCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{feeMaster?.feeType}</Text>
          <Text style={styles.subText}>Duration: {feeMaster?.duration?.from} - {feeMaster?.duration?.to}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.statusText, { color: feeMaster?.status === 'Active' ? 'green' : Colors.Red }]}>
             {feeMaster?.status}
          </Text>
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
         
          <DetailRow label="Due Date" value={feeMaster?.dueDate} />
          <DetailRow label="Fine Type" value={feeMaster?.fineType || 'N/A'} />
          <DetailRow label="Fine %" value={feeMaster?.finePercentage.toString()} />
          <DetailRow label="Fine Amount" value={`${CurrencySign} ${feeMaster?.fineAmount}`} />
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

export default FeesMasterCard;

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
    flex: 1,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  subText: {
    fontSize: 14,
    color: Colors.black,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
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
    width: '50%',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width: '50%',
    textAlign: 'right',
  },
});
