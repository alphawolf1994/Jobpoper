import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../utils";
import Checkbox from "expo-checkbox";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import Button from "./Button";
import PaymentForm from "./paymentForm";
import Toast from "react-native-toast-message";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { width } from "../utils/responsive";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { deductFunds } from "../redux/slices/walletSlice";

interface FeeDetailCardProps {
  title: string;
  subtitle: string;
  paid:boolean
}

const FeeDetailCard = ({ title, subtitle,paid }: FeeDetailCardProps) => {
  const [isChecked, setChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [PaymentModal, setPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [modaltitle, setModalTitle] = useState('Payment Successful!');
  const [message, setMessage] = useState("Your child's school fees have been received. A confirmation has been sent to your registered contact");
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
const handlePaymentSuccess = () => {
  setSuccessModalVisible(true);
};
  const onSubmit1 = async (data: any) => {
    if(data.paymentMethod=="wallet")
      {
        console.log("Wallet Payment",data);
dispatch(deductFunds(data.amount));
      }


setPaymentModal(false)
if(data.paymentMethod=="loan")
  {
setModalTitle("Loan Request Submitted")
setMessage("Your loan request is under process. We will notify you once it's reviewed.")
  }
  setTimeout(() => {
    setSuccessModalVisible(true)
  }, 500);
  }
  const openPaymentModal=(payment:any)=>{
setSelectedPayment(payment)
setTimeout(() => {
  setPaymentModal(true)
}, 500);

  }
  return (
    <>
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row",  }}>
        <View style={{width:'15%'}}>
        <Image source={{ uri: `https://randomuser.me/api/portraits/men/1.jpg` }} style={styles.profileImage} />
        </View>
        <View style={{ marginLeft: 10,width:'45%' }}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.cardTitle,
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
                ...styles.cardDescription,
              }}
            >
             {CurrencySign} {subtitle}{" "}
            </Text>

            <Text
              style={{
                color: Colors.white,
                backgroundColor: paid?Colors.green:Colors.Red,
                paddingHorizontal: 5,
                paddingVertical: 2,
                borderRadius: 30,
                textAlign: "center",
                fontSize: 10,
                fontWeight:'bold'
              }}
            >
              {paid?'Paid':'UnPaid'}
            </Text>
          </View>
        </View>
        <View style={{width:'40%',alignItems:'flex-end'}}>
        {!paid &&<Text style={styles.dateText}>Due  Date: 06 Jan  2025</Text>}
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
           <Text style={[styles.receiptTitle,{marginTop:10}]}>Fee Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Total Fee</Text>
            <Text style={styles.detailRightText}>{CurrencySign} 3,600</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Extra Fee</Text>
            <Text style={styles.detailRightText}>{CurrencySign} 2,600</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Late Charges</Text>
            <Text style={styles.detailRightText}>{CurrencySign} 600</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Discount (20%)</Text>
            <Text style={styles.detailRightText}>-{CurrencySign} 500</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Total Dues </Text>
            <Text style={styles.detailRightText}>{CurrencySign} 5,600</Text>
          </View>
          {paid ?<View><View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Paid Dues</Text>
            <Text style={styles.detailRightText}>{CurrencySign} 5,600</Text>
          </View>
          <Text style={styles.receiptTitle}>Other Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Paid By</Text>
            <Text style={styles.detailRightText}>John Wick</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Payment Method</Text>
            <Text style={styles.detailRightText}>Bank Account</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Account Number</Text>
            <Text style={styles.detailRightText}>123456789</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Transaction Id</Text>
            <Text style={styles.detailRightText}>345643</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Date</Text>
            <Text style={styles.detailRightText}>06 Jan  2025</Text>
          </View>
          <Button label="Download" onPress={()=>{console.log("downloaded")}} />
          </View>:<Button label="Pay Now" onPress={()=>{openPaymentModal(subtitle)}} />}
        </View>
      )}
    </TouchableOpacity>
    <PaymentForm
                isVisible={PaymentModal}
                onClose={() => setPaymentModal(false)}
                onConfirmPayment={onSubmit1}
                selectedPayment={selectedPayment}
            />
             <PaymentSuccessModal 
      isVisible={isSuccessModalVisible} 
      onClose={() => setSuccessModalVisible(false)} 
      title={modaltitle}
      message={message}
    />
    </>
  );
};

export default FeeDetailCard;

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
  receiptTitle: { fontWeight: "bold", marginVertical: 5,textAlign:'center' }
});
