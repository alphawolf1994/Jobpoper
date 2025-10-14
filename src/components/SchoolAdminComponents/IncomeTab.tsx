import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import IncomeListCard from "./IncomeListCard";

// types.ts
export interface IncomeItem {
    id: string;
    incomeName: string;
    description: string;
    source: string;
    date: string;
    amount: string;
    invoiceNo: string;
    paymentMethod: string;
  }
  
  // dummyData.ts
  export const IncomeDummy: IncomeItem[] = [
    {
      id: "I639248",
      incomeName: "April Month Fees",
      description: "Tuition for Term 1, Class II",
      source: "Tuition Fees",
      date: "25 Apr 2024",
      amount: "15,000",
      invoiceNo: "INV681537",
      paymentMethod: "Cash",
    },
    {
      id: "I639247",
      incomeName: "STEM Program Grant",
      description: "Annual funding for STEM programs",
      source: "Government Grants",
      date: "29 Apr 2024",
      amount: "20,000",
      invoiceNo: "INV681536",
      paymentMethod: "Credit",
    },
    {
      id: "I639246",
      incomeName: "Alumni Scholarship",
      description: "Donation from Alumni for scholarships",
      source: "Donations",
      date: "11 May 2024",
      amount: "1000",
      invoiceNo: "INV681535",
      paymentMethod: "Cash",
    },
    {
      id: "I639245",
      incomeName: "Uniform Sales",
      description: "Sale of school uniforms",
      source: "Merchandise",
      date: "16 May 2024",
      amount: "10,500",
      invoiceNo: "INV681534",
      paymentMethod: "Cash",
    },
    {
      id: "I639244",
      incomeName: "Event Parking Fees",
      description: "Monthly parking fees for external users",
      source: "Parking Fees",
      date: "21 May 2024",
      amount: "8000",
      invoiceNo: "INV681533",
      paymentMethod: "Cash",
    },
  ];

const IncomeTab = () => {
    const renderItem = ({ item }: { item: IncomeItem }) => (
        <IncomeListCard
          id={item.id}
          incomeName={item.incomeName}
          description={item.description}
          source={item.source}
          date={item.date}
          amount={item.amount}
          invoiceNo={item.invoiceNo}
          paymentMethod={item.paymentMethod}
        />
    
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Income List" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={IncomeDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default IncomeTab;

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
