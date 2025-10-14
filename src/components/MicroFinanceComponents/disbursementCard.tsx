import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface DisbursementTrackingCardProps {
    applicantName: string;
    loanAmount: number;
    approvedDate: string;
    disbursedAmount: number;
    status: 'Disbursed' | 'In Process' | 'Failed';
    disbursedDate: string;
    transactionRef: string;
    paymentMethod: string;
    imageUrl: string;
}

const DisbursementTrackingCard = ({
    applicantName,
    loanAmount,
    approvedDate,
    disbursedAmount,
    status,
    disbursedDate,
    transactionRef,
    paymentMethod,
    imageUrl
}: DisbursementTrackingCardProps) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            style={styles.cardContainer}
        >
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: '15%' }}>
                    <Image source={{ uri: imageUrl }} style={styles.profileImage} />
                </View>
                <View style={{ marginLeft: 10, width: '50%' }}>
                    <Text numberOfLines={1} style={styles.cardTitle}>{applicantName}</Text>
                    <Text style={styles.cardDescription}>
                        {CurrencySign}. {loanAmount.toLocaleString()}
                    </Text>
                    <Text style={styles.smallText}>Approved: {approvedDate}</Text>
                </View>
                <View style={{ width: '35%', alignItems: 'flex-end' }}>
                    <Text style={[
                        styles.statusText,
                        status === 'Disbursed' ? { color: Colors.green } :
                        status === 'In Process' ? { color: Colors.secondary } :
                        { color: Colors.Red }
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
                        <Text style={styles.detailLeftText}>Disbursed Amount</Text>
                        <Text style={styles.detailRightText}>{CurrencySign}. {disbursedAmount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLeftText}>Disbursed Date</Text>
                        <Text style={styles.detailRightText}>{disbursedDate}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLeftText}>Transaction Ref</Text>
                        <Text style={styles.detailRightText}>{transactionRef}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLeftText}>Payment Method</Text>
                        <Text style={styles.detailRightText}>{paymentMethod}</Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default DisbursementTrackingCard;

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
        fontSize: 12,
        fontWeight: "bold"
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
});
