import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Colors } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { MyTextInput, MyTextArea, Button } from "../../components";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from 'react-native-dropdown-picker';

const PostJobScreen = () => {
    const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost: '',
    location: '',
    day: '',
    time: '',
    urgency: '',
  });

  const [loading, setLoading] = useState(false);
  
  // Dropdown states
  const [dayOpen, setDayOpen] = useState(false);
  const [dayValue, setDayValue] = useState(null);
  const [dayItems, setDayItems] = useState([
    {label: 'Today', value: 'Today'},
    {label: 'Tomorrow', value: 'Tomorrow'},
    {label: 'This Week', value: 'This Week'},
    {label: 'Next Week', value: 'Next Week'},
    {label: 'Weekend', value: 'Weekend'},
    {label: 'Flexible', value: 'Flexible'},
  ]);

  const [timeOpen, setTimeOpen] = useState(false);
  const [timeValue, setTimeValue] = useState(null);
  const [timeItems, setTimeItems] = useState([
    {label: '9:00 AM', value: '9:00 AM'},
    {label: '10:00 AM', value: '10:00 AM'},
    {label: '11:00 AM', value: '11:00 AM'},
    {label: '12:00 PM', value: '12:00 PM'},
    {label: '1:00 PM', value: '1:00 PM'},
    {label: '2:00 PM', value: '2:00 PM'},
    {label: '3:00 PM', value: '3:00 PM'},
    {label: '4:00 PM', value: '4:00 PM'},
    {label: '5:00 PM', value: '5:00 PM'},
    {label: '6:00 PM', value: '6:00 PM'},
    {label: '7:00 PM', value: '7:00 PM'},
    {label: 'Flexible', value: 'Flexible'},
  ]);

  const [urgencyOpen, setUrgencyOpen] = useState(false);
  const [urgencyValue, setUrgencyValue] = useState(null);
  const [urgencyItems, setUrgencyItems] = useState([
    {label: 'Urgent', value: 'Urgent'},
    {label: 'High Priority', value: 'High Priority'},
    {label: 'Normal', value: 'Normal'},
    {label: 'Flexible', value: 'Flexible'},
    {label: 'Ongoing', value: 'Ongoing'},
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a job title');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a job description');
      return;
    }
    if (!formData.cost.trim()) {
      Alert.alert('Error', 'Please enter the cost/budget');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter the location');
      return;
    }
    if (!dayValue) {
      Alert.alert('Error', 'Please select when you need this job done');
      return;
    }
    if (!timeValue) {
      Alert.alert('Error', 'Please select a preferred time');
      return;
    }
    if (!urgencyValue) {
      Alert.alert('Error', 'Please select the urgency level');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!', 
        'Your job has been posted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                title: '',
                description: '',
                cost: '',
                location: '',
                day: '',
                time: '',
                urgency: '',
              });
              // Reset dropdown values
              setDayValue(null);
              setTimeValue(null);
              setUrgencyValue(null);
              // Navigate back
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
    <SafeAreaView edges={['top','bottom','left','right']} style={{flex:1}}>
    <TouchableOpacity style={styles.backBtn} onPress={() => (navigation as any).goBack()}>
        <AntDesign
              name="arrow-left"
              size={24}
              style={{
                marginRight: 10,
                marginTop: 2,
              }}
              color={Colors.black}
            />
        </TouchableOpacity>
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Post a New Job</Text>
        <Text style={styles.headerSubtitle}>Fill in the details to post your job</Text>
      </View>

      {/* Form */}
      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Job Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title *</Text>
          <MyTextInput
            placeholder="e.g., Need House Cleaner"
            value={formData.title}
            onChange={(value: string) => handleInputChange('title', value)}
            containerStyle={styles.input}
            leftIcon={<Ionicons name="briefcase-outline" size={20} color="#9AA0A6" />}
          />
        </View>

        {/* Job Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Description *</Text>
          <MyTextArea
            placeholder="Describe the job requirements, what you need done, and any specific details..."
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            containerStyle={styles.textArea}
            numberOfLines={6}
          />
        </View>

        {/* Cost/Budget */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cost/Budget *</Text>
          <MyTextInput
            placeholder="e.g., $50/day, $25/hour, $200/project"
            value={formData.cost}
            onChange={(value: string) => handleInputChange('cost', value)}
            containerStyle={styles.input}
            leftIcon={<Ionicons name="cash-outline" size={20} color="#9AA0A6" />}
          />
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <MyTextInput
            placeholder="e.g., Downtown, NYC"
            value={formData.location}
            onChange={(value: string) => handleInputChange('location', value)}
            containerStyle={styles.input}
            leftIcon={<Ionicons name="location-outline" size={20} color="#9AA0A6" />}
          />
        </View>

        {/* Job Timing */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Timing *</Text>
          
          {/* Day Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>When do you need this done?</Text>
            <DropDownPicker
              open={dayOpen}
              value={dayValue}
              items={dayItems}
              setOpen={setDayOpen}
              setValue={setDayValue}
              setItems={setDayItems}
              placeholder="Select day..."
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              textStyle={styles.dropdownText}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          {/* Time Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Preferred time?</Text>
            <DropDownPicker
              open={timeOpen}
              value={timeValue}
              items={timeItems}
              setOpen={setTimeOpen}
              setValue={setTimeValue}
              setItems={setTimeItems}
              placeholder="Select time..."
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              textStyle={styles.dropdownText}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>

          {/* Urgency Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>How urgent is this job?</Text>
            <DropDownPicker
              open={urgencyOpen}
              value={urgencyValue}
              items={urgencyItems}
              setOpen={setUrgencyOpen}
              setValue={setUrgencyValue}
              setItems={setUrgencyItems}
              placeholder="Select urgency..."
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              textStyle={styles.dropdownText}
              zIndex={1000}
              zIndexInverse={3000}
            />
          </View>
        </View>

        {/* Additional Info */}
        {/* <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoTitle}>Important Information</Text>
          </View>
          <Text style={styles.infoText}>
            • Your job will be visible to potential workers in your area{'\n'}
            • You can edit or delete your job anytime from "My Jobs"{'\n'}
            • Respond to applicants promptly for better results{'\n'}
            • Be specific about requirements to attract the right candidates
          </Text>
        </View> */}

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            label={loading ? "Posting..." : "Post Job"}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PostJobScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backBtn: { marginLeft:15 },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
  },
  helpText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 6,
    fontStyle: 'italic',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 50,
  },
  dropdownContainer: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
    borderWidth: 1,
    borderRadius: 12,
  },
  placeholder: {
    color: '#9AA0A6',
    fontSize: 16,
  },
  dropdownText: {
    color: Colors.black,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
  },
  bottomSpacing: {
    height: 50,
  },
});
