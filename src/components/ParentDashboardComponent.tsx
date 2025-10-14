import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { HeadingText, NoticeBoardCard } from "./index";
import { useNavigation } from "@react-navigation/native";
import FeeDetailCard from "./FeeDetailCard";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors, CurrencySign } from "../utils";
import RBSheet from "react-native-raw-bottom-sheet";
import HomeAttendanceDetails from "./HomeScreenComponents/HomeattendanceDetails";
import HomeworkCard from "./HomeScreenComponents/HomeWorkCard";
import SubjectResultCard from "./HomeScreenComponents/SubjectResultCard";
import EventsList from "./HomeScreenComponents/EventsList";
import BusTracking from "./HomeScreenComponents/BusTracking";
import ImagePath from "../assets/images/ImagePath";
import ParentOnboardingGuide from "./ParentOnboardingGuide";

const events = [
  {
    id: "1",
    title: "Farewell",
    date: "11 Mar 2024",
    image: ImagePath.noticePlaceholder,
    dayType: "Half Day" as "Half Day",
  },
  {
    id: "2",
    title: "Annual Day",
    date: "11 Mar 2024",
    image: ImagePath.attendanceIcon,
    dayType: "Half Day" as "Half Day",
  },
];

const busStops = [
  { id: "1", title: "Picked Up", description: "Child picked up",  estimatedTime: "7:30 AM", actualTime: "7:35 AM", status: "completed" as const ,delayReason : "Traffic congestion near downtown."},
  { id: "2", title: "Stop 1", description: "Reached first stop", estimatedTime: "7:45 AM", actualTime: "7:45 AM", status: "completed" as const , },
  { id: "3", title: "Stop 2", description: "Reached second stop", estimatedTime: "7:50 AM", actualTime: "7:50 AM", status: "completed" as const, },
  { id: "4", title: "Stop 3", description: "Approaching final stop", estimatedTime: "8:00 AM", actualTime: "8:05 AM", status: "current" as const,delayReason : "Traffic congestion near downtown." },
  { id: "5", title: "School Arrival", description: "Arrived at school", estimatedTime: "8:15 AM", actualTime: "8:15 AM", status: "upcoming" as const },
];

const driverContact = "+123456789"; // Example driver number

// Sample Paid Fees Data
const paidFeesData = [
  { id: "1", title: "School Fee for Jan", amount: "5600" },
  { id: "2", title: "Exam Fee for Jan", amount: "200" },
];

const homeworkData = [
  {
    subject: "Physics",
    subjectColor: Colors.TanBrown,
    title: "Write about Theory of Pendulum",
    teacher: "Aaron",
    dueDate: "16 Jun 2024",
    imageUrl: "https://source.unsplash.com/60x60/?physics",
  },
  {
    subject: "Chemistry",
    subjectColor:Colors.green,
    title: "Chemistry - Change of Elements",
    teacher: "Hellana",
    dueDate: "16 Jun 2024",
    imageUrl: "https://source.unsplash.com/60x60/?chemistry",
  },
  {
    subject: "Maths",
    subjectColor: Colors.Red,
    title: "Maths - Problems to Solve Page 21",
    teacher: "Morgan",
    dueDate: "21 Jun 2024",
    imageUrl: "https://source.unsplash.com/60x60/?math",
  },
  {
    subject: "English",
    subjectColor: Colors.secondary,
    title: "English - Vocabulary Introduction",
    teacher: "Daniel Josua",
    dueDate: "21 Jun 2024",
    imageUrl: "https://source.unsplash.com/60x60/?english",
  },
];

const resultsData = [
  { subject: "Mathematics", totalMarks: 100, obtainMarks: 85 },
  { subject: "Science", totalMarks: 100, obtainMarks: 78 },
  { subject: "English", totalMarks: 100, obtainMarks: 92 },
  { subject: "History", totalMarks: 100, obtainMarks: 67 },
  { subject: "Computer Science", totalMarks: 100, obtainMarks: 88 },
  { subject: "Art", totalMarks: 100, obtainMarks: 50 },
];

const ParentDashboardComponent = () => {
  const paidFeeBottomSheetRef = useRef<any>(null);
  const examListBottomSheetRef = useRef<any>(null);
  const [selecetdExam, setSelecetdExam] = useState('Final Exam');
  const navigation = useNavigation();

  // Local state for onboarding - starts as true (first time user)
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Calculate total paid amount
  const totalAmount = paidFeesData.reduce((sum, fee) => sum + parseFloat(fee.amount.replace("$ ", "")), 0);

  const openFeeHistory = () => {
    paidFeeBottomSheetRef.current.close()
    // navigation.navigate("FeeDetailsScreen")
  }

  const selectExam = (value: any) => {
    setSelecetdExam(value)
    examListBottomSheetRef.current.close()
  }

  // Show onboarding guide for first-time users
  if (showOnboarding) {
    return <ParentOnboardingGuide onComplete={handleOnboardingComplete} />;
  }

  return (
    <View style={styles.container}>
      {/* Demo Toggle - Remove this in production */}
      {/* <View style={styles.demoToggleContainer}>
        <TouchableOpacity
          style={styles.demoToggleButton}
          onPress={() => setShowOnboarding(!showOnboarding)}
        >
          <Text style={styles.demoToggleText}>
            {showOnboarding ? 'Show Dashboard' : 'Show Onboarding'}
          </Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.headerContainer}>
        <HeadingText text="Fee Alert" />
        <TouchableOpacity
          style={styles.paidFeeContainer}
          onPress={() => {paidFeeBottomSheetRef.current.open()}}
        >
          <Feather name="check-circle" size={24} color="white" />
          <Text style={[styles.feeText]}>
            Paid fees
          </Text>
        </TouchableOpacity>
      </View>
    
      <View style={{marginTop:10,marginBottom:20}}>
        <FeeDetailCard title="School Fee for Jan" subtitle="5,600" paid={false} />
        <FeeDetailCard title="Exam Fee for Jan" subtitle="200" paid={false} />
      </View>

      <View style={[styles.headerContainer,{marginTop:10}]}>
        <HeadingText text="Transport Status" />
        <TouchableOpacity
          style={styles.paidFeeContainer}
          onPress={() => {/* navigation.navigate("TransportDetailsScreen") */}}
        >
          <Text style={[styles.feeText]}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
      <BusTracking stops={busStops} driverContact={driverContact} />

      <HomeAttendanceDetails></HomeAttendanceDetails>

      <View style={[styles.headerContainer,{marginTop:30}]}>
        <HeadingText text="Home Work" />
      </View>
      <View style={{paddingHorizontal:3}}>
        {/* Homework cards */}
        {homeworkData.map((hw, index) => (
          <HomeworkCard key={index} homework={hw} />
        ))}
      </View>

      <View style={[styles.headerContainer,{marginTop:30}]}>
        <HeadingText text="Academic Results" />
        <TouchableOpacity
          style={styles.paidFeeContainer}
          onPress={() => {examListBottomSheetRef.current.open()}}
        >
          <Text style={[styles.feeText]}>
            {selecetdExam}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.rowContainer}>
        {resultsData.map((result, index) => (
          <View key={index} style={styles.cardWrapper}>
            <SubjectResultCard {...result} />
          </View>
        ))}
      </View>

      <View style={[styles.headerContainer,{marginTop:20}]}>
        <HeadingText text="Events List" />
        <TouchableOpacity
          style={styles.paidFeeContainer}
          onPress={()=>{/* navigation.navigate('EventsScreen') */}}
        >
          <Text style={[styles.feeText]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>
      <EventsList events={events} onViewAll={() => console.log("View All Events")} />

      {/* Bottom Sheet */}
      <RBSheet
        ref={paidFeeBottomSheetRef}
        height={400}
        openDuration={250}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.sheetTitle}>Paid Fees - Current Month</Text>
          <TouchableOpacity
            style={styles.paidFeeContainer}
            onPress={() => {openFeeHistory()}}
          >
            <MaterialIcons name="history" size={24} color="white" />
            <Text style={[styles.feeText]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={paidFeesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FeeDetailCard title={item.title} subtitle={item.amount} paid={true} />
          )}
        />

        {/* Total Amount */}
        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalText}>Total Amount:</Text>
          <Text style={styles.totalAmount}>{CurrencySign} {totalAmount}</Text>
        </View>
      </RBSheet>

      <RBSheet
        ref={examListBottomSheetRef}
        height={200}
        openDuration={250}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}
      >
        <TouchableOpacity
          style={styles.examContainer}
          onPress={() => {selectExam('Mid Exam')}}
        >
          <Text style={[styles.examText]}> Mid Exam </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.examContainer}
          onPress={() => {selectExam('Final Exam')}}
        >
          <Text style={[styles.examText]}>Final Exam</Text>
        </TouchableOpacity>
      </RBSheet>
    </View>
  );
};

export default ParentDashboardComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  totalAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.Red,
  },
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%", // Ensures two cards fit in one row
    marginBottom: 10, // Adds spacing between rows
  },
  examContainer:{
    backgroundColor:Colors.primary,
    paddingVertical:15,
    width:'100%',
    textAlign:'center',
    borderRadius:15,
    marginTop:10,
  },
  examText:{
    textAlign:'center',
    fontSize:16,
    fontWeight:'bold',
    color:Colors.white
  },
  demoToggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.lightGray,
  },
  demoToggleButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  demoToggleText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});