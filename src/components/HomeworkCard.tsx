import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../utils";
import Checkbox from "expo-checkbox";

interface HomeworkCardProps {
  title: string;
  subtitle: string;
}

const HomeworkCard = ({ title, subtitle }: HomeworkCardProps) => {
  const [isChecked, setChecked] = useState(false);

  return (
    <TouchableOpacity style={styles.cardContainer}>
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        onValueChange={setChecked}
        color={Colors.secondary}
      />
      <View style={{ marginLeft: 10,marginRight:15 }}>
        <Text
          numberOfLines={1}
          style={{
            ...styles.cardTitle,
          }}
        >
          {title}
        </Text>
        <Text
          // numberOfLines={1}
          style={{
            ...styles.cardDescription,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default HomeworkCard;

const styles = StyleSheet.create({
  // HomeworkCard styles
  cardContainer: {
    
    backgroundColor: Colors.lightPink,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: "100",
    marginTop:5
  },
  checkbox: {
    margin: 8,
    borderRadius: 10,
  },
});
