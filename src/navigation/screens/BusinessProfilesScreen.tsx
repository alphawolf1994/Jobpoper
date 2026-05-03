import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { Colors } from "../../utils";
import {
  deleteBusinessProfileApi,
  getMyBusinessProfilesApi,
} from "../../api/businessProfileApis";
import { IMAGE_BASE_URL } from "../../api/baseURL";
import VerificationBottomSheet, {
  VerificationBottomSheetHandle,
} from "../../components/VerificationBottomSheet";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchVerificationStatus } from "../../redux/slices/verificationSlice";

const MAX_PROFILES = 3;

// Backend stores image URLs as "/uploads/business-profiles/<filename>".
// IMAGE_BASE_URL already ends with "/uploads", so strip the duplicated
// segment to avoid "/uploads/uploads/...".
const resolveImageUrl = (uri?: string | null): string | undefined => {
  if (!uri) return undefined;
  if (/^https?:\/\//i.test(uri)) return uri;
  const trimmed = uri.replace(/^\/?uploads\//, "");
  return `${IMAGE_BASE_URL}/${trimmed}`;
};

type ProfileStatus = "pending" | "approved" | "rejected";

interface BusinessImageRef {
  _id: string;
  url: string;
  isPrimary?: boolean;
}

interface BusinessProfileItem {
  _id: string;
  businessName: string;
  category?: { _id: string; name?: string; slug?: string } | string;
  address: string;
  phoneNumber: string;
  status: ProfileStatus;
  rejectionReason?: string | null;
  images?: BusinessImageRef[];
  createdAt?: string;
  updatedAt?: string;
}

const STATUS_STYLES: Record<
  ProfileStatus,
  { bg: string; fg: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  pending: {
    bg: "#FFF4E0",
    fg: "#B26A00",
    label: "Pending review",
    icon: "time-outline",
  },
  approved: {
    bg: "#DFF8E8",
    fg: "#0E7A3C",
    label: "Approved",
    icon: "checkmark-circle-outline",
  },
  rejected: {
    bg: "#FFE0E0",
    fg: "#B30000",
    label: "Rejected",
    icon: "close-circle-outline",
  },
};

/**
 * BusinessProfilesScreen
 * -----------------------
 * Lists the user's business profiles. Each row shows a status badge
 * (pending / approved / rejected) and, if rejected, the admin's
 * rejection reason. An "Edit" affordance is exposed only on profiles
 * whose status is *not* pending — pending profiles are locked while
 * admin review is in flight. Editing a rejected (or approved) profile
 * routes back through the form which, on submit, resubmits and the
 * backend flips status back to pending.
 *
 * The "+" button in the header opens AddBusinessProfileScreen and is
 * rate-limited against the backend's 3-profile cap.
 */
const BusinessProfilesScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const verificationSheetRef = useRef<VerificationBottomSheetHandle>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const [profiles, setProfiles] = useState<BusinessProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingSlots, setRemainingSlots] = useState<number | null>(null);
  const [maxProfiles, setMaxProfiles] = useState(MAX_PROFILES);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProfiles = useCallback(async (mode: "initial" | "refresh") => {
    if (mode === "initial") setLoading(true);
    if (mode === "refresh") setRefreshing(true);
    setError(null);
    try {
      const res = await getMyBusinessProfilesApi();
      const list: BusinessProfileItem[] = res?.data?.profiles ?? [];
      setProfiles(list);
      setRemainingSlots(
        typeof res?.data?.remainingSlots === "number"
          ? res.data.remainingSlots
          : null
      );
      setMaxProfiles(
        typeof res?.data?.maxProfiles === "number"
          ? res.data.maxProfiles
          : MAX_PROFILES
      );
    } catch (e: any) {
      setError(e?.message || "Failed to load business profiles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh whenever this screen comes into focus (e.g. after the user
  // submits a new profile or finishes an edit).
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        if (cancelled) return;
        await loadProfiles("initial");
        if (!user?.isVerified) {
          dispatch(fetchVerificationStatus());
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [dispatch, loadProfiles, user?.isVerified])
  );

  const profileCount = profiles.length;
  const atLimit =
    remainingSlots != null ? remainingSlots <= 0 : profileCount >= maxProfiles;

  const handleAddPress = () => {
    if (!user?.isVerified) {
      verificationSheetRef.current?.open();
      return;
    }
    if (atLimit) {
      Toast.show({
        type: "info",
        text1: "Maximum 3 profiles reached",
        text2: "You can't create another business profile.",
      });
      return;
    }
    (navigation as any).navigate("AddBusinessProfileScreen");
  };

  const handleEditPress = (profile: BusinessProfileItem) => {
    // Defensive: pending profiles shouldn't even render an edit button,
    // but if something slips through we toast and bail rather than
    // letting the user start editing a locked profile.
    if (profile.status === "pending") {
      Toast.show({
        type: "info",
        text1: "Pending review",
        text2: "You can't edit a profile while it's awaiting review.",
      });
      return;
    }
    (navigation as any).navigate("AddBusinessProfileScreen", {
      mode: "edit",
      profile,
    });
  };

  const handleDeletePress = (profile: BusinessProfileItem) => {
    if (profile.status === "pending") {
      Toast.show({
        type: "info",
        text1: "Pending review",
        text2: "You can delete this profile after admin review.",
      });
      return;
    }

    Alert.alert(
      "Delete business profile?",
      `Are you sure you want to delete "${profile.businessName}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(profile._id);
            try {
              await deleteBusinessProfileApi(profile._id);
              setProfiles((prev) => prev.filter((p) => p._id !== profile._id));
              setRemainingSlots((prev) =>
                prev == null ? prev : Math.min(maxProfiles, prev + 1)
              );
              Toast.show({
                type: "success",
                text1: "Business profile deleted",
              });
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: err?.message || "Could not delete business profile.",
              });
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: BusinessProfileItem }) => {
    const status = (item.status ?? "pending") as ProfileStatus;
    const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
    const canEdit = status !== "pending";
    const canDelete = status !== "pending";
    const isDeleting = deletingId === item._id;

    const primary =
      item.images?.find((img) => img.isPrimary) ?? item.images?.[0];
    const imageUrl = resolveImageUrl(primary?.url);

    const categoryName =
      typeof item.category === "object" && item.category
        ? item.category.name
        : undefined;

    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.thumb}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]}>
              <Ionicons
                name="storefront-outline"
                size={28}
                color={Colors.gray}
              />
            </View>
          )}

          <View style={styles.cardBody}>
            <Text style={styles.businessName} numberOfLines={1}>
              {item.businessName}
            </Text>
            {categoryName ? (
              <Text style={styles.categoryText} numberOfLines={1}>
                {categoryName}
              </Text>
            ) : null}
            <Text style={styles.addressText} numberOfLines={2}>
              {item.address}
            </Text>

            <View
              style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
            >
              <Ionicons
                name={statusStyle.icon}
                size={12}
                color={statusStyle.fg}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.statusBadgeText, { color: statusStyle.fg }]}>
                {statusStyle.label}
              </Text>
            </View>
          </View>
        </View>

        {status === "rejected" && item.rejectionReason ? (
          <View style={styles.rejectionBox}>
            <Text style={styles.rejectionLabel}>Reason for rejection</Text>
            <Text style={styles.rejectionText}>{item.rejectionReason}</Text>
          </View>
        ) : null}

        {/*
          Edit button is fully disabled while the profile is pending —
          we render it in a non-interactive, greyed-out state and show
          a "wait for admin" message beneath it so the affordance is
          visible but obviously locked.
        */}
        <TouchableOpacity
          style={[styles.editButton, !canEdit && styles.editButtonDisabled]}
          onPress={() => handleEditPress(item)}
          activeOpacity={canEdit ? 0.85 : 1}
          disabled={!canEdit}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canEdit }}
          accessibilityLabel={
            !canEdit
              ? "Edit disabled — profile under review"
              : status === "rejected"
              ? "Edit and resubmit business profile"
              : "Edit business profile"
          }
        >
          <Ionicons
            name={!canEdit ? "lock-closed-outline" : "create-outline"}
            size={16}
            color={!canEdit ? "#7A8195" : Colors.white}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.editButtonText,
              !canEdit && styles.editButtonTextDisabled,
            ]}
          >
            {status === "rejected"
              ? "Edit & Resubmit"
              : status === "pending"
              ? "Edit profile"
              : "Edit profile"}
          </Text>
        </TouchableOpacity>

        {canDelete ? (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(item)}
            activeOpacity={0.85}
            disabled={isDeleting}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDeleting }}
            accessibilityLabel="Delete business profile"
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={Colors.red} />
            ) : (
              <>
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={Colors.red}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.deleteButtonText}>Delete profile</Text>
              </>
            )}
          </TouchableOpacity>
        ) : null}

        {!canEdit ? (
          <Text style={styles.pendingHint}>
            Under review, please wait for admin response.
          </Text>
        ) : null}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Ionicons
          name="storefront-outline"
          size={56}
          color={Colors.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>No business profiles yet</Text>
      <Text style={styles.emptyMessage}>
        You can create up to {maxProfiles} business profiles. Click{" "}
        <Text style={styles.plusInline}>+</Text> to add your first business.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => (navigation as any).goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
            <Text style={styles.headerTitle}>Business Profiles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addButton, atLimit && styles.addButtonDisabled]}
            onPress={handleAddPress}
            activeOpacity={0.8}
            disabled={atLimit}
            accessibilityLabel={
              atLimit
                ? "Maximum 3 profiles reached"
                : "Add business profile"
            }
            accessibilityRole="button"
            accessibilityState={{ disabled: atLimit }}
          >
            <Ionicons
              name="add"
              size={22}
              color={atLimit ? "#7A8195" : Colors.white}
            />
          </TouchableOpacity>
        </View>
        {atLimit ? (
          <View style={styles.limitMessage}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.orange} />
            <Text style={styles.limitMessageText}>
              Maximum 3 profiles reached
            </Text>
          </View>
        ) : null}
      </View>

      {loading && profiles.length === 0 ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={
            profiles.length === 0
              ? styles.flatListEmpty
              : styles.flatListContent
          }
          ListEmptyComponent={!error ? renderEmpty : null}
          ListHeaderComponent={
            error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadProfiles("refresh")}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
      <VerificationBottomSheet ref={verificationSheetRef} />
    </SafeAreaView>
  );
};

export default BusinessProfilesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: "#E4E7EE",
    shadowOpacity: 0,
    elevation: 0,
  },
  limitMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FFE0A8",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  limitMessageText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.orange,
  },

  // Loading state
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // List
  flatListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  flatListEmpty: {
    flexGrow: 1,
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E2EAFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: "row",
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: "#F4F7FF",
  },
  thumbPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
  categoryText: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: "600",
  },
  addressText: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 4,
    lineHeight: 18,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // Rejection reason callout
  rejectionBox: {
    marginTop: 12,
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFD4D4",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rejectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B30000",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 13,
    color: "#7A1A1A",
    lineHeight: 18,
  },

  // Action row
  editButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
  },
  editButtonDisabled: {
    backgroundColor: "#E4E7EE",
    shadowOpacity: 0,
    elevation: 0,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  editButtonTextDisabled: {
    color: "#7A8195",
  },
  pendingHint: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.gray,
    fontStyle: "italic",
    textAlign: "center",
  },
  deleteButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFD4D4",
    borderRadius: 10,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: Colors.red,
    fontSize: 14,
    fontWeight: "700",
  },

  // Error
  errorBox: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFD4D4",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: "#B30000",
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
  },
  plusInline: {
    fontWeight: "800",
    color: Colors.primary,
  },
});
