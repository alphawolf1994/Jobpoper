import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
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
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../utils";

const windowHeight = Dimensions.get("window").height;
const SHEET_HEIGHT = Math.min(Math.max(windowHeight * 0.5, 420), 520);

export interface PickupPreferencesBottomSheetHandle {
  open: () => void;
  close: () => void;
}

interface Props {
  /** Called whenever the sheet closes (navigate, cancel, backdrop). */
  onDismiss?: () => void;
}

/**
 * "Set Pickup Service Preferences" bottom sheet.
 *
 * Pure informational prompt — does NOT collect any input. Tapping the primary
 * action navigates the user to the existing `VehiclePreferenceScreen` where
 * pickup service preferences (vehicle type/number, price per km) are managed.
 */
const PickupPreferencesBottomSheet = forwardRef<
  PickupPreferencesBottomSheetHandle,
  Props
>(({ onDismiss }, ref) => {
  const navigation = useNavigation<any>();
  const sheetRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
  }));

  const handlePrimary = () => {
    sheetRef.current?.close();
    // Defer navigation a tick so the sheet's close animation doesn't race the
    // screen transition (RN Modals don't stack cleanly on iOS).
    setTimeout(() => {
      navigation.navigate("VehiclePreferenceScreen");
    }, 150);
  };

  const handleSecondary = () => {
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
            colors={["#EAF2FF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sheetCard}
          >
            <View style={styles.sheetIconWrap}>
              <Ionicons
                name="cash-outline"
                size={32}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.sheetTitle}>Set Pickup Service Preferences</Text>
            <Text style={styles.sheetSubtitle}>
              Before showing interest in pickup tasks, set your service
              preferences (price per km) so we can calculate your estimated
              earnings for each pickup.
            </Text>

            <View style={styles.sheetPoints}>
              <View style={styles.sheetPoint}>
                <Ionicons
                  name="speedometer-outline"
                  size={16}
                  color={Colors.primary}
                />
                <Text style={styles.sheetPointText}>
                  Set your price per km
                </Text>
              </View>
              <View style={styles.sheetPoint}>
                <Ionicons
                  name="calculator-outline"
                  size={16}
                  color={Colors.primary}
                />
                <Text style={styles.sheetPointText}>
                  See estimated price for every pickup task
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handlePrimary}
            >
              <Text style={styles.primaryButtonText}>Set Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.75}
              onPress={handleSecondary}
            >
              <Text style={styles.secondaryButtonText}>Maybe later</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </View>
    </RBSheet>
  );
});

export default PickupPreferencesBottomSheet;

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
    fontSize: 22,
    fontWeight: "800",
    color: "#121826",
    marginBottom: 6,
    textAlign: "center",
  },
  sheetSubtitle: {
    fontSize: 14,
    lineHeight: 20,
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
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
});
