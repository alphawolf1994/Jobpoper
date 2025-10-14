import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import { schoolClassromms } from "../../interface/interfaces";



const ClassRoomCard = ({
    roomNo,
    capacity,
  status,
 
}: schoolClassromms) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View  style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{roomNo}</Text>
          <Text style={styles.subText}>Capacity: {capacity}</Text>
         
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.statusText, { color: status === 'Active' ? 'green' : Colors.Red }]}>
            {status}
          </Text>
          {/* <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" /> */}
        </View>
      </View>
{/* 
      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Start Date" value={start_date} />
          <DetailRow label="End Date" value={end_date} />
          <DetailRow label="Description" value={description} />
        
        </View>
      )} */}
    </View>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default ClassRoomCard;

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
    // alignItems: "center",
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
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
});
