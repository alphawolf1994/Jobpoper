import * as React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Colors, heightToDp, widthToDp } from "../../utils";
import ImagePath from "../../assets/images/ImagePath";
import { height } from "../../utils/responsive";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
const data = [
  {
    title: "Search your job",
    subtitle:
      "Figure out your top five priorities whether it is company culture, salary.",
    image: ImagePath.Image1,
    bgColor: Colors.white,
  },
  {
    title: "Apply to best jobs",
    subtitle: "You can apply to your desirable jobs very quickly and easily with ease.",
    image: ImagePath.Image2,
    bgColor: Colors.white,
  },
  {
    title: "Make your career",
    subtitle:
      "We help you find your dream job based on your skills, location, demand.",
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
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
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
                  paddingVertical: 40,
                  paddingHorizontal: 24,
                }}
              >
                <Image
                  style={{
                    width: widthToDp(80),
                    height: heightToDp(35),
                    resizeMode: "contain",
                    marginTop: 20,
                    
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
                        fontSize: 14,
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
    </View>
  );
}

export default IntroScreen;
