import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchAdminDashboard } from "../../../redux/slices/adminSlice";
import { logoutUser, clearAuth } from "../../../redux/slices/authSlice";
import { Colors } from "../../../utils";

const ADMIN_ACCENT = "#1E40AF";
const ADMIN_LIGHT = "#EFF6FF";

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, bg }) => (
  <View style={[styles.statCard, { backgroundColor: bg }]}>
    <View style={[styles.statIconBox, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon as any} size={22} color={color} />
    </View>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Row item ─────────────────────────────────────────────────────────────────
interface RecentRowProps {
  left: string;
  right: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
  onPress?: () => void;
}

const RecentRow: React.FC<RecentRowProps> = ({ left, right, sub, badge, badgeColor, onPress }) => (
  <TouchableOpacity style={styles.recentRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
    <View style={styles.recentLeft}>
      <Text style={styles.recentMain} numberOfLines={1}>{left}</Text>
      {sub ? <Text style={styles.recentSub} numberOfLines={1}>{sub}</Text> : null}
    </View>
    <View style={styles.recentRight}>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: (badgeColor || Colors.primary) + "20" }]}>
          <Text style={[styles.badgeText, { color: badgeColor || Colors.primary }]}>{badge}</Text>
        </View>
      ) : (
        <Text style={styles.recentSub}>{right}</Text>
      )}
    </View>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { dashboardStats, recentUsers, recentJobs, dashboardLoading, dashboardError } =
    useSelector((state: RootState) => state.admin);

  const load = useCallback(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => {
      dispatch(clearAuth());
    });
  };

  const getVerificationBadgeColor = (status: string) => {
    switch (status) {
      case "approved": return Colors.green;
      case "rejected": return Colors.Red;
      case "under_review": return Colors.orange;
      default: return Colors.gray;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open": return Colors.green;
      case "in-progress": return Colors.primary;
      case "completed": return Colors.gray;
      case "cancelled": return Colors.Red;
      default: return Colors.gray;
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSub}>Welcome, {user?.profile?.fullName || "Admin"}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color={ADMIN_ACCENT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={dashboardLoading} onRefresh={load} colors={[ADMIN_ACCENT]} />}
      >
        {dashboardError ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={Colors.Red} />
            <Text style={styles.errorText}>{dashboardError}</Text>
          </View>
        ) : null}

        {/* Stat Cards */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Total Users" value={dashboardStats?.totalUsers ?? 0} icon="people-outline" color={ADMIN_ACCENT} bg={ADMIN_LIGHT} />
          <StatCard label="Total Jobs" value={dashboardStats?.totalJobs ?? 0} icon="briefcase-outline" color="#7C3AED" bg="#F5F3FF" />
          <StatCard label="Active Jobs" value={dashboardStats?.activeJobs ?? 0} icon="checkmark-circle-outline" color={Colors.green} bg={Colors.lightMintGreen} />
          <StatCard label="Verified Users" value={dashboardStats?.verifiedUsers ?? 0} icon="shield-checkmark-outline" color="#0891B2" bg="#E0F7FA" />
          <StatCard label="Pending Reviews" value={dashboardStats?.pendingVerifications ?? 0} icon="time-outline" color={Colors.orange} bg="#FFF3E0" />
        </View>

        {/* Recent Users */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Users</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate("AdminUsersTab")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {recentUsers.length === 0 && !dashboardLoading ? (
            <Text style={styles.emptyText}>No users yet</Text>
          ) : (
            recentUsers.map((u, i) => (
              <RecentRow
                key={u.id ?? i}
                left={u.fullName || u.phoneNumber}
                sub={u.phoneNumber}
                right=""
                badge={u.verificationStatus || "not_submitted"}
                badgeColor={getVerificationBadgeColor(u.verificationStatus || "")}
                onPress={() => (navigation as any).navigate("AdminUserDetailScreen", { userId: u.id })}
              />
            ))
          )}
        </View>

        {/* Recent Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Jobs</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate("AdminJobsTab")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {recentJobs.length === 0 && !dashboardLoading ? (
            <Text style={styles.emptyText}>No jobs yet</Text>
          ) : (
            recentJobs.map((j, i) => (
              <RecentRow
                key={j.id ?? i}
                left={j.title}
                sub={`By: ${j.postedBy?.fullName || "Unknown"}`}
                right=""
                badge={j.status}
                badgeColor={getStatusBadgeColor(j.status)}
                onPress={() => (navigation as any).navigate("AdminJobDetailScreen", { jobId: j.id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;

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
    fontSize: 22,
    fontWeight: "700",
    color: ADMIN_ACCENT,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  logoutBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: ADMIN_LIGHT,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.Red,
    fontSize: 14,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 13,
    color: ADMIN_ACCENT,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: "47%",
    borderRadius: 14,
    padding: 16,
    alignItems: "flex-start",
    gap: 8,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: "500",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  recentLeft: {
    flex: 1,
    marginRight: 8,
  },
  recentRight: {
    alignItems: "flex-end",
  },
  recentMain: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
  },
  recentSub: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.gray,
    padding: 20,
    fontSize: 14,
  },
});
