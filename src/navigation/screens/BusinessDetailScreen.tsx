import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { useNavigation, useRoute } from "@react-navigation/native";

import { IMAGE_BASE_URL } from "../../api/baseURL";
import { Colors } from "../../utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GALLERY_WIDTH = SCREEN_WIDTH;
const GALLERY_HEIGHT = Math.min(360, Math.round(SCREEN_WIDTH * 0.72));

const resolveImageUrl = (uri?: string | null): string | undefined => {
  if (!uri) return undefined;
  if (/^https?:\/\//i.test(uri)) return uri;
  const trimmed = uri.replace(/^\/?uploads\//, "");
  return `${IMAGE_BASE_URL}/${trimmed}`;
};

interface BusinessImageRef {
  _id: string;
  url: string;
  isPrimary?: boolean;
  uploadedAt?: string;
}

interface BusinessProfileDetail {
  _id: string;
  businessName: string;
  category?: { _id: string; name?: string; slug?: string } | string;
  address: string;
  phoneNumber?: string;
  status?: "pending" | "approved" | "rejected";
  images?: BusinessImageRef[];
  createdAt?: string;
  updatedAt?: string;
}

const BusinessDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const profile = (route.params as any)?.profile as
    | BusinessProfileDetail
    | undefined;
  const [activeIndex, setActiveIndex] = useState(0);

  const images = useMemo(
    () =>
      (profile?.images ?? [])
        .map((image) => resolveImageUrl(image.url))
        .filter(Boolean) as string[],
    [profile?.images]
  );

  const categoryName =
    typeof profile?.category === "object" && profile?.category
      ? profile.category.name
      : undefined;

  const handleCall = () => {
    const phoneNumber = profile?.phoneNumber?.replace(/[\s\-()]/g, "");
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {});
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyWrap}>
          <Ionicons name="alert-circle-outline" size={46} color={Colors.gray} />
          <Text style={styles.emptyTitle}>Business not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.galleryWrap}>
          {images.length > 0 ? (
            <Carousel
              width={GALLERY_WIDTH}
              height={GALLERY_HEIGHT}
              data={images}
              onSnapToItem={setActiveIndex}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.galleryImage}
                  contentFit="cover"
                />
              )}
            />
          ) : (
            <View style={styles.galleryPlaceholder}>
              <Ionicons
                name="storefront-outline"
                size={54}
                color={Colors.gray}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, styles.backButton]}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
          </TouchableOpacity>

          {images.length > 1 ? (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeIndex + 1}/{images.length}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{profile.businessName}</Text>
          {categoryName ? (
            <View style={styles.categoryPill}>
              <Ionicons name="pricetag-outline" size={14} color={Colors.primary} />
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
          ) : null}

          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Business Info</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{profile.address}</Text>
              </View>
            </View>

            {profile.phoneNumber ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="call-outline" size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{profile.phoneNumber}</Text>
                </View>
              </View>
            ) : null}

            {profile.status ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={styles.infoValue}>Approved</Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {profile.phoneNumber ? (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.contactButton}
            activeOpacity={0.9}
            onPress={handleCall}
          >
            <Ionicons name="call" size={20} color={Colors.white} />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default BusinessDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBar: {
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  galleryWrap: {
    width: GALLERY_WIDTH,
    height: GALLERY_HEIGHT,
    backgroundColor: "#F4F7FF",
  },
  galleryImage: {
    width: GALLERY_WIDTH,
    height: GALLERY_HEIGHT,
  },
  galleryPlaceholder: {
    width: GALLERY_WIDTH,
    height: GALLERY_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 14,
  },
  imageCounter: {
    position: "absolute",
    right: 16,
    bottom: 14,
    backgroundColor: "rgba(0,0,0,0.58)",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageCounterText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 110,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: Colors.black,
    lineHeight: 31,
  },
  categoryPill: {
    alignSelf: "flex-start",
    marginTop: 10,
    minHeight: 32,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    borderWidth: 1,
    borderColor: "#D8E6FF",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    marginLeft: 6,
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  infoBlock: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.black,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: "700",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.black,
    lineHeight: 21,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  contactButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contactButtonText: {
    marginLeft: 8,
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "800",
    color: Colors.black,
  },
});
