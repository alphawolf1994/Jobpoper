import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../utils";
import HeadingText from "../HeadingText";
import { useNavigation } from "@react-navigation/native";

interface EventItem {
  id: string;
  title: string;
  date: string;
  image: string;
  dayType: "Full Day" | "Half Day";
}

interface EventsListProps {
  events: EventItem[];
  onViewAll: () => void;
}

const EventsList: React.FC<EventsListProps> = ({ events, onViewAll }) => {
const navigation=useNavigation()
  return (
    <View style={styles.container}>
      {/* Header */}
     

      {/* Events List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            {/* Event Image */}
            <Image source={item.image} style={styles.eventImage} />

            {/* Event Info */}
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={styles.dateContainer}>
                <MaterialCommunityIcons name="calendar" size={14} color={Colors.gray} />
                <Text style={styles.eventDate}>{item.date}</Text>
              </View>
            </View>

            {/* Day Type Tag */}
            <View
              style={[
                styles.dayTag,
                { backgroundColor: item.dayType === "Full Day" ? Colors.primary : Colors.secondary },
              ]}
            >
              <Text style={styles.dayTagText}>{item.dayType}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 15,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAll: {
    color: Colors.primary,
    fontSize: 14,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
   
    borderBottomColor:Colors.grayShade1,
    borderBottomWidth:1
  },
  eventImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  eventDate: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 5,
  },
  dayTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dayTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  paidFeeContainer:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:Colors.primary,
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:10
  },
 
  feeText:{
    marginLeft: 8,
    fontSize: 16, 
    fontWeight:'bold',
    color:Colors.white
  },
});

export default EventsList;
