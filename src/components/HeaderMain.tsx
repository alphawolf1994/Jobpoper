import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ImageSourcePropType,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import ImagePath from "../assets/images/ImagePath";
import { Colors, heightToDp, widthToDp } from "../utils";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MainStyles } from "../assets/styles";
import ProfileImageHeader from "./ProfileImageHeader";

// Define the props for the Header component
interface HeaderMainProps {
  title: string; // Title to display in the header
  children?: React.ReactNode; // Children to render inside the header
  showChild?:boolean;
  avatar?:string
}

const HeaderMain: React.FC<HeaderMainProps> = ({ title, children,showChild,avatar }) => {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={ImagePath.HeaderMainBg as ImageSourcePropType} // Cast to ImageSourcePropType for type safety
      style={styles.header}
      blurRadius={3}
      imageStyle={{
        height: heightToDp(50),
        width: widthToDp(100),
        resizeMode: "cover",
        justifyContent: "flex-start",
        alignContent: "flex-start",
      }}
    >
       <View style={styles.overlay} />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          marginTop: heightToDp(9),
          marginLeft: widthToDp(5),
          flexDirection: "row",
         
        }}
      >
        <AntDesign
          name="arrowleft"
          size={24}
          style={{
            marginRight: 10,
            marginTop: 2,
          }}
          color={Colors.white}
        />
 {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
        <Text style={styles.signInText}>{title}</Text>
      </TouchableOpacity>
      
 {showChild &&<ProfileImageHeader
          showNotification={true}
          imageUrl={
            "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
          }
          ContainerStyles={styles.childList}
        />}
    
    

      {/* Border Radius Effects */}
      {/* <View style={MainStyles.formBorderRadiusWhite} />
      <View style={MainStyles.formBorderRadius} /> */}
    </ImageBackground>
  );
};

// Define styles with TypeScript
const styles = StyleSheet.create({
  header: {
    height: heightToDp(100),
    flexDirection: "row",
    justifyContent: "space-between",
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: Colors.secondary,
    // borderBottomLeftRadius: 30,
  },
  signInText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: "bold",
    marginBottom: heightToDp(20),
  },
  childList:{
    alignItems:'flex-start',
    marginTop: heightToDp(8.5),
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 127, 84, 0.25)",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10,marginTop:-5 },
});

export default HeaderMain;
