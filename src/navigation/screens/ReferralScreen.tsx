import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Share,
  Platform,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../utils";
import { IMAGE_BASE_URL } from "../../api/baseURL";
import ImagePath from "../../assets/images/ImagePath";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchReferralSummary, fetchMyReferrals } from "../../redux/slices/referralSlice";
import { ReferredUser } from "../../interface/interfaces";
import { formatDateDDMMYYYY } from "../../utils/dateUtils";

const PAGE_SIZE = 20;

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  verified: { label: "Verified", color: "#059669", bg: "#ECFDF5" },
  not_verified: { label: "Not Verified", color: "#B45309", bg: "#FFFBEB" },
};

const resolveImageUri = (uri?: string | null) => {
  if (!uri) return null;
  if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
  return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
};

const ReferralScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const referralCodeFromAuth = useSelector(
    (s: RootState) => s.auth.user?.referralCode
  );
  const {
    referralCode,
    totalReferrals,
    referrals,
    page,
    hasMore,
    loading,
    loadingMore,
    error,
  } = useSelector((s: RootState) => s.referral);

  const [copied, setCopied] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const code = referralCode || referralCodeFromAuth || null;

  const loadFirstPage = useCallback(() => {
    dispatch(fetchReferralSummary());
    dispatch(fetchMyReferrals({ page: 1, limit: PAGE_SIZE }));
  }, [dispatch]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchReferralSummary()),
      dispatch(fetchMyReferrals({ page: 1, limit: PAGE_SIZE })),
    ]);
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (hasMore && !loadingMore && !loading) {
      dispatch(fetchMyReferrals({ page: page + 1, limit: PAGE_SIZE }));
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    if (!code) return;
    const extra: any = Constants.expoConfig?.extra || {};
    const playUrl =
      extra.playStoreUrl ||
      "https://play.google.com/store/apps/details?id=com.anonymous.Jobpoper";
    const appStoreUrl =
      extra.appStoreUrl || "https://apps.apple.com/app/6756342047";

    const message =
      `Join me on MakeMy Task!\n\n` +
      `Use my referral code ${code} when you create your account.\n\n` +
      `Download the app:\n` +
      `Android → ${playUrl}\n` +
      `iPhone → ${appStoreUrl}`;

    try {
      await Share.share({ message });
    } catch (e) {
      if (Platform.OS === "android") {
        ToastAndroid.show("Could not open share sheet.", ToastAndroid.SHORT);
      }
    }
  };

  const renderRow = ({ item }: { item: ReferredUser }) => {
    const img = resolveImageUri(item.profileImage);
    const statusKey =
      item.isVerified === true || item.accountStatus === "verified"
        ? "verified"
        : "not_verified";
    const status = STATUS_META[statusKey];
    return (
      <View style={styles.row}>
        <Image
          source={img ? { uri: img } : ImagePath.avatarIcon}
          style={styles.avatar}
        />
        <View style={styles.rowBody}>
          <Text style={styles.rowName} numberOfLines={1}>
            {item.fullName || "MakeMy Task user"}
          </Text>
          {item.email ? (
            <Text style={styles.rowMeta} numberOfLines={1}>
              {item.email}
            </Text>
          ) : null}
          {item.phoneNumber ? (
            <Text style={styles.rowMeta} numberOfLines={1}>
              {item.phoneNumber}
            </Text>
          ) : null}
          <Text style={styles.rowDate}>
            Joined {formatDateDDMMYYYY(item.registeredAt)}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: status.bg }]}>
          <Text style={[styles.pillText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>
    );
  };

  const ListHeader = (
    <View>
      {/* Section 1 — My Referral Code */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Your referral code</Text>
        {code ? (
          <Text style={styles.code}>{code}</Text>
        ) : (
          <Text style={styles.codePlaceholder}>Generating your code…</Text>
        )}
        <Text style={styles.cardDesc}>
          Share this code with friends or team members. They can enter it while
          creating their account to connect with your referral network.
        </Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnGhost]}
            activeOpacity={0.7}
            onPress={handleCopy}
            disabled={!code}
          >
            <Ionicons
              name={copied ? "checkmark-circle" : "copy-outline"}
              size={18}
              color={copied ? "#059669" : Colors.primary}
            />
            <Text
              style={[
                styles.actionBtnGhostText,
                copied && { color: "#059669" },
              ]}
            >
              {copied ? "Copied" : "Copy"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            activeOpacity={0.8}
            onPress={handleShare}
            disabled={!code}
          >
            <Ionicons name="share-social-outline" size={18} color={Colors.white} />
            <Text style={styles.actionBtnPrimaryText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 2 — header */}
      <View style={styles.section2Header}>
        <Text style={styles.section2Title}>Referred Users</Text>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{totalReferrals}</Text>
        </View>
      </View>
    </View>
  );

  const ListEmpty = loading ? (
    <View style={styles.skeletonWrap}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.skeletonRow}>
          <View style={styles.skeletonAvatar} />
          <View style={{ flex: 1 }}>
            <View style={[styles.skeletonLine, { width: "60%" }]} />
            <View style={[styles.skeletonLine, { width: "40%" }]} />
          </View>
        </View>
      ))}
    </View>
  ) : error ? (
    <View style={styles.stateWrap}>
      <Ionicons name="warning-outline" size={44} color="#DC2626" />
      <Text style={styles.stateText}>{error}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={loadFirstPage} activeOpacity={0.7}>
        <Text style={styles.retryText}>Try again</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.stateWrap}>
      <Ionicons name="people-outline" size={48} color="#CBD5E1" />
      <Text style={styles.emptyTitle}>No referrals yet</Text>
      <Text style={styles.emptyBody}>
        When someone creates an account using your referral code, they will
        appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation as any).goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referral Program</Text>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={referrals}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 16 }} color={Colors.primary} />
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F9FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: Colors.black },
  listContent: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLabel: { fontSize: 13, fontWeight: "600", color: Colors.gray, marginBottom: 8 },
  code: { fontSize: 30, fontWeight: "700", letterSpacing: 4, color: Colors.primary },
  codePlaceholder: { fontSize: 18, fontWeight: "600", color: Colors.gray },
  cardDesc: { fontSize: 13, color: Colors.gray, lineHeight: 19, marginTop: 10 },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionBtnGhost: { backgroundColor: "#EFF3FF", borderWidth: 1, borderColor: "#DBE4FF" },
  actionBtnGhostText: { color: Colors.primary, fontWeight: "700", fontSize: 14 },
  actionBtnPrimary: { backgroundColor: Colors.primary },
  actionBtnPrimaryText: { color: Colors.white, fontWeight: "700", fontSize: 14 },

  section2Header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
    gap: 10,
  },
  section2Title: { fontSize: 16, fontWeight: "700", color: Colors.black },
  countPill: {
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  countPillText: { color: Colors.primary, fontWeight: "700", fontSize: 12 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E5E7EB" },
  rowBody: { flex: 1, marginLeft: 12 },
  rowName: { fontSize: 15, fontWeight: "600", color: Colors.black },
  rowMeta: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  rowDate: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 6 },
  pillText: { fontSize: 11, fontWeight: "700" },

  stateWrap: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 24 },
  stateText: { marginTop: 12, color: Colors.gray, textAlign: "center" },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: "700", color: Colors.black },
  emptyBody: { marginTop: 6, fontSize: 13, color: Colors.gray, textAlign: "center", lineHeight: 19 },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#EFF3FF",
  },
  retryText: { color: Colors.primary, fontWeight: "700" },

  skeletonWrap: { marginTop: 4 },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  skeletonAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#EDF1F7", marginRight: 12 },
  skeletonLine: { height: 10, borderRadius: 6, backgroundColor: "#EDF1F7", marginVertical: 4 },
});

export default ReferralScreen;
