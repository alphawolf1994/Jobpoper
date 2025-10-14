import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import Button from "../Button";
import InfoMessageModal from "../InfoMessageModal";
import RBSheet from "react-native-raw-bottom-sheet";
import MyTextInput from "../MyTextInput";

interface Payment {
  amount: string;
  date: string;
}
type ProductItem = {
  name: string;
  price: number;
  quantity: number;
};
interface BillCardProps {
  schoolName: string;
  schoolContact: string;
  contactPerson: string;
  products: ProductItem[];
  orderPrice: string;
  advanceAmount?: string;
  billDate: string;
  payments: Payment[];
  paymentStatus?: "Paid" | "Partially Paid" | "Unpaid";
}

const BillCard: React.FC<BillCardProps> = ({
  schoolName,
  schoolContact,
  contactPerson,
  products,
  orderPrice,
  advanceAmount,
  billDate,
  payments,
  paymentStatus
}) => {
    const createBillBottomSheetRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false);
 
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
      title: "",
      message: ""
    });
    const [amountInput, setAmountInput] = useState("");
const [localPayments, setLocalPayments] = useState<Payment[]>(payments || []);
const [localPaymentStatus, setLocalPaymentStatus] = useState(paymentStatus || "Unpaid");

const totalPaid = localPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
const totalOrderAmount = parseFloat(orderPrice);
const remainingAmount = totalOrderAmount - totalPaid;
const addAmountFunction = () => {
    const amount = parseFloat(amountInput);
  
    if (isNaN(amount) || amount <= 0) {
    
      setTimeout(() => {
        Alert.alert("Invalid", "Please enter a valid amount.");
      }, 300);
      return;
    }
  
    if (amount > remainingAmount) {
     
      setTimeout(() => {
        Alert.alert("Invalid", `Amount cannot exceed remaining ${CurrencySign}${remainingAmount.toFixed(2)}.`);
      }, 300);
      return;
    }
  
    const newPayment: Payment = {
      amount: amount.toFixed(2),
      date: new Date().toLocaleDateString(),
    };
  
    const updatedPayments = [...localPayments, newPayment];
    const newTotalPaid = updatedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
    setLocalPayments(updatedPayments);
    setAmountInput("");
    createBillBottomSheetRef.current?.close();
  
    if (newTotalPaid >= totalOrderAmount) {
        setLocalPaymentStatus("Paid");

      setTimeout(() => {
        Alert.alert("Payment Complete", "This order is now fully paid.");
      }, 300);
    }
    if (newTotalPaid < totalOrderAmount) {
        setLocalPaymentStatus("Partially Paid");
        setTimeout(() => {
            Alert.alert("Payment Added", "Partial payment recorded successfully.");
          }, 300);
      }
      
  };
  
  return (
    <>
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "15%" }}>
          <Image
            source={{ uri: `https://randomuser.me/api/portraits/men/1.jpg` }}
            style={styles.profileImage}
          />
        </View>
        <View style={{ marginLeft: 10, width: "50%" }}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {schoolName}
          </Text>
          <Text numberOfLines={1} style={styles.cardDescription}>
            {schoolContact}
          </Text>
        </View>
        <View style={{ width: "35%", alignItems: "flex-end" }}>
        <Text style={[styles.statusText, getStatusColor(localPaymentStatus)]}>{localPaymentStatus}</Text>

          <View style={{ alignItems: "flex-end", marginTop: 4 }}>
            <Entypo
              name={isOpen ? "chevron-small-up" : "chevron-small-down"}
              size={24}
              color="black"
            />
          </View>
        </View>
      </View>

      {isOpen && (
        <View style={{ marginTop: 10, borderTopWidth: 0.5, borderColor: Colors.lightBlue }}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Contact Person</Text>
            <Text style={styles.detailRightText}>{contactPerson}</Text>
          </View>
         
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Order Price</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {orderPrice}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Advance</Text>
            <Text style={styles.detailRightText}>{CurrencySign} {advanceAmount || "0"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Bill Date</Text>
            <Text style={styles.detailRightText}>{billDate}</Text>
          </View>
          <View style={styles.detailRow}>
  <Text style={styles.detailLeftText}>Pending Amount</Text>
  <Text style={[styles.detailRightText, { color: 'red' }]}>
    {CurrencySign} {remainingAmount.toFixed(2)}
  </Text>
</View>
<View style={[styles.detailRow, { flexDirection: "column" }]}>
  <Text style={[styles.detailLeftText,{textAlign:'center',fontWeight:'bold'}]}>Products</Text>
  {products.map((item, index) => (
    <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
      <Text style={{ fontSize: 13 }}>
        {item.name} (x{item.quantity})
      </Text>
      <Text style={{ fontSize: 13, fontWeight: "bold" }}>
        {CurrencySign} {(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  ))}
</View>
       
          {/* Payment Records */}
          {localPayments.length > 0 && (
  <View style={styles.receiptContainer}>
    <Text style={styles.receiptTitle}>Payment Records</Text>
    {localPayments.map((payment, index) => (
      <View style={styles.detailRow} key={index}>
        <Text style={styles.detailLeftText}>{payment.date}</Text>
        <Text style={styles.detailRightText}>{CurrencySign} {payment.amount}</Text>
      </View>
    ))}
  </View>
)}


          {/* Action Buttons */}
          {(localPaymentStatus === "Partially Paid" || localPaymentStatus === "Unpaid") && (
            <View style={[styles.detailRow, ]}>
              <Button label="Add Amount"  onPress={() => {createBillBottomSheetRef.current.open()}} style={styles.editBtn} textStyle={{fontSize:14}}/>
              <Button label="Send Reminder" onPress={() => {
    setModalContent({
      title: "Success",
      message: "Reminder has been successfully send!",
    });
    setShowModal(true);
    // update local state
  }} style={styles.deleteBtn} textStyle={{fontSize:14}}/>
            </View>
          )}
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

<RBSheet
        ref={createBillBottomSheetRef}
        height={400}
        openDuration={250}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}
      >
    <Text style={styles.sheetTitle}>Add Amount</Text>
    <MyTextInput
  label="Enter Amount"
  placeholder="Enter Amount"
  value={amountInput}
  keyboardType="numeric"
  onChange={setAmountInput}
/>
<Button
  label="Submit"
  onPress={() => {
    addAmountFunction()
  }}
  style={{ marginTop: 20 }}
/>

      </RBSheet>
    </>
  );
};

export default BillCard;

// Helper
const getStatusColor = (status?: string) => {
  switch (status) {
    case "Paid":
      return { color: "green" };
    case "Partially Paid":
      return { color: "orange" };
    case "Unpaid":
      return { color: "red" };
    default:
      return { color: Colors.black };
  }
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 12,
    color: Colors.black,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  detailRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLeftText: {
    fontSize: 14,
  },
  detailRightText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  receiptContainer: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  receiptTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  editBtn: {
    width: "48%",
    backgroundColor: Colors.secondary,
  },
  deleteBtn: {
    width: "48%",
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
});
