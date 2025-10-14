import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import ClassRoomCard from "./ClassRoomCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchSchoolClassrooms } from "../../redux/slices/schoolsSlice";
import { schoolClassromms } from "../../interface/interfaces";

interface ProviderItem {
  roomNo: string;
  Capacity: Number;
  status: string;
}

const BusinessDummy: ProviderItem[] = [
    {
        roomNo: "A-101",
        Capacity: 10,
        status: "Active",
    },
    {
        roomNo: "A-102",
        Capacity: 45,
        status: "Active",
    },
    {
        roomNo: "A-103",
        Capacity: 50,
        status: "Active",
    },
  ];
  


const ClassRoomsTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schoolClassrooms, loading, errors } = useSelector(
    (state: RootState) => state.schoolsSlice
  );
  const { user,schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
  if(schoolId)
    {
      dispatch(fetchSchoolClassrooms(schoolId));
    }
     
  
  }, [dispatch]);


  const renderItem = ({ item }: { item: schoolClassromms }) => (
    
    <ClassRoomCard
    roomNo={item.roomNo}
    capacity={item.capacity}
    status={item.status}
  
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Class Rooms" textStyle={{fontSize:16}}/> */}
      
       <FlatList
         data={schoolClassrooms}
         keyExtractor={(item) => item._id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default ClassRoomsTab;

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
