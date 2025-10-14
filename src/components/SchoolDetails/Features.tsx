import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors } from "../../utils";

interface FeaturesProps {
    school: any;
  }
const Features = ({ school }: FeaturesProps) => {

 const schoolAmenities = school?.schoolAmenities ?? [];
    const schoolFeatures = [
        {
          id: 1,
          label: "Transport",
          image: ImagePath.BusIcon,
        },
        {
          id: 2,
          label: "Library",
          image: ImagePath.LibraryIcon,
        },
        {
          id: 3,
          label: "Swimming Pool",
          image: ImagePath.PoolIcon,
        },
        {
          id: 4,
          label: "Cafeteria",
          image: ImagePath.CafeIcon,
        },
        {
          id: 5,
          label: "Air Condition",
          image: ImagePath.AirIcon,
        },
        {
          id: 6,
          label: "Wi-Fi Enabled",
          image: ImagePath.WifiIcon,
        },
        {
          id: 7,
          label: "Outdoor Sports",
          image: ImagePath.OutDoorIcon,
        },
        {
          id: 8,
          label: "Indoor Sports",
          image: ImagePath.InDoorIcon,
        },
        {
          id: 9,
          label: "Ramps for Differently Abled",
          image: ImagePath.RanmpIcon,
        },
        {
          id: 10,
          label: "Gymnasium",
          image: ImagePath.GymIcon,
        },
        {
          id: 11,
          label: "Fire Extinguishers",
          image: ImagePath.FireIcon,
        },
        {
          id: 12,
          label: "Security",
          image: ImagePath.SecurityIcon,
        },
        {
          id: 13,
          label: "Medical Clinic Facility",
          image: ImagePath.ClinicIcon,
        },
        {
          id: 14,
          label: "Emergency Exit",
          image: ImagePath.ExitIcon,
        },
        {
          id: 15,
          label: "Strong Room Availability",
          image: ImagePath.StrongIcon,
        },
        {
          id: 16,
          label: "Computer Labs",
          image: ImagePath.ComputerIcon,
        },
        {
          id: 17,
          label: "Science Labs",
          image: ImagePath.ScienceIcon,
        },
        {
          id: 18,
          label: "Clubs and Activities",
          image: ImagePath.ClubIcon,
        },
        {
          id: 19,
          label: "Trips and Excursions",
          image: ImagePath.TripIcon,
        },
        {
          id: 20,
          label: "Hostel Facilities",
          image: ImagePath.HostelIcon,
        },
        {
          id: 21,
          label: "Meals and Snacks",
          image: ImagePath.MealsIcon,
        },
      ];
      const filteredFeatures = schoolFeatures.filter((feature) => schoolAmenities.includes(feature.label));
  return (
    <View style={styles.container}>
    <Text style={styles.schoolName}>Amentities And Features</Text>
      <FlatList
        data={filteredFeatures}
        nestedScrollEnabled={true} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.content}>{item.label}</Text>
             
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No Information Available</Text>}
      />
    </View>
  );
};

export default Features;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    
      },
      itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
      },
      imageContainer:{
        borderWidth:1,
        borderColor:Colors.grayShade1,
        borderRadius:10,
        width:50,
        height:50,
       justifyContent:'center',
       marginRight:20
      },
      icon: {
        width: 30,
        height: 30,
        // marginRight: 10,
        resizeMode: "contain",
        alignSelf:'center'
      },
      textContainer: {
        flexDirection: "column",
      },
      label: {
        fontSize: 16,
        color: Colors.gray,
      },
      content: {
        fontSize: 16,
       fontWeight:'600',
        color: Colors.black,
      },
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
});
