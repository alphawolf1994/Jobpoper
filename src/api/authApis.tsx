import { axiosInstance, erpAuthInstance } from "./axiosInstance";
import { cryptoUtils } from "../utils/crypto";

// Register User - Updated to use new API structure
export const registerUserApi = async (userData: any) => {
    try {
        const payload = {
            enrolledAs: userData.enrolledAs,
            fullName: userData.name,
            emailId: userData.email,
            password: cryptoUtils.encryptPassword(userData.password),
            browser: "ANDROID",
            device: "mobile"
        };

        const res = await erpAuthInstance.post("/signup", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

// Login User - Updated to use new API structure
export const loginUserApi = async (credentials: any) => {
    try {
        const payload = {
            emailId: credentials.email,
            password: cryptoUtils.encryptPassword(credentials.password),
            browser: "ANDROID",
            device: "mobile"
        };
console.log("Login payload:", payload);
        const res = await erpAuthInstance.post("/login", payload);
        console.log("Login response:", res.data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

// Logout User - Updated to use new API structure
export const logoutUserApi = async (tokenData: { token: string; loginOn: string; userId: string }) => {
    try {
        const payload = {
            loginOn: tokenData.loginOn,
            userId: tokenData.userId,
            browser: "ANDROID",
            device: "mobile"
        };

        // Create a custom config with the token data and Authorization header
        const config = {
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "origin": "http://13.201.161.9:8093",
                "requestfrom": "SHLYAPP",
                "Authorization": `Bearer ${tokenData.token}`,
                "token": tokenData.token,
                "loginOn": tokenData.loginOn,
                "userId": tokenData.userId
            }
        };

        const response = await erpAuthInstance.post("/logout", payload, config);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Logout failed");
    }
};

// Token Refresh API
export const refreshTokenApi = async (tokenData: { token: string; loginOn: string; userId: string }) => {
    try {
        // Create a custom config with the token data
        const config = {
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "origin": "http://13.201.161.9:8093",
                "requestfrom": "SHLYAPP",
                "Authorization": `Bearer ${tokenData.token}`,
                "token": tokenData.token,
                "loginOn": tokenData.loginOn,
                "userId": tokenData.userId
            }
        };
        
        const response = await erpAuthInstance.post("/api/refresh", {}, config);
        console.log("refreshTokenApi response",response.data)
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Token refresh failed");
    }
};

// Add Role API - Add additional roles to existing user
export const addRoleApi = async (roleData: { emailId: string; roles: string[] }) => {
    try {
        const payload = {
            emailId: roleData.emailId,
            roles: roleData.roles,
            browser: "ANDROID",
            device: "mobile"
        };

        // Create a custom config with the token data and Authorization header
        const config = {
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "origin": "http://13.201.161.9:8093",
                "requestfrom": "SHLYAPP"
            }
        };

        const response = await erpAuthInstance.post("/add/role", payload, config);
        return response.data;
    } catch (error: any) {
        // Handle 406 status code (role already exists) as a successful response
        if (error?.response?.status === 406) {
            return error.response.data;
        }
        throw new Error(error?.response?.data?.message || "Failed to add role");
    }
};

// Fetch User Profile
export const fetchUserApi = async () => {
    try {
        const res = await axiosInstance.get("/user/profile");
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

// sendOTP
export const sendOTP = async (email: any) => {
  try {
      const res = await axiosInstance.post("/user/send-otp", email, {
          withCredentials: true,
      });
      return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};

// sendOTP
export const verifyOPTData = async (data: any) => {
    try {
      
        const res = await axiosInstance.post("/user/verify-otp", data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "OTP verification failed");
    }
  };

  // sendOTP
export const forgotPasswordData = async (data: any) => {
    try {
        const res = await axiosInstance.post("/user/forgot-password", data);
     
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "OTP verification failed");
    }
  };

  // Fetch Busness Vendor Transporter
export const fetchTransporterApi = async () => {
  try {
      const res = await axiosInstance.get("/user/business-vendors/transporter", {
          withCredentials: true,
      });
      return res.data;
  } catch (error: any) {
      throw error;
  }
};
 // Fetch Busness Vendor Uniform Supplier
 export const fetchUniformSupplierApi = async () => {
  try {
      const res = await axiosInstance.get("/user/business-vendors/uniform supplier", {
          withCredentials: true,
      });
      return res.data;
  } catch (error: any) {
      throw error;
  }
};

 // Fetch Busness Vendor Micro finance
 export const fetchMicroFinanceApi = async () => {
  try {
      const res = await axiosInstance.get("/user/business-vendors/micro financer", {
          withCredentials: true,
      });
      return res.data;
  } catch (error: any) {
      throw error;
  }
};

 // Fetch Busness Vendor Stationary seller
 export const fetchStatuionarySellerApi = async () => {
  try {
      const res = await axiosInstance.get("/user/business-vendors/stationery seller", {
          withCredentials: true,
      });
      return res.data;
  } catch (error: any) {
      throw error;
  }
};

// get user by Id
export const getUserByIdApi = async (id: any) => {
    try {
        const res = await axiosInstance.get(`/user/${id}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};
// update User profile
export const updateUserProfileApi = async (data: any) => {
    try {
        const res = await axiosInstance.put("/user/update-profile", data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Profile update failed");
    }
}

