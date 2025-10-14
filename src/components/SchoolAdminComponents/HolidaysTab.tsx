import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import StaffListCard from "./StaffListCard";
import DepartmentListCard from "./DepartmentListCard";
import HolidayListCard from "./HolidayListCard";

// types.ts
// types.ts
export interface HolidayItem {
    id: string;
    holidayTitle: string;
    date: string;
    description: string;
    status: string;
  }
  
  // dummyData.ts
  export const HolidayDummy: HolidayItem[] = [
    {
      id: "H752762",
      holidayTitle: "New Year",
      date: "01 Jan 2024",
      description: "First day of the new year",
      status: "Active",
    },
    {
      id: "H752761",
      holidayTitle: "Martin Luther King Jr. Day",
      date: "15 Jan 2024",
      description: "Celebrating the civil rights leader",
      status: "Active",
    },
    {
      id: "H752760",
      holidayTitle: "Presidents' Day",
      date: "19 Feb 2024",
      description: "Honoring past US Presidents",
      status: "Active",
    },
    {
      id: "H752759",
      holidayTitle: "Good Friday",
      date: "29 Mar 2024",
      description: "Holiday before Easter",
      status: "Active",
    },
    {
      id: "H752758",
      holidayTitle: "Easter Monday",
      date: "01 Apr 2024",
      description: "Holiday after Easter",
      status: "Active",
    },
  ];


const HolidaysTab = () => {
    const renderItem = ({ item }: { item: HolidayItem }) => (
        <HolidayListCard
        id={item.id}
        holidayTitle={item.holidayTitle}
        date={item.date}
        description={item.description}
        status={item.status}
      />
    
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Holidays List" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={HolidayDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default HolidaysTab;

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
    marginTop: 10,
    marginBottom:20
  },
});
