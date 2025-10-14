import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

import HeadingText from "../HeadingText";

import InvoiceCard from "./InvoiceCard";
interface InvoiceItem {
    invoiceId: string;
    buyerName: string;
    dateIssued: string;
    dueDate: string;
    totalAmount: number;
    paymentStatus: "Paid" | "Pending" | "Overdue";
  }
  
  export const invoiceList: InvoiceItem[] = [
    {
      invoiceId: "INV-001",
      buyerName: "Greenwood High",
      dateIssued: "2025-03-05",
      dueDate: "2025-03-20",
      totalAmount: 15000,
      paymentStatus: "Paid",
    },
    {
      invoiceId: "INV-002",
      buyerName: "Sunrise Public School",
      dateIssued: "2025-03-10",
      dueDate: "2025-03-25",
      totalAmount: 8500,
      paymentStatus: "Pending",
    },
    {
      invoiceId: "INV-003",
      buyerName: "Riverdale Academy",
      dateIssued: "2025-02-28",
      dueDate: "2025-03-15",
      totalAmount: 12300,
      paymentStatus: "Overdue",
    },
    {
      invoiceId: "INV-004",
      buyerName: "Bright Future School",
      dateIssued: "2025-03-15",
      dueDate: "2025-03-30",
      totalAmount: 10000,
      paymentStatus: "Paid",
    },
    {
      invoiceId: "INV-005",
      buyerName: "Starlight International",
      dateIssued: "2025-03-12",
      dueDate: "2025-03-27",
      totalAmount: 9750,
      paymentStatus: "Pending",
    },
  ];
  


const InvoiceManagementTab = () => {
  const renderItem = ({ item }: { item: InvoiceItem }) => (
    
    <InvoiceCard
    invoiceId={item.invoiceId}
    buyerName={item.buyerName}
    dateIssued={item.dateIssued}
    dueDate={item.dueDate}
    totalAmount={item.totalAmount}
    paymentStatus={item.paymentStatus}
   

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
    
    
        <HeadingText text="Invoice List" />
       <FlatList
         data={invoiceList}
         keyExtractor={(item) => item.invoiceId}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default InvoiceManagementTab;

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
