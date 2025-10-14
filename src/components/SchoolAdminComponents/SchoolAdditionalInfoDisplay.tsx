import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../utils';
import { Feather, Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';

const allCategories = [
  "Public School",
  "Private School",
  "International School",
  "Religious School",
  "Day School",
  "Boarding School",
  "Vocational School",
  "Special School",
  "Green School",
  "STEAM School",
];
export const schoolTypeOptions = [
  "Pre-School - Nursery & Kindergarten",
  "Primary School - Standard 1 - 7",
  "Secondary School - Form 1 - 6",
];

export const gradeConstraints: Record<string, string[]> = {
  "Pre-School - Nursery & Kindergarten": ["Pre-School"],
  "Primary School - Standard 1 - 7": [
    "Pre-School",
    "Standard 1",
    "Standard 2",
    "Standard 3",
    "Standard 4",
    "Standard 5",
    "Standard 6",
    "Standard 7",
  ],
  "Secondary School - Form 1 - 6": [
    "Pre-School",
    "Standard 1",
    "Standard 2",
    "Standard 3",
    "Standard 4",
    "Standard 5",
    "Standard 6",
    "Standard 7",
    "Form 1",
    "Form 2",
    "Form 3",
    "Form 4",
    "Form 5",
    "Form 6",
  ],
};

export const genderList = ["Co-Education", "Boys", "Girls"];

type SchoolInfo = {
  schoolType: string;
  startingGrade: string;
  endingGrade: string;
  gender: string;
  language: string;
  avgClassStrength: string;
  minAge: string;
  maxAge: string;
  categories: string[];
};

type SchoolAdditionalInfoDisplayProps = {
  school: SchoolInfo;
  onSave: (updatedInfo: SchoolInfo) => void;
};

const SchoolAdditionalInfoDisplay: React.FC<SchoolAdditionalInfoDisplayProps> = ({ school, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<SchoolInfo>({ ...school });
  const [openSchoolType, setOpenSchoolType] = useState(false);
  const [openStartingGrade, setOpenStartingGrade] = useState(false);
  const [openEndingGrade, setOpenEndingGrade] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo({ ...school });
    setIsEditing(false);
  };

  const handleChange = (field: keyof SchoolInfo, value: string) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category: string, isChecked: boolean) => {
    setEditedInfo(prev => {
      const newCategories = isChecked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category);
      return {
        ...prev,
        categories: newCategories
      };
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.heading}>
          <View style={styles.headingRow}>
            <View style={styles.iconRow}>
              <Feather name="user-check" size={20} color={Colors.black} style={styles.icon} />
              <Text style={styles.sectionTitle}>Additional Information</Text>
            </View>
            {!isEditing && (
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons name="pencil" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {isEditing ?(<View style={styles.card}>
          <View style={styles.row}>
      <Text style={styles.label}>School Type</Text>
      <DropDownPicker
        open={openSchoolType}
        value={editedInfo.schoolType}
        items={schoolTypeOptions.map(type => ({label: type, value: type}))}
        setOpen={setOpenSchoolType}
        setValue={(callback) => {
          const newValue = callback(editedInfo.schoolType);
          setEditedInfo(prev => ({
            ...prev,
            schoolType: newValue,
            startingGrade: '',
            endingGrade: ''
          }));
        }}
        placeholder="Select School Type"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={4000}
        zIndexInverse={1000}
      />
    </View>
     {/* Starting Grade Dropdown */}
     <View style={styles.row}>
      <Text style={styles.label}>Starting Grade</Text>
      <DropDownPicker
        open={openStartingGrade}
        value={editedInfo.startingGrade}
        items={gradeConstraints[editedInfo.schoolType]?.map(grade => ({label: grade, value: grade})) || []}
        setOpen={setOpenStartingGrade}
        setValue={(callback) => {
          const newValue = callback(editedInfo.startingGrade);
          setEditedInfo(prev => ({
            ...prev,
            startingGrade: newValue
          }));
        }}
        placeholder="Select Starting Grade"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3000}
        zIndexInverse={2000}
        disabled={!editedInfo.schoolType}
      />
    </View>
          {/* Ending Grade Dropdown */}
    <View style={styles.row}>
      <Text style={styles.label}>Ending Grade</Text>
      <DropDownPicker
        open={openEndingGrade}
        value={editedInfo.endingGrade}
        items={gradeConstraints[editedInfo.schoolType]?.map(grade => ({label: grade, value: grade})) || []}
        setOpen={setOpenEndingGrade}
        setValue={(callback) => {
          const newValue = callback(editedInfo.endingGrade);
          setEditedInfo(prev => ({
            ...prev,
            endingGrade: newValue
          }));
        }}
        placeholder="Select Ending Grade"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={2000}
        zIndexInverse={3000}
        disabled={!editedInfo.schoolType}
      />
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Gender</Text>
      <DropDownPicker
        open={openGender}
        value={editedInfo.gender}
        items={genderList.map(gender => ({label: gender, value: gender}))}
        setOpen={setOpenGender}
        setValue={(callback) => {
          const newValue = callback(editedInfo.gender);
          setEditedInfo(prev => ({
            ...prev,
            gender: newValue
          }));
        }}
        placeholder="Select Gender"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1000}
        zIndexInverse={4000}
      />
    </View>
    <InfoRow 
            label="Language" 
            value={editedInfo.language} 
            editable={isEditing} 
            onChange={(value) => handleChange('language', value)} 
          />
          <InfoRow 
            label="Average Class Strength" 
            value={editedInfo.avgClassStrength} 
            editable={isEditing} 
            onChange={(value) => handleChange('avgClassStrength', value)}
            keyboardType="numeric"
          />
          <InfoRow 
            label="Minimum Age" 
            value={editedInfo.minAge} 
            editable={isEditing} 
            onChange={(value) => handleChange('minAge', value)}
            keyboardType="numeric"
          />
          <InfoRow 
            label="Maximum Age" 
            value={editedInfo.maxAge} 
            editable={isEditing} 
            onChange={(value) => handleChange('maxAge', value)}
            keyboardType="numeric"
          />
        </View>):(
        <View style={styles.card}>
          <InfoRow 
            label="School Type" 
            value={editedInfo.schoolType} 
            editable={isEditing} 
            onChange={(value) => handleChange('schoolType', value)} 
          />
          <InfoRow 
            label="Starting Grade" 
            value={editedInfo.startingGrade} 
            editable={isEditing} 
            onChange={(value) => handleChange('startingGrade', value)} 
          />
          <InfoRow 
            label="Ending Grade" 
            value={editedInfo.endingGrade} 
            editable={isEditing} 
            onChange={(value) => handleChange('endingGrade', value)} 
          />
          <InfoRow 
            label="Gender" 
            value={editedInfo.gender} 
            editable={isEditing} 
            onChange={(value) => handleChange('gender', value)} 
          />
          <InfoRow 
            label="Language" 
            value={editedInfo.language} 
            editable={isEditing} 
            onChange={(value) => handleChange('language', value)} 
          />
          <InfoRow 
            label="Average Class Strength" 
            value={editedInfo.avgClassStrength} 
            editable={isEditing} 
            onChange={(value) => handleChange('avgClassStrength', value)}
            keyboardType="numeric"
          />
          <InfoRow 
            label="Minimum Age" 
            value={editedInfo.minAge} 
            editable={isEditing} 
            onChange={(value) => handleChange('minAge', value)}
            keyboardType="numeric"
          />
          <InfoRow 
            label="Maximum Age" 
            value={editedInfo.maxAge} 
            editable={isEditing} 
            onChange={(value) => handleChange('maxAge', value)}
            keyboardType="numeric"
          />
        </View>)}

        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>School Categories</Text>
          {allCategories.map((category) => (
            <View key={category} style={styles.checkboxRow}>
              <Checkbox
                value={editedInfo.categories.includes(category)}
                onValueChange={(value) => handleCategoryChange(category, value)}
                disabled={!isEditing}
                color={editedInfo.categories.includes(category) ? Colors.secondary : Colors.secondary}
              />
              <Text style={styles.checkboxLabel}>{category}</Text>
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

type InfoRowProps = {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value, editable = false, onChange, keyboardType = 'default' }) => {
  if (editable) {
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
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
  dropdown: {
    borderWidth: 0.5,
    borderColor: Colors.gray,
    borderRadius: 6,
    minHeight: 42,
    backgroundColor: Colors.white,
  },
  dropdownContainer: {
    borderWidth: 0.5,
    borderColor: Colors.gray,
    borderRadius: 6,
    marginTop: 2,
  },
});

export default SchoolAdditionalInfoDisplay;