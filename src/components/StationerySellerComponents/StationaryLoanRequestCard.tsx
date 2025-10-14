import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import { Entypo } from "@expo/vector-icons";
import { Colors, CurrencySign } from "../../utils";
import Button from "./../Button";


interface ParentLoanRequestCardProps {
    id: string;
    loanType: string;
    amount: number;
    providerName: string;
    providerId: string;
    status: string;
    interestRate: string;
    repaymentPeriod: string;
    requestDate: string;
    remarks?: string;
    emis?: {
      month: string;
      amount: number;
      status: 'Paid' | 'Unpaid';
    }[];
  }
  

  const StationaryLoanRequestCard = ({
    id,
    loanType,
    amount,
    providerName,
    providerId,
    status: initialStatus,
    interestRate,
    repaymentPeriod,
    requestDate,
    remarks,
    emis,
  }: ParentLoanRequestCardProps) => {
  

    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState(initialStatus);
    const handleApprove = () => {
        setStatus("Approved");
        // Optional: send status update to backend
        console.log("Approved");
    };

    const handleReject = () => {
        setStatus("Rejected");
        // Optional: send status update to backend
        console.log("Rejected");
    };

    return (
        <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            style={styles.cardContainer}
        >
            <View style={{ flexDirection: "row" }}>
               
                <View style={{  width: '65%' }}>
                    <Text numberOfLines={1} style={styles.cardTitle}>{providerName}</Text>
                    <Text style={styles.cardDescription}>{CurrencySign}. {amount.toLocaleString()}</Text>
                    <Text style={styles.smallText}>{loanType}</Text>
                </View>
                <View style={{ width: '35%', alignItems: 'flex-end' }}>
                <Text style={[
                        styles.statusText,
                        status === "Approved" && { color: Colors.green },
                        status === "Rejected" && { color: Colors.Red }
                    ]}>
                        {status}
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
                <View style={{ marginTop: 10, borderTopWidth: 0.5, borderColor: Colors.lightBlue }}>
                    
                    <View style={styles.detailRow}>
  <Text style={styles.detailLeftText}>Requested Date</Text>
  <Text style={styles.detailRightText}>{requestDate}</Text>
</View>
<View style={styles.detailRow}>
  <Text style={styles.detailLeftText}>Repayment Period</Text>
  <Text style={styles.detailRightText}>{repaymentPeriod}</Text>
</View>
<View style={styles.detailRow}>
  <Text style={styles.detailLeftText}>Interest Rate</Text>
  <Text style={styles.detailRightText}>{interestRate}</Text>
</View>
{remarks && (
  <View style={[styles.detailRow, { flexDirection: 'column' }]}>
    <Text style={styles.detailLeftText}>Remarks</Text>
    <Text style={styles.detailText}>{remarks}</Text>
  </View>
)}


                  
                    {status === "Approved" && emis && (
  <View style={{ marginTop: 10 }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>EMI Breakdown</Text>
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>Month</Text>
      <Text style={styles.tableHeaderText}>Amount</Text>
      <Text style={styles.tableHeaderText}>Status</Text>
    </View>
    {emis.map((emi, index) => (
      <View key={index} style={styles.tableRow}>
        <Text style={styles.tableCell}>{emi.month}</Text>
        <Text style={styles.tableCell}>Rs. {emi.amount}</Text>
        <Text style={[styles.tableCell, { color: emi.status === 'Paid' ? 'green' : 'red' }]}>
          {emi.status}
        </Text>
      </View>
    ))}
  </View>
)}



                     
                </View>
            )}
        </TouchableOpacity>
    );
};

export default StationaryLoanRequestCard;

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
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    approveBtn: {
        width: '48%',
        backgroundColor: Colors.secondary
    },
    rejectBtn: {
        width: '48%',
        backgroundColor: Colors.Red
    },
    detailText: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop:10
    },

    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 6,
        backgroundColor: '#f2f2f2',
      },
      tableHeaderText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      tableRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
      },
      tableCell: {
        flex: 1,
        textAlign: 'center',
      },
    
});
