import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import { SchoolParent } from "../../interface/interfaces";
import Button from "../Button";
import { useNavigation } from "@react-navigation/native";
interface ParentCardProps {
  parent: SchoolParent;
}

const SchoolParentCard = ({ parent }: ParentCardProps) =>  {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
        <View style={styles.avatar}>
          <Image source={{ uri: parent?.parent?.profileImage }} style={styles.profileImage} />
          </View>
          <View>
          <Text style={styles.title}>{parent?.parent?.name}</Text>
          <Text style={styles.subText}>{parent?.relation}</Text>
         </View>
        </View>
        <View style={styles.rightColumn}>
       
        <Text style={[styles.statusText, ]}>
            {parent?.parent?.email}
          </Text>
          <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </View>
      </View>

      {isOpen && (
        <View style={styles.details}>
          <DetailRow label="Child Name" value={`${parent?.children[0]?.firstName} ${parent?.children[0]?.lastName}`} />
          <DetailRow label="Child Class" value={`${parent?.children[0]?.class} (${parent?.children[0]?.section})`} />
          <DetailRow label="Phone" value={`${parent?.parent?.phoneNumber}`} />
          <DetailRow label="Total Students" value={parent?.children?.length ?? 0} />
          <Button label="View Details" onPress={() => navigation.navigate("SchoolParenttDetailsScreen", { parent: parent, } as any)} />

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

export default SchoolParentCard;

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
 
  rightColumn: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  subText: {
    fontSize: 14,
    color: Colors.black,
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
    width:'50%'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width:'50%',
    textAlign:'right'
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
},
leftColumn: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
},
});
