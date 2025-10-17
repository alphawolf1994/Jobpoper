import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Colors } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";

interface MyJob {
  id: string;
  title: string;
  description: string;
  cost: string;
  location: string;
  status: 'active' | 'completed' | 'paused';
  postedDate: string;

}

const MyJobsScreen = () => {
  const [myJobs, setMyJobs] = useState<MyJob[]>([
    {
      id: '1',
      title: 'Need House Cleaner',
      description: 'Looking for a reliable house cleaner for weekly cleaning. 3-bedroom house, must have experience.',
      cost: '$50/day',
      location: 'Downtown, NYC',
      status: 'active',
      postedDate: '2 days ago',
     
    },
    {
      id: '2',
      title: 'Garden Landscaping Help',
      description: 'Need help with garden maintenance and landscaping. Front and back yard work required.',
      cost: '$80/day',
      location: 'Queens, NYC',
      status: 'active',
      postedDate: '1 week ago',
   
    },
    {
      id: '3',
      title: 'Moving Day Assistant',
      description: 'Need help moving furniture and boxes. Heavy lifting required. 2-bedroom apartment.',
      cost: '$25/hour',
      location: 'Manhattan, NYC',
      status: 'completed',
      postedDate: '2 weeks ago',
    
    },
    {
      id: '4',
      title: 'Pet Walking Service',
      description: 'Need someone to walk my dog twice daily. Small breed, very friendly. Long-term arrangement preferred.',
      cost: '$35/day',
      location: 'Brooklyn, NYC',
      status: 'paused',
      postedDate: '3 weeks ago',
      
    },
    {
      id: '5',
      title: 'Kitchen Renovation Help',
      description: 'Looking for skilled carpenter for kitchen cabinet installation and minor repairs.',
      cost: '$200/project',
      location: 'Staten Island, NYC',
      status: 'active',
      postedDate: '4 days ago',
   
    },
  ]);

  const handleEditJob = (job: MyJob) => {
    Alert.alert('Edit Job', `Edit "${job.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit', onPress: () => console.log('Edit job:', job.id) },
    ]);
  };

  const handleDeleteJob = (job: MyJob) => {
    Alert.alert('Delete Job', `Are you sure you want to delete "${job.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setMyJobs(prevJobs => prevJobs.filter(j => j.id !== job.id));
        },
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.green;
      case 'completed': return Colors.gray;
      case 'paused': return Colors.orange;
      default: return Colors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'paused': return 'Paused';
      default: return 'Unknown';
    }
  };

  const renderJobCard = ({ item }: { item: MyJob }) => (
    <View style={styles.jobCard}>
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
          <Ionicons name="location-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{item.postedDate}</Text>
        </View>
      </View>

     

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => handleEditJob(item)}
        >
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDeleteJob(item)}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.red} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top','bottom','left','right']} style={styles.container}>
      <Header />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>My Posted Jobs</Text>
        <Text style={styles.headerSubtitle}>{myJobs.length} jobs posted</Text>
      </View>

      {/* Jobs List */}
      <View style={{paddingBottom:25}}>
      <FlatList
        data={myJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      </View>
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
  applicantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  applicantsText: {
    fontSize: 13,
    color: Colors.gray,
    marginLeft: 6,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
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
  editButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
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
});

