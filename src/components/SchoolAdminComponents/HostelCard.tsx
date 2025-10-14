import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import { Hostel } from "../../interface/interfaces";

interface HostelCardProps {
  hostel: Hostel;
}

const HostelCard =  ({ hostel }: HostelCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{hostel?.hostelName}</Text>
          <Text style={styles.subText}>Type: {hostel?.hostelType}</Text>
         
        </View>
        <View style={styles.rightColumn}>
         
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Total Rooms	" value={hostel?.totalRooms?.toString()} />
          <DetailRow label="Occupied Rooms" value={hostel?.occupiedRooms?.toString()} />
          <DetailRow label="Available Rooms" value={hostel?.availableRooms?.toString()} />
          <DetailRow label="Address" value={hostel?.address} />
          <DetailRow label="Intake" value={hostel?.inTake?.toString()} />
          <DetailRow label="Description" value={hostel?.description} />
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

export default HostelCard;

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
