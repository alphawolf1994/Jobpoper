import { ActivityIndicator, StyleSheet, View, Modal } from 'react-native';
import React from 'react';
import { Colors } from '../utils';

interface LoaderProps {
  visible?: boolean;
  /** Kept for backwards-compatibility — no longer rendered. */
  message?: string;
  overlay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ visible = true, overlay = true }) => {
  if (!visible) return null;

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  inlineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
