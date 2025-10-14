import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import ReminderCard from "./ReminderCard";

// Dummy type for Disbursement
// Type definition
export interface LoanRepayment {
    applicantName: string;
    loanAmount: string;
    reminderDate: string;
    reminderType: string;
    status: 'Sent' | 'Pending';
  }
  
  // Dummy data
  export const loanRepayments: LoanRepayment[] = [
    {
      applicantName: "John Doe",
      loanAmount: "5,000",
      reminderDate: "2025-02-20",
      reminderType: "Payment Due",
      status: "Sent",
    },
    {
      applicantName: "Jane Smith",
      loanAmount: "3,000",
      reminderDate: "2025-01-25",
      reminderType: "Payment Overdue",
      status: "Sent",
    },
    {
      applicantName: "Robert Brown",
      loanAmount: "8,000",
      reminderDate: "2025-03-10",
      reminderType: "Payment Due",
      status: "Pending",
    },
    {
      applicantName: "Alice Green",
      loanAmount: "2,500",
      reminderDate: "2025-02-12",
      reminderType: "Payment Overdue",
      status: "Sent",
    },
    {
      applicantName: "Chris Johnson",
      loanAmount: "10,000",
      reminderDate: "2025-03-15",
      reminderType: "Payment Due",
      status: "Pending",
    },
  ];
  
const RemindersTab = () => {
 
    const renderItem = ({ item }: { item: LoanRepayment }) => (
      
      <ReminderCard
      applicantName={item.applicantName}
      loanAmount={item.loanAmount}
      reminderDate={item.reminderDate}
      reminderType={item.reminderType}
      status={item.status}
    
      />
    );
  return (
    <View style={styles.container}>
     <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
       
       <FlatList
         data={loanRepayments}
         keyExtractor={(item) => item.applicantName}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default RemindersTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
});
