import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "../../utils";
import Checkbox from "expo-checkbox";
import HeadingText from "../HeadingText";
import { Feather } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import AttendanceCard from "./AttendanceCard";
import LeaveCard from "./LeaveCard";
import DatePicker from "react-native-date-picker";


 // Dummy Data for Leaves
 const leaveData = [
  {
    title: "Sick Leave",
    fromDate: "2025-03-10",
    toDate: "2025-03-12",
    details: "Medical leave due to fever and flu.",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    title: "Casual Leave",
    fromDate: "2025-03-15",
    toDate: "",
    details: "Personal work leave.",
    status: "Approved",
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    title: "Emergency Leave",
    fromDate: "2025-02-25",
    toDate: "2025-02-27",
    details: "Family emergency leave.",
    status: "Rejected",
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
  },
];
const HomeAttendanceDetails = () => {
    const applyLeaveBottomSheetRef = useRef<any>(null);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [reason, setReason] = useState("");
  
    const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false);
    const [isToDatePickerVisible, setToDatePickerVisible] = useState(false);
  
    const submitLeaveRequest = () => {
      console.log("Leave Applied:", { fromDate, toDate, reason });
      applyLeaveBottomSheetRef.current.close();
    };
  return (
   <View>
    <View style={styles.headerContainer}>
      <HeadingText text="Attendance" />
        <TouchableOpacity
        style={styles.paidFeeContainer}
        onPress={() => {applyLeaveBottomSheetRef.current.open()}}
      >
        <Feather name="calendar" size={24} color="white" />
        <Text style={[styles.feeText]}>
          Apply Leave
        </Text>
      </TouchableOpacity>
      </View>
      <View style={styles.row}>
        {/* Attendance Summary */}
        <AttendanceCard
          title="March Attendance"
          value1={20}
          value2={5}
          label1="Presents"
          label2="Absents"
          color={Colors.SkyBlue}
          icon="calendar-check"
          iconColor={Colors.primary}
        />

        {/* Medical Leaves */}
        <AttendanceCard
          title="Medical Leaves (10)"
          value1={5}
          value2={5}
          label1="Used"
          label2="Available"
          color={Colors.SkyBlue}
          icon="hospital-box"
          iconColor={Colors.secondary}
        />
      </View>
      <View style={styles.headerContainer}>
      <HeadingText text="Leave Status" />
      
      </View>
      {leaveData.map((leave, index) => (
        <LeaveCard
          key={index}
          title={leave.title}
          fromDate={leave.fromDate}
          toDate={leave.toDate}
          details={leave.details}
          status={leave.status}
          profileImg={leave.profileImg}
        />
      ))}
        {/* Bottom Sheet */}
        <RBSheet
      ref={applyLeaveBottomSheetRef}
      height={450}
      openDuration={250}
      customStyles={{ container: styles.bottomSheetContainer }}
    >
      <Text style={styles.sheetTitle}>Apply for Leave</Text>

      {/* FROM DATE */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setFromDatePickerVisible(true)}
      >
        <Text style={styles.dateText}>
          {fromDate ? fromDate.toDateString() : "Select From Date"}
        </Text>
      </TouchableOpacity>

      {/* TO DATE */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setToDatePickerVisible(true)}
      >
        <Text style={styles.dateText}>
          {toDate ? toDate.toDateString() : "Select To Date"}
        </Text>
      </TouchableOpacity>

      {/* REASON TEXTAREA */}
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.textArea}
        placeholder="Enter reason for leave..."
        multiline
        numberOfLines={4}
        value={reason}
        onChangeText={setReason}
      />
</View>
      {/* SUBMIT BUTTON */}
      <TouchableOpacity style={styles.submitButton} onPress={submitLeaveRequest}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* DATE PICKERS */}
      <DatePicker
        modal
        mode="date"
        open={isFromDatePickerVisible}
        date={fromDate || new Date()}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setFromDate(date);
          setFromDatePickerVisible(false);
        }}
        onCancel={() => setFromDatePickerVisible(false)}
      />

      <DatePicker
        modal
        mode="date"
        open={isToDatePickerVisible}
        date={toDate || new Date()}
          minimumDate={new Date()}
        onConfirm={(date) => {
          setToDate(date);
          setToDatePickerVisible(false);
        }}
        onCancel={() => setToDatePickerVisible(false)}
      />
    </RBSheet>
   </View>
  );
};

export default HomeAttendanceDetails;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
     
        marginVertical:10,
       
      },
      paidFeeContainer:{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor:Colors.primary,
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:10
      },
      bottomSheetContainer: {
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      feeText:{
        marginLeft: 8,
        fontSize: 16, 
        fontWeight:'bold',
        color:Colors.white
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop:10
      },
      sheetTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
      },
      inputContainer:{
        flexDirection: "row",
        alignItems: "center",
        borderColor:Colors.gray,
        borderWidth:1,
        borderRadius:10,
        padding:10,
        marginTop:10
      },
      input: {
        flex: 1,
        fontSize: 16,
        color: Colors.black,
       
      
      },
      dateInput: {
        backgroundColor: Colors.lightGray,
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
      },
    
      textArea: {
       marginBottom:10,
        height:100,
        textAlignVertical: "top",
      },
      submitButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20, 
        zIndex: 0, 
      },
      dateText: {
        marginLeft: 8,
        fontSize: 16,
      },
      buttonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
      },
});
