import React from 'react';
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

interface Job {
  id: string;
  title: string;
  poster: string;
  avatar: string;
  cost: string;
  location: string;
  tags: string[];
  isHot: boolean;
}

const HotJobs: React.FC = () => {
  const navigation = useNavigation();
  // Dummy data for hot jobs
  const hotJobs: Job[] = [
    {
      id: '1',
      title: 'Need House Cleaner',
      poster: 'Sarah M.',
      avatar: 'S',
      cost: '$50/day',
      location: 'Downtown, NYC',
      tags: ['Today', '2:00 PM', 'Urgent'],
      isHot: true,
    },
    {
      id: '2',
      title: 'Carpenter for Kitchen Repair',
      poster: 'Mike R.',
      avatar: 'M',
      cost: '$200/project',
      location: 'Brooklyn, NYC',
      tags: ['Tomorrow', '9:00 AM', 'Flexible'],
      isHot: true,
    },
    {
      id: '3',
      title: 'Garden Landscaping Help',
      poster: 'Jennifer L.',
      avatar: 'J',
      cost: '$80/day',
      location: 'Queens, NYC',
      tags: ['This Week', 'Weekend', 'Ongoing'],
      isHot: true,
    },
    {
      id: '4',
      title: 'Moving Assistant Needed',
      poster: 'David K.',
      avatar: 'D',
      cost: '$25/hour',
      location: 'Manhattan, NYC',
      tags: ['Today', '1:00 PM', 'Heavy Lifting'],
      isHot: true,
    },
    {
      id: '5',
      title: 'Pet Sitting for Weekend',
      poster: 'Lisa P.',
      avatar: 'L',
      cost: '$40/day',
      location: 'Staten Island, NYC',
      tags: ['Friday', '6:00 PM', 'Pet Care'],
      isHot: true,
    },
  ];

  const renderJobCard = (job: Job) => (
    <TouchableOpacity key={job.id} style={styles.jobCard} activeOpacity={0.8} onPress={()=>{navigation.navigate('JobDetailsScreen')}}>
      {/* Hot/Fire Label */}
      <View style={styles.hotLabel}>
        <Ionicons name="flame" size={16} color={Colors.orange} />
        {/* <Text style={styles.hotLabelText}>HOT</Text> */}
      </View>

      {/* Avatar and Title Row */}
      <View style={styles.avatarTitleRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{job.avatar}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.posterName}>{job.poster}</Text>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {job.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Row - Cost and Location */}
      <View style={styles.bottomRow}>
        <Text style={styles.cost}>{job.cost}</Text>
        <Text style={styles.location}>{job.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hot Jobs</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Job Cards ScrollView */}
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
});

export default HotJobs;
