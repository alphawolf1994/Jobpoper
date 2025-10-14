import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Colors, CurrencySign } from "../../utils";
import Button from "../Button";


interface BookingCardProps {
    // id: string;
    vehicleModal: string;
    vehicleNo: string;
    yearOfManufacture: string;
    chassisNo: string;
    capacity: string;
    status: string;
    authorization: string;
   
}

const BusCard = (props: BookingCardProps) => {
    const {
      
        vehicleModal, vehicleNo, yearOfManufacture, chassisNo, capacity, status, authorization
     
    } = props;

    const [isOpen, setIsOpen] = useState(false);

   

    return (
        <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            style={styles.cardContainer}
        >
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: '15%' }}>
                    <Image source={{ uri: `https://live.staticflickr.com/1265/5186579358_09025c5b3b_b.jpg` }} style={styles.profileImage} />
                </View>

                <View style={{ marginLeft: 10, width: '45%' }}>
                    <Text numberOfLines={1} style={styles.cardTitle}>
                    {vehicleModal}
                    </Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>
                    {vehicleNo}
                    </Text>
                </View>

                <View style={{ width: '40%', alignItems: 'flex-end' }}>
                <Text style={styles.dateText}>{status}</Text>
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
                <View  style={{
                    marginTop: 10,
                    borderTopWidth: 0.5,
                    borderColor: Colors.lightBlue,
                }}>
                   
                   <View style={styles.detailRow}>
                            <Text style={styles.detailLeftText}>Year of Manufacture</Text>
                            <Text style={styles.detailRightText}>{yearOfManufacture}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLeftText}>Chassis No</Text>
                            <Text style={styles.detailRightText}>{chassisNo}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLeftText}>Capacity</Text>
                            <Text style={styles.detailRightText}>{capacity}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLeftText}>Authorization</Text>
                            <Text style={styles.detailRightText}>{authorization}</Text>
                        </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default BusCard;

const styles = StyleSheet.create({
    detailLeftText: {
        fontSize: 14,
    },
    detailRightText: {
        fontSize: 14,
        fontWeight: "bold",
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
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dateText: {
        color: Colors.Red,
        fontSize: 12
    },
    cardTitle: {
        fontSize: 12,
        // fontWeight: "100",
        color: Colors.black
    },
    cardDescription: {
        fontSize: 16,
        fontWeight: "bold",
    },
    checkbox: {
        margin: 8,
        borderRadius: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,

    },
    receiptContainer: { backgroundColor: Colors.white, padding: 10, borderRadius: 10, marginTop: 10 },
    receiptTitle: { fontWeight: "bold", marginVertical: 5, textAlign: 'center' },
    editBtn:{
        width:'48%',
        backgroundColor:Colors.secondary
    },
    deleteBtn:{
        width:'48%',
        // backgroundColor:Colors.secondary
    }
});
