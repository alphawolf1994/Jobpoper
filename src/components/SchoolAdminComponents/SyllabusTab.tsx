import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import SyllabusCard from "./SyllabusCard";

interface SyllabusItem {
    id: string;
    class: string;
    section: string;
    subjects: string;
    createdDate: string;
    status: string;
  }
  

  const ClassSyllabusDummy: SyllabusItem[] = [
    {
      id: "1",
      class: "I",
      section: "A",
      subjects: "I, C English",
      createdDate: "10 May 2024",
      status: "Active"
    },
    {
      id: "2",
      class: "I",
      section: "B",
      subjects: "III, A Maths",
      createdDate: "11 May 2024",
      status: "Active"
    },
    {
      id: "3",
      class: "II",
      section: "A",
      subjects: "II, A English",
      createdDate: "12 May 2024",
      status: "Active"
    },
    {
      id: "4",
      class: "II",
      section: "B",
      subjects: "IV, A Physics",
      createdDate: "13 May 2024",
      status: "Active"
    },
    {
      id: "5",
      class: "II",
      section: "C",
      subjects: "V, A Chemistry",
      createdDate: "14 May 2024",
      status: "Active"
    }
  ];
  
  


const SyllabusTab = () => {
  const renderItem = ({ item }: { item: SyllabusItem }) => (
    
    <SyllabusCard
    class={item.class}
    section={item.section}
    subjects={item.subjects}
    createdDate={item.createdDate}
    status={item.status}
   
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Syylabus" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={ClassSyllabusDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default SyllabusTab;

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
