import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../utils";
import Header from "../../components/Header";
import LocationAutocomplete from "../../components/LocationAutocomplete";

type SavedLocation = {
  id: string;
  label: string; // Home, Office, etc
  address: string;
  distanceText?: string;
  phone?: string;
};

const ManageLocationsScreen = () => {
  const navigation = useNavigation();

  const savedLocations: SavedLocation[] = useMemo(
    () => [
      {
        id: "1",
        label: "Jags villa",
        address:
          "House 802/26; Opposite To HP Petrol Pump, , Kandrika, Payakapuram, Vijayawada",
        distanceText: "0 m",
        phone: "+91-9553844447",
      },
      {
        id: "2",
        label: "Home",
        address: "New house, 1 Floor, Madhura Nagar, Vijayawada",
        distanceText: "2.3 km",
        phone: "+91-9553844447",
      },
      {
        id: "3",
        label: "Other",
        address:
          "House 1, Lachan Infra Projects, Devinagar Road, Madhura Nagar, Vijayawada, Andhra Pradesh, India",
        distanceText: "2.7 km",
        phone: "+91-9553844447",
      },
    ],
    []
  );

  const renderLocationItem = ({ item }: { item: SavedLocation }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.locationTypeIcon, { backgroundColor: Colors.lightGray }]}>
            <Ionicons name="location-outline" size={18} color={Colors.primary} />
          </View>
          {!!item.distanceText && (
            <Text style={styles.distanceText}>{item.distanceText}</Text>
          )}
        </View>
        <Text style={styles.cardTitle}>{item.label}</Text>
        <Text style={styles.cardAddress} numberOfLines={2}>
          {item.address}
        </Text>
        {!!item.phone && (
          <Text style={styles.cardPhone}>Phone number: {item.phone}</Text>
        )}

        <View style={styles.cardActionsRow}>
          <TouchableOpacity style={styles.cardActionButton}>
            <Ionicons name="ellipsis-horizontal" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardActionButton}>
            <Ionicons name="share-outline" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* <Header /> */}

      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backRow} onPress={() => (navigation as any).goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
          <Text style={styles.headerTitle}>List of Address</Text>
        </TouchableOpacity>

       

        

        <TouchableOpacity
          style={styles.rowButton}
          onPress={() => (navigation as any).navigate("AddLocationScreen")}
        >
          <View style={[styles.rowLeftIcon, { backgroundColor: Colors.lightGray }]}>
            <Ionicons name="add" size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Add Address</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>SAVED ADDRESSES</Text>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        data={savedLocations}
        keyExtractor={(i) => i.id}
        renderItem={renderLocationItem}
      />
    </SafeAreaView>
  );
};

export default ManageLocationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    marginLeft: 6,
  },
  rowButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginTop: 12,
  },
  rowLeftIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  rowTitle: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  listHeaderText: {
    fontSize: 12,
    color: Colors.gray,
    letterSpacing: 1,
  },
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationTypeIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  distanceText: {
    fontSize: 12,
    color: Colors.gray,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
  cardAddress: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 6,
  },
  cardPhone: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 6,
  },
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10 as any,
  },
  cardActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
});


