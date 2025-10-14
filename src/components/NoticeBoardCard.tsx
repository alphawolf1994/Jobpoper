import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors, heightToDp, widthToDp } from "../utils";
import ImagePath from "../assets/images/ImagePath";

type NoticeItem = {
  key: string;
};
const NoticeBoardCard: React.FC<{ item: NoticeItem; navigation: any }> = ({ item, navigation }) => {

  const colors = [Colors.SkyBlue, Colors.lightMintGreen, Colors.PastelPink]; // Replace with your desired colors

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <TouchableOpacity
    onPress={() => {
      console.log()
    }}
      style={[styles.noticeCard, { backgroundColor: randomColor }]}
    >
      <Image style={styles.noticeImage} source={ImagePath.noticePlaceholder} />
      <Text style={styles.noticeTitle}>
        Summer Book Fair at School Campus in June
      </Text>
      <Text style={styles.noticeDate}>02 March 2025</Text>
    </TouchableOpacity>
  );
};

export default NoticeBoardCard;

const styles = StyleSheet.create({
  noticeCard: {
    flex: 1,
    margin: 10,
    padding: 8,
    borderRadius: 10,
    height: heightToDp(20),
    width: widthToDp(40),
  },
  noticeTitle: {
    color: "black",
    fontSize: 13,
    textAlign: 'left',
  },
  noticeDate: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 12,
    textAlign: "left",
    marginTop: 15,
  },
  noticeImage: {
    width: widthToDp(12),
    height: heightToDp(5),
    marginBottom: 8,
    borderRadius: 10,
    resizeMode: "contain",
  },
});
