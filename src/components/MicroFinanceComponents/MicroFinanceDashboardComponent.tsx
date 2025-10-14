import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import ImagePath from "../../assets/images/ImagePath";
import { Colors, CurrencySign } from "../../utils";

import MicroFinanceHomeCard from "./MicroFinanceHomeCard";
import MicroFinanceFundsSummary from "./MicroFinanceFundsSummary";
import NewLoanRequestsList from "./NewLoanRequestsList";
import LoanRemindersList from "./LoanRemindersList";

const MicroFinanceDashboardComponent = () => {
  return (
    <View style={styles.container}>
      <MicroFinanceFundsSummary />
      <NewLoanRequestsList />
      <LoanRemindersList />
      {/* ...other cards... */}
        {/* <View style={styles.row}>
        <MicroFinanceHomeCard
          title="Total Loan Applications"
          value={"20"}
          color={Colors.SkyBlue}
          icon="file-document"
          iconColor={Colors.primary}
        />
        <MicroFinanceHomeCard
          title="Outstanding Loan Amount"
          value={`${CurrencySign} 200`}
          color={Colors.SkyBlue}
          icon="cash"
          iconColor={Colors.primary}
        />
        <MicroFinanceHomeCard
          title="Repayment Status"
          value={`Paid`}
          color={Colors.SkyBlue}
          icon="checkbox-marked-circle-outline"
          iconColor={Colors.primary}
        />
        <MicroFinanceHomeCard
          title="Customer Credit Score"
          value={`2`}
          color={Colors.SkyBlue}
          icon="account-cash"
          iconColor={Colors.primary}
        />
        <MicroFinanceHomeCard
          title="New Account Openings"
          value={`10`}
          color={Colors.SkyBlue}
          icon="account-plus"
          iconColor={Colors.primary}
        />
        <MicroFinanceHomeCard
          title="Interest Earnings & Profitability"
          value={`${CurrencySign} 200`}
          color={Colors.SkyBlue}
          icon="chart-line"
          iconColor={Colors.primary}
        />
        <MicroFinanceHomeCard
          title="Top Borrowers & Defaulters"
          value={`10`}
          color={Colors.SkyBlue}
          icon="account-alert"
          iconColor={Colors.primary}
        />
        <MicroFinanceHomeCard
          title="Transaction Reports"
          value={`10`}
          color={Colors.SkyBlue}
          icon="file-chart"
          iconColor={Colors.primary}
        />
      </View> */}
    </View>
  );
};

export default MicroFinanceDashboardComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 10,
  },
});
