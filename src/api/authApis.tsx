import { axiosInstance } from "./axiosInstance";

type SendVerificationPurpose = "signup" | "reset-pin";

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
    dateOfBirth?: string;
    profileImage?: string;
}) => {
    try {
        // Build multipart form data
        const formData = new FormData();
        formData.append("fullName", profileData.fullName);
        formData.append("email", profileData.email);
        if (profileData.location) formData.append("location", profileData.location);
        if (profileData.latitude != null) formData.append("latitude", String(profileData.latitude));
        if (profileData.longitude != null) formData.append("longitude", String(profileData.longitude));
        if (profileData.dateOfBirth) formData.append("dateOfBirth", profileData.dateOfBirth);

        // Append image if provided (React Native file object)
        if (profileData.profileImage) {
            const uri = profileData.profileImage;
            const inferredName = uri.split("/").pop() || "profile.jpg";
            // Basic mime inference by extension; backend should also validate
            const ext = inferredName.split(".").pop()?.toLowerCase();
            const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "heic" ? "image/heic" : "image/jpeg";
            formData.append("profileImage", { uri, name: inferredName, type: mime } as unknown as Blob);
        }

        const res = await axiosInstance.put("/auth/complete-profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Profile completion failed");
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
        const formData = new FormData();

        const selfieName = verificationData.selfieUri.split("/").pop() || "selfie.jpg";
        const selfieExt = selfieName.split(".").pop()?.toLowerCase();
        const selfieType =
            selfieExt === "png"
                ? "image/png"
                : selfieExt === "webp"
                ? "image/webp"
                : selfieExt === "heic"
                ? "image/heic"
                : "image/jpeg";

        const photoIdName = verificationData.photoIdUri.split("/").pop() || "photo-id.jpg";
        const photoIdExt = photoIdName.split(".").pop()?.toLowerCase();
        const photoIdType =
            photoIdExt === "png"
                ? "image/png"
                : photoIdExt === "webp"
                ? "image/webp"
                : photoIdExt === "heic"
                ? "image/heic"
                : "image/jpeg";

        formData.append("selfie", {
            uri: verificationData.selfieUri,
            name: selfieName,
            type: selfieType,
        } as unknown as Blob);

        formData.append("photoId", {
            uri: verificationData.photoIdUri,
            name: photoIdName,
            type: photoIdType,
        } as unknown as Blob);

        const res = await axiosInstance.put("/auth/verification-documents", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to submit verification documents");
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
