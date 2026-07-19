import * as React from "react";
import { Image, Platform, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Colors, heightToDp } from "../../utils";
import ImagePath from "../../assets/images/ImagePath";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
      "Complete gigs, get paid quickly, and grow your income anytime, anywhere — because with MakeMy Task, every task pays.",
    image: ImagePath.Image3,
    bgColor: Colors.white,
  },
];

function IntroScreen() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const carouselHeight = Math.max(1, height - insets.top - insets.bottom);

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
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Carousel
        ref={ref}
        width={width}
        height={carouselHeight}
        data={data}
        onProgressChange={progress}
        renderItem={({ item, index }) => (
          <>
            <View
              style={{
                flex: 1,
                height: carouselHeight,
                backgroundColor: item?.bgColor,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: Platform.OS === 'android' ? 28 : heightToDp(12),
                  paddingHorizontal: 24,
                }}
              >
                <Image
                  style={{
                    width,
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
                <View style={{ width: '100%', paddingHorizontal: 8 }}>
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
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => {
                        (navigation as any).navigate('LoginScreen');
                      }}
                      style={{
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        minWidth: 72,
                        alignItems: 'flex-start',
                        flexShrink: 0,
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        style={{ color: Colors.SlateGray, fontSize: 16, includeFontPadding: false }}
                      >
                        Skip
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (index === data.length - 1) {
                          (navigation as any).navigate('LoginScreen');
                        } else {
                          ref.current?.next();
                        }
                      }}
                      style={{
                        backgroundColor: Colors.primary,
                        paddingVertical: 14,
                        paddingHorizontal: 28,
                        borderRadius: 12,
                        minWidth: 110,
                        alignItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        style={{ color: Colors.white, fontSize: 16, fontWeight: '600', includeFontPadding: false }}
                      >
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
    </View>
  );
}

export default IntroScreen;
