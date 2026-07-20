import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Modal,
  Linking,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getJobById } from '../../redux/slices/jobSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Job, SavedLocationData, InterestedUserEntry } from '../../interface/interfaces';
import { Image } from 'expo-image';
import { IMAGE_BASE_URL } from '../../api/baseURL';
import { useAlertModal } from "../../hooks/useAlertModal";
import { formatDateDDMMYYYY, getJobCategoryName } from "../../utils";
import VerificationBottomSheet, { VerificationBottomSheetHandle } from "../../components/VerificationBottomSheet";
import PickupPreferencesBottomSheet, { PickupPreferencesBottomSheetHandle } from "../../components/PickupPreferencesBottomSheet";
import ShowInterestSheet from "../../components/ShowInterestSheet";
import { fetchVerificationStatus } from "../../redux/slices/verificationSlice";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const JobDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'about' | 'interests'>('summary');
  const navigation = useNavigation<any>();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { currentJob, loading, error } = useSelector((state: RootState) => state.job);
  const { user } = useSelector((state: RootState) => state.auth);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  const verificationSheetRef = useRef<VerificationBottomSheetHandle>(null);
  const pickupPrefSheetRef = useRef<PickupPreferencesBottomSheetHandle>(null);

  // Get jobId from route params
  const jobId = (route.params as any)?.jobId;

  // Image modal state for attachment / work-image preview
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageModalUri, setImageModalUri] = useState<string | null>(null);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedInterestIds, setExpandedInterestIds] = useState<Record<string, boolean>>({});

  // Optimistic flag so the Show Interest button flips to "Showed Interest"
  // immediately on success, before the re-fetch resolves.
  const [optimisticInterested, setOptimisticInterested] = useState(false);
  const [optimisticProposedPrice, setOptimisticProposedPrice] = useState<
    number | null | undefined
  >(undefined);
  const [showInterestSheetVisible, setShowInterestSheetVisible] = useState(false);

  // Voice note player state
  const voiceSoundRef = useRef<Audio.Sound | null>(null);
  const [voiceIsPlaying, setVoiceIsPlaying] = useState(false);
  const [voicePositionMs, setVoicePositionMs] = useState(0);
  const [voiceDurationMs, setVoiceDurationMs] = useState(0);
  const [voiceLoaded, setVoiceLoaded] = useState(false);

  useEffect(() => {
    if (jobId) {
      dispatch(getJobById(jobId));
      // Reset optimistic interest flag when navigating to a different job —
      // the backend response is the source of truth for that job.
      setOptimisticInterested(false);
      setOptimisticProposedPrice(undefined);
    }
  }, [dispatch, jobId]);

  // Load voice note audio when job changes
  useEffect(() => {
    let mounted = true;
    const loadVoice = async () => {
      // Unload previous
      if (voiceSoundRef.current) {
        await voiceSoundRef.current.unloadAsync().catch(() => {});
        voiceSoundRef.current = null;
      }
      setVoiceLoaded(false);
      setVoiceIsPlaying(false);
      setVoicePositionMs(0);
      setVoiceDurationMs(0);

      if (!currentJob?.voiceNote) return;
      const uri = `${IMAGE_BASE_URL}${currentJob.voiceNote.startsWith('/') ? currentJob.voiceNote : `/${currentJob.voiceNote}`}`;
      try {
        const { sound, status } = await Audio.Sound.createAsync({ uri });
        if (!mounted) { sound.unloadAsync(); return; }
        voiceSoundRef.current = sound;
        if (status.isLoaded) setVoiceDurationMs(status.durationMillis ?? 0);
        setVoiceLoaded(true);
      } catch (e) {
        // voice note failed to load silently
      }
    };
    loadVoice();
    return () => {
      mounted = false;
      voiceSoundRef.current?.unloadAsync().catch(() => {});
    };
  }, [currentJob?.voiceNote]);

  const toggleVoicePlayback = async () => {
    const sound = voiceSoundRef.current;
    if (!sound || !voiceLoaded) return;
    if (voiceIsPlaying) {
      await sound.pauseAsync();
      setVoiceIsPlaying(false);
    } else {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      await sound.playAsync();
      setVoiceIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setVoicePositionMs(status.positionMillis ?? 0);
        if (status.didJustFinish) {
          setVoiceIsPlaying(false);
          setVoicePositionMs(0);
          sound.setPositionAsync(0);
        }
      });
    }
  };

  const formatVoiceTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.id && !user?.isVerified) {
        dispatch(fetchVerificationStatus());
      }
    }, [dispatch, user?.id, user?.isVerified])
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getJobSeekerDisplayName = (job: Job) => {
    if (job.postedOnBehalf && job.externalContact?.name) {
      return job.externalContact.name;
    }
    return job.postedBy?.profile?.fullName || 'Unknown';
  };

  const isExternalJobSeeker = (job: Job) =>
    !!(job.postedOnBehalf && job.externalContact?.name);

  const formatJobTags = (job: Job) => {
    const tags = [];

    // Add urgency
    if (job.urgency === 'Urgent') {
      tags.push('Urgent');
    } else {
      tags.push('Normal');
    }

    // Add scheduled time
    if (job.scheduledTime) {
      tags.push(job.scheduledTime);
    }

    // Add status
    if (job.status) {
      tags.push(job.status);
    }
    if (job.cost)
      tags.push(job.cost);
    return tags;
  };

  const getLocationDisplay = (job: Job): string => {
    if (!job.location) return 'Location not specified';

    if (job.jobType === 'Pickup') {
      const pickupLocation = job.location as { source: SavedLocationData; destination: SavedLocationData };
      if (pickupLocation.source && pickupLocation.destination) {
        return `${pickupLocation.source.fullAddress} → ${pickupLocation.destination.fullAddress}`;
      }
    } else {
      const onSiteLocation = job.location as SavedLocationData;
      if (onSiteLocation.fullAddress) {
        return onSiteLocation.fullAddress;
      }
    }

    return job.displayAddress || 'Location not specified';
  };

  const handleContact = () => {
    if (!currentJob) return;

    const contactInfo =
      currentJob.contactInfo ||
      (currentJob.postedOnBehalf ? currentJob.externalContact?.phoneNumber : null) ||
      currentJob.postedBy?.phoneNumber;

    if (contactInfo) {
      showAlert({
        title: "Contact",
        message: `Phone: ${contactInfo}`,
        type: "info",
        buttons: [
          {
            label: "Cancel",
            variant: "secondary",
          },
          {
            label: "Call",
            onPress: () => {
              // Format phone number for tel: URL (remove spaces, dashes, etc.)
              const phoneNumber = contactInfo.replace(/[\s\-\(\)]/g, '');
              const telUrl = `tel:${phoneNumber}`;
              
              Linking.openURL(telUrl).catch((err) => {
                showAlert({
                  title: "Error",
                  message: "Could not open phone dialer. Please check if the phone number is valid.",
                  type: "error",
                });
              });
            },
          },
        ],
      });
    } else {
      showAlert({
        title: "Contact",
        message: "Contact information not available",
        type: "error",
      });
    }
  };

  const handleShowInterest = () => {
    if (!currentJob) return;

    // Block unverified users
    if (!user?.isVerified) {
      verificationSheetRef.current?.open();
      return;
    }

    // For pickup jobs, require the user to have set their pickup preferences
    // (specifically `pricePerKm`) before they can show interest. If preferences
    // are missing, open the bottom sheet and bail out — the user must save and
    // then explicitly tap Show Interest again.
    const isPickupJob = currentJob.jobType === 'Pickup';
    const pricePerKm = user?.vehiclePreference?.pricePerKm;
    const hasPickupPrefs =
      !!user?.vehiclePreference?.isSet &&
      pricePerKm !== null &&
      pricePerKm !== undefined;

    if (isPickupJob && !hasPickupPrefs) {
      pickupPrefSheetRef.current?.open();
      return;
    }

    setShowInterestSheetVisible(true);
  };

  const handleInterestSubmitted = (message?: string, proposedPrice?: number | null) => {
    setOptimisticInterested(true);
    setOptimisticProposedPrice(proposedPrice ?? null);
    showAlert({
      title: "Interest Submitted",
      message: message || "Your interest has been sent to the task owner.",
      type: "success",
    });
    if ((route.params as any)?.jobId) {
      dispatch(getJobById((route.params as any).jobId));
    }
  };

  const handleBookmark = () => {
    showAlert({
      title: "Bookmark",
      message: "Task bookmarked successfully!",
      type: "success",
    });
  };

  const handleEditJob = () => {
    if (!currentJob) return;

    navigation.navigate('PostJobScreen', {
      isEditMode: true,
      jobData: currentJob,
    });
  };

  // Open Google Maps with single location
  const openLocationInMaps = (location: SavedLocationData) => {
    const { latitude, longitude, fullAddress } = location;
    
    if (!latitude || !longitude) {
      showAlert({
        title: "Error",
        message: "Location coordinates not available",
        type: "error",
      });
      return;
    }

    // Use Google Maps URL that works on both iOS and Android
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    Linking.openURL(url).catch((err) => {
      showAlert({
        title: "Error",
        message: "Could not open Google Maps. Please make sure Google Maps is installed.",
        type: "error",
      });
    });
  };

  // Open Google Maps with directions (source to destination)
  const openDirectionsInMaps = (source: SavedLocationData, destination: SavedLocationData) => {
    const { latitude: sourceLat, longitude: sourceLng } = source;
    const { latitude: destLat, longitude: destLng } = destination;
    
    if (!sourceLat || !sourceLng || !destLat || !destLng) {
      showAlert({
        title: "Error",
        message: "Location coordinates not available",
        type: "error",
      });
      return;
    }

    // Use Google Maps URL for directions that works on both iOS and Android
    const url = `https://www.google.com/maps/dir/?api=1&origin=${sourceLat},${sourceLng}&destination=${destLat},${destLng}`;
    
    Linking.openURL(url).catch((err) => {
      showAlert({
        title: "Error",
        message: "Could not open Google Maps. Please make sure Google Maps is installed.",
        type: "error",
      });
    });
  };

  // Get current location and open directions to pickup
  const openDirectionsToPickup = async (pickup: SavedLocationData) => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showAlert({
          title: "Permission Denied",
          message: "Location permission is required to get directions from your current location.",
          type: "error",
        });
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude: currentLat, longitude: currentLng } = location.coords;
      const { latitude: pickupLat, longitude: pickupLng } = pickup;

      if (!pickupLat || !pickupLng) {
        showAlert({
          title: "Error",
          message: "Pickup location coordinates not available",
          type: "error",
        });
        return;
      }

      // Open Google Maps with directions from current location to pickup
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLng}&destination=${pickupLat},${pickupLng}`;
      
      Linking.openURL(url).catch((err) => {
        showAlert({
          title: "Error",
          message: "Could not open Google Maps. Please make sure Google Maps is installed.",
          type: "error",
        });
      });
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error.message || "Failed to get your current location",
        type: "error",
      });
    }
  };

  // Try to detect a currency symbol from the job's `cost` string (e.g. "₹500", "$50").
  // Falls back to "₹" — matches the example in the spec.
  // Try to detect a currency symbol from the job's `cost` string (e.g. "₹500", "$50").
  // If the budget is a bare number like "10", do not invent a default currency.
  const getCurrencySymbol = (cost?: string): string => {
    if (!cost) return '';
    const match = cost.trim().match(/^[^\d.,\s]+/);
    return match?.[0] || '';
  };

  // Render-friendly label for the stored vehicleType enum.
  const formatVehicleType = (type?: string | null): string => {
    switch (type) {
      case '2_wheeler':
        return '2 Wheeler';
      case '3_wheeler':
        return '3 Wheeler';
      case '4_wheeler':
        return '4 Wheeler';
      default:
        return '—';
    }
  };

  // Format the estimated price for the current pickup job using the user's
  // saved pricePerKm. Returns null when prerequisites are missing.
  const computeEstimatedPrice = (): { value: number; symbol: string } | null => {
    if (!currentJob || currentJob.jobType !== 'Pickup') return null;
    const distanceKm = currentJob.distanceKm;
    const pricePerKm = user?.vehiclePreference?.pricePerKm;
    if (
      typeof distanceKm !== 'number' ||
      typeof pricePerKm !== 'number' ||
      !user?.vehiclePreference?.isSet
    ) {
      return null;
    }
    return {
      value: Math.round(pricePerKm * distanceKm * 100) / 100,
      symbol: getCurrencySymbol(currentJob.cost),
    };
  };

  const renderLocationSection = () => {
    if (!currentJob || !currentJob.location) return null;

    if (currentJob.jobType === 'Pickup') {
      const pickupLocation = currentJob.location as { source: SavedLocationData; destination: SavedLocationData };
      const hasPickupCoordinates = pickupLocation.source?.latitude && pickupLocation.source?.longitude;
      const hasDestinationCoordinates = pickupLocation.destination?.latitude && pickupLocation.destination?.longitude;
      const hasDistance = typeof currentJob.distanceKm === 'number';
      const estimated = computeEstimatedPrice();
      const hasPickupPrefs =
        !!user?.vehiclePreference?.isSet &&
        user?.vehiclePreference?.pricePerKm !== null &&
        user?.vehiclePreference?.pricePerKm !== undefined;

      return (
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Ionicons name="navigate" size={24} color={Colors.primary} />
              <View style={styles.locationInfo}>
                <View style={styles.pickupLocationRow}>
                  <Ionicons name="location-outline" size={16} color={Colors.primary} />
                  <View style={styles.pickupLocationInfo}>
                    <Text style={styles.locationLabel}>Pickup Location</Text>
                    <Text style={styles.locationText}>{pickupLocation.source?.fullAddress}</Text>
                    {pickupLocation.source?.addressDetails && (
                      <Text style={styles.locationDetails}>{pickupLocation.source.addressDetails}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.arrowDivider}>
                  <Ionicons name="arrow-down" size={20} color={Colors.primary} />
                </View>
                
                <View style={styles.pickupLocationRow}>
                  <Ionicons name="location" size={16} color={Colors.primary} />
                  <View style={styles.pickupLocationInfo}>
                    <Text style={styles.locationLabel}>Destination</Text>
                    <Text style={styles.locationText}>{pickupLocation.destination?.fullAddress}</Text>
                    {pickupLocation.destination?.addressDetails && (
                      <Text style={styles.locationDetails}>{pickupLocation.destination.addressDetails}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Distance + Estimated price (pickup-only) */}
            {(hasDistance || hasPickupPrefs || estimated) && (
              <View style={styles.pickupMetaContainer}>
                {hasDistance && (
                  <View style={styles.pickupMetaRow}>
                    <Ionicons
                      name="speedometer-outline"
                      size={16}
                      color={Colors.primary}
                    />
                    <Text style={styles.pickupMetaLabel}>Distance</Text>
                    <Text style={styles.pickupMetaValue}>
                      {currentJob.distanceKm} km
                    </Text>
                  </View>
                )}

                {estimated ? (
                  <View style={styles.pickupMetaRow}>
                    <Ionicons
                      name="cash-outline"
                      size={16}
                      color={Colors.primary}
                    />
                    <Text style={styles.pickupMetaLabel}>
                      Your estimated price
                    </Text>
                    <Text style={styles.pickupMetaValueStrong}>
                      {estimated.symbol}
                      {estimated.value}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.setPrefsRow}
                    activeOpacity={0.7}
                    onPress={() => pickupPrefSheetRef.current?.open()}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={16}
                      color={Colors.primary}
                    />
                    <Text style={styles.setPrefsText}>
                      Set preferences to see price
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Two direction buttons */}
            <View style={styles.directionsButtonsContainer}>
              {hasPickupCoordinates && (
                <TouchableOpacity
                  style={styles.directionButton}
                  onPress={() => openDirectionsToPickup(pickupLocation.source!)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="navigate-outline" size={18} color={Colors.white} />
                  <Text style={styles.directionButtonText}>To Pickup</Text>
                </TouchableOpacity>
              )}

              {hasPickupCoordinates && hasDestinationCoordinates && (
                <TouchableOpacity
                  style={styles.directionButton}
                  onPress={() => openDirectionsInMaps(pickupLocation.source!, pickupLocation.destination!)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="navigate" size={18} color={Colors.white} />
                  <Text style={styles.directionButtonText}>Pickup to Destination</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    } else {
      const onSiteLocation = currentJob.location as SavedLocationData;
      return (
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity
            style={styles.locationCard}
            onPress={() => openLocationInMaps(onSiteLocation)}
            activeOpacity={0.7}
          >
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>{onSiteLocation.fullAddress}</Text>
                {onSiteLocation.addressDetails && (
                  <Text style={styles.locationDetails}>{onSiteLocation.addressDetails}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const openImageGallery = (images: string[], index: number) => {
    if (!images.length) return;
    setModalImages(images);
    setCurrentImageIndex(index);
    setImageModalUri(images[index] || null);
    setImageModalVisible(true);
  };

  const closeImageGallery = () => {
    setImageModalVisible(false);
    setImageModalUri(null);
    setModalImages([]);
    setCurrentImageIndex(0);
  };

  const toggleInterestExpanded = (entryId: string) => {
    setExpandedInterestIds((prev) => ({
      ...prev,
      [entryId]: !prev[entryId],
    }));
  };

  const renderAttachments = () => {
    if (!currentJob || !currentJob.attachments || currentJob.attachments.length === 0) {
      return null;
    }

    const attachmentUris = currentJob.attachments.map(
      (item) => `${IMAGE_BASE_URL}${item.startsWith("/") ? item : `/${item}`}`
    );

    return (
      <View style={styles.attachmentsSection}>
        <Text style={styles.sectionTitle}>Attachments ({currentJob.attachments.length})</Text>
        <FlatList
          data={attachmentUris}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => openImageGallery(attachmentUris, index)}
              activeOpacity={0.9}
            >
              <View style={styles.attachmentCard}>
                <Image
                  source={{ uri: item }}
                  style={styles.attachmentImage}
                  contentFit="cover"
                />
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>
    );
  };

  const renderSummaryTab = () => {
    if (!currentJob) return null;

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Description</Text>
          <Text style={styles.descriptionText}>{currentJob.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>
              {formatDateDDMMYYYY(currentJob.formattedScheduledDate || currentJob.scheduledDate)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{currentJob.scheduledTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{currentJob.cost}</Text>
          </View>
          {getJobCategoryName(currentJob) && (
            <View style={styles.detailRow}>
              <Ionicons name="pricetag-outline" size={20} color={Colors.primary} />
              <Text
                style={[styles.detailText, { flex: 1 }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getJobCategoryName(currentJob)}
              </Text>
            </View>
          )}
        </View>
        {renderLocationSection()}

        {renderAttachments()}

        {/* Voice Note Player */}
        {currentJob?.voiceNote ? (
          <View style={styles.attachmentsSection}>
            <Text style={styles.sectionTitle}>Voice Note</Text>
            <View style={styles.voiceNoteCard}>
              <View style={styles.voiceNoteHeader}>
                <Ionicons name="mic" size={18} color={Colors.primary} />
                <Text style={styles.voiceNoteLabel}>
                  {formatVoiceTime(voiceDurationMs) !== '00:00' ? formatVoiceTime(voiceDurationMs) : '...'}
                </Text>
              </View>
              <View style={styles.voiceNoteControls}>
                <TouchableOpacity
                  onPress={toggleVoicePlayback}
                  activeOpacity={0.8}
                  style={[styles.voicePlayBtn, !voiceLoaded && { opacity: 0.5 }]}
                  disabled={!voiceLoaded}
                >
                  <Ionicons
                    name={voiceIsPlaying ? 'pause' : 'play'}
                    size={22}
                    color={Colors.white}
                  />
                </TouchableOpacity>
                <View style={styles.voiceProgressBar}>
                  <View
                    style={[
                      styles.voiceProgressFill,
                      {
                        width: voiceDurationMs > 0
                          ? `${(voicePositionMs / voiceDurationMs) * 100}%`
                          : '0%',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.voicePositionText}>
                  {formatVoiceTime(voicePositionMs)}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* {isMyJob && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={handleEditJob}
            >
              <AntDesign name="edit" size={16} color={Colors.white} />
              <Text style={styles.editButtonText}>Edit Task</Text>
            </TouchableOpacity>
          </View>
        )} */}
      </ScrollView>
    );
  };

  const renderAboutTab = () => {
    if (!currentJob) return null;

    const seekerName = getJobSeekerDisplayName(currentJob);
    const externalSeeker = isExternalJobSeeker(currentJob);

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <View style={styles.aboutSection}>
          <View style={styles.posterHeader}>
            <View style={styles.aboutPosterAvatar}>
              <Text style={styles.posterAvatarText}>
                {getInitials(seekerName)}
              </Text>
            </View>
            <View style={styles.posterInfo}>
              <Text style={styles.posterName}>{seekerName}</Text>
              <Text style={styles.posterTitle}>
                {externalSeeker ? 'Task Seeker' : 'Task Poster'}
              </Text>
            </View>
          </View>

          <View style={styles.posterStats}>
            {externalSeeker ? (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Phone</Text>
                  <Text style={styles.statValue}>
                    {currentJob.externalContact?.phoneNumber || currentJob.contactInfo || 'N/A'}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Email</Text>
                  <Text style={styles.statValue}>{currentJob.postedBy?.profile?.email || 'N/A'}</Text>
                </View>
                {currentJob.postedBy?.profile?.location && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Location</Text>
                    <Text style={styles.statValue}>{currentJob.postedBy.profile.location}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading task details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !currentJob) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.gray} />
          <Text style={styles.errorText}>{error || 'Task not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const jobTags = formatJobTags(currentJob);
  const locationDisplay = getLocationDisplay(currentJob);
  const seekerDisplayName = getJobSeekerDisplayName(currentJob);
  const externalSeeker = isExternalJobSeeker(currentJob);
  const isDirectContact = currentJob.responsePreference === 'direct_contact' || !currentJob.responsePreference;
  const isMyJob = !!user && currentJob.postedBy?._id === user.id;
  const interestedUsers: InterestedUserEntry[] = currentJob.interestedUsers || [];
  // When a job has been cancelled there is nothing actionable left for a
  // non-owner viewer — hide the contact / show-interest CTA entirely.
  const isJobCancelled =
    typeof currentJob.status === 'string' &&
    currentJob.status.toLowerCase() === 'cancelled';

  // Has the current user already shown interest in this job?
  // Hydrated from backend on every fetch, plus an optimistic flag for the
  // moment between API success and re-fetch.
  const hasShownInterest =
    optimisticInterested ||
    (!!user?.id &&
      interestedUsers.some((entry) => entry.user?._id === user.id));

  const myInterestEntry =
    !!user?.id
      ? interestedUsers.find((entry) => entry.user?._id === user.id)
      : undefined;
  const myProposedPrice =
    optimisticProposedPrice !== undefined
      ? optimisticProposedPrice
      : myInterestEntry?.proposedPrice != null
        ? myInterestEntry.proposedPrice
        : null;
  const hasCustomProposedPrice =
    optimisticProposedPrice !== undefined
      ? optimisticProposedPrice != null
      : myInterestEntry?.proposedPrice != null;
  const currencySymbol = getCurrencySymbol(currentJob.cost);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Image preview modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImageGallery}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalClose} onPress={closeImageGallery}>
            <Ionicons name="close" size={28} color={Colors.white} />
          </TouchableOpacity>
          
          {/* Image counter */}
          {modalImages.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {modalImages.length}
              </Text>
            </View>
          )}
          
          {modalImages.length > 1 ? (
            <FlatList
              data={modalImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `modal-${item}-${index}`}
              initialScrollIndex={currentImageIndex}
              getItemLayout={(data, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setCurrentImageIndex(index);
                setImageModalUri(modalImages[index] || null);
              }}
              renderItem={({ item }) => (
                <ScrollView
                  style={styles.modalScroll}
                  contentContainerStyle={styles.modalContent}
                  maximumZoomScale={3}
                  minimumZoomScale={1}
                  centerContent
                >
                  <Image
                    source={{ uri: item }}
                    style={styles.modalImage}
                    contentFit="contain"
                  />
                </ScrollView>
              )}
            />
          ) : (
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              maximumZoomScale={3}
              minimumZoomScale={1}
              centerContent
            >
              {imageModalUri && (
                <Image
                  source={{ uri: imageModalUri }}
                  style={styles.modalImage}
                  contentFit="contain"
                />
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
      {/* Header Section with Blue Background */}
      <View style={styles.headerSection}>
        {/* Navigation and Bookmark */}
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <AntDesign name="arrow-left" size={24} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            {isMyJob && (<TouchableOpacity style={styles.actionButton} onPress={handleEditJob}>
              <AntDesign name="edit" size={18} color={Colors.primary} />
            </TouchableOpacity>)}
            {currentJob.urgency === 'Urgent' && <View style={styles.bookmarkButton}>
              <Ionicons name="flame" size={20} color={Colors.red} />
            </View>}
          </View>
        </View>

        {/* Poster Avatar */}
        <View style={styles.logoContainer}>
          <View style={styles.posterAvatar}>
            <Text style={styles.logoText}>
              {getInitials(seekerDisplayName)}
            </Text>
          </View>
        </View>

        {/* Job Info */}
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{currentJob.title}</Text>
          <Text style={styles.companyName}>
            {externalSeeker
              ? `Task seeker: ${seekerDisplayName}`
              : `Posted by ${seekerDisplayName}`}
          </Text>

          {/* <View style={styles.salaryLocationRow}>
            <Text style={styles.salary}>{currentJob.cost}</Text>
            <Text style={styles.location} numberOfLines={1}>{locationDisplay}</Text>
          </View> */}

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {jobTags && jobTags.length > 0 ? (
              jobTags.map((tag, index) => {
                const isLast = index === jobTags.length - 1;
                return (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      isLast && { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
                    ]}
                  >
                    {isLast ? (
                      <>
                        <Ionicons name="cash-outline" size={14} color={Colors.white} style={{ marginRight: 8 }} />
                        <Text style={styles.tagText}>{tag}</Text>
                      </>
                    ) : (
                      <Text style={styles.tagText}>{tag}</Text>
                    )}
                  </View>
                );
              })
            ) : null}
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
            Summary
          </Text>
          {activeTab === 'summary' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'about' && styles.activeTab]}
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
            About
          </Text>
          {activeTab === 'about' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        {isMyJob && !isDirectContact && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'interests' && styles.activeTab]}
            onPress={() => setActiveTab('interests')}
          >
            <Text style={[styles.tabText, activeTab === 'interests' && styles.activeTabText]}>
              Interested ({interestedUsers.length})
            </Text>
            {activeTab === 'interests' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Content */}
      {activeTab === 'summary' && renderSummaryTab()}
      {activeTab === 'about' && renderAboutTab()}
      {activeTab === 'interests' && isMyJob && (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {interestedUsers.length === 0 ? (
            <View style={styles.emptyInterestsContainer}>
              <Ionicons name="people-outline" size={64} color={Colors.gray} />
              <Text style={styles.emptyInterestsText}>No interests yet</Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {interestedUsers.map((entry) => {
                const pref = entry.user.vehiclePreference;
                const hasPrefs =
                  !!pref?.isSet &&
                  pref.pricePerKm !== null &&
                  pref.pricePerKm !== undefined;
                const isPickupJob = currentJob.jobType === 'Pickup';
                const distanceKm = currentJob.distanceKm;
                const symbol = getCurrencySymbol(currentJob.cost);
                const estimatedForEntry =
                  isPickupJob &&
                  hasPrefs &&
                  typeof distanceKm === 'number' &&
                  typeof pref?.pricePerKm === 'number'
                    ? Math.round(pref.pricePerKm * distanceKm * 100) / 100
                    : null;
                const isExpanded = !!expandedInterestIds[entry._id];
                const prof = entry.user.professionalProfile;
                const workImageUris =
                  prof?.workImages?.map(
                    (imgPath) =>
                      `${IMAGE_BASE_URL}${imgPath.startsWith('/') ? imgPath : `/${imgPath}`}`
                  ) || [];

                const handleContactPress = () => {
                  if (entry.user.phoneNumber) {
                    showAlert({
                      title: "Contact",
                      message: `Phone: ${entry.user.phoneNumber}`,
                      type: "info",
                      buttons: [
                        {
                          label: "Cancel",
                          variant: "secondary",
                        },
                        {
                          label: "Call",
                          onPress: () => {
                            if (!entry.user.phoneNumber) return;
                            const phoneNumber = entry.user.phoneNumber.replace(/[\s\-\(\)]/g, '');
                            Linking.openURL(`tel:${phoneNumber}`).catch(() => {
                              showAlert({
                                title: "Error",
                                message: "Could not open phone dialer. Please check if the phone number is valid.",
                                type: "error",
                              });
                            });
                          },
                        },
                      ],
                    });
                  } else {
                    showAlert({
                      title: "Contact",
                      message: "No phone number available",
                      type: "error",
                    });
                  }
                };

                return (
                  <View key={entry._id} style={styles.interestCard}>
                    <TouchableOpacity
                      style={styles.interestTopRow}
                      activeOpacity={0.75}
                      onPress={() => toggleInterestExpanded(entry._id)}
                    >
                      <View style={styles.interestLeft}>
                        <View style={styles.interestAvatar}>
                          {entry.user.profile.profileImage ? (
                            <Image
                              source={{ uri: `${IMAGE_BASE_URL}${entry.user.profile.profileImage.startsWith('/') ? entry.user.profile.profileImage : `/${entry.user.profile.profileImage}`}` }}
                              style={styles.interestAvatarImage}
                              contentFit="cover"
                            />
                          ) : (
                            <Text style={styles.interestAvatarText}>
                              {(entry.user.profile.fullName || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                            </Text>
                          )}
                        </View>
                        <View style={styles.interestInfo}>
                          <Text style={styles.interestName} numberOfLines={1}>
                            {entry.user.profile.fullName}
                          </Text>
                          <Text style={styles.interestEmail}>{entry.user.profile.email}</Text>
                          <Text style={styles.interestNotedAt}>Noted at {new Date(entry.notedAt).toLocaleString()}</Text>
                          {entry.proposedPrice != null ? (
                            <View style={styles.proposedPriceBadge}>
                              <Ionicons name="construct-outline" size={12} color="#065F46" />
                              <Text style={styles.proposedPriceText}>
                                Will do this job for {symbol}{entry.proposedPrice}
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.acceptsPriceBadge}>
                              <Ionicons name="checkmark-circle" size={12} color={Colors.primary} />
                              <Text style={styles.acceptsPriceText}>
                                Happy with your offered price
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={styles.interestChevronBtn}>
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={Colors.gray}
                        />
                      </View>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.interestExpandedBody}>
                        {/* Pickup prefs — only when set */}
                        {hasPrefs && (
                          <View style={styles.prefsPanel}>
                            <View style={styles.prefsHeaderRow}>
                              <Ionicons name="car-outline" size={14} color={Colors.primary} />
                              <Text style={styles.prefsHeaderText}>Pickup Service Preferences</Text>
                            </View>
                            <View style={styles.prefsGrid}>
                              <View style={styles.prefRow}>
                                <Text style={styles.prefLabel}>Vehicle</Text>
                                <Text style={styles.prefValue}>
                                  {formatVehicleType(pref?.vehicleType)}
                                </Text>
                              </View>
                              <View style={styles.prefRow}>
                                <Text style={styles.prefLabel}>Number</Text>
                                <Text style={styles.prefValue}>
                                  {pref?.vehicleNumber || '—'}
                                </Text>
                              </View>
                              <View style={styles.prefRow}>
                                <Text style={styles.prefLabel}>Rate / km</Text>
                                <Text style={styles.prefValue}>
                                  {symbol}{pref?.pricePerKm}
                                </Text>
                              </View>
                              {isPickupJob && (
                                <View style={[styles.prefRow, styles.prefRowHighlight]}>
                                  <Text style={styles.prefLabelHighlight}>Estimated price</Text>
                                  <Text style={styles.prefValueHighlight}>
                                    {estimatedForEntry !== null
                                      ? `${symbol}${estimatedForEntry}`
                                      : '—'}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        )}

                        {/* Experience + work images only */}
                        {entry.user.isProfessional &&
                          prof &&
                          (prof.yearsOfExperience != null || workImageUris.length > 0) && (
                          <View style={styles.professionalPanel}>
                            {prof.yearsOfExperience != null && (
                              <View style={styles.profDetailsRow}>
                                <View style={styles.profBadge}>
                                  <Ionicons name="time-outline" size={12} color="#7C3AED" />
                                  <Text style={styles.profBadgeText}>
                                    {prof.yearsOfExperience} yrs exp
                                  </Text>
                                </View>
                              </View>
                            )}

                            {workImageUris.length > 0 && (
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.workImagesScroll}
                              >
                                {workImageUris.map((uri, idx) => (
                                  <TouchableOpacity
                                    key={idx}
                                    activeOpacity={0.85}
                                    onPress={() => openImageGallery(workImageUris, idx)}
                                  >
                                    <Image
                                      source={{ uri }}
                                      style={styles.workImageThumb}
                                      contentFit="cover"
                                    />
                                  </TouchableOpacity>
                                ))}
                              </ScrollView>
                            )}
                          </View>
                        )}

                        <View style={styles.interestActionRow}>
                          <TouchableOpacity
                            style={styles.interestViewProfileBtn}
                            activeOpacity={0.85}
                            onPress={() => {
                              navigation.navigate('WorkerProfileScreen', {
                                workerId: entry.user._id,
                                workerName: entry.user.profile?.fullName,
                                workerImage: entry.user.profile?.profileImage,
                              });
                            }}
                          >
                            <Ionicons name="person-outline" size={16} color={Colors.primary} />
                            <Text style={styles.interestViewProfileBtnText}>View Profile</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.interestContactBtn}
                            activeOpacity={0.85}
                            onPress={handleContactPress}
                          >
                            <Ionicons name="call-outline" size={16} color={Colors.white} />
                            <Text style={styles.interestContactBtnText}>Contact</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}

      {/* Action Button — hidden when the job has been cancelled */}
      {!isMyJob && !isJobCancelled && (
        <View style={styles.contactButtonContainer}>
          {!isDirectContact && hasShownInterest && (
            <View
              style={[
                styles.myOfferBanner,
                !hasCustomProposedPrice && styles.myOfferBannerAccepted,
              ]}
            >
              <Ionicons
                name={hasCustomProposedPrice ? "pricetag" : "checkmark-circle"}
                size={16}
                color={hasCustomProposedPrice ? "#065F46" : Colors.primary}
              />
              <Text
                style={[
                  styles.myOfferBannerText,
                  !hasCustomProposedPrice && styles.myOfferBannerTextAccepted,
                ]}
              >
                {hasCustomProposedPrice
                  ? `You'll do this job for ${currencySymbol}${myProposedPrice}`
                  : `You accepted the offered price (${currentJob.cost})`}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.contactButton,
              !isDirectContact && hasShownInterest && styles.contactButtonDisabled,
            ]}
            onPress={isDirectContact ? handleContact : handleShowInterest}
            disabled={!isDirectContact && hasShownInterest}
            activeOpacity={!isDirectContact && hasShownInterest ? 1 : 0.7}
          >
            <Text style={styles.contactButtonText}>
              {isDirectContact
                ? 'Contact'
                : hasShownInterest
                ? 'Showed Interest'
                : 'Show Interest'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <VerificationBottomSheet ref={verificationSheetRef} />
      <PickupPreferencesBottomSheet
        ref={pickupPrefSheetRef}
        // Per spec: after saving preferences, do NOT auto-show interest.
        // The user must explicitly tap Show Interest again.
      />
      <ShowInterestSheet
        visible={showInterestSheetVisible}
        job={currentJob}
        onClose={() => setShowInterestSheetVisible(false)}
        onSuccess={handleInterestSubmitted}
      />
      {alertModal}
    </SafeAreaView>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerSection: {
    backgroundColor: Colors.primary,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: 50,
    marginRight: 8,
  },
  backButton: {
    padding: 8,
  },
  bookmarkButton: {
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  posterAvatar: {
    width: 80,
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  jobInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  jobTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 16,
  },
  salaryLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    flex: 1,
  },
  location: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    flex: 1,
    textAlign: 'right',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
  locationSection: {
    marginBottom: 30,
  },
  locationCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  directionsButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  pickupMetaContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  pickupMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickupMetaLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '600',
  },
  pickupMetaValue: {
    fontSize: 14,
    color: '#121826',
    fontWeight: '600',
  },
  pickupMetaValueStrong: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '800',
  },
  setPrefsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#EAF2FF',
  },
  setPrefsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  directionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pickupLocationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pickupLocationInfo: {
    flex: 1,
    marginLeft: 8,
  },
  arrowDivider: {
    alignItems: 'center',
    marginVertical: 8,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  locationText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
    marginBottom: 4,
  },
  locationDetails: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  attachmentsSection: {
    marginBottom: 24,
  },
  voiceNoteCard: {
    backgroundColor: '#f5f8ff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  voiceNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  voiceNoteLabel: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '500',
  },
  voiceNoteControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voicePlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#dde3f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  voiceProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  voicePositionText: {
    fontSize: 11,
    color: Colors.gray,
    minWidth: 36,
    textAlign: 'right',
  },
  attachmentCard: {
    width: SCREEN_WIDTH * 0.7,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  imageCounter: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  modalScroll: {
    width: SCREEN_WIDTH,
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalImage: {
    width: SCREEN_WIDTH - 32,
    height: (SCREEN_WIDTH - 32) * 1.2,
    resizeMode: 'contain',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 12,
    fontWeight: '500',
  },
  aboutSection: {
    paddingBottom: 20,
  },
  posterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutPosterAvatar: {
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  posterAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  posterTitle: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 2,
  },
  posterStats: {
    // flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  statItem: {
    // alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
  },
  contactButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
    backgroundColor: Colors.white,
  },
  myOfferBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  myOfferBannerAccepted: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  myOfferBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
  myOfferBannerTextAccepted: {
    color: Colors.primary,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  contactButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  // Interests tab styles
  emptyInterestsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyInterestsText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
  },
  interestCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  interestTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  interestLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  interestChevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  interestActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  interestViewProfileBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingVertical: 11,
  },
  interestViewProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  interestContactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 11,
  },
  interestContactBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  prefsPanel: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prefsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  prefsHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  prefsGrid: {
    gap: 6,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  prefRowHighlight: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  prefLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  prefValue: {
    fontSize: 13,
    color: '#121826',
    fontWeight: '600',
  },
  prefLabelHighlight: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
  prefValueHighlight: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '800',
  },
  prefsMissing: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  interestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  interestAvatarText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  interestAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  interestInfo: {
    flex: 1,
  },
  interestName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    flex: 1,
  },
  interestExpandedBody: {
    gap: 10,
    marginTop: 4,
  },
  interestEmail: {
    fontSize: 12,
    color: Colors.gray,
  },
  interestNotedAt: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  proposedPriceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 6,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  proposedPriceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  acceptsPriceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  acceptsPriceText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  contactSmallButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  contactSmallButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginLeft: 8,
  },
  // Professional panel styles
  professionalPanel: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDE9FE',
    backgroundColor: '#FAFAFF',
    borderRadius: 8,
    padding: 10,
  },
  professionalPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  professionalPanelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  profCategoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  profCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  profCategoryChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  profDetailsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  profBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  profBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
  },
  profBio: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 8,
  },
  workImagesScroll: {
    marginTop: 4,
  },
  workImageThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 8,
  },
});
