import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import { AssignVehicle } from "../../interface/interfaces";

interface AssignCardProps {
  assignments: AssignVehicle;
}

const AssignVehicleCard = ({ assignments }: AssignCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const capitalizedStatus = assignments?.status?.charAt(0)?.toUpperCase() + assignments?.status?.slice(1);
  
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{assignments?.routeId?.routeName}</Text>
          <Text style={styles.subText}>Vehicle: {assignments?.vehicleId?.vehicleModal} ({assignments?.vehicleId?.vehicleNo})</Text>
          <Text style={styles.subText}>Driver: {assignments?.driverId?.driverName}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.statusText, { 
            color: assignments?.status === 'active' ? 'green' : Colors.Red,
            backgroundColor: Colors.lightBlue,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4
          }]}>
            {capitalizedStatus}
          </Text>
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          {/* Vehicle Details */}
          <SectionHeader title="Vehicle Information" />
          <DetailRow label="Model" value={assignments?.vehicleId?.vehicleModal} />
          <DetailRow label="Number" value={assignments?.vehicleId?.vehicleNo} />
          <DetailRow label="Year" value={assignments?.vehicleId?.yearOfManufacture} />
          <DetailRow label="Chassis No" value={assignments?.vehicleId?.chassisNo} />
          <DetailRow label="Fuel Type" value={assignments?.vehicleId?.fuelType} />
          <DetailRow label="Capacity" value={assignments?.vehicleId?.capacity.toString()} />
          <DetailRow label="Vehicle Status" value={assignments?.vehicleId?.status} />
          
          {/* Driver Details */}
          <SectionHeader title="Driver Information" />
          <DetailRow label="Name" value={assignments?.driverId?.driverName} />
          <DetailRow label="Contact" value={assignments?.driverId?.driverContact} />
          <DetailRow label="License" value={assignments?.driverId?.driverLicense} />
          <DetailRow label="Address" value={assignments?.driverId?.Address} />
          <DetailRow label="Driver Status" value={assignments?.driverId?.status} />
          
          {/* Route Details */}
          <SectionHeader title="Route Information" />
          <DetailRow label="Route Name" value={assignments?.routeId?.routeName} />
          <DetailRow label="Route Status" value={assignments?.routeId?.status} />
          
          {/* Pickup Points */}
          <SectionHeader title="Pickup Points" />
          {assignments?.routeId?.pickupPoints?.map((point, index) => (
            <View key={index} style={styles.pickupPointContainer}>
              <DetailRow label={`Point ${index + 1}`} value={point.name} />
              <DetailRow label="Distance" value={`${point.distance} ${point.measurement}`} />
              <DetailRow label="Fee" value={`$${point.fee}`} />
            </View>
          )) || <Text style={styles.noDataText}>No pickup points</Text>}
          
          {/* Assignment Details */}
          <SectionHeader title="Assignment Details" />
          <DetailRow label="Assigned At" value={new Date(assignments?.assignedAt).toLocaleString()} />
          <DetailRow label="Authorization" value={assignments?.isAuthorized ? 'Authorized' : 'Unauthorized'} />
          <DetailRow label="Assignment Status" value={capitalizedStatus} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || "N/A"}</Text>
  </View>
);

export default AssignVehicleCard;

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
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  details: {
    marginTop: 12,
    borderTopWidth: 0.5,
    borderColor: Colors.lightBlue,
    paddingTop: 10,
  },
  sectionHeader: {
    backgroundColor: Colors.lightBlue,
    padding: 6,
    borderRadius: 4,
    marginVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.darkGray,
    width: '40%'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width: '60%',
    textAlign: 'right'
  },
  pickupPointContainer: {
    backgroundColor: Colors.lightGray,
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.darkGray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 8,
  },
});