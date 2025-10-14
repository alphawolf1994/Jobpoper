import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../utils";
import MultimediaCard from "./MultimediaCard";

const MultimediaTab = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
        renderItem={({ item }) => (
          <MultimediaCard
            title="Social Science Syllabus"
            subtitle="Syllabus for 2020 batch"
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MultimediaTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
});
