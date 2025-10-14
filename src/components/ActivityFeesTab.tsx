import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../utils";
import FeeDetailCard from "./FeeDetailCard";
const feeData = [
  {
    id: "1",
    title: "Activity Fee (Sports Day)",
    subtitle: "2,000",
    paid: false,
  },
  {
    id: "2",
    title: "Activity Fee (Science Exhibition)",
    subtitle: "1,500",
    paid: true,
  },
  {
    id: "3",
    title: "Activity Fee (Annual Function)",
    subtitle: "2,500",
    paid: true,
  },
];

const ActivityFeesTab = () => {
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

export default ActivityFeesTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
});
