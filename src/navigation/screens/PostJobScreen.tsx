import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, FlatList } from "react-native";
import { Colors } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { MyTextInput, MyTextArea, Button } from "../../components";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useDispatch, useSelector } from 'react-redux';
import { createJob, updateJob } from '../../redux/slices/jobSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { SavedLocation, clearLastAddedLocation } from '../../redux/slices/locationsSlice';
import { fetchLocations } from '../../redux/slices/locationsSlice';
import { useAlertModal } from "../../hooks/useAlertModal";
import { Job, SavedLocationData } from '../../interface/interfaces';
import { IMAGE_BASE_URL } from '../../api/baseURL';

const PostJobScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.job);
  const { items: savedLocations, loading: locationsLoading, lastAddedLocation } = useSelector((state: RootState) => state.locations);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  // Check if in edit mode
  const isEditMode = (route.params as any)?.isEditMode ?? false;
  const jobDataToEdit: Job | null = (route.params as any)?.jobData ?? null;

  const showErrorAlert = (message: string) =>
    showAlert({
      title: "Error",
      message,
      type: "error",
    });

  const showWarningAlert = (title: string, message: string) =>
    showAlert({
      title,
      message,
      type: "warning",
    });

  const showSuccessAlert = (message: string, onConfirm?: () => void) =>
    showAlert({
      title: "Success!",
      message,
      type: "success",
      buttons: [
        {
          label: "OK",
          onPress: onConfirm,
        },
      ],
    });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost: '',
    location: '',
    day: '',
    time: '',
    urgency: '',
  });

  // Job type state
  const [jobType, setJobType] = useState<'OnSite' | 'Pickup'>('OnSite');

  // Response preference state
  const [responsePreference, setResponsePreference] = useState<'direct_contact' | 'show_interest'>('direct_contact');

  // Selected locations for different types
  const [selectedOnSiteLocation, setSelectedOnSiteLocation] = useState<SavedLocation | null>(null);
  const [selectedPickupSource, setSelectedPickupSource] = useState<SavedLocation | null>(null);
  const [selectedPickupDestination, setSelectedPickupDestination] = useState<SavedLocation | null>(null);

  // Location modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationModalType, setLocationModalType] = useState<'onSite' | 'pickupSource' | 'pickupDestination'>('onSite');

  // Date & Time pickers state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);

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

  // Fetch locations on mount and when screen is focused (in case user added a new location)
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchLocations());

      // Check if a new location was added via Redux state
      if (lastAddedLocation) {
        if (locationModalType === 'onSite') {
          setSelectedOnSiteLocation(lastAddedLocation);
        } else if (locationModalType === 'pickupSource') {
          setSelectedPickupSource(lastAddedLocation);
        } else if (locationModalType === 'pickupDestination') {
          setSelectedPickupDestination(lastAddedLocation);
        }
        // Clear the last added location so it doesn't trigger again
        dispatch(clearLastAddedLocation());
      }
    }, [dispatch, lastAddedLocation, locationModalType])
  );

  // Initialize form with job data when in edit mode
  React.useEffect(() => {
    if (isEditMode && jobDataToEdit) {
      // Set form data
      setFormData({
        title: jobDataToEdit.title || '',
        description: jobDataToEdit.description || '',
        cost: jobDataToEdit.cost || '',
        location: '',
        day: jobDataToEdit.formattedScheduledDate || new Date(jobDataToEdit.scheduledDate).toLocaleDateString(),
        time: jobDataToEdit.scheduledTime || '',
        urgency: jobDataToEdit.urgency || '',
      });

      // Set job type
      if (jobDataToEdit.jobType) {
        setJobType(jobDataToEdit.jobType);
      }

      // Set response preference
      if (jobDataToEdit.responsePreference) {
        setResponsePreference(jobDataToEdit.responsePreference);
      }

      // Set urgency
      if (jobDataToEdit.urgency) {
        setUrgencyValue(jobDataToEdit.urgency);
      }

      // Set scheduled date and time
      const dateString = jobDataToEdit.scheduledDate;
      if (dateString) {
        const date = new Date(dateString);
        setSelectedDate(date);
        setTempDate(date);
      }

      if (jobDataToEdit.scheduledTime) {
        const timeStr = jobDataToEdit.scheduledTime;
        // Parse time string (format: HH:MM AM/PM)
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }

        const timeDate = new Date();
        timeDate.setHours(hours, minutes, 0, 0);
        setSelectedTime(timeDate);
        setTempTime(timeDate);
      }

      // Set locations based on job type
      if (jobDataToEdit.jobType === 'Pickup' && typeof jobDataToEdit.location === 'object' && 'source' in jobDataToEdit.location) {
        const pickupLoc = jobDataToEdit.location as { source: SavedLocationData; destination: SavedLocationData };
        if (pickupLoc.source) {
          const sourceLocation: SavedLocation = {
            id: (pickupLoc.source as any)._id || pickupLoc.source.name,
            name: pickupLoc.source.name,
            fullAddress: pickupLoc.source.fullAddress,
            latitude: (pickupLoc.source as any).latitude || 0,
            longitude: (pickupLoc.source as any).longitude || 0,
            addressDetails: pickupLoc.source.addressDetails,
            createdAt: Date.now(),
          };
          setSelectedPickupSource(sourceLocation);
        }
        if (pickupLoc.destination) {
          const destLocation: SavedLocation = {
            id: (pickupLoc.destination as any)._id || pickupLoc.destination.name,
            name: pickupLoc.destination.name,
            fullAddress: pickupLoc.destination.fullAddress,
            latitude: (pickupLoc.destination as any).latitude || 0,
            longitude: (pickupLoc.destination as any).longitude || 0,
            addressDetails: pickupLoc.destination.addressDetails,
            createdAt: Date.now(),
          };
          setSelectedPickupDestination(destLocation);
        }
      } else if (jobDataToEdit.jobType === 'OnSite' && typeof jobDataToEdit.location === 'object' && !('source' in jobDataToEdit.location)) {
        const onSiteLoc = jobDataToEdit.location as SavedLocationData;
        const onSiteLocation: SavedLocation = {
          id: (onSiteLoc as any)._id || onSiteLoc.name,
          name: onSiteLoc.name,
          fullAddress: onSiteLoc.fullAddress,
          latitude: (onSiteLoc as any).latitude || 0,
          longitude: (onSiteLoc as any).longitude || 0,
          addressDetails: onSiteLoc.addressDetails,
          createdAt: Date.now(),
        };
        setSelectedOnSiteLocation(onSiteLocation);
      }

      // Set attachments if any
      if (jobDataToEdit.attachments && jobDataToEdit.attachments.length > 0) {
        setAttachments(jobDataToEdit.attachments);
        setExistingAttachments(jobDataToEdit.attachments);
      }
    }
  }, [isEditMode, jobDataToEdit]);

  const [urgencyOpen, setUrgencyOpen] = useState(false);
  const [urgencyValue, setUrgencyValue] = useState<string | null>(null);
  const [urgencyItems, setUrgencyItems] = useState([
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Normal', value: 'Normal' },
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
    return `${day}-${month}-${year}`;
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
      showWarningAlert('Permission required', 'Please allow photo library access to add attachments.');
      return;
    }

    // Calculate remaining slots for new images
    const remainingSlots = 5 - attachments.length;
    if (remainingSlots <= 0) {
      showAlert({
        title: "Limit reached",
        message: "You can only select up to 5 images.",
        type: "info",
      });
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

  const getAttachmentUri = (uri: string): string => {
    // If it's a local URI (starts with file:// or is a local path from camera/gallery)
    if (uri.startsWith('file://') || uri.startsWith('/data/') || uri.startsWith('/var/')) {
      return uri;
    }
    // If it's already a full URL (http or https)
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return uri;
    }
    // If it's a relative path from the API
    return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
  };

  const isNewAttachment = (uri: string): boolean => {
    // Check if it's a new local file (not in existing attachments)
    return uri.startsWith('file://') || uri.startsWith('/data/') || uri.startsWith('/var/');
  };

  // Location selection handlers
  const openLocationModal = (type: 'onSite' | 'pickupSource' | 'pickupDestination') => {
    setLocationModalType(type);
    setShowLocationModal(true);
  };

  const handleLocationSelect = (location: SavedLocation) => {
    if (locationModalType === 'onSite') {
      setSelectedOnSiteLocation(location);
    } else if (locationModalType === 'pickupSource') {
      setSelectedPickupSource(location);
    } else if (locationModalType === 'pickupDestination') {
      setSelectedPickupDestination(location);
    }
    setShowLocationModal(false);
  };

  const handleAddNewLocation = () => {
    setShowLocationModal(false);
    (navigation as any).navigate("AddLocationScreen");
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.title.trim()) {
      showErrorAlert('Please enter a job title');
      return;
    }
    if (!formData.description.trim()) {
      showErrorAlert('Please enter a job description');
      return;
    }
    if (!formData.cost.trim()) {
      showErrorAlert('Please enter the cost/budget');
      return;
    }
    // Validate locations based on job type
    if (jobType === 'OnSite' && !selectedOnSiteLocation) {
      showErrorAlert('Please select the job location');
      return;
    }
    if (jobType === 'Pickup') {
      if (!selectedPickupSource) {
        showErrorAlert('Please select the pickup source location');
        return;
      }
      if (!selectedPickupDestination) {
        showErrorAlert('Please select the destination location');
        return;
      }
    }
    try {
      // Separate attachments into existing and new
      const newAttachments = attachments.filter(uri => isNewAttachment(uri));
      const keptExistingAttachments = attachments.filter(uri => !isNewAttachment(uri));

      // Prepare jobData for FormData
      const jobData: any = {
        title: formData.title,
        description: formData.description,
        cost: formData.cost,
        jobType,
        urgency: urgencyValue || 'Normal',
        scheduledDate: formatDateForAPI(selectedDate!),
        scheduledTime: formatTime(selectedTime!),
        responsePreference,
        location: jobType === 'OnSite'
          ? selectedOnSiteLocation!
          : {
            source: selectedPickupSource!,
            destination: selectedPickupDestination!,
          },
        attachments: newAttachments,
        existingAttachments: keptExistingAttachments,
      };

      let result;
      if (isEditMode && jobDataToEdit?._id) {
        // Update job
        result = await dispatch(updateJob({ jobId: jobDataToEdit._id, jobData })).unwrap();
      } else {
        // Create job
        result = await dispatch(createJob(jobData)).unwrap();
      }

      if (result.status === 'success') {
        showSuccessAlert(isEditMode ? 'Your job has been updated successfully!' : 'Your job has been posted successfully!', () => {
          setFormData({
            title: '',
            description: '',
            cost: '',
            location: '',
            day: '',
            time: '',
            urgency: '',
          });
          setSelectedDate(null);
          setSelectedTime(null);
          setUrgencyValue(null);
          setJobType('OnSite');
          setSelectedOnSiteLocation(null);
          setSelectedPickupSource(null);
          setSelectedPickupDestination(null);
          setResponsePreference('direct_contact');
          setAttachments([]);
          setExistingAttachments([]);
          navigation.goBack();
        });
      }
    } catch (error: any) {

      const errorMessage = error || error?.message || (isEditMode ? 'Failed to update job. Please try again.' : 'Failed to post job. Please try again.');
      showErrorAlert(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={{ flex: 1 }}>
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
          <Text style={styles.headerTitle}>{isEditMode ? 'Edit Job' : 'Post Jobs Super Fast'}</Text>
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
            <Text style={styles.currencyNote}>
              Payment as per local currency of your location.
            </Text>
          </View>

          {/* Job Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Type *</Text>
            <View style={styles.radioGroupHorizontal}>
              <TouchableOpacity
                style={[styles.radioOptionHorizontal, jobType === 'OnSite' && styles.radioSelected]}
                onPress={() => setJobType('OnSite')}
                activeOpacity={0.7}
              >
                <View style={[styles.radioCircle, jobType === 'OnSite' && styles.radioCircleSelected]}>
                  {jobType === 'OnSite' && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioLabel, jobType === 'OnSite' && styles.radioLabelSelected]}>OnSite</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.radioOptionHorizontal, jobType === 'Pickup' && styles.radioSelected]}
                onPress={() => setJobType('Pickup')}
                activeOpacity={0.7}
              >
                <View style={[styles.radioCircle, jobType === 'Pickup' && styles.radioCircleSelected]}>
                  {jobType === 'Pickup' && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioLabel, jobType === 'Pickup' && styles.radioLabelSelected]}>Pickup</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Input(s) based on job type */}
          <View style={styles.inputGroup}>
            {jobType === 'OnSite' ? (
              <>
                <Text style={styles.label}>Location *</Text>
                <TouchableOpacity
                  onPress={() => openLocationModal('onSite')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.dropdown, styles.inputRow, styles.locationSelectable]}>
                    <View style={{ flex: 1 }}>
                      <Text style={selectedOnSiteLocation ? styles.dropdownText : styles.placeholder}>
                        {selectedOnSiteLocation ? `${selectedOnSiteLocation.name} - ${selectedOnSiteLocation.fullAddress}` : 'Select location...'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color="#9AA0A6" />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>Pickup Location *</Text>
                <TouchableOpacity
                  onPress={() => openLocationModal('pickupSource')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.dropdown, styles.inputRow, styles.locationSelectable]}>
                    <View style={{ flex: 1 }}>
                      <Text style={selectedPickupSource ? styles.dropdownText : styles.placeholder}>
                        {selectedPickupSource ? `${selectedPickupSource.name} - ${selectedPickupSource.fullAddress}` : 'Select pickup location...'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color="#9AA0A6" />
                  </View>
                </TouchableOpacity>

                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>Destination Location *</Text>
                  <TouchableOpacity
                    onPress={() => openLocationModal('pickupDestination')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.dropdown, styles.inputRow, styles.locationSelectable]}>
                      <View style={{ flex: 1 }}>
                        <Text style={selectedPickupDestination ? styles.dropdownText : styles.placeholder}>
                          {selectedPickupDestination ? `${selectedPickupDestination.name} - ${selectedPickupDestination.fullAddress}` : 'Select destination location...'}
                        </Text>
                      </View>
                      <Ionicons name="chevron-down" size={20} color="#9AA0A6" />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Response Preference Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>How should users respond to your job? *</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioOption, responsePreference === 'direct_contact' && styles.radioSelected]}
                onPress={() => setResponsePreference('direct_contact')}
                activeOpacity={0.7}
              >
                <View style={[styles.radioCircle, responsePreference === 'direct_contact' && styles.radioCircleSelected]}>
                  {responsePreference === 'direct_contact' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.radioLabelContainer}>
                  <Text style={[styles.radioLabel, responsePreference === 'direct_contact' && styles.radioLabelSelected]}>
                    Direct Contact
                  </Text>
                  <Text style={styles.radioDescription}>
                    Users can contact you directly for this job
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.radioOption, responsePreference === 'show_interest' && styles.radioSelected]}
                onPress={() => setResponsePreference('show_interest')}
                activeOpacity={0.7}
              >
                <View style={[styles.radioCircle, responsePreference === 'show_interest' && styles.radioCircleSelected]}>
                  {responsePreference === 'show_interest' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.radioLabelContainer}>
                  <Text style={[styles.radioLabel, responsePreference === 'show_interest' && styles.radioLabelSelected]}>
                    Show Interest
                  </Text>
                  <Text style={styles.radioDescription}>
                    Multiple users can show interest, you choose who to contact
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.helpText}>
              💡 Direct Contact: Users can reach out to you immediately • Show Interest: Review interested users and select the best fit
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
                    <Image
                      source={{ uri: getAttachmentUri(uri) }}
                      style={styles.thumb}
                      contentFit="cover"
                    />
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
              label={loading ? (isEditMode ? "Updating..." : "Posting...") : (isEditMode ? "Save Changes" : "Post Now")}
              onPress={handleSubmit}
              disabled={loading}
              style={styles.submitButton}
            />
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
        {alertModal}
      </SafeAreaView>

      {/* Location Selection Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowLocationModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {locationModalType === 'onSite' && 'Select Location'}
              {locationModalType === 'pickupSource' && 'Select Pickup Location'}
              {locationModalType === 'pickupDestination' && 'Select Destination'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            {savedLocations.length === 0 ? (
              <View style={styles.emptyLocationsContainer}>
                <Ionicons name="location-outline" size={64} color={Colors.lightGray} />
                <Text style={styles.emptyLocationsText}>No saved locations</Text>
                <Text style={styles.emptyLocationsSubtext}>Add your first location to get started</Text>
              </View>
            ) : (
              <FlatList
                data={savedLocations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.locationItem}
                    onPress={() => handleLocationSelect(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.locationItemContent}>
                      <View style={[styles.locationTypeIcon, { backgroundColor: Colors.lightGray }]}>
                        <Ionicons name="location-outline" size={18} color={Colors.primary} />
                      </View>
                      <View style={styles.locationTextContainer}>
                        <Text style={styles.locationItemName}>{item.name}</Text>
                        <Text style={styles.locationItemAddress} numberOfLines={2}>{item.fullAddress}</Text>
                        {item.addressDetails && (
                          <Text style={styles.locationItemDetails} numberOfLines={1}>{item.addressDetails}</Text>
                        )}
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={styles.modalFooter}>
              <Button
                label="Add New Location"
                onPress={handleAddNewLocation}
                icon={<Ionicons name="add" size={20} color={Colors.white} />}
                style={styles.addLocationButton}
                textStyle={{ fontSize: 16 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default PostJobScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backBtn: { marginLeft: 15 },
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
  currencyNote: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 6,
    fontStyle: 'italic',
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
  // Radio button styles
  radioGroup: {
    gap: 12,
  },
  radioGroupHorizontal: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    width: '100%',
  },
  radioOptionHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    flex: 1,
  },
  radioSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#f0f7ff',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  radioLabelSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  radioLabelContainer: {
    flex: 1,
    marginLeft: 8,
  },
  radioDescription: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
    fontWeight: '400',
  },
  locationSelectable: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  modalContent: {
    flex: 1,
  },
  emptyLocationsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyLocationsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyLocationsSubtext: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  locationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTypeIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  locationItemAddress: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 2,
  },
  locationItemDetails: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  addLocationButton: {
    marginTop: 0,
  },
});

