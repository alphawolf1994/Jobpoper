import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

// Updated Props Interface
interface InterestRateCardProps {
  applicantName: string;
  currentRate: string;
  proposedRate: string;
  rateType: 'Fixed' | 'Variable';
  effectiveDate: string;
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
}

const InterestRateCard = ({
  applicantName,
  currentRate,
  proposedRate,
  rateType,
  effectiveDate,
  approvalStatus,
}: InterestRateCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = () => {
    switch (approvalStatus) {
      case 'Approved': return Colors.green;
      case 'Pending': return Colors.secondary;
      case 'Rejected': return Colors.Red;
      default: return Colors.black;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "70%" }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{applicantName}</Text>
          <Text style={styles.cardDescription}>
            {currentRate} → {proposedRate} ({rateType})
          </Text>
          <Text style={styles.smallText}>Effective: {effectiveDate}</Text>
        </View>

        <View style={{ width: "30%", alignItems: "flex-end" }}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
             {approvalStatus}
          </Text>
          <View style={{ marginTop: 4 }}>
            <Entypo
              name={isOpen ? "chevron-small-up" : "chevron-small-down"}
              size={24}
              color="black"
            />
          </View>
        </View>
      </View>

      {isOpen && (
        <View style={styles.detailSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Current Rate</Text>
            <Text style={styles.detailRightText}>{currentRate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Proposed Rate</Text>
            <Text style={styles.detailRightText}>{proposedRate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Rate Type</Text>
            <Text style={styles.detailRightText}>{rateType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Effective Date</Text>
            <Text style={styles.detailRightText}>{effectiveDate}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default InterestRateCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.black,
    marginVertical: 2,
  },
  smallText: {
    fontSize: 12,
    color: Colors.gray,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  detailSection: {
    marginTop: 10,
    borderTopWidth: 0.5,
    borderColor: Colors.lightBlue,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  detailLeftText: {
    fontSize: 14,
    color: Colors.black,
  },
  detailRightText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
});
