import { Platform, StyleSheet } from "react-native";
import { Colors, heightToDp, widthToDp } from "../../utils";

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    zIndex: 100,
    backgroundColor: Colors.white,
    // marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius:30,
    position: "absolute",
    bottom: 0,
    height: '85%' ,
    width: widthToDp(100),
  },
  bigHeaderContainer: {
    flex: 1,
    zIndex: 0,
    backgroundColor: Colors.white,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius:30,
    position: "absolute",
    bottom: 0,
    height: heightToDp(50),
    width: widthToDp(100),
  },
  headingText: {
    color: Colors.secondary,
    fontSize: 20,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "bold",
  },
  classText: {
    fontSize: 13,
    color: Colors.white,
  },

  formBorderRadiusWhite: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    width: widthToDp(5),
    top: Platform.OS == "ios" ? heightToDp(13) : widthToDp(38),
    height: heightToDp(2),
    backgroundColor: "white",
  },
  formBorderRadius: {
    position: "absolute",
    zIndex: 100,
    left: 0,
    top: Platform.OS == "ios" ? heightToDp(13) : widthToDp(38),
    width: widthToDp(5),
    height: heightToDp(2),
    // borderBottomLeftRadius: 100,
    backgroundColor: Colors.secondary,
  },
});

export default styles;
