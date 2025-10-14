import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Animated } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../utils";

interface Stop {
  id: string;
  title: string;
  estimatedTime: string;
  actualTime: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  delayReason?: string;
}

interface BusTrackingProps {
  stops: Stop[];
  driverContact: string;
}

const BusTracking: React.FC<BusTrackingProps> = ({ stops, driverContact }) => {
  const [expanded, setExpanded] = useState(false);
  const [animatedHeight] = useState(new Animated.Value(0));
  const [expandedStop, setExpandedStop] = useState<string | null>(null);
//   const toggleExpand = () => {
//     Animated.timing(animatedHeight, {
//       toValue: expanded ? 0 : 300,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//     setExpanded(!expanded);
//   };
  const toggleExpand = (stopId: string) => {
    setExpandedStop(expandedStop === stopId ? null : stopId);
  };
  const handleCallDriver = async () => {
    const url = `tel:${driverContact}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      alert("Phone calling is not supported on this device.");
    }
  };

  const currentStop = stops.find((stop) => stop.status === "current");

  return (
    <View style={styles.container}>
      {/* Current Status Box */}
      <TouchableOpacity style={styles.statusBox} onPress={()=>{toggleExpand('1')}}>
      <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="circle"
                  size={14}
                  color={
                    currentStop?.status === "completed"
                      ? Colors.green
                      : currentStop?.status === "current"
                      ? Colors.Red
                      : Colors.gray
                  }
                />
                <View style={styles.line} />
              </View>
              <View style={styles.details}>
                <Text style={styles.stopTitle}>{currentStop?.title} ({currentStop?.estimatedTime})</Text>
                <Text style={styles.stopDescription}>{currentStop?.description}</Text>
                <Text style={styles.timeText}>Actual Time: <Text style={styles.bold}>{currentStop?.actualTime}</Text></Text>
                {currentStop?.delayReason && <Text style={styles.delayText}>Delay: {currentStop?.delayReason}</Text>}

               {expandedStop && <Animated.View style={[styles.expandedContainer, { height: "auto" , overflow: "hidden" }]}>
        <FlatList
          data={stops}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.stopContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="circle"
                  size={14}
                  color={
                    item.status === "completed"
                      ? Colors.green
                      : item.status === "current"
                      ? Colors.Red
                      : Colors.gray
                  }
                />
                <View style={styles.line} />
              </View>
              <View style={styles.details}>
                <Text style={styles.stopTitle}>{item.title} ({item.estimatedTime})</Text>
                <Text style={styles.stopDescription}>{item.description}</Text>
                <Text style={styles.timeText}>Actual Time: <Text style={styles.bold}>{item.actualTime}</Text></Text>
                {item.delayReason && <Text style={styles.delayText}>Delay: {item.delayReason}</Text>}
              </View>
            </View>
          )}
        />

        {/* Call Driver Button */}
        <TouchableOpacity style={styles.callDriverButton} onPress={handleCallDriver}>
          <Feather name="phone-call" size={24} color="white" />
          <Text style={styles.contactText}>Call Driver</Text>
        </TouchableOpacity>
      </Animated.View>}
              </View>
        <MaterialCommunityIcons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      
      {/* Expandable Route Details */}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 15,
  },
  statusBox: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: Colors.SkyBlue,
    borderRadius: 15,
    // marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expandedContainer: {
    backgroundColor: Colors.SkyBlue,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius:15,
    paddingVertical: 15,
  },
  stopContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.SkyBlue,
  },
  iconContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  line: {
    width: 2,
    height: 30,
    backgroundColor: Colors.gray,
  },
  details: {
    flex: 1,
  },
  stopTitle: {
    fontWeight: "bold",
  },
  stopDescription: {
    color: "gray",
    fontSize: 12,
  },
  timeText: {
    fontSize: 12,
    color: Colors.black,
  },
  delayText: {
    fontSize: 12,
    color: Colors.Red,
    marginTop: 5,
  },
  callDriverButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  contactText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  bold:{
    fontWeight:'bold'
  }
});

export default BusTracking;
