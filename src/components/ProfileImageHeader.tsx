import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { Colors, heightToDp, widthToDp } from "../utils";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons"; // Import dropdown icon
import RBSheet from "react-native-raw-bottom-sheet";
import EnrolledStudents from "./EnrolledStudents";
const students = [
  { id: "1", name: "John Doe", className: "Grade 5", imageUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "2", name: "Emma Watson", className: "Grade 6", imageUrl: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: "3", name: "Michael Smith", className: "Grade 7", imageUrl: "https://randomuser.me/api/portraits/men/3.jpg" },
];
interface ProfileImageHeaderProps {
  imageUrl: string;
  
  showNotification?: boolean;
  ContainerStyles?: any;
}

const ProfileImageHeader = ({
  imageUrl,
  showNotification,
  ContainerStyles,
}: ProfileImageHeaderProps) => {
  const navigation = useNavigation();
  const studentBottomSheetRef = useRef<any>(null);
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const handleSearch = (student: { id: string; name: string; className: string; imageUrl: string }) => {
    setSelectedStudent(student);
    studentBottomSheetRef.current?.close();
  };
  return (
    <>
    <TouchableOpacity
      style={[styles.container, ContainerStyles]}
      onPress={() => {
        navigation.navigate("ProfileScreen");
      }}
    >
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        {/* {showNotification && <View style={styles.notificationBadge} />} */}
        <Image source={{ uri: selectedStudent.imageUrl }} style={styles.image} />
      </View>

      {/* Student Info and Dropdown */}
      <View style={styles.infoContainer}>
      <Text numberOfLines={2} style={styles.studentName}>
            {selectedStudent.name}
          </Text>
          <Text style={styles.className}>{selectedStudent.className}</Text>

      </View>

      {/* Dropdown Arrow */}
      <TouchableOpacity onPress={() => studentBottomSheetRef.current?.open()}>

      <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.white}  style={styles.iconStyle}/>
      </TouchableOpacity>
    </TouchableOpacity>
    <RBSheet
        ref={studentBottomSheetRef}
        height={300}
        openDuration={250}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
              <EnrolledStudents students={students} onSelect={handleSearch} />
        </KeyboardAvoidingView>
      </RBSheet>
    </>
  );
};

export default ProfileImageHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: 'flex-start',
    marginTop: heightToDp(7.5),
    marginRight: widthToDp(6),
  },
  imageContainer: {
    width: widthToDp(9),
    height: heightToDp(4.5),
    position: "relative",
  },
  notificationBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 10,
    height: 10,
    position: "absolute",
    right: 0,
    zIndex: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 200,
    borderWidth: 1,
  },
  infoContainer: {
    marginLeft: widthToDp(2),
    // flex: 1,
    maxWidth: widthToDp(30),
  },
  studentName: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.white,
    flexWrap: "wrap",
  },
  className: {
    fontSize: 12,
    color: Colors.white,
  },
  iconStyle:{
    marginLeft:10
  }
});
