import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface LibraryBookIssuesCardProps {
  id: string;
  dateOfIssue: string;
  dueDate: string;
  issueTo: string;
  booksIssued: number;
  bookReturned: number;
  issueRemarks: string;
  imageUrl:string
}

const LibraryBookIssuesCard = ({
  id,
  dateOfIssue,
  dueDate,
  issueTo,
  booksIssued,
  bookReturned,
  issueRemarks,
  imageUrl
}: LibraryBookIssuesCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate pending books
  const pendingBooks = booksIssued - bookReturned;

  // Get initials from issueTo name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <TouchableOpacity 
      onPress={() => setIsOpen(!isOpen)} 
      style={styles.cardContainer}
    >
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <View style={styles.avatar}>
          <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          </View>
          <View>
            <Text style={styles.title}>{issueTo}</Text>
            <Text style={styles.idText}>ID: {id}</Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.dateText}>{dateOfIssue}</Text>
          <Entypo 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="black" 
          />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Due Date" value={dueDate} />
          <DetailRow label="Books Issued" value={booksIssued.toString()} />
          <DetailRow label="Books Returned" value={bookReturned.toString()} />
          <DetailRow label="Pending Books" value={pendingBooks.toString()} />
          <DetailRow label="Status" value={issueRemarks} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default LibraryBookIssuesCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftColumn: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  idText: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.black,
  },
  details: {
    marginTop: 12,
    borderTopWidth: 0.5,
    borderColor: Colors.lightBlue,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.black,
    width: "50%",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width: "50%",
    textAlign: "right",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
},
});