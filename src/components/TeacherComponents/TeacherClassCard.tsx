import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../Button";
import { useNavigation } from "@react-navigation/native";
import { AssignedClass } from "../../interface/interfaces";

interface ClassCardProps {
  classInfo:AssignedClass
}

const TeacherClassCard = ({ classInfo }: ClassCardProps) => {
  const navigation = useNavigation();
  

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.className}>{classInfo.className}</Text>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionText}>Section {classInfo.section?.section}</Text>
        </View>
      </View>

       <View style={styles.detailRow}>
        <MaterialIcons name="meeting-room" size={20} color={Colors.black} />
        <Text style={styles.detailText}>{classInfo.classroom?.roomNo}</Text>
      </View>
<View style={styles.detailRow}>
        <MaterialIcons name="people" size={20} color={Colors.black} />
        <Text style={styles.detailText}>
          Students: {classInfo.maxStudents || 0}
        </Text>
      </View>
      {/*<View style={styles.detailRow}>
        <MaterialIcons name="menu-book" size={20} color={Colors.black} />
        <Text style={styles.detailText}>
          Subjects: {classInfo.subjects.join(", ")}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialIcons name="people" size={20} color={Colors.black} />
        <Text style={styles.detailText}>
          Students: {classInfo.studentCount}
        </Text>
      </View> */}
      <Button label="View Students" onPress={() => navigation.navigate("TeacherClassStudentList", { classId: classInfo?._id, } as any)} />
    
    </View>
  );
};

export default TeacherClassCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 16,
    borderRadius: 15,
    marginVertical: 8,
    // marginHorizontal: 15,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.white,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 8,
  },
  viewStudentsButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
});