import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../utils';
import { Ionicons } from '@expo/vector-icons';
import { Teacher } from '../../interface/interfaces';

type TeacherBasicInfoDisplayProps = {
  user: any;
  onSave: (updatedTeacher: any) => void;
};

const SubAdminProfileCard: React.FC<TeacherBasicInfoDisplayProps> = ({ user, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState<any>({ ...user });

  // Edit mode handlers
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedTeacher({ ...user });
    setIsEditing(false);
  };
  const handleSave = () => {
    onSave(editedTeacher);
    setIsEditing(false);
  };

  const handleNameChange = (value: string) => {
    setEditedTeacher((prev: any) => ({ ...prev, name: value }));
  };
  const handleEmailChange = (value: string) => {
    setEditedTeacher((prev: any) => ({ ...prev, email: value }));
  };
  const handlePhoneChange = (value: string) => {
    setEditedTeacher((prev: any) => ({ ...prev, phoneNumber: value }));
  };
  const handleAddressChange = (value: string) => {
    setEditedTeacher((prev: any) => ({ ...prev, address: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.heading}>
          <View style={styles.headingRow}>
            <View style={styles.iconRow}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.black} style={styles.icon} />
              <Text style={styles.sectionTitle}>Profile</Text>
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
            value={editedTeacher?.name || ''} 
            editable={isEditing} 
            onChange={handleNameChange} 
          />
          <InfoRow 
            label="Email" 
            value={editedTeacher?.email || ''} 
            editable={false} 
            onChange={handleEmailChange} 
          />
          <InfoRow 
            label="Phone" 
            value={editedTeacher?.phoneNumber || ''} 
            editable={isEditing} 
            onChange={handlePhoneChange} 
          />
         
         


          {/* Address Section */}
          <Text style={styles.sectionHeader}>Address</Text>
          <InfoRow 
            label="Address" 
            value={editedTeacher?.address || ''} 
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

export default SubAdminProfileCard;