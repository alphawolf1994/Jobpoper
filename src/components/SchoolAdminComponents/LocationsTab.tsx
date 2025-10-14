import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import BusinessProviderCard from "./BusinessProviderCard";
import LocationCard from "./LocationCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchSchoolLocation } from "../../redux/slices/schoolsSlice";
import { schoolLocation } from "../../interface/interfaces";
import Loader from "../Loader";

interface LocationItem {
  id: string;
  branchName: string;
  status: string;
  address: string;
 
}

const LocationDummy: LocationItem[] = [
    {
      id: "1",
      branchName: "New Horward Branch",
      status: "Active",
      address: "121 Street, Area 12, City, State, India, 15695",
    },
   
  ];
  


const LocationsTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schoolLocation, loading, errors } = useSelector(
    (state: RootState) => state.schoolsSlice
  );
  const { user,schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
  
      dispatch(fetchSchoolLocation());
  
  }, [dispatch]);


  const renderItem = ({ item }: { item: schoolLocation }) => (
    
    <LocationCard
    _id={item._id}
    branchName={item.branchName}
    status={item.status}
    address={item.address}
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="School Locations" textStyle={{fontSize:16}}/> */}
      
       <FlatList
         data={schoolLocation}
         keyExtractor={(item) => item._id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
       {loading && <Loader />}
    </View>
  );
};

export default LocationsTab;

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
