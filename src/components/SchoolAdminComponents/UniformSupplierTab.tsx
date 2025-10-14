import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import BusinessProviderCard from "./BusinessProviderCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchBusnessVendorUniformSupplier } from "../../redux/slices/authSlice";

interface ProviderItem {
  _id: string;
  organizationName: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  type:string;
 
}


  


const UniformSupplierTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { businessVendorUniformSuppliers, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { user,schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
  
      dispatch(fetchBusnessVendorUniformSupplier());
   
  }, [dispatch]);



  const renderItem = ({ item }: { item: ProviderItem }) => (
    
    <BusinessProviderCard
    _id={item._id}
    name={item.name}
    organizationName={item.organizationName}
    email={item.email}
    contact={item.phoneNumber}
    address={item.address}
    type={'Uniform'}
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      {/* <HeadingText text="Uniform Suppliers List" textStyle={{fontSize:16}}/> */}
      
       <FlatList
         data={businessVendorUniformSuppliers}
         keyExtractor={(item) => item._id}
         renderItem={renderItem}
         ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
            No Data Available
          </Text>
        }
      
       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default UniformSupplierTab;

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
