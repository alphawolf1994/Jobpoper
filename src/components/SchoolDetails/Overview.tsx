import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors } from "../../utils";

interface OverviewProps {
    school: any;
  }
const Overview = ({ school }: OverviewProps) => {
    const overview = [
        {
          id: 1,
          label: "Established",
          content: school?.establishmentYear,
          image: ImagePath.EstdIcon,
        },
        {
          id: 2,
          label: "Type",
          content: school?.schoolType?.split("-")[0],
          image: ImagePath.TypeIcon,
        },
        {
          id: 3,
          label: "Grades",
          content: school?.startingGrade && school?.endingGrade ? `${school.startingGrade} - ${school.endingGrade}` : null,
          image: ImagePath.GradesIcon,
        },
        {
          id: 4,
          label: "Gender",
          content: school?.gender,
          image: ImagePath.GenderIcon,
        },
        {
          id: 5,
          label: "Avg Class Strength",
          content: school?.avgClassStrength,
          image: ImagePath.AvgIcon,
        },
        {
          id: 6,
          label: "Language",
          content: school?.language,
          image: ImagePath.LanguageIcon,
        },
        {
          id: 7,
          label: "Minimum Age",
          content: school?.minimumAge ? `${school.minimumAge} years` : null,
          image: ImagePath.MinimumIocn,
        },
        {
          id: 8,
          label: "Maximum Age",
          content: school?.maximumAge ? `${school.maximumAge} years` : null,
          image: ImagePath.MaximumIcon,
        },
        {
          id: 9,
          label: "Rating",
          content: school?.rating?.$numberDecimal || "0.0",
          image: ImagePath.RatingIcon,
        },
      ];
      const filteredOverview = overview.filter((item) => item.content);
  return (
    <View style={styles.container}>
    <Text style={styles.schoolName}>Overview</Text>
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
        ListEmptyComponent={<Text style={styles.emptyText}>No Information Available</Text>}
      />
    </View>
  );
};

export default Overview;

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
