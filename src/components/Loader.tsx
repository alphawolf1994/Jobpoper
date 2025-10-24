import {ActivityIndicator, StyleSheet, View, Text, Modal} from 'react-native';
import React from 'react';
import { Colors } from '../utils';

interface LoaderProps {
  visible?: boolean;
  message?: string;
  overlay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  visible = true, 
  message = "Loading...", 
  overlay = true 
}) => {
  if (!visible) return null;

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
    fontWeight: '500',
  },
});
