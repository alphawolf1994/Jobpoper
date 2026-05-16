import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Colors } from "../../../utils";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  AdminBusinessApprovalRequest,
  fetchAdminApprovedBusinessProfiles,
  fetchAdminBusinessApprovalRequests,
} from "../../../redux/slices/adminSlice";

const ADMIN_ACCENT = "#1E40AF";

type TabKey = "pending" | "approved";

const formatSubmittedDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ─── Row ──────────────────────────────────────────────────────────────────────

interface BusinessRowProps {
  item: AdminBusinessApprovalRequest;
  tab: TabKey;
  onPress: () => void;
}

const BusinessRow: React.FC<BusinessRowProps> = ({ item, tab, onPress }) => {
  const userName = item.user?.fullName || item.user?.phoneNumber || "Unknown user";
  // On the Approved tab `submittedAt` is still the original submission date,
  // so we surface `updatedAt` (which the backend bumps on review) as the
  // "Approved on" date. Falls back to submittedAt if updatedAt is missing.
  const isApprovedTab = tab === "approved";
  const dateLabel = isApprovedTab ? "Approved" : "Submitted";
  const dateValue = isApprovedTab
    ? formatSubmittedDate(item.updatedAt || item.submittedAt)
    : formatSubmittedDate(item.submittedAt);

  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={onPress}>
      <View
        style={[
          styles.iconWrap,
          isApprovedTab && { backgroundColor: "#ECFDF5" },
        ]}
      >
        <Ionicons
          name={isApprovedTab ? "checkmark-circle-outline" : "storefront-outline"}
          size={22}
          color={isApprovedTab ? "#059669" : ADMIN_ACCENT}
        />
      </View>

      <View style={styles.rowInfo}>
        <Text style={styles.businessName} numberOfLines={1}>
          {item.businessName}
        </Text>
        <Text style={styles.userName} numberOfLines={1}>
          User: {userName}
        </Text>
        <Text style={styles.submittedDate}>
          {dateLabel}: {dateValue}
        </Text>
      </View>

      <View
        style={[
          styles.badge,
          isApprovedTab ? styles.badgeApproved : styles.badgePending,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            isApprovedTab ? styles.badgeTextApproved : styles.badgeTextPending,
          ]}
        >
          {isApprovedTab ? "Approved" : "Pending"}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={Colors.gray}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const AdminBusinessApprovalsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState<TabKey>("pending");

  // Tracks whether we've fetched the approved list at least once during this
  // session, so we can fetch lazily on first tab switch but still let the user
  // pull-to-refresh thereafter.
  const approvedFetchedRef = useRef(false);

  const {
    businessApprovalRequests,
    businessApprovalsLoading,
    businessApprovalsError,
    approvedBusinessProfiles,
    approvedBusinessProfilesLoading,
    approvedBusinessProfilesError,
  } = useSelector((state: RootState) => state.admin);

  const loadPending = useCallback(() => {
    dispatch(fetchAdminBusinessApprovalRequests(100));
  }, [dispatch]);

  const loadApproved = useCallback(() => {
    approvedFetchedRef.current = true;
    dispatch(fetchAdminApprovedBusinessProfiles(100));
  }, [dispatch]);

  // Initial load: pending list (preserves previous behaviour on screen open).
  useEffect(() => {
    loadPending();
  }, [loadPending]);

  // Lazy load the approved list the first time the user opens that tab.
  useEffect(() => {
    if (activeTab === "approved" && !approvedFetchedRef.current) {
      loadApproved();
    }
  }, [activeTab, loadApproved]);

  const isApprovedTab = activeTab === "approved";

  const data = isApprovedTab
    ? approvedBusinessProfiles ?? []
    : businessApprovalRequests ?? [];

  const loading = isApprovedTab
    ? approvedBusinessProfilesLoading
    : businessApprovalsLoading;

  const error = isApprovedTab
    ? approvedBusinessProfilesError
    : businessApprovalsError;

  const reload = isApprovedTab ? loadApproved : loadPending;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Approvals</Text>
        <Text style={styles.headerCount}>
          {data.length} {isApprovedTab ? "approved" : "pending"}
        </Text>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabsRow}>
        <TabButton
          label="Pending"
          active={!isApprovedTab}
          onPress={() => setActiveTab("pending")}
        />
        <TabButton
          label="Approved"
          active={isApprovedTab}
          onPress={() => setActiveTab("approved")}
        />
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.Red} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={reload}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        // The key change forces FlatList to reset its internal state (scroll
        // position, item layouts) when switching tabs. Without it, scrolling
        // far down in one tab leaves the other tab scrolled to the same offset.
        key={activeTab}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusinessRow
            item={item}
            tab={activeTab}
            onPress={() =>
              navigation.navigate("AdminBusinessApprovalDetailScreen", {
                profile: item,
              })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={reload}
            colors={[ADMIN_ACCENT]}
          />
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyBox}>
              <ActivityIndicator size="large" color={ADMIN_ACCENT} />
              <Text style={styles.emptyText}>
                Loading {isApprovedTab ? "approved businesses" : "approval requests"}...
              </Text>
            </View>
          ) : !error ? (
            <View style={styles.emptyBox}>
              <Ionicons
                name={
                  isApprovedTab
                    ? "checkmark-done-circle-outline"
                    : "checkmark-circle-outline"
                }
                size={50}
                color={Colors.lightGray}
              />
              <Text style={styles.emptyText}>
                {isApprovedTab
                  ? "No approved businesses yet"
                  : "No pending business approval requests"}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

// ─── Tab button ───────────────────────────────────────────────────────────────

interface TabButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.tabButtonActive]}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default AdminBusinessApprovalsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    flex: 1,
    fontSize: 21,
    fontWeight: "700",
    color: ADMIN_ACCENT,
    marginRight: 12,
  },
  headerCount: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: "600",
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabButtonActive: {
    backgroundColor: ADMIN_ACCENT,
    borderColor: ADMIN_ACCENT,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: ADMIN_ACCENT,
  },
  tabLabelActive: {
    color: Colors.white,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  errorText: {
    color: Colors.Red,
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: Colors.Red,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  retryText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "800",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2EAFF",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowInfo: {
    flex: 1,
    marginRight: 8,
  },
  businessName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.black,
  },
  userName: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 3,
  },
  submittedDate: {
    fontSize: 11,
    color: Colors.darkGray,
    marginTop: 3,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  badgePending: {
    backgroundColor: "#FFF3E0",
  },
  badgeApproved: {
    backgroundColor: "#DCFCE7",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeTextPending: {
    color: Colors.orange,
  },
  badgeTextApproved: {
    color: "#047857",
  },
  chevron: {
    marginLeft: 8,
  },
  separator: {
    height: 10,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
    paddingHorizontal: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: Colors.gray,
    textAlign: "center",
  },
});
