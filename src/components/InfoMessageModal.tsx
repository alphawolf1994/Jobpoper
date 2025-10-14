import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Colors, widthToDp, heightToDp } from "../utils";
import { Ionicons } from "@expo/vector-icons";

interface InfoMessageModalProps {
  isVisible: boolean;
  onClose: () => void;
  titleText: string;
  message: string;
}

const InfoMessageModal: React.FC<InfoMessageModalProps> = ({ isVisible, onClose, titleText, message }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} animationIn="zoomIn" animationOut="zoomOut">
      <View style={styles.modalContainer}>
        {/* <Ionicons name="information-circle" size={widthToDp(15)} color={Colors.primary} /> */}
        <Text style={styles.titleText}>{titleText}</Text>
        <Text style={styles.message}>{message}</Text>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default InfoMessageModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: widthToDp(5),
    borderRadius: 10,
    alignItems: "center",
  },
  titleText: {
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
