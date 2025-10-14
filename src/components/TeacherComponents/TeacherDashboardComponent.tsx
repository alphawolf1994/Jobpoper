import { StyleSheet, Text, View, FlatList, Image, ScrollView } from "react-native";
import React, { useEffect } from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors, CurrencySign } from "../../utils";
import TeacherHomeCard from "./TeacherHomeCard";
import { Ionicons } from '@expo/vector-icons';
import HomeAttendanceDetails from "../HomeScreenComponents/HomeattendanceDetails";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Toast from "react-native-toast-message";
import { fetchOwnDetails, fetchTeacherTimetable } from "../../redux/slices/teacherSlice";
import Loader from "../Loader";

const TeacherDashboardComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teacherDetails,teacherTimetable, loading, errors } = useSelector(
    (state: RootState) => state.teacherSlice
  );
  const { user, schoolId } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchOwnDetails()).unwrap();

      } catch (err) {

        console.error("Failed to fetch teacher:", err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: typeof err === 'string' ? err : "Failed to load teacher data",
        });
      }
    };
    const fetchTimetable = async () => {
      try {
        await dispatch(fetchTeacherTimetable()).unwrap();
      } catch (err) {
        console.error("Failed to fetch teacher:", err);
      
      }
    };
    fetchData();
    fetchTimetable()
  }, [dispatch]);
 

  // Dummy timetable data for current day
  const currentDayTimetable = [
    {
      id: '1',
      time: '08:00 - 09:30',
      subject: 'Mathematics',
      class: 'Grade 10A',
      room: 'Room 201',
      type: 'Lecture'
    },
    {
      id: '2',
      time: '09:30 - 10:30',
      subject: 'Physics',
      class: 'Grade 11B',
      room: 'Lab 3',
      type: 'Practical'
    },
    {
      id: '3',
      time: '11:00 - 12:30',
      subject: 'Mathematics',
      class: 'Grade 12A',
      room: 'Room 205',
      type: 'Tutorial'
    },
    {
      id: '4',
      time: '13:30 - 15:00',
      subject: 'Advanced Calculus',
      class: 'Grade 12B',
      room: 'Room 210',
      type: 'Lecture'
    },
    {
      id: '5',
      time: '15:30 - 16:30',
      subject: 'Physics',
      class: 'Grade 10C',
      room: 'Lab 2',
      type: 'Discussion'
    }
  ];

  // Get current day name
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[new Date().getDay()];
  // Filter timetable for current day
  const currentDayTimetable1 = teacherTimetable?.find(day => day.day === currentDay);

  return (
    <ScrollView style={styles.container}>
      <View>
      <View style={styles.row}>
        {/* Attendance Summary */}
        <TeacherHomeCard
          title="Assign Classes"
          value={`${teacherDetails?.assignedClasses?.length ?? 0}`}
          color={Colors.SkyBlue}
          icon="book-education"
          iconColor={Colors.black}
        />
         <TeacherHomeCard
          title="Assign Subjects"
          value={`${teacherDetails?.subjects?.length ?? 0}`}
          color={Colors.SkyBlue}
          icon="book"
          iconColor={Colors.black}
        />
        <TeacherHomeCard
          title="Total Students"
          value={`${
    teacherDetails?.assignedClasses
      ? teacherDetails.assignedClasses.reduce(
          (sum, cls) => sum + (cls.maxStudents ?? 0),
          0
        )
      : 0
  }`}
          color={Colors.SkyBlue}
          icon="account-group"
          iconColor={Colors.black}
        />
        <TeacherHomeCard
  title="Monthly Salary"
  value={`${CurrencySign} ${teacherDetails?.basicSalary ?? 0}`} // Tanzanian Shillings
  color={Colors.SkyBlue}
  icon="cash-multiple" // or "currency-usd" for dollar sign
  iconColor={Colors.black}
/>
{/* <TeacherHomeCard
  title="Annual Salary"
  value={`${CurrencySign} 10,200,000`}
  color={Colors.SkyBlue}
  icon="bank" // or "cash-100" for cash stack
  iconColor={Colors.black}
/> */}
 
      </View>

      {/* Today's Timetable Section */}
      <View style={styles.timetableContainer}>
        <View style={styles.timetableHeader}>
          <Ionicons name="time-outline" size={24} color={Colors.primary} />
          <Text style={styles.timetableTitle}>Today's Schedule ({currentDay})</Text>
        </View>

        <FlatList
          data={currentDayTimetable1?.periods}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.timetableItem}>
              <Text style={styles.timeText}>{item.startTime}</Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.subjectText}>{item.subject.name}</Text>
                <View style={styles.metaContainer}>
                  <Text style={styles.metaText}>{currentDayTimetable1?.class.className}</Text>
                  <Text style={styles.metaText}>({currentDayTimetable1?.section.section})</Text>
                  {/* <Text style={[styles.metaText, styles.typeText]}>{item.type}</Text> */}
                </View>
              </View>
              <Text style={styles.endTime}>{item.endTime}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
  
      </View>
   
      <HomeAttendanceDetails></HomeAttendanceDetails>
      {loading && <Loader />}
      </View>
    </ScrollView>
  );
};

export default TeacherDashboardComponent;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   padding: 16,
      // backgroundColor: Colors.Red,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: 'wrap',
      marginTop: 10,
      marginBottom: 20,
    //   gap: 10,
    },
    timetableContainer: {
      backgroundColor: Colors.white,
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    timetableHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
    },
    timetableTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.primary
    },
    timetableItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 12,
    },
    timeText: {
      fontWeight: '500',
      color: Colors.darkGray,
      fontSize: 13,
      minWidth: 40,
    },
    endTime: {
      fontWeight: '500',
      color: Colors.darkGray,
      fontSize: 13,
    },
    detailsContainer: {
      flex: 1,
    },
    subjectText: {
      fontSize: 15,
      fontWeight: '500',
      marginBottom: 4,
      color: Colors.black
    },
    metaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    metaText: {
      fontSize: 13,
      color: Colors.gray,
    },
    typeText: {
      backgroundColor: Colors.lightGray,
      paddingHorizontal: 6,
      borderRadius: 4,
      overflow: 'hidden',
      color: Colors.darkGray,
    },
    separator: {
      height: 1,
      backgroundColor: Colors.lightGray,
      marginVertical: 4
    }
  });