import React, { useEffect, useCallback } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import MyTextInput from '../../components/MyTextInput';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHotJobsPaginated } from '../../redux/slices/jobSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Job } from '../../interface/interfaces';
import { IMAGE_BASE_URL } from '@/src/api/baseURL';

const HotJobsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const jobState = useSelector((state: RootState) => state.job);
  const { allHotJobs = [], loading = false, loadingMore = false, allHotJobsPagination, currentLocation } = jobState || {};
  const { user } = useSelector((state: RootState) => state.auth);

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

  // Initial load
  useEffect(() => {
    dispatch(getAllHotJobsPaginated({ 
      location: getLocation(),
      page: 1,
      limit: 10,
      sortOrder: 'desc',
      append: false
    }));
  }, [dispatch, getLocation]);

  // Load more jobs when reaching end
  const loadMoreJobs = useCallback(() => {
    if (loadingMore || !allHotJobsPagination?.hasNextPage || loading) {
      return;
    }
    
    const nextPage = (allHotJobsPagination?.currentPage || 0) + 1;
    dispatch(getAllHotJobsPaginated({ 
      location: getLocation(),
      page: nextPage,
      limit: 10,
      sortOrder: 'desc',
      append: true
    }));
  }, [dispatch, getLocation, loadingMore, loading, allHotJobsPagination]);

  // Refresh jobs
  const onRefresh = useCallback(() => {
    dispatch(getAllHotJobsPaginated({ 
      location: getLocation(),
      page: 1,
      limit: 10,
      sortOrder: 'desc',
      append: false
    }));
  }, [dispatch, getLocation]);

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

  const renderJobCard = ({ item: job }: { item: Job }) => (
    <TouchableOpacity 
      style={styles.jobCard} 
      activeOpacity={0.8} 
      onPress={() => navigation.navigate('JobDetailsScreen', { jobId: job._id })}
    >
      {/* Hot/Fire Label */}
      <View style={styles.hotLabel}>
        <Ionicons name="flame" size={16} color={Colors.orange} />
      </View>

      {/* Avatar and Title Row */}
      <View style={styles.avatarTitleRow}>
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

      {/* Bottom Row - Cost and Job Type */}
      <View style={styles.bottomRow}>
        <Text style={styles.cost}>{job.cost}</Text>
        <Text style={styles.cost} numberOfLines={1}>
          {job.jobType}
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
        <Ionicons name="flame-outline" size={64} color={Colors.gray} />
        <Text style={styles.emptyText}>No hot jobs available in your area</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top','bottom','left','right']} style={styles.container}>
      <Header />

      {/* search row */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <MyTextInput
            placeholder="Search a job"
            containerStyle={styles.searchInput}
            leftIcon={<Ionicons name="search-outline" size={20} color="#9AA0A6" />}
          />
        </View>
      </View>

      {loading && allHotJobs.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading hot jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={allHotJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && allHotJobs.length > 0 && !loadingMore}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  separator: {
    height: 20,
  },
  jobCard: {
    width: '100%',
    minHeight: 185,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 15,
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
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
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

export default HotJobsScreen;
