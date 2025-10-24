import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors, heightToDp, widthToDp } from "../../utils";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      // Wait for splash screen to show for at least 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if token exists
      if (accessToken) {
        try {
          // Call getCurrentUser API to verify token and get user data
          const result = await dispatch(getCurrentUser()).unwrap();
          
          if (result.status === 'success' && result.data?.user) {
            const userData = result.data.user;
            
            // Check if profile is complete
            if (userData.profile?.isProfileComplete) {
              // Profile is complete, navigate to HomeTabs
              (navigation as any).navigate('HomeTabs');
            } else {
              // Profile is incomplete, navigate to BasicProfileScreen
              (navigation as any).navigate('BasicProfileScreen');
            }
          } else {
            // API call failed, navigate to IntroScreen
            (navigation as any).navigate('IntroScreen');
          }
        } catch (error) {
          // Token is invalid or expired, navigate to IntroScreen
          console.log('Auth check failed:', error);
          (navigation as any).navigate('IntroScreen');
        }
      } else {
        // No token, navigate to IntroScreen
        (navigation as any).navigate('IntroScreen');
      }
    };

    checkAuthAndNavigate();
  }, [accessToken, dispatch, navigation]);



 


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
    marginTop: heightToDp(0),
    color: Colors.white,
    fontSize: 50,
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
