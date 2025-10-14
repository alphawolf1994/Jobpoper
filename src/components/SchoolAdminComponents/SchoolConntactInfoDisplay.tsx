import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../utils';
import { AntDesign, Ionicons } from '@expo/vector-icons';

type SchoolInfo = {
  contactName: string;
  email: string;
  phonePrimary: string;
  phoneAlternative: string;
};

type SchoolContactInfoDisplayProps = {
  school: SchoolInfo;
  onSave: (updatedContactInfo: SchoolInfo) => void;
};

const SchoolContactInfoDisplay: React.FC<SchoolContactInfoDisplayProps> = ({ school, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContactInfo, setEditedContactInfo] = useState<SchoolInfo>({ ...school });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedContactInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContactInfo({ ...school });
    setIsEditing(false);
  };

  const handleChange = (field: keyof SchoolInfo, value: string) => {
    setEditedContactInfo(prev => ({
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
              <AntDesign name="contacts" size={20} color={Colors.black} style={styles.icon} />
              <Text style={styles.sectionTitle}>Contact Information</Text>
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
            label="Contact Name" 
            value={editedContactInfo.contactName} 
            editable={isEditing} 
            onChange={(value) => handleChange('contactName', value)} 
          />
          <InfoRow 
            label="Email Id" 
            value={editedContactInfo.email} 
            editable={isEditing} 
            onChange={(value) => handleChange('email', value)}
            keyboardType="email-address"
          />
          <InfoRow 
            label="Phone Number (Primary)" 
            value={editedContactInfo.phonePrimary} 
            editable={isEditing} 
            onChange={(value) => handleChange('phonePrimary', value)}
            keyboardType="phone-pad"
          />
          <InfoRow 
            label="Phone Number (Alternative)" 
            value={editedContactInfo.phoneAlternative} 
            editable={isEditing} 
            onChange={(value) => handleChange('phoneAlternative', value)}
            keyboardType="phone-pad"
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
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';
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

export default SchoolContactInfoDisplay;