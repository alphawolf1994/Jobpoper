import React, { useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchAdminJobById, clearSelectedJob } from "../../../redux/slices/adminSlice";
import { Colors } from "../../../utils";
import { IMAGE_BASE_URL } from "../../../api/baseURL";

const ADMIN_ACCENT = "#1E40AF";
const ADMIN_LIGHT  = "#EFF6FF";

interface InfoRowProps { label: string; value: string; valueColor?: string; }
const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueColor }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, valueColor ? { color: valueColor } : {}]}>{value || "—"}</Text>
  </View>
);

const getStatusColor = (s: string) => {
  switch (s) {
    case "open":        return Colors.green;
    case "in-progress": return Colors.primary;
    case "completed":   return Colors.gray;
    case "cancelled":   return Colors.Red;
    default:            return Colors.gray;
  }
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
// buildAdminJobDetail returns flat fields:
//   id, title, postedBy.{id,phoneNumber,fullName}, interestedUsers[].{id,phoneNumber,fullName,notedAt}
const AdminJobDetailScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const dispatch   = useDispatch<AppDispatch>();
  const { jobId }  = (route.params as any) || {};

  const { selectedJob, jobsLoading, jobsError } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    if (jobId) dispatch(fetchAdminJobById(jobId));
    return () => { dispatch(clearSelectedJob()); };
  }, [jobId, dispatch]);

  const resolveImage = (uri?: string | null) => {
    if (!uri) return null;
    if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
    return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
  };

  const formatLocation = (location: any): string => {
    if (!location) return "—";
    if (typeof location === "string") return location;
    if (location.fullAddress) return location.fullAddress;
    if (location.source && location.destination) {
      return `${location.source.fullAddress || "Source"} → ${location.destination.fullAddress || "Destination"}`;
    }
    return JSON.stringify(location);
  };

  if (jobsLoading || !selectedJob) {
    return (
      <SafeAreaView style={styles.centered}>
        {jobsLoading
          ? <ActivityIndicator size="large" color={ADMIN_ACCENT} />
          : <>
              <Ionicons name="alert-circle-outline" size={40} color={Colors.gray} />
              <Text style={styles.errorText}>{jobsError || "Job not found"}</Text>
            </>
        }
      </SafeAreaView>
    );
  }

  const j = selectedJob;
  const statusColor  = getStatusColor(j.status);
  const urgencyColor = j.urgency === "Urgent" ? Colors.Red : Colors.orange;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={ADMIN_ACCENT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Job Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title Card */}
        <View style={styles.titleCard}>
          <View style={[styles.jobIconLarge, { backgroundColor: urgencyColor + "20" }]}>
            <Ionicons
              name={j.urgency === "Urgent" ? "flash" : "briefcase-outline"}
              size={28} color={urgencyColor}
            />
          </View>
          <Text style={styles.jobTitle}>{j.title}</Text>
          <View style={styles.titleBadges}>
            <View style={[styles.badge, { backgroundColor: statusColor + "20" }]}>
              <Text style={[styles.badgeText, { color: statusColor }]}>{j.status}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: urgencyColor + "20" }]}>
              <Text style={[styles.badgeText, { color: urgencyColor }]}>{j.urgency}</Text>
            </View>
            {j.jobType && (
              <View style={[styles.badge, { backgroundColor: ADMIN_ACCENT + "20" }]}>
                <Text style={[styles.badgeText, { color: ADMIN_ACCENT }]}>{j.jobType}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Job Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Information</Text>
          <View style={styles.card}>
            <InfoRow label="Cost"           value={`PKR ${j.cost}`}                            valueColor={Colors.green} />
            <InfoRow label="Type"           value={j.jobType || "OnSite"} />
            <InfoRow label="Urgency"        value={j.urgency}                                  valueColor={urgencyColor} />
            <InfoRow label="Status"         value={j.status}                                   valueColor={statusColor} />
            <InfoRow label="Response"       value={j.responsePreference?.replace("_", " ") || "—"} />
            <InfoRow label="Scheduled Date" value={j.scheduledDate ? new Date(j.scheduledDate).toLocaleDateString() : "—"} />
            <InfoRow label="Scheduled Time" value={j.scheduledTime || "—"} />
            <InfoRow label="Posted On"      value={j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "—"} />
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.card}>
            <View style={styles.descBox}>
              <Text style={styles.descText}>{formatLocation(j.location)}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.card}>
            <View style={styles.descBox}>
              <Text style={styles.descText}>{j.description || "No description"}</Text>
            </View>
          </View>
        </View>

        {/* Posted By — postedBy.fullName is FLAT (not postedBy.profile.fullName) */}
        {j.postedOnBehalf && j.externalContact && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Seeker (External Contact)</Text>
            <View style={styles.card}>
              <InfoRow label="Name"  value={j.externalContact.name} />
              <InfoRow label="Phone" value={j.externalContact.phoneNumber} />
            </View>
          </View>
        )}

        {j.postedBy && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {j.postedOnBehalf ? "Posted By (App User)" : "Posted By"}
            </Text>
            <TouchableOpacity
              style={[styles.card, styles.posterRow]}
              onPress={() => (navigation as any).navigate("AdminUserDetailScreen", { userId: j.postedBy!.id })}
              activeOpacity={0.7}
            >
              <View style={styles.posterAvatar}>
                <Text style={styles.posterInitial}>
                  {(j.postedBy.fullName?.[0] || j.postedBy.phoneNumber?.[0] || "U").toUpperCase()}
                </Text>
              </View>
              <View style={styles.posterInfo}>
                <Text style={styles.posterName}>{j.postedBy.fullName || "Unknown"}</Text>
                <Text style={styles.posterPhone}>{j.postedBy.phoneNumber}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
            </TouchableOpacity>
          </View>
        )}

        {/* Interested Users — interestedUsers[].fullName is FLAT (not user.profile.fullName) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Interested Users ({j.interestedUsers?.length ?? j.interestedCount ?? 0})
          </Text>
          {!j.interestedUsers || j.interestedUsers.length === 0 ? (
            <View style={[styles.card, { padding: 16 }]}>
              <Text style={styles.emptyText}>No interested users yet</Text>
            </View>
          ) : (
            <View style={styles.card}>
              {j.interestedUsers.map((entry, i) => (
                <TouchableOpacity
                  key={entry.id ?? i}
                  style={[styles.interestedRow, i < j.interestedUsers!.length - 1 && styles.interestedBorder]}
                  onPress={() => (navigation as any).navigate("AdminUserDetailScreen", { userId: entry.id })}
                  activeOpacity={0.7}
                >
                  <View style={styles.interestedAvatar}>
                    <Text style={styles.interestedInitial}>
                      {(entry.fullName?.[0] || "U").toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.interestedInfo}>
                    <Text style={styles.interestedName}>{entry.fullName || "Unknown"}</Text>
                    <Text style={styles.interestedSub}>
                      {entry.phoneNumber} · {entry.notedAt ? new Date(entry.notedAt).toLocaleDateString() : ""}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Attachments */}
        {j.attachments && j.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments ({j.attachments.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.attachmentsRow}>
                {j.attachments.map((att, i) => {
                  const uri = resolveImage(att);
                  return uri ? <Image key={i} source={{ uri }} style={styles.attachmentThumb} /> : null;
                })}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminJobDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  centered:  { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: "#F8FAFF" },
  errorText: { color: Colors.gray, fontSize: 15 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: ADMIN_LIGHT, alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: ADMIN_ACCENT, flex: 1, textAlign: "center" },
  scroll: { padding: 20, paddingBottom: 40 },
  titleCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 24, alignItems: "center",
    marginBottom: 20, borderWidth: 1, borderColor: Colors.lightGray,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  jobIconLarge: { width: 64, height: 64, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  jobTitle:     { fontSize: 20, fontWeight: "700", color: Colors.black, textAlign: "center", marginBottom: 12 },
  titleBadges:  { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  badge:        { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText:    { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  section:      { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14, fontWeight: "700", color: Colors.gray,
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10, marginLeft: 2,
  },
  card: {
    backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.lightGray,
    overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.03,
    shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  infoLabel: { fontSize: 14, color: Colors.gray, flex: 1 },
  infoValue: { fontSize: 14, color: Colors.black, fontWeight: "500", flex: 2, textAlign: "right", textTransform: "capitalize" },
  descBox:   { padding: 16 },
  descText:  { fontSize: 14, color: Colors.black, lineHeight: 22 },
  posterRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  posterAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: ADMIN_ACCENT + "20", alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  posterInitial: { fontSize: 18, fontWeight: "700", color: ADMIN_ACCENT },
  posterInfo:    { flex: 1 },
  posterName:    { fontSize: 15, fontWeight: "600", color: Colors.black },
  posterPhone:   { fontSize: 12, color: Colors.gray, marginTop: 2 },
  interestedRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  interestedBorder: { borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  interestedAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary + "20", alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  interestedInitial: { fontSize: 14, fontWeight: "700", color: Colors.primary },
  interestedInfo:    { flex: 1 },
  interestedName:    { fontSize: 14, fontWeight: "600", color: Colors.black },
  interestedSub:     { fontSize: 12, color: Colors.gray, marginTop: 2 },
  emptyText:         { textAlign: "center", color: Colors.gray, fontSize: 14 },
  attachmentsRow:    { flexDirection: "row", gap: 10, paddingHorizontal: 4 },
  attachmentThumb:   { width: 80, height: 80, borderRadius: 10, backgroundColor: Colors.lightGray },
});
