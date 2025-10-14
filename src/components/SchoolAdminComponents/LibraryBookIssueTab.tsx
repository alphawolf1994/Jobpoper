import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import LibraryBookIssuesCard from "./LibraryBookIssuesCard";

// types.ts
export interface BookIssueItem {
    id: string;
    dateOfIssue: string;
    dueDate: string;
    issueTo: string;
    booksIssued: number;
    bookReturned: number;
    issueRemarks: string;
    imageUrl:string
  }
  
  // dummyData.ts
  export const BookIssueDummy: BookIssueItem[] = [
    {
      id: "IB853629",
      dateOfIssue: "20 Apr 2024",
      dueDate: "19 May 2024",
      issueTo: "Janet II, A",
      booksIssued: 1,
      bookReturned: 0,
      issueRemarks: "Book Issued",
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: "IB853628",
      dateOfIssue: "24 Apr 2024",
      dueDate: "20 May 2024",
      issueTo: "Joann IV, B",
      booksIssued: 5,
      bookReturned: 3,
      issueRemarks: "Book Issued",
      imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      id: "IB853627",
      dateOfIssue: "02 May 2024",
      dueDate: "01 Jun 2024",
      issueTo: "Kathleen",
      booksIssued: 4,
      bookReturned: 2,
      issueRemarks: "Book Issued",
      imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: "IB853626",
      dateOfIssue: "16 May 2024",
      dueDate: "15 Jun 2024",
      issueTo: "Gifford I, B",
      booksIssued: 3,
      bookReturned: 2,
      issueRemarks: "Book Issued",
      imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    {
      id: "IB853625",
      dateOfIssue: "22 May 2024",
      dueDate: "20 Jun 2024",
      issueTo: "Lisa II, B",
      booksIssued: 6,
      bookReturned: 4,
      issueRemarks: "Book Issued",
      imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
  ];
  
  


const LibraryBookIssueTab = () => {
  const renderItem = ({ item }: { item: BookIssueItem }) => (
    
    <LibraryBookIssuesCard
    id={item.id}
    dateOfIssue={item.dateOfIssue}
    dueDate={item.dueDate}
    issueTo={item.issueTo}
    booksIssued={item.booksIssued}
    bookReturned={item.bookReturned}
    issueRemarks={item.issueRemarks}
    imageUrl={item.imageUrl}
  
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Issue Books List" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={BookIssueDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default LibraryBookIssueTab;

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
