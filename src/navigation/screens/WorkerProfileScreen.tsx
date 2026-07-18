import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppDispatch, RootState } from "../../redux/store";
import { getWorkerReviews, clearWorkerReviews } from "../../redux/slices/jobVerificationSlice";
import { Colors, formatDateDDMMYYYY } from "../../utils";
import { IMAGE_BASE_URL } from "../../api/baseURL";
import Header from "../../components/Header";
import { WorkerReview } from "../../interface/interfaces";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const resolveImage = (uri?: string | null) => {
  if (!uri) return null;
  if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
  return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
};

const getVerificationColor = (status?: string) => {
  switch (status) {
    case "approved":
      return Colors.green;
    case "rejected":
      return Colors.Red;
    case "under_review":
      return Colors.orange;
    default:
      return Colors.gray;
  }
};

const getVerificationLabel = (status?: string) => {
  switch (status) {
    case "approved":
      return "Verified";
    case "rejected":
      return "Verification rejected";
    case "under_review":
      return "Verification pending";
    default:
      return "Not verified";
  }
};

const StarRating = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: "row", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Ionicons
        key={s}
        name={s <= Math.round(rating) ? "star" : "star-outline"}
        size={size}
        color="#F59E0B"
      />
    ))}
  </View>
);

const WorkerProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { workerId, workerName, workerImage } = route.params || {};

  const {
    workerReviews,
    workerReviewsLoading,
    workerReviewsError,
    workerReviewsPagination,
    workerReviewsWorkerInfo,
  } = useSelector((state: RootState) => state.jobVerification);

  const [page, setPage] = useState(1);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearWorkerReviews());
    if (workerId) {
      setPage(1);
      dispatch(getWorkerReviews({ userId: workerId, page: 1, limit: 10 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerId]);

  const handleLoadMore = () => {
    if (workerReviewsPagination?.hasNextPage && !workerReviewsLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(getWorkerReviews({ userId: workerId, page: nextPage, limit: 10 }));
    }
  };

  const displayName = workerReviewsWorkerInfo?.fullName || workerName || "Worker";
  const displayImage = resolveImage(workerReviewsWorkerInfo?.profileImage || workerImage);
  const rating = workerReviewsWorkerInfo?.rating ?? { average: 0, count: 0 };
  const displayWorkerId = workerReviewsWorkerInfo?.workerId;
  const professionalProfile = workerReviewsWorkerInfo?.professionalProfile;
  const workImages = (professionalProfile?.workImages || []).filter(Boolean) as string[];
  const serviceCategoryNames = (professionalProfile?.serviceCategories || [])
    .map((c: any) => c?.name)
    .filter(Boolean);
  const verificationStatus = workerReviewsWorkerInfo?.verification?.status;

  const renderReview = ({ item }: { item: WorkerReview }) => {
    const reviewerImage = resolveImage(item.reviewerId?.profile?.profileImage);
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          {reviewerImage ? (
            <Image source={{ uri: reviewerImage }} style={styles.reviewerAvatar} />
          ) : (
            <View style={[styles.reviewerAvatar, styles.reviewerAvatarPlaceholder]}>
              <Ionicons name="person" size={16} color={Colors.gray} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewerName} numberOfLines={1}>
              {item.reviewerId?.profile?.fullName || "Customer"}
            </Text>
            <View style={styles.reviewMetaRow}>
              <StarRating rating={item.rating} size={12} />
              {item.createdAt ? (
                <Text style={styles.reviewDate}>{formatDateDDMMYYYY(item.createdAt)}</Text>
              ) : null}
            </View>
          </View>
        </View>
        {item.comment ? <Text style={styles.reviewComment}>{item.comment}</Text> : null}
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <TouchableOpacity
        activeOpacity={displayImage ? 0.85 : 1}
        disabled={!displayImage}
        onPress={() => displayImage && setViewingImage(displayImage)}
        style={styles.profileHeader}
      >
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={36} color={Colors.gray} />
          </View>
        )}
        <Text style={styles.name}>{displayName}</Text>
        {displayWorkerId ? <Text style={styles.workerIdText}>ID: {displayWorkerId}</Text> : null}
        <View style={styles.ratingRow}>
          <StarRating rating={rating.average} size={18} />
          <Text style={styles.ratingText}>
            {(rating.average ?? 0).toFixed(1)} · {rating.count ?? 0} review
            {rating.count !== 1 ? "s" : ""}
          </Text>
        </View>
        {verificationStatus ? (
          <View style={styles.verifyBadge}>
            <Ionicons
              name={verificationStatus === "approved" ? "checkmark-circle" : "shield-outline"}
              size={14}
              color={getVerificationColor(verificationStatus)}
            />
            <Text style={[styles.verifyBadgeText, { color: getVerificationColor(verificationStatus) }]}>
              {getVerificationLabel(verificationStatus)}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>

      {(professionalProfile?.bio ||
        professionalProfile?.yearsOfExperience != null ||
        serviceCategoryNames.length > 0) && (
        <View style={styles.detailsSection}>
          {professionalProfile?.yearsOfExperience != null && (
            <View style={styles.detailRow}>
              <Ionicons name="briefcase-outline" size={16} color={Colors.gray} />
              <Text style={styles.detailText}>
                {professionalProfile.yearsOfExperience} year
                {professionalProfile.yearsOfExperience === 1 ? "" : "s"} of experience
              </Text>
            </View>
          )}
          {serviceCategoryNames.length > 0 && (
            <View style={styles.chipsRow}>
              {serviceCategoryNames.map((name: string, idx: number) => (
                <View key={idx} style={styles.chip}>
                  <Text style={styles.chipText}>{name}</Text>
                </View>
              ))}
            </View>
          )}
          {professionalProfile?.bio ? (
            <Text style={styles.bioText}>{professionalProfile.bio}</Text>
          ) : null}
        </View>
      )}

      {workImages.length > 0 && (
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Work Photos ({workImages.length})</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.workImagesRow}
          >
            {workImages.map((img, idx) => {
              const resolved = resolveImage(img);
              if (!resolved) return null;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.85}
                  onPress={() => setViewingImage(resolved)}
                  style={styles.workImageWrap}
                >
                  <Image source={{ uri: resolved }} style={styles.workImageThumb} resizeMode="cover" />
                  <View style={styles.workImageExpandHint}>
                    <Ionicons name="expand-outline" size={14} color={Colors.white} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={styles.reviewsSectionTitle}>
        <Text style={styles.sectionTitle}>Reviews</Text>
      </View>

      {workerReviewsLoading && (workerReviews?.length ?? 0) === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : workerReviewsError ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="warning-outline" size={40} color={Colors.gray} />
          <Text style={styles.emptyText}>{workerReviewsError}</Text>
        </View>
      ) : (workerReviews?.length ?? 0) === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="star-outline" size={48} color={Colors.gray} />
          <Text style={styles.emptyText}>No reviews yet</Text>
        </View>
      ) : null}
    </>
  );

  return (
    <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.container}>
      <Header />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Worker Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={workerReviews}
        keyExtractor={(item) => item._id}
        renderItem={renderReview}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={
          workerReviewsLoading && page > 1 ? (
            <ActivityIndicator style={{ marginVertical: 16 }} color={Colors.primary} />
          ) : null
        }
      />

      {viewingImage && (
        <Modal transparent animationType="fade" onRequestClose={() => setViewingImage(null)}>
          <View style={styles.imageViewerBg}>
            <TouchableOpacity
              style={styles.imageViewerClose}
              onPress={() => setViewingImage(null)}
              hitSlop={12}
            >
              <Ionicons name="close" size={28} color={Colors.white} />
            </TouchableOpacity>
            <Image source={{ uri: viewingImage }} style={styles.imageViewerImg} resizeMode="contain" />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default WorkerProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.black,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.black,
  },
  workerIdText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: "500",
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  ratingText: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: "500",
  },
  verifyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  verifyBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 13,
    color: Colors.black,
    fontWeight: "500",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  bioText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 10,
  },
  reviewsSectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  workImagesRow: {
    flexDirection: "row",
    gap: 10,
  },
  workImageWrap: {
    position: "relative",
  },
  workImageThumb: {
    width: 110,
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  workImageExpandHint: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 10,
    padding: 4,
  },
  imageViewerBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageViewerClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  imageViewerImg: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 12,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  reviewerAvatarPlaceholder: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
  },
  reviewMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: Colors.gray,
  },
  reviewComment: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },
});
