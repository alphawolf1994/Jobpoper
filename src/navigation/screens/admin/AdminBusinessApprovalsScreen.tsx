import React, { useCallback, useEffect } from "react";
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
  fetchAdminBusinessApprovalRequests,
} from "../../../redux/slices/adminSlice";

const ADMIN_ACCENT = "#1E40AF";

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

interface BusinessApprovalRowProps {
  item: AdminBusinessApprovalRequest;
  onPress: () => void;
}

const BusinessApprovalRow: React.FC<BusinessApprovalRowProps> = ({ item, onPress }) => {
  const userName = item.user?.fullName || item.user?.phoneNumber || "Unknown user";

  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Ionicons name="storefront-outline" size={22} color={ADMIN_ACCENT} />
      </View>

      <View style={styles.rowInfo}>
        <Text style={styles.businessName} numberOfLines={1}>
          {item.businessName}
        </Text>
        <Text style={styles.userName} numberOfLines={1}>
          User: {userName}
        </Text>
        <Text style={styles.submittedDate}>
          Submitted: {formatSubmittedDate(item.submittedAt)}
        </Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>Pending</Text>
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

const AdminBusinessApprovalsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    businessApprovalRequests,
    businessApprovalsLoading,
    businessApprovalsError,
  } = useSelector((state: RootState) => state.admin);

  const load = useCallback(() => {
    dispatch(fetchAdminBusinessApprovalRequests(100));
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const requests = businessApprovalRequests ?? [];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Approval Requests</Text>
        <Text style={styles.headerCount}>
          {requests.length} pending
        </Text>
      </View>

      {businessApprovalsError ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.Red} />
          <Text style={styles.errorText}>{businessApprovalsError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={load}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusinessApprovalRow
            item={item}
            onPress={() =>
              navigation.navigate("AdminBusinessApprovalDetailScreen", {
                profile: item,
              })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={businessApprovalsLoading}
            onRefresh={load}
            colors={[ADMIN_ACCENT]}
          />
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          businessApprovalsLoading ? (
            <View style={styles.emptyBox}>
              <ActivityIndicator size="large" color={ADMIN_ACCENT} />
              <Text style={styles.emptyText}>Loading approval requests...</Text>
            </View>
          ) : !businessApprovalsError ? (
            <View style={styles.emptyBox}>
              <Ionicons
                name="checkmark-circle-outline"
                size={50}
                color={Colors.lightGray}
              />
              <Text style={styles.emptyText}>
                No pending business approval requests
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

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
    backgroundColor: "#FFF3E0",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.orange,
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
