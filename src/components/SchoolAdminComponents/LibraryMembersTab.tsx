import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";
import LibraryMemberCard from "./LibraryMemberCard";

interface SchoolTeacherCardProps {
    id: string;
    name: string;
    cardNo: string;
    email: string;
    dateOfJoin: string;
    mobile: string;
    imageUrl:string
  }
  
  const SchoolTeacherDummy: SchoolTeacherCardProps[] = [
    {
      id: "LM823748",
      name: "James",
      cardNo: "501",
      email: "james@example.com",
      dateOfJoin: "22 Apr 2024",
      mobile: "+1 78429 82414",
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: "LM823747",
      name: "Garcia",
      cardNo: "502",
      email: "garcia@example.com",
      dateOfJoin: "30 Apr 2024",
      mobile: "+1 37489 46485",
      imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      id: "LM823746",
      name: "Frank",
      cardNo: "503",
      email: "frank@example.com",
      dateOfJoin: "05 May 2024",
      mobile: "+1 87651 64816",
      imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: "LM823745",
      name: "Jennie",
      cardNo: "504",
      email: "jennie@example.com",
      dateOfJoin: "16 May 2024",
      mobile: "+1 49879 86498",
      imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    {
      id: "LM823744",
      name: "Paul",
      cardNo: "505",
      email: "paul@example.com",
      dateOfJoin: "28 May 2024",
      mobile: "+1 69787 87984",
      imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
  ];
  
  
  


const LibraryMembersTab = () => {
  const renderItem = ({ item }: { item: SchoolTeacherCardProps }) => (
    
    <LibraryMemberCard
    id={item.id}
    name={item.name}
    cardNo={item.cardNo}
    email={item.email}
    mobile={item.mobile}
    dateOfJoin={item.dateOfJoin}
    imageUrl={item.imageUrl}
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Library Members List" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={SchoolTeacherDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default LibraryMembersTab;

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
