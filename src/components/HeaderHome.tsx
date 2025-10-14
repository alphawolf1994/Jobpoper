import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import ImagePath from "../assets/images/ImagePath";
import { Colors, heightToDp, widthToDp } from "../utils";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ModalNavigation from "./ModalNavigation";
import ProfileImageHeader from "./ProfileImageHeader";
import { MainStyles } from "../assets/styles";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface HeaderHomeProps {
  title: string;
  children?: React.ReactNode;
}

const HeaderHome: React.FC<HeaderHomeProps> = ({ title }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { user, selectedRole } = useSelector(
    (state: RootState) => state.auth
  );
  const openModal = () => {
    setModalVisible(true);
  };
  
  // Get user display name and role
  const displayName = user?.fullName || user?.name || user?.userName || 'User';
  const userRole = selectedRole || user?.role || 'User';

  return (
    <ImageBackground
      source={ImagePath.HeaderMainBg as ImageSourcePropType}
      blurRadius={3}
      style={styles.headerContainer}
      imageStyle={{ resizeMode: "cover" }}
    >
        <View style={styles.overlay} />
      <View style={styles.header}>
        <View
          style={{
            marginTop: heightToDp(7),
            marginLeft: widthToDp(5),
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={openModal}>
            <Image
              style={{
                width: widthToDp(7),
                height: heightToDp(4.5),
                resizeMode: "contain",
                marginRight: 15,
              }}
              source={ImagePath.gridIcon}
            />
          </TouchableOpacity>
          <View>
            <Text style={MainStyles.nameText}>
              {displayName
                .split(' ')
                .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')}
            </Text>
            <Text style={MainStyles.classText}>
              {user?.email === 'driver@gmail.com' 
                ? 'Driver' 
                : userRole
                    .split('_')
                    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')
              }
            </Text>
          </View>
        </View>

       { userRole?.toLowerCase() === 'parent' && <ProfileImageHeader
          showNotification={true}
          imageUrl={
            "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
          }
        />}
      </View>

      <ModalNavigation
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      {/* <View style={MainStyles.formBorderRadiusWhite} />
      <View style={MainStyles.formBorderRadius} /> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: heightToDp(100),
    backgroundColor: Colors.secondary,
    // borderBottomLeftRadius: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 127, 84, 0.25)",
  },
});

export default HeaderHome;
