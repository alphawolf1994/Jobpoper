import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import SyllabusCard from "./SyllabusCard";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { fetchSchoolClassess, fetchSchoolTimeTable } from "../../redux/slices/schoolsSlice";
import DropDownPicker from "react-native-dropdown-picker";

const TimeTableTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schoolClasses, schoolTimeTable, loading, errors } = useSelector(
    (state: RootState) => state.schoolsSlice
  );


  const [openSchoolType, setOpenSchoolType] = useState(false);
  const [openStartingGrade, setOpenStartingGrade] = useState(false);

  // State for selected class and section
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // State for dropdown items
  const [classItems, setClassItems] = useState<{ label: string, value: string }[]>([]);
  const [sectionItems, setSectionItems] = useState<{ label: string, value: string }[]>([]);
  // Days of the week in order
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [emptyRecord, setEmptyRecord] = useState(false);
  const [hideRecordOnLoad, setHideRecordOnLoad] = useState(false);
  // Transform schoolClasses into dropdown items format
  useEffect(() => {
    if (schoolClasses && schoolClasses.length > 0) {
      const classes = schoolClasses.map(cls => ({
        label: cls.className,
        value: cls._id
      }));
      setClassItems(classes);
    }
  }, [schoolClasses]);

  // Update section items when selected class changes
  useEffect(() => {
    if (selectedClassId) {
      const selectedClass = schoolClasses.find(cls => cls._id === selectedClassId);
      if (selectedClass && selectedClass.sections) {
        const sections = selectedClass.sections.map(sec => ({
          label: sec.section,
          value: sec._id
        }));
        setSectionItems(sections);
        // Reset selected section when class changes
        setSelectedSectionId(null);
      }
    } else {
      setSectionItems([]);
      setSelectedSectionId(null);
    }
  }, [selectedClassId, schoolClasses]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSchoolClassess()).unwrap();
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: typeof err === 'string' ? err : "Failed to load classes",
        });
      }
    };
    fetchData();
  }, [dispatch]);


  const fetchTimeTable = async () => {
    if (selectedClassId && selectedSectionId) {
      setHideRecordOnLoad(true)
      setEmptyRecord(false)
      const classId = selectedClassId
      const sectionId = selectedSectionId
      try {
        await dispatch(fetchSchoolTimeTable({ classId, sectionId })).unwrap();
      } catch (err) {
        console.error("Failed to fetch timetable:", err);
        setEmptyRecord(true)

      }
    }
  };
  // Log selected class and section IDs when they change
  useEffect(() => {
    if (selectedClassId && selectedSectionId) {
      console.log("Selected Class ID:", selectedClassId);
      console.log("Selected Section ID:", selectedSectionId);
      // Here you can call your API to get timetable data
      // using selectedClassId and selectedSectionId
    }
  }, [selectedClassId, selectedSectionId]);
  useEffect(() => {

    console.log("schoolTimeTable:", schoolTimeTable);

    // Here you can call your API to get timetable data
    // using selectedClassId and selectedSectionId

  }, [schoolTimeTable]);

  const renderPeriod = (period: any, index: number) => {
    if (!period || !period.startTime) {
      return (
        <View style={styles.periodContainer} key={index}>
          <Text style={styles.noPeriodText}>No periods scheduled</Text>
        </View>
      );
    }

    return (
      <View style={styles.periodContainer} key={index}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>🕒 {period.startTime} - {period.endTime}</Text>
        </View>
        <Text style={styles.subjectText}>Subject: {period.subject?.name || 'N/A'}</Text>
        <Text style={styles.teacherText}>Teacher: {period.teacher?.user?.name || 'N/A'}</Text>
      </View>
    );
  };

  const renderDayColumn = (day: string) => {
    const periods = schoolTimeTable?.[day] || [];

    return (
      <View style={styles.dayColumn} key={day}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayHeaderText}>{day}</Text>
        </View>
        {periods.length > 0 ? (
          periods.map((period: any, index: number) => renderPeriod(period, index))
        ) : (
          <View style={styles.periodContainer}>
            <Text style={styles.noPeriodText}>No periods scheduled</Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        {/* Class Dropdown */}
        <View style={styles.row}>
          <Text style={styles.label}>Select Class</Text>
          <DropDownPicker
            open={openSchoolType}
            value={selectedClassId}
            items={classItems}
            setOpen={setOpenSchoolType}
            setValue={setSelectedClassId}
            placeholder="Select Class"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={4000}
            zIndexInverse={1000}
            onChangeValue={(value) => {
              // This will trigger the section items update via useEffect
            }}
          />
        </View>

        {/* Section Dropdown */}
        <View style={styles.row}>
          <Text style={styles.label}>Select Section</Text>
          <DropDownPicker
            open={openStartingGrade}
            value={selectedSectionId}
            items={sectionItems}
            setOpen={setOpenStartingGrade}
            setValue={setSelectedSectionId}
            placeholder="Select Section"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
            zIndexInverse={2000}
            disabled={!selectedClassId}
            onChangeValue={(value) => {
              console.log("dddd")
            }}
          />
        </View>
        <TouchableOpacity style={[
          styles.button,
          (!selectedClassId || !selectedSectionId) && styles.disabledButton
        ]}
          onPress={fetchTimeTable} disabled={!selectedClassId || !selectedSectionId}>
          <Text style={styles.buttonText}>Fetch TimeTable</Text>
        </TouchableOpacity>

        {/* Timetable */}
        {schoolTimeTable && hideRecordOnLoad && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timetableContainer}>
              {daysOfWeek.map(day => renderDayColumn(day))}
            </View>
          </ScrollView>
        )}
        {emptyRecord && (

          <View style={[styles.periodContainer, { borderBottomWidth: 0 }]}>
            <Text style={styles.noPeriodText}>No timetable found</Text>
          </View>

        )}
      </KeyboardAvoidingScrollView>
    </View>
  );
};

export default TimeTableTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: 'wrap',
    marginTop: 0,
    marginBottom: 10
  },
  dropdown: {
    borderWidth: 0.5,
    borderColor: Colors.gray,
    borderRadius: 6,
    minHeight: 42,
    backgroundColor: Colors.white,
  },
  dropdownContainer: {
    borderWidth: 0.5,
    borderColor: Colors.gray,
    borderRadius: 6,
    marginTop: 2,
  },
  label: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  timetableContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20
  },
  dayColumn: {
    width: 160,
    marginRight: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dayHeader: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dayHeaderText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  periodContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 3,
  },
  teacherText: {
    fontSize: 13,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  noPeriodText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    paddingVertical: 10,
  },
  disabledButton: {
    backgroundColor: Colors.gray, // or any color you prefer for disabled state
    opacity: 0.6,
  },

});