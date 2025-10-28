import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Colors } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { MyTextInput, MyTextArea, Button } from "../../components";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useDispatch, useSelector } from 'react-redux';
import { createJob } from '../../redux/slices/jobSlice';
import { AppDispatch, RootState } from '../../redux/store';

const PostJobScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.job);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost: '',
    location: '',
    day: '',
    time: '',
    urgency: '',
  });

  // Date & Time pickers state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);

  const getTomorrow = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  };

  const getToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const [urgencyOpen, setUrgencyOpen] = useState(false);
  const [urgencyValue, setUrgencyValue] = useState<string | null>(null);
  const [urgencyItems, setUrgencyItems] = useState([
    {label: 'Urgent', value: 'Urgent'},
    {label: 'Normal', value: 'Normal'},
  ]);

  // Handle urgency change
  const handleUrgencyChange = (callback: any) => {
    setUrgencyValue(callback);
    const value = typeof callback === 'function' ? callback(urgencyValue) : callback;
    
    if (value === 'Urgent') {
      // Auto-select today's date for urgent jobs
      const today = getToday();
      setSelectedDate(today);
      handleInputChange('day', formatDate(today));
    } else if (value === 'Normal') {
      // Reset to tomorrow for normal jobs
      const tomorrow = getTomorrow();
      setSelectedDate(tomorrow);
      handleInputChange('day', formatDate(tomorrow));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day} ${month} ${year}`;
  };

  const formatDateForAPI = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handlePickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow photo library access to add attachments.');
      return;
    }
    
    // Calculate remaining slots for new images
    const remainingSlots = 5 - attachments.length;
    if (remainingSlots <= 0) {
      Alert.alert('Limit reached', 'You can only select up to 5 images.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uris = result.assets?.map(a => a.uri).filter(Boolean) as string[];
      // Add new images to existing ones instead of replacing
      setAttachments(prev => [...prev, ...uris]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, idx) => idx !== index));
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
    if (!selectedDate) {
      Alert.alert('Error', 'Please select when you need this job done');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a preferred time');
      return;
    }
    if (!urgencyValue) {
      Alert.alert('Error', 'Please select the urgency level');
      return;
    }

    try {
      // Prepare job data for API
      const jobData = {
        title: formData.title,
        description: formData.description,
        cost: formData.cost,
        location: formData.location,
        urgency: urgencyValue || 'Normal',
        scheduledDate: formatDateForAPI(selectedDate!),
        scheduledTime: formatTime(selectedTime!),
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      // Dispatch the create job action and await the result
      const result = await dispatch(createJob(jobData)).unwrap();
      
      if (result.status === 'success') {
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
                // Reset date/time values
                setSelectedDate(null);
                setSelectedTime(null);
                setUrgencyValue(null);
                // Reset attachments
                setAttachments([]);
                // Navigate back
                navigation.goBack();
              }
            }
          ]
        );
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to post job. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
    <SafeAreaView edges={['top','bottom','left','right']} style={{flex:1}}>
    <View style={styles.headerContainer}>
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
        <Text style={styles.headerTitle}>Post Jobs Super Fast </Text>
        </View>
  
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        {/* <Text style={styles.headerTitle}>Post Jobs Super Fast </Text> */}
        <Text style={styles.headerSubtitle}>Post it in seconds and let nearby helpers pop in to get it done.</Text>
      </View>

      {/* Form */}
      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!showDatePicker && !showTimePicker}
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
            placeholder="Paste Google Maps link or coordinates here"
            value={formData.location}
            onChange={(value: string) => handleInputChange('location', value)}
            containerStyle={styles.input}
            leftIcon={<Ionicons name="location-outline" size={20} color="#9AA0A6" />}
          />
          <Text style={styles.helpText}>
            💡 Tip: Open Google Maps, copy location link/coordinates, and paste here. A map will be displayed when job is published.
          </Text>
        </View>
 {/* Urgency Selection */}
 <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>How urgent is this job?</Text>
            <DropDownPicker
              open={urgencyOpen}
              value={urgencyValue}
              items={urgencyItems}
              setOpen={setUrgencyOpen}
              setValue={handleUrgencyChange}
              setItems={setUrgencyItems}
              placeholder="Select job type..."
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              textStyle={styles.dropdownText}
              zIndex={1000}
              zIndexInverse={3000}
            />
            <Text style={styles.helpText}>
              💡 Urgent: Job needed today (date auto-selected) • Normal: Job can be scheduled for later
            </Text>
          </View>
        {/* Job Timing */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Timing *</Text>
          
          {/* Day Selection (Date Picker) */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>When do you need this done?</Text>
            <TouchableOpacity 
              activeOpacity={urgencyValue === 'Urgent' ? 1 : 0.8} 
              onPress={() => {
                if (urgencyValue === 'Urgent') return; // Disabled for urgent jobs
                const base = selectedDate && selectedDate >= getTomorrow() ? selectedDate : getTomorrow();
                setTempDate(base);
                setShowDatePicker(true);
              }}
            >
              <View style={[
                styles.dropdown, 
                styles.inputRow,
                urgencyValue === 'Urgent' && styles.disabledInput
              ]}>
                <Text style={selectedDate ? styles.dropdownText : styles.placeholder}>
                  {selectedDate ? formatDate(selectedDate) : 'Select date...'}
                </Text>
                <AntDesign name="calendar" size={18} color={urgencyValue === 'Urgent' ? '#d0d0d0' : "#9AA0A6"} />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <View>
                <DateTimePicker
                  mode="date"
                  value={tempDate ?? getTomorrow()}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={getTomorrow()}
                  onChange={(event, date) => {
                    if (Platform.OS === 'android') {
                      setShowDatePicker(false);
                      setTempDate(null);
                      // On Android, check event type to see if user confirmed or cancelled
                      if (event.type === 'set' && date) {
                        const valid = date >= getTomorrow() ? date : getTomorrow();
                        setSelectedDate(valid);
                        handleInputChange('day', formatDate(valid));
                      }
                    } else {
                      // iOS - just update temp date
                      if (date) setTempDate(date);
                    }
                  }}
                />
                {Platform.OS === 'ios' && (
                  <View style={styles.pickerActions}>
                    <TouchableOpacity onPress={() => { setShowDatePicker(false); setTempDate(null); }}>
                      <Text style={styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      if (tempDate) {
                        const valid = tempDate >= getTomorrow() ? tempDate : getTomorrow();
                        setSelectedDate(valid);
                        handleInputChange('day', formatDate(valid));
                      }
                      setShowDatePicker(false);
                    }}>
                      <Text style={[styles.actionText, styles.actionPrimary]}>OK</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            {urgencyValue === 'Urgent' && (
              <Text style={[styles.helpText, { marginTop: 8 }]}>
                📍 Date is locked to today for urgent jobs
              </Text>
            )}
          </View>

          {/* Time Selection (Time Picker) */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Preferred time?</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => { setTempTime(selectedTime ?? new Date()); setShowTimePicker(true); }}>
              <View style={[styles.dropdown, styles.inputRow]}>
                <Text style={selectedTime ? styles.dropdownText : styles.placeholder}>
                  {selectedTime ? formatTime(selectedTime) : 'Select time...'}
                </Text>
                <Ionicons name="time-outline" size={18} color="#9AA0A6" />
              </View>
            </TouchableOpacity>
            {showTimePicker && (
              <View>
                <DateTimePicker
                  mode="time"
                  value={tempTime ?? new Date()}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minuteInterval={1}
                  onChange={(event, date) => {
                    if (Platform.OS === 'android') {
                      setShowTimePicker(false);
                      setTempTime(null);
                      // On Android, check event type to see if user confirmed or cancelled
                      if (event.type === 'set' && date) {
                        setSelectedTime(date);
                        handleInputChange('time', formatTime(date));
                      }
                    } else {
                      // iOS - just update temp time
                      if (date) setTempTime(date);
                    }
                  }}
                />
                {Platform.OS === 'ios' && (
                  <View style={styles.pickerActions}>
                    <TouchableOpacity onPress={() => { setShowTimePicker(false); setTempTime(null); }}>
                      <Text style={styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      if (tempTime) {
                        setSelectedTime(tempTime);
                        handleInputChange('time', formatTime(tempTime));
                      }
                      setShowTimePicker(false);
                    }}>
                      <Text style={[styles.actionText, styles.actionPrimary]}>OK</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
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

        {/* Attachments */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Attachments (add any supporting images if needed)</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={handlePickImages}>
            <View style={[styles.dropdown, styles.inputRow]}>
              <Text style={attachments.length ? styles.dropdownText : styles.placeholder}>
                {attachments.length ? `${attachments.length}/5 selected` : `Select attachments... (0/5)`}
              </Text>
              <Ionicons name="image-outline" size={18} color="#9AA0A6" />
            </View>
          </TouchableOpacity>
          {attachments.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {attachments.map((uri, idx) => (
                <View key={`${uri}-${idx}`} style={styles.thumbWrap}>
                  <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeAttachment(idx)}
                    activeOpacity={0.7}
                  >
                    <AntDesign name="close" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            label={loading ? "Posting..." : "Post Now"}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 50,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingBottom: 4,
  },
  actionText: {
    fontSize: 16,
    color: Colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionPrimary: {
    color: Colors.primary,
    fontWeight: '600',
  },
  thumbWrap: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
