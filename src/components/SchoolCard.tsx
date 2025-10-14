import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Colors, widthToDp } from "../utils";
import ImagePath from "../assets/images/ImagePath";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type SchoolCardProps = {
  fullName: string;
  location: string;
  imageUrl: string;
  city: string;
  state: string;
  rating: number;
  establishmentYear: string;
  gender: string;
  schoolType: string;
  contactName: string;
  onEnrollPress: () => void;
};

const SchoolCard: React.FC<SchoolCardProps> = ({
  fullName,
  location,
  imageUrl,
  rating,
  establishmentYear,
  gender,
  schoolType,
  contactName,
  city,
  state,
  onEnrollPress,
}) => {

  const { user } = useSelector(
    (state: RootState) => state.auth
  );
  let userRole = '';
  if(user.email=='driver@gmail.com')
    {
      userRole='driver'
    }
    else
    {
      userRole=Array.isArray(user.role) ? user.role[0] : user.role;
    }
  return (
    <View style={styles.card}>
      {/* School Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }}  style={styles.schoolImage} />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{rating}</Text>
          <FontAwesome name="star" size={20} color={Colors.white} />
        </View>

        <View style={styles.overlay}>
          <MaterialIcons name="location-on" size={14} color="white" />
          <Text style={styles.locationText}>{city}, {state}</Text>
        </View>
      </View>

      {/* School Details */}
      <View style={styles.content}>
        <Text style={styles.schoolName}>{fullName}</Text>
        <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <FontAwesome5 name="flag" size={12} color={Colors.gray} />
          <Text style={styles.infoText}>Estd: <Text style={{color:Colors.black}}>{establishmentYear}</Text></Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome5 name="venus-mars" size={12} color={Colors.gray} />
          <Text style={styles.infoText}>Gender: <Text style={{color:Colors.black}}>{gender}</Text></Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome5 name="book" size={12} color={Colors.gray} />
          <Text style={styles.infoText}>Type: <Text style={{color:Colors.black}}>{schoolType?.split(" ")[0]}</Text></Text>
        </View>
      </View>
      {/* Divider */}
      <View style={styles.divider} />
      <View style={styles.footer}>
        <View style={styles.principalContainer}>
          <FontAwesome name="user-circle" size={40} color={Colors.gray} />
          <Text style={styles.principalName}>{contactName}</Text>
        </View>
        {userRole=='parent' ?<TouchableOpacity style={styles.enrollButton} onPress={onEnrollPress}>
          <Text style={styles.enrollText}>Enroll</Text>
        </TouchableOpacity>:<TouchableOpacity style={styles.enrollButton} >
          <Text style={styles.enrollText}>Contact</Text>
        </TouchableOpacity>}
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 10,
borderWidth:1.5,
borderColor:Colors.grayShade1
   
  },
  imageContainer: {
    position: "relative",
  },
  schoolImage: {
    width: "100%",
    height: widthToDp(50),
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.green,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 5,
  },
  ratingText: {
    color: Colors.white,
   fontWeight:'600',
    marginRight: 10,
    fontSize:16

  },
  overlay: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "white",
    fontSize: 12,
    marginLeft: 3,
  },
  content: {
    padding: 15,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    color: Colors.gray,
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayShade1,
    marginVertical: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal:10,
    paddingVertical:15
  },
  principalContainer: {
    flexDirection: "row",
    alignItems: "center",
    width:'65%'
    
  },
  principalName: {
    fontSize: 18,
    marginLeft: 8,
   paddingRight:20,
    color: Colors.black,
  },
  enrollButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    

  },
  enrollText: {
    color: "white",
    fontWeight: "bold",
    fontSize:16
  },
});

export default SchoolCard;
