import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

import HeadingText from "../HeadingText";

import TrackOrderCard from "./TrackOrderCard";
type TrackItem = {
  orderId: string;
  customerName: string;
  productName: string;
  quantity: number;
  orderDate: string;
  deliveryStatus: 'Pending' | 'Delivered' | 'Cancelled';

};

const TrackOrders: TrackItem[] = [
  {
    orderId: 'ORD-001',
    productName: 'A4 Notebook - 200 Pages',
    customerName: 'Greenfield Public School',
    quantity: 50,
    deliveryStatus: 'Delivered',
    orderDate: '2023-06-10',
  },
  {
    orderId: 'ORD-002',
    productName: 'Ballpoint Pen - Blue (Pack of 10)',
    customerName: 'Harmony International School',
    quantity: 30,
    deliveryStatus: 'Pending',
    orderDate: '2023-06-10',
  },
  {
    orderId: 'ORD-003',
    productName: 'Whiteboard Marker - Red',
    customerName: 'Little Scholars Academy',
    quantity: 20,
    deliveryStatus: 'Cancelled',
    orderDate: '2023-06-10',
  },
  {
    orderId: 'ORD-004',
    productName: 'Geometry Box',
    customerName: 'Sunrise Model School',
    quantity: 40,
    deliveryStatus: 'Delivered',
    orderDate: '2023-06-10',
  },
  {
    orderId: 'ORD-005',
    productName: 'Eraser',
    customerName: 'Future Path High School',
    quantity: 100,
    deliveryStatus: 'Pending',
    orderDate: '2023-06-10',
  }
];


const TrackOrderTab = () => {
  const renderItem = ({ item }: { item: TrackItem }) => (
    
    <TrackOrderCard
    orderId={item.orderId}
    productName={item.productName}
    customerName={item.customerName}
    quantity={item.quantity}
    deliveryStatus={item.deliveryStatus}
    orderDate={item.orderDate}
   
    

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
    
    
        <HeadingText text="Track Order List" />
       <FlatList
         data={TrackOrders}
         keyExtractor={(item) => item.orderId}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default TrackOrderTab;

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
