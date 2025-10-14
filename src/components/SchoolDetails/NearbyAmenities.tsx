import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils";

interface Amenity {
  _id: string;
  amenity: string;
  distance: string;
}

interface NearbyAmenitiesProps {
  school: any
}

const NearbyAmenities: React.FC<NearbyAmenitiesProps> = ({ school }) => {
  const nearbyAmenities = school?.nearbyAmenities ?? [];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's Nearby?</Text>
      <Text style={styles.description}>
        Explore nearby amenities to precisely locate your school and identify
        surrounding conveniences, providing a comprehensive overview of the
        environment and the school's convenience.
      </Text>
      {nearbyAmenities.map((item:any) => (
        <View key={item._id} style={styles.amenityRow}>
          <Text style={styles.amenity}>{item.amenity}:</Text>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
      ))}
    </View>
  );
};

export default NearbyAmenities;

const styles = StyleSheet.create({
  container: {
   
  },
  title: {
    fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10
  },
  description: {
    fontSize: 15,
    color: Colors.black,
    marginBottom: 20,
  },
  amenityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  amenity: {
    fontSize: 14,
    color: Colors.gray,
    width:'50%'
  },
  distance: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width:'50%'
  },
});
