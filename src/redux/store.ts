import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import schoolsReducer from './slices/schoolsSlice';
import filterSchoolSlice from './slices/filterSchoolSlice';
import authSlice from './slices/authSlice';
import schoolDetailSlice from './slices/schoolDetailSlice';
import reviewSlice from './slices/reviewSlice';
import favoriteSlice from './slices/favoriteSlice';
import enrollmentSlice from './slices/enrollmentSlice';
import walletSlice from './slices/walletSlice';
import studentSlice from './slices/studentSlice';
import teacherSlice from './slices/teacherSlice';
import StaffSlice from './slices/StaffSlice';
import DepartmentSlice from './slices/DepartmentSlice';
import loanSlice from './slices/loanSlice';
import ERPDashboardSlice from './slices/ERPDashboardSlice'; 
import paymentMethodSlice from './slices/paymentMethodSlice';

// Configuration for redux-persist
const persistConfig = {
  key: 'root', // Root key for storage
  storage: AsyncStorage, // Use AsyncStorage as storage
  // whitelist: ['auth'], // Only persist the auth state
};

// Combine reducers
const rootReducer = combineReducers({
  schoolsSlice: schoolsReducer,
  filterSchoolSlice: filterSchoolSlice,
  auth:  authSlice,
  schoolDetailSlice:schoolDetailSlice,
  reviewSlice:reviewSlice,
  favoriteSlice:favoriteSlice,
  enrollmentSlice:enrollmentSlice,
  walletSlice:walletSlice,
  studentSlice:studentSlice,
  teacherSlice:teacherSlice,
  StaffSlice:StaffSlice,
  DepartmentSlice:DepartmentSlice,
  loanSlice:loanSlice,
  ERPDashboardSlice:ERPDashboardSlice,
  paymentMethodSlice:paymentMethodSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid serialization issues with redux-persist
    }),
});

// Persistor instance
export const persistor = persistStore(store);

// Define types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
