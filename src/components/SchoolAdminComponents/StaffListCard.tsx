import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface StaffListCardProps {
  id: string;
    name: string;
    department: string;
    designation: string;
    phone: string;
    email: string;
    dateOfJoin: string;
    profileImage:string;
    contractType:string;
    phoneNumber:string;
    workShift:string;
    subRole:string;
    salary:string;
}
interface StaffListCardProp {
  staff: StaffListCardProps;
}
const StaffListCard = ({
 staff
}: StaffListCardProp) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <TouchableOpacity 
      onPress={() => setIsOpen(!isOpen)} 
      style={styles.cardContainer}
    >
      <View style={styles.row}>
        <View style={styles.leftColumn}>
        <View style={styles.avatar}>
          <Image source={{ uri: staff?.profileImage }} style={styles.profileImage} />
          </View>
          <View>
            <Text style={styles.title}>{staff?.name}</Text>
            <Text style={styles.departmentText}>{staff?.subRole}</Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          {/* <Text style={styles.idText}>ID: {id}</Text> */}
          <Entypo 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="black" 
          />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
      
          <DetailRow label="Salary" value={staff?.salary} />
          <DetailRow label="Contract Type" value={staff?.contractType} />
          <DetailRow label="Work Shift	" value={staff?.workShift} />

          <DetailRow label="Phone" value={staff?.phoneNumber} />
          <DetailRow label="Email" value={staff?.email} />
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

export default StaffListCard;

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
  departmentText: {
    fontSize: 12,
    color: Colors.darkGray,
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
},
});