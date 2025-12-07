import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllListedJobsPaginated, searchListedJobsPaginated } from '../../redux/slices/jobSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Job } from '../../interface/interfaces';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import MyTextInput from '../../components/MyTextInput';
import { IMAGE_BASE_URL } from '@/src/api/baseURL';

const AllListedJobsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const jobState = useSelector((state: RootState) => state.job);
  const { allListedJobs = [], loading = false, loadingMore = false, allListedJobsPagination, currentLocation } = jobState || {};
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMountRef = useRef(true);

  // Get location from Redux state, user profile, or use default
  const getLocation = useCallback(() => {
    if (currentLocation) {
      return currentLocation;
    }
    if (user?.profile?.location) {
      return user.profile.location;
    }
    return "New York, NY, USA";
  }, [currentLocation, user?.profile?.location]);

  // Load jobs (default or search)
  const loadJobs = useCallback((page: number = 1, append: boolean = false, searchTerm?: string) => {
    const location = getLocation();
    
    if (searchTerm && searchTerm.trim()) {
      // Use search API
      dispatch(searchListedJobsPaginated({ 
        location,
        search: searchTerm.trim(),
        page,
        limit: 10,
        sortOrder: 'desc',
        append
      }));
    } else {
      // Use default API
      dispatch(getAllListedJobsPaginated({ 
        location,
        page,
        limit: 10,
        sortOrder: 'desc',
        append
      }));
    }
  }, [dispatch, getLocation]);

  // Initial load (only on mount)
  useEffect(() => {
    loadJobs(1, false, '');
    isInitialMountRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search effect
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
      loadJobs(1, false, searchQuery);
    }, 500); // 500ms debounce

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, loadJobs]);

  // Load more jobs when reaching end
  const loadMoreJobs = useCallback(() => {
    if (loadingMore || !allListedJobsPagination?.hasNextPage || loading) {
      return;
    }
    
    const nextPage = (allListedJobsPagination?.currentPage || 0) + 1;
    loadJobs(nextPage, true, searchQuery);
  }, [loadJobs, loadingMore, loading, allListedJobsPagination, searchQuery]);

  // Refresh jobs
  const onRefresh = useCallback(() => {
    loadJobs(1, false, searchQuery);
  }, [loadJobs, searchQuery]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    loadJobs(1, false, '');
  }, [loadJobs]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const renderJobCard = ({ item: job }: { item: Job }) => (
    <TouchableOpacity 
      style={styles.jobCard} 
      activeOpacity={0.7} 
      onPress={() => navigation.navigate('JobDetailsScreen', { jobId: job._id })}
    >
      {/* Left Side - Avatar and Job Info */}
      <View style={styles.leftSection}>
      <View style={styles.avatar}>
          {job.postedBy?.profile?.profileImage ? (
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${job.postedBy.profile.profileImage.startsWith('/') ? job.postedBy.profile.profileImage : `/${job.postedBy.profile.profileImage}`}` }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>
              {getInitials(job.postedBy?.profile?.fullName || 'U')}
            </Text>
          )}
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.posterName}>{job.postedBy?.profile?.fullName || 'Unknown'}</Text>
        </View>
      </View>

      {/* Right Side - Cost and Location */}
      <View style={styles.rightSection}>
        <View style={styles.rightTopGroup}>
          <Text style={styles.cost}>{job.cost}</Text>
          <Text style={styles.location}>
            {job.jobType}
          </Text>
        </View>
        <Text style={styles.dateTime}>
          {formatDate(job.scheduledDate)} • {job.scheduledTime}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingMoreText}>Loading more jobs...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="briefcase-outline" size={64} color={Colors.gray} />
        <Text style={styles.emptyText}>
          {searchQuery.trim() 
            ? `No jobs found for "${searchQuery}"` 
            : 'No listed jobs available in your area'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.container}>
      {/* <Header /> */}
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Listed Jobs</Text>
        <View style={styles.backButton} />
      </View>

      {/* search row */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <MyTextInput
            placeholder="Search a job"
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
      </View>

      {loading && allListedJobs.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading listed jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={allListedJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && allListedJobs.length > 0 && !loadingMore}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          onEndReached={loadMoreJobs}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  searchInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#e9e9eaff',
    paddingHorizontal: 14,
    borderWidth: 0,
  },
  clearButton: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    marginTop: 6,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 12,
  },
  jobCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: Colors.lightGray,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  posterName: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48,
  },
  rightTopGroup: {
    alignItems: 'flex-end',
  },
  cost: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
  dateTime: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default AllListedJobsScreen;

