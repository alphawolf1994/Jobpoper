import React, { useEffect, useCallback, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchAdminJobs, AdminJob } from "../../../redux/slices/adminSlice";
import { Colors } from "../../../utils";

const ADMIN_ACCENT = "#1E40AF";

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":        return Colors.green;
    case "in-progress": return Colors.primary;
    case "completed":   return Colors.gray;
    case "cancelled":   return Colors.Red;
    default:            return Colors.gray;
  }
};
const getUrgencyColor = (u: string) => (u === "Urgent" ? Colors.Red : Colors.orange);

// ─── Job Row ──────────────────────────────────────────────────────────────────
// API returns buildAdminJob() with flat fields: id, postedBy.fullName (NOT postedBy.profile.fullName)
interface JobRowProps { job: AdminJob; onPress: () => void; }

const JobRow: React.FC<JobRowProps> = ({ job, onPress }) => {
  const statusColor  = getStatusColor(job.status);
  const urgencyColor = getUrgencyColor(job.urgency);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.jobIcon, { backgroundColor: urgencyColor + "20" }]}>
        <Ionicons
          name={job.urgency === "Urgent" ? "flash" : "briefcase-outline"}
          size={20}
          color={urgencyColor}
        />
      </View>

      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle} numberOfLines={1}>{job.title}</Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {/* postedBy.fullName is FLAT - NOT profile.fullName */}
          By: {job.postedBy?.fullName || "Unknown"}
        </Text>
        {/* Cost · Type · Category — single-line meta row */}
        <Text
          style={styles.rowMeta}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {job.cost || "—"}
          {` · ${job.jobType || "OnSite"}`}
          {job.category && typeof job.category === "object" && job.category.name
            ? ` · ${job.category.name}`
            : ""}
        </Text>
      </View>

      <View style={styles.rowBadges}>
        <View style={[styles.badge, { backgroundColor: statusColor + "20" }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{job.status}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: urgencyColor + "20", marginTop: 4 }]}>
          <Text style={[styles.badgeText, { color: urgencyColor }]}>{job.urgency}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AdminJobsScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useDispatch<AppDispatch>();
  const { jobs, jobsLoading, jobsError } = useSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");

  const load = useCallback(() => { dispatch(fetchAdminJobs(100)); }, [dispatch]);
  useEffect(() => { load(); }, [load]);

  const filtered = search.trim()
    ? jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(search.toLowerCase()) ||
          j.postedBy?.fullName?.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <Text style={styles.headerCount}>{jobs.length} total</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or poster name..."
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

      {jobsError ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.Red} />
          <Text style={styles.errorText}>{jobsError}</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobRow
            job={item}
            onPress={() => (navigation as any).navigate("AdminJobDetailScreen", { jobId: item.id })}
          />
        )}
        refreshControl={<RefreshControl refreshing={jobsLoading} onRefresh={load} colors={[ADMIN_ACCENT]} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !jobsLoading ? (
            <View style={styles.emptyBox}>
              <Ionicons name="briefcase-outline" size={48} color={Colors.lightGray} />
              <Text style={styles.emptyText}>
                {search ? "No tasks match your search" : "No tasks found"}
              </Text>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default AdminJobsScreen;

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#F8FAFF" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  headerTitle:  { fontSize: 22, fontWeight: "700", color: ADMIN_ACCENT },
  headerCount:  { fontSize: 13, color: Colors.gray, fontWeight: "500" },
  searchWrap: {
    flexDirection: "row", alignItems: "center", margin: 16, paddingHorizontal: 12,
    paddingVertical: 10, backgroundColor: Colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.lightGray,
  },
  searchIcon:  { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.black, padding: 0 },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FEE2E2",
    borderRadius: 10, padding: 12, marginHorizontal: 16, marginBottom: 8,
  },
  errorText: { color: Colors.Red, fontSize: 14, flex: 1 },
  list:      { paddingHorizontal: 16, paddingBottom: 20 },
  row: {
    flexDirection: "row", alignItems: "center", backgroundColor: Colors.white,
    borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  jobIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  rowInfo:   { flex: 1, marginRight: 8 },
  rowTitle:  { fontSize: 15, fontWeight: "600", color: Colors.black },
  rowSub:    { fontSize: 12, color: Colors.gray, marginTop: 2 },
  rowMeta: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 2,
  },
  rowBadges: { alignItems: "flex-end", marginRight: 8 },
  badge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: "600", textTransform: "capitalize" },
  separator: { height: 8 },
  emptyBox:  { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.gray },
});
