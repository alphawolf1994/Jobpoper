import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Colors } from "../../utils";
import { listApprovedBusinessProfilesApi } from "../../api/businessProfileApis";
import { IMAGE_BASE_URL } from "../../api/baseURL";
import CategoryPickerSheet from "../../components/CategoryPickerSheet";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchBusinessCategories } from "../../redux/slices/businessCategorySlice";
import { BusinessCategory } from "../../interface/interfaces";
import { geocodeAddressToCoordinates } from "../../utils/geocode";

const PAGE_SIZE = 10;

// BusinessImage URLs are stored as "/uploads/business-profiles/<filename>"
// while IMAGE_BASE_URL already ends with "/uploads", so strip the dup.
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

interface BusinessProfileItem {
  _id: string;
  businessName: string;
  category?: { _id: string; name?: string; slug?: string } | string;
  address: string;
  phoneNumber?: string;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number;
  status?: "pending" | "approved" | "rejected";
  images?: BusinessImageRef[];
  createdAt?: string;
}

interface PaginationState {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  total: number;
}

const initialPagination: PaginationState = {
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  total: 0,
};

/**
 * BusinessTabScreen
 * ------------------
 * Bottom-tab "Business" view. Lists every approved business profile in
 * the system, paginated 10 per page. Hooked to `GET /business-profiles`.
 *
 * Pagination strategy:
 *   - Initial load fetches page 1.
 *   - Pull-to-refresh resets to page 1.
 *   - Reaching the end of the list (FlatList onEndReached) triggers the
 *     next page fetch. Subsequent pages are appended to the list.
 *   - We dedupe by _id when appending so a backend that re-returns an
 *     already-seen row (e.g. due to writes between page fetches) doesn't
 *     warn about duplicate keys in the FlatList.
 *
 * "First image" per spec is interpreted as: the primary image if one is
 * marked, otherwise the first entry of the images array.
 */
const BusinessTabScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtersReadyRef = useRef(false);

  const [profiles, setProfiles] = useState<BusinessProfileItem[]>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<BusinessCategory | null>(null);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    items: categoryItems,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: RootState) => state.businessCategories);
  const { currentLocation, currentLocationCoordinates } = useSelector(
    (state: RootState) => state.job
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const resolveSelectedCoordinates = useCallback(async () => {
    if (currentLocationCoordinates) return currentLocationCoordinates;

    const profileCurrentLocation = user?.profile?.currentLocation;
    if (
      profileCurrentLocation?.latitude != null &&
      profileCurrentLocation?.longitude != null
    ) {
      return {
        latitude: profileCurrentLocation.latitude,
        longitude: profileCurrentLocation.longitude,
      };
    }

    const locationString =
      currentLocation ||
      profileCurrentLocation?.fullAddress ||
      user?.profile?.location ||
      "New York, NY, USA";
    const geocoded = await geocodeAddressToCoordinates(locationString);
    if (geocoded) return geocoded;
    throw new Error("Could not resolve location; try selecting a listed place");
  }, [
    currentLocation,
    currentLocationCoordinates,
    user?.profile?.currentLocation,
    user?.profile?.location,
  ]);

  const fetchPage = useCallback(
    async (page: number, mode: "initial" | "refresh" | "append") => {
      // Mode-specific spinner state. Keep these mutually exclusive so we
      // never show two spinners at once.
      if (mode === "initial") setInitialLoading(true);
      if (mode === "refresh") setRefreshing(true);
      if (mode === "append") setLoadingMore(true);
      setError(null);

      try {
        const { latitude, longitude } = await resolveSelectedCoordinates();
        const location =
          currentLocation ||
          user?.profile?.currentLocation?.fullAddress ||
          user?.profile?.location;
        const res = await listApprovedBusinessProfilesApi({
          page,
          limit: PAGE_SIZE,
          latitude,
          longitude,
          location,
          search: searchQuery,
          category: selectedCategory?._id,
        });
        const fetched: BusinessProfileItem[] = res?.data?.profiles ?? [];
        const meta = res?.data?.pagination ?? {};

        setPagination({
          page: meta.page ?? page,
          totalPages: meta.totalPages ?? 1,
          hasNextPage: !!meta.hasNextPage,
          total: meta.total ?? fetched.length,
        });

        if (mode === "append") {
          setProfiles((prev) => {
            const seen = new Set(prev.map((p) => p._id));
            const merged = [...prev];
            for (const p of fetched) {
              if (!seen.has(p._id)) {
                merged.push(p);
                seen.add(p._id);
              }
            }
            return merged;
          });
        } else {
          // initial / refresh both replace the list.
          setProfiles(fetched);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load businesses");
      } finally {
        if (mode === "initial") setInitialLoading(false);
        if (mode === "refresh") setRefreshing(false);
        if (mode === "append") setLoadingMore(false);
      }
    },
    [
      currentLocation,
      resolveSelectedCoordinates,
      searchQuery,
      selectedCategory?._id,
      user?.profile?.currentLocation?.fullAddress,
      user?.profile?.location,
    ]
  );

  useEffect(() => {
    fetchPage(1, "initial");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!categoryItems || categoryItems.length === 0) {
      dispatch(fetchBusinessCategories());
    }
  }, [categoryItems, dispatch]);

  useEffect(() => {
    if (!filtersReadyRef.current) {
      filtersReadyRef.current = true;
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchPage(1, "initial");
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchPage, searchQuery, selectedCategory?._id]);

  const handleRefresh = useCallback(() => {
    fetchPage(1, "refresh");
  }, [fetchPage]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || refreshing || initialLoading) return;
    if (!pagination.hasNextPage) return;
    fetchPage(pagination.page + 1, "append");
  }, [
    loadingMore,
    refreshing,
    initialLoading,
    pagination.hasNextPage,
    pagination.page,
    fetchPage,
  ]);

  const handleSelectCategory = useCallback((category: BusinessCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleResetCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const renderItem = ({ item }: { item: BusinessProfileItem }) => {
    const primary =
      item.images?.find((img) => img.isPrimary) ?? item.images?.[0];
    const imageUrl = resolveImageUrl(primary?.url);

    const categoryName =
      typeof item.category === "object" && item.category
        ? item.category.name
        : undefined;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() =>
          navigation.navigate("BusinessDetailScreen", { profile: item })
        }
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.thumb}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Ionicons
              name="storefront-outline"
              size={28}
              color={Colors.gray}
            />
          </View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.businessName} numberOfLines={1}>
            {item.businessName}
          </Text>
          {categoryName ? (
            <Text style={styles.categoryText} numberOfLines={1}>
              {categoryName}
            </Text>
          ) : null}
          <View style={styles.addressRow}>
            <Ionicons
              name="location-outline"
              size={13}
              color={Colors.gray}
              style={{ marginRight: 4, marginTop: 1 }}
            />
            <Text style={styles.addressText} numberOfLines={2}>
              {item.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerWrap}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      );
    }
    if (
      !initialLoading &&
      profiles.length > 0 &&
      !pagination.hasNextPage
    ) {
      return (
        <Text style={styles.endOfList}>
          You&apos;ve reached the end ({pagination.total} business
          {pagination.total === 1 ? "" : "es"}).
        </Text>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (initialLoading) return null;
    if (error) {
      return (
        <View style={styles.emptyWrap}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={Colors.red}
          />
          <Text style={styles.emptyTitle}>Couldn&apos;t load businesses</Text>
          <Text style={styles.emptyMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchPage(1, "initial")}
            activeOpacity={0.85}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIconWrap}>
          <Ionicons
            name="storefront-outline"
            size={48}
            color={Colors.primary}
          />
        </View>
        <Text style={styles.emptyTitle}>No businesses yet</Text>
        <Text style={styles.emptyMessage}>
          {searchQuery.trim() || selectedCategory
            ? "Try adjusting your search or category filter."
            : "Approved businesses within 50 km of your selected location will appear here."}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Businesses</Text>
        {!initialLoading && profiles.length > 0 ? (
          <Text style={styles.headerSubtitle}>
            {pagination.total} nearby
          </Text>
        ) : null}
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Ionicons
              name="search"
              size={18}
              color="#8B95A6"
              style={styles.searchIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search business name"
              placeholderTextColor="#8B95A6"
              style={styles.searchInput}
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={handleClearSearch} hitSlop={10}>
                <Ionicons name="close-circle" size={18} color="#8B95A6" />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedCategory && styles.filterButtonActive,
            ]}
            activeOpacity={0.85}
            onPress={() => setShowCategorySheet(true)}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={selectedCategory ? Colors.white : Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {selectedCategory ? (
          <View style={styles.filterChipRow}>
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText} numberOfLines={1}>
                {selectedCategory.name}
              </Text>
              <TouchableOpacity onPress={handleResetCategory} hitSlop={10}>
                <Ionicons name="close" size={15} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>

      {initialLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={
            profiles.length === 0
              ? styles.flatListEmpty
              : styles.flatListContent
          }
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      <CategoryPickerSheet
        visible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSelect={handleSelectCategory}
        categories={categoryItems}
        loading={categoriesLoading}
        error={categoriesError}
        selectedId={selectedCategory?._id ?? null}
        onRetry={() => dispatch(fetchBusinessCategories())}
        showReset
        onReset={handleResetCategory}
        title="Filter by business category"
        subtitle="Choose a category to narrow the business list"
      />
    </SafeAreaView>
  );
};

export default BusinessTabScreen;

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
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.black,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.gray,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputWrap: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2EAFF",
    backgroundColor: "#F8FAFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    fontSize: 14,
    color: Colors.black,
    paddingVertical: 0,
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#E2EAFF",
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  filterChip: {
    maxWidth: "100%",
    minHeight: 32,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    borderWidth: 1,
    borderColor: "#D8E6FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  filterChipText: {
    maxWidth: 220,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
    marginRight: 6,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  flatListEmpty: {
    flexGrow: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E2EAFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: "#F4F7FF",
  },
  thumbPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  businessName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
  categoryText: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: "600",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 18,
  },
  footerWrap: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  endOfList: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.gray,
    paddingVertical: 16,
  },

  // Empty / error state
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
    marginTop: 12,
    marginBottom: 6,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
