import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../utils';
import { Ionicons } from '@expo/vector-icons';

type SchoolInfo = {
  fullName: string;
  registrationNumber: string;
  establishmentYear: string;
  website: string;
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  location: string;
};

type SchoolBasicInfoDisplayProps = {
  school: SchoolInfo;
  onSave: (updatedSchool: SchoolInfo) => void;
};

const SchoolBasicInfoDisplay: React.FC<SchoolBasicInfoDisplayProps> = ({ school, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchool, setEditedSchool] = useState<SchoolInfo>({ ...school });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedSchool);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSchool({ ...school });
    setIsEditing(false);
  };

  const handleChange = (field: keyof SchoolInfo, value: string) => {
    setEditedSchool(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.heading}>
          <View style={styles.headingRow}>
            <View style={styles.iconRow}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.black} style={styles.icon} />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>
            {!isEditing && (
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons name="pencil" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <InfoRow 
            label="School Full Name" 
            value={editedSchool.fullName} 
            editable={isEditing} 
            onChange={(value) => handleChange('fullName', value)} 
          />
          <InfoRow 
            label="Registration Number" 
            value={editedSchool.registrationNumber} 
            editable={isEditing} 
            onChange={(value) => handleChange('registrationNumber', value)} 
          />
          <InfoRow 
            label="Establishment Year" 
            value={editedSchool.establishmentYear} 
            editable={isEditing} 
            onChange={(value) => handleChange('establishmentYear', value)} 
          />
          <InfoRow 
            label="School Website URL" 
            value={editedSchool.website} 
            editable={isEditing} 
            onChange={(value) => handleChange('website', value)} 
          />
          <InfoRow 
            label="Street" 
            value={editedSchool.street} 
            editable={isEditing} 
            onChange={(value) => handleChange('street', value)} 
          />
          <InfoRow 
            label="Area" 
            value={editedSchool.area} 
            editable={isEditing} 
            onChange={(value) => handleChange('area', value)} 
          />
          <InfoRow 
            label="City" 
            value={editedSchool.city} 
            editable={isEditing} 
            onChange={(value) => handleChange('city', value)} 
          />
          <InfoRow 
            label="Province/State" 
            value={editedSchool.state} 
            editable={isEditing} 
            onChange={(value) => handleChange('state', value)} 
          />
          <InfoRow 
            label="Country" 
            value={editedSchool.country} 
            editable={isEditing} 
            onChange={(value) => handleChange('country', value)} 
          />
          <InfoRow 
            label="Zip Code" 
            value={editedSchool.zipCode} 
            editable={isEditing} 
            onChange={(value) => handleChange('zipCode', value)} 
          />
          <InfoRow 
            label="Location" 
            value={editedSchool.location} 
            editable={isEditing} 
            onChange={(value) => handleChange('location', value)} 
          />

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
      </View>
    </ScrollView>
  );
};

type InfoRowProps = {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (value: string) => void;
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value, editable = false, onChange }) => {
  if (editable) {
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
        />
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
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
  row: {
    marginBottom: 10,
  },
  label: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  input: {
    fontSize: 16,
    color: Colors.black,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
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

export default SchoolBasicInfoDisplay;