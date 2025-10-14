import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface HolidayListCardProps {
  id: string;
  holidayTitle: string;
  date: string;
  description: string;
  status: string;
}

const HolidayListCard = ({
  id,
  holidayTitle,
  date,
  description,
  status,
}: HolidayListCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials from holiday title
  const getInitials = (title: string) => {
    return title
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Determine status color
  const statusColor = status === "Active" ? Colors.green : Colors.Red;

  return (
    <TouchableOpacity 
      onPress={() => setIsOpen(!isOpen)} 
      style={styles.cardContainer}
    >
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          {/* <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(holidayTitle)}</Text>
          </View> */}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>{holidayTitle}</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status}
          </Text>
          <Entypo 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="black" 
          />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Holiday ID" value={id} />
          <DetailRow label="Date" value={date} />
          <DetailRow label="Description" value={description} />
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

export default HolidayListCard;

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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  dateText: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  rightColumn: {
    alignItems: "flex-end",
    minWidth: 80,
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
    width: "40%",
  },
  detailValue: {
    fontSize: 14,
    color: Colors.black,
    width: "60%",
    textAlign: "right",
  },
});