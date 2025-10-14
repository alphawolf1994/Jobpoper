import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import HomeworkCard from "./HomeworkCard";
import AcademicReasonCard from "./AcademicReasonCard";

// src/data/HomeworkDummy.ts

export interface ReasonItem {
    id: string;
    role: string;
    reason: string;
    createdDate: string;
  }
  
  const reasonData: ReasonItem[] = [
    { id: "1", role: "Teacher", reason: "Pregnancy", createdDate: "24 May 2024" },
    { id: "2", role: "Student", reason: "Fees Unpaid", createdDate: "21 May 2024" },
    { id: "3", role: "Staff", reason: "Complaint", createdDate: "16 May 2024" },
    { id: "4", role: "Student", reason: "Complaint", createdDate: "15 May 2024" },
    { id: "5", role: "Staff", reason: "Complaint", createdDate: "28 Apr 2024" },
  ];
  
  


const AcademicReasonsTab = () => {
  const renderItem = ({ item }: { item: ReasonItem }) => (
    
    <AcademicReasonCard
    id={item.id}
    role={item.role}
    reason={item.reason}
    createdDate={item.createdDate}
   
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Academic Reasons" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={reasonData}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default AcademicReasonsTab;

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
