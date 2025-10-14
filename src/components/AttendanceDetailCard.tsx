import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils";

interface AttendanceDetailProps {
  term: string;
  attendedDays: number;
  totalDays: number;
}

const AttendanceDetailCard: React.FC<AttendanceDetailProps> = ({ term, attendedDays, totalDays }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.term}>{term}</Text>
      <View style={styles.attendanceBox}>
        <Text style={styles.attendanceText}>
          <Text style={styles.boldText}>{attendedDays} / {totalDays} Days</Text>
        </Text>
        <Text style={styles.subText}>Total attendance of the student</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  term: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  attendanceBox: {
    backgroundColor:Colors.lightMintGreen,
    padding: 14,
    borderRadius: 10,
  },
  attendanceText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
  },
  boldText: {
    fontWeight: "bold",
    color:Colors.green
  },
  subText: {
    fontSize: 14,
    color:Colors.green,
    textAlign: "center",
  },
});

export default AttendanceDetailCard;
