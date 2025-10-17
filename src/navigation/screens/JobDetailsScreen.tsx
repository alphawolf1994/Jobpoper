import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface JobDetails {
  id: string;
  title: string;
  poster: string;
  avatar: string;
  cost: string;
  location: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  posterDetails: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
    joinedDate: string;
    completedJobs: number;
    bio: string;
  };
}

const JobDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'about'>('summary');
  const navigation = useNavigation();

  // Function to get job details based on job ID (you can pass this via navigation params)
  const getJobDetails = (jobId: string): JobDetails => {
    const jobs: { [key: string]: JobDetails } = {
      '1': {
        id: '1',
        title: 'Need House Cleaner',
        poster: 'Sarah M.',
        avatar: 'S',
        cost: '$50/day',
        location: 'Downtown, NYC',
        tags: ['Today', '2:00 PM', 'Urgent'],
        description: 'Looking for a reliable house cleaner for weekly cleaning. 3-bedroom house, must have experience with deep cleaning, organizing, and maintaining a clean environment. Need someone trustworthy and detail-oriented.',
        responsibilities: [
          'Deep clean all rooms including kitchen, bathrooms, and living areas',
          'Vacuum carpets and mop hardwood floors thoroughly',
          'Clean and sanitize kitchen appliances and surfaces',
          'Organize and tidy up all rooms and storage areas',
          'Take out trash and recycling as needed'
        ],
        requirements: [
          'Must be available today at 2:00 PM',
          'Previous house cleaning experience required',
          'Own cleaning supplies and equipment',
          'Reliable transportation to Downtown, NYC',
          'Good communication skills and professional attitude'
        ],
        posterDetails: {
          name: 'Sarah M.',
          avatar: 'S',
          rating: 4.9,
          reviews: 23,
          joinedDate: 'January 2023',
          completedJobs: 12,
          bio: 'Homeowner looking for reliable help with house maintenance. I appreciate quality work and fair pricing. Clean and organized home, flexible scheduling.'
        }
      },
      '2': {
        id: '2',
        title: 'Carpenter for Kitchen Repair',
        poster: 'Mike R.',
        avatar: 'M',
        cost: '$200/project',
        location: 'Brooklyn, NYC',
        tags: ['Tomorrow', '9:00 AM', 'Flexible'],
        description: 'Need experienced carpenter to repair kitchen cabinets and install new hardware. Some cabinets have loose hinges and need adjustment. Looking for quality workmanship and attention to detail.',
        responsibilities: [
          'Inspect and repair loose cabinet hinges and doors',
          'Install new cabinet hardware and handles',
          'Adjust cabinet alignment and ensure proper closure',
          'Clean up work area and dispose of old hardware',
          'Provide recommendations for future maintenance'
        ],
        requirements: [
          'Available tomorrow at 9:00 AM',
          'Minimum 2 years carpentry experience',
          'Own tools and transportation',
          'References from previous kitchen repair projects',
          'Professional and punctual work ethic'
        ],
        posterDetails: {
          name: 'Mike R.',
          avatar: 'M',
          rating: 4.7,
          reviews: 18,
          joinedDate: 'March 2022',
          completedJobs: 8,
          bio: 'Homeowner in Brooklyn looking for skilled craftspeople. I value quality work and fair pricing. Flexible with timing as long as the job is done well.'
        }
      },
      '3': {
        id: '3',
        title: 'Garden Landscaping Help',
        poster: 'Jennifer L.',
        avatar: 'J',
        cost: '$80/day',
        location: 'Queens, NYC',
        tags: ['This Week', 'Weekend', 'Ongoing'],
        description: 'Need help with garden maintenance and landscaping. Front and back yard work required including planting, weeding, and general garden cleanup. Perfect for someone who enjoys outdoor work.',
        responsibilities: [
          'Plant new flowers and shrubs in designated areas',
          'Weed garden beds and remove unwanted plants',
          'Prune existing bushes and small trees',
          'Mulch garden beds and maintain pathways',
          'Water plants and maintain irrigation system'
        ],
        requirements: [
          'Available this weekend for ongoing project',
          'Physical ability to do outdoor manual labor',
          'Basic knowledge of plants and gardening',
          'Own gardening tools (shovel, rake, pruners)',
          'Reliable transportation to Queens location'
        ],
        posterDetails: {
          name: 'Jennifer L.',
          avatar: 'J',
          rating: 4.8,
          reviews: 31,
          joinedDate: 'November 2022',
          completedJobs: 15,
          bio: 'Passionate gardener looking for help maintaining my beautiful yard. I love working with people who share my enthusiasm for plants and outdoor spaces.'
        }
      }
    };
    
    return jobs[jobId] || jobs['1']; // Default to first job if ID not found
  };

  // Get job details (you can pass jobId via navigation params)
  const jobDetails = getJobDetails('1'); // For now, using job ID '1'

  const handleContact = () => {
    Alert.alert('Contact', `Contact ${jobDetails.poster} about this job?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Contact', onPress: () => console.log('Contact pressed') },
    ]);
  };

  const handleBookmark = () => {
    Alert.alert('Bookmark', 'Job bookmarked successfully!');
  };

  const renderSummaryTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Description</Text>
        <Text style={styles.descriptionText}>{jobDetails.description}</Text>
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read More...</Text>
        </TouchableOpacity>
      </View>

     

     
    </ScrollView>
  );

  const renderAboutTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.aboutSection}>
        <View style={styles.posterHeader}>
          <View style={styles.aboutPosterAvatar}>
            <Text style={styles.posterAvatarText}>{jobDetails.posterDetails.avatar}</Text>
          </View>
          <View style={styles.posterInfo}>
            <Text style={styles.posterName}>{jobDetails.posterDetails.name}</Text>
            <Text style={styles.posterTitle}>Job Poster</Text>
            {/* <Text style={styles.posterCompany}>Local Community Member</Text> */}
          </View>
        </View>

     

        <View style={styles.posterStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{jobDetails.posterDetails.completedJobs}</Text>
            <Text style={styles.statLabel}>Jobs Posted</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{jobDetails.posterDetails.joinedDate}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>

       
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
     
     

      {/* Header Section with Blue Background */}
      <View style={styles.headerSection}>
        {/* Navigation and Bookmark */}
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => (navigation as any).goBack()}>
            <AntDesign name="arrow-left" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookmarkButton} >
          <Ionicons name="flame" size={20} color={Colors.orange} />

          </TouchableOpacity>
        </View>

        {/* Background Pattern */}
        {/* <View style={styles.backgroundPattern}>
          <View style={styles.patternRow}>
            <View style={styles.patternShape} />
            <View style={styles.patternShape} />
            <View style={styles.patternShape} />
          </View>
          <View style={styles.patternRow}>
            <View style={styles.patternShape} />
            <View style={styles.patternShape} />
            <View style={styles.patternShape} />
          </View>
        </View> */}

        {/* Poster Avatar */}
        <View style={styles.logoContainer}>
          <View style={styles.posterAvatar}>
            <Text style={styles.logoText}>{jobDetails.avatar}</Text>
          </View>
        </View>

        {/* Job Info */}
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{jobDetails.title}</Text>
          <Text style={styles.companyName}>Posted by {jobDetails.poster}</Text>
          
          <View style={styles.salaryLocationRow}>
            <Text style={styles.salary}>{jobDetails.cost}</Text>
            <Text style={styles.location}>{jobDetails.location}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {jobDetails.tags.map((tag, index) => (
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
      </View>

      {/* Tab Content */}
      {activeTab === 'summary' ? renderSummaryTab() : renderAboutTab()}

      {/* Contact Button */}
      <View style={styles.contactButtonContainer}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
  },
  statusTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    backgroundColor:Colors.white,
    borderRadius:50
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  patternShape: {
    width: 20,
    height: 20,
    backgroundColor: Colors.white,
    borderRadius: 4,
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
  },
  location: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
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
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: Colors.gray,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
    flex: 1,
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
  posterCompany: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 8,
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
  posterDescription: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  contactButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
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
});
