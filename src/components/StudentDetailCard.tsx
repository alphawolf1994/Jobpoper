import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../utils";

interface StudentDetailProps {
  profileImage: string;
  name: string;
  classInfo: string;
  rollNumber: string;
  dob: string;
  bloodGroup: string;
  emergencyContact: string;
  position: string;
  fatherName: string;
  motherName: string;
}

const StudentDetailCard: React.FC<StudentDetailProps> = ({
  profileImage,
  name,
  classInfo,
  rollNumber,
  dob,
  bloodGroup,
  emergencyContact,
  position,
  fatherName,
  motherName,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.classInfo}>{classInfo}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <DetailItem label="Roll Number" value={rollNumber} />
        <DetailItem label="Date of Birth" value={dob} />
        <DetailItem label="Blood Group" value={bloodGroup} />
        <DetailItem label="Emergency Contact" value={emergencyContact} />
        <DetailItem label="Position in Class" value={position} />
        <DetailItem label="Father's Name" value={fatherName} />
        <DetailItem label="Mother's Name" value={motherName} />
      </View>
    </View>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
   
    // padding: 16,
  
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom:5
  },
  classInfo: {
    fontSize: 14,
    color: Colors.gray
  },
  details: {
   
    paddingTop: 0,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomColor:Colors.grayShade1,
    borderBottomWidth:1
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    width:'50%'
  },
  value: {
    fontSize: 16,
    width:'50%',
    color:Colors.secondary,
  },
});

export default StudentDetailCard;
