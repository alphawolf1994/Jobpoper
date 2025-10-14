import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Colors, CurrencySign } from "../../utils";
import Button from "../Button";

interface PickupPoint {
    name: string;
    address: string;
    pickupTime: string;
    dropTime: string;
  }
interface BookingCardProps {
    // id: string;
    schoolName: string;
    schoolContact: string;
    routeName: string;
    driverName: string;
    vehicleName: string;
    bookingPrice: string;
    status: string;
    // authorization: string;
    source?: string;
    destination?: string;
    pickupPoints?: PickupPoint[];
    onEdit: (booking: BookingCardProps) => void;
}

const BookingCard = (props: BookingCardProps) => {
    const {
        schoolName,
        schoolContact,
        routeName,
        driverName,
        vehicleName,
        bookingPrice,
        status,
        // authorization,
        source,
        destination,
        pickupPoints,
        onEdit
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    const handleEdit = () => {
        const bookingData = {
            ...props,
            image: 'https://randomuser.me/api/portraits/men/2.jpg'
        };
        onEdit(bookingData);
    };

    return (
        <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            style={styles.cardContainer}
        >
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: '15%' }}>
                    <Image source={{ uri: `https://media.istockphoto.com/id/171306436/photo/red-brick-high-school-building-exterior.jpg?s=612x612&w=0&k=20&c=vksDyCVrfCpvb9uk4-wcBYu6jbTZ3nCOkGHPSgNy-L0=` }} style={styles.profileImage} />
                </View>

                <View style={{ marginLeft: 10, width: '45%' }}>
                    <Text numberOfLines={1} style={styles.cardTitle}>
                        {schoolName}
                    </Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>
                        {routeName}
                    </Text>
                </View>

                <View style={{ width: '40%', alignItems: 'flex-end' }}>
                    <Text style={styles.statusText}>{status}</Text>
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
                <View style={styles.detailSection}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Driver</Text>
                        <Text style={styles.detailValue}>{driverName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Vehicle</Text>
                        <Text style={styles.detailValue}>{vehicleName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Price</Text>
                        <Text style={styles.detailValue}>{CurrencySign} {bookingPrice}</Text>
                    </View>
                    {/* <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Authorization</Text>
                        <Text style={styles.detailValue}>{authorization}</Text>
                    </View> */}
                    {source && destination && (
                        <>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>From</Text>
                                <Text style={styles.detailValue}>{source}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>To</Text>
                                <Text style={styles.detailValue}>{destination}</Text>
                            </View>
                        </>
                    )}
{pickupPoints && pickupPoints.length > 0 && (
  <View style={{ marginTop: 10 }}>
    <Text style={[styles.detailLabel, { marginBottom: 5 }]}>Pickup Points</Text>
    {pickupPoints.map((point, index) => (
      <View key={index} style={styles.pickupPointContainer}>
        <Text style={styles.pickupTitle}>{point.name}</Text>
        <Text style={styles.pickupDetail}>{point.address}</Text>
        <Text style={styles.pickupDetail}>Pickup: {point.pickupTime}</Text>
        <Text style={styles.pickupDetail}>Drop: {point.dropTime}</Text>
      </View>
    ))}
  </View>
)}
                    {/* <View style={styles.detailRow}>
                        <Button label="Edit" onPress={handleEdit} style={styles.editBtn} />
                        <Button label="Delete" onPress={() => console.log("Delete pressed")} style={styles.deleteBtn} />
                    </View> */}
                </View>
            )}
        </TouchableOpacity>
    );
};

export default BookingCard;

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
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    cardTitle: {
        fontSize: 14,
        color: Colors.black,
    },
    cardDescription: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: "bold",
    },
    statusText: {
        color: Colors.Red,
        fontSize: 12,
    },
    detailSection: {
        marginTop: 10,
        borderTopWidth: 0.5,
        borderColor: Colors.lightBlue,
    },
    detailRow: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    detailLabel: {
        fontSize: 14,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "bold",
    },
    editBtn: {
        width: '48%',
        backgroundColor: Colors.secondary,
    },
    deleteBtn: {
        width: '48%',
    },
    pickupPointContainer: {
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        borderWidth: 0.5,
        borderColor: Colors.lightBlue,
      },
      pickupTitle: {
        fontWeight: 'bold',
        fontSize: 13,
        color: Colors.black,
        marginBottom: 4,
      },
      pickupDetail: {
        fontSize: 12,
        color: Colors.black,
        marginTop:5
      },
});
