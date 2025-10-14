import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

import HeadingText from "../HeadingText";


import PaymentTrackingCard from "./PaymentTrackingCard";
interface PaymentItem {
    paymentId: string;
    buyerName: string;
    invoiceId: string;
    paymentMethod: "Bank Transfer" | "UPI" | "Credit Card" | "Cash";
    paymentDate: string;
    amountPaid: number;
    paymentStatus: "Completed" | "Pending";
  }
  
  export const paymentList: PaymentItem[] = [
    {
      paymentId: "PAY-001",
      buyerName: "Greenwood High",
      invoiceId: "INV-001",
      paymentMethod: "Bank Transfer",
      paymentDate: "2025-03-06",
      amountPaid: 15000,
      paymentStatus: "Completed",
    },
    {
      paymentId: "PAY-002",
      buyerName: "Sunrise Public School",
      invoiceId: "INV-002",
      paymentMethod: "UPI",
      paymentDate: "2025-03-22",
      amountPaid: 8500,
      paymentStatus: "Pending",
    },
    {
      paymentId: "PAY-003",
      buyerName: "Riverdale Academy",
      invoiceId: "INV-003",
      paymentMethod: "Credit Card",
      paymentDate: "2025-03-01",
      amountPaid: 12300,
      paymentStatus: "Completed",
    },
    {
      paymentId: "PAY-004",
      buyerName: "Bright Future School",
      invoiceId: "INV-004",
      paymentMethod: "Cash",
      paymentDate: "2025-03-16",
      amountPaid: 10000,
      paymentStatus: "Completed",
    },
    {
      paymentId: "PAY-005",
      buyerName: "Starlight International",
      invoiceId: "INV-005",
      paymentMethod: "Bank Transfer",
      paymentDate: "2025-03-25",
      amountPaid: 9750,
      paymentStatus: "Pending",
    },
  ];
  


const PaymentTrackingTab = () => {
  const renderItem = ({ item }: { item: PaymentItem }) => (
    
    <PaymentTrackingCard
    paymentId={item.paymentId}
    buyerName={item.buyerName}
    invoiceId={item.invoiceId}
    paymentMethod={item.paymentMethod}
    paymentDate={item.paymentDate}
    amountPaid={item.amountPaid}
    paymentStatus={item.paymentStatus}

   

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
    
    
        <HeadingText text="Payment Tracking List" />
       <FlatList
         data={paymentList}
         keyExtractor={(item) => item.paymentId}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default PaymentTrackingTab;

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
