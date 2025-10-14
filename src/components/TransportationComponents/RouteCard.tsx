import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, } from "../../utils";

import { Entypo, } from "@expo/vector-icons";
import Button from "../Button";


interface RouteCardProps {
    routeName: string;
    source: string;
    destination: string;
    status: string;
    onEdit: (vehicle: RouteCardProps) => void;
}

const RouteCard = ({ routeName, source, destination, status,onEdit }: RouteCardProps) => {

    const [isOpen, setIsOpen] = useState(false);


    const EditVehicle=()=>{
        const vehicleData:any = {
            routeName,
            source,
            destination,
            status,
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
                    
                    <View style={{  width: '55%' }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                ...styles.cardTitle,
                            }}
                        >
                            {routeName}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                        >
                            <Text style={{
                                    ...styles.cardDescription,
                                }}
                            >
                                Source:
                            </Text>
                            <Text style={{
                                    ...styles.cardDescriptionValue,
                                }}
                            >
                                {source} 
                            </Text>

                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                        >
                            <Text style={{
                                    ...styles.cardDescription,
                                }}
                            >
                                Destination:
                            </Text>
                            <Text style={{
                                    ...styles.cardDescriptionValue,
                                }}
                            >
                                {destination} 
                            </Text>

                        </View>
                    </View>
                    <View style={{ width: '45%', alignItems: 'flex-end' }}>
                        <Text style={styles.dateText}>{status}</Text>
                        <View style={{ alignItems: "flex-end", marginTop: 4,flex:1,flexDirection:'row' }}>
                        <Button label="Edit" onPress={()=>{EditVehicle()}} style={styles.editBtn}/>
                        <Button label="Delete" onPress={()=>{console.log("delete")}} style={styles.deleteBtn}/>
                        </View>
                    </View>
                </View>

               
            </TouchableOpacity>


        </>
    );
};

export default RouteCard;

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
        fontSize: 14,
        fontWeight: "700",
        color: Colors.black
    },
    cardDescription: {
        fontSize: 12,
        fontWeight: "bold",
    },
    cardDescriptionValue: {
        fontSize: 12,
        // fontWeight: "bold",
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
        // width:'48%',
        backgroundColor:Colors.secondary,
        padding:5,
        marginTop:5,
        borderRadius:10,

    },
    deleteBtn:{
        padding:5,
        marginTop:5,
        borderRadius:10,
        marginLeft:10

        // width:'48%',
        // backgroundColor:Colors.secondary
    }
});
