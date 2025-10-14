import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../utils";
import ImagePath from "../../assets/images/ImagePath";
import { useNavigation } from "@react-navigation/native";

interface CardProps {
    subject: string;
    totalMarks: number;
    obtainMarks: number;
  
}

const SubjectResultCard: React.FC<CardProps> = ({ subject, totalMarks, obtainMarks }) => {
  // Calculate percentage
  const percentage = totalMarks > 0 ? ((obtainMarks / totalMarks) * 100).toFixed(0) : "0";
const navigation=useNavigation()
  // Determine grade
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };
  const grade = getGrade(parseFloat(percentage));

  return (
    <TouchableOpacity onPress={()=>{navigation.navigate('AcademicResult')}} style={[styles.card,]}>
        <View style={[styles.statsContainer,{marginTop:0}]}>
        <Text style={[styles.statText,styles.statValue]}>{grade}</Text>
        <Text style={[styles.statText,styles.statValue]}>{percentage}%</Text>
      </View>
      <Image source={ImagePath.HomeworkIcon}  style={styles.bookIcon}/>
      {/* <MaterialCommunityIcons name='book' size={24} color={Colors.secondary} style={styles.icon} /> */}
      <Text style={styles.title}>{subject}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Total: <Text style={styles.statValue}>{totalMarks}</Text></Text>
        <Text style={styles.statText}>Obtain: <Text style={styles.statValue}>{obtainMarks}</Text></Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 15,
    paddingVertical:15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor:Colors.SkyBlue
  },
  icon: {
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statText: {
    fontSize: 12,
  },
  statValue:{
    fontWeight:'bold'
  },
  bookIcon:{
    width:30,
    height:30,
    alignSelf:'center'
  }
});

export default SubjectResultCard;
