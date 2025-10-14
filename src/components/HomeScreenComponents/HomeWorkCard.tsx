import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import ImagePath from "../../assets/images/ImagePath";
import { Colors } from "../../utils";
import { useNavigation } from "@react-navigation/native";

interface HomeworkItem {
  subject: string;
  subjectColor: string;
  title: string;
  teacher: string;
  dueDate: string;
  imageUrl: string;
}

interface HomeworkCardProps {
  homework: HomeworkItem;  // Accept full item as a prop
}
const HomeworkCard: React.FC<HomeworkCardProps> = ({ homework }) => {

  const navigation=useNavigation()
  return (
    <TouchableOpacity  onPress={() => navigation.navigate("HomeworkDetailsScreen", { homework })} style={styles.cardContainer}>
      <Image source={ ImagePath.HomeworkIcon } style={styles.image} />
      <View style={styles.textContainer}>
        {/* Subject */}
        <Text style={[styles.subject, { color: homework.subjectColor }]}>
          <Entypo name="bookmark" size={12} color={homework.subjectColor} /> {homework.subject}
        </Text>

        {/* Title */}
        <Text style={styles.title}>{homework.title}</Text>

        {/* Teacher & Due Date */}
        <Text style={styles.teacher}>{homework.teacher}</Text>
        <Text style={styles.dueDate}>Due by: {homework.dueDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor:Colors.white,
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  subject: {
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
    marginTop: 4,
  },
  teacher: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
  },
  dueDate: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
});

export default HomeworkCard;
