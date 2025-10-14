import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors, heightToDp, widthToDp } from "../../utils";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
 
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("IntroScreen");
    }, 2000);
  
  }, []); // Empty dependency array - only run once on mount



 


  return (
     <LinearGradient
        colors={["#7DB2FF", "#2D63F5"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.header}
     >
        <View style={styles.logoContainer}>
          <Image source={ImagePath.newLogo} style={styles.logo} />
          <Text style={styles.brandText}>JobPoper</Text>
        </View>
     </LinearGradient>
  );
};
// Define styles with TypeScript
const styles = StyleSheet.create({
  header: {
    height: heightToDp(100),
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: '#1E3A8A', // replaced with gradient
    // borderBottomLeftRadius: 30,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: widthToDp(24),
    height: heightToDp(12),
    resizeMode: "contain",
    tintColor: Colors.white,
  },
  brandText: {
    marginTop: heightToDp(2),
    color: Colors.white,
    fontSize: 28,
    fontWeight: "700",
  },
  signInText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: "bold",
    marginBottom: heightToDp(20),
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
export default SplashScreen;
