import React, { useRef, useImperativeHandle, forwardRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { dismissVerificationPrompt } from "../redux/slices/verificationSlice";
import { useNavigation } from "@react-navigation/native";

const windowHeight = Dimensions.get("window").height;

/** Default prompt — same ballpark as before */
const SHEET_HEIGHT_DEFAULT = Math.min(
  Math.max(windowHeight * 0.52, 410),
  500
);

/** Under review / rejected copy is longer — use more of the screen so actions stay visible */
const SHEET_HEIGHT_TALL = Math.min(Math.max(windowHeight * 0.72, 540), windowHeight * 0.9);

export interface VerificationBottomSheetHandle {
  open: () => void;
  close: () => void;
}

type SheetVariant = "not_submitted" | "under_review" | "rejected";

interface Props {
  /** Called when the sheet closes (either via secondary action or backdrop tap) */
  onDismiss?: () => void;
  /** If true, dispatches dismissVerificationPrompt on close (used on HomeScreen) */
  dismissOnClose?: boolean;
}

const VerificationBottomSheet = forwardRef<VerificationBottomSheetHandle, Props>(
  ({ onDismiss, dismissOnClose = false }, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const sheetRef = useRef<any>(null);
    const verificationStatus = useSelector(
      (state: RootState) => state.verification.status
    );

    const variant: SheetVariant =
      verificationStatus === "under_review"
        ? "under_review"
        : verificationStatus === "rejected"
        ? "rejected"
        : "not_submitted";

    const sheetHeight =
      variant === "under_review" || variant === "rejected"
        ? SHEET_HEIGHT_TALL
        : SHEET_HEIGHT_DEFAULT;

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }));

    const goToVerificationDetails = () => {
      if (variant === "not_submitted") {
        dispatch(dismissVerificationPrompt());
      }
      sheetRef.current?.close();
      setTimeout(() => {
        navigation.navigate("VerificationDetailsScreen");
      }, 150);
    };

    const handleSecondary = () => {
      sheetRef.current?.close();
    };

    return (
      <RBSheet
        ref={sheetRef}
        height={sheetHeight}
        openDuration={280}
        closeOnPressMask={true}
        closeOnPressBack={true}
        draggable={true}
        onClose={() => {
          if (dismissOnClose && variant === "not_submitted") {
            dispatch(dismissVerificationPrompt());
          }
          onDismiss?.();
        }}
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(8, 20, 52, 0.34)",
          },
          container: {
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            backgroundColor: "#F8FAFF",
          },
          draggableIcon: {
            backgroundColor: "#C7D4F6",
            width: 62,
          },
        }}
      >
        <View style={styles.sheetContent}>
          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <LinearGradient
              colors={
                variant === "under_review"
                  ? ["#EEF4FF", "#FFFFFF"]
                  : variant === "rejected"
                  ? ["#FFF1F1", "#FFFFFF"]
                  : ["#EAF2FF", "#FFFFFF"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.sheetCard,
                variant === "rejected" && { borderColor: "#FFD8D8" },
              ]}
            >
            {variant === "under_review" ? (
              <>
                <View
                  style={[
                    styles.sheetIconWrap,
                    { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C7D4F6" },
                  ]}
                >
                  <Ionicons name="time-outline" size={34} color={Colors.primary} />
                </View>
                <Text style={styles.sheetTitle}>Verification in progress</Text>
                <Text style={styles.sheetSubtitle}>
                  You have already submitted your documents. Our team is reviewing them. You will be able to post tasks
                  and use full features once your profile is verified.
                </Text>
                <View style={styles.sheetPoints}>
                  <View style={styles.sheetPoint}>
                    <Ionicons name="hourglass-outline" size={16} color={Colors.primary} />
                    <Text style={styles.sheetPointText}>Review usually completes within a short time</Text>
                  </View>
                  <View style={styles.sheetPoint}>
                    <Ionicons name="notifications-outline" size={16} color={Colors.primary} />
                    <Text style={styles.sheetPointText}>We will update your status here when there is news</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.verifyNowButton}
                  activeOpacity={0.85}
                  onPress={goToVerificationDetails}
                >
                  <Text style={styles.verifyNowButtonText}>View verification status</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sheetLaterButton} activeOpacity={0.75} onPress={handleSecondary}>
                  <Text style={styles.sheetLaterText}>Got it</Text>
                </TouchableOpacity>
              </>
            ) : variant === "rejected" ? (
              <>
                <View
                  style={[
                    styles.sheetIconWrap,
                    { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#FFD8D8" },
                  ]}
                >
                  <Ionicons name="alert-circle-outline" size={34} color="#E35D5D" />
                </View>
                <Text style={styles.sheetTitle}>Verification needs an update</Text>
                <Text style={styles.sheetSubtitle}>
                  Your last submission was not accepted. Open verification to read the admin note and upload clearer
                  documents, then submit again.
                </Text>
                <View style={styles.sheetPoints}>
                  <View style={[styles.sheetPoint, { backgroundColor: "#FFFFFFB8" }]}>
                    <Ionicons name="camera-outline" size={16} color="#E35D5D" />
                    <Text style={styles.sheetPointText}>Replace selfie and ID with new photos</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.verifyNowButton, { backgroundColor: "#E35D5D" }]}
                  activeOpacity={0.85}
                  onPress={goToVerificationDetails}
                >
                  <Text style={styles.verifyNowButtonText}>Review & resubmit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sheetLaterButton} activeOpacity={0.75} onPress={handleSecondary}>
                  <Text style={styles.sheetLaterText}>Maybe later</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.sheetIconWrap}>
                  <Ionicons name="shield-checkmark-outline" size={34} color={Colors.primary} />
                </View>
                <Text style={styles.sheetTitle}>Verify yourself</Text>
                <Text style={styles.sheetSubtitle}>
                  Verify yourself to take up the quick tasks and start earning.
                </Text>
                <View style={styles.sheetPoints}>
                  <View style={styles.sheetPoint}>
                    <Ionicons name="flash-outline" size={16} color={Colors.primary} />
                    <Text style={styles.sheetPointText}>Unlock quick tasks faster</Text>
                  </View>
                  <View style={styles.sheetPoint}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={Colors.primary} />
                    <Text style={styles.sheetPointText}>Build more trust with clients</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.verifyNowButton}
                  activeOpacity={0.85}
                  onPress={goToVerificationDetails}
                >
                  <Text style={styles.verifyNowButtonText}>Verify Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sheetLaterButton} activeOpacity={0.75} onPress={handleSecondary}>
                  <Text style={styles.sheetLaterText}>Maybe later</Text>
                </TouchableOpacity>
              </>
            )}
            </LinearGradient>
          </ScrollView>
        </View>
      </RBSheet>
    );
  }
);

export default VerificationBottomSheet;

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
    minHeight: 0,
  },
  sheetScroll: {
    flex: 1,
  },
  sheetScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sheetCard: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#DCE7FF",
  },
  sheetIconWrap: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#121826",
    marginBottom: 6,
    textAlign: "center",
  },
  sheetSubtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: "#5E6778",
    marginBottom: 16,
    textAlign: "center",
  },
  sheetPoints: {
    gap: 10,
    marginBottom: 18,
  },
  sheetPoint: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFFB8",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  sheetPointText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "600",
    flex: 1,
  },
  verifyNowButton: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyNowButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  sheetLaterButton: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  sheetLaterText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
});
