import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getListedJobs, searchListedJobsPaginated } from '../redux/slices/jobSlice';
import { AppDispatch, RootState } from '../redux/store';
import { Job } from '../interface/interfaces';
import { IMAGE_BASE_URL } from '../api/baseURL';

interface ListedJobsProps {
  searchQuery?: string;
}

const ListedJobs: React.FC<ListedJobsProps> = ({ searchQuery = '' }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const jobState = useSelector((state: RootState) => state.job);
  const { listedJobs = [], loading = false, currentLocation, allListedJobs = [] } = jobState || {};
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Use allListedJobs if searching, otherwise use listedJobs
  const displayJobs = searchQuery.trim() ? allListedJobs : listedJobs;

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

  useEffect(() => {
    const location = getLocation();
    
    if (searchQuery && searchQuery.trim()) {
      // Use search API when search query exists
      dispatch(searchListedJobsPaginated({ 
        location,
        search: searchQuery.trim(),
        page: 1,
        limit: 10,
        sortOrder: 'desc',
        append: false
      }));
    } else {
      // Use default API when no search query
      dispatch(getListedJobs({ 
        location,
        page: 1,
        limit: 10,
        sortOrder: 'desc'
      }));
    }
  }, [dispatch, currentLocation, user?.profile?.location, searchQuery]);

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

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity style={styles.jobCard} activeOpacity={0.7} onPress={()=>{navigation.navigate('JobDetailsScreen', { jobId: item._id })}}>
      {/* Left Side - Avatar and Job Info */}
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          {item.postedBy?.profile?.profileImage ? (
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${item.postedBy.profile.profileImage.startsWith('/') ? item.postedBy.profile.profileImage : `/${item.postedBy.profile.profileImage}`}` }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>
              {getInitials(item.postedBy?.profile?.fullName || 'U')}
            </Text>
          )}
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.posterName}>{item.postedBy?.profile?.fullName || 'Unknown'}</Text>
        </View>
      </View>

      {/* Right Side - Cost and Location */}
      <View style={styles.rightSection}>
        <View style={styles.rightTopGroup}>
          <Text style={styles.cost}>{item.cost}</Text>
          <Text style={styles.location}>
            {item.jobType}
          </Text>
        </View>
        <Text style={styles.dateTime}>
          {formatDate(item.scheduledDate)} • {item.scheduledTime}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Listed Jobs</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllListedJobsScreen')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Job Cards List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading listed jobs...</Text>
        </View>
      ) : (displayJobs && displayJobs.length > 0) ? (
        <FlatList
          data={displayJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery.trim() 
              ? `No listed jobs found for "${searchQuery}"` 
              : 'No listed jobs available in your area'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.gray,
  },
  scrollContent: {
    paddingBottom: 400, // Add bottom padding to prevent content from being hidden behind bottom tabs
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
    overflow: 'hidden',
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
    height: 48, // match avatar height so vertical centering context is consistent
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
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default ListedJobs;
