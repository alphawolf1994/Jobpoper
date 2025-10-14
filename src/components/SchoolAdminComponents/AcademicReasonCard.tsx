// src/components/HomeworkCard.tsx

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

export interface ReasonItem {
    id: string;
    role: string;
    reason: string;
    createdDate: string;
  }
const AcademicReasonCard = ({
  id,
  role,
  reason,
  createdDate
}: ReasonItem) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{role}</Text>
          <Text style={styles.subText}>Reason: {reason}</Text>
        </View>
        <View style={styles.rightColumn}>
        <Text style={[styles.statusText, ]}>
            {createdDate}
          </Text>
          {/* <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" /> */}
        </View>
      </View>

     
    </TouchableOpacity>
  );
};



export default AcademicReasonCard;

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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  subText: {
    fontSize: 14,
    color: Colors.black,
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
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
});
