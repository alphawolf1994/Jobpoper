import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils";

const MyJobsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Jobs (empty)</Text>
    </View>
  );
};

export default MyJobsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.white },
  text: { color: Colors.gray, fontSize: 18 },
});


