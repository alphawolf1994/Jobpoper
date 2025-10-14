import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import BusinessProviderCard from "./BusinessProviderCard";
import AssignVehicleCard from "./AssignVehicleCard";
import SchoolParentCard from "./SchoolParentCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Toast from "react-native-toast-message";
import { fetchSchoolParents } from "../../redux/slices/schoolsSlice";
import { SchoolParent } from "../../interface/interfaces";
import Loader from "../Loader";

interface ParentItem {
    id: string;
    parentName: string;
    parentRole: string;
    childName: string;
    childClass: string;
    phone: string;
    email: string;
  }
  

  const ParentDummy: ParentItem[] = [
    {
      id: "1",
      parentName: "Muzan",
      parentRole: "Father",
      childName: "Nezuko Uzumaki",
      childClass: "I - A",
      phone: "6254845455",
      email: "babar.bhai@gmail.com",
    },
    {
      id: "2",
      parentName: "Brown",
      parentRole: "Father",
      childName: "Alex Brown",
      childClass: "I - A",
      phone: "6254845000",
      email: "fahad456@gmail.com",
    },
    {
      id: "3",
      parentName: "Black",
      parentRole: "Father",
      childName: "Jason Black",
      childClass: "I - B",
      phone: "9135498542",
      email: "jason@gmail.com",
    },
    {
      id: "4",
      parentName: "Juma Hassan",
      parentRole: "Father",
      childName: "Amina Juma",
      childClass: "I - B",
      phone: "5565558869",
      email: "hassan@gmail.com",
    },
    {
      id: "5",
      parentName: "Mwita John",
      parentRole: "Father",
      childName: "Baraka Mwita",
      childClass: "II - A",
      phone: "8562223223",
      email: "mwita@gmail.com",
    },
  ];
  
  
  


const SchoolParentTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schoolParents, loading, errors } = useSelector(
    (state: RootState) => state.schoolsSlice
  );
  const { user, schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSchoolParents()).unwrap();

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

  const renderItem = ({ item }: { item: SchoolParent }) => (
    
    <SchoolParentCard
    parent={item}
  
    
    />
  );
  
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Parents List" textStyle={{fontSize:16}}/> */}
      
      <FlatList
         data={schoolParents}
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

export default SchoolParentTab;

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
