import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import InventoryCard from "./InventoryCard";
import HeadingText from "../HeadingText";
import UniformSellerHomeCard from "./UniformSellerHomeCard";
type InventoryItem = {
  productId: string;
  productName: string;
  category: string;
  size: string;
  color: string;
  currentStock: number;
  incomingStock: number;
  reservedStock: number;
  availableStock: number;
  status: 'In Stock' | 'Out Of Stock';
  lastUpdated: string; // ISO date string
  imageUrl: string;
};

const uniformInventory: InventoryItem[] = [
  {
    productId: 'UNF001',
    productName: 'School Shirt (White)',
    category: 'Shirts',
    size: 'M',
    color: 'White',
    currentStock: 125,
    incomingStock: 50,
    reservedStock: 30,
    availableStock: 95,
    status: 'In Stock',
    lastUpdated: '2023-06-10',
    imageUrl: 'https://www.countyschoolwear.co.uk/sites/default/files/boys_slim_fit_school_shirt_white_1vs_short_sleeve.jpg'
  },
  {
    productId: 'UNF002',
    productName: 'School Pants (Navy)',
    category: 'Pants',
    size: '32',
    color: 'Navy',
    currentStock: 87,
    incomingStock: 25,
    reservedStock: 15,
    availableStock: 72,
    status: 'In Stock',
    lastUpdated: '2023-06-12',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_CMcrt4Bf5H4v2SgvzKT2Zw_duTWfqaFkig&s'
  },
  {
    productId: 'UNF003',
    productName: 'School Skirt (Plaid)',
    category: 'Skirts',
    size: 'S',
    color: 'Plaid',
    currentStock: 42,
    incomingStock: 0,
    reservedStock: 8,
    availableStock: 34,
    status: 'In Stock',
    lastUpdated: '2023-06-08',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcSCNka4WEd-PLEFF9_Z8Eqo8dyUDQXAO0wA&s'
  },
  {
    productId: 'UNF004',
    productName: 'School Sweater (Navy)',
    category: 'Sweaters',
    size: 'L',
    color: 'Navy',
    currentStock: 0,
    incomingStock: 100,
    reservedStock: 0,
    availableStock: 0,
    status: 'Out Of Stock',
    lastUpdated: '2023-06-15',
    imageUrl: 'https://rasheedsonsco.com/wp-content/uploads/2021/12/Sweater34.jpg'
  },
  {
    productId: 'UNF005',
    productName: 'School Tie (Striped)',
    category: 'Accessories',
    size: 'Regular',
    color: 'Striped',
    currentStock: 210,
    incomingStock: 0,
    reservedStock: 45,
    availableStock: 165,
    status: 'In Stock',
    lastUpdated: '2023-06-05',
    imageUrl: 'https://www.tekiria.co.ke/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-15.11.59.jpeg'
  }
];


const ManageInventoryTab = () => {
  const renderItem = ({ item }: { item: InventoryItem }) => (
    
    <InventoryCard
    productId={item.productId}
    productName={item.productName}
    size={item.size}
    color={item.color}
    status={item.status}
    currentStock={item.currentStock}
    incomingStock={item.incomingStock}
    reservedStock={item.reservedStock}
    availableStock={item.availableStock}
    lastUpdated={item.lastUpdated}
    imageUrl={item.imageUrl}
    

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Inventory Overview" />
      <View style={styles.row}>
        {/* Attendance Summary */}
        <UniformSellerHomeCard
          title="Total Products"
          value={`5`}
          color={Colors.SkyBlue}
          // icon="cash"
          iconColor={Colors.primary}
        />
         <UniformSellerHomeCard
          title="In Stock Items"
          value={`2`}
          color={Colors.SkyBlue}
          // icon="calendar-month"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Low Stock Items"
          value={`1`}
          color={Colors.SkyBlue}
          // icon="cart-check"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Out of Stock"
          value={`1`}
          color={Colors.SkyBlue}
          // icon="cash"
          iconColor={Colors.primary}
        />
        </View>
        <HeadingText text="Stock Level" />
       <FlatList
         data={uniformInventory}
         keyExtractor={(item) => item.productId}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default ManageInventoryTab;

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
