import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../utils';

export interface Child {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female';
  image?: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}

interface ChildCardProps {
  child: Child;
  onEdit?: (child: Child) => void;
  onViewDetails?: (child: Child) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onEdit, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => onViewDetails?.(child)}
      activeOpacity={0.8}
    >
      {/* Header with Profile Image and Basic Info */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {child.image ? (
              <Image source={{ uri: child.image }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: Colors.primary }]}>
                <Text style={styles.profileImageText}>
                  {child.firstName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.basicInfo}>
            <Text style={styles.childName}>
              {child.firstName} {child.lastName}
            </Text>
            <Text style={styles.ageText}>
              {child.age} years old
            </Text>
            <Text style={styles.genderText}>
              {child.gender.charAt(0).toUpperCase() + child.gender.slice(1)}
            </Text>
          </View>
        </View>
        
        {/* View Details Arrow */}
        <View style={styles.arrowContainer}>
          <Feather name="chevron-right" size={20} color={Colors.gray} />
        </View>
      </View>

      {/* Additional Information */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={14} color={Colors.gray} />
          <Text style={styles.infoText}>
            Added: {formatDate(child.createdAt)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Feather name="user" size={14} color={Colors.gray} />
          <Text style={styles.infoText}>
            ID: {child._id}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => onEdit?.(child)}
        >
          <Feather name="edit" size={16} color={Colors.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => onViewDetails?.(child)}
        >
          <Feather name="eye" size={16} color={Colors.white} />
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },
  profileImageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  basicInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 2,
  },
  ageText: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 2,
  },
  genderText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 13,
    color: Colors.gray,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    flex: 0.48,
    justifyContent: 'center',
  },
  editButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    flex: 0.48,
    justifyContent: 'center',
  },
  detailsButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default ChildCard;
