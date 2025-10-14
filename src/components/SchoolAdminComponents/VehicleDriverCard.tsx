import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import { VehicleDriver } from "../../interface/interfaces";

interface DriversCardProps {
  drivers: VehicleDriver;
}

const VehicleDriverCard = ({ drivers }: DriversCardProps) =>  {
  const [isOpen, setIsOpen] = useState(false);
  const capitalizedStatus = drivers?.status?.charAt(0)?.toUpperCase() + drivers?.status?.slice(1);
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{drivers?.driverName}</Text>
          <Text style={styles.subText}>Phone: {drivers?.driverContact}</Text>
         
        </View>
        <View style={styles.rightColumn}>
        <Text style={[styles.statusText, { color: drivers?.status === 'active' ? 'green' : Colors.Red }]}>
            {capitalizedStatus}
          </Text>
       
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Driver License No" value={drivers?.driverLicense} />
          <DetailRow label="Address" value={drivers?.Address} />
          <DetailRow label="Authorization" value={drivers?.isAuthorized==true?'Authorized':'Unauthorized'} />
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

export default VehicleDriverCard;

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
    width:'50%'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width:'50%',
    textAlign:'right'
  },
});
