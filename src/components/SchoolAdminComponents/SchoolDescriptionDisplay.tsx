import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../utils';
import { Ionicons } from '@expo/vector-icons';

type SchoolDescription = {
  description: string;
};

type SchoolDescriptionDisplayProps = {
  school: SchoolDescription;
  onSave: (updatedDescription: SchoolDescription) => void;
};

const SchoolDescriptionDisplay: React.FC<SchoolDescriptionDisplayProps> = ({ school, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(school.description);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave({ description: editedDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(school.description);
    setIsEditing(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.heading}>
          <View style={styles.headingRow}>
            <View style={styles.iconRow}>
              <Ionicons name="document-text-outline" size={20} color={Colors.black} style={styles.icon} />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            {!isEditing && (
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons name="pencil" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.card}>
          {isEditing ? (
            <>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[ styles.textArea]}
                multiline
                numberOfLines={4}
                value={editedDescription}
                onChangeText={setEditedDescription}
                editable={isEditing}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.row}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.value}>{school.description}</Text>
            </View>
          )}
        </View>
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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

export default SchoolDescriptionDisplay;