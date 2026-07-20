import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AppDispatch, RootState } from "../redux/store";
import { lookupWorker, startJob, clearLookedUpWorker } from "../redux/slices/jobVerificationSlice";
import { getUserJobs } from "../redux/slices/jobSlice";
import { Colors } from "../utils";
import { IMAGE_BASE_URL } from "../api/baseURL";
import { Job, WorkerProfile } from "../interface/interfaces";

interface Props {
  visible: boolean;
  job: Job | null;
  onClose: () => void;
  onStarted: () => void;
}

const resolveImage = (uri?: string | null) => {
  if (!uri) return null;
  if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
  return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
};

const StarRating = ({ rating }: { rating: number }) => (
  <View style={{ flexDirection: "row", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Ionicons
        key={s}
        name={s <= Math.round(rating) ? "star" : "star-outline"}
        size={14}
        color="#F59E0B"
      />
    ))}
  </View>
);

const VerifyWorkerSheet: React.FC<Props> = ({ visible, job, onClose, onStarted }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const { lookedUpWorker, workerLookupLoading, workerLookupError, startJobLoading, startJobError } =
    useSelector((state: RootState) => state.jobVerification);
  const insets = useSafeAreaInsets();

  const [workerIdInput, setWorkerIdInput] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // Reset on open/close
  useEffect(() => {
    if (visible) {
      setWorkerIdInput("");
      setConfirmed(false);
      dispatch(clearLookedUpWorker());
    }
  }, [visible]);

  const handleLookup = () => {
    const trimmed = workerIdInput.trim().toUpperCase();
    if (!trimmed || trimmed.length !== 5) return;
    dispatch(lookupWorker(trimmed));
  };

  const handleConfirmStart = async () => {
    if (!job || !lookedUpWorker) return;
    try {
      await dispatch(startJob({ jobId: job._id, workerId: lookedUpWorker._id })).unwrap();
      dispatch(getUserJobs());
      setConfirmed(true);
      setTimeout(() => {
        onStarted();
        onClose();
      }, 1500);
    } catch (_) {
      // error shown via startJobError
    }
  };

  const worker: WorkerProfile | null = lookedUpWorker;
  const categories = worker?.professionalProfile?.serviceCategories ?? [];
  // Prefer admin-approved verification selfie over optional profile photo
  const avatarUri = resolveImage(
    worker?.verification?.selfieImage || worker?.profile?.profileImage
  );
  const isVerified = worker?.verification?.status === "approved";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 32 : 16) }]}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Verify Worker</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Job reference */}
            {job && (
              <View style={styles.jobRef}>
                <Ionicons name="briefcase-outline" size={15} color={Colors.primary} />
                <Text style={styles.jobRefText} numberOfLines={1}>
                  {job.title}
                </Text>
              </View>
            )}

            {/* Worker ID input */}
            <Text style={styles.label}>Enter Worker ID</Text>
            <Text style={styles.sublabel}>
              Ask the professional for their 5-character Worker ID
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="e.g. AB3X7"
                placeholderTextColor={Colors.gray}
                value={workerIdInput}
                onChangeText={(t) => setWorkerIdInput(t.toUpperCase())}
                autoCapitalize="characters"
                maxLength={5}
                returnKeyType="search"
                onSubmitEditing={handleLookup}
              />
              <TouchableOpacity
                style={[
                  styles.lookupBtn,
                  workerLookupLoading && { opacity: 0.6 },
                ]}
                onPress={handleLookup}
                disabled={workerLookupLoading}
                activeOpacity={0.8}
              >
                {workerLookupLoading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.lookupBtnText}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Lookup error */}
            {workerLookupError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="warning-outline" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{workerLookupError}</Text>
              </View>
            ) : null}

            {/* Worker profile card */}
            {worker && !workerLookupError && (
              <View style={styles.profileCard}>
                {/* View full profile */}
                <View style={styles.viewProfileRow}>
                  <TouchableOpacity
                    style={styles.viewProfileBtn}
                    activeOpacity={0.8}
                    onPress={() => {
                      onClose();
                      navigation.navigate('WorkerProfileScreen', {
                        workerId: worker._id,
                        workerName: worker.profile?.fullName,
                        workerImage:
                          worker.verification?.selfieImage ||
                          worker.profile?.profileImage,
                      });
                    }}
                  >
                    <Ionicons name="person-circle-outline" size={15} color={Colors.primary} />
                    <Text style={styles.viewProfileBtnText}>View Profile</Text>
                    <Ionicons name="chevron-forward" size={13} color={Colors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Avatar + name row */}
                <View style={styles.profileTop}>
                  <View style={styles.avatarWrap}>
                    {avatarUri ? (
                      <Image source={{ uri: avatarUri }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Ionicons name="person" size={32} color={Colors.gray} />
                      </View>
                    )}
                    {isVerified && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="shield-checkmark" size={14} color={Colors.white} />
                      </View>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={styles.workerName} numberOfLines={1}>
                        {worker.profile?.fullName}
                      </Text>
                      {isVerified && (
                        <View style={styles.verifiedChip}>
                          <Text style={styles.verifiedChipText}>Verified</Text>
                        </View>
                      )}
                    </View>
                    {/* Worker ID */}
                    <Text style={styles.workerIdText}>ID: {worker.workerId}</Text>
                    {/* Rating */}
                    <View style={styles.ratingRow}>
                      <StarRating rating={worker.rating?.average ?? 0} />
                      <Text style={styles.ratingText}>
                        {(worker.rating?.average ?? 0).toFixed(1)} ({worker.rating?.count ?? 0}{" "}
                        review{worker.rating?.count !== 1 ? "s" : ""})
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Bio */}
                {worker.professionalProfile?.bio ? (
                  <Text style={styles.bio} numberOfLines={3}>
                    {worker.professionalProfile.bio}
                  </Text>
                ) : null}

                {/* Service categories */}
                {categories.length > 0 && (
                  <View style={styles.categoriesWrap}>
                    {categories.map((cat: any) => (
                      <View key={cat._id ?? cat} style={styles.categoryChip}>
                        <Text style={styles.categoryChipText}>
                          {typeof cat === "string" ? cat : cat.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Start job error */}
                {startJobError ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="warning-outline" size={16} color="#DC2626" />
                    <Text style={styles.errorText}>{startJobError}</Text>
                  </View>
                ) : null}

                {/* Confirm & Start */}
                {confirmed ? (
                  <View style={styles.successBanner}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={styles.successText}>Task started! Worker has been notified.</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.startBtn, startJobLoading && { opacity: 0.6 }]}
                    onPress={handleConfirmStart}
                    disabled={startJobLoading}
                    activeOpacity={0.8}
                  >
                    {startJobLoading ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
                        <Text style={styles.startBtnText}>Confirm & Start Task</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default VerifyWorkerSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 0,
  },
  jobRef: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  jobRefText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 4,
  },
  sublabel: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
    letterSpacing: 4,
    backgroundColor: "#F9FAFB",
  },
  lookupBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  lookupBtnText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "500",
  },
  profileCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  viewProfileRow: {
    alignItems: "flex-end",
  },
  viewProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  avatarPlaceholder: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#10B981",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  workerName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    flexShrink: 1,
  },
  verifiedChip: {
    backgroundColor: "#ECFDF5",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  verifiedChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#065F46",
  },
  workerIdText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: "500",
    marginTop: 2,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.gray,
  },
  bio: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  categoriesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  categoryChip: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoryChipText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#6EE7B7",
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  successText: {
    fontSize: 14,
    color: "#065F46",
    fontWeight: "600",
    flex: 1,
  },
});
