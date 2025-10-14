import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors } from "../../utils";
import { WebView } from "react-native-webview";
interface LocationProps {
    school: any;
  }
const Location = ({ school }: LocationProps) => {
    const addressData = [
        { label: "Address", value: school?.address?.street },
        { label: "City", value: school?.address?.city },
        { label: "State/county", value: school?.address?.state },
        { label: "Postal code", value: school?.address?.zipCode },
        { label: "Area", value: school?.address?.area },
        { label: "Country", value: school?.address?.country },
      ].filter((item) => item.value); 
      const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
        `${school?.address?.street}, ${school?.address?.city}, ${school?.address?.state}, ${school?.address?.country}`
      )}&output=embed`;
   
  return (
   <>
   <Text style={styles.schoolName}>Map Location</Text>
   <View style={styles.container}>
      <WebView source={{ uri: mapUrl }} style={styles.map} />
    </View>
<View style={styles.container}>
      {addressData.length > 0 ? (
        addressData.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.locationLabel}>{item.label}</Text>
            <Text style={styles.locationValue}>{item.value}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No address available</Text>
      )}
    </View>
   </>
  );
};

export default Location;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    
      },
      map: { width: "100%", height: "100%" },
      emptyText: {
        textAlign: "center",
        color: Colors.gray,
        fontSize: 16,
        marginTop: 20,
      },
      schoolName: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical:10
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      },
      locationLabel:{
        fontSize: 16,
        color: Colors.black,
        fontWeight:'600',
        width:'50%'
      },
      locationValue:{
        fontSize: 16,
        color: Colors.gray,
        width:'50%'
      }
});
