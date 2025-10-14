import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../utils";

interface SyllabusCardProps {
  class: string;
  section: string;
  subjects: string;
  createdDate: string;
  status: string;
}

const SyllabusCard = ({
  class: className,
  section,
  subjects,
  createdDate,
  status,
}: SyllabusCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>Class {className} - Section {section}</Text>
          <Text style={styles.subText}>Subjects: {subjects}</Text>
          <Text style={styles.subText}>Created: {createdDate}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.statusText, { color: status === 'Active' ? 'green' : Colors.Red }]}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SyllabusCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  subText: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
});
