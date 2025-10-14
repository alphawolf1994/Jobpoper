import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import InventoryCard from "./InventoryCard";
import ProductCard from "./ProductCard";
import { Feather } from "@expo/vector-icons";
import HeadingText from "../HeadingText";
import RBSheet from "react-native-raw-bottom-sheet";
import AddProductForm from "./AddProductForm";
type ProductItem = {
  productId: string;
  productName: string;
  category: string;
  size: string;
  color: string;
  stock: number;
  price: string;
  status: 'In Stock' | 'Out Of Stock' | 'Low Stock';
  lastUpdated: string; // ISO date string
  imageUrl: string;
};

const Products: ProductItem[] = [
  {
    productId: 'UNF001',
    productName: 'School Shirt (White)',
    category: 'Shirts',
    size: 'S,M,L,XL',
    color: 'White',
    stock: 125,
    price: '24.99',
    status: 'In Stock',
    lastUpdated: '2023-06-10',
    imageUrl: 'https://www.countyschoolwear.co.uk/sites/default/files/boys_slim_fit_school_shirt_white_1vs_short_sleeve.jpg'
  },
  {
    productId: 'UNF002',
    productName: 'School Pants (Navy)',
    category: 'Pants',
    size: '28,30,32,34,36',
    color: 'Navy',
    stock: 87,
    price: '32.50',
    status: 'Low Stock',
    lastUpdated: '2023-06-12',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_CMcrt4Bf5H4v2SgvzKT2Zw_duTWfqaFkig&s'
  },
  {
    productId: 'UNF003',
    productName: 'School Skirt (Plaid)',
    category: 'Skirts',
    size: 'S,M,L',
    color: 'Plaid',
    stock: 42,
    price: '28.99',
    status: 'In Stock',
    lastUpdated: '2023-06-08',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcSCNka4WEd-PLEFF9_Z8Eqo8dyUDQXAO0wA&s'
  },
  {
    productId: 'UNF004',
    productName: 'School Sweater (Navy)',
    category: 'Sweaters',
    size: 'S,M,L,XL',
    color: 'Navy',
    stock: 0,
    price: '45.99',
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
    stock: 210,
    price: '12.99',
    status: 'In Stock',
    lastUpdated: '2023-06-05',
    imageUrl: 'https://www.tekiria.co.ke/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-15.11.59.jpeg'
  }
];

const ManageProductTab = () => {
  const addProductBottomSheetRef = useRef<any>(null);
  const handleVehicleSubmit = (formData:any) => {
    console.log("Vehicle Data Submitted:", formData);
    // handle API call or state update here
    addProductBottomSheetRef.current?.close();
  };
  const renderItem = ({ item }: { item: ProductItem }) => (
    
    <ProductCard
    productId={item.productId}
    productName={item.productName}
    category={item.category}
    size={item.size}
    color={item.color}
    status={item.status}
    stock={item.stock}
    price={item.price}
    lastUpdated={item.lastUpdated}
    imageUrl={item.imageUrl}
    

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <View style={styles.headerContainer}>
      <HeadingText text="Products" />
        <TouchableOpacity
        style={styles.paidFeeContainer}
        onPress={() => {addProductBottomSheetRef.current.open()}}
      >
        <Feather name="plus-circle" size={24} color="white" />
        <Text style={[styles.feeText]}>
          Add Product
        </Text>
      </TouchableOpacity>
      </View>
       <FlatList
         data={Products}
         keyExtractor={(item) => item.productId}
         renderItem={renderItem}

       />

       </KeyboardAvoidingScrollView>
       <RBSheet
        ref={addProductBottomSheetRef}
        height={700}
        openDuration={250}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}
      >
    <Text style={styles.sheetTitle}>Add Product</Text>
    <AddProductForm onSubmit={handleVehicleSubmit} />

      </RBSheet>
    </View>
  );
};

export default ManageProductTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
 
    // marginVertical:10,
   
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
