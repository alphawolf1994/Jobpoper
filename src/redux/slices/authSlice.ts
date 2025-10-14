import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserApi, logoutUserApi, registerUserApi, fetchUserApi,sendOTP, verifyOPTData, forgotPasswordData, fetchTransporterApi, fetchUniformSupplierApi, fetchMicroFinanceApi, fetchStatuionarySellerApi, getUserByIdApi, updateUserProfileApi, refreshTokenApi, addRoleApi } from "../../api/authApis";

export interface ProviderItem {
  id: string;
  organizationName: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}
interface AuthState {
  user: any | null;
  businessProvider: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessToken:string|null;
  refreshToken:string|null;
  otpResponse:string|null;
  myEmail:string|null;
  schoolId:string|null;
  busnessVendortransporters:ProviderItem[]
  businessVendorUniformSuppliers:ProviderItem[]
  businessVendorMicroFinancers:ProviderItem[]
  businessVendorStationarySeller:ProviderItem[]
  // New fields for user roles and login data
  userRoles: string[] | null;
  loginOn: string | null;
  userId: string | null;
  selectedRole: string | null;
}

const initialState: AuthState = {
  user: null,
  businessProvider:null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken:null,
  refreshToken:null,
  otpResponse:null,
  myEmail:null,
  schoolId:null,
  busnessVendortransporters:[],
  businessVendorUniformSuppliers:[],
  businessVendorMicroFinancers:[],
  businessVendorStationarySeller:[],
  // New fields initialization
  userRoles: null,
  loginOn: null,
  userId: null,
  selectedRole: null,
};
// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: { name: string; email: string; password: string; enrolledAs: string }, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Registration failed");
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const tokenData = {
        token: state.auth.accessToken,
        loginOn: state.auth.loginOn,
        userId: state.auth.userId
      };
      await logoutUserApi(tokenData);
      return null;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Logout failed");
    }
  }
);

// Async thunk for token refresh
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (tokenData: { token: string; loginOn: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await refreshTokenApi(tokenData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Token refresh failed");
    }
  }
);

// Async thunk for adding roles
export const addRole = createAsyncThunk(
  "auth/addRole",
  async (roleData: { emailId: string; roles: string[] }, { rejectWithValue }) => {
    try {
      const response = await addRoleApi(roleData);
    
      return response;
    } catch (error: any) {
      console.log("reddrrr",error?.message)
      return rejectWithValue(error?.message || "Failed to add role");
    }
  }
);

// Fetch User Profile
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {

      const response = await fetchUserApi();

      return response.data;
     
    } catch (error: any) {
      console.log("reddrrr",error?.message)
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);
// Async thunk for user login
export const sendOPTData = createAsyncThunk(
  "user/sendOTP",
  async (email:{email: string}  , { rejectWithValue }) => {
    try {
      const response = await sendOTP(email);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);
// Async thunk for user login
export const verifyOTP = createAsyncThunk(
  "user/verifyOTP",
  async (data:{email: string,otp:string}  , { rejectWithValue }) => {
    try {
      const response = await verifyOPTData(data);
   
      return response.data;
    } catch (error: any) {
 
      return rejectWithValue(error.message || "OTP verification failed1");
    }
  }
);

// Async thunk for user login
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (data:{email: string,newPassword:string}  , { rejectWithValue }) => {
    try {
      const response = await forgotPasswordData(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "forgot Password  failed");
    }
  }
);
// Busness VendorTransporter
export const fetchBusnessVendorTransporter = createAsyncThunk(
  "auth/fetchTransporter",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTransporterApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);
// Busness Vendor Uniform Supplier
export const fetchBusnessVendorUniformSupplier = createAsyncThunk(
  "auth/fetchUniformSupplier",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUniformSupplierApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);

// Busness Vendor MicroFinance
export const fetchBusnessVendorMicroFinance = createAsyncThunk(
  "auth/fetchMicroFinance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMicroFinanceApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);

// Busness Vendor StatuionarySeller
export const fetchBusnessVendorStatuionarySeller = createAsyncThunk(
  "auth/fetchStatuionarySeller",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchStatuionarySellerApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);
// fetch the school subjects
export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (userId:string, { rejectWithValue }) => {
      try {
          const response = await getUserByIdApi(userId);
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch subjects");
      }
  }
);
// update user profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await updateUserProfileApi(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Profile update failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.myEmail = action.payload;
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.selectedRole = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.userRoles = null;
      state.loginOn = null;
      state.userId = null;
      state.selectedRole = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // Handle successful registration response
        if (action.payload.status && action.payload.statusCode === 201) {
          // Registration successful - user needs to login
          state.loading = false;
          state.error = null;
        } else {
          // Registration failed
          state.error = action.payload.message || "Registration failed";
          state.loading = false;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // Handle the new API response structure
        const response = action.payload;
        state.user = response.userDetails;
        state.accessToken = response["x-token"]?.jwtBuilder;
        state.userId = response.userId;
        state.loginOn = response.loginOn?.toString();
        state.userRoles = response.roles || [response.userDetails?.role]; // Store user roles array
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.userRoles = null;
        state.loginOn = null;
        state.userId = null;
        state.selectedRole = null;
        state.loading = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
     
        state.schoolId=action.payload.schoolId
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(sendOPTData.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOPTData.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(sendOPTData.fulfilled, (state, action) => {
        state.otpResponse=action.payload
        state.loading = false;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchBusnessVendorTransporter.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusnessVendorTransporter.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchBusnessVendorTransporter.fulfilled, (state, action) => {
        state.busnessVendortransporters = action.payload.businessVendors;
        
        state.loading = false;
      })
      .addCase(fetchBusnessVendorUniformSupplier.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusnessVendorUniformSupplier.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchBusnessVendorUniformSupplier.fulfilled, (state, action) => {
        state.businessVendorUniformSuppliers = action.payload.businessVendors;
        state.loading = false;
      })
      .addCase(fetchBusnessVendorMicroFinance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusnessVendorMicroFinance.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchBusnessVendorMicroFinance.fulfilled, (state, action) => {
        state.businessVendorMicroFinancers = action.payload.businessVendors;
        state.loading = false;
      })
      .addCase(fetchBusnessVendorStatuionarySeller.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusnessVendorStatuionarySeller.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchBusnessVendorStatuionarySeller.fulfilled, (state, action) => {
        state.businessVendorStationarySeller = action.payload.businessVendors;
        state.loading = false;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchUserById.fulfilled, (state,action) => {
        state.businessProvider = action.payload.data.user;
        state.loading = false;
        state.error = null;
      })
       .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateUserProfile.fulfilled, (state,action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        // If refresh fails, clear auth state
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.userRoles = null;
        state.loginOn = null;
        state.userId = null;
        state.selectedRole = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        // Update token with new one from refresh response
        state.accessToken = action.payload["x-token"]?.jwtBuilder;
        state.loading = false;
        state.error = null;
      })
      .addCase(addRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        // Update user roles with new roles from response
        if (action.payload.roles) {
          state.userRoles = action.payload.roles;
        }
        state.loading = false;
        state.error = null;
      })
  },
});
// Export the actions
export const { setEmail, setUserRole, clearAuth } = authSlice.actions;
export default authSlice.reducer;
