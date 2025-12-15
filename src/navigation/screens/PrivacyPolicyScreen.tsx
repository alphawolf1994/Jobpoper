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

const PrivacyPolicyScreen = () => {
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
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <Text style={styles.headerSubtitle}>Last updated: December 2025</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          <Text style={styles.introText}>
            At JobPoper, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information that you provide directly to us, including:
            </Text>
            <Text style={styles.bulletPoint}>• Personal information such as your name, email address, phone number, and profile picture</Text>
            <Text style={styles.bulletPoint}>• Location data to help you find jobs and services in your area</Text>
            <Text style={styles.bulletPoint}>• Job-related information including job postings, applications, and work history</Text>
            <Text style={styles.bulletPoint}>• Payment information when you make transactions through our platform</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use the information we collect to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide, maintain, and improve our services</Text>
            <Text style={styles.bulletPoint}>• Connect job seekers with job providers</Text>
            <Text style={styles.bulletPoint}>• Process transactions and send related information</Text>
            <Text style={styles.bulletPoint}>• Send you technical notices, updates, and support messages</Text>
            <Text style={styles.bulletPoint}>• Respond to your comments, questions, and requests</Text>
            <Text style={styles.bulletPoint}>• Monitor and analyze trends and usage</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Information Sharing and Disclosure</Text>
            <Text style={styles.sectionText}>
              We do not sell your personal information. We may share your information in the following circumstances:
            </Text>
            <Text style={styles.bulletPoint}>• With job providers when you apply for a job or accept a job offer</Text>
            <Text style={styles.bulletPoint}>• With service providers who assist us in operating our platform</Text>
            <Text style={styles.bulletPoint}>• When required by law or to protect our rights</Text>
            <Text style={styles.bulletPoint}>• In connection with a business transfer or merger</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.sectionText}>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.sectionText}>
              You have the right to:
            </Text>
            <Text style={styles.bulletPoint}>• Access and update your personal information</Text>
            <Text style={styles.bulletPoint}>• Delete your account and personal data</Text>
            <Text style={styles.bulletPoint}>• Opt-out of certain communications</Text>
            <Text style={styles.bulletPoint}>• Request a copy of your data</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Location Services</Text>
            <Text style={styles.sectionText}>
              We use location data to provide location-based services such as finding nearby jobs. You can control location permissions through your device settings.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
            <Text style={styles.sectionText}>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
            <Text style={styles.sectionText}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about this Privacy Policy, please contact us at:
            </Text>
            <Text style={styles.contactText}>Email: privacy@jobpoper.com</Text>
            <Text style={styles.contactText}>Phone: +1 (555) 123-4567</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

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

