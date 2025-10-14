import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";

interface LibraryBookCardProps {
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

const LibraryBookCard = ({
  id,
  bookName,
  bookNo,
  publisher,
  author,
  subject,
  rackNo,
  qty,
  available,
  price,
  postDate,
}: LibraryBookCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (title: string) => {
    return title
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
          {/* <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(bookName)}</Text>
          </View> */}
          <View>
            <Text style={styles.title}>{bookName}</Text>
            <Text style={styles.authorText}>by {author}</Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.statusText}>ID: {id}</Text>
          <Entypo 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="black" 
          />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Book No" value={bookNo} />
          <DetailRow label="Publisher" value={publisher} />
          <DetailRow label="Subject" value={subject} />
          <DetailRow label="Rack No" value={rackNo} />
          <DetailRow label="Total Qty" value={qty.toString()} />
          <DetailRow label="Available" value={available.toString()} />
          <DetailRow label="Price" value={price} />
          <DetailRow label="Added Date" value={postDate} />
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

export default LibraryBookCard;

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
  authorText: {
    fontSize: 12,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
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
    width: "40%",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width: "60%",
    textAlign: "right",
  },
});