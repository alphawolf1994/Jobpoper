import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import HomeworkCard from "./HomeworkCard";

// src/data/HomeworkDummy.ts

export interface HomeworkData {
    id: string;
    class: string;
    section: string;
    subject: string;
    homeworkDate: string;
    submissionDate: string;
    createdBy: string;
  }
  
  export const HomeworkDummy: HomeworkData[] = [
    {
      id: "HW1783929",
      class: "I",
      section: "A",
      subject: "English",
      homeworkDate: "10 May 2024",
      submissionDate: "12 May 2024",
      createdBy: "Janet",
    },
    {
      id: "HW1783928",
      class: "I",
      section: "B",
      subject: "Math",
      homeworkDate: "11 May 2024",
      submissionDate: "13 May 2024",
      createdBy: "Joann",
    },
    {
      id: "HW1783927",
      class: "II",
      section: "A",
      subject: "Physics",
      homeworkDate: "12 May 2024",
      submissionDate: "14 May 2024",
      createdBy: "Kathleen",
    },
    {
      id: "HW1783926",
      class: "II",
      section: "B",
      subject: "Chemistry",
      homeworkDate: "13 May 2024",
      submissionDate: "15 May 2024",
      createdBy: "Gifford",
    },
    {
      id: "HW1783925",
      class: "II",
      section: "C",
      subject: "Biology",
      homeworkDate: "14 May 2024",
      submissionDate: "16 May 2024",
      createdBy: "Lisa",
    },
  ];
  
  


const HomeworkTab = () => {
  const renderItem = ({ item }: { item: HomeworkData }) => (
    
    <HomeworkCard
    id={item.id}
    class={item.class}
    section={item.section}
    subject={item.subject}
    homeworkDate={item.homeworkDate}
    submissionDate={item.submissionDate}
    createdBy={item.createdBy}
   
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Class Home Works" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={HomeworkDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default HomeworkTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom:20
  },
});
