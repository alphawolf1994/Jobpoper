import React from "react";
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface CardProps {
  title: string;
  value1: number;
  value2: number;
  label1: string;
  label2: string;
  color: string;
  iconColor:string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap; // Ensures valid icon names
}

const AttendanceCard: React.FC<CardProps> = ({ title, value1, value2, label1, label2, color, icon,iconColor }) => {
  const navigation=useNavigation()
  return (
    <TouchableOpacity onPress={()=>{navigation.navigate("AttendanceScreen")}} style={[styles.card, { backgroundColor: color }]}>
     <View>
      <MaterialCommunityIcons name={icon} size={24} color={iconColor} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>{label1}: <Text style={styles.statValue}>{value1}</Text></Text>
        <Text style={styles.statText}>{label2}: <Text style={styles.statValue}>{value2}</Text></Text>
      </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 15,
    paddingVertical:15,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statText: {
    fontSize: 12,
  },
  statValue:{
    fontWeight:'bold'
  }
});

export default AttendanceCard;
