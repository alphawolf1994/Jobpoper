import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, View } from "react-native";
import bell from "../assets/bell.png";
import newspaper from "../assets/newspaper.png";
import HomeScreen from "./screens/HomeScreen";
import HotJobsScreen from "./screens/HotJobsScreen";
import MyJobsScreen from "./screens/MyJobsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PostJobScreen from "./screens/PostJobScreen";
import JobDetailsScreen from "./screens/JobDetailsScreen";
import { NotFound } from "./screens/NotFound";
import LoginScreen from "./screens/LoginScreen";
import OTPScreen from "./screens/OTPScreen";
import RegisterScreen from "./screens/RegisterScreen";
import CreatePinScreen from "./screens/CreatePinScreen";
import SplashScreen from "./screens/SplashScreen";
import SignupPhoneScreen from "./screens/SignupPhoneScreen";

import IntroScreen from "./screens/IntroScreen";
import BasicProfileScreen from "./screens/BasicProfileScreen"
import PhoneVerificationScreen from "./screens/PhoneVerificationScreen";
// import HomeScreen from "./screens/HomeScreen";

import React from "react";

import { AntDesign, Feather, Fontisto } from "@expo/vector-icons";


import { Colors } from "../utils";





const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const notificationCount=5
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const map: Record<string, string> = {
        Home: "home",
        "Hot Jobs": "fire",
        "My Jobs": "briefcase",
        Profile: "user",
        };
        const iconName = map[route.name] ?? "circle";
        if (iconName === "fire") {
        // Use AntDesign for the "fire" icon without changing top-level imports
        return <Fontisto name="fire" size={size} color={color} />;
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
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator({
  screens: {
    SplashScreen: {
      screen: SplashScreen,
      options: {
        headerShown: false,
      },
    },

    HomeTabs: {
      screen: BottomTabNavigator,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    // Home: {
    //   screen: HomeScreen,
    //   options: {
    //     title: "Home",
    //     headerShown: false,
    //   },
    // },
  
  
    IntroScreen: {
      screen: IntroScreen,
      options: {
        headerShown: false,
      },
    },
    LoginScreen: {
      screen: LoginScreen,
      options: {
        headerShown: false,
      },
    },
    SignupPhoneScreen: {
      screen: SignupPhoneScreen,
      options: {
        headerShown: false,
      },
    },
    Register: {
      screen: RegisterScreen,
      options: {
        headerShown: false,
      },
    },
    PhoneVerificationScreen: {
      screen: PhoneVerificationScreen,
      options: {
        headerShown: false,
      },
    },
    OTP: {
      screen: OTPScreen,
      options: {
        headerShown: false,
      },
    },
    CreatePinScreen: {
      screen: CreatePinScreen,
      options: {
        headerShown: false,
      },
    },
    BasicProfileScreen: {
      screen: BasicProfileScreen,
      options: {
        headerShown: false,
      },
    },
    PostJobScreen: {
      screen: PostJobScreen,
      options: {
        headerShown: false,
      },
    },
    JobDetailsScreen: {
      screen: JobDetailsScreen,
      options: {
        headerShown: false,
      },
    },
   
  
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

// type RootStackParamList = StaticParamList<typeof RootStack>;
type RootStackParamList = {
  // ProfileScreen: undefined; // No params expected
  
};
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

