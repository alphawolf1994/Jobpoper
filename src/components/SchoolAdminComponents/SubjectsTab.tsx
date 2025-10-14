import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import BusinessProviderCard from "./BusinessProviderCard";
import SubjectCard from "./SubjectCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchSchoolSubjects } from "../../redux/slices/schoolsSlice";
import { schoolSubjects } from "../../interface/interfaces";




const SubjectsTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schoolSubjects, loading, errors } = useSelector(
    (state: RootState) => state.schoolsSlice
  );
  const { user,schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
 if(schoolId)
  {
    dispatch(fetchSchoolSubjects(schoolId));
  }
   
  
     
  
  }, [dispatch]);


  const renderItem = ({ item }: { item: schoolSubjects }) => (
    
    <SubjectCard
    name={item.name}
    subType={item.subType}
    status={item.status}
   
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Subjects" textStyle={{fontSize:16}}/> */}
      
       <FlatList
         data={schoolSubjects}
         keyExtractor={(item) => item._id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default SubjectsTab;

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
