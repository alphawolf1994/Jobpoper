import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { Colors, CurrencySign } from "../../utils";
import MainDashboard from "../../navigation/screens/SchoolAdminScreens/MainDashboard";
import TransactionDashboard from "../../navigation/screens/SchoolAdminScreens/TransactionDashboard";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "transactions", label: "Transaction Dashboard" },
  // Add more tabs as needed
];

const SchoolAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Example tab content components
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <MainDashboard />
          </ScrollView>
        );
      case "transactions":
        return (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
           <TransactionDashboard/>
          </ScrollView>
        );
      // Add more cases for other tabs
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerStyles}>
        {/* Custom Tab Bar */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabItem,
                activeTab === tab.key && styles.tabItemActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Tab Content */}
        <View style={{ flex: 1 }}>{renderTabContent()}</View>
      </View>
    </View>
  );
};

export default SchoolAdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerStyles: {
    flex: 1,
    paddingHorizontal: 0,
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabItemActive: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: "500",
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.white,
    paddingBottom: 20,
  },
});
