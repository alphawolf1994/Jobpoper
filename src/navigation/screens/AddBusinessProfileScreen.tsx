import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

import { Colors } from "../../utils";
import { Button, MyTextInput, PhoneNumberInput } from "../../components";
import Loader from "../../components/Loader";
import CategoryPickerSheet, { getCategoryVisual } from "../../components/CategoryPickerSheet";
import VerificationBottomSheet, {
  VerificationBottomSheetHandle,
} from "../../components/VerificationBottomSheet";
import { useAlertModal } from "../../hooks/useAlertModal";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchBusinessCategories } from "../../redux/slices/businessCategorySlice";
import { fetchVerificationStatus } from "../../redux/slices/verificationSlice";
import {
  SavedLocation,
  clearLastAddedLocation,
  fetchLocations,
} from "../../redux/slices/locationsSlice";
import { BusinessCategory, ServiceCategory } from "../../interface/interfaces";
import {
  createBusinessProfileApi,
  getMyBusinessProfilesApi,
  updateBusinessProfileApi,
} from "../../api/businessProfileApis";
import { IMAGE_BASE_URL } from "../../api/baseURL";

const MAX_IMAGES = 5;
const MAX_PROFILES = 3;
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "heic", "heif"];

// Route params: when navigated with `mode: "edit"` and a `profile` payload
// the screen flips into update mode — the form prefills, the submit calls
// updateBusinessProfileApi, and the backend resets status to pending.
type EditProfileParam = {
  _id: string;
  businessName: string;
  category?: { _id: string; name?: string; slug?: string } | string;
  address: string;
  phoneNumber: string;
  status?: "pending" | "approved" | "rejected";
  images?: { _id: string; url: string; isPrimary?: boolean }[];
};

type AddBusinessProfileRouteParams = {
  AddBusinessProfileScreen?: {
    mode?: "create" | "edit";
    profile?: EditProfileParam;
  };
};

const resolveRemoteImageUrl = (uri?: string | null): string | undefined => {
  if (!uri) return undefined;
  if (/^https?:\/\//i.test(uri)) return uri;
  const trimmed = uri.replace(/^\/?uploads\//, "");
  return `${IMAGE_BASE_URL}/${trimmed}`;
};

const AddBusinessProfileScreen = () => {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<AddBusinessProfileRouteParams, "AddBusinessProfileScreen">>();
  const dispatch = useDispatch<AppDispatch>();
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  const verificationSheetRef = useRef<VerificationBottomSheetHandle>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: savedLocations, lastAddedLocation } = useSelector(
    (state: RootState) => state.locations
  );

  const isEditMode = route.params?.mode === "edit" && !!route.params?.profile;
  const editingProfile = route.params?.profile;

  const {
    items: categoryItems,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: RootState) => state.businessCategories);

  const [businessName, setBusinessName] = useState(
    isEditMode ? editingProfile?.businessName ?? "" : ""
  );
  const initialCategoryFromProfile: BusinessCategory | null = useMemo(() => {
    if (!isEditMode || !editingProfile?.category) return null;
    if (typeof editingProfile.category === "string") {
      return { _id: editingProfile.category, name: "" } as BusinessCategory;
    }
    return {
      _id: editingProfile.category._id,
      name: editingProfile.category.name ?? "",
    } as BusinessCategory;
  }, [isEditMode, editingProfile]);
  const [selectedCategory, setSelectedCategory] =
    useState<BusinessCategory | null>(initialCategoryFromProfile);
  const selectedCategoryVisual = getCategoryVisual(selectedCategory);
  const [showCategorySheet, setShowCategorySheet] = useState(false);

  const [address, setAddress] = useState(
    isEditMode ? editingProfile?.address ?? "" : ""
  );
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SavedLocation | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState(
    isEditMode ? editingProfile?.phoneNumber ?? "" : ""
  );
  const [phoneFormatted, setPhoneFormatted] = useState(
    isEditMode ? editingProfile?.phoneNumber ?? "" : ""
  );

  // images: array of local URIs from ImagePicker. Index 0 == primary unless
  // the user explicitly taps another tile to mark it primary.
  const [images, setImages] = useState<string[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);

  // Existing remote images shown as a read-only preview in edit mode while
  // the user hasn't picked any new files. Picking new images replaces the
  // entire set on submit (matches backend update semantics).
  const existingImages = useMemo(() => {
    if (!isEditMode || !editingProfile?.images) return [];
    return [...editingProfile.images].sort((a, b) =>
      a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1
    );
  }, [isEditMode, editingProfile]);

  const [submitting, setSubmitting] = useState(false);
  const [precheckLoading, setPrecheckLoading] = useState(false);
  const [precheckError, setPrecheckError] = useState<string | null>(null);

  // Fetch categories on mount.
  useEffect(() => {
    dispatch(fetchBusinessCategories());
    if (!user?.isVerified) {
      dispatch(fetchVerificationStatus());
    }
  }, [dispatch, user?.isVerified]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchLocations());

      if (lastAddedLocation) {
        setSelectedLocation(lastAddedLocation);
        setAddress(lastAddedLocation.fullAddress);
        setLatitude(lastAddedLocation.latitude);
        setLongitude(lastAddedLocation.longitude);
        dispatch(clearLastAddedLocation());
      }
    }, [dispatch, lastAddedLocation])
  );

  useEffect(() => {
    if (!isEditMode && user && !user.isVerified) {
      const timer = setTimeout(() => {
        verificationSheetRef.current?.open();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isEditMode, user]);

  // Once categories arrive from the server, hydrate the selected category
  // with its display name (the route param may only carry an _id).
  useEffect(() => {
    if (!isEditMode) return;
    if (!selectedCategory || selectedCategory.name) return;
    const found = (categoryItems as BusinessCategory[] | undefined)?.find(
      (c) => c._id === selectedCategory._id
    );
    if (found && found.name) {
      setSelectedCategory(found);
    }
  }, [isEditMode, selectedCategory, categoryItems]);

  // Pre-check the user's profile count. If they're already at the cap,
  // bounce them back to the list with a toast so the form never opens
  // for someone who can't actually submit it. Skipped in edit mode since
  // editing doesn't create a new profile.
  useEffect(() => {
    if (isEditMode) return;
    if (user && !user.isVerified) return;
    let cancelled = false;
    (async () => {
      setPrecheckLoading(true);
      setPrecheckError(null);
      try {
        const res = await getMyBusinessProfilesApi();
        const total = res?.data?.total ?? 0;
        if (!cancelled && total >= MAX_PROFILES) {
          Toast.show({
            type: "info",
            text1: "Maximum 3 profiles reached",
            text2: "You can't create another business profile.",
          });
          (navigation as any).goBack();
        }
      } catch (err: any) {
        if (!cancelled) {
          setPrecheckError(
            err?.message ||
              "Could not check profile limit. You can still try submitting."
          );
        }
      } finally {
        if (!cancelled) setPrecheckLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigation, isEditMode, user]);

  const showError = (message: string) =>
    showAlert({ title: "Error", message, type: "error" });

  const validatePickedAsset = (asset: ImagePicker.ImagePickerAsset) => {
    const fileName = asset.fileName || asset.uri.split("/").pop() || "";
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext && !ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      return "Only JPG, PNG, WEBP, HEIC, and HEIF images are supported.";
    }
    if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE_BYTES) {
      return "Each image must be 8MB or smaller.";
    }
    return null;
  };

  // ----- Image picker -------------------------------------------------------
  const handlePickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showAlert({
        title: "Permission required",
        message: "Please allow photo library access to add business images.",
        type: "warning",
      });
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      showAlert({
        title: "Limit reached",
        message: `You can upload up to ${MAX_IMAGES} images.`,
        type: "info",
      });
      return;
    }

    let result: ImagePicker.ImagePickerResult;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.7,
      });
    } catch (err: any) {
      showError(err?.message || "Could not open the image picker.");
      return;
    }

    if (!result.canceled) {
      const invalidMessage = (result.assets ?? [])
        .map(validatePickedAsset)
        .find(Boolean);
      if (invalidMessage) {
        showError(invalidMessage);
        return;
      }
      const uris = (result.assets ?? [])
        .map((a) => a.uri)
        .filter(Boolean) as string[];
      if (!uris.length) return;
      setImages((prev) => [...prev, ...uris].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPrimaryIndex((prev) => {
      if (prev === index) return 0;
      if (prev > index) return prev - 1;
      return prev;
    });
  };

  const markPrimary = (index: number) => {
    setPrimaryIndex(index);
  };

  const handleLocationSelect = (location: SavedLocation) => {
    setSelectedLocation(location);
    setAddress(location.fullAddress);
    setLatitude(location.latitude);
    setLongitude(location.longitude);
    setShowLocationModal(false);
  };

  const handleAddNewLocation = () => {
    setShowLocationModal(false);
    (navigation as any).navigate("AddLocationScreen");
  };

  // ----- Validation + submit ------------------------------------------------
  const validate = (): string | null => {
    if (!businessName.trim()) return "Business name is required.";
    if (!selectedCategory?._id) return "Please select a business category.";
    if (!address.trim()) return "Address is required.";
    if (!phoneFormatted && !phoneNumber.trim()) return "Phone number is required.";
    // In edit mode the existing images stay if no new ones are picked, so
    // a 0-image submission is fine. In create mode we require at least 1.
    if (!isEditMode && images.length < 1) return "Please add at least 1 image.";
    if (images.length > MAX_IMAGES) return `You can upload up to ${MAX_IMAGES} images.`;
    return null;
  };

  const handleSubmit = async () => {
    if (!isEditMode && !user?.isVerified) {
      verificationSheetRef.current?.open();
      return;
    }

    const error = validate();
    if (error) {
      showError(error);
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode && editingProfile?._id) {
        // Edit + resubmit. The backend flips status back to pending on any
        // successful update; we only send images if the user picked new
        // ones (otherwise the existing set is kept).
        const res = await updateBusinessProfileApi(editingProfile._id, {
          businessName: businessName.trim(),
          category: selectedCategory!._id,
          address: address.trim(),
          phoneNumber: (phoneFormatted || phoneNumber).trim(),
          latitude,
          longitude,
          images: images.length > 0 ? images : undefined,
          primaryIndex: images.length > 0 ? primaryIndex : undefined,
        });

        if (res?.status && res.status !== "success") {
          throw new Error(res?.message || "Failed to update business profile");
        }

        // Tailor the toast to the prior status. An approved profile being
        // edited goes "under review again"; a rejected profile being
        // edited is being "resubmitted".
        const wasApproved = editingProfile?.status === "approved";
        Toast.show({
          type: "success",
          text1: wasApproved
            ? "Profile under review again."
            : "Profile resubmitted",
          text2: wasApproved
            ? "Admin will respond within 24 hours."
            : "Admin will review your changes within 24 hours.",
          visibilityTime: 4000,
        });

        const nav = navigation as any;
        if (nav.navigate) {
          nav.navigate("BusinessProfilesScreen");
        } else {
          nav.goBack?.();
        }
        return;
      }

      const res = await createBusinessProfileApi({
        businessName: businessName.trim(),
        category: selectedCategory!._id,
        address: address.trim(),
        phoneNumber: (phoneFormatted || phoneNumber).trim(),
        latitude,
        longitude,
        images,
        primaryIndex,
      });

      if (res?.status && res.status !== "success") {
        throw new Error(res?.message || "Failed to create business profile");
      }

      // Status is set to "pending" server-side; show the review toast and
      // send the user back to the profile list screen.
      Toast.show({
        type: "success",
        text1: "Profile submitted",
        text2: "Admin will review your profile within 24 hours.",
        visibilityTime: 4000,
      });

      const nav = navigation as any;
      // Prefer an explicit navigate so we always land on the list screen
      // even if the user got here via deep link.
      if (nav.navigate) {
        nav.navigate("BusinessProfilesScreen");
      } else {
        nav.goBack?.();
      }
    } catch (err: any) {
      const message: string =
        err?.message ||
        (isEditMode
          ? "Failed to update business profile."
          : "Failed to create business profile.");
      const isLimit = /at most.*business profiles|PROFILE_LIMIT_REACHED/i.test(
        message
      );
      const isPendingLock = /PROFILE_PENDING_REVIEW|pending review/i.test(
        message
      );
      if (isLimit) {
        Toast.show({
          type: "error",
          text1: `Limit reached: ${MAX_PROFILES} profiles max`,
          text2: "You can't create another business profile.",
        });
        (navigation as any).navigate?.("BusinessProfilesScreen");
      } else if (isPendingLock) {
        Toast.show({
          type: "info",
          text1: "Pending review",
          text2: "You can't edit a profile while it's awaiting review.",
        });
        (navigation as any).navigate?.("BusinessProfilesScreen");
      } else {
        showError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // CategoryPickerSheet was built around ServiceCategory; the shape is identical
  // so we reuse it by casting. Saves duplicating the sheet just for visuals.
  const categoriesForSheet = useMemo(
    () => categoryItems as unknown as ServiceCategory[],
    [categoryItems]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Loader
        visible={submitting || precheckLoading}
        message={
          precheckLoading
            ? "Checking profile limit..."
            : isEditMode
            ? "Resubmitting business profile..."
            : "Submitting business profile..."
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => (navigation as any).goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
            <Text style={styles.headerTitle}>
              {isEditMode ? "Edit Business Profile" : "Add Business Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        {isEditMode && editingProfile?.status === "rejected" ? (
          <View style={styles.editBanner}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#B26A00"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.editBannerText}>
              Submitting will resubmit this profile for admin review.
            </Text>
          </View>
        ) : null}

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {precheckError ? (
            <View style={styles.warningBox}>
              <Ionicons
                name="alert-circle-outline"
                size={17}
                color={Colors.orange}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.warningText}>{precheckError}</Text>
            </View>
          ) : null}

          {/* Business Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Business Name <Text style={styles.required}>*</Text>
            </Text>
            <MyTextInput
              placeholder="e.g. Sunrise Bakery"
              value={businessName}
              onChange={setBusinessName}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowCategorySheet(true)}
              style={[styles.dropdown, styles.inputRow]}
            >
              <View style={styles.categoryValueWrap}>
                <Ionicons
                  name={selectedCategory ? selectedCategoryVisual.icon : "grid-outline"}
                  size={20}
                  color={selectedCategory ? selectedCategoryVisual.color : "#9AA0A6"}
                  style={styles.categoryIcon}
                />
                <Text
                  style={
                    selectedCategory ? styles.dropdownText : styles.placeholder
                  }
                  numberOfLines={1}
                >
                  {selectedCategory
                    ? selectedCategory.name
                    : categoriesLoading
                    ? "Loading categories..."
                    : "Select a business category"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#9AA0A6" />
            </TouchableOpacity>
            {categoriesError ? (
              <Text style={styles.errorHint}>{categoriesError}</Text>
            ) : null}
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Address <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowLocationModal(true)}
              activeOpacity={0.8}
            >
              <View style={[styles.dropdown, styles.inputRow, styles.locationSelectable]}>
                <View style={styles.locationValueWrap}>
                  <Text
                    style={address ? styles.dropdownText : styles.placeholder}
                    numberOfLines={2}
                  >
                    {selectedLocation
                      ? `${selectedLocation.name} - ${selectedLocation.fullAddress}`
                      : address || "Select location..."}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#9AA0A6" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone Number <Text style={styles.required}>*</Text>
            </Text>
            <PhoneNumberInput
              placeholder="Business phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onChangeFormattedText={setPhoneFormatted}
            />
          </View>

          {/* Images */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
            Add the images of your services/products/ Menu{" "}
              {!isEditMode ? <Text style={styles.required}>*</Text> : null}
              <Text style={styles.labelSub}>
                {"  "}
                {isEditMode
                  ? `(optional — pick to replace, up to ${MAX_IMAGES})`
                  : `(1 required, up to ${MAX_IMAGES})`}
              </Text>
            </Text>

            <TouchableOpacity activeOpacity={0.85} onPress={handlePickImages}>
              <View style={[styles.dropdown, styles.inputRow]}>
                <Text
                  style={images.length ? styles.dropdownText : styles.placeholder}
                >
                  {images.length
                    ? `${images.length}/${MAX_IMAGES} selected`
                    : isEditMode
                    ? `Pick new photos to replace existing... (0/${MAX_IMAGES})`
                    : `Add photos... (0/${MAX_IMAGES})`}
                </Text>
                <Ionicons name="image-outline" size={18} color="#9AA0A6" />
              </View>
            </TouchableOpacity>

            {/*
              Existing remote images are shown as a read-only strip when
              the user hasn't picked any new files yet. The moment they
              pick new images we hide this strip — the new picks fully
              replace the existing set on submit.
            */}
            {isEditMode && images.length === 0 && existingImages.length > 0 ? (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.hint}>Current photos</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 6 }}
                >
                  {existingImages.map((img) => {
                    const url = resolveRemoteImageUrl(img.url);
                    return (
                      <View
                        key={img._id}
                        style={[
                          styles.thumbWrap,
                          img.isPrimary && styles.thumbPrimary,
                        ]}
                      >
                        {url ? (
                          <Image
                            source={{ uri: url }}
                            style={styles.thumb}
                            contentFit="cover"
                          />
                        ) : null}
                        {img.isPrimary ? (
                          <View style={styles.primaryBadge}>
                            <Ionicons
                              name="star"
                              size={10}
                              color={Colors.white}
                            />
                            <Text style={styles.primaryBadgeText}>Main</Text>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}

            {images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 12 }}
              >
                {images.map((uri, idx) => {
                  const isPrimary = idx === primaryIndex;
                  return (
                    <TouchableOpacity
                      key={`${uri}-${idx}`}
                      style={[
                        styles.thumbWrap,
                        isPrimary && styles.thumbPrimary,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => markPrimary(idx)}
                    >
                      <Image
                        source={{ uri }}
                        style={styles.thumb}
                        contentFit="cover"
                      />
                      {isPrimary ? (
                        <View style={styles.primaryBadge}>
                          <Ionicons
                            name="star"
                            size={10}
                            color={Colors.white}
                          />
                          <Text style={styles.primaryBadgeText}>Main</Text>
                        </View>
                      ) : null}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeImage(idx)}
                        activeOpacity={0.7}
                        hitSlop={6}
                      >
                        <AntDesign name="close" size={12} color="white" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {images.length > 1 ? (
              <Text style={styles.hint}>
                Tap a photo to mark it as the main image.
              </Text>
            ) : null}
          </View>

          {/* Submit */}
          <Button
            label={
              submitting
                ? isEditMode
                  ? "Resubmitting..."
                  : "Submitting..."
                : isEditMode
                ? "Resubmit for review"
                : "Submit for review"
            }
            onPress={handleSubmit}
            disabled={submitting || precheckLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <CategoryPickerSheet
        visible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSelect={(cat) =>
          setSelectedCategory(cat as unknown as BusinessCategory)
        }
        categories={categoriesForSheet}
        loading={categoriesLoading}
        error={categoriesError}
        selectedId={selectedCategory?._id ?? null}
        onRetry={() => dispatch(fetchBusinessCategories())}
        title="Select a business category"
        subtitle="Choose what kind of business you run"
      />

      <VerificationBottomSheet ref={verificationSheetRef} />

      {alertModal}

      <Modal
        visible={showLocationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowLocationModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Location</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            {savedLocations.length === 0 ? (
              <View style={styles.emptyLocationsContainer}>
                <Ionicons name="location-outline" size={64} color={Colors.lightGray} />
                <Text style={styles.emptyLocationsText}>No saved locations</Text>
                <Text style={styles.emptyLocationsSubtext}>
                  Add your first location to get started
                </Text>
              </View>
            ) : (
              <FlatList
                data={savedLocations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.locationItem}
                    onPress={() => handleLocationSelect(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.locationItemContent}>
                      <View style={[styles.locationTypeIcon, { backgroundColor: Colors.lightGray }]}>
                        <Ionicons name="location-outline" size={18} color={Colors.primary} />
                      </View>
                      <View style={styles.locationTextContainer}>
                        <Text style={styles.locationItemName}>{item.name}</Text>
                        <Text style={styles.locationItemAddress} numberOfLines={2}>
                          {item.fullAddress}
                        </Text>
                        {item.addressDetails ? (
                          <Text style={styles.locationItemDetails} numberOfLines={1}>
                            {item.addressDetails}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={styles.modalFooter}>
              <Button
                label="Add New Location"
                onPress={handleAddNewLocation}
                icon={<Ionicons name="add" size={20} color={Colors.white} />}
                style={styles.addLocationButton}
                textStyle={{ fontSize: 16 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default AddBusinessProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    marginLeft: 6,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 8,
  },
  labelSub: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.gray,
  },
  required: {
    color: "#E11D48",
    fontWeight: "700",
  },
  hint: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 6,
    marginBottom: 6,
  },
  errorHint: {
    fontSize: 12,
    color: "#E11D48",
    marginTop: 6,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FFE0A8",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#7A4A00",
    lineHeight: 18,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E2EAFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryValueWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  categoryIcon: {
    marginRight: 10,
  },
  locationValueWrap: {
    flex: 1,
    minWidth: 0,
  },
  locationSelectable: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  dropdownText: {
    fontSize: 15,
    color: Colors.black,
    flex: 1,
    marginRight: 10,
  },
  placeholder: {
    fontSize: 15,
    color: "#9AA0A6",
    flex: 1,
    marginRight: 10,
  },
  thumbWrap: {
    width: 88,
    height: 88,
    borderRadius: 12,
    marginRight: 10,
    overflow: "hidden",
    backgroundColor: "#F4F7FF",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbPrimary: {
    borderColor: Colors.primary,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  primaryBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  primaryBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 3,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  editBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E0",
    borderBottomWidth: 1,
    borderBottomColor: "#F4D9A8",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  editBannerText: {
    fontSize: 12,
    color: "#7A4A00",
    fontWeight: "600",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
  },
  modalContent: {
    flex: 1,
  },
  emptyLocationsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyLocationsText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyLocationsSubtext: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  locationItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationTypeIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 4,
  },
  locationItemAddress: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 2,
  },
  locationItemDetails: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: "italic",
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  addLocationButton: {
    marginTop: 0,
  },
});
