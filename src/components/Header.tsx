import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import { Colors } from "../utils";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import ImagePath from "../assets/images/ImagePath";


const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>
          JobPoper
         
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.bellWrapper} activeOpacity={0.7}>
          <Ionicons
            name="notifications-outline"
            size={28}
            
          />
          <View style={styles.redDot} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatar} activeOpacity={0.7}>
          <Image source={ImagePath.avatarIcon} style={styles.avatarImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 16,
   
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
   
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary || "#1a1a1a",
  },
  oInline: {
    backgroundColor: Colors.primary || "#2B8EF6",
    color: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 13,
    overflow: "hidden",
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: "700",
  },
  actions: { flexDirection: "row", alignItems: "center" },
  bellWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  redDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor:  "#FF3B30",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 18,
    
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 18,
    resizeMode: "contain",
  },
});