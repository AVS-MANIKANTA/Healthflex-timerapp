import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import {  responsiveHeight } from 'react-native-responsive-dimensions';

interface ProgressBarProps {
  progress: number; 
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progress, { width: `${progress * 100}%` }]} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: responsiveHeight(1.5),
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50', 
  },
});
