import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { submitReview, resetReviewSubmitted } from "../redux/slices/jobVerificationSlice";
import { getUserJobs } from "../redux/slices/jobSlice";
import { Colors } from "../utils";
import { IMAGE_BASE_URL } from "../api/baseURL";
import { Job } from "../interface/interfaces";

interface Props {
  visible: boolean;
  job: Job | null;
  /** _id of the worker being reviewed */
  workerId?: string;
  workerName?: string;
  workerImage?: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

const resolveImage = (uri?: string | null) => {
  if (!uri) return null;
  if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
  return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
};

const ReviewModal: React.FC<Props> = ({
  visible,
  job,
  workerName,
  workerImage,
  onClose,
  onSubmitted,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { submitReviewLoading, submitReviewError, reviewSubmitted } = useSelector(
    (state: RootState) => state.jobVerification
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setRating(0);
      setComment("");
      setLocalError(null);
      dispatch(resetReviewSubmitted());
    }
  }, [visible]);

  useEffect(() => {
    if (reviewSubmitted) {
      setTimeout(() => {
        dispatch(getUserJobs());
        onSubmitted?.();
        onClose();
      }, 1600);
    }
  }, [reviewSubmitted]);

  const handleSubmit = async () => {
    if (!job) return;
    if (rating === 0) {
      setLocalError("Please select a star rating.");
      return;
    }
    setLocalError(null);
    try {
      await dispatch(submitReview({ jobId: job._id, rating, comment: comment.trim() })).unwrap();
    } catch (err: any) {
      setLocalError(err || "Failed to submit review.");
    }
  };

  const displayError = localError || submitReviewError;
  const avatarUri = resolveImage(workerImage);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.card}>
          {/* Close button */}
          {!reviewSubmitted && (
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={Colors.gray} />
            </TouchableOpacity>
          )}

          {reviewSubmitted ? (
            /* ── Success state ── */
            <View style={styles.successState}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text style={styles.successTitle}>Review Submitted!</Text>
              <Text style={styles.successSub}>Thank you for your feedback.</Text>
            </View>
          ) : (
            <>
              {/* Worker info */}
              <View style={styles.workerRow}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Ionicons name="person" size={28} color={Colors.gray} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.workerName}>{workerName || "Worker"}</Text>
                  {job && (
                    <Text style={styles.jobTitle} numberOfLines={1}>
                      {job.title}
                    </Text>
                  )}
                </View>
              </View>

              {/* Star selector */}
              <Text style={styles.rateLabel}>How was the work?</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <TouchableOpacity key={s} onPress={() => setRating(s)} activeOpacity={0.7}>
                    <Ionicons
                      name={s <= rating ? "star" : "star-outline"}
                      size={40}
                      color={s <= rating ? "#F59E0B" : "#D1D5DB"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingLabel}>
                {rating === 0
                  ? "Tap a star to rate"
                  : ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </Text>

              {/* Comment */}
              <TextInput
                style={styles.commentInput}
                placeholder="Leave a comment (optional)..."
                placeholderTextColor="#9CA3AF"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
                maxLength={500}
              />
              <Text style={styles.charCount}>{comment.length}/500</Text>

              {/* Error */}
              {displayError ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="warning-outline" size={15} color="#DC2626" />
                  <Text style={styles.errorText}>{displayError}</Text>
                </View>
              ) : null}

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitBtn, (submitReviewLoading || rating === 0) && { opacity: 0.5 }]}
                onPress={handleSubmit}
                disabled={submitReviewLoading || rating === 0}
                activeOpacity={0.8}
              >
                {submitReviewLoading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.submitBtnText}>Submit Review</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.skipBtn}>
                <Text style={styles.skipBtnText}>Skip for now</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReviewModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  workerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  avatarPlaceholder: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  workerName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
  jobTitle: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  rateLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.black,
    textAlign: "center",
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 20,
    minHeight: 18,
  },
  commentInput: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.black,
    textAlignVertical: "top",
    minHeight: 90,
    backgroundColor: "#F9FAFB",
    marginBottom: 4,
  },
  charCount: {
    fontSize: 11,
    color: Colors.gray,
    textAlign: "right",
    marginBottom: 14,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#DC2626",
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 6,
  },
  skipBtnText: {
    fontSize: 13,
    color: Colors.gray,
  },
  successState: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.black,
  },
  successSub: {
    fontSize: 14,
    color: Colors.gray,
  },
});
