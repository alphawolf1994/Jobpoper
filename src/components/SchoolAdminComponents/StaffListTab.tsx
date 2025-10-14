import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import StaffListCard from "./StaffListCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchSchoolStaff } from "../../redux/slices/StaffSlice";
import Toast from "react-native-toast-message";
import Loader from "../Loader";

// types.ts
// types.ts
export interface StaffItem {
    id: string;
    name: string;
    department: string;
    designation: string;
    phone: string;
    email: string;
    dateOfJoin: string;
    profileImage:string;
    contractType:string;
    phoneNumber:string;
    workShift:string;
    subRole:string;
    salary:string;
  }
  
 
  


const StaffTab = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { schoolStaff, loading, errors } = useSelector(
    (state: RootState) => state.StaffSlice
  );
  

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSchoolStaff()).unwrap();

      } catch (err) {

        console.error("Failed to fetch staff:", err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: typeof err === 'string' ? err : "Failed to load staff",
        });
      }
    };
    fetchData();
  }, [dispatch]);
  useEffect(() => {
console.log("schoolStaff =>",schoolStaff)
  },[schoolStaff])
  const renderItem = ({ item }: { item: StaffItem }) => (
    
    <StaffListCard
    staff={item}
  
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Staff List" textStyle={{fontSize:16}}/> */}
      
       <FlatList
         data={schoolStaff}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
       {loading && <Loader />}
    </View>
  );
};

export default StaffTab;

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
