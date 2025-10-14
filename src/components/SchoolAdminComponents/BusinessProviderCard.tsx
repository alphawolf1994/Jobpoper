import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import Button from "../Button";
import { useNavigation } from "@react-navigation/native";

interface EnrollmentCardProps {
  _id: string;
  name: string;
  organizationName: string;
  email: string;
  contact: string;
  address: string;
  type:string

}

const BusinessProviderCard = ({
  _id,
  name,
  organizationName,
  email,
  contact,
  address,
  type,
 
}: EnrollmentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{organizationName}</Text>
          <Text style={styles.subText}>Name: {name}</Text>
         
        </View>
        <View style={styles.rightColumn}>
         
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Email" value={email} />
          <DetailRow label="Contact" value={contact} />
          <DetailRow label="Address" value={address || 'N/A'}  />
          <Button label="View Details" onPress={() => navigation.navigate("TransportProviderDetailScreen", { userId: _id,type:type } as any)} />
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

export default BusinessProviderCard;

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
