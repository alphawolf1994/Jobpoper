import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { dismissVerificationPrompt } from "../redux/slices/verificationSlice";
import { useNavigation } from "@react-navigation/native";

const SHEET_HEIGHT = Math.min(
  Math.max(Dimensions.get("window").height * 0.52, 410),
  500
);

export interface VerificationBottomSheetHandle {
  open: () => void;
  close: () => void;
}

interface Props {
  /** Called when the sheet closes (either via "Maybe later" or backdrop tap) */
  onDismiss?: () => void;
  /** If true, dispatches dismissVerificationPrompt on close (used on HomeScreen) */
  dismissOnClose?: boolean;
}

const VerificationBottomSheet = forwardRef<VerificationBottomSheetHandle, Props>(
  ({ onDismiss, dismissOnClose = false }, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const sheetRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }));

    const handleVerifyNow = () => {
      dispatch(dismissVerificationPrompt());
      sheetRef.current?.close();
      setTimeout(() => {
        navigation.navigate("VerificationDetailsScreen");
      }, 150);
    };

    const handleLater = () => {
      sheetRef.current?.close();
    };

    return (
      <RBSheet
        ref={sheetRef}
        height={SHEET_HEIGHT}
        openDuration={280}
        closeOnPressMask={true}
        closeOnPressBack={true}
        draggable={true}
        onClose={() => {
          if (dismissOnClose) {
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
          <LinearGradient
            colors={["#EAF2FF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sheetCard}
          >
            <View style={styles.sheetIconWrap}>
              <Ionicons
                name="shield-checkmark-outline"
                size={34}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.sheetTitle}>Verify yourself</Text>
            <Text style={styles.sheetSubtitle}>
              Verify yourself to take up the quick jobs and start earning.
            </Text>

            <View style={styles.sheetPoints}>
              <View style={styles.sheetPoint}>
                <Ionicons name="flash-outline" size={16} color={Colors.primary} />
                <Text style={styles.sheetPointText}>Unlock quick jobs faster</Text>
              </View>
              <View style={styles.sheetPoint}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={Colors.primary}
                />
                <Text style={styles.sheetPointText}>
                  Build more trust with clients
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.verifyNowButton}
              activeOpacity={0.85}
              onPress={handleVerifyNow}
            >
              <Text style={styles.verifyNowButtonText}>Verify Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetLaterButton}
              activeOpacity={0.75}
              onPress={handleLater}
            >
              <Text style={styles.sheetLaterText}>Maybe later</Text>
            </TouchableOpacity>
          </LinearGradient>
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
    paddingBottom: 24,
  },
  sheetCard: {
    flex: 1,
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
