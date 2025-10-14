import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import BusinessProviderCard from "./BusinessProviderCard";
import ClassesCard from "./ClassesCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchSchoolClassess } from "../../redux/slices/schoolsSlice";
import { schoolClasses } from "../../interface/interfaces";

interface ClassesItem {
    class: string;
    section: string;
    maxNoOfStudent: string;
    noOfSubjects: string;
    classRoom: string;
    classCapacity: string;
    status: string;
  }
  

const ClassesDummy: ClassesItem[] = [
    {
      class: "I",
      section: "A, B",
      maxNoOfStudent: "10",
      noOfSubjects: "5",
      classRoom: "A-101",
      classCapacity: "10",
      status: "Active",
    },
    {
      class: "II",
      section: "A, B",
      maxNoOfStudent: "20",
      noOfSubjects: "5",
      classRoom: "A-102",
      classCapacity: "45",
      status: "Active",
    },
    {
      class: "III",
      section: "A, B",
      maxNoOfStudent: "30",
      noOfSubjects: "6",
      classRoom: "A-101",
      classCapacity: "10",
      status: "Active",
    },
    {
      class: "IV",
      section: "A",
      maxNoOfStudent: "50",
      noOfSubjects: "5",
      classRoom: "A-101",
      classCapacity: "10",
      status: "Active",
    },
  ];
  
  


const AllClassesTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schoolClasses, loading, errors } = useSelector(
    (state: RootState) => state.schoolsSlice
  );
  const { user,schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
 
      dispatch(fetchSchoolClassess());
  
     
  
  }, [dispatch]);


  const renderItem = ({ item }: { item: schoolClasses }) => (
    
    <ClassesCard
    school={item.school}
    className={item.className}
    sections={item.sections}
    maxStudents={item.maxStudents}
    numberOfSubjects={item.numberOfSubjects}
    classroom={item.classroom}
    status={item.status}

  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Classes List" textStyle={{fontSize:16}}/> */}
      
       <FlatList
         data={schoolClasses}
         keyExtractor={(item) => item._id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default AllClassesTab;

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
