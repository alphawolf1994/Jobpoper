import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils';
import { Feather, Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

const allFeatures = [
  "Air Condition",
  "Swimming Pool",
  "Library",
  "Transport",
  "Indoor Sports",
  "Outdoor Sports",
  "Clubs and Activities",
  "Trips and Excursions",
  "Cafeteria",
  "Gymnasium",
  "Wi-Fi Ennabled",
  "Ramps for Differently Abled",
  "Fire Extinguishers",
  "Medical Clinic Facility",
  "Computer Labs",
  "Science Labs",
  "Security",
  "Hostel Facilities",
  "Meals and Snacks"
];

type SchoolInfo = {
  schoolAmenities: string[];
};

type SchoolFeaturesDisplayProps = {
  school: SchoolInfo;
  onSave: (updatedFeatures: SchoolInfo) => void;
};

const SchoolFeaturesDisplay: React.FC<SchoolFeaturesDisplayProps> = ({ school, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeatures, setEditedFeatures] = useState<string[]>(school.schoolAmenities);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave({ schoolAmenities: editedFeatures });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedFeatures(school.schoolAmenities);
    setIsEditing(false);
  };

  const handleFeatureChange = (feature: string, isChecked: boolean) => {
    setEditedFeatures(prev => 
      isChecked 
        ? [...prev, feature] 
        : prev.filter(f => f !== feature)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.heading}>
          <View style={styles.headingRow}>
            <View style={styles.iconRow}>
              <Feather name="map" size={20} color={Colors.black} style={styles.icon} />
              <Text style={styles.sectionTitle}>Amenities & Features</Text>
            </View>
            {!isEditing && (
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons name="pencil" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>School Amenities</Text>
          {allFeatures.map((feature) => (
            <View key={feature} style={styles.checkboxRow}>
              <Checkbox
                value={editedFeatures.includes(feature)}
                onValueChange={(value) => handleFeatureChange(feature, value)}
                disabled={!isEditing}
                color={editedFeatures.includes(feature) ? Colors.secondary : Colors.secondary}
              />
              <Text style={styles.checkboxLabel}>{feature}</Text>
            </View>
          ))}
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  heading: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  main: {
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  card: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  categoriesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    margin: 5
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: Colors.gray,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default SchoolFeaturesDisplay;