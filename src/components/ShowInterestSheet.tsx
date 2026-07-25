import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Colors } from "../utils";
import { Job } from "../interface/interfaces";
import { showInterestOnJobApi } from "../api/jobApis";
import { RootState } from "../redux/store";

type PriceOption = "accept_offered" | "custom" | "use_rate";

export interface ShowInterestSheetHandle {
  open: () => void;
  close: () => void;
}

interface Props {
  job: Job | null;
  onSuccess: (message?: string, proposedPrice?: number | null) => void;
}

const windowHeight = Dimensions.get("window").height;
const SHEET_HEIGHT = Math.min(Math.max(windowHeight * 0.82, 540), windowHeight * 0.94);

const getCurrencySymbol = (cost?: string): string => {
  if (!cost) return "";
  // Only show a symbol if the client's budget already includes one (e.g. "₹500", "$50")
  const match = cost.trim().match(/^[^\d.,\s]+/);
  return match ? match[0] : "";
};

const ShowInterestSheet = forwardRef<ShowInterestSheetHandle, Props>(
  ({ job, onSuccess }, ref) => {
    const sheetRef = useRef<any>(null);
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);
    const [priceOption, setPriceOption] = useState<PriceOption>("accept_offered");
    const [customPrice, setCustomPrice] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }));

    const resetForm = () => {
      setPriceOption("accept_offered");
      setCustomPrice("");
      setSubmitting(false);
      setError(null);
    };

    useEffect(() => {
      resetForm();
    }, [job?._id]);

    const symbol = getCurrencySymbol(job?.cost);
    const offeredPrice = job?.cost?.trim() || "—";

    const isPickup = job?.jobType === "Pickup";
    const distanceKm =
      typeof job?.distanceKm === "number" && Number.isFinite(job.distanceKm)
        ? job.distanceKm
        : null;
    const pricePerKm = user?.vehiclePreference?.pricePerKm;
    const hasPickupRate =
      !!user?.vehiclePreference?.isSet &&
      typeof pricePerKm === "number" &&
      Number.isFinite(pricePerKm) &&
      pricePerKm >= 0;

    const rateEstimate = useMemo(() => {
      if (!isPickup || !hasPickupRate || distanceKm === null) return null;
      return Math.round(pricePerKm! * distanceKm * 100) / 100;
    }, [isPickup, hasPickupRate, pricePerKm, distanceKm]);

    const showUseRateOption = isPickup && rateEstimate !== null && rateEstimate > 0;

    const handleSubmit = async () => {
      if (!job) return;

      let proposedPrice: number | null = null;
      if (priceOption === "custom") {
        const parsed = Number(String(customPrice).replace(/,/g, "").trim());
        if (!Number.isFinite(parsed) || parsed <= 0) {
          setError("Enter a valid amount greater than zero.");
          return;
        }
        proposedPrice = Math.round(parsed * 100) / 100;
      } else if (priceOption === "use_rate") {
        if (rateEstimate === null || rateEstimate <= 0) {
          setError("Could not calculate your rate for this pickup. Check your preferences.");
          return;
        }
        proposedPrice = rateEstimate;
      }
      // accept_offered → proposedPrice stays null (accepted client's budget)

      setError(null);
      setSubmitting(true);
      try {
        const res = await showInterestOnJobApi(job._id, proposedPrice, priceOption);
        onSuccess(res?.message || "Interest submitted successfully", proposedPrice);
        sheetRef.current?.close();
      } catch (e: any) {
        setError(e?.message || "Failed to submit interest. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };

    const formatAmount = (amount: number) =>
      symbol ? `${symbol}${amount}` : String(amount);

    return (
      <RBSheet
        ref={sheetRef}
        height={SHEET_HEIGHT}
        openDuration={280}
        closeOnPressMask={true}
        closeOnPressBack={true}
        draggable={true}
        onOpen={resetForm}
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
            backgroundColor: Colors.white,
          },
          draggableIcon: {
            backgroundColor: "#C7D4F6",
            width: 62,
          },
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Express Interest</Text>
            <TouchableOpacity onPress={() => sheetRef.current?.close()} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              styles.body,
              { paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 28 : 16) },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.thanksBox}>
              <View style={styles.thanksIcon}>
                <Ionicons name="hand-left-outline" size={22} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.thanksTitle}>Thanks for your interest</Text>
                <Text style={styles.thanksText}>
                  Confirm how you'd like to price this task, then submit your interest so the
                  task owner can review your profile.
                </Text>
              </View>
            </View>

            {job && (
              <View style={styles.jobRef}>
                <Ionicons name="briefcase-outline" size={15} color={Colors.primary} />
                <Text style={styles.jobRefText} numberOfLines={1}>
                  {job.title}
                </Text>
              </View>
            )}

            <Text style={styles.sectionLabel}>Your price offer</Text>

            <TouchableOpacity
              style={[
                styles.optionCard,
                priceOption === "accept_offered" && styles.optionCardSelected,
              ]}
              onPress={() => {
                setPriceOption("accept_offered");
                setError(null);
              }}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.radioOuter,
                  priceOption === "accept_offered" && styles.radioOuterSelected,
                ]}
              >
                {priceOption === "accept_offered" && <View style={styles.radioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Accept offered price</Text>
                <Text style={styles.optionSubtitle}>
                  Proceed with the client's budget of{" "}
                  <Text style={styles.optionHighlight}>{offeredPrice}</Text>
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                priceOption === "custom" && styles.optionCardSelected,
              ]}
              onPress={() => {
                setPriceOption("custom");
                setError(null);
              }}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.radioOuter,
                  priceOption === "custom" && styles.radioOuterSelected,
                ]}
              >
                {priceOption === "custom" && <View style={styles.radioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Propose your own price</Text>
                <Text style={styles.optionSubtitle}>
                  Suggest a fair amount based on the scope of work
                </Text>
              </View>
            </TouchableOpacity>

            {priceOption === "custom" && (
              <View style={styles.customPriceWrap}>
                <Text style={styles.customPriceLabel}>Your proposed amount</Text>
                <View style={styles.priceInputRow}>
                  {symbol ? <Text style={styles.currencyPrefix}>{symbol}</Text> : null}
                  <TextInput
                    style={styles.priceInput}
                    value={customPrice}
                    onChangeText={(t) => {
                      setCustomPrice(t.replace(/[^0-9.]/g, ""));
                      setError(null);
                    }}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </View>
              </View>
            )}

            {showUseRateOption && (
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  priceOption === "use_rate" && styles.optionCardSelected,
                ]}
                onPress={() => {
                  setPriceOption("use_rate");
                  setError(null);
                }}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.radioOuter,
                    priceOption === "use_rate" && styles.radioOuterSelected,
                  ]}
                >
                  {priceOption === "use_rate" && <View style={styles.radioInner} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>Use my pickup rate</Text>
                  <Text style={styles.optionSubtitle}>
                    Based on your preferences:{" "}
                    <Text style={styles.optionHighlight}>
                      {formatAmount(rateEstimate!)}
                    </Text>
                    {"\n"}
                    ({distanceKm} km × {symbol || ""}
                    {pricePerKm}/km)
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="warning-outline" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.65 }]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
                  <Text style={styles.submitBtnText}>Submit Interest</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </RBSheet>
    );
  }
);

export default ShowInterestSheet;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
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
  },
  thanksBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  thanksIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  thanksTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 4,
  },
  thanksText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#4B5563",
  },
  jobRef: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  jobRefText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#EFF6FF",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 3,
  },
  optionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
  optionHighlight: {
    fontWeight: "700",
    color: Colors.primary,
  },
  customPriceWrap: {
    marginTop: 4,
    marginBottom: 8,
  },
  customPriceLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 8,
  },
  priceInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
    paddingVertical: 12,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    marginBottom: 8,
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
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
  },
});
