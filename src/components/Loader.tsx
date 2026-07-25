import { ActivityIndicator, StyleSheet, View, Modal } from 'react-native';
import React from 'react';
import { Colors } from '../utils';

interface LoaderProps {
  visible?: boolean;
  /** Kept for backwards-compatibility — no longer rendered. */
  message?: string;
  overlay?: boolean;
}

/**
 * IMPORTANT: always keep the Modal mounted and toggle via `visible`.
 * Returning `null` while the Modal was open unmounts it without a proper
 * dismiss, which on iOS Simulator can leave a permanent transparent overlay
 * (looks like a stuck loader). This is especially visible on flows that
 * flip loading true→false→true quickly (e.g. profile + professional save).
 */
const Loader: React.FC<LoaderProps> = ({ visible = true, overlay = true }) => {
  if (overlay) {
    return (
      <Modal transparent visible={!!visible} animationType="fade" statusBarTranslucent>
        <View style={styles.overlay} pointerEvents={visible ? 'auto' : 'none'}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </Modal>
    );
  }

  if (!visible) return null;

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
