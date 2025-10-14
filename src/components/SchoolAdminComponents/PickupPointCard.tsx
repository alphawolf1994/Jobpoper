import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import { PickupPoint } from "../../interface/interfaces";

interface PickupPointsCardProps {
  PickupPoint: PickupPoint;
}

const PickupPointCard = ({ PickupPoint }: PickupPointsCardProps) =>{
  const [isOpen, setIsOpen] = useState(false);
  const capitalizedStatus = PickupPoint?.status?.charAt(0)?.toUpperCase() + PickupPoint?.status?.slice(1);
  return (
    <View  style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{PickupPoint?.pickupPointName}</Text>
          <Text style={styles.subText}>Address: {PickupPoint?.address}</Text>
         
        </View>
        <View style={styles.rightColumn}>
        <Text style={[styles.statusText, { color: PickupPoint?.status === 'active' ? 'green' : Colors.Red }]}>
            {capitalizedStatus}
          </Text>
          <Text style={[styles.statusText, { color: PickupPoint?.isAuthorized === true ? 'green' : Colors.Red }]}>
            {PickupPoint?.isAuthorized==true?'Authorized':'Unauthorized'}
          </Text>
          {/* <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" /> */}
        </View>
      </View>

      {/* {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Email" value={email} />
          <DetailRow label="Contact" value={contact} />
          <DetailRow label="Address" value={address} />
        
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

export default PickupPointCard;

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
    width:'30%'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width:'70%',
    textAlign:'right'
  },
});
