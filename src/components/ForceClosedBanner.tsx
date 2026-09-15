import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "../interface/interfaces";
import { formatDateDDMMYYYY } from "../utils";

interface Props {
  job: Job;
  padded?: boolean;
}

const ForceClosedBanner: React.FC<Props> = ({ job, padded }) => {
  if (job.status !== "force_closed") return null;

  return (
    <View style={[styles.banner, padded && styles.padded]}>
      <Ionicons name="close-circle" size={18} color="#991B1B" />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Task closed</Text>
        {job.forceCloseReason ? (
          <Text style={styles.reason}>{job.forceCloseReason}</Text>
        ) : null}
        {job.forceClosedAt ? (
          <Text style={styles.date}>{formatDateDDMMYYYY(job.forceClosedAt)}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default ForceClosedBanner;

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  padded: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 2,
  },
  reason: {
    fontSize: 13,
    color: "#7F1D1D",
    lineHeight: 18,
  },
  date: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 4,
  },
});
