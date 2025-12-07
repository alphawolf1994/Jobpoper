import React, { useEffect, useCallback, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler, Alert } from "react-native";
import { Colors } from "../../utils";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
// replaced SearchInput with MyTextInput
import MyTextInput from "../../components/MyTextInput";
import HotJobs from "../../components/HotJobs";
import ListedJobs from "../../components/ListedJobs";
import { useDispatch, useSelector } from 'react-redux';
import { getHotJobs, getListedJobs, expireOldJobs } from '../../redux/slices/jobSlice';
import { AppDispatch, RootState } from '../../redux/store';

import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentLocation } = useSelector((state: RootState) => state.job);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMountRef = useRef(true);

  const handlePostJob = () => {
    navigation.navigate('PostJobScreen');
  };

  // Get location from Redux state, user profile, or use default
  const getLocation = () => {
    if (currentLocation) {
      return currentLocation;
    }
    if (user?.profile?.location) {
      return user.profile.location;
    }
    return "New York, NY, USA";
  };

  // Refresh hot jobs and listed jobs when location changes (initial load)
  useEffect(() => {
    dispatch(expireOldJobs());
    dispatch(getHotJobs({
      location: getLocation(),
      page: 1,
      limit: 10,
      sortOrder: 'desc'
    }));

    dispatch(getListedJobs({
      location: getLocation(),
      page: 1,
      limit: 10,
      sortOrder: 'desc'
    }));
    isInitialMountRef.current = false;
  }, [dispatch, currentLocation, user?.profile?.location]);

  // Debounced search effect - triggers when searchQuery changes
  useEffect(() => {
    // Skip on initial mount (we already loaded default jobs)
    if (isInitialMountRef.current) {
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  }, []);

  // Handle Android back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove();
    }, [])
  );

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={{ flex: 1, }}>
      <Header />

      {/* search row */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <MyTextInput
            placeholder="Find cool gigs around you"
            containerStyle={styles.searchInput}
            value={searchQuery}
            onChange={setSearchQuery}
            leftIcon={<Ionicons name="search-outline" size={20} color="#9AA0A6" />}
          />
        </View>
        {searchQuery.trim().length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearSearch}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={30} color="#9AA0A6" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.plusButton}
          activeOpacity={0.7}
          onPress={handlePostJob}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <HotJobs searchQuery={debouncedSearchQuery} />
      <ListedJobs searchQuery={debouncedSearchQuery} />

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
    marginRight: 8,
  },
  clearButton: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4,
    marginTop: 6,
  },
  searchInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#e9e9eaff',
    paddingHorizontal: 14,
    borderWidth: 0,
  },
  plusButton: {
    width: 48,
    height: 48,
    marginTop: 10,
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
