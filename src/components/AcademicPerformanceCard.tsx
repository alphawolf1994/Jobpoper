import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils";

interface Subject {
  name: string;
  qtr1?: string;
  qtr2?: string;
  term?: string;
  final?: string;
}

interface AcademicPerformanceProps {
  term: string;
  subjects: Subject[];
  gpa: number;
}

const AcademicPerformanceCard: React.FC<AcademicPerformanceProps> = ({ term, subjects, gpa }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.term}>{term}</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.headerRow]}>
          <Text style={[styles.headerText, styles.subjectColumn]}>Subject</Text>
          {subjects[0].qtr1 && <Text style={styles.headerText}>Qtr 1</Text>}
          {subjects[0].qtr2 && <Text style={styles.headerText}>Qtr 2</Text>}
          <Text style={styles.headerText}>{subjects[0].final ? "Final" : term}</Text>
        </View>

        {/* Table Rows with Stripe Effect */}
        {subjects.map((subject, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
            ]}
          >
            <Text style={[styles.subjectText, styles.subjectColumn]}>{subject.name}</Text>
            {subject.qtr1 && <Text style={styles.gradeText}>{subject.qtr1}</Text>}
            {subject.qtr2 && <Text style={styles.gradeText}>{subject.qtr2}</Text>}
            <Text style={[styles.gradeText, styles.boldText]}>{subject.final || subject.term}</Text>
          </View>
        ))}

        {/* GPA Row */}
        <View style={styles.gpaRow}>
          <Text style={styles.gpaText}>GPA</Text>
          <Text style={styles.gpaValue}>{gpa.toFixed(2)}</Text>
        </View>
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
    fontWeight: "bold",
    marginBottom: 6,
  },
  table: {
    backgroundColor: Colors.Platinum,
    borderRadius: 10,
    // padding: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  headerRow: {
    paddingVertical: 15,
  },
  evenRow: {
    backgroundColor: Colors.lightGray, // Light Green Stripe
  },
  oddRow: {
    backgroundColor: Colors.Platinum,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  subjectColumn: {
    flex: 2,
    textAlign: "left",
  },
  subjectText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight:'bold',
    textAlign: "left",
  },
  gradeText: {
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
  },
  gpaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 6,
    marginTop: 6,
  },
  gpaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.Red,
    marginRight: 40, // Closer to value
  },
  gpaValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    marginRight: 35,
  },
});

export default AcademicPerformanceCard;
