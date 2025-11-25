import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Colors } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getUserJobs, getMyInterestedJobs, deleteJob, updateJobStatus } from '../../redux/slices/jobSlice';
import { Job } from '../../interface/interfaces';
import { useAlertModal } from "../../hooks/useAlertModal";

const MyJobsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'myJobs' | 'interested'>('myJobs');
  
  const { userJobs, interestedJobs, loading, error } = useSelector((state: RootState) => state.job);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  useEffect(() => {
    // Fetch data when component mounts
    if (activeTab === 'myJobs') {
      dispatch(getUserJobs());
    } else {
      dispatch(getMyInterestedJobs({ page: 1, limit: 10 }));
    }
  }, [activeTab, dispatch]);

  const handleCompleteJob = (job: Job) => {
    showAlert({
      title: "Complete Job",
      message: `Are you sure you want to mark "${job.title}" as completed?`,
      type: "warning",
      buttons: [
        {
          label: "Cancel",
          variant: "secondary",
        },
        {
          label: "Complete",
          onPress: async () => {
            try {
              await dispatch(updateJobStatus({ jobId: job._id, status: "completed" })).unwrap();
              dispatch(getUserJobs());
              showAlert({
                title: "Success",
                message: "Job status updated to completed",
                type: "success",
              });
            } catch (error: any) {
              showAlert({
                title: "Error",
                message: error || "Failed to update job status",
                type: "error",
              });
            }
          },
        },
      ],
    });
  };

  const handleDeleteJob = (job: Job) => {
    showAlert({
      title: "Delete Job",
      message: `Are you sure you want to delete "${job.title}"?`,
      type: "warning",
      buttons: [
        {
          label: "Cancel",
          variant: "secondary",
        },
        {
          label: "Delete",
          onPress: async () => {
            try {
              await dispatch(deleteJob(job._id)).unwrap();
              dispatch(getUserJobs());
            } catch (error: any) {
              showAlert({
                title: "Error",
                message: error || "Failed to delete job",
                type: "error",
              });
            }
          },
        },
      ],
    });
  };

  const handleJobPress = (job: Job) => {
    navigation.navigate('JobDetailsScreen', { jobId: job._id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return Colors.green;
      case 'completed': return Colors.gray;
      case 'in-progress': return Colors.primary;
      case 'cancelled': return Colors.red;
      default: return Colors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const formatLocation = (location: any): string => {
    if (typeof location === 'string') {
      return location;
    }
    if (location?.displayAddress) {
      return location.displayAddress;
    }
    if (location?.source?.displayAddress) {
      return location.source.displayAddress;
    }
    return 'Location not specified';
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const renderMyJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => handleJobPress(item)}
      activeOpacity={0.7}
    >
      {/* Header Row - Title and Status */}
      <View style={styles.headerRow}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View style={styles.headerRow}>
         {item.urgency === 'Urgent'&&<View style={styles.bookmarkButton} >
                      <Ionicons name="flame" size={20} color={Colors.orange} />
                    </View>}
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
        </View>
        
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Info Row - Cost, Location, Date */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="cash-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{item.cost}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText} numberOfLines={1}>{item.formattedScheduledDate || new Date(item.scheduledDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {item.status !== 'completed' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]} 
            onPress={() => handleCompleteJob(item)}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
            <Text style={styles.completeButtonText}>Complete Job</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDeleteJob(item)}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.red} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderInterestedJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => handleJobPress(item)}
      activeOpacity={0.7}
    >
      {/* Header Row - Title and Status */}
      <View style={styles.headerRow}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Info Row - Cost, Location, Date */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="cash-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{item.cost}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText} numberOfLines={1}>{item.formattedScheduledDate || new Date(item.scheduledDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      {/* Posted By Info */}
      <View style={styles.postedByRow}>
        <Ionicons name="person-outline" size={16} color={Colors.primary} />
        <Text style={styles.postedByText}>
          Posted by {item.postedBy?.profile?.fullName || 'Unknown'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="briefcase-outline" size={64} color={Colors.gray} />
      <Text style={styles.emptyText}>
        {activeTab === 'myJobs' 
          ? 'No jobs posted yet' 
          : 'No interested jobs yet'}
      </Text>
      {activeTab === 'myJobs' && (
        <TouchableOpacity 
          style={styles.emptyButton}
          onPress={() => navigation.navigate('PostJobScreen')}
        >
          <Text style={styles.emptyButtonText}>Post Your First Job</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Safeguards against undefined and different API shapes
  const safeUserJobs: any[] = Array.isArray(userJobs) ? userJobs : [];
  const safeInterestedRaw: any[] = Array.isArray(interestedJobs) ? interestedJobs : [];
  // Normalize interested jobs in case API returns items like { job: {...} }
  const normalizedInterestedJobs: any[] = safeInterestedRaw.map((entry) => entry?.job ?? entry).filter(Boolean);

  const currentJobs: any[] = activeTab === 'myJobs' ? safeUserJobs : normalizedInterestedJobs;
  const jobCount = currentJobs?.length ?? 0;

  return (
    <SafeAreaView edges={['top','bottom','left','right']} style={styles.container}>
      <Header />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>My Jobs</Text>
          <Text style={styles.headerSubtitle}>
            {activeTab === 'myJobs' 
              ? `${jobCount} jobs posted` 
              : `${jobCount} jobs interested`}
          </Text>
        </View>
        {activeTab === 'myJobs' && (
          <TouchableOpacity 
            style={styles.plusButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PostJobScreen')}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'myJobs' && styles.activeTab]} 
          onPress={() => setActiveTab('myJobs')}
        >
          <Text style={[styles.tabText, activeTab === 'myJobs' && styles.activeTabText]}>
            My Jobs
          </Text>
          {activeTab === 'myJobs' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'interested' && styles.activeTab]} 
          onPress={() => setActiveTab('interested')}
        >
          <Text style={[styles.tabText, activeTab === 'interested' && styles.activeTabText]}>
            My Interested Jobs
          </Text>
          {activeTab === 'interested' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      <View style={{paddingBottom:25, flex: 1}}>
        {loading && (currentJobs?.length ?? 0) === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading jobs...</Text>
          </View>
        ) : (currentJobs?.length ?? 0) === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={currentJobs}
            renderItem={activeTab === 'myJobs' ? renderMyJobCard : renderInterestedJobCard}
            keyExtractor={(item: any) => item?._id || item?.id || item?.job?._id || Math.random().toString(36).slice(2)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
      {alertModal}
    </SafeAreaView>
  );
};

export default MyJobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'column',
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  separator: {
    height: 16,
  },
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
  },
  description: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 6,
    flex: 1,
  },
  postedByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  postedByText: {
    fontSize: 13,
    color: Colors.gray,
    marginLeft: 6,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.red,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.red,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
    bookmarkButton: {
    padding: 3,
    borderWidth:1,
    borderColor:Colors.orange,
    borderRadius: 50,
    marginRight: 8,
  },
});
