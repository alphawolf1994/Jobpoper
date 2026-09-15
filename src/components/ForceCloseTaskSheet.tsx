import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { forceCloseJob } from "../redux/slices/jobSlice";
import { Colors } from "../utils";
import { Job } from "../interface/interfaces";

interface Props {
  visible: boolean;
  job: Job | null;
  onClose: () => void;
  onClosed: () => void;
}

const ForceCloseTaskSheet: React.FC<Props> = ({ visible, job, onClose, onClosed }) => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (visible) {
      setReason("");
      setDone(false);
      setLocalError(null);
      setLoading(false);
      setKeyboardHeight(0);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const onShow = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const onHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [visible]);

  const handleSubmit = async () => {
    const trimmed = reason.trim();
    if (!job) return;
    if (!trimmed) {
      setLocalError("Please enter a reason for closing this task.");
      return;
    }
    if (trimmed.length < 10) {
      setLocalError("Please provide a more detailed reason (at least 10 characters).");
      return;
    }
    setLocalError(null);
    setLoading(true);
    try {
      await dispatch(forceCloseJob({ jobId: job._id, reason: trimmed })).unwrap();
      setDone(true);
      setTimeout(() => {
        onClosed();
        onClose();
      }, 1500);
    } catch (err: any) {
      setLocalError(err || "Failed to close this task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sheetBottomPad = Math.max(insets.bottom, Platform.OS === "ios" ? 28 : 16);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.sheet,
            {
              paddingBottom: sheetBottomPad,
              marginBottom: keyboardHeight,
            },
          ]}
        >
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Close Task</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {job && (
              <View style={styles.jobRef}>
                <Ionicons name="briefcase-outline" size={15} color={Colors.primary} />
                <Text style={styles.jobRefText} numberOfLines={1}>
                  {job.title}
                </Text>
              </View>
            )}

            <View style={styles.warningBox}>
              <Ionicons name="alert-circle" size={28} color="#DC2626" />
              <View style={{ flex: 1 }}>
                <Text style={styles.warningTitle}>Force Close Task</Text>
                <Text style={styles.warningText}>
                  This will permanently close the task. The assigned professional will be notified.
                </Text>
              </View>
            </View>

            <Text style={styles.label}>Reason for closing</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Why are you closing this task?"
              placeholderTextColor="#9CA3AF"
              value={reason}
              onChangeText={(t) => {
                setReason(t);
                setLocalError(null);
              }}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
              returnKeyType="default"
            />
            <Text style={styles.charCount}>{reason.length}/500</Text>

            {localError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="warning-outline" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{localError}</Text>
              </View>
            ) : null}

            {done ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                <Text style={styles.successText}>Task closed successfully! The worker has been notified.</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.submitBtn, loading && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <Ionicons name="close-circle-outline" size={18} color={Colors.white} />
                    <Text style={styles.submitBtnText}>Close Task</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ForceCloseTaskSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: "#991B1B",
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 10,
  },
  reasonInput: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.black,
    backgroundColor: "#F9FAFB",
    minHeight: 100,
    marginBottom: 4,
  },
  charCount: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "right",
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
    backgroundColor: "#DC2626",
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
});
