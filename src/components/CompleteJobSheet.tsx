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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { completeJob } from "../redux/slices/jobVerificationSlice";
import { getMyInterestedJobs } from "../redux/slices/jobSlice";
import { Colors } from "../utils";
import { Job } from "../interface/interfaces";

interface Props {
  visible: boolean;
  job: Job | null;
  onClose: () => void;
  onCompleted: () => void;
}

const CompleteJobSheet: React.FC<Props> = ({ visible, job, onClose, onCompleted }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { completeJobLoading, completeJobError } = useSelector(
    (state: RootState) => state.jobVerification
  );

  const [pinInput, setPinInput] = useState("");
  const [done, setDone] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setPinInput("");
      setDone(false);
      setLocalError(null);
    }
  }, [visible]);

  const handleSubmit = async () => {
    const trimmed = pinInput.trim().toUpperCase();
    if (!job) return;
    if (trimmed.length !== 5) {
      setLocalError("Please enter the full 5-character Task PIN.");
      return;
    }
    setLocalError(null);
    try {
      await dispatch(completeJob({ jobId: job._id, jobPin: trimmed })).unwrap();
      dispatch(getMyInterestedJobs({ page: 1, limit: 10 }));
      setDone(true);
      setTimeout(() => {
        onCompleted();
        onClose();
      }, 1500);
    } catch (err: any) {
      setLocalError(err || "Incorrect PIN or task cannot be completed.");
    }
  };

  const displayError = localError || completeJobError;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Complete Task</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Job reference */}
            {job && (
              <View style={styles.jobRef}>
                <Ionicons name="briefcase-outline" size={15} color={Colors.primary} />
                <Text style={styles.jobRefText} numberOfLines={1}>
                  {job.title}
                </Text>
              </View>
            )}

            {/* Instructions */}
            <View style={styles.instructionBox}>
              <Ionicons name="key" size={28} color="#F59E0B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.instructionTitle}>Enter the Task PIN</Text>
                <Text style={styles.instructionText}>
                  Ask the task owner for the 5-character Task PIN to confirm you have completed the work.
                </Text>
              </View>
            </View>

            {/* PIN input */}
            <Text style={styles.label}>Task PIN</Text>
            <TextInput
              style={styles.pinInput}
              placeholder="A B C 1 2"
              placeholderTextColor="#9CA3AF"
              value={pinInput}
              onChangeText={(t) => {
                setPinInput(t.toUpperCase());
                setLocalError(null);
              }}
              autoCapitalize="characters"
              maxLength={5}
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {/* Error */}
            {displayError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="warning-outline" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            ) : null}

            {/* Success */}
            {done ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                <Text style={styles.successText}>Task completed! The owner has been notified.</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.submitBtn, completeJobLoading && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={completeJobLoading}
                activeOpacity={0.8}
              >
                {completeJobLoading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
                    <Text style={styles.submitBtnText}>Mark as Completed</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {/* Attempts warning */}
            <Text style={styles.attemptsNote}>
              You have a maximum of 5 PIN attempts per task.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CompleteJobSheet;

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
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
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
    paddingTop: 20,
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
  instructionBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 10,
  },
  pinInput: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 28,
    fontWeight: "800",
    color: Colors.black,
    letterSpacing: 8,
    textAlign: "center",
    backgroundColor: "#F9FAFB",
    marginBottom: 16,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "500",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    marginBottom: 12,
  },
  submitBtnText: {
    fontSize: 16,
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
    marginBottom: 12,
  },
  successText: {
    fontSize: 14,
    color: "#065F46",
    fontWeight: "600",
    flex: 1,
  },
  attemptsNote: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "center",
    marginTop: 4,
  },
});
