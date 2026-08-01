import { axiosInstance } from "./axiosInstance";
import { isFreshLocalVerificationUri } from "../utils/verificationImageUri";

type SendVerificationPurpose = "signup" | "reset-pin";

const getApiErrorMessage = (error: any, fallback: string) => {
    const fromBody = error?.response?.data?.message;
    if (fromBody) return fromBody;
    if (error?.code === "ECONNABORTED") {
        return "The server took too long to respond. Please try again.";
    }
    if (error?.message === "Network Error") {
        return "Network error. Please check your connection and try again.";
    }
    return error?.message || fallback;
};

const mimeFromUri = (uri: string, fallbackName: string) => {
    const inferredName = uri.split("/").pop() || fallbackName;
    const ext = inferredName.split(".").pop()?.toLowerCase();
    const mime =
        ext === "png"
            ? "image/png"
            : ext === "webp"
            ? "image/webp"
            : ext === "heic"
            ? "image/heic"
            : "image/jpeg";
    return { inferredName, mime };
};

// Send Phone Verification Code
export const sendPhoneVerificationApi = async (
    phoneNumber: string,
    purpose?: SendVerificationPurpose
) => {
    try {
        const payload = {
            phoneNumber: phoneNumber,
            ...(purpose ? { purpose } : {}),
            ...(purpose === "reset-pin"
                ? {
                    isResetPin: true,
                    isForgotPin: true,
                    flow: "forgot-pin",
                    type: "forgot-pin",
                }
                : {}),
        };

        const res = await axiosInstance.post("/auth/send-verification", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to send verification code");
    }
};

// Resend Phone Verification Code
export const resendVerificationApi = async (phoneNumber: string) => {
    try {
        const payload = {
            phoneNumber: phoneNumber
        };

        const res = await axiosInstance.post("/auth/resend-verification", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to resend verification code");
    }
};

// Verify Phone Number
export const verifyPhoneApi = async (phoneNumber: string, verificationCode: string) => {
    try {
        const payload = {
            phoneNumber: phoneNumber,
            verificationCode: verificationCode
        };

        const res = await axiosInstance.post("/auth/verify-phone", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Phone verification failed");
    }
};

// Register User
export const registerUserApi = async (phoneNumber: string, pin: string) => {
    try {
        const payload = {
            phoneNumber: phoneNumber,
            pin: pin
        };

        const res = await axiosInstance.post("/auth/register", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

// Login User
export const loginUserApi = async (phoneNumber: string, pin: string) => {
    try {
        const payload = {
            phoneNumber: phoneNumber,
            pin: pin
        };
        console.log("payload =>", payload)
        const res = await axiosInstance.post("/auth/login", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed1");
    }
};

// Complete Profile
export const completeProfileApi = async (profileData: {
    fullName: string;
    email: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    profileImage?: string;
    isProfessional?: boolean;
    referralCode?: string;
}) => {
    try {
        const hasLocalImage =
            !!profileData.profileImage &&
            isFreshLocalVerificationUri(profileData.profileImage);

        // Text-only updates: send JSON like the other working APIs.
        // Multipart + `Content-Type: undefined` is unreliable against the
        // production host and often surfaces as a generic "Profile completion failed".
        if (!hasLocalImage) {
            const res = await axiosInstance.put("/auth/complete-profile", {
                fullName: profileData.fullName,
                email: profileData.email,
                location: profileData.location,
                latitude: profileData.latitude,
                longitude: profileData.longitude,
                isProfessional: profileData.isProfessional,
                ...(profileData.referralCode
                    ? { referralCode: profileData.referralCode }
                    : {}),
            });
            return res.data;
        }

        const formData = new FormData();
        formData.append("fullName", profileData.fullName);
        formData.append("email", profileData.email);
        if (profileData.location) formData.append("location", profileData.location);
        if (profileData.latitude != null) formData.append("latitude", String(profileData.latitude));
        if (profileData.longitude != null) formData.append("longitude", String(profileData.longitude));
        if (profileData.isProfessional !== undefined) {
            formData.append("isProfessional", String(profileData.isProfessional));
        }
        if (profileData.referralCode) {
            formData.append("referralCode", profileData.referralCode);
        }

        const uri = profileData.profileImage!;
        const { inferredName, mime } = mimeFromUri(uri, "profile.jpg");
        formData.append("profileImage", { uri, name: inferredName, type: mime } as unknown as Blob);

        // Same multipart header pattern as job/business uploads (those work in prod).
        const res = await axiosInstance.put("/auth/complete-profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 90000,
        });
        return res.data;
    } catch (error: any) {
        const err = new Error(
            getApiErrorMessage(error, "Profile completion failed")
        ) as Error & { code?: string };
        // Surface the machine-readable code (e.g. REFERRAL_CODE_INVALID) so the
        // Complete Profile screen can render an inline field error.
        err.code = error?.response?.data?.code;
        throw err;
    }
};

// Update Professional Profile
export const updateProfessionalProfileApi = async (data: {
    serviceCategories?: string[];
    newWorkImages?: string[]; // local URIs
    existingWorkImages?: string[]; // already-saved paths
    bio?: string;
    yearsOfExperience?: number | null;
}) => {
    try {
        const newWorkImages = (data.newWorkImages || []).filter((uri) =>
            isFreshLocalVerificationUri(uri)
        );
        const hasNewImages = newWorkImages.length > 0;

        // No new files → JSON (avoids fragile empty multipart requests).
        if (!hasNewImages) {
            const res = await axiosInstance.put("/auth/professional-profile", {
                serviceCategories: data.serviceCategories,
                existingWorkImages: data.existingWorkImages,
                bio: data.bio,
                yearsOfExperience: data.yearsOfExperience,
            });
            return res.data;
        }

        const formData = new FormData();
        if (data.serviceCategories) {
            formData.append("serviceCategories", JSON.stringify(data.serviceCategories));
        }
        if (data.existingWorkImages) {
            formData.append("existingWorkImages", JSON.stringify(data.existingWorkImages));
        }
        if (data.bio !== undefined) formData.append("bio", data.bio);
        if (data.yearsOfExperience != null) {
            formData.append("yearsOfExperience", String(data.yearsOfExperience));
        }

        newWorkImages.forEach((uri) => {
            const { inferredName, mime } = mimeFromUri(uri, "work.jpg");
            formData.append("workImages", { uri, name: inferredName, type: mime } as unknown as Blob);
        });

        const res = await axiosInstance.put("/auth/professional-profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 90000,
        });
        return res.data;
    } catch (error: any) {
        throw new Error(getApiErrorMessage(error, "Failed to update professional profile"));
    }
};

export const updateCurrentLocationApi = async (locationData: {
    fullAddress: string;
    latitude: number;
    longitude: number;
}) => {
    try {
        const res = await axiosInstance.put("/auth/current-location", locationData);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update current location");
    }
};

export const getVerificationStatusApi = async () => {
    try {
        const res = await axiosInstance.get("/auth/verification-status");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch verification status");
    }
};

export const submitVerificationDocumentsApi = async (verificationData: {
    selfieUri: string;
    photoIdUri: string;
}) => {
    try {
        const { compressVerificationImage } = await import(
            "../utils/compressVerificationImage"
        );

        // Compress both images before upload so slow networks / HEIC don't hang submit.
        const [selfieFile, photoIdFile] = await Promise.all([
            compressVerificationImage(verificationData.selfieUri, "selfie"),
            compressVerificationImage(verificationData.photoIdUri, "photo-id"),
        ]);

        const formData = new FormData();

        formData.append("selfie", {
            uri: selfieFile.uri,
            name: selfieFile.name,
            type: selfieFile.type,
        } as unknown as Blob);

        formData.append("photoId", {
            uri: photoIdFile.uri,
            name: photoIdFile.name,
            type: photoIdFile.type,
        } as unknown as Blob);

        // Same multipart header pattern as job uploads (works against production).
        const res = await axiosInstance.put("/auth/verification-documents", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 90000,
        });

        return res.data;
    } catch (error: any) {
        throw new Error(getApiErrorMessage(error, "Failed to submit verification documents"));
    }
};

// Get Current User
export const getCurrentUserApi = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch user data");
    }
};

// Logout User (if needed for token invalidation)
export const logoutUserApi = async () => {
    return { status: "success", message: "Logged out successfully" };
};

// Check Phone Number
export const checkPhoneApi = async (phoneNumber: string) => {
    try {
        const payload = {
            phoneNumber: phoneNumber
        };

        const res = await axiosInstance.post("/auth/check-phone", payload);
        return res.data;
    } catch (error: any) {
        if (error.code === "ECONNABORTED") {
            throw new Error("The server took too long to respond. Please check your connection and try again.");
        }

        if (!error.response && error.message) {
            throw new Error(error.message);
        }

        throw new Error(error.response?.data?.message || "Failed to check phone number");
    }
};

// Change PIN
export const changePinApi = async (newPin: string) => {
    try {
        const payload = {
            newPin: newPin
        };

        const res = await axiosInstance.put("/auth/change-pin", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to change PIN");
    }
};

// Delete Account
export const deleteAccountApi = async () => {
    try {
        const res = await axiosInstance.delete("/auth/delete-account");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to delete account");
    }
};

// Get Vehicle Preference (Pickup/Delivery service preference)
export const getVehiclePreferenceApi = async () => {
    try {
        const res = await axiosInstance.get("/auth/vehicle-preference");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch vehicle preference");
    }
};

// Update / Create Vehicle Preference (Pickup/Delivery service preference)
export const updateVehiclePreferenceApi = async (data: {
    vehicleType: '2_wheeler' | '3_wheeler' | '4_wheeler';
    vehicleNumber: string;
    pricePerKm: number;
}) => {
    try {
        const payload = {
            vehicleType: data.vehicleType,
            vehicleNumber: data.vehicleNumber,
            pricePerKm: data.pricePerKm,
        };

        const res = await axiosInstance.put("/auth/vehicle-preference", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to save vehicle preference");
    }
};
