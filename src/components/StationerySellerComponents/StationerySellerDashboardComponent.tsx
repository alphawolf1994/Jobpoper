import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors, CurrencySign } from "../../utils";


import StationerySellerHomeCard from "./StationerySellerHomeCard";

const StationerySellerDashboardComponent = () => {



  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Attendance Summary */}
        <StationerySellerHomeCard
          title="Total Orders Processed"
          value={`100`}
          color={Colors.SkyBlue}
          icon="package-variant-closed"
          iconColor={Colors.primary}
        />
        <StationerySellerHomeCard
          title="Most Popular Products"
          value={`50`}
          color={Colors.SkyBlue}
          icon="star"
          iconColor={Colors.primary}
        />

        <StationerySellerHomeCard
          title="Low Stock Alerts"
          value={`10`}
          color={Colors.SkyBlue}
          icon="alert-circle-outline"
          iconColor={Colors.primary}
        />
        <StationerySellerHomeCard
          title="Revenue"
          value={`${CurrencySign} 3000`}
          color={Colors.SkyBlue}
          icon="cash"
          iconColor={Colors.primary}
        />
        <StationerySellerHomeCard
          title="Pending Orders"
          value={`10`}
          color={Colors.SkyBlue}
          icon="clock-outline"
          iconColor={Colors.primary}
        />
        <StationerySellerHomeCard
          title="Completed Orders"
          value={`10`}
          color={Colors.SkyBlue}
          icon="check-circle-outline"
          iconColor={Colors.primary}
        />
        <StationerySellerHomeCard
          title="Customer Ratings & Reviews"
          value={`3.5/5`}
          color={Colors.SkyBlue}
          icon="star-circle-outline"
          iconColor={Colors.primary}
        />
        <StationerySellerHomeCard
          title="Profit Margins on Sales"
          value={`${CurrencySign} 1000`}
          color={Colors.SkyBlue}
          icon="chart-areaspline"
          iconColor={Colors.primary}
        />
        <StationerySellerHomeCard
          title="Return & Refund Statistics"
          value={`5`}
          color={Colors.SkyBlue}
          icon="backup-restore"
          iconColor={Colors.primary}
        />
      </View>
    </View>
  );
};

export default StationerySellerDashboardComponent;

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
