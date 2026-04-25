import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import { Colors } from "../../utils";
import { RootState } from "../../redux/store";

const VerificationSubmittedScreen = () => {
  const navigation = useNavigation();
  const verificationStatus = useSelector(
    (state: RootState) => state.verification.status
  );

  const title =
    verificationStatus === "approved"
      ? "Verification approved"
      : verificationStatus === "rejected"
      ? "Verification rejected"
      : "Under review";

  const subtitle =
    verificationStatus === "approved"
      ? "Your verification is approved. You can now take up quick jobs and build trust faster."
      : verificationStatus === "rejected"
      ? "Your last submission was rejected. Please review the details and upload clearer documents."
      : "Your documents have been submitted successfully. They are now under review and admin can change the status after review.";

  const infoText =
    verificationStatus === "approved"
      ? "Your updated verification status is also available in your profile."
      : verificationStatus === "rejected"
      ? "Open verification details to see the latest status and submit updated documents."
      : "You can check your verification details anytime from Profile.";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EAF2FF" />
      <LinearGradient
        colors={["#EAF2FF", "#FFFFFF", "#F6F9FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.screenBackground}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AntDesign name="arrow-left" size={24} color={Colors.black} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.illustrationWrap}>
            <LinearGradient
              colors={["#DCE8FF", "#F3F7FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.illustrationCard}
            >
              <Ionicons name="shield-checkmark" size={94} color={Colors.primary} />
            </LinearGradient>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{infoText}</Text>
          </View>

          <Button
            label={verificationStatus === "rejected" ? "Update Documents" : "Go to Home"}
            onPress={() =>
              verificationStatus === "rejected"
                ? (navigation as any).navigate("VerificationDetailsScreen")
                : (navigation as any).navigate("HomeTabs")
            }
            style={styles.primaryButton}
          />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => (navigation as any).navigate("VerificationDetailsScreen")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>View verification details</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default VerificationSubmittedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  screenBackground: { flex: 1 },
  backBtn: {
    position: "absolute",
    left: 16,
    top: 12,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
  },
  illustrationWrap: {
    alignItems: "center",
    marginBottom: 26,
  },
  illustrationCard: {
    width: 220,
    height: 180,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.black,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: "#697386",
    textAlign: "center",
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#F4F7FF",
    marginBottom: 22,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#556074",
  },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 16,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
});
