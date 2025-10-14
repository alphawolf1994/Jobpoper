import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors, CurrencySign } from "../../utils";


import UniformSellerHomeCard from "./UniformSellerHomeCard";


const UniformSellerDashboardComponent = () => {



  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Attendance Summary */}
        <UniformSellerHomeCard
          title="Total Sales"
          value={`${CurrencySign} 200`}
          color={Colors.SkyBlue}
          icon="cart-check"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Best-Selling Products"
          value={`10`}
          color={Colors.SkyBlue}
          icon="trophy"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Inventory Levels"
          value={`Stock-In`}
          color={Colors.SkyBlue}
          icon="warehouse"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Pending Orders"
          value={`5`}
          color={Colors.SkyBlue}
          icon="clock-outline"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Total Deliveries"
          value={`20`}
          color={Colors.SkyBlue}
          icon="truck-delivery-outline"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Revenue & Profit Margins"
          value={`${CurrencySign} 200`}
          color={Colors.SkyBlue}
          icon="chart-line"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Customer Feedback & Ratings"
          value={`4.0/5`}
          color={Colors.SkyBlue}
          icon="star-circle-outline"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Return & Exchange Rate"
          value={`10%`}
          color={Colors.SkyBlue}
          icon="autorenew"
          iconColor={Colors.primary}
        />
        <UniformSellerHomeCard
          title="Discount & Promotions Performance"
          value={`15%`}
          color={Colors.SkyBlue}
          icon="sale"
          iconColor={Colors.primary}
        />

      </View>
    </View>
  );
};

export default UniformSellerDashboardComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: 'wrap',
    marginTop: 10
  },
});
