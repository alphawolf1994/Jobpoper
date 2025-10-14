import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import BusinessProviderCard from "./BusinessProviderCard";
import AssignVehicleCard from "./AssignVehicleCard";
import SchoolTeacherCard from "./SchoolTeacherCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Toast from "react-native-toast-message";

import Loader from "../Loader";
import { Teacher } from "../../interface/interfaces";
import { fetchSchoolTeachers } from "../../redux/slices/teacherSlice";

interface TeacherItem {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  classes: string[]; // array to handle multiple classes
  subjects: string;
  status: "Active" | "Inactive";
}


const TeacherDummy: TeacherItem[] = [
  {
    id: "1",
    name: "John Deo",
    email: "john@deo.com",
    contact: "0255 123 411",
    address: "Address",
    classes: ["I"],
    subjects: "English",
    status: "Active",
  },
  {
    id: "2",
    name: "Daudi Leonard",
    email: "daudi@gmail.com",
    contact: "0255 123 485",
    address: "Add",
    classes: ["II", "III"],
    subjects: "Maths",
    status: "Active",
  },
];

  
  


const SchoolTeachersTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schoolTeachers, loading, errors } = useSelector(
    (state: RootState) => state.teacherSlice
  );
  const { user, schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSchoolTeachers()).unwrap();

      } catch (err) {

        console.error("Failed to fetch proposals:", err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: typeof err === 'string' ? err : "Failed to load fee",
        });
      }
    };
    fetchData();
  }, [dispatch]);

  const renderItem = ({ item }: { item: Teacher }) => (
    
    <SchoolTeacherCard
   teacher={item}
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Teachers List" textStyle={{fontSize:16}}/> */}
      
      <FlatList
         data={schoolTeachers}
         keyExtractor={(item) => item._id}
         renderItem={renderItem}
         ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>No data available</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
       />
       </KeyboardAvoidingScrollView>
       {loading && <Loader />}
    </View>
  );
};

export default SchoolTeachersTab;

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
