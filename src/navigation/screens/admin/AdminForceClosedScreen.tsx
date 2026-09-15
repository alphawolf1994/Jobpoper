import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchAdminForceClosedJobs, AdminJob } from "../../../redux/slices/adminSlice";
import { Colors, formatDateDDMMYYYY } from "../../../utils";

const ADMIN_ACCENT = "#1E40AF";
const CLOSED_COLOR = "#991B1B";

interface RowProps {
  job: AdminJob;
  onPress: () => void;
}

const ForceClosedRow: React.FC<RowProps> = ({ job, onPress }) => {
  const workerName =
    job.assignedWorker?.fullName || job.assignedWorker?.phoneNumber || "No worker";
  const reason = job.forceCloseReason?.trim() || "No reason provided";

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.jobIcon, { backgroundColor: CLOSED_COLOR + "20" }]}>
        <Ionicons name="close-circle-outline" size={20} color={CLOSED_COLOR} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {job.title}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          Worker: {workerName}
        </Text>
        <Text style={styles.rowReason} numberOfLines={2}>
          {reason}
        </Text>
        <Text style={styles.rowMeta}>
          Closed {formatDateDDMMYYYY(job.forceClosedAt)}
          {job.durationInProgress ? ` · ${job.durationInProgress}` : ""}
        </Text>
      </View>
      <View style={styles.rowBadges}>
        <View style={[styles.badge, { backgroundColor: CLOSED_COLOR + "20" }]}>
          <Text style={[styles.badgeText, { color: CLOSED_COLOR }]}>Closed</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
    </TouchableOpacity>
  );
};

const AdminForceClosedScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    forceClosedJobs = [],
    forceClosedLoading = false,
    forceClosedError,
    forceClosedTotal = 0,
  } = useSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    dispatch(fetchAdminForceClosedJobs({ page: 1, limit: 50, search: search.trim() || undefined }));
  }, [dispatch, search]);

  useEffect(() => {
    dispatch(fetchAdminForceClosedJobs({ page: 1, limit: 50 }));
  }, [dispatch]);

  const jobs = Array.isArray(forceClosedJobs) ? forceClosedJobs : [];
  const filtered = search.trim()
    ? jobs.filter((j) => {
        const q = search.toLowerCase();
        return (
          j.title?.toLowerCase().includes(q) ||
          j.postedBy?.fullName?.toLowerCase().includes(q) ||
          j.assignedWorker?.fullName?.toLowerCase().includes(q) ||
          j.forceCloseReason?.toLowerCase().includes(q)
        );
      })
    : jobs;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={ADMIN_ACCENT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Force Closed</Text>
        <Text style={styles.headerCount}>{forceClosedTotal || jobs.length}</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search title, owner, worker, reason..."
          placeholderTextColor={Colors.gray}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={load}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {forceClosedError ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.Red} />
          <Text style={styles.errorText}>{forceClosedError}</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ForceClosedRow
            job={item}
            onPress={() =>
              (navigation as any).navigate("AdminJobDetailScreen", { jobId: item.id })
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={forceClosedLoading} onRefresh={load} colors={[ADMIN_ACCENT]} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !forceClosedLoading ? (
            <View style={styles.emptyBox}>
              <Ionicons name="close-circle-outline" size={48} color={Colors.lightGray} />
              <Text style={styles.emptyText}>
                {search ? "No closed tasks match your search" : "No force-closed tasks yet"}
              </Text>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default AdminForceClosedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: "700", color: ADMIN_ACCENT },
  headerCount: { fontSize: 13, color: Colors.gray, fontWeight: "500" },
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
  searchIcon: { marginRight: 8 },
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
  jobIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowInfo: { flex: 1, marginRight: 8 },
  rowTitle: { fontSize: 15, fontWeight: "600", color: Colors.black },
  rowSub: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  rowReason: { fontSize: 12, color: "#7F1D1D", marginTop: 4, lineHeight: 16 },
  rowMeta: { fontSize: 12, fontWeight: "600", color: CLOSED_COLOR, marginTop: 4 },
  rowBadges: { alignItems: "flex-end", marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: "600" },
  separator: { height: 8 },
  emptyBox: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.gray, textAlign: "center" },
});
