import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import authSlice from './slices/authSlice';
import jobSlice from './slices/jobSlice';
import locationsSlice from './slices/locationsSlice';
import notificationSlice from './slices/notificationSlice';
import verificationSlice from './slices/verificationSlice';
import adminSlice from './slices/adminSlice';
import serviceCategorySlice from './slices/serviceCategorySlice';
import businessCategorySlice from './slices/businessCategorySlice';
import orderSlice from './slices/orderSlice';
import jobVerificationSlice from './slices/jobVerificationSlice';
import reportSlice from './slices/reportSlice';
import referralSlice from './slices/referralSlice';
import { authMiddleware } from './middleware/authMiddleware';

// Configuration for redux-persist
const persistConfig = {
  key: 'root', // Root key for storage
  storage: AsyncStorage, // Use AsyncStorage as storage
  version: 1,
  // whitelist: ['auth'], // Only persist the auth state
  // Referral list/count must be fresh on every visit (the code itself lives
  // in auth.user), so exclude the referral slice from persistence.
  blacklist: ['referral'],
  migrate: async (state: any) => {
    // verification.loading → statusLoading + submitting
    if (state?.verification) {
      const v = state.verification;
      if (v.submitting === undefined || v.statusLoading === undefined) {
        state.verification = {
          ...v,
          statusLoading: false,
          submitting: false,
        };
        delete state.verification.loading;
      } else {
        // Never rehydrate a stuck in-flight submit/status flag
        state.verification.submitting = false;
        state.verification.statusLoading = false;
      }
    }
    return state;
  },
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  job: jobSlice,
  locations: locationsSlice,
  notification: notificationSlice,
  verification: verificationSlice,
  admin: adminSlice,
  serviceCategories: serviceCategorySlice,
  businessCategories: businessCategorySlice,
  order: orderSlice,
  jobVerification: jobVerificationSlice,
  report: reportSlice,
  referral: referralSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid serialization issues with redux-persist
    }).concat(authMiddleware),
});

// Persistor instance
export const persistor = persistStore(store);

// Define types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
