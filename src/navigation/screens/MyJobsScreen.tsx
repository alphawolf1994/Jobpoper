import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Colors, getJobCategoryName } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getUserJobs, getMyInterestedJobs, deleteJob, updateJobStatus } from '../../redux/slices/jobSlice';
import { Job } from '../../interface/interfaces';
import { useAlertModal } from "../../hooks/useAlertModal";
import { formatDateDDMMYYYY } from "../../utils";
import VerifyWorkerSheet from "../../components/VerifyWorkerSheet";
import CompleteJobSheet from "../../components/CompleteJobSheet";
import ReviewModal from "../../components/ReviewModal";

const MyJobsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'myJobs' | 'interested'>('myJobs');
  
  const { userJobs, interestedJobs, loading, error } = useSelector((state: RootState) => state.job);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  const [verifySheetJob, setVerifySheetJob] = useState<Job | null>(null);
  const [completeSheetJob, setCompleteSheetJob] = useState<Job | null>(null);
  const [reviewJob, setReviewJob] = useState<Job | null>(null);

  useEffect(() => {
    // Fetch data when component mounts
    if (activeTab === 'myJobs') {
      dispatch(getUserJobs());
    } else {
      dispatch(getMyInterestedJobs({ page: 1, limit: 10 }));
    }
  }, [activeTab, dispatch]);

  // Job owners can only cancel an open job here. Marking a job "completed" is
  // no longer possible from this screen — it can only happen when the worker
  // enters the correct Task PIN (see CompleteJobSheet), which is what keeps the
  // PIN verification step from being skipped.
  const handleCancelJob = (job: Job) => {
    showAlert({
      title: "Cancel Task",
      message: `Are you sure you want to cancel "${job.title}"?`,
      type: "warning",
      buttons: [
        {
          label: "Keep Task",
          variant: "secondary",
        },
        {
          label: "Cancel Task",
          onPress: async () => {
            try {
              await dispatch(updateJobStatus({ jobId: job._id, status: "cancelled" })).unwrap();
              dispatch(getUserJobs());
              showAlert({
                title: "Task Cancelled",
                message: "The task has been cancelled.",
                type: "success",
              });
            } catch (error: any) {
              showAlert({
                title: "Error",
                message: error || "Failed to cancel task",
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
      title: "Delete Task",
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
              showAlert({
                title: "Success",
                message: "Task deleted successfully",
                type: "success",
              });
            } catch (error: any) {
              showAlert({
                title: "Error",
                message: error || "Failed to delete task",
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
      case 'job_started': return '#F59E0B';
      case 'in-progress': return Colors.primary;
      case 'cancelled': return Colors.red;
      default: return Colors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'completed': return 'Completed';
      case 'job_started': return 'In Progress';
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
                      <Ionicons name="flame" size={20} color={Colors.red} />
                    </View>}
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
        </View>

      </View>

      {/* Job ID reference — always visible so the owner can note it down */}
      {item.jobPin && (
        <View style={styles.jobIdRow}>
          <Ionicons name="key-outline" size={13} color={Colors.gray} />
          <Text style={styles.jobIdText}>Job ID: {item.jobPin}</Text>
        </View>
      )}

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Cost · Type · Category — single-line meta row */}
      <View style={styles.metaRow}>
        <Ionicons name="cash-outline" size={14} color={Colors.primary} />
        <Text
          style={styles.metaRowText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.cost}
          {item.jobType ? ` · ${item.jobType}` : ''}
          {getJobCategoryName(item) ? ` · ${getJobCategoryName(item)}` : ''}
        </Text>
      </View>

      {/* Info Row - Date, Time */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText} numberOfLines={1}>{formatDateDDMMYYYY(item.formattedScheduledDate || item.scheduledDate)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{item.scheduledTime}</Text>
        </View>
      </View>

      {/* Task PIN Banner — visible when job has started */}
      {item.status === 'job_started' && item.jobPin && (
        <View style={styles.jobPinBanner}>
          <Ionicons name="key-outline" size={16} color="#92400E" />
          <View style={{ flex: 1 }}>
            <Text style={styles.jobPinLabel}>Task PIN (worker enters this to complete)</Text>
            <Text style={styles.jobPinValue}>{item.jobPin}</Text>
          </View>
        </View>
      )}

      {/* Verify Worker button — shown on every open job, regardless of responsePreference */}
      {item.status === 'open' && (
        <TouchableOpacity
          style={styles.verifyWorkerBtn}
          activeOpacity={0.8}
          onPress={() => setVerifySheetJob(item)}
        >
          <Ionicons name="shield-checkmark-outline" size={17} color={Colors.white} />
          <Text style={styles.verifyWorkerBtnText}>Verify & Start Task</Text>
        </TouchableOpacity>
      )}

      {/* Assigned worker chip — tap to view their public profile & reviews */}
      {(item.status === 'job_started' || item.status === 'completed') &&
        typeof item.assignedWorker === 'object' &&
        item.assignedWorker && (
          <TouchableOpacity
            style={styles.workerChip}
            activeOpacity={0.7}
            onPress={() => {
              const w: any = item.assignedWorker;
              navigation.navigate('WorkerProfileScreen', {
                workerId: w._id,
                workerName: w.profile?.fullName,
                workerImage: w.profile?.profileImage,
              });
            }}
          >
            <Ionicons name="person-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.workerChipText} numberOfLines={1}>
              {(item.assignedWorker as any)?.profile?.fullName || 'Assigned worker'}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.gray} />
          </TouchableOpacity>
        )}

      {/* Leave a review button — for completed+unreviewed jobs */}
      {item.status === 'completed' && item.isReviewed === false && item.assignedWorker && (
        <TouchableOpacity
          style={styles.reviewBtn}
          activeOpacity={0.8}
          onPress={() => setReviewJob(item)}
        >
          <Ionicons name="star-outline" size={16} color="#F59E0B" />
          <Text style={styles.reviewBtnText}>Leave a Review</Text>
        </TouchableOpacity>
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {item.status === 'open' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelJob(item)}
          >
            <Ionicons name="close-circle-outline" size={18} color="#F59E0B" />
            <Text style={styles.cancelButtonText}>Cancel Task</Text>
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

      {/* Safety note — remind owners to verify the worker before starting */}
      {item.status === 'open' && (
        <View style={styles.safetyNote}>
          <View style={styles.safetyNoteIcon}>
            <Ionicons name="warning" size={14} color="#F59E0B" />
          </View>
          <Text style={styles.safetyNoteText}>
            Note: Please verify the professional before starting the work for your safety and security purpose.
          </Text>
        </View>
      )}
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

      {/* Cost · Type · Category — single-line meta row */}
      <View style={styles.metaRow}>
        <Ionicons name="cash-outline" size={14} color={Colors.primary} />
        <Text
          style={styles.metaRowText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.cost}
          {item.jobType ? ` · ${item.jobType}` : ''}
          {getJobCategoryName(item) ? ` · ${getJobCategoryName(item)}` : ''}
        </Text>
      </View>

      {/* Info Row - Date, Time */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText} numberOfLines={1}>{formatDateDDMMYYYY(item.formattedScheduledDate || item.scheduledDate)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{item.scheduledTime}</Text>
        </View>
      </View>

      {/* Posted By Info */}
      <View style={styles.postedByRow}>
        <Ionicons name="person-outline" size={16} color={Colors.primary} />
        <Text style={styles.postedByText}>
          Posted by {item.postedBy?.profile?.fullName || 'Unknown'}
        </Text>
      </View>

      {/* Enter Task PIN button — worker sees this when job is started */}
      {item.status === 'job_started' && (
        <TouchableOpacity
          style={styles.enterPinBtn}
          activeOpacity={0.8}
          onPress={() => setCompleteSheetJob(item)}
        >
          <Ionicons name="key-outline" size={17} color={Colors.white} />
          <Text style={styles.enterPinBtnText}>Enter Task PIN to Complete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="briefcase-outline" size={64} color={Colors.gray} />
      <Text style={styles.emptyText}>
        {activeTab === 'myJobs' 
          ? 'No tasks posted yet' 
          : 'No interested tasks yet'}
      </Text>
      {activeTab === 'myJobs' && (
        <TouchableOpacity 
          style={styles.emptyButton}
          onPress={() => navigation.navigate('PostJobScreen')}
        >
          <Text style={styles.emptyButtonText}>Post Your First Task</Text>
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
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {activeTab === 'myJobs' 
              ? `${jobCount} tasks posted` 
              : `${jobCount} tasks interested`}
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
            My Tasks
          </Text>
          {activeTab === 'myJobs' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'interested' && styles.activeTab]} 
          onPress={() => setActiveTab('interested')}
        >
          <Text style={[styles.tabText, activeTab === 'interested' && styles.activeTabText]}>
            My Interested Tasks
          </Text>
          {activeTab === 'interested' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      <View style={{paddingBottom:25, flex: 1}}>
        {loading && (currentJobs?.length ?? 0) === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading tasks...</Text>
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

      <VerifyWorkerSheet
        visible={!!verifySheetJob}
        job={verifySheetJob}
        onClose={() => setVerifySheetJob(null)}
        onStarted={() => {
          dispatch(getUserJobs());
          showAlert({ title: "Task Started", message: "The task has been started and the worker has been notified.", type: "success" });
        }}
      />

      <CompleteJobSheet
        visible={!!completeSheetJob}
        job={completeSheetJob}
        onClose={() => setCompleteSheetJob(null)}
        onCompleted={() => {
          dispatch(getMyInterestedJobs({ page: 1, limit: 10 }));
          showAlert({ title: "Task Completed!", message: "Great work! The task owner will now be prompted to leave a review.", type: "success" });
        }}
      />

      <ReviewModal
        visible={!!reviewJob}
        job={reviewJob}
        workerId={typeof reviewJob?.assignedWorker === 'object' ? (reviewJob?.assignedWorker as any)?._id : undefined}
        workerName={typeof reviewJob?.assignedWorker === 'object' ? (reviewJob?.assignedWorker as any)?.profile?.fullName : undefined}
        workerImage={typeof reviewJob?.assignedWorker === 'object' ? (reviewJob?.assignedWorker as any)?.profile?.profileImage : undefined}
        onClose={() => setReviewJob(null)}
        onSubmitted={() => {
          dispatch(getUserJobs());
        }}
      />
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
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaRowText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
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
  cancelButton: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
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
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  safetyNoteIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  safetyNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#92400E',
    fontWeight: '500',
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
    borderColor:Colors.red,
    borderRadius: 50,
    marginRight: 8,
  },
  jobIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  jobIdText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
    letterSpacing: 1,
  },
  jobPinBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  jobPinLabel: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '500',
  },
  jobPinValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#92400E',
    letterSpacing: 4,
    marginTop: 2,
  },
  verifyWorkerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 11,
    marginBottom: 10,
  },
  verifyWorkerBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  enterPinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 11,
    marginTop: 10,
  },
  enterPinBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#FFFBEB',
  },
  reviewBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  workerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
    maxWidth: '100%',
  },
  workerChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    flexShrink: 1,
  },
});
