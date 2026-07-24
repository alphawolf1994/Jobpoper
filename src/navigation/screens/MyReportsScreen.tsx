import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppDispatch, RootState } from "../../redux/store";
import { getMyReports } from "../../redux/slices/reportSlice";
import { Colors, formatDateDDMMYYYY } from "../../utils";
import { IMAGE_BASE_URL } from "../../api/baseURL";
import Header from "../../components/Header";
import { Report } from "../../interface/interfaces";

const resolveImage = (uri?: string | null) => {
  if (!uri) return null;
  if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
  return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
};

const MyReportsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { myReports, myReportsLoading, myReportsError } = useSelector(
    (state: RootState) => state.report
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(getMyReports());
    }, [dispatch])
  );

  const renderItem = ({ item }: { item: Report }) => {
    const reported =
      typeof item.reportedUser === "object" && item.reportedUser
        ? item.reportedUser.profile?.fullName
        : null;
    const jobTitle =
      typeof item.jobId === "object" && item.jobId ? item.jobId.title : null;
    const isResolved = item.status === "resolved";
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {jobTitle || "Report"}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isResolved ? "#DCFCE7" : "#FEF3C7" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isResolved ? "#166534" : "#92400E" },
              ]}
            >
              {isResolved ? "Resolved" : "Open"}
            </Text>
          </View>
        </View>

        {reported ? (
          <Text style={styles.metaText}>Reported: {reported}</Text>
        ) : null}

        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}

        {item.images && item.images.length > 0 && (
          <View style={styles.imagesRow}>
            {item.images.map((img, idx) => {
              const uri = resolveImage(img);
              if (!uri) return null;
              return <Image key={idx} source={{ uri }} style={styles.thumb} />;
            })}
          </View>
        )}

        {item.resolutionNote ? (
          <View style={styles.resolutionBox}>
            <Text style={styles.resolutionLabel}>Admin response</Text>
            <Text style={styles.resolutionText}>{item.resolutionNote}</Text>
          </View>
        ) : null}

        <Text style={styles.dateText}>{formatDateDDMMYYYY(item.createdAt)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.container}>
      <Header />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My Reports</Text>
        <View style={{ width: 22 }} />
      </View>

      {myReportsLoading && myReports.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : myReportsError ? (
        <View style={styles.center}>
          <Ionicons name="warning-outline" size={40} color={Colors.gray} />
          <Text style={styles.emptyText}>{myReportsError}</Text>
        </View>
      ) : (
        <FlatList
          data={myReports}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={myReportsLoading}
          onRefresh={() => dispatch(getMyReports())}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="flag-outline" size={48} color={Colors.gray} />
              <Text style={styles.emptyText}>You haven't reported anything yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MyReportsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  topBarTitle: { fontSize: 17, fontWeight: "700", color: Colors.black },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 12,
    textAlign: "center",
  },
  listContent: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  jobTitle: { flex: 1, fontSize: 15, fontWeight: "700", color: Colors.black },
  statusBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: "700" },
  metaText: { fontSize: 12, color: Colors.gray, marginTop: 6 },
  description: { fontSize: 13, color: "#4B5563", marginTop: 8, lineHeight: 19 },
  imagesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  resolutionBox: {
    marginTop: 10,
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    padding: 10,
  },
  resolutionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 2,
  },
  resolutionText: { fontSize: 12, color: "#166534" },
  dateText: { fontSize: 11, color: Colors.gray, marginTop: 10 },
});
