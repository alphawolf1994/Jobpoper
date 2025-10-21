import * as React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Colors, heightToDp, widthToDp } from "../../utils";
import ImagePath from "../../assets/images/ImagePath";
import { height } from "../../utils/responsive";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from '@react-native-async-storage/async-storage';
const data = [
  {
    title: "Find Gigs Around You 🔍",
    subtitle:
      "Discover hundreds of quick jobs nearby! From small errands to skilled tasks — pick what suits you and start earning instantly.",
    image: ImagePath.Image1,
    bgColor: Colors.white,
  },
  {
    title: "Post Jobs in Seconds ⚡",
    subtitle: "Need help? Post your gig in just a few taps! Connect with reliable people ready to get it done fast and efficiently.",
    image: ImagePath.Image2,
    bgColor: Colors.white,
  },
  {
    title: "Work. Earn. Repeat. 💸",
    subtitle:
      "Complete gigs, get paid quickly, and grow your income anytime, anywhere — because with Jobpoper, every task pays.",
    image: ImagePath.Image3,
    bgColor: Colors.white,
  },
];
const width = Dimensions.get("window").width;

function IntroScreen() {
  const navigation = useNavigation();

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <Carousel
        ref={ref}
        width={width}
        height={heightToDp(100)}
        data={data}
        onProgressChange={progress}
        renderItem={({ item, index }) => (
          <>
            <View
              style={{
                flex: 1,
                height: heightToDp(100),
                backgroundColor: item?.bgColor,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: heightToDp(12),
                  paddingHorizontal: 24,
                }}
              >
                <Image
                  style={{
                    width: widthToDp(100),
                    height: heightToDp(45),
                    resizeMode: "cover",
                    // marginTop: 20,
                    // borderBottomLeftRadius:30,
                    // borderBottomRightRadius:30
                    
                  }}
                  source={item?.image}
                />
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 30,
                      fontWeight: "bold",
                      color: Colors.black,
                      marginBottom: 8,
                    }}
                  >
                    {item?.title}
                  </Text>
                  {item?.subtitle ? (
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        marginTop: 10,
                        color: Colors.gray,
                        lineHeight: 20,
                      }}
                    >
                      {item.subtitle}
                    </Text>
                  ) : null}
                </View>
                <View style={{ width: '100%', paddingHorizontal: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                    {data.map((_, dotIndex) => (
                      <TouchableOpacity
                        key={String(dotIndex)}
                        onPress={() => onPressPagination(dotIndex)}
                        style={{
                          width: 12,
                          height: 8,
                          borderRadius: 4,
                          marginHorizontal: 4,
                          backgroundColor:
                            (ref?.current?.getCurrentIndex && ref.current.getCurrentIndex() === dotIndex)
                              ? Colors.primary
                              : Colors.lightGray,
                        }}
                      />
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        (navigation as any).navigate('Login');
                      }}
                      style={{ paddingVertical: 14, paddingHorizontal: 16 }}
                    >
                      <Text style={{ color: Colors.SlateGray, fontSize: 16 }}>Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (index === data.length - 1) {
                          (navigation as any).navigate('Login');
                        } else {
                          ref.current?.next();
                        }
                      }}
                      style={{
                        backgroundColor: Colors.primary,
                        paddingVertical: 14,
                        paddingHorizontal: 28,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '600' }}>
                        {index === data.length - 1 ? 'Explore' : 'Next'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
}

export default IntroScreen;
