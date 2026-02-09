import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';

/**
 * IOSKeyboardWrapper - Only adds KeyboardAvoidingView on iOS
 * Android relies on native adjustResize from app.json
 */
export default function IOSKeyboardWrapper({ children, style }) {
  if (Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView 
        style={style || { flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }
  
  // Android - plain View, no keyboard handling
  return (
    <View style={style || { flex: 1 }}>
      {children}
    </View>
  );
}
