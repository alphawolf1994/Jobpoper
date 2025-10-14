import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import ExpenseListCard from "./ExpenseListCard";

// types.ts
// types.ts
export interface ExpenseItem {
    id: string;
    expenseName: string;
    description: string;
    category: string;
    date: string;
    amount: string;
    invoiceNo: string;
    paymentMethod: string;
  }
  
  // dummyData.ts
  export const ExpenseDummy: ExpenseItem[] = [
    {
      id: "EX628148",
      expenseName: "Monthly Electricity",
      description: "Electricity of April month",
      category: "Utilities",
      date: "25 Apr 2024",
      amount: "1000",
      invoiceNo: "INV681537",
      paymentMethod: "Cash",
    },
    {
      id: "EX628147",
      expenseName: "Teacher Salary",
      description: "April payroll for teaching staff",
      category: "Salaries",
      date: "29 Apr 2024",
      amount: "20,000",
      invoiceNo: "INV681536",
      paymentMethod: "Credit",
    },
    {
      id: "EX628146",
      expenseName: "AC Repair",
      description: "Air Conditioning repair",
      category: "Maintenance",
      date: "11 May 2024",
      amount: "400",
      invoiceNo: "INV681535",
      paymentMethod: "Cash",
    },
    {
      id: "EX628149",
      expenseName: "Office Supplies",
      description: "Stationery and office supplies for May",
      category: "Supplies",
      date: "15 May 2024",
      amount: "200",
      invoiceNo: "INV681538",
      paymentMethod: "Debit",
    },
    {
      id: "EX628150",
      expenseName: "Internet Bill",
      description: "Monthly internet charges",
      category: "Utilities",
      date: "20 May 2024",
      amount: "150",
      invoiceNo: "INV681539",
      paymentMethod: "Credit",
    },
  ];

const ExpensesTab = () => {
    const renderItem = ({ item }: { item: ExpenseItem }) => (
        <ExpenseListCard
          id={item.id}
          expenseName={item.expenseName}
          description={item.description}
          category={item.category}
          date={item.date}
          amount={item.amount}
          invoiceNo={item.invoiceNo}
          paymentMethod={item.paymentMethod}
        />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Expense List" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={ExpenseDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default ExpensesTab;

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
