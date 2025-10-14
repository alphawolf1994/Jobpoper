import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import Checkbox from "expo-checkbox";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import Button from "../Button";
import PaymentForm from "../paymentForm";
import Toast from "react-native-toast-message";
import PaymentSuccessModal from "../PaymentSuccessModal";


interface FeeDetailCardProps {
  title: string;
  fromDate: string;
  toDate: string;
  details: string;
  status:string;
  profileImg:string;
}
interface StatusBadgeProps {
    status: "Pending" | "Approved" | "Canceled" | "Rejected"; // Strong typing
  }
const LeaveCard = ({ title, fromDate,toDate,details,status,profileImg }: FeeDetailCardProps) => {

  const [isOpen, setIsOpen] = useState(false);
 
  const getStatusStyle = () => {
    switch (status) {
      case "Pending":
        return styles.pending;
      case "Approved":
        return styles.approved;
      case "Canceled":
        return styles.canceled;
      case "Rejected":
        return styles.rejected;
      default:
        return styles.defaultStatus;
    }
  };

  return (
    <>
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row",  }}>
        <View style={{width:'15%'}}>
        <Image source={{ uri: profileImg }} style={styles.profileImage} />
        </View>
        <View style={{ marginLeft: 10,width:'50%' }}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.cardDescription,
            }}
          >
            {title}
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
                ...styles.cardTitle,
              }}
            >
      {fromDate}{toDate ? ` - ${toDate}` : ""}
            </Text>

           
          </View>
        </View>
        <View style={{width:'35%',alignItems:'flex-end'}}>
        <Text style={[styles.statusText, getStatusStyle()]}>
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
        <View
          style={{
            marginTop: 10,
            borderTopWidth: 0.5,
            borderColor: Colors.lightBlue,
          }}
        >
           <Text style={[styles.receiptTitle,{marginTop:10}]}>{details}</Text>
           
           {status=='Pending'&&<Button label="Cancel" style={styles.cancelButton} onPress={()=>{console.log("downloaded")}} />}
         
         
         
        </View>
      )}
    </TouchableOpacity>
  
    </>
  );
};

export default LeaveCard;

const styles = StyleSheet.create({
  // HomeworkCard styles
 
 
 
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
  statusText: {
    color: Colors.white,
    fontSize:12
  },
  cardTitle: {
    fontSize: 12,
    // fontWeight: "100",
    color:Colors.black
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: "bold",
  },
  
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    
    
  },

  receiptTitle: { fontWeight: "bold", marginVertical: 5, },
  pending: {
    backgroundColor: "#FFC107", // Yellow
    padding:5,
    borderRadius:5
  },
  approved: {
    backgroundColor: "#4CAF50", // Green
    padding:5,
    borderRadius:5
  },
  canceled: {
    backgroundColor: "#2196F3", // Blue
    padding:5,
    borderRadius:5
  },
  rejected: {
    backgroundColor: "#F44336", // Red
    padding:5,
    borderRadius:5
  },
  defaultStatus: {
    backgroundColor: "#9E9E9E", // Gray (for unknown status)
    padding:5,
    borderRadius:5
  },
  cancelButton:{
    width:'50%',
    padding:10,
    alignSelf:'center'
  }
});
