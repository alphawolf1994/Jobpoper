import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Pressable,
  InteractionManager,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { Colors, isFreshLocalVerificationUri } from "../../utils";
import { RootState } from "../../redux/store";
import { setIdPhotoUri, showVerificationPromptAgain } from "../../redux/slices/verificationSlice";
import { useAlertModal } from "../../hooks/useAlertModal";

const isFreshLocalUri = isFreshLocalVerificationUri;

const PICKER_OPEN_DELAY_MS = Platform.OS === "ios" ? 420 : 300;

const VerificationIdScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { idPhotoUri, status } = useSelector((state: RootState) => state.verification);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  const initialPreview =
    status === "rejected" && !isFreshLocalUri(idPhotoUri) ? null : idPhotoUri;
  const [previewUri, setPreviewUri] = useState<string | null>(initialPreview ?? null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "rejected" && !isFreshLocalUri(idPhotoUri)) {
      setPreviewUri(null);
    }
  }, [status, idPhotoUri]);

  const isRejected = status === "rejected";

  const openSourceSheet = () => setPickerVisible(true);
  const closeSourceSheet = () => setPickerVisible(false);

  const handleFromCamera = () => {
    closeSourceSheet();
    InteractionManager.runAfterInteractions(() => {
      setTimeout(async () => {
        try {
          setBusy(true);
          const { status: camStatus } = await ImagePicker.requestCameraPermissionsAsync();
          if (camStatus !== "granted") {
            showAlert({
              title: "Camera permission needed",
              message: "Please allow camera access in settings to take a photo of your ID.",
              type: "warning",
            });
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.85,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            setPreviewUri(result.assets[0].uri);
          }
        } catch (e: any) {
          showAlert({
            title: "Camera error",
            message: e?.message || "Could not open the camera. Please try again.",
            type: "error",
          });
        } finally {
          setBusy(false);
        }
      }, PICKER_OPEN_DELAY_MS);
    });
  };

  const handleFromGallery = () => {
    closeSourceSheet();
    InteractionManager.runAfterInteractions(() => {
      setTimeout(async () => {
        try {
          setBusy(true);
          const { status: libStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (libStatus !== "granted") {
            showAlert({
              title: "Permission needed",
              message: "Please allow gallery access to choose your ID photo.",
              type: "warning",
            });
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.85,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            setPreviewUri(result.assets[0].uri);
          }
        } catch (e: any) {
          showAlert({
            title: "Gallery error",
            message: e?.message || "Could not open the gallery. Please try again.",
            type: "error",
          });
        } finally {
          setBusy(false);
        }
      }, PICKER_OPEN_DELAY_MS);
    });
  };

  const handleSave = () => {
    if (!previewUri) {
      openSourceSheet();
      return;
    }
    if (isRejected && !isFreshLocalUri(previewUri)) {
      showAlert({
        title: "Please choose a new ID photo",
        message:
          "Your previous submission was rejected. Tap below to take or choose a new ID photo before continuing.",
        type: "warning",
      });
      openSourceSheet();
      return;
    }

    dispatch(setIdPhotoUri(previewUri));
    dispatch(showVerificationPromptAgain());
    (navigation as any).navigate("VerificationDetailsScreen");
  };

  const buttonLabel = !previewUri
    ? "Add ID Photo"
    : isRejected && !isFreshLocalUri(previewUri)
    ? "Choose New ID Photo"
    : "Save ID Photo";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EAF2FF" />
      <LinearGradient
        colors={["#EAF2FF", "#FFFFFF", "#F6F9FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.screenBackground}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if ((navigation as any).canGoBack?.()) {
                navigation.goBack();
              } else {
                (navigation as any).navigate("VerificationDetailsScreen");
              }
            }}
          >
            <AntDesign name="arrow-left" size={24} color={Colors.black} />
          </TouchableOpacity>

          <View style={styles.badge}>
            <MaterialCommunityIcons name="card-account-details-outline" size={18} color={Colors.primary} />
            <Text style={styles.badgeText}>Upload photo ID</Text>
          </View>

          <Text style={styles.title}>Add your photo ID</Text>
          <Text style={styles.subtitle}>
            Upload a clear image of your ID card, passport, or driving license. Make sure all key details are visible.
          </Text>

          {isRejected ? (
            <View style={styles.rejectedBanner}>
              <Ionicons name="alert-circle" size={20} color="#B44B4B" />
              <Text style={styles.rejectedText}>
                Your previous ID photo was rejected. Please take or upload a new clearer ID photo.
              </Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.previewCard} activeOpacity={0.9} onPress={openSourceSheet}>
            {previewUri ? (
              <>
                <Image source={{ uri: previewUri }} style={styles.previewImage} />
                <View style={styles.replaceOverlay}>
                  <Ionicons name="camera-reverse-outline" size={18} color={Colors.white} />
                  <Text style={styles.replaceOverlayText}>Tap to change</Text>
                </View>
              </>
            ) : (
              <LinearGradient
                colors={["#F7FAFF", "#EDF4FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.placeholder}
              >
                <View style={styles.idFrame}>
                  <Ionicons name="card-outline" size={54} color={Colors.primary} />
                </View>
                <Text style={styles.placeholderTitle}>No ID photo added yet</Text>
                <Text style={styles.placeholderSubtitle}>Tap to take a photo or choose from gallery</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>

          <View style={styles.tipCard}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.tipText}>Avoid glare, crop tightly, and keep the document fully inside the frame.</Text>
          </View>

          <Button
            label={busy ? "Please wait..." : buttonLabel}
            onPress={handleSave}
            disabled={busy}
            style={[
              styles.primaryButton,
              busy && { backgroundColor: Colors.gray },
            ]}
          />

          {previewUri ? (
            <TouchableOpacity style={styles.secondaryAction} onPress={openSourceSheet} activeOpacity={0.8}>
              <Text style={styles.secondaryActionText}>Choose a different ID photo</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </LinearGradient>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSourceSheet}
      >
        <Pressable style={styles.sheetBackdrop} onPress={closeSourceSheet}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add ID photo</Text>
            <Text style={styles.sheetSubtitle}>Choose how you'd like to add your photo</Text>

            <TouchableOpacity style={styles.sheetOption} onPress={handleFromCamera} activeOpacity={0.85}>
              <View style={styles.sheetOptionIcon}>
                <Ionicons name="camera-outline" size={22} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetOptionTitle}>Take Photo</Text>
                <Text style={styles.sheetOptionSubtitle}>Capture a clear photo of your ID</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A8B0C2" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handleFromGallery} activeOpacity={0.85}>
              <View style={styles.sheetOptionIcon}>
                <Ionicons name="image-outline" size={22} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.sheetOptionSubtitle}>Pick a photo you've already taken</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A8B0C2" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetCancel} onPress={closeSourceSheet} activeOpacity={0.7}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {alertModal}
    </SafeAreaView>
  );
};

export default VerificationIdScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  screenBackground: { flex: 1 },
  content: { padding: 20, paddingTop: 12, paddingBottom: 30 },
  backBtn: { position: "absolute", left: 16, top: 12, zIndex: 1 },
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
  badgeText: { fontSize: 13, fontWeight: "700", color: Colors.primary },
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
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 18,
  },
  rejectedBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FFF1F1",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#FFD8D8",
  },
  rejectedText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#A14242",
    fontWeight: "600",
  },
  previewCard: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DCE7FF",
    backgroundColor: "#FFFFFF",
    minHeight: 320,
    marginBottom: 16,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
  },
  replaceOverlay: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  replaceOverlayText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  placeholder: {
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  idFrame: {
    width: 220,
    height: 140,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#C9D8FF",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    backgroundColor: "#FFFFFFAA",
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.black,
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#697386",
    textAlign: "center",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F4F7FF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
  },
  tipText: {
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
  secondaryAction: {
    marginTop: 14,
    alignItems: "center",
  },
  secondaryActionText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  // Bottom sheet
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D8DEEC",
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.black,
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#697386",
    marginBottom: 16,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#F7FAFF",
    borderWidth: 1,
    borderColor: "#E2EAFF",
    marginBottom: 10,
  },
  sheetOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sheetOptionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.black,
  },
  sheetOptionSubtitle: {
    fontSize: 12,
    color: "#697386",
    marginTop: 2,
  },
  sheetCancel: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 14,
  },
  sheetCancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#697386",
  },
});
