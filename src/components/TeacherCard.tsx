import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { Linking } from "react-native";
import { Colors } from "../utils";
import Button from "./Button";
import { useNavigation } from "@react-navigation/native";

interface TeacherCardProps {
  name: string;
  role: string;
  subject?: string;
  imageUrl: string;
  experience: string;
  contactNumber: string;
  availability: string;
}

const TeacherCard = ({ name, role, subject, imageUrl, experience, contactNumber, availability }: TeacherCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
const navigation=useNavigation()
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: imageUrl }} style={styles.profileImage} />

        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardSubtitle}>{role}</Text>
          {subject && <Text style={styles.cardSubject}>{subject}</Text>}
        </View>

        <Entypo name={isOpen ? "chevron-small-up" : "chevron-small-down"} size={24} color="black" />
      </View>

      {isOpen && (
        <View style={styles.detailContainer}>
             <View style={styles.detailRow}>
            <Text>Experience</Text>
            <Text style={styles.detailRightText}> {experience} years</Text>
          </View>
          {subject &&<View style={styles.detailRow}>
            <Text >Subjects</Text>
            <Text style={styles.detailRightText}> {subject} </Text>
          </View>}
          <View style={styles.detailRow}>
            <Text >Availability</Text>
            <Text style={styles.detailRightText}> {availability}</Text>
          </View>
         
         
          <Button label={`Chat`} onPress={()=>{navigation.navigate("ChatMessages", { chatUser: {name:name,id:1,avatar:imageUrl} })}} />
        
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: { width: 50, height: 50, borderRadius: 25 },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardSubtitle: { fontSize: 14, color: Colors.gray },
  cardSubject: { fontSize: 14, color: Colors.primary },
  detailContainer: {  marginTop: 10,
    borderTopWidth: 0.5,
    borderColor: Colors.lightBlue, },

 
  
  detailRightText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  detailRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default TeacherCard;
