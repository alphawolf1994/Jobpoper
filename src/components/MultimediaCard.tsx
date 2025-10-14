import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, widthToDp } from "../utils";
import Checkbox from "expo-checkbox";
import { Entypo, FontAwesome } from "@expo/vector-icons";

interface MultimediaCardProps {
  title: string;
  subtitle: string;
}

const MultimediaCard = ({ title, subtitle }: MultimediaCardProps) => {
  const [isChecked, setChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            backgroundColor: Colors.white,
            padding: 10,
            paddingVertical: 20,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: Colors.lightBlue,
          }}
        >
          <Text style={{ color: Colors.secondary, fontSize: 12 }}>PDF</Text>
        </View>
        <View style={{ marginLeft: 0, justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.cardTitle,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                ...styles.cardDescription,
              }}
            >
              {subtitle}{" "}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                ...styles.cardDescription,
              }}
            >
              12 Pages / 360 KB
            </Text>
          </View>
        </View>
        <View
          style={{
            width: widthToDp(20),
          }}
        ></View>
      </View>
    </TouchableOpacity>
  );
};

export default MultimediaCard;

const styles = StyleSheet.create({
  // HomeworkCard styles
  detailLeftText: {
    fontSize: 14,
  },
  detailRightText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  detailRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContainer: {
    backgroundColor: Colors.PastelPink,
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
  dateText: {
    color: Colors.gray,
  },
  cardTitle: {
    fontSize: 12,
  },
  cardDescription: {
    fontSize: 12,
    fontWeight: "100",
  },
  checkbox: {
    margin: 8,
    borderRadius: 10,
  },
});
