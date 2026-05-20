import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { IMAGE_BASE_URL } from "../../api/baseURL";
import { getMyBusinessProfilesApi } from "../../api/businessProfileApis";
import { Colors } from "../../utils";
import RaiseOrderModal from "../../components/RaiseOrderModal";
import { RootState } from "../../redux/store";

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
  user?: string | { _id?: string; id?: string };
  owner?: string | { _id?: string; id?: string };
  businessOwner?: string | { _id?: string; id?: string };
  createdBy?: string | { _id?: string; id?: string };
  images?: BusinessImageRef[];
  createdAt?: string;
  updatedAt?: string;
}

const getEntityId = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const entity = value as { _id?: string; id?: string };
    return entity._id || entity.id;
  }
  return undefined;
};

const BusinessDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);
  const profile = (route.params as any)?.profile as
    | BusinessProfileDetail
    | undefined;
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [raiseOrderVisible, setRaiseOrderVisible] = useState(false);
  const [isOwnedProfile, setIsOwnedProfile] = useState(false);

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

  const profileOwnerId =
    getEntityId(profile?.user) ||
    getEntityId(profile?.owner) ||
    getEntityId(profile?.businessOwner) ||
    getEntityId(profile?.createdBy);
  const loggedInUserId = user?.id || (user as any)?._id;
  const hasDirectOwnerMatch =
    Boolean(profileOwnerId && loggedInUserId) && profileOwnerId === loggedInUserId;
  const isOwner = hasDirectOwnerMatch || isOwnedProfile;

  useEffect(() => {
    if (!profile?._id || !user || hasDirectOwnerMatch) {
      setIsOwnedProfile(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await getMyBusinessProfilesApi();
        const profiles = res?.data?.profiles ?? [];
        if (!cancelled) {
          setIsOwnedProfile(
            Array.isArray(profiles) &&
              profiles.some((item: any) => item?._id === profile._id)
          );
        }
      } catch {
        if (!cancelled) setIsOwnedProfile(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasDirectOwnerMatch, profile?._id, user]);

  const handleCall = () => {
    const phoneNumber = profile?.phoneNumber?.replace(/[\s\-()]/g, "");
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {});
  };

  // Open Google Maps with directions to the business address.
  // Works on both iOS and Android — the universal Google Maps URL routes
  // through the Google Maps app when installed, otherwise opens in the
  // browser. Falls back to a search query URL if directions can't open.
  const handleOpenAddressInMaps = () => {
    const address = profile?.address?.trim();
    if (!address) return;
    const encoded = encodeURIComponent(address);
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encoded}&travelmode=driving`;
    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
    Linking.openURL(directionsUrl).catch(() => {
      Linking.openURL(searchUrl).catch(() => {});
    });
  };

  const handleEditBusiness = () => {
    if (!profile) return;
    navigation.navigate("AddBusinessProfileScreen", {
      mode: "edit",
      profile,
    });
  };

  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
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
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => openImageModal(index)}
                >
                  <Image
                    source={{ uri: item }}
                    style={styles.galleryImage}
                    contentFit="cover"
                  />
                </TouchableOpacity>
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

            <TouchableOpacity
              style={styles.infoRow}
              activeOpacity={0.7}
              onPress={handleOpenAddressInMaps}
              accessibilityRole="button"
              accessibilityLabel="Open address in maps for directions"
            >
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{profile.address}</Text>
                <View style={styles.addressDirectionsHint}>
                  <Ionicons name="navigate-outline" size={12} color={Colors.primary} />
                  <Text style={styles.addressDirectionsHintText}>
                    Tap to open in Maps
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.gray}
                style={styles.addressChevron}
              />
            </TouchableOpacity>

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
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(18, insets.bottom + 12) },
        ]}
      >
        <View style={styles.footerRow}>
          {profile.phoneNumber ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.contactButton]}
              activeOpacity={0.9}
              onPress={handleCall}
            >
              <Ionicons name="call" size={18} color={Colors.white} />
              <Text style={styles.actionButtonText}>Contact</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[
              styles.actionButton,
              isOwner ? styles.editBusinessButton : styles.raiseOrderButton,
            ]}
            activeOpacity={0.9}
            onPress={
              isOwner ? handleEditBusiness : () => setRaiseOrderVisible(true)
            }
          >
            <Ionicons
              name={isOwner ? "create-outline" : "cart"}
              size={18}
              color={Colors.white}
            />
            <Text style={styles.actionButtonText}>
              {isOwner ? "Edit Business" : "Raise an Order"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <RaiseOrderModal
        visible={raiseOrderVisible}
        onClose={() => setRaiseOrderVisible(false)}
        businessProfileId={profile._id}
        businessName={profile.businessName}
      />

      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.zoomOverlay}>
          <TouchableOpacity
            style={styles.zoomClose}
            onPress={closeImageModal}
            activeOpacity={0.85}
          >
            <Ionicons name="close" size={28} color={Colors.white} />
          </TouchableOpacity>

          {images.length > 1 ? (
            <View style={styles.zoomCounter}>
              <Text style={styles.zoomCounterText}>
                {modalImageIndex + 1} / {images.length}
              </Text>
            </View>
          ) : null}

          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `business-image-${index}-${item}`}
            initialScrollIndex={modalImageIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setModalImageIndex(index);
            }}
            renderItem={({ item }) => (
              <ScrollView
                style={styles.zoomScroll}
                contentContainerStyle={styles.zoomContent}
                maximumZoomScale={3}
                minimumZoomScale={1}
                centerContent
              >
                <Image
                  source={{ uri: item }}
                  style={styles.zoomImage}
                  contentFit="contain"
                />
              </ScrollView>
            )}
          />
        </View>
      </Modal>
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
  addressDirectionsHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  addressDirectionsHintText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  addressChevron: {
    alignSelf: "center",
    marginLeft: 8,
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
    backgroundColor: Colors.primary,
  },
  raiseOrderButton: {
    backgroundColor: Colors.secondary,
  },
  editBusinessButton: {
    backgroundColor: Colors.secondary,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    marginLeft: 8,
    color: Colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
  zoomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.94)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomClose: {
    position: "absolute",
    top: 58,
    right: 20,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  zoomCounter: {
    position: "absolute",
    top: 63,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  zoomCounterText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "800",
  },
  zoomScroll: {
    width: SCREEN_WIDTH,
  },
  zoomContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  zoomImage: {
    width: SCREEN_WIDTH - 32,
    height: Math.round((SCREEN_WIDTH - 32) * 1.25),
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
