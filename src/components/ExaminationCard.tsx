import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, widthToDp } from "../utils";
import Checkbox from "expo-checkbox";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface ExaminationCardProps {
  item: any;
}

const ExaminationCard = ({ item }: ExaminationCardProps) => {
  const [isChecked, setChecked] = useState(false);
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={()=>{navigation.navigate("ExamScreen")}}>
      <View style={{ marginLeft: 10 }}>
        <Text
          numberOfLines={1}
          style={{
            ...styles.cardTitle,
          }}
        >
          {item.title}
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
        >
          <Entypo name="stopwatch" size={16} color={Colors.black} />
          <Text
            style={{
              ...styles.cardDescription,
            }}
          >
            {" "}
            {item.subtitle}
          </Text>
        </View>

        {!item.isCompleted ? (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              backgroundColor: Colors.primary,
              padding: 5,
              borderRadius: 10,
              width: widthToDp(20),
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <FontAwesome name="play" size={10} color={Colors.white} />
            <Text style={{ marginLeft: 4, fontSize: 10, color: Colors.white }}>
              Start Test
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 13, color: Colors.black }}>
              Score: 40 / 200
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                backgroundColor: Colors.green,
                padding: 5,
                borderRadius: 10,
                width: widthToDp(30),
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <Text
                style={{ marginLeft: 4, fontSize: 10, color: Colors.white }}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View
        style={{
          justifyContent: "center",
        }}
      >
        <Entypo name="chevron-right" size={24} color={Colors.lightGreen} />
      </View>
    </TouchableOpacity>
  );
};

export default ExaminationCard;

const styles = StyleSheet.create({
  // ExaminationCard styles
  cardContainer: {
    backgroundColor: Colors.lightMintGreen,
    padding: 10,
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "400",
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: "100",
  },
  checkbox: {
    margin: 8,
    borderRadius: 10,
  },
});
