import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "../../utils";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

import HeadingText from "../HeadingText";

import PerformanceCard from "./PerformanceCard";
interface PerformanceMetric {
    metric: string;
    currentValue: string | number;
    targetValue: string | number;
    performanceStatus: "On Track" | "Needs Improvement";
    lastEvaluated: string;
  }
  
  export const performanceMetrics: PerformanceMetric[] = [
    {
      metric: "Monthly Sales",
      currentValue: "1,50,000",
      targetValue: "2,00,000",
      performanceStatus: "Needs Improvement",
      lastEvaluated: "2025-03-31",
    },
    {
      metric: "Order Fulfillment Rate",
      currentValue: "96%",
      targetValue: "95%",
      performanceStatus: "On Track",
      lastEvaluated: "2025-03-31",
    },
    {
      metric: "Customer Satisfaction",
      currentValue: "4.6 / 5",
      targetValue: "4.5 / 5",
      performanceStatus: "On Track",
      lastEvaluated: "2025-03-30",
    },
    {
      metric: "Delivery Timeliness",
      currentValue: "88%",
      targetValue: "90%",
      performanceStatus: "Needs Improvement",
      lastEvaluated: "2025-03-29",
    },
    {
      metric: "Inventory Turnover",
      currentValue: 6.5,
      targetValue: 7,
      performanceStatus: "Needs Improvement",
      lastEvaluated: "2025-03-28",
    },
  ];
  


const PerformanceTab = () => {
  const renderItem = ({ item }: { item: PerformanceMetric }) => (
    
    <PerformanceCard
    metric={item.metric}
    currentValue={item.currentValue}
    targetValue={item.targetValue}
    performanceStatus={item.performanceStatus}
    lastEvaluated={item.lastEvaluated}

   

  
    />
  );
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
    
    
        <HeadingText text="Performance Analytics" />
       <FlatList
         data={performanceMetrics}
         keyExtractor={(item) => item.metric}
         renderItem={renderItem}

       />
       </KeyboardAvoidingScrollView>
    </View>
  );
};

export default PerformanceTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom:20
  },
});
