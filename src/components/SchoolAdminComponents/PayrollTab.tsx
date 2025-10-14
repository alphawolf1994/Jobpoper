import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import StaffListCard from "./StaffListCard";
import DepartmentListCard from "./DepartmentListCard";
import HolidayListCard from "./HolidayListCard";
import PayrollListCard from "./PayrollListCard";

// types.ts
export interface PayrollItem {
    id: string;
    name: string;
    department: string;
    designation: string;
    phone: string;
    amount: string;
    status: string;
  }
  
  // dummyData.ts
  export const PayrollDummy: PayrollItem[] = [
    {
      id: "P738197",
      name: "Kevin",
      department: "Admin",
      designation: "Technical Head",
      phone: "+1 63423 72397",
      amount: "15,000",
      status: "Paid",
    },
    {
      id: "P738197",
      name: "Willie",
      department: "Management",
      designation: "Receptionist",
      phone: "+1 82913 61371",
      amount: "12,000",
      status: "Generated",
    },
    {
      id: "P738196",
      name: "Daniel",
      department: "Management",
      designation: "Admin",
      phone: "+1 56752 86742",
      amount: "13,000",
      status: "Paid",
    },
    {
      id: "P738195",
      name: "Teresa",
      department: "Management",
      designation: "Admin",
      phone: "+1 82392 37359",
      amount: "13,000",
      status: "Paid",
    },
    {
      id: "P738194",
      name: "Johnson",
      department: "Finance",
      designation: "Accountant",
      phone: "+1 53619 54691",
      amount: "18,000",
      status: "Paid",
    },
  ];

const PayrollTab = () => {
    const renderItem = ({ item }: { item: PayrollItem }) => (
        <PayrollListCard
        id={item.id}
        name={item.name}
        department={item.department}
        designation={item.designation}
        phone={item.phone}
        amount={item.amount}
        status={item.status}
      />
    
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Payroll List" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={PayrollDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default PayrollTab;

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
