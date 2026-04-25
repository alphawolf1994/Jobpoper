import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import {
  fetchAdminVerifications,
  reviewVerification,
  clearSelectedVerification,
} from "../../../redux/slices/adminSlice";
import { Colors } from "../../../utils";
import { IMAGE_BASE_URL } from "../../../api/baseURL";

const ADMIN_ACCENT = "#1E40AF";
const ADMIN_LIGHT = "#EFF6FF";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved": return Colors.green;
    case "rejected": return Colors.Red;
    case "under_review": return Colors.orange;
    default: return Colors.gray;
  }
};

// ─── Image Viewer Modal ───────────────────────────────────────────────────────
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
      <Image
        source={{ uri }}
        style={styles.imageViewerImg}
        resizeMode="contain"
      />
    </View>
  </Modal>
);

// ─── Doc Image Card ───────────────────────────────────────────────────────────
interface DocCardProps {
  label: string;
  uri: string | null | undefined;
  onPress: (uri: string) => void;
}

const DocCard: React.FC<DocCardProps> = ({ label, uri, onPress }) => {
  const resolvedUri = uri
    ? uri.startsWith("http") || uri.startsWith("file:")
      ? uri
      : `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`
    : null;

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
const AdminVerificationDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = (route.params as any) || {};

  const { verifications, verificationsLoading, reviewLoading, verificationsError } = useSelector(
    (state: RootState) => state.admin
  );

  const user = verifications.find((u) => u.id === userId);
  const [reviewNotes, setReviewNotes] = useState(user?.verification?.reviewNotes || "");
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"approved" | "rejected" | null>(null);

  useEffect(() => {
    // If verifications not loaded yet, fetch them
    if (verifications.length === 0) {
      dispatch(fetchAdminVerifications());
    }
  }, []);

  useEffect(() => {
    if (user?.verification?.reviewNotes) {
      setReviewNotes(user.verification.reviewNotes);
    }
  }, [user]);

  const handleReview = async (status: "approved" | "rejected") => {
    setConfirmAction(null);
    // userId here is the flat `id` field from buildAdminUser
    await dispatch(reviewVerification({ userId, status, reviewNotes }));
    navigation.goBack();
  };

  if (verificationsLoading && !user) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={ADMIN_ACCENT} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={40} color={Colors.gray} />
        <Text style={styles.emptyText}>User not found</Text>
        <TouchableOpacity style={styles.backFallback} onPress={() => navigation.goBack()}>
          <Text style={styles.backFallbackText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Use nested verification.status (present in verifications endpoint) OR flat verificationStatus
  const verStatus = user.verification?.status || user.verificationStatus || "not_submitted";
  const statusColor = getStatusColor(verStatus);
  const isPending = verStatus === "under_review";

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={ADMIN_ACCENT} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verification Review</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        >
          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {(user.fullName?.[0] || user.phoneNumber?.[0] || "U").toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.fullName || user.phoneNumber}</Text>
              <Text style={styles.userPhone}>{user.phoneNumber}</Text>
              {user.verification?.submittedAt && (
                <Text style={styles.userDate}>
                  Submitted: {new Date(user.verification.submittedAt).toLocaleDateString()}
                </Text>
              )}
            </View>
            <View style={[styles.badge, { backgroundColor: statusColor + "20" }]}>
              <Text style={[styles.badgeText, { color: statusColor }]}>
                {verStatus.replace("_", " ")}
              </Text>
            </View>
          </View>

          {(verStatus === "approved" || verStatus === "rejected") && user.verification?.reviewedAt && (
            <View style={styles.reviewedBanner}>
              <Ionicons
                name={verStatus === "approved" ? "checkmark-circle" : "close-circle"}
                size={20}
                color={statusColor}
              />
              <Text style={[styles.reviewedText, { color: statusColor }]}>
                {verStatus === "approved" ? "Approved" : "Rejected"} on{" "}
                {new Date(user.verification.reviewedAt).toLocaleDateString()}
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Submitted Documents</Text>
            <View style={styles.docsRow}>
              <DocCard
                label="Selfie Photo"
                uri={user.verification?.selfieImage}
                onPress={setViewingImage}
              />
              <DocCard
                label="ID Document"
                uri={user.verification?.idPhotoImage}
                onPress={setViewingImage}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Review Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add review notes or reason for rejection..."
              placeholderTextColor={Colors.gray}
              value={reviewNotes}
              onChangeText={setReviewNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {isPending && (
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Decision</Text>
              <View style={styles.actionBtns}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => setConfirmAction("approved")}
                  activeOpacity={0.8}
                  disabled={reviewLoading}
                >
                  {reviewLoading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                      <Text style={styles.actionBtnText}>Approve</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => setConfirmAction("rejected")}
                  activeOpacity={0.8}
                  disabled={reviewLoading}
                >
                  {reviewLoading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <>
                      <Ionicons name="close-circle" size={20} color={Colors.white} />
                      <Text style={styles.actionBtnText}>Reject</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!isPending && (
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Change Decision</Text>
              <View style={styles.actionBtns}>
                {verStatus !== "approved" && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.approveBtn]}
                    onPress={() => setConfirmAction("approved")}
                    activeOpacity={0.8}
                    disabled={reviewLoading}
                  >
                    <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                    <Text style={styles.actionBtnText}>Approve</Text>
                  </TouchableOpacity>
                )}
                {verStatus !== "rejected" && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => setConfirmAction("rejected")}
                    activeOpacity={0.8}
                    disabled={reviewLoading}
                  >
                    <Ionicons name="close-circle" size={20} color={Colors.white} />
                    <Text style={styles.actionBtnText}>Reject</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Image Viewer */}
      {viewingImage && (
        <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />
      )}

      {/* Confirm Modal */}
      {confirmAction && (
        <Modal transparent animationType="fade" onRequestClose={() => setConfirmAction(null)}>
          <View style={styles.confirmBg}>
            <View style={styles.confirmCard}>
              <Ionicons
                name={confirmAction === "approved" ? "checkmark-circle" : "close-circle"}
                size={44}
                color={confirmAction === "approved" ? Colors.green : Colors.Red}
              />
              <Text style={styles.confirmTitle}>
                {confirmAction === "approved" ? "Approve Verification?" : "Reject Verification?"}
              </Text>
              <Text style={styles.confirmMsg}>
                {confirmAction === "approved"
                  ? "This will mark the user as verified and notify them."
                  : "This will reject the verification and notify the user."}
              </Text>
              {reviewNotes ? (
                <View style={styles.confirmNotes}>
                  <Text style={styles.confirmNotesLabel}>Notes:</Text>
                  <Text style={styles.confirmNotesText}>{reviewNotes}</Text>
                </View>
              ) : null}
              <View style={styles.confirmBtns}>
                <TouchableOpacity
                  style={styles.confirmCancelBtn}
                  onPress={() => setConfirmAction(null)}
                >
                  <Text style={styles.confirmCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmConfirmBtn,
                    { backgroundColor: confirmAction === "approved" ? Colors.green : Colors.Red },
                  ]}
                  onPress={() => handleReview(confirmAction)}
                >
                  <Text style={styles.confirmConfirmText}>
                    {confirmAction === "approved" ? "Approve" : "Reject"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default AdminVerificationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  keyboardWrap: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#F8FAFF",
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 15,
  },
  backFallback: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: ADMIN_ACCENT,
    borderRadius: 10,
  },
  backFallbackText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 14,
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
    borderRadius: 10,
    backgroundColor: ADMIN_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: ADMIN_ACCENT,
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
    flexGrow: 1,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ADMIN_ACCENT + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: ADMIN_ACCENT,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
  userPhone: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  userDate: {
    fontSize: 11,
    color: Colors.darkGray,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  reviewedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  reviewedText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.gray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 2,
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
  notesInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 14,
    fontSize: 14,
    color: Colors.black,
    minHeight: 100,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionBtns: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  approveBtn: {
    backgroundColor: Colors.green,
  },
  rejectBtn: {
    backgroundColor: Colors.Red,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
  // Image Viewer
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
  // Confirm Modal
  confirmBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  confirmCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
    textAlign: "center",
  },
  confirmMsg: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
  },
  confirmNotes: {
    width: "100%",
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
  },
  confirmNotesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.gray,
    marginBottom: 4,
  },
  confirmNotesText: {
    fontSize: 13,
    color: Colors.black,
  },
  confirmBtns: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 4,
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
  },
  confirmCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.gray,
  },
  confirmConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmConfirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
  },
});
