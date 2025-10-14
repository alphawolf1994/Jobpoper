import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import DepartmentListCard from "./DepartmentListCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Toast from "react-native-toast-message";
import { fetchSchoolDepartment } from "../../redux/slices/DepartmentSlice";
import Loader from "../Loader";

// types.ts
export interface DepartmentItem {
    id: string;
    name: string;
    status: boolean;
  }
  



const DepartmentTab = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { schoolDepartment, loading, errors } = useSelector(
    (state: RootState) => state.DepartmentSlice
  );
  

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSchoolDepartment()).unwrap();

      } catch (err) {

        console.error("Failed to fetch departments:", err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: typeof err === 'string' ? err : "Failed to load department",
        });
      }
    };
    fetchData();
  }, [dispatch]);
  useEffect(() => {
console.log("schoolDepartment =>",schoolDepartment)
  },[schoolDepartment])
    const renderItem = ({ item }: { item: DepartmentItem }) => (
        <DepartmentListCard
          id={item.id}
          name={item.name}
          status={item.status}
        />
    
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Department List" textStyle={{fontSize:16}}/> */}
      
       <FlatList
         data={schoolDepartment}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
       {loading && <Loader />}
    </View>
  );
};

export default DepartmentTab;

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
