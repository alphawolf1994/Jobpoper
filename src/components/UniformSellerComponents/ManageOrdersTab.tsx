import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import OrderCard from "./OrderCard";
import HeadingText from "../HeadingText";
import UniformSellerHomeCard from "./UniformSellerHomeCard";
interface OrderItem {
  orderId: string;
  schoolName: string;
  schoolImage: string;
  orderDate: string;
  deliveryDate: string;
  items: string[];
  totalAmount: number;
  status: "Pending" | "Accepted" | "Rejected" | "Delivered";
  payment: "Paid" | "Pending" | "Refunded";
}

const dummyOrders: OrderItem[] = [
  {
    orderId: "ORD-2023-001",
    schoolName: "Greenwood High",
    schoolImage: "https://live.staticflickr.com/1265/5186579358_09025c5b3b_b.jpg", // Dummy image
    orderDate: "2023-06-01",
    deliveryDate: "2023-06-15",
    items: [
      "25x School Shirt (White) (M)",
      "25x School Pants (Navy) (32)",
    ],
    totalAmount: 1437.25,
    status: "Pending",
    payment: "Paid",
  },
  {
    orderId: "ORD-2023-002",
    schoolName: "Riverside Academy",
    schoolImage: "https://live.staticflickr.com/1265/5186579358_09025c5b3b_b.jpg",
    orderDate: "2023-06-03",
    deliveryDate: "2023-06-18",
    items: [
      "15x School Skirt (Plaid) (S)",
      "15x School Sweater (Navy) (M)",
      "15x School Tie (Striped) (Regular)",
    ],
    totalAmount: 1293.75,
    status: "Accepted",
    payment: "Paid",
  },
  {
    orderId: "ORD-2023-003",
    schoolName: "Sunshine Elementary",
    schoolImage: "https://live.staticflickr.com/1265/5186579358_09025c5b3b_b.jpg",
    orderDate: "2023-06-05",
    deliveryDate: "2023-06-20",
    items: [
      "40x School Shirt (White) (S)",
      "40x School Pants (Navy) (28)",
    ],
    totalAmount: 2300.0,
    status: "Delivered",
    payment: "Paid",
  },
  {
    orderId: "ORD-2023-004",
    schoolName: "Mountain View School",
    schoolImage: "https://live.staticflickr.com/1265/5186579358_09025c5b3b_b.jpg",
    orderDate: "2023-06-08",
    deliveryDate: "2023-06-22",
    items: [
      "30x School Shirt (White) (L)",
      "30x School Pants (Navy) (34)",
      "30x School Tie (Striped) (Regular)",
    ],
    totalAmount: 2159.7,
    status: "Rejected",
    payment: "Pending",
  },
  {
    orderId: "ORD-2023-005",
    schoolName: "Central Public School",
    schoolImage: "https://live.staticflickr.com/1265/5186579358_09025c5b3b_b.jpg",
    orderDate: "2023-06-10",
    deliveryDate: "2023-06-25",
    items: [
      "20x School Skirt (Plaid) (M)",
      "20x School Sweater (Navy) (L)",
    ],
    totalAmount: 1475.0,
    status: "Delivered",
    payment: "Refunded",
  },
];


const ManageOrderTab = () => {
  const renderItem = ({ item }: { item: OrderItem }) => (
    
    <OrderCard
    orderId={item.orderId}
    schoolName={item.schoolName}
    schoolImage={item.schoolImage}
    orderDate={item.orderDate}
    status={item.status}
    deliveryDate={item.deliveryDate}
    items={item.items}
    totalAmount={item.totalAmount}
    payment={item.payment}
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Order Management" />
      <View style={styles.row}>
        {/* Attendance Summary */}
        <UniformSellerHomeCard
          title="Total Orders"
          value={`5`}
          color={Colors.SkyBlue}
          // icon="cash"
          iconColor={Colors.primary}
        />
         <UniformSellerHomeCard
          title="Processing"
          value={`2`}
          color={Colors.SkyBlue}
          // icon="calendar-month"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Completed"
          value={`2`}
          color={Colors.SkyBlue}
          // icon="cart-check"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Cancelled"
          value={`1`}
          color={Colors.SkyBlue}
          // icon="cash"
          iconColor={Colors.primary}
        />
        </View>
        <HeadingText text="Recent Orders" />
       <FlatList
         data={dummyOrders}
         keyExtractor={(item) => item.orderId}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default ManageOrderTab;

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
