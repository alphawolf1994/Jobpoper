import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../utils";
import FeeDetailCard from "./FeeDetailCard";
const feeData = [
  {
    id: "1",
    title: "Exam Fee (1st Term)",
    subtitle: "5,000",
    paid: true,
  },
  {
    id: "2",
    title: "Exam Fee (2nd Term)",
    subtitle: "5,000",
    paid: true,
  },
  {
    id: "3",
    title: "Exam Fee (Final Term)",
    subtitle: "5,000",
    paid: false,
  },
];

const ExamFeesTab = () => {
  return (
    <View style={styles.container}>
    <FlatList
      data={feeData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FeeDetailCard
          title={item.title}
          subtitle={item.subtitle}
          paid={item.paid}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  </View>
  );
};

export default ExamFeesTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
});
