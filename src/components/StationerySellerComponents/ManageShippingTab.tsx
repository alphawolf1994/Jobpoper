import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

import HeadingText from "../HeadingText";

import ShippingCard from "./ShippingCard";
type ShippingItem = {
  shippingId: string;
  orderId: string;
  courierName: string;
  dispatchDate: string;
  expectedDelivery: string;
  shippingStatus: 'Delivered' | 'Pending' | 'In Transit';

};

const Shippings: ShippingItem[] = [
  {
    shippingId: 'SHIP-001',
    orderId: 'ORD-001',
    courierName: 'BlueDart',
    shippingStatus: 'Delivered',
    dispatchDate: '2025-03-01',
    expectedDelivery:'2025-03-04'
   
  },
  {
    shippingId: 'SHIP-002',
    orderId: 'ORD-002',
    courierName: 'Delhivery',
    shippingStatus: 'In Transit',
    dispatchDate: '2025-03-05',
    expectedDelivery:'2025-03-09'
  },
  {
    shippingId: 'SHIP-003',
    orderId: 'ORD-003',
    courierName: 'India Post',
    shippingStatus: 'Delivered',
    dispatchDate: '2025-03-06',
    expectedDelivery:'2025-03-10'
  },
  {
    shippingId: 'SHIP-004',
    orderId: 'ORD-004',
    courierName: 'FedEx',
    shippingStatus: 'Pending',
    dispatchDate: '2025-03-012',
    expectedDelivery:'2025-03-15'
  },
  {
    shippingId: 'SHIP-005',
    orderId: 'ORD-005',
    courierName: 'DTDC',
    shippingStatus: 'In Transit',
    dispatchDate: '2025-03-20',
    expectedDelivery:'2025-03-25'
  }
];


const ManageShippingTab = () => {
  const renderItem = ({ item }: { item: ShippingItem }) => (
    
    <ShippingCard
    shippingId={item.shippingId}
    orderId={item.orderId}
    courierName={item.courierName}
    shippingStatus={item.shippingStatus}
    dispatchDate={item.dispatchDate}
    expectedDelivery={item.expectedDelivery}
   

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
    
    
        <HeadingText text="Shipping List" />
       <FlatList
         data={Shippings}
         keyExtractor={(item) => item.shippingId}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default ManageShippingTab;

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
