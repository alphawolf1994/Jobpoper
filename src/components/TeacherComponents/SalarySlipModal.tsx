import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


interface SalarySlipModalProps {
  visible: boolean;
  onClose: () => void;
  slipData:  any | null;
}

const SalarySlipModal: React.FC<SalarySlipModalProps> = ({ visible, onClose, slipData }) => {
  if (!slipData) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Salary Slip - {slipData.month}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {/* Company Info */}
            <View style={styles.companySection}>
              <Text style={styles.companyName}>Bravo School</Text>
              <Text style={styles.companyAddress}>123 Business Street, City, Country</Text>
              <Text style={styles.companyContact}>Phone: (123) 456-7890 | Email: hr@company.com</Text>
            </View>

            {/* Employee Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Employee ID:</Text>
                  <Text style={styles.infoValue}>EMP12345</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Payment Date:</Text>
                  <Text style={styles.infoValue}>{slipData.paymentDate || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Employee Name:</Text>
                  <Text style={styles.infoValue}>John Doe</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Bank Account:</Text>
                  <Text style={styles.infoValue}>******7890</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Department:</Text>
                  <Text style={styles.infoValue}>Engineering</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Pay Period:</Text>
                  <Text style={styles.infoValue}>1st - 30th {slipData.month}</Text>
                </View>
              </View>
            </View>

            {/* Salary Breakdown */}
            <View style={styles.salarySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Earnings</Text>
              </View>
              
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Basic Salary</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(slipData.basicSalary)}</Text>
              </View>
              
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Allowances</Text>
                <Text style={[styles.breakdownValue, styles.positiveAmount]}>
                  +{formatCurrency(slipData.allowances)}
                </Text>
              </View>
              
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Deductions</Text>
              </View>
              
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Tax</Text>
                <Text style={[styles.breakdownValue, styles.negativeAmount]}>
                  -{formatCurrency(slipData.deductions * 0.6)}
                </Text>
              </View>
              
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Insurance</Text>
                <Text style={[styles.breakdownValue, styles.negativeAmount]}>
                  -{formatCurrency(slipData.deductions * 0.4)}
                </Text>
              </View>
            </View>

            {/* Summary */}
            <View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Gross Salary</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(slipData.basicSalary + slipData.allowances)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Deductions</Text>
                <Text style={[styles.summaryValue, styles.negativeAmount]}>
                  -{formatCurrency(slipData.deductions)}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.netSalaryRow]}>
                <Text style={[styles.summaryLabel, styles.netSalaryLabel]}>Net Salary</Text>
                <Text style={[styles.summaryValue, styles.netSalaryValue]}>
                  {formatCurrency(slipData.netSalary)}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footerSection}>
              <Text style={styles.footerText}>This is computer generated document and does not require signature</Text>
              <Text style={styles.footerNote}>Thank you for your hard work!</Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.printButton} onPress={() => console.log('Print')}>
              <MaterialIcons name="print" size={20} color="#fff" />
              <Text style={styles.printButtonText}>Print</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton} onPress={() => console.log('Download')}>
              <MaterialIcons name="download" size={20} color="#fff" />
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};
const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      maxHeight: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      backgroundColor: '#f9f9f9',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    modalContent: {
      padding: 20,
    },
    companySection: {
      marginBottom: 20,
      alignItems: 'center',
    },
    companyName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    companyAddress: {
      fontSize: 12,
      color: '#666',
      marginBottom: 3,
    },
    companyContact: {
      fontSize: 12,
      color: '#666',
    },
    infoSection: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    infoColumn: {
      width: '48%',
    },
    infoLabel: {
      fontSize: 12,
      color: '#666',
      marginBottom: 3,
    },
    infoValue: {
      fontSize: 13,
      fontWeight: '500',
      color: '#333',
    },
    salarySection: {
      marginBottom: 20,
    },
    sectionHeader: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#444',
      textTransform: 'uppercase',
    },
    breakdownRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    breakdownLabel: {
      fontSize: 13,
      color: '#555',
    },
    breakdownValue: {
      fontSize: 13,
      fontWeight: '500',
    },
    positiveAmount: {
      color: '#2e7d32', // Green for positive amounts
    },
    negativeAmount: {
      color: '#c62828', // Red for negative amounts
    },
    sumarySection: {
      marginTop: 15,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: '#555',
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '500',
    },
    netSalaryRow: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    netSalaryLabel: {
      fontWeight: 'bold',
      fontSize: 15,
      color: '#333',
    },
    netSalaryValue: {
      fontWeight: 'bold',
      fontSize: 15,
      color: '#2e7d32',
    },
    footerSection: {
      marginTop: 20,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#eee',
      alignItems: 'center',
    },
    footerText: {
      fontSize: 11,
      color: '#999',
      textAlign: 'center',
      marginBottom: 5,
    },
    footerNote: {
      fontSize: 12,
      color: '#666',
      fontStyle: 'italic',
    },
    actionButtons: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    printButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#1976d2',
    },
    downloadButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#388e3c',
    },
    printButtonText: {
      color: '#fff',
      marginLeft: 8,
      fontWeight: '500',
    },
    downloadButtonText: {
      color: '#fff',
      marginLeft: 8,
      fontWeight: '500',
    },
  });
export default SalarySlipModal;