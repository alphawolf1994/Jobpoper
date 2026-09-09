import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
  useWindowDimensions,
  ViewToken,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../utils";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface GuideSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  steps: string[];
}

const guides: GuideSlide[] = [
  {
    id: "1",
    icon: "add-circle",
    iconColor: Colors.primary,
    iconBg: Colors.BlueLightShade,
    title: "How to Post a Task",
    description:
      "Need something done? Post a task in just a few taps and get help from nearby workers.",
    steps: [
      'Tap the "+" button on the Home screen.',
      "Choose a category for your task (e.g. Cleaning, Moving, Delivery).",
      "Fill in the details description, location, date & time, and budget.",
      'Tap "Post Task" and wait for workers to accept!',
    ],
  },
  {
    id: "2",
    icon: "bicycle",
    iconColor: "#059669",
    iconBg: Colors.lightMintGreen,
    title: "Register as a Professional",
    description:
      "Do you have a bike or vehicle? Register as a transport or delivery professional and start earning.",
    steps: [
      "Go to your Profile screen.",
      'Tap "Pickup Service Preference".',
      "Select your vehicle type (Bike, Car, Van, etc.).",
      "Complete identity verification to get approved.",
      "Once verified, you can accept delivery and transport tasks!",
    ],
  },
  {
    id: "3",
    icon: "business",
    iconColor: "#B45309",
    iconBg: "#FFF7ED",
    title: "Register Your Business",
    description:
      "Own a business? Register it on the app to reach more customers and manage orders.",
    steps: [
      "Go to your Profile screen.",
      'Tap "Are you a business?".',
      "Fill in your business name, type, and address.",
      "Upload any required documents.",
      "Once approved, your business will be visible to nearby users!",
    ],
  },
  {
    id: "4",
    icon: "compass",
    iconColor: "#7C3AED",
    iconBg: "#F3E8FF",
    title: "Explore More Features",
    description:
      "There's a lot you can do on the app. Here are some features you might not know about.",
    steps: [
      "Referral Program Invite friends and earn rewards from your Profile.",
      "Manage Locations Save your frequent addresses for quicker posting.",
      "Notifications Stay updated on task status, offers, and messages.",
      "My Reports View reports of your activity and tasks.",
      "Security PIN Set up a PIN for extra account security.",
    ],
  },
];

const HelpGuidesScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navBottomPad =
    Math.max(insets.bottom, Platform.OS === "android" ? 16 : 0) + 12;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goToSlide = (index: number) => {
    if (index >= 0 && index < guides.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const renderGuide = ({ item }: { item: GuideSlide }) => (
    <View style={[styles.slideContainer, { width }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={styles.slideContent}
      >
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={48} color={item.iconColor} />
          </View>

          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>

          <View style={styles.stepsContainer}>
            {item.steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <Header />

      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Help & Guides</Text>
            <Text style={styles.headerSubtitle}>
              Learn how to use the app
            </Text>
          </View>
        </View>
      </View>

      {/* Dot Indicators */}
      <View style={styles.dotsRow}>
        {guides.map((_, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => goToSlide(idx)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.dot,
                currentIndex === idx ? styles.dotActive : styles.dotInactive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.list}
        data={guides}
        renderItem={renderGuide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={[styles.navRow, { paddingBottom: navBottomPad }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={() => goToSlide(currentIndex - 1)}
          disabled={currentIndex === 0}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={currentIndex === 0 ? Colors.darkGray : Colors.white}
          />
          <Text
            style={[
              styles.navButtonText,
              currentIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <Text style={styles.pageIndicator}>
          {currentIndex + 1} / {guides.length}
        </Text>

        {currentIndex < guides.length - 1 ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => goToSlide(currentIndex + 1)}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: Colors.green }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>Done</Text>
            <Ionicons name="checkmark" size={20} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  headerSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  list: {
    flex: 1,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
    borderRadius: 5,
  },
  dotInactive: {
    backgroundColor: Colors.darkGray,
  },
  slideContainer: {
    flex: 1,
  },
  slideContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.black,
    textAlign: "center",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  stepsContainer: {
    gap: 12,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 1,
  },
  stepBadgeText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  navButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  navButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: Colors.darkGray,
  },
  pageIndicator: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: "600",
  },
});

export default HelpGuidesScreen;
