import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../utils";
import { HeaderMain, HeadingText } from "../../components";
import { MainStyles } from "../../assets/styles";

const dummyRoutes = [
  {
    id: "1",
    name: "Route A - Downtown",
    stops: [
      { id: "s1", title: "Stop 1 - Main St", estimatedTime: "08:00 AM", description: "Near City Park" },
      { id: "s2", title: "Stop 2 - 5th Ave", estimatedTime: "08:15 AM", description: "Near Coffee Shop" },
      { id: "s3", title: "Stop 3 - School", estimatedTime: "08:30 AM", description: "Main Entrance" },
    ],
  },
  {
    id: "2",
    name: "Route B - Suburbs",
    stops: [
      { id: "s4", title: "Stop 1 - Oakwood", estimatedTime: "07:45 AM", description: "Near Community Hall" },
      { id: "s5", title: "Stop 2 - Greenfield", estimatedTime: "08:10 AM", description: "Near Shopping Center" },
      { id: "s6", title: "Stop 3 - School", estimatedTime: "08:30 AM", description: "Back Entrance" },
    ],
  },
  {
    id: "3",
    name: "Route C - West Side",
    stops: [
      { id: "s7", title: "Stop 1 - Pine Street", estimatedTime: "07:50 AM", description: "Near Grocery Store" },
      { id: "s8", title: "Stop 2 - Maple Lane", estimatedTime: "08:05 AM", description: "Near Park" },
      { id: "s9", title: "Stop 3 - School", estimatedTime: "08:30 AM", description: "Side Gate" },
    ],
  },
];

const dummyCoordinatorContact = "123-456-7890";

const TransportDetailsScreen = () => {
  const selectedRouteId =  "1"; // Default selected route
  const selectedRoute = dummyRoutes.find((r) => r.id === selectedRouteId);
  const otherRoutes = dummyRoutes.filter((r) => r.id !== selectedRouteId);

  const handleCallCoordinator = () => {
    Linking.openURL(`tel:${dummyCoordinatorContact}`);
  };

  return (
    <View style={styles.container}>
      <HeaderMain title="Transport Details" />
      <View style={MainStyles.MainContainer}>
        
        {/* Selected Route Section */}
        {selectedRoute && (
          <View style={{marginTop:10}}>
            <View style={styles.headerContainer}>
      <HeadingText text="Your Route" />
        <TouchableOpacity
        style={styles.callButton}
        onPress={handleCallCoordinator}
      >
        <Feather name="phone-call" size={24} color="white" />
          <Text style={styles.buttonText}>Contact Transport Coordinator</Text>
      </TouchableOpacity>
      </View>
               {/* <HeadingText text="Your Selected Route" /> */}
        
            <View style={styles.routeContainer}>
              <Text style={styles.routeName}>{selectedRoute.name}</Text>
              <FlatList
                data={selectedRoute.stops}
                keyExtractor={(stop) => stop.id}
                renderItem={({ item: stop }) => (
                  <View style={styles.stopContainer}>
                    <MaterialCommunityIcons name="map-marker" size={16} color={Colors.primary} />
                    <Text>{stop.title} ({stop.estimatedTime})</Text>
                  </View>
                )}
              />
            </View>
          </View>
        )}

        {/* Other Routes Section */}
        <HeadingText text="Other Available Routes" textStyle={{marginTop:20}}/>

        <FlatList
          data={otherRoutes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.routeContainer}>
              <Text style={styles.routeName}>{item.name}</Text>
              <FlatList
                data={item.stops}
                keyExtractor={(stop) => stop.id}
                renderItem={({ item: stop }) => (
                  <View style={styles.stopContainer}>
                    <MaterialCommunityIcons name="map-marker" size={16} color={Colors.primary} />
                    <Text>{stop.title} ({stop.estimatedTime})</Text>
                  </View>
                )}
              />
            </View>
          )}
        />
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  routeContainer: { marginVertical: 10, padding: 15, backgroundColor: Colors.SkyBlue, borderRadius: 15 },
  routeName: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  stopContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  callButton: {  flexDirection: "row",
  alignItems: "center",
  backgroundColor:Colors.primary,
  paddingHorizontal:10,
  paddingVertical:5,
  borderRadius:10 },
  buttonText: { color: "white", fontSize: 16, marginLeft: 10 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
 
    marginVertical:10,
   
  },
});

export default TransportDetailsScreen;
