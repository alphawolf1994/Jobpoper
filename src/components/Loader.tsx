import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import { Colors } from '../utils';

//services


const Loader = () => {
  return (
    <View style={styles.overLay}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overLay: {
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 100,
  },
});
