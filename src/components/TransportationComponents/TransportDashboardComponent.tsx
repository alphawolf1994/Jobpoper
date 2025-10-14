import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors, CurrencySign } from "../../utils";
import TransportationHomeCard from "./TransportationHomeCard";



const TransportDashboardComponent = () => {
 
 

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Attendance Summary */}
        <TransportationHomeCard
          title="Total Trips Completed"
          value={'20'}
          color={Colors.SkyBlue}
          icon="bus-clock"
          iconColor={Colors.black}
        />
        <TransportationHomeCard
          title="Revenue Generated"
          value={`${CurrencySign} 200`}
          color={Colors.SkyBlue}
          icon="cash"
          iconColor={Colors.black}
        />
         <TransportationHomeCard
          title="Active Vehicles"
          value={`4`}
          color={Colors.SkyBlue}
          icon="bus-multiple"
          iconColor={Colors.black}
        />
        <TransportationHomeCard
          title="Pending Bookings"
          value={`2`}
          color={Colors.SkyBlue}
          icon="progress-clock"
          iconColor={Colors.black}
        />
         <TransportationHomeCard
          title="Completed Bookings"
          value={`2`}
          color={Colors.SkyBlue}
          icon="calendar-check"
          iconColor={Colors.black}
        />
        <TransportationHomeCard
          title="Fuel & Maintenance Costs"
          value={`${CurrencySign} 100`}
          color={Colors.SkyBlue}
          icon="car-wrench"
          iconColor={Colors.black}
        />
        <TransportationHomeCard
          title="Customer Feedback & Ratings"
          value={`3.5/5`}
          color={Colors.SkyBlue}
          icon="star-circle-outline"
          iconColor={Colors.black}
        />
         <TransportationHomeCard
          title="Driver Performance Metrics"
          value={`90%`}
          color={Colors.SkyBlue}
          icon="account-check-outline"
          iconColor={Colors.black}
        />
         <TransportationHomeCard
          title="Route Efficiency & Traffic Updates"
          value={`80%`}
          color={Colors.SkyBlue}
          icon="map-marker-path"
          iconColor={Colors.black}
        />
        </View>
    </View>
  );
};

export default TransportDashboardComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap:'wrap',
    marginTop:10
  },
});
