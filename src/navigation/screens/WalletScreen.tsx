import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList,ScrollView, Alert } from "react-native";
import { Button, HeaderMain, HeadingText } from "../../components";

import { MainStyles } from "../../assets/styles";
import { Colors, CurrencySign } from "../../utils";
import WalletTransactionHistory from "../../components/WalletTransactionHistory";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import TransferMoneyFromWallet from "../../components/TransferMoneyFromWallet";
import AddMoneyToWallet from "../../components/AddMoneyToWallet";
import { addFunds } from "../../redux/slices/walletSlice";




const WalletScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { balance } = useSelector(
    (state: RootState) => state.walletSlice);
    const [isTransferModalVisible, setTransferModalVisible] = useState(false);
    const [isAddMoneyModalVisible, setIsAddMoneyModalVisible] = useState(false);
    const handleConfirmPayment = (data: any) => {

  
      const transferAmount = parseFloat(data.amount);

      // Deduct amount from current balance
      dispatch(addFunds(transferAmount));
      // Assuming you store wallet balance in state
    
      // Close the modal
      setIsAddMoneyModalVisible(false);
  
      // Show success alert
      Alert.alert("Success", `Amount ${CurrencySign}${data.amount} added to your wallet successfully!`);
  };
  return (
    <View style={styles.container}>
      <HeaderMain title="My Wallet" />

      <View style={MainStyles.MainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.balanceContainer}>
    <Text style={styles.cardTitle}>Wallet Balance</Text>
          <Text style={styles.cardSubtitle}>{CurrencySign} {balance}</Text>
    </View>
    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
    <Button label="Transfer" style={styles.buttonStyle} onPress={()=>{setTransferModalVisible(true)}} />
    <Button label="Add Money"  style={styles.buttonStyle1} onPress={()=>{setIsAddMoneyModalVisible(true)}} />
    </View>
  
    <WalletTransactionHistory/>

    <TransferMoneyFromWallet 
                isVisible={isTransferModalVisible} 
                onClose={() => setTransferModalVisible(false)} 
            />
            <AddMoneyToWallet 
        isVisible={isAddMoneyModalVisible} 
        onClose={() => setIsAddMoneyModalVisible(false)}
        onConfirmPayment={handleConfirmPayment} 
      />

          </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  balanceContainer:{
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
    marginHorizontal:2
  },
  cardTitle: { fontSize: 20, fontWeight: "bold" ,color: Colors.secondary,marginBottom:10 },
  cardSubtitle: { fontSize: 20,color: Colors.black,fontWeight: "bold"  },
  buttonStyle:{
    width:'45%',
   
    
  },
  buttonStyle1:{
    width:'45%',
    backgroundColor:Colors.green,
  }
});

export default WalletScreen;
