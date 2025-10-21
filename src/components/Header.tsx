import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from "../utils";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import ImagePath from "../assets/images/ImagePath";
import LocationAutocomplete from "./LocationAutocomplete";
import Button from "./Button";


const Header: React.FC = () => {
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    city: "New York",
    state: "NY", 
    country: "USA",
    fullAddress: "New York, NY, USA"
  });

  const handleLocationSelect = (locationData: {
    city: string;
    state: string;
    country: string;
    fullAddress: string;
  }) => {
    setCurrentLocation(locationData);
    setIsLocationModalVisible(false);
  };

  const formatLocationDisplay = () => {
    const parts = [];
    if (currentLocation.city) parts.push(currentLocation.city);
    if (currentLocation.state) parts.push(currentLocation.state);
    if (currentLocation.country) parts.push(currentLocation.country);
    return parts.join(", ");
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.titleText}>
            JobPoper
          </Text>
          <TouchableOpacity 
            style={styles.locationRow} 
            onPress={() => setIsLocationModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color={Colors.primary}
            />
            <Text style={styles.locationText}>
              {formatLocationDisplay()}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={Colors.gray}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.bellWrapper} activeOpacity={0.7}>
          <Ionicons
            name="notifications-outline"
            size={28}
          />
          <View style={styles.redDot} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatar} activeOpacity={0.7}>
          <Image source={ImagePath.avatarIcon} style={styles.avatarImage} />
        </TouchableOpacity>
      </View>

      {/* Location Change Modal */}
      <Modal
        visible={isLocationModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsLocationModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setIsLocationModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change Location</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Select your preferred location to see relevant job opportunities
            </Text>
            
            <LocationAutocomplete
              label="Search Location"
              placeholder="Enter city, state, or country"
              onLocationSelect={handleLocationSelect}
              firstContainerStyle={{ marginTop: 20 }}
            />
            
            <View style={styles.currentLocationContainer}>
              <Text style={styles.currentLocationLabel}>Current Location:</Text>
              <Text style={styles.currentLocationText}>
                {formatLocationDisplay()}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 80,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: { 
    flexDirection: "row", 
    alignItems: "center",
    flex: 1,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary || "#1a1a1a",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
    marginRight: 4,
    fontWeight: "500",
  },
  oInline: {
    backgroundColor: Colors.primary || "#2B8EF6",
    color: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 13,
    overflow: "hidden",
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: "700",
  },
  actions: { flexDirection: "row", alignItems: "center" },
  bellWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  redDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 18,
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 18,
    resizeMode: "contain",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
  },
  placeholder: {
    width: 32,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 20,
    lineHeight: 22,
  },
  currentLocationContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
  },
  currentLocationLabel: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  currentLocationText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: "500",
  },
});