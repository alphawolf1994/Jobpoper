import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";


import TransactionListCard from "./TransactionListCard";

// types.ts
export interface TransactionItem {
    id: string;
    description: string;
    transactionDate: string;
    amount: string;
    transactionType: 'Income' | 'Expense';
    paymentMethod: string;
    status: string;
  }
  
  // dummyData.ts
  export const TransactionDummy: TransactionItem[] = [
    {
      id: "FT624893",
      description: "April Month Fees",
      transactionDate: "25 Apr 2024",
      amount: "15,000",
      transactionType: "Income",
      paymentMethod: "Cash",
      status: "Computed",
    },
    {
      id: "FT624892",
      description: "Monthly Electricity",
      transactionDate: "27 Apr 2024",
      amount: "1000",
      transactionType: "Expense",
      paymentMethod: "Credit",
      status: "Computed",
    },
    {
      id: "FT624891",
      description: "Alumni Scholarship",
      transactionDate: "03 May 2024",
      amount: "1000",
      transactionType: "Income",
      paymentMethod: "Cash",
      status: "Proving",
    },
    {
      id: "FT624890",
      description: "AC Repair",
      transactionDate: "15 May 2024",
      amount: "400",
      transactionType: "Expense",
      paymentMethod: "Cash",
      status: "Computed",
    },
    {
      id: "FT624889",
      description: "Uniform Sales",
      transactionDate: "20 May 2024",
      amount: "10,500",
      transactionType: "Income",
      paymentMethod: "Credit",
      status: "Computed",
    },
  ];

const TransactionsTab = () => {
    const renderItem = ({ item }: { item: TransactionItem }) => (
        <TransactionListCard
          id={item.id}
          description={item.description}
          transactionDate={item.transactionDate}
          amount={item.amount}
          transactionType={item.transactionType}
          paymentMethod={item.paymentMethod}
          status={item.status}
        />
    
    
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Transactions List" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={TransactionDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default TransactionsTab;

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
