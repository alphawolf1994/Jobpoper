import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { Colors } from "../../utils";
import { RootState } from "../../redux/store";
import { setIdPhotoUri, showVerificationPromptAgain } from "../../redux/slices/verificationSlice";
import { useAlertModal } from "../../hooks/useAlertModal";

const VerificationIdScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { idPhotoUri } = useSelector((state: RootState) => state.verification);
  const [previewUri, setPreviewUri] = useState(idPhotoUri);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  const pickIdPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showAlert({
        title: "Permission needed",
        message: "Please allow gallery access to choose your ID photo.",
        type: "warning",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPreviewUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!previewUri) return;
    dispatch(setIdPhotoUri(previewUri));
    dispatch(showVerificationPromptAgain());
    (navigation as any).navigate("VerificationDetailsScreen");
  };

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

          <TouchableOpacity style={styles.previewCard} activeOpacity={0.9} onPress={pickIdPhoto}>
            {previewUri ? (
              <Image source={{ uri: previewUri }} style={styles.previewImage} />
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
                <Text style={styles.placeholderSubtitle}>Tap to choose your ID photo from gallery</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>

          <View style={styles.tipCard}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.tipText}>Avoid glare, crop tightly, and keep the document fully inside the frame.</Text>
          </View>

          <Button
            label={previewUri ? "Save ID Photo" : "Choose Photo ID"}
            onPress={previewUri ? handleSave : pickIdPhoto}
            style={styles.primaryButton}
          />

          {previewUri ? (
            <TouchableOpacity style={styles.secondaryAction} onPress={pickIdPhoto} activeOpacity={0.8}>
              <Text style={styles.secondaryActionText}>Choose a different ID photo</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </LinearGradient>
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
    marginBottom: 22,
  },
  previewCard: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DCE7FF",
    backgroundColor: "#FFFFFF",
    minHeight: 320,
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
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
});
