import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { Colors } from "../../utils";
import { AppDispatch, RootState } from "../../redux/store";
import {
  getReceivedOrders,
  markAllOrdersAsRead,
} from "../../redux/slices/orderSlice";
import { Order } from "../../interface/interfaces";
import { IMAGE_BASE_URL } from "../../api/baseURL";

const resolveImageUrl = (uri?: string | null): string | undefined => {
  if (!uri) return undefined;
  if (/^https?:\/\//i.test(uri)) return uri;
  const trimmed = uri.replace(/^\/?uploads\//, "");
  return `${IMAGE_BASE_URL}/${trimmed}`;
};

const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const getInitials = (name: string): string => {
  if (!name) return "B";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const getOrderLocation = (order: Order) => {
  const fallbackLocation = (order as any).location;
  const rawLocation = order.customerLocation ?? fallbackLocation;
  const objectLocation =
    rawLocation && typeof rawLocation === "object" ? rawLocation : null;
  const address =
    typeof rawLocation === "string"
      ? rawLocation.trim()
      : (
          objectLocation?.fullAddress ||
          objectLocation?.address ||
          objectLocation?.location ||
          ""
        ).trim();
  const rawLatitude =
    objectLocation?.latitude ??
    objectLocation?.lat ??
    order.customerLatitude ??
    order.latitude ??
    (order as any).lat;
  const rawLongitude =
    objectLocation?.longitude ??
    objectLocation?.lng ??
    order.customerLongitude ??
    order.longitude ??
    (order as any).lng;
  const latitude =
    typeof rawLatitude === "string" ? Number(rawLatitude) : rawLatitude;
  const longitude =
    typeof rawLongitude === "string" ? Number(rawLongitude) : rawLongitude;
  const hasCoordinates =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  return {
    address,
    latitude,
    longitude,
    hasCoordinates,
    hasLocation: Boolean(address || hasCoordinates),
  };
};

const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const { orders, loading } = useSelector((state: RootState) => state.order);

  // Spec: "When user clicks order icon: open Orders Screen and immediately
  // remove counter badge." We clear the badge on focus (which fires on the
  // first mount too).
  useFocusEffect(
    useCallback(() => {
      dispatch(getReceivedOrders({ page: 1, limit: 50 }));
      dispatch(markAllOrdersAsRead());
    }, [dispatch])
  );

  const handleCall = (phoneNumber?: string) => {
    if (!phoneNumber) return;
    const cleaned = String(phoneNumber).replace(/[\s\-()]/g, "");
    Linking.openURL(`tel:${cleaned}`).catch(() => {});
  };

  // Open directions to the customer's location in Google Maps. Falls back to
  // a search URL if the directions URL can't be opened.
  const handleNavigate = (location: ReturnType<typeof getOrderLocation>) => {
    if (!location.hasLocation) return;
    const destination = location.hasCoordinates
      ? `${location.latitude},${location.longitude}`
      : location.address;
    const encoded = encodeURIComponent(destination);
    const directions = `https://www.google.com/maps/dir/?api=1&destination=${encoded}&travelmode=driving`;
    const search = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
    Linking.openURL(directions).catch(() => {
      Linking.openURL(search).catch(() => {});
    });
  };

  const renderOrderCard = ({ item }: { item: Order }) => {
    const profile =
      typeof item.businessProfile === "object" ? item.businessProfile : null;
    const primaryImage = profile?.images?.find((img) => img.isPrimary) ||
      profile?.images?.[0];
    const avatarUrl = resolveImageUrl(primaryImage?.url);
    const businessName = profile?.businessName || "Your business";

    const orderLocation = getOrderLocation(item);

    return (
      <View style={styles.jobCard}>
        {/* Top label — newest indicator (mirrors Hot Tasks "fire" label) */}
        <View style={styles.hotLabel}>
          <Ionicons name="cart" size={16} color={Colors.primary} />
        </View>

        {/* Avatar + business name + customer name */}
        <View style={styles.avatarTitleRow}>
          <View style={styles.avatar}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarText}>{getInitials(businessName)}</Text>
            )}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.jobTitle} numberOfLines={1} ellipsizeMode="tail">
              {businessName}
            </Text>
            <Text style={styles.posterName} numberOfLines={1}>
              From {item.customerName}
            </Text>
          </View>
        </View>

        {/* Tag chips: phone / location / time */}
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Ionicons name="call-outline" size={12} color={Colors.white} />
            <Text style={styles.tagText}>{item.customerPhone}</Text>
          </View>
          {orderLocation.hasLocation ? (
            <View style={styles.tag}>
              <Ionicons name="location-outline" size={12} color={Colors.white} />
              <Text style={styles.tagText} numberOfLines={1}>
                {orderLocation.address || "Pinned location"}
              </Text>
            </View>
          ) : null}
          <View style={styles.tag}>
            <Ionicons name="time-outline" size={12} color={Colors.white} />
            <Text style={styles.tagText}>
              {formatRelativeTime(item.createdAt)}
            </Text>
          </View>
        </View>

        {/* Service / Product detail */}
        {item.serviceDetail ? (
          <Text style={styles.serviceDetail} numberOfLines={2}>
            {item.serviceDetail}
          </Text>
        ) : null}

        {/* Action buttons */}
        <View style={styles.actionRow}>
          {orderLocation.hasLocation ? (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleNavigate(orderLocation)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Open in maps"
            >
              <Ionicons name="navigate" size={16} color={Colors.primary} />
              <Text style={styles.actionBtnText}>Directions</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleCall(item.customerPhone)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Call ${item.customerName}`}
          >
            <Ionicons name="call" size={16} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Orders</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderCard}
        contentContainerStyle={
          orders.length === 0 ? styles.emptyContent : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              dispatch(getReceivedOrders({ page: 1, limit: 50 }));
            }}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="cart-outline" size={56} color={Colors.gray} />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>
                Orders from customers will appear here.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: { width: 36, alignItems: "flex-start", padding: 4 },
  headerSpacer: { width: 36 },
  screenTitle: { fontSize: 18, fontWeight: "800", color: Colors.black },
  listContent: { padding: 16, paddingBottom: 32 },
  emptyContent: { flexGrow: 1, justifyContent: "center", padding: 16 },
  emptyWrap: { alignItems: "center", paddingHorizontal: 24 },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "800",
    color: Colors.black,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
  },

  // Card design mirrors HotJobs.jobCard
  jobCard: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  hotLabel: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  avatarTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingRight: 32,
  },
  avatar: {
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatarImage: { width: 44, height: 44, borderRadius: 22 },
  avatarText: { fontSize: 16, fontWeight: "800", color: Colors.primary },
  titleContainer: { flex: 1, justifyContent: "center" },
  jobTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 2,
  },
  posterName: { fontSize: 13, color: Colors.white, opacity: 0.92 },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    maxWidth: "100%",
  },
  tagText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: "500",
    marginLeft: 4,
  },
  serviceDetail: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.95,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
});
