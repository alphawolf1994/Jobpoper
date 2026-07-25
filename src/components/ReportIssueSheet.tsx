import React, { useEffect, useState } from "react";
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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { createReport, resetReportSubmitted } from "../redux/slices/reportSlice";
import { Colors } from "../utils";
import { Job } from "../interface/interfaces";

interface Props {
  visible: boolean;
  job: Job | null;
  onClose: () => void;
  onSubmitted?: () => void;
}

const MAX_IMAGES = 5;

const ReportIssueSheet: React.FC<Props> = ({ visible, job, onClose, onSubmitted }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { submitLoading, submitError, submitted } = useSelector(
    (state: RootState) => state.report
  );

  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setDescription("");
      setImages([]);
      setLocalError(null);
      dispatch(resetReportSubmitted());
    }
  }, [visible, dispatch]);

  // Only fire success callbacks while THIS sheet is open — leftover Redux
  // `submitted` would otherwise re-trigger the alert on every Job Details mount.
  useEffect(() => {
    if (!visible || !submitted) return;

    const t = setTimeout(() => {
      dispatch(resetReportSubmitted());
      onSubmitted?.();
      onClose();
    }, 1500);

    return () => clearTimeout(t);
    // Intentionally omit onSubmitted/onClose — parent passes inline lambdas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, submitted, dispatch]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setLocalError("Please allow photo library access to attach images.");
      return;
    }
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setLocalError(`You can attach up to ${MAX_IMAGES} images.`);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uris = (result.assets?.map((a) => a.uri).filter(Boolean) as string[]) || [];
      setImages((prev) => [...prev, ...uris].slice(0, MAX_IMAGES));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setLocalError("Please allow camera access to take a photo.");
      return;
    }
    if (images.length >= MAX_IMAGES) {
      setLocalError(`You can attach up to ${MAX_IMAGES} images.`);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (uri) setImages((prev) => [...prev, uri].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!description.trim()) {
      setLocalError("Please explain in detail what you want to report.");
      return;
    }
    setLocalError(null);
    const assignedWorker =
      job && typeof job.assignedWorker === "object" ? job.assignedWorker?._id : undefined;
    try {
      await dispatch(
        createReport({
          jobId: job?._id,
          reportedUser: assignedWorker || null,
          description: description.trim(),
          images,
        })
      ).unwrap();
    } catch (err: any) {
      setLocalError(err || "Failed to submit report.");
    }
  };

  const displayError = localError || submitError;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.card}>
          {!submitted && (
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={Colors.gray} />
            </TouchableOpacity>
          )}

          {submitted ? (
            <View style={styles.successState}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text style={styles.successTitle}>Report submitted</Text>
              <Text style={styles.successSub}>
                Our team will review it shortly. You can track it in My Reports.
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.headerRow}>
                <Ionicons name="flag" size={20} color="#DC2626" />
                <Text style={styles.title}>Report an issue</Text>
              </View>
              {job ? (
                <Text style={styles.jobTitle} numberOfLines={1}>
                  {job.title}
                </Text>
              ) : null}

              <Text style={styles.label}>
                Please explain in detail what you want to report
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Describe the issue with this task or professional..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={2000}
              />
              <Text style={styles.charCount}>{description.length}/2000</Text>

              {/* Attachments */}
              <Text style={styles.label}>Attach images (optional)</Text>
              <View style={styles.imagesRow}>
                {images.map((uri, idx) => (
                  <View key={idx} style={styles.thumbWrap}>
                    <Image source={{ uri }} style={styles.thumb} />
                    <TouchableOpacity
                      style={styles.thumbRemove}
                      onPress={() => removeImage(idx)}
                      hitSlop={8}
                    >
                      <Ionicons name="close-circle" size={20} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < MAX_IMAGES && (
                  <>
                    <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
                      <Ionicons name="images-outline" size={22} color={Colors.primary} />
                      <Text style={styles.addImageText}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addImageBtn} onPress={takePhoto}>
                      <Ionicons name="camera-outline" size={22} color={Colors.primary} />
                      <Text style={styles.addImageText}>Camera</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {displayError ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="warning-outline" size={15} color="#DC2626" />
                  <Text style={styles.errorText}>{displayError}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.submitBtn, submitLoading && { opacity: 0.5 }]}
                onPress={handleSubmit}
                disabled={submitLoading}
                activeOpacity={0.8}
              >
                {submitLoading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.submitBtnText}>Submit report</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReportIssueSheet;

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
    maxWidth: 440,
    maxHeight: "88%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  closeBtn: { alignSelf: "flex-end", marginBottom: 4 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 18, fontWeight: "800", color: Colors.black },
  jobTitle: { fontSize: 13, color: Colors.gray, marginTop: 4, marginBottom: 8 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.black,
    textAlignVertical: "top",
    minHeight: 110,
    backgroundColor: "#F9FAFB",
  },
  charCount: { fontSize: 11, color: Colors.gray, textAlign: "right", marginTop: 4 },
  imagesRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  thumbWrap: { position: "relative" },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  thumbRemove: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  addImageBtn: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addImageText: { fontSize: 11, color: Colors.primary, fontWeight: "600", marginTop: 2 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
  },
  errorText: { flex: 1, fontSize: 12, color: "#DC2626" },
  submitBtn: {
    backgroundColor: "#DC2626",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },
  submitBtnText: { fontSize: 15, fontWeight: "700", color: Colors.white },
  successState: { alignItems: "center", paddingVertical: 16, gap: 10 },
  successTitle: { fontSize: 20, fontWeight: "800", color: Colors.black },
  successSub: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
