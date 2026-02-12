import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';

export default function SafeBottomView({ height, style }) {
  // Calculate tab bar height based on platform
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 113; // Android has more padding
  
  return (
    <View 
      style={[
        styles.spacer, 
        { height: height || tabBarHeight },
        style
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  spacer: {
    width: '100%',
  },
});

// Export the tab bar height constant for manual use
export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 113;
