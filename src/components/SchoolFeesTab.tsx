import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../utils";
import FeeDetailCard from "./FeeDetailCard";

const feeData = [
  {
    id: "1",
    title: "School Fee (3st Semester)",
    subtitle: "33,000",
    paid: false,
  },
  {
    id: "2",
    title: "School Fee (2nd Semester)",
    subtitle: "33,000",
    paid: true,
  },
  {
    id: "3",
    title: "School Fee (1rd Semester)",
    subtitle: "33,000",
    paid: true,
  },
 
];


const SchoolFeesTab = () => {
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

export default SchoolFeesTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
});
