import { Dimensions, StyleSheet, View, Image, FlatList, TouchableOpacity, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { useRef, useState } from 'react';
import ImagePath from '../../assets/images/ImagePath';

// Static Hostel Images
const staticHostelImages = [
  ImagePath.hostel1,
  ImagePath.hostel2,
  ImagePath.hostel3,
  ImagePath.hostel4,
  ImagePath.hostel5,
];
const staticSchoolImages = [
  ImagePath.school1,
  ImagePath.school2,
 
];
// Constants
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9); // Adjust to fit design
interface ImageSliderProps {
    school?: any;
    isHostel?: boolean;
    schoolProfile?:boolean
  }
 function ImageSlider({ school,isHostel,schoolProfile }: ImageSliderProps) {
  let sliderImages = [];

if (isHostel) {
  sliderImages = staticHostelImages;
} else if (schoolProfile) {
  sliderImages = staticSchoolImages;
} else {
  sliderImages = school?.images || [];
}
if (sliderImages.length === 0) return null;
// console.log(school.images)
  const [index, setIndex] = useState(0);
  const isCarousel = useRef<Carousel<any>>(null);

  return (
    <View style={styles.container}>
      {/* Main Image Carousel */}
      <Carousel
        ref={isCarousel}
        data={sliderImages}
        renderItem={({ item }: { item: string }) => (
            // <Text>{item}</Text>
            <Image
            source={
              isHostel || schoolProfile
                ? item // item is a local static image (require(...))
                : { uri: item } // item is a remote URL
            }
            style={styles.mainImage}
          />
          )}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={setIndex}
        autoplay
        autoplayInterval={3000}
        loop
        vertical={false}
      />

      {/* Pagination (Dots) */}
    

      {/* Thumbnail List */}
      <FlatList
        data={sliderImages}
        horizontal
        nestedScrollEnabled={true} 
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        style={styles.thumbnailList}
        renderItem={({ item, index: thumbIndex }) => (
          <TouchableOpacity onPress={() => isCarousel.current?.snapToItem(thumbIndex)}>
            <Image
             source={isHostel || schoolProfile ? item : { uri: item }}
              style={[styles.thumbnail]}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 10,
  },
  mainImage: {
    width: ITEM_WIDTH,
    height: 350,
    borderRadius: 10,
    resizeMode:'cover'
  },

  thumbnailList: {
    marginTop: 10,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginHorizontal: 5,
    
  },
 
  firstblock: {
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default ImageSlider;
