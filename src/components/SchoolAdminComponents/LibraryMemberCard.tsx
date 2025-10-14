import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface SchoolTeacherCardProps {
  id: string;
  name: string;
  cardNo: string;
  email: string;
  dateOfJoin: string;
  mobile: string;
  imageUrl:string
}

const LibraryMemberCard = ({
  id,
  name,
  cardNo,
  email,
  dateOfJoin,
  mobile,
  imageUrl
}: SchoolTeacherCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <View style={styles.avatar}>
          <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          </View>
          <Text style={styles.title}>{name}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.statusText}>ID: {id}</Text>
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Card No" value={cardNo} />
          <DetailRow label="Email" value={email} />
          <DetailRow label="Date of Join" value={dateOfJoin} />
          <DetailRow label="Mobile" value={mobile} />
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

export default LibraryMemberCard;

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
  rightColumn: {
    alignItems: "flex-end",
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
    width: "50%",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width: "50%",
    textAlign: "right",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
},
});
