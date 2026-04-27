import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Colors } from "../../utils";
import Header from "../../components/Header";
import MyTextInput from "../../components/MyTextInput";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import ErrorText from "../../components/ErrorText";
import { useAlertModal } from "../../hooks/useAlertModal";
import { RootState, AppDispatch } from "../../redux/store";
import {
    getVehiclePreference,
    updateVehiclePreference,
} from "../../redux/slices/authSlice";
import { VehicleType } from "../../interface/interfaces";

interface VehicleOption {
    key: VehicleType;
    label: string;
    description: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
    {
        key: "2_wheeler",
        label: "2 Wheeler",
        description: "Bike / Scooter",
        icon: "motorbike",
    },
    {
        key: "3_wheeler",
        label: "3 Wheeler",
        description: "Auto / Rickshaw",
        icon: "rickshaw",
    },
    {
        key: "4_wheeler",
        label: "4 Wheeler",
        description: "Car / Mini Truck",
        icon: "car",
    },
];

interface FormErrors {
    vehicleType?: string;
    vehicleNumber?: string;
    pricePerKm?: string;
}

const VehiclePreferenceScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { showAlert, AlertComponent: alertModal } = useAlertModal();

    const existingPref = user?.vehiclePreference;

    // Default 2 wheeler when nothing previously stored
    const [vehicleType, setVehicleType] = useState<VehicleType>(
        (existingPref?.vehicleType as VehicleType) || "2_wheeler"
    );
    const [vehicleNumber, setVehicleNumber] = useState<string>(
        existingPref?.vehicleNumber || ""
    );
    const [pricePerKm, setPricePerKm] = useState<string>(
        existingPref?.pricePerKm !== undefined && existingPref?.pricePerKm !== null
            ? String(existingPref.pricePerKm)
            : ""
    );
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [initialFetching, setInitialFetching] = useState(false);

    const isEditMode = !!existingPref?.isSet;

    // Fetch latest preference on mount (in case redux is stale)
    useEffect(() => {
        let isMounted = true;
        const fetchPreference = async () => {
            try {
                setInitialFetching(true);
                const result: any = await dispatch(getVehiclePreference()).unwrap();
                if (isMounted && result?.data?.vehiclePreference) {
                    const pref = result.data.vehiclePreference;
                    if (pref.vehicleType) setVehicleType(pref.vehicleType);
                    if (pref.vehicleNumber) setVehicleNumber(pref.vehicleNumber);
                    if (pref.pricePerKm !== undefined && pref.pricePerKm !== null) {
                        setPricePerKm(String(pref.pricePerKm));
                    }
                }
            } catch (e) {
                // silent fail – screen still works for first time setup
            } finally {
                if (isMounted) setInitialFetching(false);
            }
        };
        fetchPreference();
        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    const headerSubtitle = useMemo(
        () =>
            isEditMode
                ? "Update your pickup/delivery service details"
                : "Set up your pickup/delivery service details",
        [isEditMode]
    );

    const validate = (): boolean => {
        const next: FormErrors = {};

        if (!vehicleType) {
            next.vehicleType = "Please select a vehicle type";
        }

        const trimmedNumber = vehicleNumber.trim();
        if (!trimmedNumber) {
            next.vehicleNumber = "Vehicle number is required";
        } else if (trimmedNumber.length < 4 || trimmedNumber.length > 20) {
            next.vehicleNumber = "Enter a valid vehicle number (4-20 chars)";
        }

        const priceValue = pricePerKm.trim();
        if (!priceValue) {
            next.pricePerKm = "Price per km is required";
        } else {
            const parsed = Number(priceValue);
            if (Number.isNaN(parsed)) {
                next.pricePerKm = "Enter a valid number";
            } else if (parsed < 0) {
                next.pricePerKm = "Price cannot be negative";
            } else if (parsed > 10000) {
                next.pricePerKm = "Price seems too high";
            }
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        let resultStatus: "success" | "error" = "error";
        let resultMessage = "";

        try {
            const result: any = await dispatch(
                updateVehiclePreference({
                    vehicleType,
                    vehicleNumber: vehicleNumber.trim().toUpperCase(),
                    pricePerKm: Number(pricePerKm.trim()),
                })
            ).unwrap();

            if (result?.status === "success") {
                resultStatus = "success";
                resultMessage = isEditMode
                    ? "Your service preference has been updated successfully."
                    : "Your service preference has been saved successfully.";
            } else {
                resultMessage = result?.message || "Failed to save vehicle preference.";
            }
        } catch (error: any) {
            resultStatus = "error";
            resultMessage =
                typeof error === "string"
                    ? error
                    : error?.message || "Failed to save vehicle preference. Please try again.";
        }

        // Hide loader FIRST so the alert modal can render on top.
        // Two RN Modals can't be visible simultaneously on iOS, so we wait one tick
        // before showing the alert.
        setSubmitting(false);
        setTimeout(() => {
            if (resultStatus === "success") {
                showAlert({
                    title: "Success",
                    message: resultMessage,
                    type: "success",
                    buttons: [
                        {
                            label: "OK",
                            onPress: () => {
                                navigation.goBack();
                            },
                        },
                    ],
                });
            } else {
                showAlert({
                    title: "Error",
                    message: resultMessage,
                    type: "error",
                });
            }
        }, 350);
    };

    // Don't include redux `loading` in isBusy — it can stay true if other thunks
    // are running and would block the alert modal. We only show the loader for
    // operations triggered from this screen.
    const isBusy = submitting || initialFetching;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <SafeAreaView edges={["top", "bottom", "left", "right"]} style={{ flex: 1 }}>
                <Header />

                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.headerTitleRow}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color={Colors.black} />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Service Preference</Text>
                            <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <View style={styles.infoIconWrapper}>
                            <Ionicons name="information-circle" size={22} color={Colors.primary} />
                        </View>
                        <Text style={styles.infoBannerText}>
                            Provide your vehicle details so customers can match you for nearby pickup
                            and delivery jobs.
                        </Text>
                    </View>

                    {/* Vehicle Type */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionLabel}>Type of Vehicle</Text>
                        <Text style={styles.sectionHint}>Select the vehicle you will use</Text>

                        <View style={styles.optionsContainer}>
                            {VEHICLE_OPTIONS.map((option) => {
                                const selected = vehicleType === option.key;
                                return (
                                    <TouchableOpacity
                                        key={option.key}
                                        activeOpacity={0.85}
                                        onPress={() => {
                                            setVehicleType(option.key);
                                            if (errors.vehicleType) {
                                                setErrors((prev) => ({ ...prev, vehicleType: undefined }));
                                            }
                                        }}
                                        style={[
                                            styles.optionCard,
                                            selected && styles.optionCardSelected,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.optionIconWrapper,
                                                selected && styles.optionIconWrapperSelected,
                                            ]}
                                        >
                                            <MaterialCommunityIcons
                                                name={option.icon}
                                                size={28}
                                                color={selected ? Colors.white : Colors.primary}
                                            />
                                        </View>

                                        <View style={styles.optionTextWrapper}>
                                            <Text
                                                style={[
                                                    styles.optionLabel,
                                                    selected && styles.optionLabelSelected,
                                                ]}
                                            >
                                                {option.label}
                                            </Text>
                                            <Text style={styles.optionDescription}>
                                                {option.description}
                                            </Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.radioOuter,
                                                selected && styles.radioOuterSelected,
                                            ]}
                                        >
                                            {selected ? <View style={styles.radioInner} /> : null}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {errors.vehicleType ? <ErrorText error={errors.vehicleType} /> : null}
                    </View>

                    {/* Vehicle Number */}
                    <View style={styles.sectionContainer}>
                        <MyTextInput
                            label="Vehicle Number"
                            placeholder="e.g. KA01AB1234"
                            value={vehicleNumber}
                            onChange={(text) => {
                                setVehicleNumber(text.toUpperCase());
                                if (errors.vehicleNumber) {
                                    setErrors((prev) => ({ ...prev, vehicleNumber: undefined }));
                                }
                            }}
                            error={errors.vehicleNumber}
                            firstContainerStyle={{ marginTop: 0 }}
                        />
                    </View>

                    {/* Price Per KM */}
                    <View style={styles.sectionContainer}>
                        <MyTextInput
                            label="Price per KM"
                            placeholder="e.g. 15"
                            value={pricePerKm}
                            keyboardType="numeric"
                            onChange={(text) => {
                                // Allow only digits and a single decimal
                                const sanitized = text.replace(/[^0-9.]/g, "");
                                const parts = sanitized.split(".");
                                const final =
                                    parts.length > 2
                                        ? `${parts[0]}.${parts.slice(1).join("")}`
                                        : sanitized;
                                setPricePerKm(final);
                                if (errors.pricePerKm) {
                                    setErrors((prev) => ({ ...prev, pricePerKm: undefined }));
                                }
                            }}
                            error={errors.pricePerKm}
                            firstContainerStyle={{ marginTop: 0 }}
                        />
                        <Text style={styles.helperText}>Currency follows your account locale</Text>
                    </View>

                    {/* Save Button */}
                    <Button
                        label={
                            submitting
                                ? isEditMode
                                    ? "Updating..."
                                    : "Saving..."
                                : isEditMode
                                ? "Update Preference"
                                : "Save Preference"
                        }
                        onPress={handleSubmit}
                        disabled={submitting || initialFetching}
                        style={{
                            backgroundColor:
                                submitting || initialFetching ? Colors.gray : Colors.primary,
                            borderRadius: 12,
                            marginTop: 28,
                            marginBottom: 24,
                        }}
                    />
                </ScrollView>

                <Loader
                    visible={isBusy}
                    message={
                        initialFetching
                            ? "Loading your preference..."
                            : submitting
                            ? isEditMode
                                ? "Updating your preference..."
                                : "Saving your preference..."
                            : "Please wait..."
                    }
                />
                {alertModal}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default VehiclePreferenceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerSection: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    headerTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.black,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.gray,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },
    infoBanner: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: Colors.BlueLightShade,
        padding: 14,
        borderRadius: 12,
        marginBottom: 24,
    },
    infoIconWrapper: {
        marginRight: 10,
        marginTop: 1,
    },
    infoBannerText: {
        flex: 1,
        fontSize: 13,
        color: Colors.black,
        lineHeight: 18,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.black,
        marginBottom: 4,
    },
    sectionHint: {
        fontSize: 13,
        color: Colors.gray,
        marginBottom: 12,
    },
    optionsContainer: {
        gap: 10,
    },
    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Colors.lightGray,
        backgroundColor: Colors.white,
        marginTop: 10,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    optionCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: "#EEF3FF",
        shadowOpacity: 0.08,
        elevation: 3,
    },
    optionIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.BlueLightShade,
        marginRight: 14,
    },
    optionIconWrapperSelected: {
        backgroundColor: Colors.primary,
    },
    optionTextWrapper: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.black,
    },
    optionLabelSelected: {
        color: Colors.primary,
    },
    optionDescription: {
        fontSize: 13,
        color: Colors.gray,
        marginTop: 2,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.gray,
        alignItems: "center",
        justifyContent: "center",
    },
    radioOuterSelected: {
        borderColor: Colors.primary,
    },
    radioInner: {
        width: 11,
        height: 11,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
    helperText: {
        marginTop: 6,
        fontSize: 12,
        color: Colors.gray,
    },
});
