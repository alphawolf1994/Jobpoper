import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface DepartmentListCardProps {
  id: string;
  department: string;
  status: string;
}

const DesignationListCard = ({
  id,
  department,
  status,
}: DepartmentListCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials from department name
  const getInitials = (dept: string) => {
    return dept
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
            <Text style={styles.avatarText}>{getInitials(department)}</Text>
          </View> */}
          <View>
            <Text style={styles.title}>{department}</Text>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {status}
            </Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.idText}>ID: {id}</Text>
          <Entypo 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="black" 
          />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Designation" value={department} />
          <DetailRow label="Status" value={status} />
          <DetailRow label="Department ID" value={id} />
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

export default DesignationListCard;

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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  idText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.black,
  },
  rightColumn: {
    alignItems: "flex-end",
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
    fontWeight: "bold",
    color: Colors.black,
    width: "60%",
    textAlign: "right",
  },
});