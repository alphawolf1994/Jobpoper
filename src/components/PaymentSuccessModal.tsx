import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import { Colors, widthToDp, heightToDp } from "../utils"; // Adjust import paths as needed
import ImagePath from "../assets/images/ImagePath"; // Adjust import paths as needed
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";

interface PaymentSuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isVisible, onClose,
  title = "Payment Successful!",
  message = "Your child's school fees have been received. A confirmation has been sent to your registered contact."
 }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} animationIn="zoomIn" animationOut="zoomOut">
      <View style={styles.modalContainer}>
      <Ionicons name="checkmark-circle" size={widthToDp(15)} color={Colors.primary} />
        <Text style={styles.successText}>{title}</Text>
        <Text style={styles.message}>
        {message} </Text>
   
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PaymentSuccessModal;

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "white",
        padding: widthToDp(5),
        borderRadius: 10,
        alignItems: "center",
      },
      successText: {
        fontSize: widthToDp(5),
        fontWeight: "bold",
        color: Colors.primary,
        marginTop: heightToDp(2),
      },
      message: {
        fontSize: widthToDp(4),
        textAlign: "center",
        color: Colors.darkGray,
        marginVertical: heightToDp(2),
      },
      closeButton: {
        backgroundColor: Colors.primary,
        paddingVertical: heightToDp(1.5),
        paddingHorizontal: widthToDp(10),
        borderRadius: 5,
      },
      closeButtonText: {
        color: "white",
        fontSize: widthToDp(4),
        fontWeight: "bold",
      },
});
