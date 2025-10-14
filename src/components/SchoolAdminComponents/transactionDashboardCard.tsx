import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import ImagePath from "../../assets/images/ImagePath";

interface TransactionDashboardCardProps {
  header?: string;
  available?: number;
  wip?: number;
  commited?: number;
  utilised?: number;
  currency?: string;
  depreciated?: number;
  actual?: number;
}

const TransactionDashboardCard = ({
  header = "",
  available = 0,
  wip = 0,
  commited = 0,
  utilised = 0,
  actual = 0, 
  depreciated = 0,
  currency = "ZMW",
}: TransactionDashboardCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Determine image and title based on header
  let cardHeader = header;
  let imageSource = ImagePath.graphIcon;
  if (header === "OPEX") imageSource = ImagePath.growthIcon;
  else if (header === "Assets") imageSource = ImagePath.HomeIcon;
  else if (!header) imageSource = ImagePath.graphIcon;

  // If header is not passed, try to guess from values (optional)
  if (!header) {
    // You can add logic here if needed
    cardHeader = "Summary";
  }

  // Calculate total if needed
  const total = available + wip + commited + utilised + actual + depreciated;

  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <View style={styles.avatar}>
            <Image source={imageSource} style={styles.profileImage} />
          </View>
          <View>
            <Text style={styles.title}>{cardHeader}</Text>
            <Text style={styles.subText}>
              {currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <Entypo
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          {available !== 0 && (
            <DetailRow
              label="Available"
              value={`${currency} ${available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          )}
          {utilised !== 0 && (
            <DetailRow
              label="Utilised"
              value={`${currency} ${utilised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          )}
          {wip !== 0 && (
            <DetailRow
              label="Work in Progress"
              value={`${currency} ${wip.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          )}
          {commited !== 0 && (
            <DetailRow
              label="Committed"
              value={`${currency} ${commited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          )}
          {actual !== 0 && (
            <DetailRow
              label="Actual Value"
              value={`${currency} ${actual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          )}
          {depreciated !== 0 && (
            <DetailRow
              label="Depreciated Value"
              value={`${currency} ${depreciated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default TransactionDashboardCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftColumn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: Colors.black,
  },
  details: {
    marginTop: 12,
    borderTopWidth: 0.5,
    borderColor: Colors.lightBlue,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.black,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});