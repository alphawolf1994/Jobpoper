import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { Colors } from "../../utils";
import { RootState, AppDispatch } from "../../redux/store";
import {
  clearVerificationError,
  fetchVerificationStatus,
  showVerificationPromptAgain,
  submitVerificationDocuments,
} from "../../redux/slices/verificationSlice";
import { IMAGE_BASE_URL } from "../../api/baseURL";
import { useAlertModal } from "../../hooks/useAlertModal";

const VerificationDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    selfieUri,
    idPhotoUri,
    status,
    reviewNotes,
    loading,
    error,
    submittedAt,
    reviewedAt,
  } = useSelector((state: RootState) => state.verification);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  const canEditDocuments = status === "not_submitted" || status === "rejected";

  const resolveImageUri = useCallback((uri?: string | null) => {
    if (!uri) return null;
    if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
    return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const shouldRefreshFromServer =
        status !== "not_submitted" || (!selfieUri && !idPhotoUri);

      if (shouldRefreshFromServer) {
        dispatch(fetchVerificationStatus());
      }
    }, [dispatch, status, selfieUri, idPhotoUri])
  );

  const steps = [
    {
      key: "selfie",
      title: "Upload selfie",
      subtitle: "Take or choose a clear selfie for identity matching.",
      done: !!selfieUri,
      icon: "camera-outline" as const,
      onPress: () => {
        if (!canEditDocuments) {
          showAlert({
            title: "Verification locked",
            message:
              status === "approved"
                ? "Your verification is already approved."
                : "Your documents are under review right now.",
            type: "info",
          });
          return;
        }
        dispatch(clearVerificationError());
        dispatch(showVerificationPromptAgain());
        (navigation as any).navigate("VerificationSelfieScreen");
      },
    },
    {
      key: "id",
      title: "Upload photo ID",
      subtitle: "Add a clear photo of your ID card, passport, or license.",
      done: !!idPhotoUri,
      icon: "card-outline" as const,
      onPress: () => {
        if (!canEditDocuments) {
          showAlert({
            title: "Verification locked",
            message:
              status === "approved"
                ? "Your verification is already approved."
                : "Your documents are under review right now.",
            type: "info",
          });
          return;
        }
        dispatch(clearVerificationError());
        dispatch(showVerificationPromptAgain());
        (navigation as any).navigate("VerificationIdScreen");
      },
    },
  ];

  const completedSteps = steps.filter((step) => step.done).length;
  const isReadyToSubmit =
    !!selfieUri &&
    !!idPhotoUri &&
    (status === "not_submitted" || status === "rejected");

  const statusConfig = useMemo(() => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          text: "Your verification is approved. You can continue using quick jobs with more trust.",
          accent: "#12B264",
          bg: "#ECFDF3",
          icon: "checkmark-circle" as const,
        };
      case "rejected":
        return {
          label: "Rejected",
          text: "Your previous submission was rejected. Please review the note below and upload clearer documents.",
          accent: "#E35D5D",
          bg: "#FFF1F1",
          icon: "close-circle" as const,
        };
      case "under_review":
        return {
          label: "Under Review",
          text: "Your documents are submitted and waiting for admin review. We will update the status here.",
          accent: Colors.primary,
          bg: "#EEF4FF",
          icon: "time" as const,
        };
      default:
        return {
          label: "Not Submitted",
          text: "Upload your selfie and one photo ID to start verification.",
          accent: Colors.primary,
          bg: "#EEF4FF",
          icon: "shield-checkmark-outline" as const,
        };
    }
  }, [status]);

  const handlePrimaryAction = async () => {
    if (status === "approved" || status === "under_review") {
      (navigation as any).navigate("VerificationSubmittedScreen");
      return;
    }

    if (!selfieUri) {
      (navigation as any).navigate("VerificationSelfieScreen");
      return;
    }

    if (!idPhotoUri) {
      (navigation as any).navigate("VerificationIdScreen");
      return;
    }

    try {
      await dispatch(
        submitVerificationDocuments({
          selfieUri,
          photoIdUri: idPhotoUri,
        })
      ).unwrap();

      (navigation as any).navigate("VerificationSubmittedScreen");
    } catch (submissionError: any) {
      showAlert({
        title: "Submission failed",
        message:
          submissionError || "We could not submit your verification right now.",
        type: "error",
      });
    }
  };

  const primaryLabel =
    status === "approved"
      ? "View Approved Status"
      : status === "under_review"
      ? "View Under Review"
      : isReadyToSubmit
      ? "Submit for Review"
      : !selfieUri
      ? "Upload Selfie"
      : "Upload Photo ID";

  const selfiePreview = resolveImageUri(selfieUri);
  const idPreview = resolveImageUri(idPhotoUri);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EAF2FF" />
      <LinearGradient
        colors={["#EAF2FF", "#FFFFFF", "#F6F9FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.screenBackground}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrow-left" size={24} color={Colors.black} />
          </TouchableOpacity>

          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="shield-account-outline"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.badgeText}>Verification</Text>
          </View>

          <View style={styles.heroWrap}>
            <View style={styles.iconBubble}>
              <Feather name="shield" size={30} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Verify your profile</Text>
            <Text style={styles.subtitle}>
              Upload your selfie and one photo ID. After submission, admin will
              review and update the final status here.
            </Text>
          </View>

          <View style={[styles.statusCard, { backgroundColor: statusConfig.bg }]}>
            <View style={styles.statusHeader}>
              <View
                style={[
                  styles.statusIconWrap,
                  { backgroundColor: `${statusConfig.accent}18` },
                ]}
              >
                <Ionicons
                  name={statusConfig.icon as any}
                  size={20}
                  color={statusConfig.accent}
                />
              </View>
              <View style={styles.statusTextWrap}>
                <Text style={[styles.statusLabel, { color: statusConfig.accent }]}>
                  {statusConfig.label}
                </Text>
                <Text style={styles.statusDescription}>{statusConfig.text}</Text>
              </View>
            </View>

            {submittedAt ? (
              <Text style={styles.metaText}>
                Submitted: {new Date(submittedAt).toLocaleString()}
              </Text>
            ) : null}
            {reviewedAt ? (
              <Text style={styles.metaText}>
                Reviewed: {new Date(reviewedAt).toLocaleString()}
              </Text>
            ) : null}
          </View>

          <LinearGradient
            colors={["#FFFFFF", "#F9FBFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Progress</Text>
              <Text style={styles.summaryCount}>{completedSteps}/2 complete</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(completedSteps / 2) * 100}%` },
                ]}
              />
            </View>
          </LinearGradient>

          <View style={styles.stepList}>
            {steps.map((step, index) => (
              <TouchableOpacity
                key={step.key}
                style={styles.stepCard}
                activeOpacity={0.85}
                onPress={step.onPress}
              >
                <View style={styles.stepIconWrap}>
                  <Ionicons name={step.icon} size={22} color={Colors.primary} />
                </View>
                <View style={styles.stepBody}>
                  <Text style={styles.stepOverline}>Step {index + 1}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                </View>
                <View style={[styles.stepStatus, step.done && styles.stepStatusDone]}>
                  <Ionicons
                    name={step.done ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={step.done ? "#12B264" : "#B6C1D8"}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {(selfiePreview || idPreview) && (
            <View style={styles.previewSection}>
              <Text style={styles.previewHeading}>Submitted details</Text>
              <View style={styles.previewGrid}>
                {selfiePreview ? (
                  <View style={styles.previewItem}>
                    <Image source={{ uri: selfiePreview }} style={styles.previewImage} />
                    <Text style={styles.previewLabel}>Selfie</Text>
                  </View>
                ) : null}
                {idPreview ? (
                  <View style={styles.previewItem}>
                    <Image source={{ uri: idPreview }} style={styles.previewImage} />
                    <Text style={styles.previewLabel}>Photo ID</Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}

          {reviewNotes ? (
            <View style={styles.reviewCard}>
              <Ionicons name="document-text-outline" size={18} color="#E35D5D" />
              <View style={styles.reviewTextWrap}>
                <Text style={styles.reviewTitle}>Admin note</Text>
                <Text style={styles.reviewText}>{reviewNotes}</Text>
              </View>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={18} color="#E35D5D" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.helpCard}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.helpText}>
              Verification prompt on home shows only once for new users. After
              submission, you can always check updates here or from Profile.
            </Text>
          </View>

          <Button
            label={loading ? "Please wait..." : primaryLabel}
            onPress={handlePrimaryAction}
            disabled={loading}
            style={styles.primaryButton}
          />
        </ScrollView>
      </LinearGradient>
      {alertModal}
    </SafeAreaView>
  );
};

export default VerificationDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  screenBackground: { flex: 1 },
  content: { padding: 20, paddingTop: 12, paddingBottom: 32 },
  backBtn: {
    position: "absolute",
    left: 16,
    top: 12,
    zIndex: 1,
  },
  badge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFFCC",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 44,
    marginBottom: 20,
    gap: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },
  heroWrap: {
    alignItems: "center",
    marginBottom: 18,
  },
  iconBubble: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.black,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  statusCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  statusIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTextWrap: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#516072",
  },
  metaText: {
    marginTop: 10,
    fontSize: 12,
    color: "#6D788A",
    fontWeight: "600",
  },
  summaryCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DCE7FF",
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
  summaryCount: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "700",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E6EDFF",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  stepList: {
    gap: 14,
    marginBottom: 18,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DCE7FF",
    shadowColor: "#10348B",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  stepIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  stepBody: {
    flex: 1,
  },
  stepOverline: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#697386",
  },
  stepStatus: {
    marginLeft: 10,
  },
  stepStatusDone: {
    transform: [{ scale: 1.05 }],
  },
  previewSection: {
    marginBottom: 18,
  },
  previewHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.black,
    marginBottom: 12,
  },
  previewGrid: {
    flexDirection: "row",
    gap: 12,
  },
  previewItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DCE7FF",
  },
  previewImage: {
    width: "100%",
    height: 140,
    borderRadius: 14,
    marginBottom: 10,
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#344256",
    textAlign: "center",
  },
  reviewCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#FFF5F5",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  reviewTextWrap: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#B44B4B",
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#7A5555",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF1F1",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#A14242",
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F4F7FF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 22,
  },
  helpText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#5C6475",
  },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
  },
});
