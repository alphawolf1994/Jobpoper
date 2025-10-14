import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

interface Student {
  id: string;
  name: string;
  className: string;
  imageUrl: string;
}

interface EnrolledStudentsProps {
  students: Student[];
  onSelect: (student: Student) => void;
}

const EnrolledStudents = ({ students, onSelect }: EnrolledStudentsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Child</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.studentItem} onPress={() => onSelect(item)}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.className}>{item.className}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default EnrolledStudents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  className: {
    fontSize: 12,
    color: "gray",
  },
});
