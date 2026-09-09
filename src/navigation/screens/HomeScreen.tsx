import React, { useEffect, useCallback, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler, Alert, RefreshControl } from "react-native";
import { Colors } from "../../utils";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
// replaced SearchInput with MyTextInput
import MyTextInput from "../../components/MyTextInput";
import HotJobs from "../../components/HotJobs";
import ListedJobs from "../../components/ListedJobs";
import { useDispatch, useSelector } from 'react-redux';
import { getHotJobs, getListedJobs, expireOldJobs, clearError } from '../../redux/slices/jobSlice';
import { getCurrentUser } from "../../redux/slices/authSlice";
import { AppDispatch, RootState } from '../../redux/store';
import {
  fetchVerificationStatus,
} from "../../redux/slices/verificationSlice";
import VerificationBottomSheet, { VerificationBottomSheetHandle } from "../../components/VerificationBottomSheet";
import { useRequirePhoneVerified } from "../../hooks/useRequirePhoneVerified";

import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentLocation, currentLocationCoordinates, error: jobError } = useSelector((state: RootState) => state.job);
  const { status: verificationStatus, promptDismissed } = useSelector(
    (state: RootState) => state.verification
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMountRef = useRef(true);
  const lastHomeFetchAtRef = useRef(0);
  const prevCoordsKeyRef = useRef<string | null>(null);
  const verificationSheetRef = useRef<VerificationBottomSheetHandle>(null);
  const [isVerificationSheetVisible, setIsVerificationSheetVisible] = useState(false);
  const { ensurePhoneVerified, phoneSheet } = useRequirePhoneVerified();

  const handlePostJob = () => {
    if (!ensurePhoneVerified('post_job', handlePostJob)) return;
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

  const loadHomeJobs = useCallback((force = false) => {
    const now = Date.now();
    if (!force && lastHomeFetchAtRef.current && now - lastHomeFetchAtRef.current < 15000) {
      return;
    }
    lastHomeFetchAtRef.current = now;
    const location = getLocation();
    dispatch(getHotJobs({
      location,
      page: 1,
      limit: 10,
      sortOrder: 'desc'
    }));
    dispatch(getListedJobs({
      location,
      page: 1,
      limit: 10,
      sortOrder: 'desc'
    }));
  }, [dispatch, currentLocation, user?.profile?.location]);

  // Expire stale jobs in the background — never block Home loaders on this.
  useEffect(() => {
    dispatch(expireOldJobs());
    isInitialMountRef.current = false;
  }, [dispatch]);

  // When GPS/manual location coordinates actually change, refresh lists
  // in the background without a full-screen spinner.
  useEffect(() => {
    const key = currentLocationCoordinates
      ? `${currentLocationCoordinates.latitude.toFixed(4)},${currentLocationCoordinates.longitude.toFixed(4)}`
      : null;
    if (!key || key === prevCoordsKeyRef.current) return;
    const isFirst = prevCoordsKeyRef.current == null;
    prevCoordsKeyRef.current = key;
    if (!isFirst) {
      loadHomeJobs(true);
    }
  }, [currentLocationCoordinates, loadHomeJobs]);

  // Debounced search effect - triggers when searchQuery changes
  useEffect(() => {
    // Skip on initial mount (focus effect already loads default jobs)
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

  // Pull-to-refresh: reload hot jobs and listed jobs
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(expireOldJobs());
    const location = getLocation();
    Promise.all([
      dispatch(getHotJobs({
        location,
        page: 1,
        limit: 10,
        sortOrder: 'desc'
      })),
      dispatch(getListedJobs({
        location,
        page: 1,
        limit: 10,
        sortOrder: 'desc'
      })),
    ]).finally(() => {
      lastHomeFetchAtRef.current = Date.now();
      setRefreshing(false);
    });
  }, [dispatch, currentLocation, user?.profile?.location]);

  // Refresh lists when Home is focused, but skip if we just fetched.
  useFocusEffect(
    useCallback(() => {
      loadHomeJobs(false);
    }, [loadHomeJobs])
  );

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

  const shouldShowVerificationPrompt =
    user?.isVerified === false &&
    verificationStatus === "not_submitted" &&
    !promptDismissed;

  useEffect(() => {
    console.log("HomeScreen user isVerified =>", user?.isVerified);
  }, [user?.isVerified]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        dispatch(getCurrentUser());
        dispatch(fetchVerificationStatus());
      }

      if (!shouldShowVerificationPrompt || isVerificationSheetVisible) {
        return;
      }

      const timer = setTimeout(() => {
        setIsVerificationSheetVisible(true);
        verificationSheetRef.current?.open();
      }, 350);

      return () => clearTimeout(timer);
    }, [dispatch, user?.id, shouldShowVerificationPrompt, isVerificationSheetVisible])
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

      {jobError ? (
        <TouchableOpacity
          style={styles.errorBanner}
          onPress={() => dispatch(clearError())}
          activeOpacity={0.9}
        >
          <Ionicons name="warning-outline" size={18} color={Colors.white} />
          <Text style={styles.errorBannerText} numberOfLines={2}>{jobError}</Text>
          <Ionicons name="close" size={18} color={Colors.white} />
        </TouchableOpacity>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <HotJobs searchQuery={debouncedSearchQuery} />
        <ListedJobs searchQuery={debouncedSearchQuery} scrollEnabled={false} />
      </ScrollView>

      {phoneSheet}
      <VerificationBottomSheet
        ref={verificationSheetRef}
        dismissOnClose={true}
        onDismiss={() => setIsVerificationSheetVisible(false)}
      />

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
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C62828',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.white,
  },
});
