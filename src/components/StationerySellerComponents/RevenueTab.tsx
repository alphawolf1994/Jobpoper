import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

import HeadingText from "../HeadingText";

import RevenueCard from "./RevenueCard";
interface InvoiceItem {
    month: string;
    totalRevenue: string;
    grossProfit: string;
    newProfit: string;
    costGoodSold: string;
   
  }
  
  export const invoiceList: InvoiceItem[] = [
    {
        month: "January 2025",
        totalRevenue: "5,00,000",
        grossProfit: "2,50,000",
        newProfit: "1,80,000",
        costGoodSold: '2,20,000',
    
    },
    {
        month: "February 2025",
        totalRevenue: "5,00,000",
        grossProfit: "2,50,000",
        newProfit: "1,80,000",
        costGoodSold: '2,20,000',
    },
    {
        month: "March 2025",
        totalRevenue: "5,00,000",
        grossProfit: "2,50,000",
        newProfit: "1,80,000",
        costGoodSold: '2,20,000',
    },
    {
        month: "April 2025",
        totalRevenue: "5,00,000",
        grossProfit: "2,50,000",
        newProfit: "1,80,000",
        costGoodSold: '2,20,000',
    },
    {
        month: "May 2025",
        totalRevenue: "5,00,000",
        grossProfit: "2,50,000",
        newProfit: "1,80,000",
        costGoodSold: '2,20,000',
    },
  ];
  


const RevenueTab = () => {
  const renderItem = ({ item }: { item: InvoiceItem }) => (
    
    <RevenueCard
    month={item.month}
    totalRevenue={item.totalRevenue}
    grossProfit={item.grossProfit}
    newProfit={item.newProfit}
    costGoodSold={item.costGoodSold}
 
   

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
    
    
        <HeadingText text="Revenue Report List" />
       <FlatList
         data={invoiceList}
         keyExtractor={(item) => item.month}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default RevenueTab;

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
