import React from "react";
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface CardProps {
  title: string;
  value: string;
  color: string;
  iconColor:string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap; // Ensures valid icon names
}

const MicroFinanceHomeCard: React.FC<CardProps> = ({ title, value, color, icon,iconColor }) => {
  const navigation=useNavigation()
  return (
    <TouchableOpacity  style={[styles.card, { backgroundColor: color }]}>
     <View>
      <MaterialCommunityIcons name={icon} size={24} color={iconColor} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>{value}</Text>
      
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 10,
    paddingVertical:15,
    borderRadius: 10,
    marginBottom: 10,
    width:'49%',
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

export default MicroFinanceHomeCard;
