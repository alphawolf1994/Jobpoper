import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors, CurrencySign } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import InventoryCard from "./InventoryCard";
import ProductCard from "./ProductCard";
import SaleRevenueCard from "./SaleRevenueCard";
import UniformSellerHomeCard from "./UniformSellerHomeCard";
import HeadingText from "../HeadingText";
import TransactionCard from "./TransactionCard";
type ProductItem = {
  productId: string;
  productName: string;
  sale: string;
  revenue: string;
  imageUrl: string;
};

type transactionItem = {
  transactionId: string;
  date: string;
  school: string;
  amount: string;
  status: string;
};
const Products: ProductItem[] = [
  {
    productId: 'UNF001',
    productName: 'School Shirt (White)',
    sale: '342',
    revenue: '8545.58',
    imageUrl: 'https://www.countyschoolwear.co.uk/sites/default/files/boys_slim_fit_school_shirt_white_1vs_short_sleeve.jpg'
  },
  {
    productId: 'UNF002',
    productName: 'School Pants (Navy)',
    sale: '278',
    revenue: '9035.58',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_CMcrt4Bf5H4v2SgvzKT2Zw_duTWfqaFkig&s'
  },
  {
    productId: 'UNF003',
    productName: 'School Skirt (Plaid)',
    sale: '156',
    revenue: '4485.58',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcSCNka4WEd-PLEFF9_Z8Eqo8dyUDQXAO0wA&s'
  },
  {
    productId: 'UNF004',
    productName: 'School Sweater (Navy)',
    sale: '210',
    revenue: '2727.58',
    imageUrl: 'https://rasheedsonsco.com/wp-content/uploads/2021/12/Sweater34.jpg'
  },
  {
    productId: 'UNF005',
    productName: 'School Tie (Striped)',
    sale: '98',
    revenue: '4410.58',
    imageUrl: 'https://www.tekiria.co.ke/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-15.11.59.jpeg'
  }
];

const Transactions: transactionItem[] = [
  {
    transactionId: 'TXN-2023-001',
    date: '2023-06-15',
    school: 'Greenwood High',
    amount: '8545.58',
    status: 'Completed'
  },
  {
    transactionId: 'TXN-2023-002',
    date: '2023-06-14',
    school: 'Riverside Academy',
    amount: '1239.58',
    status: 'Completed'
  },
  {
    transactionId: 'TXN-2023-003',
    date: '2023-06-12',
    school: 'Sunshine Elementary',
    amount: '2300.58',
    status: 'Completed'
  },
  {
    transactionId: 'TXN-2023-004',
    date: '2023-06-10',
    school: 'Mountain View School',
    amount: '2159.58',
    status: 'Completed'
  },
  {
    transactionId: 'TXN-2023-005',
    date: '2023-06-08',
    school: 'Central Public School',
    amount: '1475.58',
    status: 'Completed'
  }
];
const SaleRevenueTab = () => {
  const renderItem = ({ item }: { item: ProductItem }) => (
    
    <SaleRevenueCard
    productId={item.productId}
    productName={item.productName}
    sale={item.sale}
    revenue={item.revenue}
    imageUrl={item.imageUrl}
    

  
    />
  );
  const renderTransactionItem = ({ item }: { item: transactionItem }) => (
    
    <TransactionCard
    transactionId={item.transactionId}
    school={item.school}
    date={item.date}
    amount={item.amount}
    status={item.status}
    

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Sales Report" />
      <View style={styles.row}>
        {/* Attendance Summary */}
        <UniformSellerHomeCard
          title="Total Revenue"
          value={`${CurrencySign} 29,200.00`}
          color={Colors.SkyBlue}
          icon="cash"
          iconColor={Colors.primary}
        />
         <UniformSellerHomeCard
          title="This Month"
          value={`${CurrencySign} 18,700.00`}
          color={Colors.SkyBlue}
          icon="calendar-month"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Total Orders"
          value={`241`}
          color={Colors.SkyBlue}
          icon="cart-check"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Avg. Order  Values"
          value={`${CurrencySign} 121.16`}
          color={Colors.SkyBlue}
          icon="cash"
          iconColor={Colors.primary}
        />
        </View>
        <HeadingText text="Top Selling Products" />
        <FlatList
         data={Products}
         keyExtractor={(item) => item.productId}
         renderItem={renderItem}

       />

<HeadingText text="Recent Transactions" textStyle={{marginTop:20}}/>
        <FlatList
         data={Transactions}
         keyExtractor={(item) => item.transactionId}
         renderItem={renderTransactionItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default SaleRevenueTab;

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
