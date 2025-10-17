import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils';
import { useNavigation } from '@react-navigation/native';

interface ListedJob {
  id: string;
  title: string;
  poster: string;
  avatar: string;
  cost: string;
  location: string;
  isHot: boolean;
}

const ListedJobs: React.FC = () => {
  const navigation = useNavigation();
  // Dummy data for listed jobs
  const listedJobs: ListedJob[] = [
    {
      id: '1',
      title: 'House Cleaning Service',
      poster: 'Maria S.',
      avatar: 'M',
      cost: '$45/day',
      location: 'Brooklyn, NYC',
      isHot: false,
    },
    {
      id: '2',
      title: 'Kitchen Renovation Help',
      poster: 'John D.',
      avatar: 'J',
      cost: '$180/project',
      location: 'Queens, NYC',
      isHot: false,
    },
    {
      id: '3',
      title: 'Garden Maintenance',
      poster: 'Sarah K.',
      avatar: 'S',
      cost: '$65/day',
      location: 'Manhattan, NYC',
      isHot: false,
    },
    {
      id: '4',
      title: 'Moving Day Assistant',
      poster: 'Mike R.',
      avatar: 'M',
      cost: '$30/hour',
      location: 'Bronx, NYC',
      isHot: false,
    },
    {
      id: '5',
      title: 'Pet Walking Service',
      poster: 'Lisa P.',
      avatar: 'L',
      cost: '$35/day',
      location: 'Staten Island, NYC',
      isHot: false,
    },
    {
      id: '6',
      title: 'Handyman Repairs',
      poster: 'David L.',
      avatar: 'D',
      cost: '$120/project',
      location: 'Long Island, NYC',
      isHot: false,
    },
  ];

  const renderJobCard = ({ item }: { item: ListedJob }) => (
    <TouchableOpacity style={styles.jobCard} activeOpacity={0.7} onPress={()=>{navigation.navigate('JobDetailsScreen')}}>
      {/* Left Side - Avatar and Job Info */}
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.posterName}>{item.poster}</Text>
        </View>
      </View>

      {/* Right Side - Cost and Location */}
      <View style={styles.rightSection}>
        <Text style={styles.cost}>{item.cost}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Listed Jobs</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Job Cards List */}
      <FlatList
        data={listedJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
});

export default ListedJobs;
