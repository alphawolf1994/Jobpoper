import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import BusinessProviderCard from "./BusinessProviderCard";
import VehicleCard from "./VehicleCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Toast from "react-native-toast-message";
import { TransportVehicle } from "../../interface/interfaces";
import { fetchSchoolTransportVehicle } from "../../redux/slices/schoolsSlice";
import Loader from "../Loader";

const VehicleTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schoolTransportVehicles, loading, errors } = useSelector(
    (state: RootState) => state.schoolsSlice
  );
  const { user, schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSchoolTransportVehicle()).unwrap();

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

  const renderItem = ({ item }: { item: TransportVehicle }) => (
    
    <VehicleCard
    vehicles={item}
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Transport Vehicles" textStyle={{fontSize:16}}/> */}
      
      <FlatList
         data={schoolTransportVehicles}
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

export default VehicleTab;

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
