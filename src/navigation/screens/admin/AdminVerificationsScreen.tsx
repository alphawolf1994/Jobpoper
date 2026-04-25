import React, { useEffect, useCallback, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchAdminVerifications, AdminUser } from "../../../redux/slices/adminSlice";
import { Colors } from "../../../utils";

const ADMIN_ACCENT = "#1E40AF";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":     return Colors.green;
    case "rejected":     return Colors.Red;
    case "under_review": return Colors.orange;
    default:             return Colors.gray;
  }
};
const getStatusIcon = (status: string): string => {
  switch (status) {
    case "approved":     return "checkmark-circle";
    case "rejected":     return "close-circle";
    case "under_review": return "time";
    default:             return "help-circle-outline";
  }
};

// ─── Verification Row ─────────────────────────────────────────────────────────
// Verifications endpoint returns: { ...buildAdminUser(), verification: buildVerificationPayload() }
// Flat fields from buildAdminUser: id, fullName, verificationStatus, phoneNumber
// Plus nested: verification.submittedAt, verification.status
interface VerRowProps { user: AdminUser; onPress: () => void; }

const VerRow: React.FC<VerRowProps> = ({ user, onPress }) => {
  // Use nested verification.status if present, fall back to flat verificationStatus
  const status = user.verification?.status || user.verificationStatus || "not_submitted";
  const color  = getStatusColor(status);
  const icon   = getStatusIcon(status);
  const submittedAt = user.verification?.submittedAt
    ? new Date(user.verification.submittedAt).toLocaleDateString()
    : null;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.statusIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>

      <View style={styles.rowInfo}>
        {/* fullName is a flat field from buildAdminUser */}
        <Text style={styles.rowName} numberOfLines={1}>
          {user.fullName || user.phoneNumber}
        </Text>
        <Text style={styles.rowPhone}>{user.phoneNumber}</Text>
        {submittedAt && <Text style={styles.rowDate}>Submitted: {submittedAt}</Text>}
      </View>

      <View style={styles.rowRight}>
        <View style={[styles.badge, { backgroundColor: color + "20" }]}>
          <Text style={[styles.badgeText, { color }]}>
            {status.replace(/_/g, " ")}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.gray} style={{ marginTop: 6 }} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
type FilterType = "all" | "under_review" | "approved" | "rejected";

const AdminVerificationsScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useDispatch<AppDispatch>();
  const { verifications, verificationsLoading, verificationsError } = useSelector(
    (state: RootState) => state.admin
  );
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const load = useCallback(() => { dispatch(fetchAdminVerifications()); }, [dispatch]);
  useEffect(() => { load(); }, [load]);

  const filtered = verifications.filter((u) => {
    // Use nested verification.status OR flat verificationStatus
    const status = u.verification?.status || u.verificationStatus || "not_submitted";
    const matchSearch =
      !search.trim() ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.phoneNumber?.includes(search);
    const matchFilter = activeFilter === "all" || status === activeFilter;
    return matchSearch && matchFilter;
  });

  const getCount = (key: FilterType) => {
    if (key === "all") return verifications.length;
    return verifications.filter(
      (u) => (u.verification?.status || u.verificationStatus) === key
    ).length;
  };

  const filters: { key: FilterType; label: string; color: string }[] = [
    { key: "all",          label: "All",      color: Colors.gray   },
    { key: "under_review", label: "Pending",  color: Colors.orange },
    { key: "approved",     label: "Approved", color: Colors.green  },
    { key: "rejected",     label: "Rejected", color: Colors.Red    },
  ];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verifications</Text>
        <Text style={styles.headerCount}>{verifications.length} total</Text>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterPill, activeFilter === f.key && { backgroundColor: f.color, borderColor: f.color }]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, activeFilter === f.key && { color: Colors.white }]}>
              {f.label} ({getCount(f.key)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor={Colors.gray}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {verificationsError ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.Red} />
          <Text style={styles.errorText}>{verificationsError}</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VerRow
            user={item}
            onPress={() =>
              (navigation as any).navigate("AdminVerificationDetailScreen", { userId: item.id })
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={verificationsLoading} onRefresh={load} colors={[ADMIN_ACCENT]} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !verificationsLoading ? (
            <View style={styles.emptyBox}>
              <Ionicons name="shield-outline" size={48} color={Colors.lightGray} />
              <Text style={styles.emptyText}>
                {search || activeFilter !== "all"
                  ? "No matching verifications"
                  : "No verification requests"}
              </Text>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default AdminVerificationsScreen;

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#F8FAFF" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  headerTitle:  { fontSize: 22, fontWeight: "700", color: ADMIN_ACCENT },
  headerCount:  { fontSize: 13, color: Colors.gray, fontWeight: "500" },
  filterRow: {
    flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 8,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  filterPill: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.lightGray, backgroundColor: Colors.white,
  },
  filterText: { fontSize: 12, fontWeight: "600", color: Colors.gray },
  searchWrap: {
    flexDirection: "row", alignItems: "center", margin: 16, marginBottom: 8,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray,
  },
  searchIcon:  { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.black, padding: 0 },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FEE2E2",
    borderRadius: 10, padding: 12, marginHorizontal: 16, marginBottom: 8,
  },
  errorText: { color: Colors.Red, fontSize: 14, flex: 1 },
  list:  { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  row: {
    flexDirection: "row", alignItems: "center", backgroundColor: Colors.white,
    borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  statusIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 12 },
  rowInfo:    { flex: 1, marginRight: 8 },
  rowName:    { fontSize: 15, fontWeight: "600", color: Colors.black },
  rowPhone:   { fontSize: 12, color: Colors.gray, marginTop: 2 },
  rowDate:    { fontSize: 11, color: Colors.darkGray, marginTop: 2 },
  rowRight:   { alignItems: "flex-end" },
  badge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText:  { fontSize: 10, fontWeight: "600", textTransform: "capitalize" },
  separator:  { height: 8 },
  emptyBox:   { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 },
  emptyText:  { fontSize: 15, color: Colors.gray },
});
