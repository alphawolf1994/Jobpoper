import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Colors, CurrencySign } from "../utils";
import { LoanApplication, MonthlyPaymentStatus } from "../interface/interfaces";
import Button from "./Button";
import { useNavigation } from "@react-navigation/native";

interface LoanRequestCardProps {
  application: LoanApplication;
}

const LoanRequestCard = ({ application }: LoanRequestCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  // Extract data from application
  const {
    name,
    email,
    loanProduct,
    vendor,
    requestedAmount,
    interestRateAtTime,
    tenureMonthsAtTime,
    specifications,
    status,
    createdAt,
    monthlyStatus,
    repaymentStartDate,
    disbursementDate,
  } = application;

  // Format date
  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };
  const handleDetailsPress = () => {
    // Navigate to the details screen with all loan application data
    (navigation as any).navigate('RequestLoanDetailsScreen', { 
      loanApplication: {
        _id: application._id,
        loanProduct,
        applicant: application.applicant,
        name,
        email,
        applicantType: application.applicantType,
        vendor,
        requestedAmount,
        specifications,
        interestRateAtTime,
        tenureMonthsAtTime,
        status,
        monthlyStatus,
        createdAt,
        updatedAt: application.updatedAt,
        __v: application.__v,
        disbursementDate,
        repaymentStartDate,
      }
    });
  };
  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "65%" }}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {vendor?.name}
          </Text>
          <Text style={styles.cardDescription}>
            {CurrencySign}. {requestedAmount?.toLocaleString()}
          </Text>
          <Text style={styles.smallText}>{loanProduct?.productName}</Text>
        </View>
        <View style={{ width: "35%", alignItems: "flex-end" }}>
          <Text
            style={[
              styles.statusText,
              status === "approved" && { color: Colors.green },
              status === "rejected" && { color: Colors.Red },
              status === "pending" && { color: Colors.secondary },
            ]}
          >
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </Text>
          <View style={{ alignItems: "flex-end", marginTop: 4 }}>
            {isOpen ? (
              <Entypo name="chevron-small-up" size={24} color="black" />
            ) : (
              <Entypo name="chevron-small-down" size={24} color="black" />
            )}
          </View>
        </View>
      </View>

      {isOpen && (
        <View
          style={{
            marginTop: 10,
            borderTopWidth: 0.5,
            borderColor: Colors.lightBlue,
          }}
        >
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Applicant Name</Text>
            <Text style={styles.detailRightText}>{name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Email</Text>
            <Text style={styles.detailRightText}>{email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Requested Date</Text>
            <Text style={styles.detailRightText}>{formatDate(createdAt)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Repayment Start</Text>
            <Text style={styles.detailRightText}>{formatDate(repaymentStartDate)}</Text>
          </View>
          {disbursementDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLeftText}>Disbursement Date</Text>
              <Text style={styles.detailRightText}>{formatDate(disbursementDate)}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Repayment Period</Text>
            <Text style={styles.detailRightText}>{tenureMonthsAtTime} months</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Interest Rate</Text>
            <Text style={styles.detailRightText}>{interestRateAtTime}%</Text>
          </View>
          {specifications && (
            <View style={[styles.detailRow, { flexDirection: "column" }]}>
              <Text style={styles.detailLeftText}>Specifications</Text>
              <Text style={styles.detailText}>{specifications}</Text>
            </View>
          )}

          {/* EMI Breakdown if approved */}
          {/* {status === "approved" && monthlyStatus && monthlyStatus.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                EMI Breakdown
              </Text>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Month</Text>
                <Text style={styles.tableHeaderText}>Amount</Text>
                <Text style={styles.tableHeaderText}>Status</Text>
              </View>
                {monthlyStatus.map((emi: MonthlyPaymentStatus, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{formatDate(emi.dueDate)}</Text>
                  <Text style={styles.tableCell}>
                    {CurrencySign}. {emi.amountDue}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { color: emi.status === "Paid" ? "green" : "red" },
                    ]}
                  >
                    {emi.status}
                  </Text>
                </View>
              ))}
            </View>
            
          )} */}
           <Button
                                label="Details"
                                onPress={handleDetailsPress} 
                                style={styles.approveBtn}
                            />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default LoanRequestCard;

const styles = StyleSheet.create({
  detailLeftText: {
    fontSize: 14,
    color: Colors.black,
  },
  detailRightText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  detailRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
  statusText: {
    color: Colors.Red,
    fontSize: 12,
    textTransform: "capitalize",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  cardDescription: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: "500",
  },
  smallText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 6,
    backgroundColor: "#f2f2f2",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  approveBtn: {
  
    backgroundColor: Colors.secondary
},
});
