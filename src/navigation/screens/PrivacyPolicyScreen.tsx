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
            <Text style={styles.headerSubtitle}>Effective Date: 18 July 2026</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          <Text style={styles.introText}>
            App Crafters ("we", "us", "our") operates the Make My Task mobile application (the "Platform"). This Privacy Policy explains how we collect, use, share, and protect your personal information when you use the Platform.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.bulletPoint}>• Name</Text>
            <Text style={styles.bulletPoint}>• Mobile number</Text>
            <Text style={styles.bulletPoint}>• Email address</Text>
            <Text style={styles.bulletPoint}>• Profile details</Text>
            <Text style={styles.bulletPoint}>• Profile photographs</Text>
            <Text style={styles.bulletPoint}>• Device information</Text>
            <Text style={styles.bulletPoint}>• IP address</Text>
            <Text style={styles.bulletPoint}>• Location (only with permission)</Text>
            <Text style={styles.bulletPoint}>• Usage analytics</Text>
            <Text style={styles.bulletPoint}>• Communications through the Platform</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Information</Text>
            <Text style={styles.bulletPoint}>• Create and manage accounts</Text>
            <Text style={styles.bulletPoint}>• Facilitate connections between users and workers</Text>
            <Text style={styles.bulletPoint}>• Improve services</Text>
            <Text style={styles.bulletPoint}>• Enhance security</Text>
            <Text style={styles.bulletPoint}>• Prevent fraud</Text>
            <Text style={styles.bulletPoint}>• Respond to customer support requests</Text>
            <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Data Sharing</Text>
            <Text style={styles.sectionText}>
              We may share information:
            </Text>
            <Text style={styles.bulletPoint}>• With service providers supporting our Platform.</Text>
            <Text style={styles.bulletPoint}>• When required by law.</Text>
            <Text style={styles.bulletPoint}>• To protect legal rights.</Text>
            <Text style={styles.bulletPoint}>• During business restructuring or acquisition.</Text>
            <Text style={styles.sectionText}>
              We do not sell users' personal information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.sectionText}>
              We implement reasonable technical and organisational measures to protect personal information. However, no electronic system is completely secure.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. User Rights</Text>
            <Text style={styles.sectionText}>
              Users may request to:
            </Text>
            <Text style={styles.bulletPoint}>• Access their personal information.</Text>
            <Text style={styles.bulletPoint}>• Correct inaccurate information.</Text>
            <Text style={styles.bulletPoint}>• Delete their account, subject to legal retention requirements.</Text>
            <Text style={styles.bulletPoint}>• Withdraw consent where applicable.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
            <Text style={styles.sectionText}>
              The Platform is intended for persons aged 18 years or older.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Policy Updates</Text>
            <Text style={styles.sectionText}>
              App Crafters may revise this Privacy Policy periodically. Continued use of the Platform after updates constitutes acceptance of the revised policy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about this Privacy Policy, please contact us at:
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
