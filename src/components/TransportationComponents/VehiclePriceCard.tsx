import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign, } from "../../utils";

import { Entypo, } from "@expo/vector-icons";
import Button from "../Button";


interface VehicleCardProps {
    vehicleModal: string;
    vehicleNo: string;
    hourlyRate: number;
    distanceRate: number;
    monthlyRate: number;
    onEdit: (vehicle: VehicleCardProps) => void;
}

const VehiclePriceCard = ({ vehicleModal, vehicleNo, hourlyRate, distanceRate, monthlyRate,onEdit }: VehicleCardProps) => {

    const [isOpen, setIsOpen] = useState(false);

const EditVehicle=()=>{
    const vehicleData:any = {
        vehicleModal,
        vehicleNo,
        hourlyRate,
        distanceRate,
        monthlyRate,
        image:'https://live.staticflickr.com/1265/5186579358_09025c5b3b_b.jpg'
      };
      onEdit(vehicleData);
}


    return (
        <>
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                style={styles.cardContainer}
            >
                <View style={{ flexDirection: "row", }}>
                    <View style={{ width: '15%' }}>
                        <Image source={{ uri: `https://live.staticflickr.com/1265/5186579358_09025c5b3b_b.jpg` }} style={styles.profileImage} />
                    </View>
                    <View style={{ marginLeft: 10, width: '40%' }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                ...styles.cardTitle,
                            }}
                        >
                            {vehicleModal}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    ...styles.cardDescription,
                                }}
                            >
                                {vehicleNo}
                            </Text>


                        </View>
                    </View>
                    <View style={{ width: '45%', alignItems: 'flex-end' }}>
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
                        <Text style={styles.detailLeftText}>Hourly Rate</Text>
                        <Text style={styles.detailRightText}>{CurrencySign} {hourlyRate}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLeftText}>Distance Rate</Text>
                        <Text style={styles.detailRightText}>{CurrencySign} {distanceRate} / km</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLeftText}>Monthly Rate</Text>
                        <Text style={styles.detailRightText}>{CurrencySign} {monthlyRate}</Text>
                    </View>
                        <View style={styles.detailRow}>
                        <Button label="Edit" onPress={()=>{EditVehicle()}} style={styles.editBtn}/>
                        <Button label="Delete" onPress={()=>{console.log("delete")}} style={styles.deleteBtn}/>

</View>
                    </View>
                )}
            </TouchableOpacity>


        </>
    );
};

export default VehiclePriceCard;

const styles = StyleSheet.create({
    // HomeworkCard styles
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
