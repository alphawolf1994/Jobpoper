import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchAdminUserById, clearSelectedUser } from "../../../redux/slices/adminSlice";
import { Colors } from "../../../utils";
import { IMAGE_BASE_URL } from "../../../api/baseURL";

const ADMIN_ACCENT = "#1E40AF";
const ADMIN_LIGHT  = "#EFF6FF";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── Helper Components ────────────────────────────────────────────────────────
interface InfoRowProps { label: string; value: string; }
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "—"}</Text>
  </View>
);

const getVerificationColor = (status: string) => {
  switch (status) {
    case "approved":     return Colors.green;
    case "rejected":     return Colors.Red;
    case "under_review": return Colors.orange;
    default:             return Colors.gray;
  }
};
const getBoolColor = (val: boolean) => (val ? Colors.green : Colors.Red);

const resolveImage = (uri?: string | null) => {
  if (!uri) return null;
  if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
  return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
};

interface ImageViewerProps {
  uri: string;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ uri, onClose }) => (
  <Modal transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.imageViewerBg}>
      <TouchableOpacity style={styles.imageViewerClose} onPress={onClose}>
        <Ionicons name="close" size={28} color={Colors.white} />
      </TouchableOpacity>
      <Image source={{ uri }} style={styles.imageViewerImg} resizeMode="contain" />
    </View>
  </Modal>
);

interface DocCardProps {
  label: string;
  uri: string | null | undefined;
  onPress: (uri: string) => void;
}

const DocCard: React.FC<DocCardProps> = ({ label, uri, onPress }) => {
  const resolvedUri = resolveImage(uri);

  return (
    <View style={styles.docCard}>
      <Text style={styles.docLabel}>{label}</Text>
      {resolvedUri ? (
        <TouchableOpacity onPress={() => onPress(resolvedUri)} activeOpacity={0.8}>
          <Image source={{ uri: resolvedUri }} style={styles.docThumb} resizeMode="cover" />
          <View style={styles.docTapHint}>
            <Ionicons name="expand-outline" size={16} color={Colors.white} />
            <Text style={styles.docTapText}>Tap to expand</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.docPlaceholder}>
          <Ionicons name="image-outline" size={32} color={Colors.gray} />
          <Text style={styles.docPlaceholderText}>Not uploaded</Text>
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
// Detail API returns: { ...buildAdminUser(), profile: user.profile, verification: buildVerificationPayload() }
// So we have FLAT top-level fields (fullName, verificationStatus, id) AND nested profile/verification
const AdminUserDetailScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const dispatch   = useDispatch<AppDispatch>();
  const { userId } = (route.params as any) || {};
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const { selectedUser, usersLoading, usersError } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    if (userId) dispatch(fetchAdminUserById(userId));
    return () => { dispatch(clearSelectedUser()); };
  }, [userId, dispatch]);

  if (usersLoading || !selectedUser) {
    return (
      <SafeAreaView style={styles.centered}>
        {usersLoading
          ? <ActivityIndicator size="large" color={ADMIN_ACCENT} />
          : <>
              <Ionicons name="alert-circle-outline" size={40} color={Colors.gray} />
              <Text style={styles.errorText}>{usersError || "User not found"}</Text>
            </>
        }
      </SafeAreaView>
    );
  }

  const u = selectedUser;
  // verificationStatus is the flat field; verification.status is nested (both present in detail)
  const verStatus = u.verification?.status || u.verificationStatus || "not_submitted";
  const verColor  = getVerificationColor(verStatus);
  // fullName is a flat field from buildAdminUser OR from nested profile
  const displayName = u.fullName || u.profile?.fullName || "";
  const profileImageUri = resolveImage(u.profile?.profileImage);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={ADMIN_ACCENT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            {profileImageUri
              ? <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
              : <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>
                    {(displayName[0] || u.phoneNumber?.[0] || "U").toUpperCase()}
                  </Text>
                </View>
            }
          </View>
          <Text style={styles.profileName}>{displayName || u.phoneNumber}</Text>
          <Text style={styles.profilePhone}>{u.phoneNumber}</Text>

          <View style={styles.profileBadges}>
            <View style={[styles.badge, { backgroundColor: verColor + "20" }]}>
              <Text style={[styles.badgeText, { color: verColor }]}>
                {verStatus.replace(/_/g, " ")}
              </Text>
            </View>
            {u.role === "admin" && (
              <View style={[styles.badge, { backgroundColor: ADMIN_ACCENT + "20" }]}>
                <Text style={[styles.badgeText, { color: ADMIN_ACCENT }]}>Admin</Text>
              </View>
            )}
          </View>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Status</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Ionicons name={u.isPhoneVerified ? "checkmark-circle" : "close-circle"} size={22} color={getBoolColor(u.isPhoneVerified)} />
              <Text style={styles.statusLabel}>Phone Verified</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name={u.isVerified ? "checkmark-circle" : "close-circle"} size={22} color={getBoolColor(u.isVerified)} />
              <Text style={styles.statusLabel}>Admin Verified</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name={u.isProfileComplete ? "checkmark-circle" : "close-circle"} size={22} color={getBoolColor(u.isProfileComplete)} />
              <Text style={styles.statusLabel}>Profile Complete</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name={u.isActive ? "checkmark-circle" : "close-circle"} size={22} color={getBoolColor(u.isActive)} />
              <Text style={styles.statusLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.card}>
            <InfoRow label="Full Name"     value={displayName} />
            <InfoRow label="Email"         value={u.email || u.profile?.email || ""} />
            <InfoRow label="Location"      value={u.location || u.profile?.location || ""} />
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.card}>
            <InfoRow label="Role"       value={u.role} />
            <InfoRow label="Phone"      value={u.phoneNumber} />
            <InfoRow label="Created"    value={u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""} />
            <InfoRow label="Last Login" value={u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"} />
          </View>
        </View>

        {/* Verification Info */}
        {u.verification && verStatus !== "not_submitted" && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verification Details</Text>
              <View style={styles.card}>
                <InfoRow label="Status"    value={verStatus.replace(/_/g, " ")} />
                <InfoRow label="Submitted" value={u.verification.submittedAt ? new Date(u.verification.submittedAt).toLocaleDateString() : ""} />
                <InfoRow label="Reviewed"  value={u.verification.reviewedAt ? new Date(u.verification.reviewedAt).toLocaleDateString() : "Pending"} />
                {u.verification.reviewNotes ? (
                  <InfoRow label="Review Notes" value={u.verification.reviewNotes} />
                ) : null}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verification Documents</Text>
              <View style={styles.docsRow}>
                <DocCard
                  label="Selfie Photo"
                  uri={u.verification.selfieImage}
                  onPress={setViewingImage}
                />
                <DocCard
                  label="ID Document"
                  uri={u.verification.idPhotoImage}
                  onPress={setViewingImage}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {viewingImage && (
        <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />
      )}
    </SafeAreaView>
  );
};

export default AdminUserDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  centered:  { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: "#F8FAFF" },
  errorText: { color: Colors.gray, fontSize: 15 },
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
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: ADMIN_LIGHT, alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: ADMIN_ACCENT },
  scroll: { padding: 20, paddingBottom: 40 },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarWrap:    { marginBottom: 14 },
  profileImage:  { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: ADMIN_ACCENT + "40" },
  avatarFallback: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: ADMIN_ACCENT + "20", alignItems: "center", justifyContent: "center",
  },
  avatarInitial: { fontSize: 36, fontWeight: "800", color: ADMIN_ACCENT },
  profileName:   { fontSize: 20, fontWeight: "700", color: Colors.black },
  profilePhone:  { fontSize: 14, color: Colors.gray, marginTop: 4 },
  profileBadges: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap", justifyContent: "center" },
  badge:         { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText:     { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  section:       { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14, fontWeight: "700", color: Colors.gray,
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10, marginLeft: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  docsRow: {
    flexDirection: "row",
    gap: 12,
  },
  docCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    overflow: "hidden",
  },
  docLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.black,
    padding: 12,
    paddingBottom: 8,
  },
  docThumb: {
    width: "100%",
    height: 140,
  },
  docTapHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  docTapText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: "500",
  },
  docPlaceholder: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.lightGray,
    gap: 8,
  },
  docPlaceholderText: {
    fontSize: 12,
    color: Colors.gray,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  infoLabel: { fontSize: 14, color: Colors.gray, flex: 1 },
  infoValue: { fontSize: 14, color: Colors.black, fontWeight: "500", flex: 2, textAlign: "right", textTransform: "capitalize" },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statusItem: {
    width: "47%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  statusLabel: { fontSize: 12, color: Colors.gray, fontWeight: "500", textAlign: "center" },
  imageViewerBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageViewerClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  imageViewerImg: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
});
