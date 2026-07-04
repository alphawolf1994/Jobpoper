import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from "../../utils";
import Header from "../../components/Header";
import { IMAGE_BASE_URL } from "../../api/baseURL";
import MyTextInput from "../../components/MyTextInput";
import MyTextArea from "../../components/MyTextArea";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import ImagePath from "../../assets/images/ImagePath";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, completeProfile, updateProfessionalProfile } from "../../redux/slices/authSlice";
import { setCurrentLocation, setCurrentLocationCoordinates } from "../../redux/slices/jobSlice";
import { fetchServiceCategories } from "../../redux/slices/serviceCategorySlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { useAlertModal } from "../../hooks/useAlertModal";
import CategoryPickerSheet, { getCategoryVisual } from "../../components/CategoryPickerSheet";
import { ServiceCategory } from "../../interface/interfaces";

const UserDetailsScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);
    const { showAlert, AlertComponent: alertModal } = useAlertModal();

    // Profile data state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState<{
        city: string;
        state: string;
        country: string;
        fullAddress: string;
        latitude?: number;
        longitude?: number;
    }>({
        city: "",
        state: "",
        country: "",
        fullAddress: "",
    });
    // Profile image state
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // Professional profile state
    const isProfessional = user?.isProfessional || false;
    const [selectedCategories, setSelectedCategories] = useState<ServiceCategory[]>([]);
    const [workImages, setWorkImages] = useState<string[]>([]); // mix of local URIs and saved paths
    const [bio, setBio] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [showCategorySheet, setShowCategorySheet] = useState(false);
    const { items: categoryItems } = useSelector((state: RootState) => state.serviceCategories);

    // Load user data on component mount
    useEffect(() => {
        if (user) {
            setFullName(user.profile?.fullName || "");
            setEmail(user.profile?.email || "");
            setPhone(user.phoneNumber || "");

            // Parse location from user profile
            const savedLocation = user.profile?.currentLocation?.fullAddress || user.profile?.location;
            if (savedLocation) {
                const locationParts = savedLocation.split(',');
                setLocation({
                    city: locationParts[0]?.trim() || "",
                    state: locationParts[1]?.trim() || "",
                    country: locationParts[2]?.trim() || "",
                    fullAddress: savedLocation,
                    latitude: user.profile?.currentLocation?.latitude,
                    longitude: user.profile?.currentLocation?.longitude,
                });
            }

            setProfileImage(user.profile?.profileImage || null);

            // Load professional profile data
            if (user.isProfessional && user.professionalProfile) {
                const pp = user.professionalProfile;
                setSelectedCategories((pp.serviceCategories as ServiceCategory[]) || []);
                setWorkImages(pp.workImages || []);
                setBio(pp.bio || "");
                setYearsOfExperience(pp.yearsOfExperience != null ? String(pp.yearsOfExperience) : "");
            }
        } else {
            // Fetch current user data if not available
            dispatch(getCurrentUser());
        }
    }, [dispatch, user]);

    // Load categories for professional picker
    useEffect(() => {
        if (isProfessional && (!categoryItems || categoryItems.length === 0)) {
            dispatch(fetchServiceCategories());
        }
    }, [dispatch, isProfessional, categoryItems?.length]);

    // Request permissions for image picker
    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showAlert({
                title: "Permission denied",
                message: "Sorry, we need camera roll permissions to update your profile picture!",
                type: "warning",
            });
            return false;
        }
        return true;
    };

    // Handle image picker
    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Handle profile update (basic + professional if applicable)
    const handleUpdateProfile = async () => {
        if (!fullName.trim() || !email.trim()) {
            showAlert({
                title: "Error",
                message: "Please fill in all required fields.",
                type: "error",
            });
            return;
        }

        if (location.latitude == null || location.longitude == null) {
            showAlert({
                title: "Error",
                message: "Please select a listed location so nearby jobs and notifications can use it.",
                type: "error",
            });
            return;
        }

        if (isProfessional && selectedCategories.length === 0) {
            showAlert({
                title: "Error",
                message: "Please select at least one service category for your professional profile.",
                type: "error",
            });
            return;
        }

        try {
            const profileData = {
                fullName: fullName.trim(),
                email: email.trim(),
                location: location.fullAddress || `${location.city}, ${location.state}, ${location.country}`.trim(),
                latitude: location.latitude,
                longitude: location.longitude,
                profileImage: profileImage || undefined,
            };

            const result = await dispatch(completeProfile(profileData)).unwrap();

            if (result.status === 'success') {
                dispatch(setCurrentLocation(profileData.location));
                if (location.latitude != null && location.longitude != null) {
                    dispatch(setCurrentLocationCoordinates({
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }));
                }

                // Save professional profile too if applicable
                if (isProfessional) {
                    const existingWorkImages = workImages.filter(uri => !uri.startsWith('file:') && !uri.startsWith('/var') && !uri.startsWith('/data') && uri.includes('/'));
                    const newWorkImages = workImages.filter(uri => uri.startsWith('file:') || uri.startsWith('/var') || uri.startsWith('/data'));

                    await dispatch(updateProfessionalProfile({
                        serviceCategories: selectedCategories.map(c => c._id),
                        newWorkImages,
                        existingWorkImages,
                        bio: bio.trim(),
                        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
                    })).unwrap();
                }

                showAlert({
                    title: "Success",
                    message: "Profile updated successfully!",
                    type: "success",
                });
            }
        } catch (error: any) {
            showAlert({
                title: "Error",
                message: error.message || "Profile update failed. Please try again.",
                type: "error",
            });
        }
    };

    // Handle picking work images (up to 10)
    const pickWorkImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showAlert({ title: "Permission denied", message: "Camera roll access needed.", type: "warning" });
            return;
        }
        const remaining = 10 - workImages.length;
        if (remaining <= 0) {
            showAlert({ title: "Limit reached", message: "You can upload a maximum of 10 work images.", type: "warning" });
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: remaining,
            quality: 0.8,
        });
        if (!result.canceled) {
            const uris = result.assets.map(a => a.uri);
            setWorkImages(prev => [...prev, ...uris].slice(0, 10));
        }
    };

    const removeWorkImage = (index: number) => {
        setWorkImages(prev => prev.filter((_, i) => i !== index));
    };


    const resolveImageUri = (uri?: string | null) => {
        if (!uri) return null;
        if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
        return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={{ flex: 1 }}>
                <Header />

                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.headerTitleRow}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color={Colors.black} />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>User Details</Text>
                            <Text style={styles.headerSubtitle}>Update your personal information</Text>
                        </View>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {profileImage ? (
                                <Image source={{ uri: resolveImageUri(profileImage) || "" }} style={styles.avatarImage} />
                            ) : (
                                <Image source={ImagePath.avatarIcon} style={styles.avatarImage} />
                            )}

                            <TouchableOpacity
                                style={styles.cameraButton}
                                onPress={pickImage}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="camera" size={20} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.avatarText}>Tap to change photo</Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formSection}>
                        <MyTextInput
                            label="Full Name *"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={setFullName}
                            firstContainerStyle={{ marginTop: 24 }}
                        />

                        <MyTextInput
                            label="Email *"
                            placeholder="Enter your email"
                            value={email}
                            onChange={setEmail}
                            keyboardType="email-address"
                        />

                        <MyTextInput
                            label="Phone Number"
                            placeholder="Your phone number"
                            value={phone}
                            onChange={setPhone}
                            editable={false}
                        />

                        {/* Location input */}
                        <LocationAutocomplete
                            label="Location"
                            placeholder="Your location"
                            value={location.fullAddress}
                            onLocationSelect={(locationData) => setLocation(locationData)}
                            firstContainerStyle={{ marginTop: 0 }}
                        />

                    </View>

                    {/* ── Professional Profile Section (only if isProfessional) ── */}
                    {isProfessional && (
                        <View style={styles.professionalSection}>
                            <View style={styles.professionalHeader}>
                                <Ionicons name="briefcase-outline" size={20} color={Colors.primary} />
                                <Text style={styles.professionalTitle}>Professional Profile</Text>
                            </View>
                            <Text style={styles.professionalSubtitle}>
                                This info is shown to job owners when you show interest in their jobs.
                            </Text>

                            {/* Category Picker */}
                            <Text style={styles.fieldLabel}>Service Categories * (max 5)</Text>
                            <TouchableOpacity
                                style={styles.categoryPickerBtn}
                                onPress={() => setShowCategorySheet(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.categoryPlaceholder}>
                                    {selectedCategories.length === 0
                                        ? "Select categories you offer..."
                                        : `${selectedCategories.length} categor${selectedCategories.length === 1 ? "y" : "ies"} selected`}
                                </Text>
                                <Ionicons name="chevron-down" size={18} color={Colors.gray} />
                            </TouchableOpacity>

                            {/* Selected category chips with remove button */}
                            {selectedCategories.length > 0 && (
                                <View style={styles.selectedChipsWrap}>
                                    {selectedCategories.map(cat => {
                                        const visual = getCategoryVisual(cat);
                                        return (
                                            <View key={cat._id} style={[styles.selectedChip, { backgroundColor: visual.backgroundColor }]}>
                                                <Ionicons name={visual.icon as any} size={13} color={visual.color} />
                                                <Text style={[styles.selectedChipText, { color: visual.color }]} numberOfLines={1} ellipsizeMode="tail">{cat.name}</Text>
                                                <TouchableOpacity
                                                    onPress={() => setSelectedCategories(prev => prev.filter(c => c._id !== cat._id))}
                                                    hitSlop={8}
                                                >
                                                    <Ionicons name="close-circle" size={16} color={visual.color} />
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}

                            {/* Work Images */}
                            <Text style={styles.fieldLabel}>Work Images (max 10)</Text>
                            <View style={styles.workImagesGrid}>
                                {workImages.map((uri, index) => (
                                    <View key={index} style={styles.workImageWrapper}>
                                        <Image
                                            source={{ uri: resolveImageUri(uri) || uri }}
                                            style={styles.workImageThumb}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageBtn}
                                            onPress={() => removeWorkImage(index)}
                                        >
                                            <Ionicons name="close" size={14} color={Colors.white} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {workImages.length < 10 && (
                                    <TouchableOpacity style={styles.addImageBtn} onPress={pickWorkImages} activeOpacity={0.8}>
                                        <Ionicons name="camera-outline" size={22} color={Colors.primary} />
                                        <Text style={styles.addImageText}>Add</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Bio */}
                            <MyTextArea
                                label="About Me"
                                placeholder="Write a short description about yourself and your skills..."
                                value={bio}
                                onChange={setBio}
                            />

                            {/* Years of Experience */}
                            <MyTextInput
                                label="Years of Experience"
                                placeholder="e.g. 3"
                                value={yearsOfExperience}
                                onChange={setYearsOfExperience}
                                keyboardType="numeric"
                            />

                        </View>
                    )}

                    {/* Single save button for everything */}
                    <Button
                        label={loading ? "Saving..." : "Update Profile"}
                        onPress={handleUpdateProfile}
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? Colors.gray : Colors.primary,
                            borderRadius: 12,
                            marginTop: 24,
                            marginBottom: 32,
                        }}
                    />
                </ScrollView>

                {/* Category picker sheet */}
                {isProfessional && (
                    <CategoryPickerSheet
                        visible={showCategorySheet}
                        categories={categoryItems || []}
                        multiSelect={true}
                        selectedIds={selectedCategories.map(c => c._id)}
                        onSelect={(cat) => {
                            setSelectedCategories(prev => {
                                const exists = prev.find(c => c._id === cat._id);
                                if (exists) return prev.filter(c => c._id !== cat._id);
                                if (prev.length >= 5) return prev;
                                return [...prev, cat];
                            });
                        }}
                        onClose={() => setShowCategorySheet(false)}
                        title="Select Service Categories"
                        subtitle="Select up to 5 categories you offer"
                    />
                )}
                <Loader visible={loading} message="Updating your profile..." />
                {alertModal}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerSection: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerTextContainer: {
        flex: 1,
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
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: Colors.lightGray,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    avatarText: {
        fontSize: 14,
        color: Colors.gray,
        fontWeight: '500',
    },
    formSection: {
        paddingTop: 16,
    },
    inputWrapperRelative: {
        position: 'relative',
    },
    trailingIcon: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
    // Professional section styles
    professionalSection: {
        paddingHorizontal: 16,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGray,
        marginTop: 8,
    },
    professionalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
        marginTop: 16,
    },
    professionalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    professionalSubtitle: {
        fontSize: 13,
        color: Colors.gray,
        marginBottom: 16,
        lineHeight: 18,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: 8,
        marginTop: 16,
    },
    categoryPickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
        minHeight: 50,
    },
    categoryPlaceholder: {
        fontSize: 14,
        color: Colors.gray,
        flex: 1,
    },
    selectedChipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    selectedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
    },
    selectedChipText: {
        fontSize: 13,
        fontWeight: '600',
        maxWidth: 120,
    },
    workImagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    workImageWrapper: {
        position: 'relative',
        width: 80,
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
    },
    workImageThumb: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    removeImageBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addImageBtn: {
        width: 80,
        height: 80,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF',
    },
    addImageText: {
        fontSize: 11,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
});
