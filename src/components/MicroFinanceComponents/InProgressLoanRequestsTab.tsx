import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import LoanApplicationCard from "./LoanApplicationCard";
import { useNavigation } from "@react-navigation/native";

type EMI = {
  month: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
};
type LoanApplication = {
  id: string;
  vendorType: 'School' | 'Transporter Company' | 'Uniform Seller' | 'Stationary Seller';
  vendorName: string;
  loanAmount: number;
  requestedDate: string;
  status: 'Pending' | 'In Progress' |'Completed'| 'Rejected';
  purpose: string;
  contactPerson: string;
  contactNumber: string;
  repaymentPeriod: string;
  interestRate: string;
  businessAddress: string;
  imageUrl:string;
  totalRepayableAmount?: number;
  monthlyEMIAmount?: number;
  emis?: EMI[];
};
const generateEMIs = (
  loanAmount: number,
  interestRateStr: string,
  repaymentPeriodStr: string,
  startDateStr: string
): { totalRepayableAmount: number; monthlyEMIAmount: number; emis: EMI[] } => {
  const interestRate = parseFloat(interestRateStr.replace('%', '')) / 100;
  const months = parseInt(repaymentPeriodStr.replace('months', '').trim());
  const totalInterest = loanAmount * interestRate;
  const totalRepayableAmount = loanAmount + totalInterest;
  const monthlyEMIAmount = Math.round(totalRepayableAmount / months);

  const startDate = new Date(startDateStr);
  const emis: EMI[] = [];

  for (let i = 0; i < months; i++) {
    const emiDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const month = emiDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    emis.push({
      month,
      amount: monthlyEMIAmount,
      status: 'Unpaid',
    });
  }

  return { totalRepayableAmount, monthlyEMIAmount, emis };
};
const loanApplications: LoanApplication[] = [

  {
    id: 'APP001',
    vendorType: 'Transporter Company',
    vendorName: 'Swift Transport Solutions',
    loanAmount: 500000,
    requestedDate: '2025-04-10',
    status: 'In Progress',
    purpose: 'Purchase of new school buses',
    contactPerson: 'Ali Raza',
    contactNumber: '+92 300 1234567',
    repaymentPeriod: '12 months',
    interestRate: '14%',
    businessAddress: 'Plot 45, Industrial Zone, Karachi',
    imageUrl:'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 'APP002',
    vendorType: 'Uniform Seller',
    vendorName: 'Student Wear House',
    loanAmount: 150000,
    requestedDate: '2025-04-08',
    status: 'In Progress',
    purpose: 'Bulk stock purchase for summer uniforms',
    contactPerson: 'Sana Ahmed',
    contactNumber: '+92 334 9876543',
    repaymentPeriod: '6 months',
    interestRate: '12%',
    businessAddress: 'Shop #12, Liberty Market, Lahore',
    imageUrl:'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 'APP003',
    vendorType: 'Stationary Seller',
    vendorName: 'Smart Stationers',
    loanAmount: 100000,
    requestedDate: '2025-04-05',
    status: 'In Progress',
    purpose: 'Stock expansion for exam season',
    contactPerson: 'Bilal Khan',
    contactNumber: '+92 345 2233445',
    repaymentPeriod: '9 months',
    interestRate: '13%',
    businessAddress: 'Main Bazar, Faisalabad',
    imageUrl:'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 'APP004',
    vendorType: 'School',
    vendorName: 'Bright Future School',
    loanAmount: 800000,
    requestedDate: '2025-04-02',
    status: 'In Progress',
    purpose: 'Campus renovation and new equipment purchase',
    contactPerson: 'Principal Ms. Hina',
    contactNumber: '+92 321 5566778',
    repaymentPeriod: '24 months',
    interestRate: '10%',
    businessAddress: 'Street 21, Gulberg, Lahore',
    imageUrl:'https://media.istockphoto.com/id/171306436/photo/red-brick-high-school-building-exterior.jpg?s=612x612&w=0&k=20&c=vksDyCVrfCpvb9uk4-wcBYu6jbTZ3nCOkGHPSgNy-L0='
  }
];
loanApplications.forEach((loan) => {
  const { totalRepayableAmount, monthlyEMIAmount, emis } = generateEMIs(
    loan.loanAmount,
    loan.interestRate,
    loan.repaymentPeriod,
    loan.requestedDate
  );
  loan.totalRepayableAmount = totalRepayableAmount;
  loan.monthlyEMIAmount = monthlyEMIAmount;
  loan.emis = emis;
});

const InProgressLoanRequestsTab = () => {
  const addLoanBottomSheetRef = useRef<any>(null);
 const navigation = useNavigation();
  const handleVehicleSubmit = (formData:any) => {
      console.log("Service Data Submitted:", formData);
      // handle API call or state update here
      addLoanBottomSheetRef.current?.close();
    };
 
  const renderItem = ({ item }: { item: LoanApplication }) => (
    
    <LoanApplicationCard
    vendorType={item.vendorType}
    vendorName={item.vendorName}
    loanAmount={item.loanAmount}
    requestedDate={item.requestedDate}
    status={item.status}
    purpose={item.purpose}
    contactPerson={item.contactPerson}
    contactNumber={item.contactNumber}
    repaymentPeriod={item.repaymentPeriod}
    interestRate={item.interestRate}
    businessAddress={item.businessAddress}
    imageUrl={item.imageUrl}
    totalRepayableAmount={item.totalRepayableAmount}
    monthlyEMIAmount={item.monthlyEMIAmount}
    emis={item.emis}
        navigation={navigation}
  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <View style={styles.headerContainer}>
      {/* <HeadingText text="Loan Applications" /> */}
        
      </View>
       <FlatList
         data={loanApplications}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    
    </View>
  );
};

export default InProgressLoanRequestsTab;

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
 
    // marginVertical:10,
   
  },
  paidFeeContainer:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:Colors.primary,
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:10
  },
 
  feeText:{
    marginLeft: 8,
    fontSize: 16, 
    fontWeight:'bold',
    color:Colors.white
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
