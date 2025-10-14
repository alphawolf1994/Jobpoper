import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { Colors, } from "../../utils";

import { Entypo, } from "@expo/vector-icons";
import Button from "../Button";
import RBSheet from "react-native-raw-bottom-sheet";
import AddBidForm from "./AddBidForm";


interface DriverCardProps {
    schoolName: string;
    contactPerson: string;
    contactNumber: string;
    proposalDate: string;
    status: string;
    requiredVehicles: string;
    notes:string;
    proposalStartDate: string;
    proposalEndDate: string;
    bid?: {
        description: string;
        fileUri: string;
      };
    onBidSubmit: (formData: { bidDescription: string; proposalFile: string }) => void;
}

const ProposalCard = ({ schoolName, contactPerson, contactNumber, proposalDate, status, requiredVehicles,notes,proposalStartDate,proposalEndDate,bid,onBidSubmit }: DriverCardProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const addBidBottomSheetRef = useRef<any>(null);
    const getDaysLeft = (endDate: string) => {
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };
    const handleBidSubmit = (formData:any) => {
        console.log("Bid Data Submitted:", formData);
        onBidSubmit(formData);
        addBidBottomSheetRef.current.close()
    }
    return (
        <>
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                style={styles.cardContainer}
            >
                <View style={{ flexDirection: "row", }}>
                    <View style={{ width: '15%' }}>
                        <Image source={{ uri: `https://media.istockphoto.com/id/171306436/photo/red-brick-high-school-building-exterior.jpg?s=612x612&w=0&k=20&c=vksDyCVrfCpvb9uk4-wcBYu6jbTZ3nCOkGHPSgNy-L0=` }} style={styles.profileImage} />
                    </View>
                    <View style={{ marginLeft: 10, width: '40%' }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                ...styles.cardTitle,
                            }}
                        >
                            {schoolName}
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
                                {contactPerson}
                            </Text>


                        </View>
                    </View>
                    <View style={{ width: '45%', alignItems: 'flex-end' }}>
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
                    <View
                        style={{
                            marginTop: 10,
                            borderTopWidth: 0.5,
                            borderColor: Colors.lightBlue,
                        }}
                    >

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLeftText}>Contact Number</Text>
                            <Text style={styles.detailRightText}>{contactNumber}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLeftText}>Proposal Date</Text>
                            <Text style={styles.detailRightText}>{proposalDate}</Text>
                        </View>
                        <View style={styles.detailRow}>
    <Text style={styles.detailLeftText}>Start Date</Text>
    <Text style={styles.detailRightText}>{proposalStartDate}</Text>
</View>
<View style={styles.detailRow}>
    <Text style={styles.detailLeftText}>End Date</Text>
    <Text style={styles.detailRightText}>{proposalEndDate}</Text>
</View>
<View style={styles.detailRow}>
    <Text style={styles.detailLeftText}>Days Left</Text>
    <Text style={styles.detailRightText}>{getDaysLeft(proposalEndDate)} days</Text>
</View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLeftText}>Required Vehicles</Text>
                            <Text style={styles.detailRightText}>{requiredVehicles}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailRightText}>{notes}</Text>
                        </View>
                        <View style={styles.detailRow}>
                        <Button label="Contact"  onPress={() => {
    Linking.openURL('tel:+1234567890'); // replace with the actual phone number
  }} style={styles.editBtn}/>
                        <Button label={bid ? "Submitted":"Bid"}     onPress={() => {addBidBottomSheetRef.current.open()}} style={styles.deleteBtn}/>

</View>
{bid && (
  <View style={styles.receiptContainer}>
    <Text style={styles.receiptTitle}>Your Bid</Text>
    <View style={[styles.detailRow,{flexDirection:'column'}]}>
                            <Text style={styles.detailLeftText}>Bid Description</Text>
                            <Text style={[styles.detailRightText,{marginTop:10}]}>{bid.description}</Text>
                        </View>
    <TouchableOpacity style={styles.fileButton} onPress={() => Linking.openURL(bid.fileUri)}>
      <Text style={{ color: Colors.white,textAlign:'center',fontWeight:'bold' }}>View Attached File</Text>
    </TouchableOpacity>
  </View>
)}

                    </View>
                )}
            </TouchableOpacity>

            <RBSheet
        ref={addBidBottomSheetRef}
        height={500}
        openDuration={250}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}
      >
    <Text style={styles.sheetTitle}>Add Bid</Text>
    <AddBidForm onSubmit={handleBidSubmit}/>

      </RBSheet>
        </>
    );
};

export default ProposalCard;

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
    receiptContainer: {  padding: 10, borderRadius: 10, marginTop: 10 },
    receiptTitle: { fontWeight: "bold", marginVertical: 5, textAlign: 'center' },
    editBtn:{
        width:'48%',
        backgroundColor:Colors.secondary
    },
    deleteBtn:{
        width:'48%',
        // backgroundColor:Colors.secondary
    },
    bottomSheetContainer: {
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      sheetTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
      },
      fileButton:{
        backgroundColor:Colors.primary,
        width:'50%',
        padding:10,
        alignSelf:'center',
        borderRadius:20,
        marginTop:10
        
      }
});
