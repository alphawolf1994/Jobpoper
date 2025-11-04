import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  FlatList,
  Dimensions
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getJobById } from '../../redux/slices/jobSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Job, SavedLocationData, InterestedUserEntry } from '../../interface/interfaces';
import { Image } from 'expo-image';
import { IMAGE_BASE_URL } from '../../api/baseURL';
import { showInterestOnJobApi } from '../../api/jobApis';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const JobDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'about' | 'interests'>('summary');
  const navigation = useNavigation<any>();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { currentJob, loading, error } = useSelector((state: RootState) => state.job);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Get jobId from route params
  const jobId = (route.params as any)?.jobId;

  useEffect(() => {
    if (jobId) {
      dispatch(getJobById(jobId));
    }
  }, [dispatch, jobId]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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

  const getLocationDisplay = (job: Job): string => {
    if (!job.location) return 'Location not specified';
    
    if (job.jobType === 'Pickup') {
      const pickupLocation = job.location as { source: SavedLocationData; destination: SavedLocationData };
      if (pickupLocation.source && pickupLocation.destination) {
        return `${pickupLocation.source.fullAddress} → ${pickupLocation.destination.fullAddress}`;
      }
    } else {
      const onSiteLocation = job.location as SavedLocationData;
      if (onSiteLocation.fullAddress) {
        return onSiteLocation.fullAddress;
      }
    }
    
    return job.displayAddress || 'Location not specified';
  };

  const handleContact = () => {
    if (!currentJob) return;
    
    const contactInfo = currentJob.contactInfo || currentJob.postedBy?.phoneNumber;
    
    if (contactInfo) {
      Alert.alert(
        'Contact Job Poster', 
        `Would you like to contact ${currentJob.postedBy?.profile?.fullName || 'the job poster'}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Contact', 
            onPress: () => {
              // TODO: Implement actual contact functionality (call, message, etc.)
              Alert.alert('Contact', `Phone: ${contactInfo}`);
            }
          },
        ]
      );
    } else {
      Alert.alert('Contact', 'Contact information not available');
    }
  };

  const handleShowInterest = () => {
    if (!currentJob) return;

    Alert.alert(
      'Show Interest',
      `Show interest in "${currentJob.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Show Interest',
          onPress: async () => {
            try {
              const res = await showInterestOnJobApi(currentJob._id);
              Alert.alert('Success', res?.message || 'Interest recorded successfully');
              // Refresh details to reflect any changes (e.g., interestedUsers)
              if ((route.params as any)?.jobId) {
                dispatch(getJobById((route.params as any).jobId));
              }
            } catch (e: any) {
              Alert.alert('Error', e?.message || 'Failed to record interest');
            }
          },
        },
      ]
    );
  };

  const handleBookmark = () => {
    Alert.alert('Bookmark', 'Job bookmarked successfully!');
  };

  const renderLocationSection = () => {
    if (!currentJob || !currentJob.location) return null;

    if (currentJob.jobType === 'Pickup') {
      const pickupLocation = currentJob.location as { source: SavedLocationData; destination: SavedLocationData };
      return (
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Pickup Location</Text>
                <Text style={styles.locationText}>{pickupLocation.source?.fullAddress}</Text>
                {pickupLocation.source?.addressDetails && (
                  <Text style={styles.locationDetails}>{pickupLocation.source.addressDetails}</Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationText}>{pickupLocation.destination?.fullAddress}</Text>
                {pickupLocation.destination?.addressDetails && (
                  <Text style={styles.locationDetails}>{pickupLocation.destination.addressDetails}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      const onSiteLocation = currentJob.location as SavedLocationData;
      return (
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>{onSiteLocation.fullAddress}</Text>
                {onSiteLocation.addressDetails && (
                  <Text style={styles.locationDetails}>{onSiteLocation.addressDetails}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    }
  };

  const renderAttachments = () => {
    if (!currentJob || !currentJob.attachments || currentJob.attachments.length === 0) {
      return null;
    }

    return (
      <View style={styles.attachmentsSection}>
        <Text style={styles.sectionTitle}>Attachments ({currentJob.attachments.length})</Text>
        <FlatList
          data={currentJob.attachments}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.attachmentCard}>
              <Image
                source={{ uri: `${IMAGE_BASE_URL}${item.startsWith("/") ? item : `/${item}`}` }}
                style={styles.attachmentImage}
                contentFit="cover"
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>
    );
  };

  const renderSummaryTab = () => {
    if (!currentJob) return null;

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{currentJob.description}</Text>
        </View>

        {renderLocationSection()}

        {renderAttachments()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>
              {currentJob.formattedScheduledDate || new Date(currentJob.scheduledDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{currentJob.scheduledTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{currentJob.cost}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderAboutTab = () => {
    if (!currentJob) return null;

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <View style={styles.aboutSection}>
          <View style={styles.posterHeader}>
            <View style={styles.aboutPosterAvatar}>
              <Text style={styles.posterAvatarText}>
                {getInitials(currentJob.postedBy?.profile?.fullName || 'U')}
              </Text>
            </View>
            <View style={styles.posterInfo}>
              <Text style={styles.posterName}>{currentJob.postedBy?.profile?.fullName || 'Unknown'}</Text>
              <Text style={styles.posterTitle}>Job Poster</Text>
            </View>
          </View>

          <View style={styles.posterStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Email</Text>
              <Text style={styles.statValue}>{currentJob.postedBy?.profile?.email || 'N/A'}</Text>
            </View>
            {currentJob.postedBy?.profile?.location && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Location</Text>
                <Text style={styles.statValue}>{currentJob.postedBy.profile.location}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !currentJob) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.gray} />
          <Text style={styles.errorText}>{error || 'Job not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const jobTags = formatJobTags(currentJob);
  const locationDisplay = getLocationDisplay(currentJob);
  const isDirectContact = currentJob.responsePreference === 'direct_contact' || !currentJob.responsePreference;
  const isMyJob = !!user && currentJob.postedBy?._id === user.id;
  const interestedUsers: InterestedUserEntry[] = currentJob.interestedUsers || [];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header Section with Blue Background */}
      <View style={styles.headerSection}>
        {/* Navigation and Bookmark */}
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <AntDesign name="arrow-left" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmark}>
            <Ionicons name="flame" size={20} color={Colors.orange} />
          </TouchableOpacity>
        </View>

        {/* Poster Avatar */}
        <View style={styles.logoContainer}>
          <View style={styles.posterAvatar}>
            <Text style={styles.logoText}>
              {getInitials(currentJob.postedBy?.profile?.fullName || 'U')}
            </Text>
          </View>
        </View>

        {/* Job Info */}
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{currentJob.title}</Text>
          <Text style={styles.companyName}>Posted by {currentJob.postedBy?.profile?.fullName || 'Unknown'}</Text>
          
          <View style={styles.salaryLocationRow}>
            <Text style={styles.salary}>{currentJob.cost}</Text>
            <Text style={styles.location} numberOfLines={1}>{locationDisplay}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {jobTags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'summary' && styles.activeTab]} 
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
            Summary
          </Text>
          {activeTab === 'summary' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'about' && styles.activeTab]} 
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
            About
          </Text>
          {activeTab === 'about' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        {isMyJob && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'interests' && styles.activeTab]} 
            onPress={() => setActiveTab('interests')}
          >
            <Text style={[styles.tabText, activeTab === 'interests' && styles.activeTabText]}>
              Interested ({interestedUsers.length})
            </Text>
            {activeTab === 'interests' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Content */}
      {activeTab === 'summary' && renderSummaryTab()}
      {activeTab === 'about' && renderAboutTab()}
      {activeTab === 'interests' && isMyJob && (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {interestedUsers.length === 0 ? (
            <View style={styles.emptyInterestsContainer}>
              <Ionicons name="people-outline" size={64} color={Colors.gray} />
              <Text style={styles.emptyInterestsText}>No interests yet</Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {interestedUsers.map((entry) => (
                <View key={entry._id} style={styles.interestCard}>
                  <View style={styles.interestLeft}>
                    <View style={styles.interestAvatar}>
                      {entry.user.profile.profileImage ? (
                        <Image 
                          source={{ uri: `${IMAGE_BASE_URL}${entry.user.profile.profileImage.startsWith('/') ? entry.user.profile.profileImage : `/${entry.user.profile.profileImage}`}` }}
                          style={styles.interestAvatarImage}
                          contentFit="cover"
                        />
                      ) : (
                        <Text style={styles.interestAvatarText}>
                          {(entry.user.profile.fullName || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={styles.interestInfo}>
                      <Text style={styles.interestName}>{entry.user.profile.fullName}</Text>
                      <Text style={styles.interestEmail}>{entry.user.profile.email}</Text>
                      <Text style={styles.interestNotedAt}>Noted at {new Date(entry.notedAt).toLocaleString()}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.contactSmallButton}
                    onPress={() => Alert.alert('Contact', entry.user.phoneNumber ? `Phone: ${entry.user.phoneNumber}` : 'No phone number available')}
                  >
                    <Text style={styles.contactSmallButtonText}>Contact</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Action Button */}
      {!isMyJob && (
        <View style={styles.contactButtonContainer}>
          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={isDirectContact ? handleContact : handleShowInterest}
          >
            <Text style={styles.contactButtonText}>
              {isDirectContact ? 'Contact' : 'Show Interest'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerSection: {
    backgroundColor: Colors.primary,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  bookmarkButton: {
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  posterAvatar: {
    width: 80,
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  jobInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  jobTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 16,
  },
  salaryLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    flex: 1,
  },
  location: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    flex: 1,
    textAlign: 'right',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
  locationSection: {
    marginBottom: 24,
  },
  locationCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  locationText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
    marginBottom: 4,
  },
  locationDetails: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  attachmentsSection: {
    marginBottom: 24,
  },
  attachmentCard: {
    width: SCREEN_WIDTH * 0.7,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 12,
    fontWeight: '500',
  },
  aboutSection: {
    paddingBottom: 20,
  },
  posterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutPosterAvatar: {
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  posterAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  posterTitle: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 2,
  },
  posterStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
  },
  contactButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
    backgroundColor: Colors.white,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  // Interests tab styles
  emptyInterestsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyInterestsText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
  },
  interestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
  },
  interestLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  interestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  interestAvatarText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  interestAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  interestInfo: {
    flex: 1,
  },
  interestName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  interestEmail: {
    fontSize: 12,
    color: Colors.gray,
  },
  interestNotedAt: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  contactSmallButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  contactSmallButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
});
