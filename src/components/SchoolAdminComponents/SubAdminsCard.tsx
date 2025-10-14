import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import { Hostel } from "../../interface/interfaces";

interface HostelCardProps {
  subAdmin: any;
}

const SubAdminsCard =  ({ subAdmin }: HostelCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const capitalizedStatus = subAdmin?.user?.status?.charAt(0)?.toUpperCase() + subAdmin?.user?.status?.slice(1);
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
             <View style={styles.avatar}>
                      <Image source={{ uri: subAdmin?.user?.profileImage }} style={styles.profileImage} />
                      </View>
<View>
          <Text style={styles.title}>{subAdmin?.user?.name}</Text>
          <Text style={styles.subText}>Role: {subAdmin?.user?.role[0]}</Text>
         </View>
        </View>
        <View style={styles.rightColumn}>
          {capitalizedStatus && <Text style={[styles.statusText, { color: capitalizedStatus === 'Active' ? 'green' : Colors.Red }]}>
                     {capitalizedStatus}
                   </Text>}
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Email" value={subAdmin?.user?.email} />
          <DetailRow label="Contact" value={subAdmin?.user?.phoneNumber} />
          <DetailRow label="Address" value={subAdmin?.user?.address} />
        
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

export default SubAdminsCard;

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
  flexDirection: "row",
  alignItems: "center",
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
   avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
},
});
