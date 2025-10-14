import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";
interface DriverStudentProps {
    name: string;
    school: {
        id: string;
        name: string;
        address: string;
    };
    routeName: string;
    pickupPointName: string;
    parentContact: string;
    imageUrl: string;
}

const DriverStudentCard = ({
    name,
    school,
    routeName,
    pickupPointName,
    parentContact,
    imageUrl
}: DriverStudentProps) => {

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
                    <Text numberOfLines={1} style={styles.cardTitle}>{name}</Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>{school.name}</Text>
                </View>
                <View style={{ width: '35%', alignItems: 'flex-end' }}>
                   
                    <View style={{ alignItems: "flex-end", marginTop: 10 }}>
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
                        <Text style={styles.detailLeftText}>Route</Text>
                        <Text style={styles.detailRightText}>{routeName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLeftText}>Pickup Point</Text>
                        <Text style={styles.detailRightText}>{pickupPointName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLeftText}>Parent Contact</Text>
                        <Text style={styles.detailRightText}>{parentContact}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLeftText}>School Address</Text>
                        <Text style={styles.detailRightText}>{school.address}</Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default DriverStudentCard;

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
        marginTop:5
    },
    cardDescription: {
        fontSize: 14,
        color: Colors.black,
        fontWeight: "500",
        marginTop:5
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
