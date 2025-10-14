import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import { Student } from "../../interface/interfaces";
import Button from "../Button";
import { useNavigation } from "@react-navigation/native";

interface StudentCardProps {
  student: Student;
}

const SchoolStudentCard = ({ student }: StudentCardProps) => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const capitalizedStatus = student?.status?.charAt(0)?.toUpperCase() + student?.status?.slice(1);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
        <View style={styles.avatar}>
          <Image source={{ uri: student?.studentImage }} style={styles.profileImage} />
          </View>
          <View>
          <Text style={styles.title}>{student?.firstName} {student?.lastName}</Text>
          <Text style={styles.subText}>Id: {student?.rollNumber}</Text>
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
          <DetailRow label="Class"  value={student?.class?.className ?? student?.class ?? "N/A"}  />
          <DetailRow label="Section" value={student?.section?.section ?? student?.section ?? "N/A"} />
          <DetailRow label="Gender" value={student?.gender} />
          {student?.primaryContact && <DetailRow label="Contact" value={student?.primaryContact} />}
         {student?.admissionDate && <DetailRow label="Admission Date" value={formatDate(student?.admissionDate)} />}
          <Button label="View Details" onPress={() => navigation.navigate("SchoolStudentDetailsScreen", { Id: student?._id, } as any)} />

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

export default SchoolStudentCard;

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
leftColumn: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
},
});
