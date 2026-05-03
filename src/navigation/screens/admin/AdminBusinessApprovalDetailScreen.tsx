import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";

import { IMAGE_BASE_URL } from "../../../api/baseURL";
import { Colors } from "../../../utils";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  AdminBusinessApprovalRequest,
  reviewBusinessProfile,
} from "../../../redux/slices/adminSlice";

const ADMIN_ACCENT = "#1E40AF";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GALLERY_HEIGHT = Math.min(340, Math.round(SCREEN_WIDTH * 0.7));

const resolveImageUrl = (uri?: string | null) => {
  if (!uri) return undefined;
  if (/^https?:\/\//i.test(uri)) return uri;
  const trimmed = uri.replace(/^\/?uploads\//, "");
  return `${IMAGE_BASE_URL}/${trimmed}`;
};

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const AdminBusinessApprovalDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const routeProfile = (route.params as any)?.profile as
    | AdminBusinessApprovalRequest
    | undefined;
  const { businessApprovalRequests, businessReviewLoading } = useSelector(
    (state: RootState) => state.admin
  );
  const profile =
    (businessApprovalRequests ?? []).find((item) => item.id === routeProfile?.id) ||
    routeProfile;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const imageUrls = useMemo(
    () =>
      (profile?.images ?? [])
        .map((image) => resolveImageUrl(image.url))
        .filter(Boolean) as string[],
    [profile?.images]
  );

  const categoryName =
    typeof profile?.category === "object" && profile?.category
      ? profile.category.name
      : undefined;
  const userName =
    profile?.user?.fullName || profile?.user?.phoneNumber || "Unknown user";

  const handleApprove = async () => {
    if (!profile) return;
    if (businessReviewLoading) return;
    setLocalError(null);
    const result = await dispatch(
      reviewBusinessProfile({ profileId: profile.id, status: "approved" })
    );
    if (reviewBusinessProfile.fulfilled.match(result)) {
      navigation.goBack();
    } else {
      setLocalError(String(result.payload || "Failed to approve profile"));
    }
  };

  const handleReject = async () => {
    if (!profile) return;
    if (businessReviewLoading) return;
    const reason = rejectionReason.trim();
    if (!reason) {
      setLocalError("Please enter a rejection reason.");
      return;
    }

    const result = await dispatch(
      reviewBusinessProfile({
        profileId: profile.id,
        status: "rejected",
        rejectionReason: reason,
      })
    );
    if (reviewBusinessProfile.fulfilled.match(result)) {
      setRejectVisible(false);
      navigation.goBack();
    } else {
      setLocalError(String(result.payload || "Failed to reject profile"));
    }
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={42} color={Colors.gray} />
        <Text style={styles.emptyText}>Business profile not found</Text>
        <TouchableOpacity
          style={styles.backFallback}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backFallbackText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={ADMIN_ACCENT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.galleryWrap}>
          {imageUrls.length > 0 ? (
            <FlatList
              data={imageUrls}
              keyExtractor={(item, index) => `${item}-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setActiveImageIndex(index);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.galleryImage}
                  contentFit="cover"
                />
              )}
            />
          ) : (
            <View style={styles.galleryPlaceholder}>
              <Ionicons name="image-outline" size={52} color={Colors.gray} />
              <Text style={styles.placeholderText}>No images uploaded</Text>
            </View>
          )}
          {imageUrls.length > 1 ? (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeImageIndex + 1}/{imageUrls.length}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.businessName}>{profile.businessName}</Text>
              {categoryName ? (
                <Text style={styles.categoryText}>{categoryName}</Text>
              ) : null}
            </View>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Pending</Text>
            </View>
          </View>

          <InfoRow icon="person-outline" label="User" value={userName} />
          <InfoRow
            icon="call-outline"
            label="User Phone"
            value={profile.user?.phoneNumber || "Not available"}
          />
          <InfoRow
            icon="business-outline"
            label="Business Phone"
            value={profile.phoneNumber || "Not available"}
          />
          <InfoRow
            icon="location-outline"
            label="Address"
            value={profile.address || "Not available"}
          />
          <InfoRow
            icon="time-outline"
            label="Submitted"
            value={formatDate(profile.submittedAt)}
          />
        </View>

        {localError ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={Colors.Red} />
            <Text style={styles.errorText}>{localError}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          activeOpacity={0.85}
          disabled={businessReviewLoading}
          onPress={() => {
            setLocalError(null);
            setRejectVisible(true);
          }}
        >
          {businessReviewLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons name="close-circle" size={20} color={Colors.white} />
              <Text style={styles.actionText}>Reject</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          activeOpacity={0.85}
          disabled={businessReviewLoading}
          onPress={handleApprove}
        >
          {businessReviewLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
              <Text style={styles.actionText}>Approve</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={rejectVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reject Business Profile</Text>
            <Text style={styles.modalText}>
              Add a reason so the user knows what to fix before resubmitting.
            </Text>
            <TextInput
              value={rejectionReason}
              onChangeText={setRejectionReason}
              placeholder="Enter rejection reason"
              placeholderTextColor={Colors.gray}
              style={styles.reasonInput}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setRejectVisible(false)}
                disabled={businessReviewLoading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmRejectButton]}
                onPress={handleReject}
                disabled={businessReviewLoading}
              >
                {businessReviewLoading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.confirmText}>Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={18} color={ADMIN_ACCENT} />
    </View>
    <View style={styles.infoBody}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

export default AdminBusinessApprovalDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFF",
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: ADMIN_ACCENT },
  scroll: { paddingBottom: 118 },
  galleryWrap: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
    backgroundColor: "#EEF4FF",
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
  },
  galleryPlaceholder: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { marginTop: 8, color: Colors.gray, fontSize: 13 },
  imageCounter: {
    position: "absolute",
    right: 16,
    bottom: 14,
    backgroundColor: "rgba(0,0,0,0.58)",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageCounterText: { color: Colors.white, fontSize: 12, fontWeight: "800" },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2EAFF",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  businessName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.black,
    lineHeight: 28,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: ADMIN_ACCENT,
  },
  pendingBadge: {
    backgroundColor: "#FFF3E0",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  pendingBadgeText: { color: Colors.orange, fontSize: 11, fontWeight: "800" },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoBody: { flex: 1 },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: "700",
    marginBottom: 3,
  },
  infoValue: { fontSize: 15, color: Colors.black, lineHeight: 21 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
  },
  errorText: { color: Colors.Red, fontSize: 14, flex: 1 },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: { backgroundColor: Colors.green },
  rejectButton: { backgroundColor: Colors.Red },
  actionText: {
    marginLeft: 7,
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: Colors.black },
  modalText: { marginTop: 6, fontSize: 13, color: Colors.gray, lineHeight: 19 },
  reasonInput: {
    minHeight: 116,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
    color: Colors.black,
    fontSize: 14,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 14 },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: ADMIN_ACCENT,
  },
  confirmRejectButton: { backgroundColor: Colors.Red },
  cancelText: { color: ADMIN_ACCENT, fontWeight: "800" },
  confirmText: { color: Colors.white, fontWeight: "800" },
  emptyText: { marginTop: 12, color: Colors.gray, fontSize: 15 },
  backFallback: {
    marginTop: 16,
    backgroundColor: ADMIN_ACCENT,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backFallbackText: { color: Colors.white, fontWeight: "800" },
});
