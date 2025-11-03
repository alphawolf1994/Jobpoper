import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { removeLocationById, fetchLocations } from "../../redux/slices/locationsSlice";
import Button from "../../components/Button";
import Loader from "../../components/Loader";

type SavedLocation = {
  id: string;
  label: string; // Home, Office, etc
  address: string;
  distanceText?: string;
  phone?: string;
  addressDetails?: string;
};

const ManageLocationsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { items: saved, loading } = useSelector((state: RootState) => state.locations);
  
  // Fetch locations when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchLocations() as any);
    }, [dispatch])
  );

  const savedLocations: SavedLocation[] = useMemo(() => {
    return (saved || []).map((l) => ({
      id: l.id,
      label: l.name,
      address: l.fullAddress,
      addressDetails: l.addressDetails,
      distanceText: undefined,
    }));
  }, [saved]);

  const renderLocationItem = ({ item }: { item: SavedLocation }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.headerLeft}>
            <View style={[styles.locationTypeIcon, { backgroundColor: Colors.lightGray }]}>
              <Ionicons name="location-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cardActionButton}
            onPress={async () => {
              Alert.alert(
                "Delete Location",
                `Are you sure you want to delete "${item.label}"?`,
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        const result = await dispatch(removeLocationById(item.id) as any);
                        if (result.type === 'locations/removeLocationById/rejected') {
                          Alert.alert("Error", result.payload as string);
                        }
                      } catch (err: any) {
                        Alert.alert("Error", err.message || "Failed to delete location");
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardAddress} numberOfLines={2}>
          {item.address}
        </Text>
        {!!item.addressDetails && (
          <Text style={styles.cardAddress} numberOfLines={2}>
            {item.addressDetails}
          </Text>
        )}
        {!!item.phone && (
          <Text style={styles.cardPhone}>Phone number: {item.phone}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Loader visible={loading} message="Loading locations..." />
      {/* <Header /> */}

      <View style={styles.headerSection}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backRow} onPress={() => (navigation as any).goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
            <Text style={styles.headerTitle}>List of Address</Text>
          </TouchableOpacity>
          <Button
            label="Add"
            onPress={() => (navigation as any).navigate("AddLocationScreen")}
            icon={<Ionicons name="add" size={18} color={Colors.white} />}
            style={{
              marginTop: 0,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 18,
            }}
            textStyle={{ fontSize: 14 }}
          />
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>SAVED ADDRESSES</Text>
      </View>

      {savedLocations.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="location-outline" size={64} color={Colors.lightGray} />
          <Text style={styles.emptyTitle}>No Saved Locations</Text>
          <Text style={styles.emptyMessage}>You haven't saved any locations yet. Tap the 'Add' button to save your first location.</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          data={savedLocations}
          keyExtractor={(i) => i.id}
          renderItem={renderLocationItem}
        />
      )}
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
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8 as any,
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
  },
});


