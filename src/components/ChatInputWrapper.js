import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';

/**
 * ChatInputWrapper - Wraps ChatInputBar with proper spacing
 * Handles emoji picker positioning and Android system bar spacing
 */
export default function ChatInputWrapper({ children, showEmojiPicker }) {
  return (
    <View style={[
      styles.wrapper,
      Platform.OS === 'android' && styles.androidPadding
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },
  androidPadding: {
    paddingBottom: 16, // Space for Android system bar
  },
});
