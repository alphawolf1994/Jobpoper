import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils";

const HotJobsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hot Jobs (empty)</Text>
    </View>
  );
};

export default HotJobsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.white },
  text: { color: Colors.gray, fontSize: 18 },
});


