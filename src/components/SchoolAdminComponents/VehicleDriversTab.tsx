import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import BusinessProviderCard from "./BusinessProviderCard";
import VehicleDriverCard from "./VehicleDriverCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Toast from "react-native-toast-message";
import { fetchSchoolTransportDriver } from "../../redux/slices/schoolsSlice";
import { VehicleDriver } from "../../interface/interfaces";
import Loader from "../Loader";

interface ProviderItem {
    id: string;
    driver: string;
    phone: string;
    licence: string;
    address: string;
    status: "Active" | "Inactive";
    authorization: "Authorized" | "Un Authorized";
 
}

const BusinessDummy: ProviderItem[] = [
    {
      id: "ORD-2023-006",
      driver: "Rajesh",
      phone: "0522364126",
      licence: "TZ45226226",
      status: "Active",
      authorization:"Authorized",
      address: "Near Street 121",
    },
    {
        id: "ORD-2023-007",
        driver: "Aditya",
        phone: "2236415565",
        licence: "TZ45226885",
        status: "Active",
        authorization:"Un Authorized",
        address: "Near Street 120",
      },
      {
        id: "ORD-2023-008",
        driver: "Sayam",
        phone: "0522364122",
        licence: "PA1321",
        status: "Active",
        authorization:"Un Authorized",
        address: "Texas",
      }
  
  ];
  
  


const VehicleDriversTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schoolTransportVehicleDrivers, loading, errors } = useSelector(
    (state: RootState) => state.schoolsSlice
  );
  const { user, schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSchoolTransportDriver()).unwrap();

      } catch (err) {

        console.error("Failed to fetch proposals:", err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: typeof err === 'string' ? err : "Failed to load fee",
        });
      }
    };
    fetchData();
  }, [dispatch]);

  const renderItem = ({ item }: { item: VehicleDriver }) => (
    
    <VehicleDriverCard
   drivers={item}
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Drivers List" textStyle={{fontSize:16}}/> */}
      <FlatList
         data={schoolTransportVehicleDrivers}
         keyExtractor={(item) => item._id}
         renderItem={renderItem}
         ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>No data available</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
       />
       </KeyboardAvoidingScrollView>
       {loading && <Loader />}
    </View>
  );
};

export default VehicleDriversTab;

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
