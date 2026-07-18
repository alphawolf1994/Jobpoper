import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.container}>
      <Header />

      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Terms & Conditions</Text>
            <Text style={styles.headerSubtitle}>Effective Date: 18 July 2026</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          <Text style={styles.introText}>
            These Terms and Conditions ("Terms") govern the access to and use of the Make My Task website, mobile applications, and related services ("Platform"), owned and operated by App Crafters, having its registered office at Vijayawada, Andhra Pradesh, India.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing or using the Platform, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms. If you do not agree with any part of these Terms, you must discontinue using the Platform immediately.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. About Make My Task</Text>
            <Text style={styles.sectionText}>
              Make My Task is a technology platform that enables users to discover and connect with independent workers, skilled professionals, delivery partners, and service providers across multiple service categories. The Platform only facilitates communication between users.
            </Text>
            <Text style={styles.sectionText}>Make My Task does not:</Text>
            <Text style={styles.bulletPoint}>• Employ workers</Text>
            <Text style={styles.bulletPoint}>• Act as an employer</Text>
            <Text style={styles.bulletPoint}>• Act as an agent</Text>
            <Text style={styles.bulletPoint}>• Act as a contractor</Text>
            <Text style={styles.bulletPoint}>• Act as an aggregator</Text>
            <Text style={styles.bulletPoint}>• Manage or supervise services</Text>
            <Text style={styles.bulletPoint}>• Collect customer payments</Text>
            <Text style={styles.bulletPoint}>• Hold money in escrow</Text>
            <Text style={styles.bulletPoint}>• Guarantee service quality</Text>
            <Text style={styles.bulletPoint}>• Guarantee completion of any task</Text>
            <Text style={styles.bulletPoint}>• Provide insurance</Text>
            <Text style={styles.bulletPoint}>• Verify every statement made by users or workers</Text>
            <Text style={styles.sectionText}>
              Any agreement entered into is solely between the customer and the worker.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Eligibility</Text>
            <Text style={styles.sectionText}>Users must:</Text>
            <Text style={styles.bulletPoint}>• Be at least 18 years of age</Text>
            <Text style={styles.bulletPoint}>• Be legally capable of entering into contracts</Text>
            <Text style={styles.bulletPoint}>• Provide accurate information</Text>
            <Text style={styles.bulletPoint}>• Maintain updated profile details</Text>
            <Text style={styles.bulletPoint}>• Use the Platform only for lawful purposes</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. User Accounts</Text>
            <Text style={styles.sectionText}>Users are responsible for:</Text>
            <Text style={styles.bulletPoint}>• Maintaining account confidentiality</Text>
            <Text style={styles.bulletPoint}>• Keeping passwords secure</Text>
            <Text style={styles.bulletPoint}>• Updating profile information</Text>
            <Text style={styles.bulletPoint}>• Preventing unauthorized access</Text>
            <Text style={styles.bulletPoint}>• Reporting suspicious activities immediately</Text>
            <Text style={styles.sectionText}>
              App Crafters reserves the right to suspend or terminate any account violating these Terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Platform Services</Text>
            <Text style={styles.sectionText}>The Platform allows users to:</Text>
            <Text style={styles.bulletPoint}>• Post tasks</Text>
            <Text style={styles.bulletPoint}>• Search for workers</Text>
            <Text style={styles.bulletPoint}>• Connect with professionals</Text>
            <Text style={styles.bulletPoint}>• Request quotations</Text>
            <Text style={styles.bulletPoint}>• Communicate regarding work</Text>
            <Text style={styles.bulletPoint}>
              • Access multiple service categories including home services, deliveries, pickups, transportation, repairs, cleaning, technical services, and other categories made available on the Platform
            </Text>
            <Text style={styles.sectionText}>
              The Platform only enables introductions and does not participate in service execution.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Independent Relationship</Text>
            <Text style={styles.sectionText}>
              Workers listed on Make My Task are independent individuals or businesses. Nothing contained in these Terms shall create:
            </Text>
            <Text style={styles.bulletPoint}>• Employment</Text>
            <Text style={styles.bulletPoint}>• Partnership</Text>
            <Text style={styles.bulletPoint}>• Joint venture</Text>
            <Text style={styles.bulletPoint}>• Agency</Text>
            <Text style={styles.bulletPoint}>• Franchise</Text>
            <Text style={styles.bulletPoint}>• Employer-employee relationship</Text>
            <Text style={styles.sectionText}>
              Workers operate entirely at their own risk and responsibility.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Payments</Text>
            <Text style={styles.sectionText}>
              Make My Task does not collect, process, receive, store, or distribute payments between users and workers. All financial transactions are conducted directly between the parties.
            </Text>
            <Text style={styles.sectionText}>App Crafters shall not be responsible for:</Text>
            <Text style={styles.bulletPoint}>• Pricing disputes</Text>
            <Text style={styles.bulletPoint}>• Payment defaults</Text>
            <Text style={styles.bulletPoint}>• Delayed payments</Text>
            <Text style={styles.bulletPoint}>• Fraudulent payments</Text>
            <Text style={styles.bulletPoint}>• Refunds</Text>
            <Text style={styles.bulletPoint}>• Chargebacks</Text>
            <Text style={styles.bulletPoint}>• Tax obligations between parties</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. User Responsibilities</Text>
            <Text style={styles.sectionText}>Users agree to:</Text>
            <Text style={styles.bulletPoint}>• Provide accurate task descriptions</Text>
            <Text style={styles.bulletPoint}>• Communicate honestly</Text>
            <Text style={styles.bulletPoint}>• Treat workers respectfully</Text>
            <Text style={styles.bulletPoint}>• Pay agreed amounts directly to workers</Text>
            <Text style={styles.bulletPoint}>• Comply with all applicable laws</Text>
            <Text style={styles.bulletPoint}>• Avoid posting unlawful or prohibited work</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Worker Responsibilities</Text>
            <Text style={styles.sectionText}>Workers agree to:</Text>
            <Text style={styles.bulletPoint}>• Provide truthful profile information</Text>
            <Text style={styles.bulletPoint}>• Possess any required licences or permits</Text>
            <Text style={styles.bulletPoint}>• Deliver services professionally</Text>
            <Text style={styles.bulletPoint}>• Comply with all applicable laws</Text>
            <Text style={styles.bulletPoint}>• Maintain appropriate insurance where required</Text>
            <Text style={styles.bulletPoint}>• Be solely responsible for taxes, registrations, and statutory obligations</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Prohibited Activities</Text>
            <Text style={styles.sectionText}>Users and workers shall not:</Text>
            <Text style={styles.bulletPoint}>• Commit fraud</Text>
            <Text style={styles.bulletPoint}>• Post illegal jobs</Text>
            <Text style={styles.bulletPoint}>• Offer prohibited services</Text>
            <Text style={styles.bulletPoint}>• Upload malicious software</Text>
            <Text style={styles.bulletPoint}>• Harass others</Text>
            <Text style={styles.bulletPoint}>• Impersonate another person</Text>
            <Text style={styles.bulletPoint}>• Share false information</Text>
            <Text style={styles.bulletPoint}>• Violate intellectual property rights</Text>
            <Text style={styles.bulletPoint}>• Promote illegal goods or services</Text>
            <Text style={styles.bulletPoint}>• Use the Platform for money laundering or other unlawful activities</Text>
            <Text style={styles.sectionText}>
              Violation may result in immediate suspension or permanent account termination.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Verification Disclaimer</Text>
            <Text style={styles.sectionText}>
              Although the Platform may offer optional profile verification features, App Crafters does not guarantee the identity, qualifications, background, competence, experience, licences, or credibility of any user or worker. Users must exercise their own judgment before engaging any individual.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              To the maximum extent permitted by law, App Crafters shall not be liable for:
            </Text>
            <Text style={styles.bulletPoint}>• Personal injury</Text>
            <Text style={styles.bulletPoint}>• Death</Text>
            <Text style={styles.bulletPoint}>• Property damage</Text>
            <Text style={styles.bulletPoint}>• Theft</Text>
            <Text style={styles.bulletPoint}>• Loss of income</Text>
            <Text style={styles.bulletPoint}>• Business interruption</Text>
            <Text style={styles.bulletPoint}>• Fraud</Text>
            <Text style={styles.bulletPoint}>• Criminal acts</Text>
            <Text style={styles.bulletPoint}>• Delayed services</Text>
            <Text style={styles.bulletPoint}>• Unsatisfactory workmanship</Text>
            <Text style={styles.bulletPoint}>• Disputes between users</Text>
            <Text style={styles.bulletPoint}>• Consequential, incidental, indirect, or special damages</Text>
            <Text style={styles.sectionText}>
              The Platform is provided on an "as is" and "as available" basis without warranties of any kind.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Indemnity</Text>
            <Text style={styles.sectionText}>
              Users and workers agree to indemnify and hold harmless App Crafters, its directors, employees, affiliates, and representatives against claims, losses, liabilities, damages, costs, and legal expenses arising from their use of the Platform or violation of these Terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>14. Intellectual Property</Text>
            <Text style={styles.sectionText}>
              All software, branding, logos, designs, content, databases, trademarks, and source code of Make My Task remain the exclusive property of App Crafters unless otherwise stated. No content may be copied, reproduced, or distributed without written permission.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>15. Termination</Text>
            <Text style={styles.sectionText}>
              App Crafters may suspend or permanently terminate any account at its sole discretion for violations of these Terms, unlawful activity, fraud, abuse, or misuse of the Platform.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>16. Governing Law</Text>
            <Text style={styles.sectionText}>
              These Terms shall be governed by the laws of India. Subject to applicable law, courts having jurisdiction over Vijayawada, Andhra Pradesh shall have exclusive jurisdiction over disputes arising from these Terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>17. Contact</Text>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms and Conditions, please contact us at:
            </Text>
            <Text style={styles.contactText}>App Crafters</Text>
            <Text style={styles.contactText}>Registered Office: Vijayawada, Andhra Pradesh, India</Text>
            <Text style={styles.contactText}>Email: contact@appcrafters.org</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  contentSection: {
    paddingTop: 8,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.black,
    marginBottom: 24,
    textAlign: 'justify',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'justify',
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.black,
    marginBottom: 8,
    paddingLeft: 16,
    textAlign: 'justify',
  },
  contactText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
});
