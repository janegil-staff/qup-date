import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import theme from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function GlassBackground({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={theme.gradients.background}
        style={styles.gradient}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
});
