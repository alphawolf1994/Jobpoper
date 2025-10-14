import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors } from "../../utils";

interface HostelOverviewProps {
  hostel: any;
}

const HostelOverview = ({ hostel }: HostelOverviewProps) => {
  const overview = [
    {
      id: 1,
      label: "Established",
      content: hostel?.establishmentYear,
      image: ImagePath.EstdIcon,
    },
    {
      id: 2,
      label: "Hostel Type",
      content: hostel?.hostelType, // Boys/Girls/Co-ed
      image: ImagePath.TypeIcon,
    },
    {
      id: 3,
      label: "Total Capacity",
      content: hostel?.capacity ? `${hostel.capacity} students` : null,
      image: ImagePath.GradesIcon,
    },
    {
      id: 4,
      label: "Room Type",
      content: hostel?.roomType, // Single/Shared
      image: ImagePath.TypeIcon,
    },
    {
      id: 5,
      label: "Food Availability",
      content: hostel?.food ? "Yes" : "No",
      image: ImagePath.CafeIcon,
    },
    {
      id: 6,
      label: "Warden Contact",
      content: hostel?.wardenContact,
      image: ImagePath.MaximumIcon,
    },
    {
      id: 7,
      label: "Facilities",
      content: hostel?.facilities?.join(", "),
      image: ImagePath.AirIcon,
    },
    {
      id: 8,
      label: "Security Measures",
      content: hostel?.securityMeasures,
      image: ImagePath.SecurityIcon,
    },
  ];

  const filteredOverview = overview.filter((item) => item.content);

  return (
    <View style={styles.container}>
      <Text style={styles.hostelName}>Hostel Overview</Text>
      <FlatList
        data={filteredOverview}
        nestedScrollEnabled={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{item.label}:</Text>
              <Text style={styles.content}>{item.content}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Information Available</Text>
        }
      />
    </View>
  );
};

export default HostelOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: Colors.grayShade1,
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    marginRight: 20,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    alignSelf: "center",
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
    fontWeight: "600",
    color: Colors.black,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.gray,
    fontSize: 16,
    marginTop: 20,
  },
  hostelName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
