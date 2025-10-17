import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Colors } from "../../utils";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
// replaced SearchInput with MyTextInput
import MyTextInput from "../../components/MyTextInput";
import HotJobs from "../../components/HotJobs";
import ListedJobs from "../../components/ListedJobs";

const HomeScreen = ({ navigation }: any) => {
  const handlePostJob = () => {
    navigation.navigate('PostJobScreen');
  };

  return (
    <SafeAreaView edges={['top','bottom','left','right']} style={{flex:1,}}>
      <Header />

      {/* search row */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <MyTextInput
            placeholder="Find cool gigs around you"
            // pass containerStyle if your component expects a different prop name adjust accordingly
            containerStyle={styles.searchInput}
            leftIcon={<Ionicons name="search-outline" size={20} color="#9AA0A6" />}
          />
        </View>

        <TouchableOpacity 
          style={styles.plusButton} 
          activeOpacity={0.7}
          onPress={handlePostJob}
        >
          <Ionicons name="add" size={24} color={Colors.white } />
        </TouchableOpacity>
      </View>

        <HotJobs />
        <ListedJobs />
     
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    // paddingVertical: 12,
   
  },
  inputWrapper: {
    flex: 1,
    marginRight: 12,
  },
  searchInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#e9e9eaff',
    paddingHorizontal: 14,
    borderWidth: 0,
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  container: { flex: 1 },
});
