import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

import HeadingText from "../HeadingText";
import AddBuyerForm from "./AddBuyerForm";
import FrequentBuyerCard from "./FrequentBuyerCard";
import { Feather } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
type BuyerRecord = {
    buyerName: string;
    schoolName: string;
    totalOrders: number;
    totalSpend: string;
    lastOrderDate: string;
    loyaltyTier: 'Platinum' | 'Gold' | 'Silver';
  };
  
  const BuyerData: BuyerRecord[] = [
    {
      buyerName: 'Rina Patel',
      schoolName: 'Sunrise Public School',
      totalOrders: 15,
      totalSpend: '72,500',
      lastOrderDate: '2025-03-28',
      loyaltyTier: 'Platinum',
    },
    {
      buyerName: 'Ajay Mehra',
      schoolName: "St. Mary's High",
      totalOrders: 12,
      totalSpend: '60,000',
      lastOrderDate: '2025-03-22',
      loyaltyTier: 'Gold',
    },
    {
      buyerName: 'Fatima Khan',
      schoolName: 'Green Valley School',
      totalOrders: 10,
      totalSpend: '43,250',
      lastOrderDate: '2025-03-19',
      loyaltyTier: 'Silver',
    },
    {
      buyerName: 'Nikhil Verma',
      schoolName: 'Blue Bell Academy',
      totalOrders: 18,
      totalSpend: '89,000',
      lastOrderDate: '2025-03-31',
      loyaltyTier: 'Platinum',
    },
    {
      buyerName: 'Sneha Roy',
      schoolName: 'Horizon English School',
      totalOrders: 9,
      totalSpend: '38,500',
      lastOrderDate: '2025-03-25',
      loyaltyTier: 'Silver',
    },
  ];


const FrequentBuyersTab = () => {
  const addCustomerBottomSheetRef = useRef<any>(null);

  const handleVehicleSubmit = (formData:any) => {
      console.log("Vehicle Data Submitted:", formData);
      // handle API call or state update here
      addCustomerBottomSheetRef.current?.close();
    };
    const handleEdit = (driver:any) => {
  
      addCustomerBottomSheetRef.current?.open(); // open bottom sheet
      // Navigate to form or open modal and pre-fill data
    };
  const renderItem = ({ item }: { item: BuyerRecord }) => (
    
    <FrequentBuyerCard
    buyerName={item.buyerName}
    schoolName={item.schoolName}
    totalOrders={item.totalOrders}
    totalSpend={item.totalSpend}
    lastOrderDate={item.lastOrderDate}
    loyaltyTier={item.loyaltyTier}
   
    

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
    
      <View style={styles.headerContainer}>
      <HeadingText text="Frequent Buyers List" />
        <TouchableOpacity
        style={styles.paidFeeContainer}
        onPress={() => {addCustomerBottomSheetRef.current.open()}}
      >
        <Feather name="plus-circle" size={24} color="white" />
        <Text style={[styles.feeText]}>
          Add Buyer
        </Text>
      </TouchableOpacity>
      </View>
      
       <FlatList
         data={BuyerData}
         keyExtractor={(item) => item.buyerName}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
       <RBSheet
        ref={addCustomerBottomSheetRef}
        height={700}
        openDuration={250}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}
      >
    <Text style={styles.sheetTitle}>Add Buyer</Text>
    <AddBuyerForm onSubmit={handleVehicleSubmit} />

      </RBSheet>
    </View>
  );
};

export default FrequentBuyersTab;

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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
 
    marginVertical:10,
   
  },
  paidFeeContainer:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:Colors.primary,
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:10
  },
 
  feeText:{
    marginLeft: 8,
    fontSize: 16, 
    fontWeight:'bold',
    color:Colors.white
  },
  bottomSheetContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
