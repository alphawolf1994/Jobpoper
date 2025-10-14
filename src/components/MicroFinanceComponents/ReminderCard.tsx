import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import Button from "../Button";
import InfoMessageModal from "../InfoMessageModal";

interface TrackRepaymentCardProps {
  applicantName: string;
  loanAmount: string;
  reminderDate: string;
  reminderType: string;
  status: 'Sent' | 'Pending';
}

const ReminderCard = ({
  applicantName,
  loanAmount,
  reminderDate,
  reminderType,
  status,
}: TrackRepaymentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reminderStatus, setRemindercStatus] = useState(status);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
      title: "",
      message: ""
    });
  return (
    <>
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row" }}>
       
        <View style={{  width: '65%' }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{applicantName}</Text>
          <Text style={styles.cardDescription}>{CurrencySign} {loanAmount}</Text>
          <Text style={styles.smallText}>Reminder Date: {reminderDate}</Text>
        </View>
        <View style={{ width: '35%', alignItems: 'flex-end' }}>
          <Text style={[
            styles.statusText,
            reminderStatus === 'Sent' ? { color: Colors.green } :
            reminderStatus === 'Pending' ? { color: Colors.secondary } :
                { color: Colors.Red }
          ]}>
             {reminderStatus}
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
            <Text style={styles.detailLeftText}>Loan Amount</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {loanAmount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Reminder Date</Text>
            <Text style={styles.detailRightText}>{reminderDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Reminder Type</Text>
            <Text style={styles.detailRightText}>{reminderType}</Text>
          </View>
         {status=="Pending" && <Button label="Reminder Send"  onPress={() => {
    setModalContent({
      title: "Success",
      message: "Reminder has been successfully send!",
    });
    setShowModal(true);
    setRemindercStatus("Sent"); // update local state
  }} />}
        </View>
      )}
    </TouchableOpacity>
    <InfoMessageModal
  isVisible={showModal}
  titleText={modalContent.title}
  message={modalContent.message}
  onClose={() => {
    setShowModal(false);
   
  }}
/>
    </>
  );
};

export default ReminderCard;

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
