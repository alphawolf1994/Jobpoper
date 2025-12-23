import { axiosInstance } from "./axiosInstance";

// Send Phone Verification Code
export const sendPhoneVerificationApi = async (phoneNumber: string) => {
    try {
        const payload = {
            phoneNumber: phoneNumber
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
    dateOfBirth?: string;
    profileImage?: string;
}) => {
    try {
        // Build multipart form data
        const formData = new FormData();
        formData.append("fullName", profileData.fullName);
        formData.append("email", profileData.email);
        if (profileData.location) formData.append("location", profileData.location);
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
    try {
        // Since the backend doesn't have a specific logout endpoint,
        // we'll just clear the token on the client side
        return { status: "success", message: "Logged out successfully" };
    } catch (error: any) {
        throw new Error("Logout failed");
    }
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

// Forgot Password - Send OTP
export const sendForgotPasswordOtpApi = async (phoneNumber: string) => {
    try {
        const payload = {
            phoneNumber: phoneNumber
        };

        const res = await axiosInstance.post("/auth/forgot-password/send-otp", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to send OTP");
    }
};

// Forgot Password - Verify OTP
export const verifyForgotPasswordOtpApi = async (phoneNumber: string, verificationCode: string) => {
    try {
        const payload = {
            phoneNumber: phoneNumber,
            verificationCode: verificationCode
        };

        const res = await axiosInstance.post("/auth/forgot-password/verify-otp", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "OTP verification failed");
    }
};

// Forgot Password - Reset PIN
export const resetPinApi = async (newPin: string, resetToken: string) => {
    try {
        const payload = {
            newPin: newPin
        };

        const res = await axiosInstance.post("/auth/forgot-password/reset-pin", payload, {
            headers: {
                Authorization: `Bearer ${resetToken}`
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to reset PIN");
    }
};

