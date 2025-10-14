import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors, CurrencySign } from "../../utils";
import DriverHomeCard from "./DriverHomeCard";
import CurrentRouteCard from "./CurrentRouteCard";
import HeadingText from "../HeadingText";

type PickupPoint = {
  name: string;
  address: string;
  pickupTime: string;
  dropTime: string;
  studentsCount?: number; // optional if you want to show per-stop students
};

type ActiveRouteItems = {
  id: string;
  busModal: string;
  busNo: string;
  routeName: string;
  source: string;
  destination: string;
  totalStudents: number;
  pickupPoints: PickupPoint[];
};
const dummyActiveRoute: ActiveRouteItems[] = [
  {
    id: '1',
    busModal: 'Benz Bus',
    busNo: 'AB123',
    routeName: 'Route A - Downtown',
    source: 'Main Street',
    destination: 'Bright Future School',
    totalStudents: 45,
    pickupPoints: [
      {
        name: 'Stop 1',
        address: 'Main Street, Block A',
        pickupTime: '07:30 AM',
        dropTime: '02:15 PM',
        studentsCount: 15,
      },
      {
        name: 'Stop 2',
        address: 'City Park Avenue',
        pickupTime: '07:45 AM',
        dropTime: '02:30 PM',
        studentsCount: 10,
      },
      {
        name: 'Stop 3',
        address: 'Greenwood Plaza',
        pickupTime: '08:00 AM',
        dropTime: '02:45 PM',
        studentsCount: 12,
      },
      {
        name: 'Stop 4',
        address: 'Sunset Boulevard',
        pickupTime: '08:10 AM',
        dropTime: '02:55 PM',
        studentsCount: 8,
      },
    ],
  },
];

const DriverDashboardComponent = () => {
 
  const renderItem = ({ item }: { item: ActiveRouteItems }) => (
    <CurrentRouteCard
    busModal={item.busModal}
    busNo={item.busNo}
    routeName={item.routeName}
  
    source={item.source}
    destination={item.destination}
    totalStudents={item.totalStudents}
      pickupPoints={item.pickupPoints}
    
    />
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.row}> */}
        {/* Attendance Summary */}
        {/* <DriverHomeCard
          title="Total Assigned Buses"
          value={'5'}
          color={Colors.SkyBlue}
          icon="bus-multiple"
          iconColor={Colors.black}
        />
       
         <DriverHomeCard
          title="Total Routes"
          value={'5'}
          color={Colors.SkyBlue}
          icon="routes"
          iconColor={Colors.black}
        />
        <DriverHomeCard
          title="Total Students"
          value={'100'}
          color={Colors.SkyBlue}
          icon="account-check-outline"
          iconColor={Colors.black}
        /> */}
        <View style={styles.headerContainer}>
      <HeadingText text="Active Route" />
      </View>
        <FlatList
        data={dummyActiveRoute}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      
      />
        {/* </View> */}
    </View>
  );
};

export default DriverDashboardComponent;

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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
 
    marginVertical:10,
   
  },
});
