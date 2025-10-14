import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ImageSourcePropType,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ImagePath from "../assets/images/ImagePath";
import { Colors, heightToDp, widthToDp } from "../utils";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// Define the props for the Header component
interface HeaderProps {
  title: string; // Title to display in the header
  subtitle?: string; // Subtitle to display in the header
  children?: React.ReactNode; // Children to render inside the header
  showBackButton?: boolean; // Whether to show the back button
  showProfilePic?: boolean; // Whether to show the profile picture
  noBackLabel?:boolean
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  children,
  showBackButton,
  showProfilePic,
  noBackLabel
}) => {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={ImagePath.AuthHeader as ImageSourcePropType} // Cast to ImageSourcePropType for type safety
      style={styles.header}
      blurRadius={3}
      imageStyle={{
        width: widthToDp(100),
        height: heightToDp(100),
        position: "absolute",
        top: 0,
        left: 0,
        resizeMode: "cover",
      }}
    >
      <View style={styles.overlay} />
      {showBackButton && (
        <View style={{ position: "absolute", top: 0, left: 0 }}>
          {/* back button */}
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

           {!noBackLabel && <Text style={styles.signInText}>{title}</Text>}
          </TouchableOpacity>
        </View>
      )}

      {showProfilePic ? (
        <View style={[styles.logoContainer, styles.profileContainer]}>
          <Image
            source={{
              uri: "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
            }}
            style={styles.profileImage}
          />
        </View>
      ) : (
        <View style={styles.logoContainer}>
          <Image source={ImagePath.newLogo} style={styles.logo} />
          {/* Header Title */}
        </View>
      )}

      {showProfilePic ? (
        <View style={{}}>
          <Text style={[styles.signInText, { marginBottom: heightToDp(0) }]}>
            {title}
          </Text>
          <Text
            style={[
              styles.signInText,
              {
                fontSize: 14,
                textAlign: "center",
                marginTop: heightToDp(0.4),
                fontWeight: "200",
              },
            ]}
          >
            {subtitle}
          </Text>
        </View>
      ) : (
        <Text style={styles.signInText}>{title}</Text>
      )}

      {/* Border Radius Effects */}
      {/* <View style={styles.formBorderRadiusWhite} /> 
     <View style={styles.formBorderRadius} /> */}

      {/* Children (Form or other content) */}
      {children}
    
    </ImageBackground>
  );
};

// Define styles with TypeScript
const styles = StyleSheet.create({
  header: {
    height: heightToDp(100),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    // borderBottomLeftRadius: 30,
  },
  logoContainer: {
    position: "absolute",
    // left: widthToDp(0),
    top: heightToDp(10),
  },
  logo: {
    width: widthToDp(100),
    height: heightToDp(30),
    resizeMode: "contain",
  },
  signInText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: "bold",
    marginBottom: heightToDp(30),
  },
  formBorderRadiusWhite: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    width: widthToDp(10),
    top: heightToDp(47),
    height: heightToDp(3),
    backgroundColor: "white",
  },
  formBorderRadius: {
    position: "absolute",
    zIndex: 100,
    left: 0,
    top: heightToDp(47),
    width: widthToDp(20),
    height: heightToDp(3),
    // borderBottomLeftRadius: 100,
    backgroundColor: Colors.secondary,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 127, 84, 0.25)",
  },
  backButton: {
    position: "absolute",
    left: widthToDp(10),
    top: heightToDp(10),
  },
  backIcon: {
    width: widthToDp(10),
    height: heightToDp(10),
    resizeMode: "contain",
  },
  profileContainer: {
    width: widthToDp(30),
    height: heightToDp(15),
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: Colors.white,
    position: "absolute",
    // left: widthToDp(0),
    top: heightToDp(17),
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  signInTextContainer: {
    position: "absolute",
    top: heightToDp(10),
    left: widthToDp(10),
  },

});

export default Header;
