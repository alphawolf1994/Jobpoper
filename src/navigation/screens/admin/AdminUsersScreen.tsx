import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchAdminUsers, AdminUser } from "../../../redux/slices/adminSlice";
import { Colors } from "../../../utils";

const ADMIN_ACCENT = "#1E40AF";
const ADMIN_LIGHT = "#EFF6FF";
const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 350;

const getVerificationColor = (status: string) => {
  switch (status) {
    case "approved":     return Colors.green;
    case "rejected":     return Colors.Red;
    case "under_review": return Colors.orange;
    default:             return Colors.gray;
  }
};

// ─── User Row ─────────────────────────────────────────────────────────────────
interface UserRowProps {
  user: AdminUser;
  onPress: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onPress }) => {
  const verStatus = user.verificationStatus || "not_submitted";
  const verColor  = getVerificationColor(verStatus);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(user.fullName?.[0] || user.phoneNumber?.[0] || "U").toUpperCase()}
        </Text>
      </View>

      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>
          {user.fullName || user.phoneNumber}
        </Text>
        <Text style={styles.rowPhone}>{user.phoneNumber}</Text>
      </View>

      <View style={styles.rowBadges}>
        <View style={[styles.badge, { backgroundColor: verColor + "20" }]}>
          <Text style={[styles.badgeText, { color: verColor }]}>
            {verStatus.replace(/_/g, " ")}
          </Text>
        </View>
        {user.isProfessional && (
          <View style={[styles.badge, { backgroundColor: "#7C3AED20", marginTop: 4 }]}>
            <Text style={[styles.badgeText, { color: "#7C3AED" }]}>
              {user.rating?.count ? `★ ${user.rating.average.toFixed(1)}` : "professional"}
            </Text>
          </View>
        )}
        {user.role === "admin" && (
          <View style={[styles.badge, { backgroundColor: ADMIN_ACCENT + "20", marginTop: 4 }]}>
            <Text style={[styles.badgeText, { color: ADMIN_ACCENT }]}>admin</Text>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AdminUsersScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useDispatch<AppDispatch>();
  const {
    users = [],
    usersLoading = false,
    usersLoadingMore = false,
    usersError,
    usersHasMore = false,
    usersPage = 1,
    usersTotal = 0,
    usersCounts,
  } = useSelector((state: RootState) => state.admin);
  // Persisted admin state from older builds may not include these new fields yet.
  const counts = usersCounts ?? { users: 0, professionals: 0, all: 0 };

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "professionals">("users");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const loadPage = useCallback(
    (page: number) => {
      dispatch(
        fetchAdminUsers({
          page,
          limit: PAGE_SIZE,
          type: activeTab,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
        })
      );
    },
    [dispatch, activeTab, debouncedSearch]
  );

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const onRefresh = () => loadPage(1);

  const onEndReached = () => {
    if (usersHasMore && !usersLoading && !usersLoadingMore) {
      loadPage(usersPage + 1);
    }
  };

  const tabCountUsers = counts.users;
  const tabCountPros = counts.professionals;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
        <Text style={styles.headerCount}>{usersTotal} shown</Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "users" && styles.tabBtnActive]}
          onPress={() => setActiveTab("users")}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === "users" && styles.tabTextActive]}>
            Users
          </Text>
          <View style={[styles.tabCountPill, activeTab === "users" && styles.tabCountPillActive]}>
            <Text style={[styles.tabCountText, activeTab === "users" && styles.tabCountTextActive]}>
              {tabCountUsers}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "professionals" && styles.tabBtnActive]}
          onPress={() => setActiveTab("professionals")}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === "professionals" && styles.tabTextActive]}>
            Professionals
          </Text>
          <View style={[styles.tabCountPill, activeTab === "professionals" && styles.tabCountPillActive]}>
            <Text style={[styles.tabCountText, activeTab === "professionals" && styles.tabCountTextActive]}>
              {tabCountPros}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor={Colors.gray}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {usersError ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.Red} />
          <Text style={styles.errorText}>{usersError}</Text>
        </View>
      ) : null}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserRow
            user={item}
            onPress={() => (navigation as any).navigate("AdminUserDetailScreen", { userId: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={usersLoading} onRefresh={onRefresh} colors={[ADMIN_ACCENT]} />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          usersLoadingMore ? (
            <ActivityIndicator style={{ marginVertical: 16 }} color={ADMIN_ACCENT} />
          ) : null
        }
        ListEmptyComponent={
          !usersLoading ? (
            <View style={styles.emptyBox}>
              <Ionicons name="people-outline" size={48} color={Colors.lightGray} />
              <Text style={styles.emptyText}>
                {debouncedSearch
                  ? "No results match your search"
                  : activeTab === "professionals"
                  ? "No professionals found"
                  : "No users found"}
              </Text>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default AdminUsersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
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
  headerTitle:  { fontSize: 22, fontWeight: "700", color: ADMIN_ACCENT },
  headerCount:  { fontSize: 13, color: Colors.gray, fontWeight: "500" },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  tabBtnActive: { backgroundColor: ADMIN_ACCENT },
  tabText: { fontSize: 14, fontWeight: "600", color: Colors.gray },
  tabTextActive: { color: Colors.white },
  tabCountPill: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: ADMIN_LIGHT,
    alignItems: "center",
  },
  tabCountPillActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  tabCountText: { fontSize: 11, fontWeight: "700", color: ADMIN_ACCENT },
  tabCountTextActive: { color: Colors.white },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  searchIcon:  { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.black, padding: 0 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  errorText: { color: Colors.Red, fontSize: 14, flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ADMIN_ACCENT + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: "700", color: ADMIN_ACCENT },
  rowInfo:   { flex: 1, marginRight: 8 },
  rowName:   { fontSize: 15, fontWeight: "600", color: Colors.black },
  rowPhone:  { fontSize: 12, color: Colors.gray, marginTop: 2 },
  rowBadges: { alignItems: "flex-end", marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: "600", textTransform: "capitalize" },
  separator: { height: 8 },
  emptyBox: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.gray },
});
