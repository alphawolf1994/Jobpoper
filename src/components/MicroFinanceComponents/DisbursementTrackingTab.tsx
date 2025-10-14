import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import DisbursementTrackingCard from "./disbursementCard";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

// Dummy type for Disbursement
type DisbursementRecord = {
  id: string;
  applicantName: string;
  loanAmount: number;
  approvedDate: string;
  disbursedAmount: number;
  disbursedDate: string;
  status: 'Disbursed' | 'In Process' | 'Failed';
  transactionRef: string;
  paymentMethod: string;
  imageUrl: string;
};

const disbursementData: DisbursementRecord[] = [
  {
    id: 'DISB001',
    applicantName: 'Ali Khan',
    loanAmount: 500000,
    approvedDate: '2025-04-15',
    disbursedAmount: 500000,
    disbursedDate: '2025-04-16',
    status: 'Disbursed',
    transactionRef: 'TXN123456789',
    paymentMethod: 'Bank Transfer',
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 'DISB002',
    applicantName: 'Sara Ahmed',
    loanAmount: 300000,
    approvedDate: '2025-04-10',
    disbursedAmount: 0,
    disbursedDate: '',
    status: 'Disbursed',
    transactionRef: 'TXN123456780',
    paymentMethod: 'Cash',
    imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 'DISB003',
    applicantName: 'Bilal Shah',
    loanAmount: 700000,
    approvedDate: '2025-04-12',
    disbursedAmount: 400000,
    disbursedDate: '2025-04-13',
    status: 'In Process',
    transactionRef: 'TXN456789321',
    paymentMethod: 'Bank Transfer',
    imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
  }
];
const DisbursementTrackingTab = () => {
 
    const renderItem = ({ item }: { item: DisbursementRecord }) => (
      
      <DisbursementTrackingCard
      applicantName={item.applicantName}
      loanAmount={item.loanAmount}
      approvedDate={item.approvedDate}
      disbursedAmount={item.disbursedAmount}
      status={item.status}
      disbursedDate={item.disbursedDate}
      transactionRef={item.transactionRef}
      paymentMethod={item.paymentMethod}
    
      imageUrl={item.imageUrl}
      
  
    
      />
    );
  return (
    <View style={styles.container}>
     <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
       
       <FlatList
         data={disbursementData}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default DisbursementTrackingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
});
