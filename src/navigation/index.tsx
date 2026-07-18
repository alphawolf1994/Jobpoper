import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import HotJobsScreen from "./screens/HotJobsScreen";
import AllListedJobsScreen from "./screens/AllListedJobsScreen";
import MyJobsScreen from "./screens/MyJobsScreen";
import BusinessTabScreen from "./screens/BusinessTabScreen";
import BusinessDetailScreen from "./screens/BusinessDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UserDetailsScreen from "./screens/UserDetailsScreen";
import VehiclePreferenceScreen from "./screens/VehiclePreferenceScreen";
import ChangePinScreen from "./screens/ChangePinScreen";
import BusinessProfilesScreen from "./screens/BusinessProfilesScreen";
import AddBusinessProfileScreen from "./screens/AddBusinessProfileScreen";
import PostJobScreen from "./screens/PostJobScreen";
import JobDetailsScreen from "./screens/JobDetailsScreen";
import WorkerProfileScreen from "./screens/WorkerProfileScreen";
import { NotFound } from "./screens/NotFound";
import LoginScreen from "./screens/LoginScreen";
import OTPScreen from "./screens/OTPScreen";
import RegisterScreen from "./screens/RegisterScreen";
import CreatePinScreen from "./screens/CreatePinScreen";
import SplashScreen from "./screens/SplashScreen";
import SignupPhoneScreen from "./screens/SignupPhoneScreen";
import ForgotPinScreen from "./screens/ForgotPinScreen";
import VerifyOtpScreen from "./screens/VerifyOtpScreen";
import CreateNewPinScreen from "./screens/CreateNewPinScreen";

import IntroScreen from "./screens/IntroScreen";
import BasicProfileScreen from "./screens/BasicProfileScreen"
import PhoneVerificationScreen from "./screens/PhoneVerificationScreen";

import React from "react";

import { Feather, Fontisto, Ionicons } from "@expo/vector-icons";

import { Colors } from "../utils";

// Location management screens
import ManageLocationsScreen from "./screens/ManageLocationsScreen";
import AddLocationScreen from "./screens/AddLocationScreen";

// Legal screens
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import TermsAndConditionsScreen from "./screens/TermsAndConditionsScreen";
import NotificationScreen from "./screens/NotificationScreen";
import VerificationDetailsScreen from "./screens/VerificationDetailsScreen";
import VerificationSelfieScreen from "./screens/VerificationSelfieScreen";
import VerificationIdScreen from "./screens/VerificationIdScreen";
import VerificationSubmittedScreen from "./screens/VerificationSubmittedScreen";
import OrdersScreen from "./screens/OrdersScreen";

// ─── Admin Screens ─────────────────────────────────────────────────────────────
import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen";
import AdminUsersScreen from "./screens/admin/AdminUsersScreen";
import AdminUserDetailScreen from "./screens/admin/AdminUserDetailScreen";
import AdminJobsScreen from "./screens/admin/AdminJobsScreen";
import AdminJobDetailScreen from "./screens/admin/AdminJobDetailScreen";
import AdminVerificationsScreen from "./screens/admin/AdminVerificationsScreen";
import AdminVerificationDetailScreen from "./screens/admin/AdminVerificationDetailScreen";
import AdminBusinessApprovalsScreen from "./screens/admin/AdminBusinessApprovalsScreen";
import AdminBusinessApprovalDetailScreen from "./screens/admin/AdminBusinessApprovalDetailScreen";

const ADMIN_ACCENT = "#1E40AF";

// ─── User Bottom Tabs ─────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, string> = {
            Home: "home",
            "Hot Jobs": "fire",
            "My Jobs": "briefcase",
            Business: "storefront-outline",
            Profile: "user",
          };
          const iconName = map[route.name] ?? "circle";
          if (iconName === "fire") {
            return <Fontisto name="fire" size={size} color={color} />;
          }
          if (iconName === "storefront-outline") {
            return <Ionicons name="storefront-outline" size={size} color={color} />;
          }
          return <Feather name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Hot Jobs" component={HotJobsScreen} />
      <Tab.Screen name="My Jobs" component={MyJobsScreen} />
      <Tab.Screen name="Business" component={BusinessTabScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// ─── Admin Bottom Tabs ────────────────────────────────────────────────────────
const AdminTab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, string> = {
            AdminDashboardTab: "grid-outline",
            AdminUsersTab: "people-outline",
            AdminJobsTab: "briefcase-outline",
            AdminVerificationsTab: "shield-checkmark-outline",
            AdminBusinessApprovalsTab: "storefront-outline",
          };
          const iconName = iconMap[route.name] ?? "circle-outline";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: ADMIN_ACCENT,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          borderTopColor: "#DBEAFE",
          backgroundColor: Colors.white,
        },
        headerShown: false,
      })}
    >
      <AdminTab.Screen
        name="AdminDashboardTab"
        component={AdminDashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <AdminTab.Screen
        name="AdminUsersTab"
        component={AdminUsersScreen}
        options={{ title: "Users" }}
      />
      <AdminTab.Screen
        name="AdminJobsTab"
        component={AdminJobsScreen}
        options={{ title: "Jobs" }}
      />
      <AdminTab.Screen
        name="AdminVerificationsTab"
        component={AdminVerificationsScreen}
        options={{ title: "Verifications" }}
      />
      <AdminTab.Screen
        name="AdminBusinessApprovalsTab"
        component={AdminBusinessApprovalsScreen}
        options={{ title: "Business" }}
      />
    </AdminTab.Navigator>
  );
};

// ─── Root Stack ───────────────────────────────────────────────────────────────
const RootStack = createNativeStackNavigator({
  screens: {
    SplashScreen: {
      screen: SplashScreen,
      options: { headerShown: false },
    },

    // ── User Tabs ──────────────────────────────────────────────────────────
    HomeTabs: {
      screen: BottomTabNavigator,
      options: {
        title: "Home",
        headerShown: false,
        gestureEnabled: false,
      },
    },

    // ── Admin Tabs ─────────────────────────────────────────────────────────
    AdminTabs: {
      screen: AdminTabNavigator,
      options: {
        headerShown: false,
        gestureEnabled: false,
      },
    },

    // ── Admin Detail Screens (pushed on top of AdminTabs) ──────────────────
    AdminUserDetailScreen: {
      screen: AdminUserDetailScreen,
      options: { headerShown: false },
    },
    AdminJobDetailScreen: {
      screen: AdminJobDetailScreen,
      options: { headerShown: false },
    },
    AdminVerificationDetailScreen: {
      screen: AdminVerificationDetailScreen,
      options: { headerShown: false },
    },
    AdminBusinessApprovalDetailScreen: {
      screen: AdminBusinessApprovalDetailScreen,
      options: { headerShown: false },
    },

    // ── Auth Screens ───────────────────────────────────────────────────────
    IntroScreen: {
      screen: IntroScreen,
      options: { headerShown: false },
    },
    LoginScreen: {
      screen: LoginScreen,
      options: { headerShown: false },
    },
    SignupPhoneScreen: {
      screen: SignupPhoneScreen,
      options: { headerShown: false },
    },
    Register: {
      screen: RegisterScreen,
      options: { headerShown: false },
    },
    PhoneVerificationScreen: {
      screen: PhoneVerificationScreen,
      options: { headerShown: false },
    },
    OTP: {
      screen: OTPScreen,
      options: { headerShown: false },
    },
    CreatePinScreen: {
      screen: CreatePinScreen,
      options: { headerShown: false },
    },
    // ── Forgot-PIN flow ────────────────────────────────────────────────────
    ForgotPinScreen: {
      screen: ForgotPinScreen,
      options: { headerShown: false },
    },
    VerifyOtpScreen: {
      screen: VerifyOtpScreen,
      options: { headerShown: false },
    },
    CreateNewPinScreen: {
      screen: CreateNewPinScreen,
      options: { headerShown: false },
    },
    BasicProfileScreen: {
      screen: BasicProfileScreen,
      options: { headerShown: false },
    },

    // ── Job Screens ────────────────────────────────────────────────────────
    PostJobScreen: {
      screen: PostJobScreen,
      options: { headerShown: false },
    },
    JobDetailsScreen: {
      screen: JobDetailsScreen,
      options: { headerShown: false },
    },
    WorkerProfileScreen: {
      screen: WorkerProfileScreen,
      options: { headerShown: false },
    },
    AllListedJobsScreen: {
      screen: AllListedJobsScreen,
      options: { headerShown: false },
    },
    BusinessDetailScreen: {
      screen: BusinessDetailScreen,
      options: { headerShown: false },
    },

    // ── Profile Management ─────────────────────────────────────────────────
    UserDetailsScreen: {
      screen: UserDetailsScreen,
      options: { headerShown: false },
    },
    VehiclePreferenceScreen: {
      screen: VehiclePreferenceScreen,
      options: { headerShown: false },
    },
    ChangePinScreen: {
      screen: ChangePinScreen,
      options: { headerShown: false },
    },
    BusinessProfilesScreen: {
      screen: BusinessProfilesScreen,
      options: { headerShown: false },
    },
    AddBusinessProfileScreen: {
      screen: AddBusinessProfileScreen,
      options: { headerShown: false },
    },

    // ── Location Management ────────────────────────────────────────────────
    ManageLocationsScreen: {
      screen: ManageLocationsScreen,
      options: { headerShown: false },
    },
    AddLocationScreen: {
      screen: AddLocationScreen,
      options: { headerShown: false },
    },

    // ── Legal Screens ──────────────────────────────────────────────────────
    PrivacyPolicyScreen: {
      screen: PrivacyPolicyScreen,
      options: { headerShown: false },
    },
    TermsAndConditionsScreen: {
      screen: TermsAndConditionsScreen,
      options: { headerShown: false },
    },

    // ── Notification ───────────────────────────────────────────────────────
    NotificationScreen: {
      screen: NotificationScreen,
      options: { headerShown: false },
    },

    // ── Orders (Business owner) ────────────────────────────────────────────
    OrdersScreen: {
      screen: OrdersScreen,
      options: { headerShown: false },
    },

    // ── Verification Flow ──────────────────────────────────────────────────
    VerificationDetailsScreen: {
      screen: VerificationDetailsScreen,
      options: { headerShown: false },
    },
    VerificationSelfieScreen: {
      screen: VerificationSelfieScreen,
      options: { headerShown: false },
    },
    VerificationIdScreen: {
      screen: VerificationIdScreen,
      options: { headerShown: false },
    },
    VerificationSubmittedScreen: {
      screen: VerificationSubmittedScreen,
      options: { headerShown: false },
    },

    NotFound: {
      screen: NotFound,
      options: { title: "404" },
      linking: { path: "*" },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
