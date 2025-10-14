import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../../utils';
import { Ionicons } from '@expo/vector-icons';
import { Teacher } from '../../../interface/interfaces';

type TeacherBasicInfoDisplayProps = {
  teacher: Teacher;
  onSave: (updatedTeacher: Teacher) => void;
};

const SchoolFinanceBasicInfoDisplay: React.FC<TeacherBasicInfoDisplayProps> = ({ teacher, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState<Teacher>({ ...teacher });

  // Edit mode handlers
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedTeacher({ ...teacher });
    setIsEditing(false);
  };
  const handleSave = () => {
    onSave(editedTeacher);
    setIsEditing(false);
  };

  // Separate handlers for each field with proper typing
  const handleNameChange = (name: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        name
      }
    }));
  };

  const handleEmailChange = (email: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        email
      }
    }));
  };

  const handlePhoneChange = (phoneNumber: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        phoneNumber
      }
    }));
  };

  const handleAddressChange = (address: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        address
      }
    }));
  };

  const handleGenderChange = (gender: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      gender
    }));
  };

  const handleDateOfJoiningChange = (dateOfJoining: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      dateOfJoining
    }));
  };

  const handleFatherNameChange = (fatherName: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      fatherName
    }));
  };

  const handleMotherNameChange = (motherName: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      motherName
    }));
  };

  const handleMaritalStatusChange = (maritalStatus: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      maritalStatus
    }));
  };

  const handleQualificationChange = (qualification: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      qualification
    }));
  };

  const handleWorkExperienceChange = (workExperience: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      workExperience
    }));
  };

  const handleContractTypeChange = (contractType: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      contractType
    }));
  };

  const handleWorkShiftChange = (workShift: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      workShift
    }));
  };

  const handleBasicSalaryChange = (basicSalary: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      basicSalary: Number(basicSalary) || 0
    }));
  };

  const handleIdNumberChange = (idNumber: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      idNumber
    }));
  };

  const handleNotesChange = (notes: string) => {
    setEditedTeacher(prev => ({
      ...prev,
      notes
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.heading}>
          <View style={styles.headingRow}>
            <View style={styles.iconRow}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.black} style={styles.icon} />
              <Text style={styles.sectionTitle}>Finanace Admin Information</Text>
            </View>
            {!isEditing && (
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons name="pencil" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.card}>
          {/* Basic Information Section */}
          <Text style={styles.sectionHeader}>Basic Information</Text>
          <InfoRow 
            label="Full Name" 
            value={editedTeacher.user?.name || ''} 
            editable={isEditing} 
            onChange={handleNameChange} 
          />
          <InfoRow 
            label="Email" 
            value={editedTeacher.user?.email || ''} 
            editable={false} 
            onChange={handleEmailChange} 
          />
          <InfoRow 
            label="Phone" 
            value={editedTeacher.user?.phoneNumber || ''} 
            editable={isEditing} 
            onChange={handlePhoneChange} 
          />
          <InfoRow 
            label="Gender" 
            value={editedTeacher.gender || ''} 
            editable={isEditing} 
            onChange={handleGenderChange} 
          />
          <InfoRow 
            label="Date of Joining" 
            value={editedTeacher.dateOfJoining || ''} 
            editable={false} 
            onChange={handleDateOfJoiningChange} 
          />

          {/* Personal Details Section */}
          <Text style={styles.sectionHeader}>Personal Details</Text>
          <InfoRow 
            label="Father's Name" 
            value={editedTeacher.fatherName || ''} 
            editable={isEditing} 
            onChange={handleFatherNameChange} 
          />
          <InfoRow 
            label="Mother's Name" 
            value={editedTeacher.motherName || ''} 
            editable={isEditing} 
            onChange={handleMotherNameChange} 
          />
          <InfoRow 
            label="Marital Status" 
            value={editedTeacher.maritalStatus || ''} 
            editable={isEditing} 
            onChange={handleMaritalStatusChange} 
          />

          {/* Professional Details Section */}
          <Text style={styles.sectionHeader}>Professional Details</Text>
          <InfoRow 
            label="Qualification" 
            value={editedTeacher.qualification || ''} 
            editable={isEditing} 
            onChange={handleQualificationChange} 
          />
          <InfoRow 
            label="Work Experience" 
            value={editedTeacher.workExperience || ''} 
            editable={isEditing} 
            onChange={handleWorkExperienceChange} 
          />
          <InfoRow 
            label="Contract Type" 
            value={editedTeacher.contractType || ''} 
            editable={false} 
            onChange={handleContractTypeChange} 
          />
          <InfoRow 
            label="Work Shift" 
            value={editedTeacher.workShift || ''} 
            editable={false} 
            onChange={handleWorkShiftChange} 
          />
          <InfoRow 
            label="Basic Salary" 
            value={editedTeacher.basicSalary?.toString() || ''} 
            editable={false} 
            onChange={handleBasicSalaryChange} 
          />
          <InfoRow 
            label="ID Number" 
            value={editedTeacher.idNumber || ''} 
            editable={false} 
            onChange={handleIdNumberChange} 
          />

          {/* Address Section */}
          <Text style={styles.sectionHeader}>Address</Text>
          <InfoRow 
            label="Address" 
            value={editedTeacher.user?.address || ''} 
            editable={isEditing} 
            onChange={handleAddressChange} 
            multiline={true}
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
  multiline?: boolean;
  onChange: (value: string) => void;
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value, editable = false, multiline = false, onChange }) => {
  if (editable) {
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
          value={value}
          onChangeText={onChange}
          multiline={multiline}
        />
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, multiline && { height: 'auto', minHeight: 40 }]}>
        {value || 'Not specified'}
      </Text>
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: 5,
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

export default SchoolFinanceBasicInfoDisplay;