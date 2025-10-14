import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, } from "../../utils";

import { Entypo, } from "@expo/vector-icons";
import Button from "../Button";

interface InterestRateRange {
    amount: string;
    rate: string;
}


interface ServiceCardProps {
    serviceName: string;
    interestRate: string;
    description: string;
    interestRateRanges: InterestRateRange[];
    onEdit: (vehicle: ServiceCardProps) => void;
}

const ServiceCard = ({ serviceName, interestRate, description,interestRateRanges,onEdit }: ServiceCardProps) => {

    const [isOpen, setIsOpen] = useState(false);


    const EditVehicle=()=>{
        const vehicleData:any = {
            serviceName,
            interestRate,
            description,
            interestRateRanges
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
                   
                    <View style={{ marginLeft: 10, width: '50%' }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                ...styles.cardTitle,
                            }}
                        >
                            {serviceName}
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
                                {interestRate}
                            </Text>


                        </View>
                    </View>
                    <View style={{ width: '45%',  }}>
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
                    <View
                        style={{
                            marginTop: 10,
                            borderTopWidth: 0.5,
                            borderColor: Colors.lightBlue,
                        }}
                    >

                        <View style={[styles.detailRow,{flexDirection:'column'}]}>
                            <Text style={styles.detailLeftText}>Service Description</Text>
                            <Text style={styles.detailText}>{description}</Text>
                        </View>
                    
                        {interestRateRanges && interestRateRanges.length > 0 && (
    <View style={{ marginTop: 10 }}>
        <Text style={styles.detailLeftText}>Interest Rate Ranges:</Text>
        {interestRateRanges.map((range, index) => (
            <View style={[styles.detailRow,]}>
            <Text style={styles.detailLeftText}>{range.amount}</Text>
            <Text style={styles.detailRightText}>{range.rate}</Text>
        </View>
            
        ))}
    </View>
)}

                      
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

export default ServiceCard;

const styles = StyleSheet.create({
    // HomeworkCard styles
    detailLeftText: {
        fontSize: 14,
        marginTop:10
    },
    detailRightText: {
        fontSize: 14,
        fontWeight: "bold",
     
    },
    detailText: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop:10
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
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.black
    },
    cardDescription: {
        fontSize: 12,
    
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
