import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

import HeadingText from "../HeadingText";

import OrderHistoryCard from "./OrderHistoryCard";
type OrderItem = {
  orderId: string;
  customerName: string;
  productName: string;
  quantity: number;
  orderDate: string;
  status: 'Processing' | 'Delivered' | 'Shipped';
  totalAmount:string,

};

const Orders: OrderItem[] = [
  {
    orderId: 'ORD-001',
    productName: 'A4 Notebook - 200 Pages',
    customerName: 'Greenfield Public School',
    quantity: 120,
    status: 'Delivered',
    orderDate: '2023-06-10',
    totalAmount:'6,000'
  },
  {
    orderId: 'ORD-002',
    productName: 'Ballpoint Pen - Blue (Pack of 10)',
    customerName: 'Harmony International School',
    quantity: 30,
    status: 'Processing',
    orderDate: '2023-06-10',
    totalAmount:'3,000'
  },
  {
    orderId: 'ORD-003',
    productName: 'Whiteboard Marker - Red',
    customerName: 'Little Scholars Academy',
    quantity: 50,
    status: 'Delivered',
    orderDate: '2023-06-10',
    totalAmount:'1,250'
  },
  {
    orderId: 'ORD-004',
    productName: 'Geometry Box',
    customerName: 'Sunrise Model School',
    quantity: 20,
    status: 'Shipped',
    orderDate: '2023-06-10',
    totalAmount:'2,400'
  },
  {
    orderId: 'ORD-005',
    productName: 'Eraser',
    customerName: 'Future Path High School',
    quantity: 200,
    status: 'Delivered',
    orderDate: '2023-06-10',
    totalAmount:'8,00'
  }
];


const OrderHistoryTab = () => {
  const renderItem = ({ item }: { item: OrderItem }) => (
    
    <OrderHistoryCard
    orderId={item.orderId}
    productName={item.productName}
    customerName={item.customerName}
    quantity={item.quantity}
    status={item.status}
    orderDate={item.orderDate}
    totalAmount={item.totalAmount}
   
    

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
    
    
        <HeadingText text="Order History" />
       <FlatList
         data={Orders}
         keyExtractor={(item) => item.orderId}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default OrderHistoryTab;

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
