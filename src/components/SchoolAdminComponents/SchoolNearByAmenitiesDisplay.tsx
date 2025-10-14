import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../utils';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type Amenity = {
    amenity: string;
    distance: string;
  };
  
  type NearbyAmenitiesDisplayProps = {
    amenities: Amenity[];
  };
  

const SchoolNearByAmenitiesDisplay: React.FC<NearbyAmenitiesDisplayProps> = ({ amenities }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.heading}>
          <View style={styles.iconRow}>
            <MaterialIcons name="payment" size={20} color={Colors.black} style={styles.icon} />
            <Text style={styles.sectionTitle}>Nearby Amenities</Text>
          </View>
        </View>
        <View style={styles.card}>
          {amenities.map((item) => (
            <InfoRow key={item.amenity} label={item.amenity} value={item.distance.toString()} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};


type InfoRowProps = {
  label: string;
  value: string;
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  heading: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical:20
  },
  main: {
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  card: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
});

export default SchoolNearByAmenitiesDisplay;
