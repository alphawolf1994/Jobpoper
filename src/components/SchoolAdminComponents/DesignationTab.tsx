import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import DesignationListCard from "./DesignationlistCard";

// types.ts
export interface DepartmentItem {
    id: string;
    department: string;
    status: string;
  }
  
  // dummyData.ts
  export const DepartmentDummy: DepartmentItem[] = [
    {
      id: "D757248",
      department: "Technical Head",
      status: "Active",
    },
    {
      id: "D757247",
      department: "Accountant",
      status: "Active",
    },
    {
      id: "D757246",
      department: "Teacher",
      status: "Active",
    },
    {
      id: "D757245",
      department: "Librarian",
      status: "Active",
    },
    {
      id: "D757244",
      department: "Doctor",
      status: "Inactive",
    },
  ];
  


const DesignationTab = () => {
    const renderItem = ({ item }: { item: DepartmentItem }) => (
        <DesignationListCard
          id={item.id}
          department={item.department}
          status={item.status}
        />
    
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Designation List" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={DepartmentDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default DesignationTab;

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
