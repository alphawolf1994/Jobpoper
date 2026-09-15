import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "../interface/interfaces";
import { getForceCloseAvailability } from "../utils/forceCloseAvailability";

interface Props {
  job: Job;
  onPress: () => void;
  padded?: boolean;
}

const ForceCloseButton: React.FC<Props> = ({ job, onPress, padded }) => {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    if (job.status !== "job_started") return;
    const first = getForceCloseAvailability(job.startedAt);
    if (first.canClose) return;
    const id = setInterval(() => setNowMs(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [job.status, job.startedAt]);

  if (job.status !== "job_started") return null;

  const avail = getForceCloseAvailability(job.startedAt, nowMs);

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.btn,
          padded && styles.padded,
          !avail.canClose && styles.btnDisabled,
        ]}
        activeOpacity={avail.canClose ? 0.8 : 1}
        disabled={!avail.canClose}
        onPress={onPress}
      >
        <Ionicons
          name="close-circle-outline"
          size={16}
          color={avail.canClose ? "#DC2626" : "#9CA3AF"}
        />
        <Text style={[styles.btnText, !avail.canClose && styles.btnTextDisabled]}>
          Close Task
        </Text>
      </TouchableOpacity>
      {!avail.canClose && avail.label ? (
        <Text style={[styles.countdown, padded && styles.countdownPadded]}>
          {avail.label}
        </Text>
      ) : null}
    </View>
  );
};

export default ForceCloseButton;

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 6,
    backgroundColor: "#FEF2F2",
  },
  padded: {
    marginHorizontal: 16,
  },
  btnDisabled: {
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  btnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
  btnTextDisabled: {
    color: "#9CA3AF",
  },
  countdown: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  countdownPadded: {
    marginHorizontal: 16,
  },
});
