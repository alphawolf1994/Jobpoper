import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import TrackRepaymentCard from "./TrackRepaymentCard";

// Dummy type for Disbursement
// Type definition
export interface LoanRepayment {
    applicantName: string;
    loanAmount: string;
    repaymentDate: string;
    repaymentAmount: string;
    status: 'Completed' | 'Pending' | 'Overdue';
  }
  
  // Dummy data
  export const loanRepayments: LoanRepayment[] = [
    {
      applicantName: "John Doe",
      loanAmount: "5,000",
      repaymentDate: "2025-02-20",
      repaymentAmount: "500",
      status: "Completed",
    },
    {
      applicantName: "Jane Smith",
      loanAmount: "3,000",
      repaymentDate: "2025-01-25",
      repaymentAmount: "300",
      status: "Pending",
    },
    {
      applicantName: "Robert Brown",
      loanAmount: "8,000",
      repaymentDate: "2025-03-10",
      repaymentAmount: "800",
      status: "Completed",
    },
    {
      applicantName: "Alice Green",
      loanAmount: "2,500",
      repaymentDate: "2025-02-12",
      repaymentAmount: "250",
      status: "Overdue",
    },
    {
      applicantName: "Chris Johnson",
      loanAmount: "10,000",
      repaymentDate: "2025-03-15",
      repaymentAmount: "1,000",
      status: "Completed",
    },
  ];
  
const TrackRepaymentTab = () => {
 
    const renderItem = ({ item }: { item: LoanRepayment }) => (
      
      <TrackRepaymentCard
      applicantName={item.applicantName}
      loanAmount={item.loanAmount}
      repaymentDate={item.repaymentDate}
      repaymentAmount={item.repaymentAmount}
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

export default TrackRepaymentTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
});
