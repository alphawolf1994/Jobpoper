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
            <Text style={styles.headerSubtitle}>Last updated: December 2025</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          <Text style={styles.introText}>
            Welcome to JobPoper! These Terms and Conditions govern your use of our mobile application and services. By using JobPoper, you agree to be bound by these terms.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing or using JobPoper, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Description of Service</Text>
            <Text style={styles.sectionText}>
              JobPoper is a platform that connects job seekers with job providers. We facilitate the posting of job opportunities, job applications, and communication between users. We do not guarantee employment or job placement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.sectionText}>
              To use certain features of JobPoper, you must create an account. You agree to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide accurate, current, and complete information</Text>
            <Text style={styles.bulletPoint}>• Maintain and update your account information</Text>
            <Text style={styles.bulletPoint}>• Keep your password secure and confidential</Text>
            <Text style={styles.bulletPoint}>• Notify us immediately of any unauthorized use</Text>
            <Text style={styles.bulletPoint}>• Be responsible for all activities under your account</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. User Conduct</Text>
            <Text style={styles.sectionText}>
              You agree not to:
            </Text>
            <Text style={styles.bulletPoint}>• Post false, misleading, or fraudulent information</Text>
            <Text style={styles.bulletPoint}>• Harass, abuse, or harm other users</Text>
            <Text style={styles.bulletPoint}>• Violate any applicable laws or regulations</Text>
            <Text style={styles.bulletPoint}>• Use the service for any illegal purpose</Text>
            <Text style={styles.bulletPoint}>• Interfere with or disrupt the service</Text>
            <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to the platform</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Job Postings and Applications</Text>
            <Text style={styles.sectionText}>
              Job providers are responsible for the accuracy of their job postings. Job seekers are responsible for the accuracy of their applications. JobPoper is not responsible for the outcome of any job application or hiring decision.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Payment Terms</Text>
            <Text style={styles.sectionText}>
              Some features of JobPoper may require payment. All fees are non-refundable unless otherwise stated. You agree to pay all charges associated with your use of paid features.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
            <Text style={styles.sectionText}>
              All content, features, and functionality of JobPoper are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our permission.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              JobPoper is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to direct, indirect, incidental, or consequential damages.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Termination</Text>
            <Text style={styles.sectionText}>
              We reserve the right to terminate or suspend your account and access to the service at any time, with or without cause or notice, for any reason including violation of these terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes. Your continued use of the service after changes constitutes acceptance of the new terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Dispute Resolution</Text>
            <Text style={styles.sectionText}>
              Any disputes arising from these terms or your use of JobPoper shall be resolved through binding arbitration in accordance with applicable laws, except where prohibited by law.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Contact Information</Text>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms and Conditions, please contact us at:
            </Text>
            <Text style={styles.contactText}>Email: legal@jobpoper.com</Text>
            <Text style={styles.contactText}>Phone: +1 (555) 123-4567</Text>
            <Text style={styles.contactText}>Address: 123 Job Street, City, State 12345</Text>
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

