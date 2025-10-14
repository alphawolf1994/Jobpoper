import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import HeadingText from "../HeadingText";

import LibraryBookCard from "./LibraryBookCard";

interface BookItem {
    id: string;
    bookName: string;
    bookNo: string;
    publisher: string;
    author: string;
    subject: string;
    rackNo: string;
    qty: number;
    available: number;
    price: string;
    postDate: string;
  }
  
  const BookDummy: BookItem[] = [
    {
      id: "LB864723",
      bookName: "Echoes of Eternity",
      bookNo: "501",
      publisher: "Aurora Press",
      author: "Isabella Rivers",
      subject: "History",
      rackNo: "6550",
      qty: 150,
      available: 120,
      price: "$300",
      postDate: "25 Apr 2024",
    },
    {
      id: "LB864722",
      bookName: "The Stars of Eldorado",
      bookNo: "502",
      publisher: "Nebula Press",
      author: "Amanda Grayson",
      subject: "Science",
      rackNo: "6551",
      qty: 200,
      available: 180,
      price: "$280",
      postDate: "28 Apr 2024",
    },
    {
      id: "LB864722",
      bookName: "The Glass Painter",
      bookNo: "503",
      publisher: "Artisan Reads",
      author: "Isabel Marquez",
      subject: "Literary",
      rackNo: "6552",
      qty: 180,
      available: 160,
      price: "$320",
      postDate: "04 May 2024",
    },
    {
      id: "LB864720",
      bookName: "Beyond the Edge",
      bookNo: "504",
      publisher: "Explorer's Press",
      author: "Leo Finnegan",
      subject: "Adventure",
      rackNo: "6553",
      qty: 120,
      available: 100,
      price: "$350",
      postDate: "18 May 2024",
    },
    {
      id: "LB864719",
      bookName: "Shadow Symphony",
      bookNo: "505",
      publisher: "Harmony House",
      author: "Claire Vincent",
      subject: "Gothic",
      rackNo: "6554",
      qty: 220,
      available: 160,
      price: "$280",
      postDate: "20 May 2024",
    },
  ];
  
  
  


const LibraryBooksTab = () => {
  const renderItem = ({ item }: { item: BookItem }) => (
    
    <LibraryBookCard
    id={item.id}
    bookName={item.bookName}
    bookNo={item.bookNo}
    publisher={item.publisher}
    author={item.author}
    subject={item.subject}
    rackNo={item.rackNo}
    qty={item.qty}
    available={item.available}
    price={item.price}
    postDate={item.postDate}
  
    
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
      <HeadingText text="Library Books List" textStyle={{fontSize:16}}/>
      
       <FlatList
         data={BookDummy}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default LibraryBooksTab;

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
