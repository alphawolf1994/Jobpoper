import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHotJobs } from '../redux/slices/jobSlice';
import { AppDispatch, RootState } from '../redux/store';
import { Job } from '../interface/interfaces';

const HotJobs: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const jobState = useSelector((state: RootState) => state.job);
  const { hotJobs = [], loading = false, currentLocation } = jobState || {};
  const { user } = useSelector((state: RootState) => state.auth);

  // Debug log
  console.log('HotJobs state:', { hotJobs, loading, hotJobsLength: hotJobs?.length, jobState });

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
    // Fetch hot jobs when component mounts
    dispatch(getHotJobs({ 
      location: getLocation(),
      page: 1,
      limit: 10,
      sortOrder: 'desc'
    }));
  }, [dispatch, currentLocation, user?.profile?.location]);

  const formatJobTags = (job: Job) => {
    const tags = [];
    
    // Add urgency
    if (job.urgency === 'Urgent') {
      tags.push('Urgent');
    } else {
      tags.push('Normal');
    }
    
    // Add scheduled time
    if (job.scheduledTime) {
      tags.push(job.scheduledTime);
    }
    
    // Add status
    if (job.status) {
      tags.push(job.status);
    }
    
    return tags;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderJobCard = (job: Job) => (
    <TouchableOpacity key={job._id} style={styles.jobCard} activeOpacity={0.8} onPress={()=>{navigation.navigate('JobDetailsScreen', { jobId: job._id })}}>
      {/* Hot/Fire Label */}
      <View style={styles.hotLabel}>
        <Ionicons name="flame" size={16} color={Colors.orange} />
        {/* <Text style={styles.hotLabelText}>HOT</Text> */}
      </View>

      {/* Avatar and Title Row */}
      <View style={styles.avatarTitleRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(job.postedBy?.profile?.fullName || 'U')}
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.posterName}>{job.postedBy?.profile?.fullName || 'Unknown'}</Text>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {formatJobTags(job).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Row - Cost and Location */}
      <View style={styles.bottomRow}>
        <Text style={styles.cost}>{job.cost}</Text>
        <Text style={styles.cost} numberOfLines={1}>
          {job.jobType}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hot Jobs</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Hot Jobs')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Job Cards ScrollView */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading hot jobs...</Text>
        </View>
      ) : (hotJobs && hotJobs.length > 0) ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={300} // Width of card + margin
          snapToAlignment="start"
        >
          {hotJobs.map(renderJobCard)}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hot jobs available in your area</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
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
    paddingRight: 16,
  },
  jobCard: {
    width: 280,
    height: 185,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 15,
    marginRight: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  hotLabel: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  hotLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.orange,
    marginLeft: 4,
  },
  avatarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 2,
    lineHeight: 20,
    width: '90%',
  },
  posterName: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 6,
    marginTop: 10,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  cost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  location: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.85,
    fontWeight: '500',
  },
  loadingContainer: {
    height: 185,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
  },
  emptyContainer: {
    height: 185,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default HotJobs;
